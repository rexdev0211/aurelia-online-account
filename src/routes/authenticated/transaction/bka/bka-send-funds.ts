import {BasePage} from './../../../../bases/base-page';

export class BkaSendFundsPage extends BasePage {

    constructor(...args) {
        super(...args);
    }

    canActivate() {
        return this.canActivateState(s =>
            this.utils.propExists(s, "sourceAccount") && this.utils.propExists(s, "destinationAccount"), '#/account/send/funds');
    }

}

