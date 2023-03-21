import {ValidationRules} from "aurelia-validation";
import {WebhookApi} from "../../../../../dtos/webhook-api.dtos";


export class CreateWebhookModel extends WebhookApi.CreateSubscription {
  public url: string;
  public secret: string;

  constructor() {
    super();
  }

}

ValidationRules
  .ensure((x: CreateWebhookModel) => x.name).required()
  .ensure((x: CreateWebhookModel) => x.events).minItems(1)
  .ensure((x: CreateWebhookModel) => x.url).required().then().matches(/^(https:\/\/)([\da-z\.-]+\.[a-z\.]{2,25}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/i).withMessage("Invalid Url")
  .on(CreateWebhookModel)




