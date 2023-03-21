import {dispatchify} from "aurelia-store";
import {BasePage} from '../../../../bases/base-page';

export class PaymentTransferPage extends BasePage {

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

