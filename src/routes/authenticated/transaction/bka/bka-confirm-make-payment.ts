import {BasePage} from './../../../../bases/base-page';

export class BkaConfirmMakePaymentPage extends BasePage {

    constructor(...args) {
        super(...args);
    }

    canActivate() {
        return this.canActivateState(s =>
            this.utils.propExists(s, "sourceAccount") && this.utils.propExists(s, "destinationAccount") && this.utils.propExists(s, "beneficiaryPaymentRequest"), '#/account/send/funds');
    }
}

