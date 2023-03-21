import {inject, observable} from 'aurelia-framework';

import {EventService} from './event-service';

import * as moment from 'moment';

@inject(EventService)
export class ProgressService {
    @observable progressTracker = 0;

    showProgressHandle;
    hideProgressHandle;
    showProgress;
    progressShown;

    progressDelayMs = 100; // How long to wait for a clear before showing the modal (prevent modal for quick stuff)
    minProgressMs = 500; // How long to leave the progress modal up regardless of clearing

    constructor(private eventService: EventService) {

        this.eventService.subscribe([
            this.eventService.events.routerNavigationProcessing,
            this.eventService.events.httpServiceProcessing
        ], () => this.startProgress());

        this.eventService.subscribe([
            this.eventService.events.routerNavigationComplete,
            this.eventService.events.httpServiceComplete
        ], () => this.stopProgress());
    }

    startProgress(keepAlive = false) {
        this.progressTracker++;
        if (keepAlive) this.eventService.publish(this.eventService.events.updateAutoLogoffTimeout, null);
    }

    stopProgress(stopAll: boolean = false) {
        if (stopAll) this.progressTracker = 0;

        if (this.progressTracker > 1) {
            this.progressTracker--;
        } else {
            this.progressTracker = 0;
        }
    }

    progressTrackerChanged(newValue, oldValue) {
        if (newValue > 0) {
            this.eventService.publish(this.eventService.events.progressServiceProcessing, null);
            this.show();
        } else {
            this.eventService.publish(this.eventService.events.progressServiceComplete, null);
            this.hide();
        }
    }

    show() {
        if (this.hideProgressHandle) {
            window.clearTimeout(this.hideProgressHandle);
            this.hideProgressHandle = null;
        }

        if (!this.showProgress && !this.showProgressHandle) {
            this.showProgressHandle = window.setTimeout(
                () => {
                    this.showProgress = true;
                    this.showProgressHandle = null;
                    this.progressShown = moment();
                },
                this.progressDelayMs);
        }
    }

    hide() {
        if (this.showProgressHandle) {
            window.clearTimeout(this.showProgressHandle);
            this.showProgressHandle = null;
        }

        if (this.showProgress && !this.hideProgressHandle) {
            const now = moment();

            // Make sure the progress has been up for at least 500ms so it doesn't flash and a minimuin of progressDelayMs for debouncing
            const msToWait = Math.max(
                0,
                this.minProgressMs - moment.duration(now.diff(this.progressShown)).asMilliseconds()
            ) + this.progressDelayMs;

            this.hideProgressHandle = window.setTimeout(
                () => {
                    this.showProgress = false;
                    this.hideProgressHandle = null;
                    this.progressShown = null;
                },
                msToWait);
        }
    }
}
