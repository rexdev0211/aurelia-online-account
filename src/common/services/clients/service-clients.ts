import {autoinject} from "aurelia-framework";
import {DocumentStoreServiceClient} from "./api/document-store-service-client";
import {JumioServiceClient} from "./api/jumio-service-client";
import {OnlineAccountServiceClient} from "./api/online-account-service-client";
import {WebhookServiceClient} from "./api/webhook-service-client";

@autoinject
export class ServiceClients {
    constructor(
        public onlineAccountApi: OnlineAccountServiceClient,
        public documentStoreApi: DocumentStoreServiceClient,
        public webhookApi: WebhookServiceClient,
        public jumioApi: JumioServiceClient) {

        if (location.hostname === "account.local.enumis.co.uk") {
            return;
            console.warn('serverClients.useLocalhost() is enabled on this request');

            this.onlineAccountApi = this.onlineAccountApi.useLocalhost("onlineaccount-api");

            this.documentStoreApi = this.documentStoreApi.useLocalhost("documentstore-api");
            //this.jumioApi = this.jumioApi.useLocalhost(5004);
            this.webhookApi = this.webhookApi.useLocalhost("webhooks-api");
        }
    }

}
