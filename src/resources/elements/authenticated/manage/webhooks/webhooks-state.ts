import {Container} from "aurelia-dependency-injection";
import {Store} from "aurelia-store";
import {SelectedAccount} from "../../../../../applicationState";
import {Utils} from "../../../../../common/services/utils";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import WebhookSummary = OnlineAccountApi.WebhookSummary;

export class WebhooksState {
    view: WebhookViewType = WebhookViewType.Manage;
    items: Array<WebhookSummary> = []
    sourceAccount: SelectedAccount;
    selectedWebhook: WebhookSummary;

    constructor(init?: Partial<WebhooksState>) {
        (<any>Object).assign(this, init);
    }


}

export enum WebhookViewType {
    Manage = 'Manage',
    View = 'View',
    Add = 'Add'
}
