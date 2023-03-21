import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import CustomerWebhookRequest = OnlineAccountApi.CustomerWebhookRequest;

export class EditWebhookModel extends OnlineAccountApi.CustomerWebhookRequest {
    version: number;

    constructor(init?: Partial<CustomerWebhookRequest>) {
        super(init);
        (<any>Object).assign(this, init);

        this.version = parseInt(this.event.split('.').slice(-1)[0].substr(1));
    }
}

ValidationRules
    .ensure((x: EditWebhookModel) => x.name).required()
    .on(EditWebhookModel)

ValidationRules
    .ensure((x: OnlineAccountApi.SubscriptionConfig) => x.url).required().then().matches(/(https:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/).withMessage("Invalid Url")
    .on(OnlineAccountApi.SubscriptionConfig)
