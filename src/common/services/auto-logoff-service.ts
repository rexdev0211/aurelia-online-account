import {Subscription} from "aurelia-event-aggregator";
import {autoinject} from 'aurelia-framework';
import environment from "environment";
import {BaseProperties} from "../../bases/base-properties";
import {AutoLogoffDialog} from "../../resources/elements/authenticated/dialogs/auto-logoff";
import * as _ from 'lodash';

@autoinject
export class AutoLogoffService extends BaseProperties {
    private logoutSubscriptions: Array<Subscription> = [];
    private autoLogoffTimeoutHandle: number;
    private notifyUpdateAutoLogoffTimeout: Function;
    private showAutoLogoffModal: Function;
    private autoLogoffCalled: boolean;

    constructor(...args) {
        super(...args);
        let _this = this;

        _this.notifyUpdateAutoLogoffTimeout = _.debounce(async () => await _this.updateAutoLogoffTimeout(), 1000, {
            leading: true,
            trailing: false
        });

        _this.showAutoLogoffModal = _.debounce(async () => await _this.autoLogoffModal(), 1000, {
            leading: true,
            trailing: false
        });

        _this.logoutSubscriptions.push(
            _this.eventService.subscribe("router:navigation:processing", async () => {
                await _this.notifyUpdateAutoLogoffTimeout();
            }),
            _this.eventService.subscribe("update:auto:logoff:timeout", async () => {
                await _this.notifyUpdateAutoLogoffTimeout();
            }),
        );
    }

    initializeAsync(force?: boolean) {
        this.notifyUpdateAutoLogoffTimeout();
    }

    async updateAutoLogoffTimeout() {
        if (this.autoLogoffTimeoutHandle) {
            window.clearTimeout(this.autoLogoffTimeoutHandle);
        }

        let nextInterval = (environment().autoLogoffMinutes) * 60000;
        sessionStorage.setItem('auto-logoff', `${new Date().getTime() + nextInterval}`);

        this.autoLogoffTimeoutHandle = window.setTimeout(async () => {
            await this.timerExpired();
        }, nextInterval - 60000);
    }

    async timerExpired() {
        let autoLogoff = sessionStorage.getItem('auto-logoff') || 0;
        if (new Date().getTime() < autoLogoff) this.showAutoLogoffModal();
        else await this.dispose();
    }

    async autoLogoffModal() {
        if (this.autoLogoffCalled) return;
        this.autoLogoffCalled = true;

        if (this.autoLogoffTimeoutHandle) {
            window.clearTimeout(this.autoLogoffTimeoutHandle);
        }

        await this.dialogService.open({viewModel: AutoLogoffDialog, lock: true})
            .whenClosed(async response => {
                if (!response.wasCancelled) {
                    await this.notifyUpdateAutoLogoffTimeout();
                    this.autoLogoffCalled = false
                } else {
                    await this.dispose();
                }
            });
    }

    async dispose() {
        this.eventService.unsubscribe(this.logoutSubscriptions);
        window.clearTimeout(this.autoLogoffTimeoutHandle);
        await this.auth.logoutUser();
    }
}
