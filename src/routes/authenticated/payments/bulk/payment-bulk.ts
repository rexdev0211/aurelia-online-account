import {dispatchify} from "aurelia-store";
import {BasePage} from '../../../../bases/base-page';

export class PaymentBulkPage extends BasePage {

    constructor(...args) {
        super(...args);
    }

    async activate() {
        await dispatchify('clearPayments')();
    }

    async deactivate() {
        await dispatchify('clearPayments')();
    }
}

