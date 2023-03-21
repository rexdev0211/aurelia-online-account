import {dispatchify} from "aurelia-store";
import {ControllerValidateResult} from "aurelia-validation";
import {SelectedAccount} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {filterLocalAccounts, filterManagedAccounts, formatAccountSummary, sortBy} from "../../../../../common/services/shared";
import environment from "../../../../../environment";
import {KendoDropDownList} from "../../../components/kendo/kendo-drop-down-list";
import {TransferFundsModel} from "./tranfser-funds-model";

export class PaymentTransferCustomElement extends BaseElement {
    private model: TransferFundsModel = new TransferFundsModel();

    private readonly accounts: { text: string; value: string; name: string; currency: string, symbol: string }[];

    private source: KendoDropDownList;
    private destination: KendoDropDownList;
    private symbol: string;

    constructor(...args) {
        super(...args);

        this.accounts = this.state.customerSummary.accounts
            .filter(filterLocalAccounts())
            .sort(sortBy(['accountName', 'currencyCode', 'code']))
            .map(formatAccountSummary())
            .concat(this.state.customerSummary.accounts
                .filter(filterManagedAccounts(['Transfer Funds (Request)', 'Transfer Funds (Authorize)', 'Transfer Funds (Admin)']))
                .sort(sortBy(['accountName', 'currencyCode', 'code']))
                .map(formatAccountSummary()));

    }

    async sourceChanged(e) {
        let dataItem = e.sender.dataItem();

        if (!dataItem.value) {
            this.destination.widget.dataSource.data(this.accounts);
            await dispatchify('setPaymentTransferSource')(null);
            return;
        }

        this.symbol = dataItem.symbol;

        let sourceAccount: SelectedAccount = new SelectedAccount(this.state.customerSummary.accounts.find(x => x.ern === dataItem.value));
        await dispatchify('setPaymentTransferSource')(sourceAccount);

        let destinationAccounts = this.accounts.filter(x => {
            let destinationAccount: SelectedAccount = new SelectedAccount(this.state.customerSummary.accounts.find(xx => xx.ern === x.value));
            if (sourceAccount.businessERN && sourceAccount.businessERN !== destinationAccount.businessERN) return false;
            if (sourceAccount.customerERN && sourceAccount.customerERN !== destinationAccount.customerERN) return false;
            if (x.value == dataItem.value) return false;
            if (x.currency !== dataItem.currency) return false;
            return true;
        });

        this.destination.widget.dataSource.data(destinationAccounts);

        await this.validationController.validate({
            object: this.model,
            propertyName: "accountERN"
        });
    }

    async destinationChanged(e) {
        let dataItem = e.sender.dataItem();

        if (!dataItem.value) {
            this.source.widget.dataSource.data(this.accounts);
            await dispatchify('setPaymentTransferDestination')(null);
            return;
        }

        let sourceAccount = new SelectedAccount(this.state.customerSummary.accounts.find(x => x.ern === dataItem.value));
        await dispatchify('setPaymentTransferDestination')(sourceAccount);

        let sourceAccounts = this.accounts.filter(x => {
            let destinationAccount: SelectedAccount = new SelectedAccount(this.state.customerSummary.accounts.find(xx => xx.ern === x.value));
            if (sourceAccount.businessERN && sourceAccount.businessERN !== destinationAccount.businessERN) return false;
            if (sourceAccount.customerERN && sourceAccount.customerERN !== destinationAccount.customerERN) return false;
            if (x.value == dataItem.value) return false;
            if (x.currency !== dataItem.currency) return false;
            return true;
        });

        this.source.widget.dataSource.data(sourceAccounts);

        await this.validationController.validate({
            object: this.model,
            propertyName: "toAccountERN"
        });
    }

    async amountChanged(e) {
        await this.validationController.validate({
            object: this.model,
            propertyName: "amount"
        });
    }

    async submit() {
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.model});
        if (!validationResult.valid) return;

        // Lets validate amount
        if (!environment().debug)
            if (this.model.amount * 100 > this.state.payments.transfer.sourceAccount.presentBalance) {
                validationResult.results.push(
                    this.validationController.addError(
                        "Cannot send more than you have available",
                        this.model,
                        "amount"
                    )
                );
                return;
            }

        await TransferFundsModel.post(this.validationController, this.model);
    }

}

