import {autoinject, bindable} from 'aurelia-framework';
import {BaseElement} from '../../../bases/base-element';
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import {PendingTransactionModal} from "./pending-transaction-modal";
import {dispatchify} from "aurelia-store";
import ResendWebhookResponse = OnlineAccountApi.ResendWebhookResponse;
import ResendWebhookRequest = OnlineAccountApi.ResendWebhookRequest;

@autoinject()
export class ClearbankTransactionDetailCustomElement extends BaseElement {
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

    async openModal() {
        let pendingTransactionId = await this.serviceClients.onlineAccountApi.get(new OnlineAccountApi.GetPendingTransactionIdRequest({transactionId:this.model.transactionId||this.model.itemId}));
        let response = await this.serviceClients.onlineAccountApi.get(new OnlineAccountApi.ListPendingTransactionMessagesRequest({pendingTransactionERN: pendingTransactionId.result}));
        this.utils.rehydrateMeta(response.result);

        this.dialogService.open({
            viewModel: PendingTransactionModal,
            model: {source: response.result, display: 'Messages'},
            lock: true
        })
            .whenClosed(response => {
            });
    }
}

