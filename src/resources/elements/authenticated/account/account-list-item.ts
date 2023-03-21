import {bindable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {BaseElement} from '../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import environment from "../../../../environment";
import AccountSummary = OnlineAccountApi.AccountSummary;

export class AccountListItemCustomElement extends BaseElement {
    @bindable account: AccountSummary;
    private showSpending: boolean;

    constructor(...args) {
        super(...args);

        // Lets select the first account if necessary
        if (this.utils.propExists(this.state, ".customerSummary.ern") && !this.utils.propExists(this.state, '.accounts.sourceAccount.ern')) {
            if (this.state.customerSummary.accounts.length)
                dispatchify("selectAccount")(this.state.customerSummary.accounts[0]);
        }

        this.showSpending = environment().features['showSpending'];
    }

    click() {
        dispatchify("selectAccount")(this.account);
    }

}



