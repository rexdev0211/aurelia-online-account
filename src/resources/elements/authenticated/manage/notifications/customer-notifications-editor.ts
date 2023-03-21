import {BaseElement} from '../../../../../bases/base-element';
import {computedFrom, observable} from "aurelia-framework";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {dispatchify} from "aurelia-store";
import {ApplicationState} from "../../../../../applicationState";
import * as changeCase from "change-case";
import * as Humanizer from "humanize-string";
import {notificationAccounts} from "../../../../../common/services/shared";
import NotificationDelivery = OnlineAccountApi.NotificationDelivery;

export class CustomerNotificationsEditorCustomElement extends BaseElement {
    @observable principalErn;
    private eventTypes: string[];
    private events: { name: string; text: string }[];
    private loadedProfile: Boolean;
    private model: OnlineAccountApi.TransactionNotificationEvent;
    private accountList: string[];

    constructor(...args) {
        super(...args);
    }

    @computedFrom('model.acno')
    get getAccounts(): { name: string, code: string }[] {
        let accounts: { name: string, code: string }[] = [...[{name: 'All Accounts', code: '*'}]];

        // Get Local Accounts
        let localAccounts = notificationAccounts();

        // Get Managed Accounts

        return [...accounts, ...localAccounts];
    }

    async attached() {
        this.viewAttached = true;
        if (!this.loadedProfile) await this.loadProfile();
        this.addSubscription('refresh:notifications', async () => await this.loadProfile());
    }

    detached() {
        this.viewAttached = false;
        this.loadedProfile = false;
        this.clearSubscriptions();
    }

    async loadProfile() {
        if (!this.state.notifications.principal?.value.includes('::Customer::')) return;

        if (this.state.notifications.principal?.value) {
            this.loadedProfile = true;
            let response = await this.serviceClients.onlineAccountApi.get(new OnlineAccountApi.NotificationProfileRequest({
                ern: this.state.notifications.principal.value
            }));
            if (response.result) {
                await dispatchify('setNotificationsProfile')(response.result);
            }

            this.eventTypes = this.state.notifications.profile.events.map(x => x.event);
            this.events = this.eventTypes.map(value => {
                return {name: value, text: changeCase.titleCase(Humanizer(value))};
            });
        }
    }

    async toggle(event, input) {
        await dispatchify('toggleNotificationProfileDelivery')(event.name, input.name);
    }

    toggleTransaction(input) {
        let findIdx = this.model.destination.indexOf(input.name);
        if (findIdx !== -1) this.model.destination.splice(findIdx, 1);
        else this.model.destination.push(input.name);
    }

    toggleAccount(input) {
        if (input.code === '*') {
            this.model.acno = [...[input.code]];
        } else {
            let findIdx = this.model.acno.indexOf(input.code);
            if (findIdx !== -1) this.model.acno.splice(findIdx, 1);
            else this.model.acno.push(input.code);
            this.model.acno = [...this.model.acno.filter(x => x !== '*')];
        }

    }

    add() {
        kendo.confirm('Add new event?')
            .then(async () => {
                this.model = new OnlineAccountApi.TransactionNotificationEvent({
                    acno: ['*'],
                    destination: [NotificationDelivery.Email]
                });
                await dispatchify('addNotificationProfileTransaction')(this.model);
            });
    }

    async save(item) {
        if (!item) return;
        if (!this.model) return;

        if (!this.model.destination.length) {
            await this.notificationService.showMessage('warning', 'Warning', 'Delivery Destination Missing');
            return;
        }

        kendo.confirm('Save Changes?')
            .then(async () => {
                await dispatchify('replaceNotificationProfileTransaction')(this.model, item);
                item.editMode = false;
                this.model = null;

            });
    }

    cancel(item) {
        if (!item) return;

        kendo.confirm('Cancel Changes')
            .then(() => {
                item.editMode = false;
                this.model = null;
            });
    }

    async edit(item) {
        if (!item) return;

        this.model = new OnlineAccountApi.TransactionNotificationEvent(item);
        item.editMode = true;
    }

    del(item) {
        if (!item) return;
        kendo.confirm('Remove Event?')
            .then(async () => {
                await dispatchify('delNotificationProfileTransaction')(item);
            });
    }

    getDeliveryTypes(event) {
        let res = ((event !== 'TransactionEvent')
            ? this.state.enums.NotificationDelivery
            : this.state.enums.NotificationDelivery.filter(x => x.name === 'Suppress'))
            .map(x => Object.assign(x, {checked: this.state.notifications.profile.events.find(xx => xx.event === event).destination.includes(x.name as NotificationDelivery)}));

        return res;
    }

    getTransactionDeliveryTypes() {
        return this.state.enums.NotificationDelivery.filter(x => x.name !== 'Suppress');
    }

    stateChanged(newValue: ApplicationState) {
        this.principalErn = newValue?.notifications?.principal?.value;
    }

    async principalErnChanged(newValue, oldValue) {
        if (this.viewAttached && newValue) await this.loadProfile();
    }

}

