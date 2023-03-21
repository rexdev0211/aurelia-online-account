import {dispatchify} from "aurelia-store";
import {BaseElement} from '../../../../../bases/base-element';
import {WebhookViewType} from "./webhooks-state";

export class ViewWebhookCustomElement extends BaseElement {

    constructor(...args) {
        super(...args);
    }

    async back() {
        await dispatchify('setManageWebhooksView')(WebhookViewType.Manage);
    }

}

