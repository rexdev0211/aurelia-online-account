import {autoinject} from "aurelia-dependency-injection";
import {dispatchify} from "aurelia-store";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {WebhookApi} from "../../../../../dtos/webhook-api.dtos";
import WebhookEvents from "../../../../../dtos/webhook-events";
import {CreateWebhookModel} from "./create-webhook-model";
import {WebhookUtils} from "./webhook-utils";
import {WebhookViewType} from "./webhooks-state";
import SubscriptionConfig = WebhookApi.SubscriptionConfig;

@autoinject()
export class AddWebhookCustomElement extends BaseElement {
    private model: CreateWebhookModel = new CreateWebhookModel();
    private urlSubscription: any;
    private showSendTestButton: boolean = false;

    constructor(private webhookUtils: WebhookUtils, ...args) {
        super(...args);
    }

    async back() {
        await dispatchify('setManageWebhooksView')(WebhookViewType.Manage);
    }

    attached() {
        this.urlSubscription = this.bindingEngine
            .propertyObserver(this.model, 'url')
            .subscribe((newValue, oldValue) => {
                this.urlChanged(newValue, oldValue)
            });
    }

    async urlChanged(newValue, oldValue) {
        let validationResult = await this.validationController.validate({object: this.model, propertyName: 'url'});
        this.showSendTestButton = validationResult.valid;
    }

    detached() {
        this.urlSubscription.dispose();
    }

    async submit() {
        let validationResult = await this.validationController.validate({object: this.model});
        if (!validationResult.valid) return;

        this.model.config = new SubscriptionConfig();
        this.model.config.url = this.model.url;
        this.model.config.secret = this.model.secret;
        this.model.config.contentType = 'application/json';
        this.model.events = [];
        this.model.events.push(`${WebhookEvents.TransactionActivity}.${this.state.webhooks.sourceAccount.code}.v${parseInt(this.webhookUtils.getWebhookVersions().slice(-1)[0].value)}`);

        let response = await this.serviceClients.webhookApi.post(this.model);
        if (response.subscriptions.length) {
            await dispatchify('fetchWebhooks')();
            await dispatchify('setManageWebhooksView')(WebhookViewType.Manage);
            await this.notificationService.showMessage('success', 'Success', `Webhook Added Successfully: ${this.model.name}`);
        }
    }

    sendTestWebhook() {
        let event = `${WebhookEvents.TransactionActivity}.${this.state.webhooks.sourceAccount.code}.v${parseInt(this.webhookUtils.getWebhookVersions().slice(-1)[0].value)}`;
        kendo.confirm(`Send Test Webhook?<br><br>${event}<br>${this.model.url}`)
            .then(async () => {

                let response = await this.serviceClients.onlineAccountApi.post(new OnlineAccountApi.SendTestWebhookRequest({
                    event: event,
                    config: new SubscriptionConfig({
                        url: this.model.url,
                        secret: this.model.secret,
                        contentType: 'application/json'
                    })
                }));

                kendo.alert(`Response: ${response.result}`);
            });
    }


}

