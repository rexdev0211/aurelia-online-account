import {BaseElement} from '../../../../../bases/base-element';
import {dispatchify} from "aurelia-store";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {computedFrom, Container} from "aurelia-framework";
import {JsvService} from "../../../../../common/services/jsv-service";

export class ManageCustomerNotificationsCustomElement extends BaseElement {
    private principals: any[];
    private originalProfile: any;
    private originalMeta: any;
    private refresh: number = 0;

    constructor(...args) {
        super(...args);
    }

    @computedFrom('state.notifications.profile', 'state.notifications.profile.events', 'originalProfile', 'refresh', 'notifications.transaction.events')
    get _isDirty() {
        let isDirty = false;
        if (!this.state.notifications.profile || !this.originalProfile) return isDirty;
        // @ts-ignore
        let currentProfile = JSON.stringify(this.state.notifications.profile).replaceAll('\"', '');
        // @ts-ignore
        let currentMeta = JSON.stringify(this.state.notifications.transaction).replaceAll('\"', '');

        let isDirty1 = this.originalProfile !== currentProfile;
        let isDirty2 = this.originalMeta !== currentMeta;
        return isDirty1 || isDirty2;
    }

    saveOriginal(delayed: boolean = false) {
        if (delayed) {
            setTimeout(() => {
                // @ts-ignore
                this.originalProfile = JSON.stringify(this.state.notifications.profile).replaceAll('\"', '')
                // @ts-ignore
                this.originalMeta = JSON.stringify(this.state.notifications.transaction).replaceAll('\"', '')
            }, 2000);
        } else {
            // @ts-ignore
            this.originalProfile = JSON.stringify(this.state.notifications.profile).replaceAll('\"', '');
            // @ts-ignore
            this.originalMeta = JSON.stringify(this.state.notifications.transaction).replaceAll('\"', '')
        }
    }

    async attached() {
        let principals = [];
        principals.push({text: this.state.customerSummary.nickName, value: this.state.customerSummary.ern});
        this.principals = principals;
        if (this.principals.length == 1) {
            await dispatchify('setNotificationsContext')(this.principals[0]);
        }
        // @ts-ignore
        this.addSubscription('refresh:notifications', () => this.saveOriginal(true));
        this.addSubscription('refresh:notifications:dirty', () => {
            this.refresh++
        });
        this.saveOriginal(true);
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

                    if (this.state.notifications?.transaction?.events?.length) {
                        if (!profile.meta) profile.meta = {};
                        let transactions = this.state.notifications.transaction;
                        transactions.events.forEach(x => delete (x as any).editMode);

                        profile.meta.TransactionNotifications = Container.instance.get(JsvService).serializeObject(this.state.notifications.transaction);
                    } else if (profile.meta?.TransactionNotifications)
                        delete profile.meta.TransactionNotifications;


                    let response = await this.serviceClients.onlineAccountApi.post(new OnlineAccountApi.NotificationProfileRequest(profile));
                    if (response.result) {
                        await this.notificationService.showMessage('success', 'Success', 'Notifications Profile Saved');
                        await dispatchify('setNotificationsProfile')(response.result);
                        this.saveOriginal(true);
                    }
                });
    }

}

