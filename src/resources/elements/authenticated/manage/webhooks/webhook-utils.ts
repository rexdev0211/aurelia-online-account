import {autoinject} from "aurelia-dependency-injection";
import {DataStore} from "../../../../../common/data-stores/data-store";

@autoinject()
export class WebhookUtils {

    constructor(private dateStore: DataStore) {
    }

    getWebhookVersions() {
        return this.dateStore.state.webhooks.sourceAccount.code.length > 12
            ? this.dateStore.state.enums.TransactionActivityVersionsBka
            : this.dateStore.state.enums.TransactionActivityVersionsFor;
    }
}