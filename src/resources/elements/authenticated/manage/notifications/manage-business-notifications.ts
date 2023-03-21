import {BaseElement} from '../../../../../bases/base-element';
import {dispatchify} from "aurelia-store";
import {getManageBusinessNotifications} from "../../../../../common/services/shared";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {computedFrom} from "aurelia-framework";

export class ManageBusinessNotificationsCustomElement extends BaseElement {
    private principals: any[];
    private original: any;

    constructor(...args) {
        super(...args);
    }


    @computedFrom('state.notifications.profile', 'state.notifications.profile.events', 'original')
    get _isDirty() {
        let isDirty = false;
        if (!this.state.notifications.profile || !this.original) return isDirty;
        // @ts-ignore
        isDirty = this.original !== JSON.stringify(this.state.notifications.profile).replaceAll('\"', '');
        return isDirty;
    }

    saveOriginal(delayed: boolean = false) {
        if (delayed) {
            // @ts-ignore
            setTimeout(() => this.original = JSON.stringify(this.state.notifications.profile).replaceAll('\"', ''),
                2000);
        } else {
            // @ts-ignore
            this.original = JSON.stringify(this.state.notifications.profile).replaceAll('\"', '');
        }
    }

    async attached() {
        // @ts-ignore
        this.saveOriginal();
        let principals = [];

        getManageBusinessNotifications(this.state).forEach(x => {
            let businessErn = x.resource;
            let businessName = this.state.customerSummary.businesses.find(xx => xx.ern === businessErn).businessName;
            if (!principals.some(x => x.value === businessErn)) principals.push({
                text: businessName,
                value: businessErn
            });
        });

        this.principals = principals;
        if (this.principals.length == 1) {
            await dispatchify('setNotificationsContext')(this.principals[0]);
        }

        // @ts-ignore
        this.addSubscription('refresh:notifications', () => this.saveOriginal(true));
    }

    async detached() {
        await dispatchify('resetNotificationsContext')();
        this.clearSubscriptions();
    }

    saveProfile() {
        if (this._isDirty)
            kendo.confirm('Save Profile')
                .then(async () => {
                    let profile = this.state.notifications.profile;
                    let response = await this.serviceClients.onlineAccountApi.post(new OnlineAccountApi.NotificationProfileRequest(profile));
                    if (response.result) {
                        await this.notificationService.showMessage('success', 'Success', 'Notifications Profile Saved');
                        await dispatchify('setNotificationsProfile')(response.result);
                        // @ts-ignore
                        this.original = JSON.stringify(profile).replaceAll('\"', '');
                    }
                });
    }

}

