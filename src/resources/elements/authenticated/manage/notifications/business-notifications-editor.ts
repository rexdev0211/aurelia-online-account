import {BaseElement} from '../../../../../bases/base-element';
import {observable} from "aurelia-framework";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {dispatchify} from "aurelia-store";
import {ApplicationState} from "../../../../../applicationState";
import * as Humanizer from 'humanize-string';
import * as changeCase from 'change-case';
import GetNotificationsBusinessSummaryRequest = OnlineAccountApi.GetNotificationsBusinessSummaryRequest;
import NotificationProfileRequest = OnlineAccountApi.NotificationProfileRequest;
import DropDownList = kendo.ui.DropDownList;

export class SubscriberList {
    constructor(public key: string, public results: Array<{ name: string, text: string }>) {
    }
}


export class BusinessNotificationsEditorCustomElement extends BaseElement {
    @observable principalErn;
    @observable mobilePhone: string;
    @observable emailAddress: string;
    private eventsDdl: DropDownList;
    private principalDdl: DropDownList;
    private eventTypes: string[];
    private events: { name: string; text: string }[];
    private selectedEventType: any;
    private subscribers: Array<SubscriberList>;
    private rawHeaders = ['email::', 'sms::'];
    private disableAdd: boolean = true;
    private loadedProfile: Boolean;

    constructor(...args) {
        super(...args);
    }


    async attached() {
        this.viewAttached = true;
        this.addSubscription('refresh:notifications', async () => await this.loadProfile());
        if (!this.loadedProfile) await this.loadProfile();

    }

    detached() {
        this.viewAttached = false;
        this.loadedProfile = false;
        this.clearSubscriptions();
    }

    mobilePhoneChanged(newValue, oldValue) {
        this.setDisableAdd();
    }

    emailAddressChanged(newValue, oldValue) {
        this.setDisableAdd();
    }

    async eventChanged(e) {
        await dispatchify('setNotificationsBusinessEvent')(e.sender.dataItem());
        await dispatchify('setNotificationsBusinessPrincipal')(null);
        this.setDisableAdd();
        this.buildPrincipals();
    }

    async principalChanged(e) {
        await dispatchify('setNotificationsBusinessPrincipal')(e.sender.dataItem());
        this.setDisableAdd();
    }

    setDisableAdd() {
        this.disableAdd = !(this.state?.notifications?.add?.principal?.ern === 'sms::'
            ? this.mobilePhone?.startsWith('+')
            : this.state?.notifications?.add?.principal?.ern === 'email::'
                ? this.validateEmail(this.emailAddress)
                : (this.state?.notifications?.add?.event?.name && this.state?.notifications?.add?.principal?.ern));
    }

    getRawPrincipals() {
        let principals = [];

        Object.keys(this.state.notifications.profile.events)
            .filter(event => this.state.notifications.profile.events.hasOwnProperty(event))
            .forEach(event => {
                let items = Object.keys(this.state.notifications.profile.events[event])
                    .filter(x => x.startsWith('email::') || x.startsWith('sms::'))
                    .map(x => {
                        return {name: x.replace('email::', '').replace('sms::', ''), ern: x}
                    });
                if (items.length) principals = [...principals, ...items];
            });

        return principals.filter(
            (thing, i, arr) => arr.findIndex(t => t.ern === thing.ern) === i
        );
    }

    buildPrincipals() {
        let principals = [];
        if (this.state?.notifications?.add?.event?.name) {
            let createPrincipals = [
                {ern: 'email::', name: '<New Email>'},
                {ern: 'sms::', name: '<New SMS>'}
            ];

            let rawPrincipals = this.getRawPrincipals();
            let memberPrincipals = [];

            if (this.state?.notifications?.add?.event?.name) memberPrincipals = this.state.notifications.business.members;

            principals = this.utils.distinctBy('ern', [...createPrincipals, ...rawPrincipals, ...memberPrincipals]
                .filter(x => !this.state.notifications.profile.events
                    .filter(xx => xx.event === this.state.notifications.add.event.name)
                    .some(xx => xx.destination.includes(x.ern))));
        }

        if (this.principalDdl) {
            this.principalDdl.dataSource.data(principals);
            this.principalDdl.enable(principals.length > 0);
        }
    }


    buildSubscribers() {
        if (!this.events) return;
        let arr: Array<SubscriberList> = [];
        this.events.forEach(x => {
            arr.push(new SubscriberList(changeCase.titleCase(Humanizer(x.name)), this.state.notifications.profile.events.find(xx => xx.event === x.name)
                .destination
                .map(xxx => {
                    return {
                        name: xxx,
                        text: this.state.notifications.business.members.find(member => member.ern === xxx)?.name || `${xxx.split('::')[1]}`
                    }
                })));
        });
        this.subscribers = arr.filter(x => x.results.length);
    }


    async add() {
        kendo.confirm(`Add <strong>${this.state?.notifications?.add?.principal?.name}</strong> to <strong>${this.state?.notifications?.add?.event?.text}</strong>?`)
            .then(async () => {
                if (this.rawHeaders.includes(this.state.notifications.add.principal.ern)) {
                    if (this.state.notifications.add.principal.ern === 'sms::') {
                        await dispatchify('addNotificationProfile')(this.mobilePhone);
                        this.mobilePhone = null;
                    }
                    if (this.state.notifications.add.principal.ern === 'email::') {
                        if (!this.validateEmail(this.emailAddress)) {
                            await this.notificationService.showMessage('warning', 'Warning', 'Invalid Email Address');
                            return;
                        }
                        await dispatchify('addNotificationProfile')(this.emailAddress);
                        this.emailAddress = null;
                    }
                    this.principalDdl.value(null);
                    await dispatchify('setNotificationsBusinessPrincipal')(null);
                } else await dispatchify('addNotificationProfile')();
                this.buildSubscribers();
                this.buildPrincipals();
            });
    }

    async del(groupKey, subscriber) {
        kendo.confirm(`Remove <strong>${subscriber.text}</strong> from <strong>${groupKey}</strong>?`)
            .then(async () => {
                await dispatchify('delNotificationProfile')(groupKey.replaceAll(' ', ''), subscriber);
                this.buildSubscribers();
                this.buildPrincipals();
            });
    }

    validateEmail(email) {
        const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(String(email).toLowerCase());
    }


    async getBusinessSummary(ern) {
        let response = await this.serviceClients.onlineAccountApi.get(new GetNotificationsBusinessSummaryRequest({businessERN: ern}));
        await dispatchify('setNotificationsBusiness')(response.result);
    }

    async loadProfile() {
        if (!this.state.notifications.principal?.value.includes('::Business::')) return;

        if (this.state.notifications.principal?.value) {
            this.loadedProfile = true;
            let response = await this.serviceClients.onlineAccountApi.get(new NotificationProfileRequest({
                ern: this.state.notifications.principal.value
            }));
            if (response.result) {
                await dispatchify('setNotificationsProfile')(response.result);
            }
            await this.getBusinessSummary(this.state.notifications.principal.value);

            this.eventTypes = this.state.notifications.profile.events.map(x => x.event);
            this.events = this.eventTypes.map(value => {
                return {name: value, text: changeCase.titleCase(Humanizer(value))};
            });

            if (this.eventsDdl) {
                this.eventsDdl.dataSource.data(this.events);
                if (this.state?.notifications?.add?.event?.name) this.taskQueue.queueMicroTask(() => {
                    let eventName = this.state.notifications.add.event.name;
                    let eventsDdl = this.eventsDdl;
                    let index = Array.from(this.eventsDdl.dataSource.data()).findIndex(x => x.name === eventName)
                    eventsDdl.select(index + 1);
                });
                this.buildSubscribers();
                this.buildPrincipals();
            }
        }
    }

    eventReady(e) {
        this.eventsDdl = e;
    }

    principalReady(e) {
        this.principalDdl = e;
    }

    stateChanged(newValue: ApplicationState) {
        this.principalErn = newValue?.notifications?.principal?.value;
    }

    async principalErnChanged(newValue, oldValue) {
        if (this.viewAttached && newValue) await this.loadProfile();
    }

}

