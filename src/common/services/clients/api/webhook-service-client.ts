import environment from "environment";
import {ProgressServiceClient} from "../progress-service-client";

export class WebhookServiceClient extends ProgressServiceClient {
  constructor(...args) {
    super(...[`${environment().apiRoot}/webhooks-api`, ...args]);
  }
}
