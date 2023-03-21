import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../bases/base-element';
import {dispatchify} from "aurelia-store";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import ResendWebhookResponse = OnlineAccountApi.ResendWebhookResponse;
import ResendWebhookRequest = OnlineAccountApi.ResendWebhookRequest;

export class GpsTransactionDetailCustomElement extends BaseElement {
    @bindable model;
    @bindable account;
    private sendWebhook: boolean;

    constructor(...args) {
        super(...args);
    }

    async attached() {
        if (this.state.webhooks == null) await dispatchify('fetchWebhooks')();
        this.sendWebhook = this.state.webhooks && this.state.webhooks.items && this.state.webhooks.items.some(x => x.event.includes(this.model.account) && x.isActive);
    }

    async resendWebhook() {
        kendo.confirm('Are you sure you want to resend webhook?')
            .then(async () => {
                let response: ResendWebhookResponse = await this.serviceClients.onlineAccountApi.post(new ResendWebhookRequest({
                    ern: this.model.ern
                }));
                if (response.result) {
                    await this.notificationService.showMessage('success', 'Success', 'Resend Webhook Scheduled Successfully');
                }
            })
    }

}

