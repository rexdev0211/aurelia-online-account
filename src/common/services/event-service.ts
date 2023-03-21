import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {NotificationService} from './notification-service';

@inject(EventAggregator, NotificationService)
export class EventService {
    public events = {
        userTokenUpdate: 'user:token:update',
        userSelectedAccountChanged: 'user:selectedAccount:change',

        progressServiceProcessing: 'progress:service:processing',
        progressServiceComplete: 'progress:service:complete',

        routerNavigationProcessing: 'router:navigation:processing',
        routerNavigationComplete: 'router:navigation:complete',

        httpServiceProcessing: 'http:request:processing',
        httpServiceComplete: 'http:request:complete',

        updateNavbar: 'update:navbar',
        updateAutoLogoffTimeout: "update:auto:logoff:timeout"
    };

    public eventAggregator: EventAggregator;
    public notificationService: NotificationService;
    public debugMessageShow: boolean;

    constructor(eventAggregator, notificationService) {
        this.eventAggregator = eventAggregator;
        this.notificationService = notificationService;
        this.debugMessageShow = true;
    }

    publish(event, data) {
        if (Array.isArray(event)) {
            for (let i = 0; i < event.length; i++) {
                this.showDebugMessage('Published Event', event[i]);
                this.eventAggregator.publish(event[i], data);
            }
        } else {
            this.showDebugMessage('Published Event', event);
            this.eventAggregator.publish(event, data);
        }
    }

    subscribe(event, callback) {
        if (Array.isArray(event)) {
            let subscriptions = [];
            for (let i = 0; i < event.length; i++) {
                this.showDebugMessage('Subscribed To Event', event[i]);
                subscriptions.push(this.eventAggregator.subscribe(event[i], callback));
            }
            return {
                dispose() {
                    let i = subscriptions.length;
                    while (i--) {
                        subscriptions[i].dispose();
                    }
                }
            };
        }

        this.showDebugMessage('Subscribed To Event', event);
        return this.eventAggregator.subscribe(event, callback);
    }

    unsubscribe(subscriptions) {
        if (Array.isArray(subscriptions)) {
            subscriptions.forEach((subscription, idx) => {
                this.showDebugMessage('Unsubscribed From Event', subscription);
                if (subscription.dispose) subscription.dispose();
                else if (subscription.unsubscribe) subscription.unsubscribe();
            });
        } else {
            this.showDebugMessage('Unsubscribed From Event', subscriptions);
            if (subscriptions.dispose) subscriptions.dispose();
            else if (subscriptions.unsubscribe) subscriptions.unsubscribe();
        }
    }

    showDebugMessage(title, message) {
        if (this.debugMessageShow) this.notificationService.showDebugMessage(title, message, null);
    }
}
