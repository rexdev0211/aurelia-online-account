import {dispatchify} from "aurelia-store";
import {ApplicationState} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {WebhookViewType} from "./webhooks-state";

export class WebhooksCustomElement extends BaseElement {
    private viewType: WebhookViewType;

    constructor(...args) {
        super(...args);
    }

    async attached() {
        await dispatchify('fetchWebhooks')();
    }

    stateChanged(state: ApplicationState) {
        this.viewType = this.utils.getPropertyValue<WebhookViewType>(this.state, '.webhooks.view');
    }

    async viewTypeChanged(value: WebhookViewType, oldValue: WebhookViewType) {
        if (!oldValue) return;

        if (value === WebhookViewType.Manage && oldValue !== WebhookViewType.Manage) {
            await dispatchify('fetchWebhooks')();
        }
    }

}

