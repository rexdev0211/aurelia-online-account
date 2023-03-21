import {autoinject, bindable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import WebhookEvents from "../../../../../dtos/webhook-events";
import {EditWebhookModel} from "./edit-webhook-model";
import {WebhookUtils} from "./webhook-utils";
import {WebhookViewType} from "./webhooks-state";
import SubscriptionConfig = OnlineAccountApi.SubscriptionConfig;

@autoinject()
export class EditWebhookCustomElement extends BaseElement {
    @bindable event: string = WebhookEvents.TransactionActivity;
    private model: EditWebhookModel;
    private showSendTestButton: boolean = true;
    private urlSubscription: any;

    constructor(private webhookUtils: WebhookUtils, ...args) {
        super(...args);
    }

    attached() {
        this.model = new EditWebhookModel(this.state.webhooks.selectedWebhook);
        this.model.config = new SubscriptionConfig(this.state.webhooks.selectedWebhook);
        this.validationController.addObject(this.model);
        this.validationController.addObject(this.model.config);

        this.urlSubscription = this.bindingEngine
            .propertyObserver(this.model.config, 'url')
            .subscribe((newValue, oldValue) => {
                this.urlChanged(newValue, oldValue)
            });
    }

    detached() {
        this.urlSubscription.dispose();
    }

    async urlChanged(newValue, oldValue) {
        let validationResult = await this.validationController.validate({object: this.model.config, propertyName: 'url'});
        this.showSendTestButton = validationResult.valid;
    }

    sendTestWebhook() {
        let event = `${this.event}.${this.state.webhooks.sourceAccount.code}.v${this.model.version}`;
        kendo.confirm(`Send Test Webhook?<br><br>${event}<br>${this.model.config.url}`)
            .then(async () => {

                let response = await this.serviceClients.onlineAccountApi.post(new OnlineAccountApi.SendTestWebhookRequest({
                    event: event,
                    config: this.model.config
                }));

                kendo.alert(`Response: ${response.result}`);
            });
    }


    async back() {
        await dispatchify('setManageWebhooksView')(WebhookViewType.Manage);
    }

    async submit() {
        let validationResult = await this.validationController.validate();
        if (!validationResult.valid) return;

        // Lets add the version
        this.model.event = `${this.event}.${this.state.webhooks.sourceAccount.code}.v${this.model.version}`;

        let response = await this.serviceClients.onlineAccountApi.put(this.model);

        if (response.result) {
            await dispatchify('fetchWebhooks')();
            await dispatchify('setManageWebhooksView')(WebhookViewType.Manage);
            await this.notificationService.showMessage('success', 'Success', `Webhook Edited Successfully: ${this.model.name}`);
        }
    }
}

