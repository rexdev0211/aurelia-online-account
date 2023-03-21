import {bindable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {SelectedAccount} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {filterClearBankAccounts, filterLocalAccounts, filterManagedAccounts, formatAccountSummary, sortBy} from "../../../../../common/services/shared";

export class PaymentBeneficiariesCustomElement extends BaseElement {
    @bindable value: string;
    private accounts: { text: string; value: string; name: string; currency: string; symbol: string }[];

    constructor(...args) {
        super(...args);

        this.accounts = this.state.customerSummary.accounts
            .filter(filterLocalAccounts())
            .filter(filterClearBankAccounts())
            .sort(sortBy(['accountName', 'currencyCode', 'code']))
            .map(formatAccountSummary())
            .concat(this.state.customerSummary.accounts
                .filter(filterManagedAccounts(['Send Funds (Request)', 'Send Funds (Authorize)', 'Send Funds (Admin)']))
                .sort(sortBy(['accountName', 'currencyCode', 'code']))
                .map(formatAccountSummary()));
    }

    async sourceChanged(e) {
        let dataItem = e.sender.dataItem();

        if (!dataItem.value) {
            await dispatchify('setBeneficiariesSource')(null);
            return;
        }

        await dispatchify('setBeneficiariesSource')(new SelectedAccount(this.state.customerSummary.accounts.find(x => x.ern === dataItem.value)));
    }

}

