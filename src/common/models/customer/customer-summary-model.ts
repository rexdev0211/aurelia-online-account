import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import BeneficiaryAccount = OnlineAccountApi.BeneficiaryAccount;

export class CustomerSummaryModel extends OnlineAccountApi.CustomerSummary {

    activeBeneficiaryAccounts: BeneficiaryAccount[];

    constructor(customerSummary?: OnlineAccountApi.CustomerSummary) {
        super();
        Object.assign(this, customerSummary);
        //this.setActiveBeneficiaryAccounts();
        this.setPoints();
    }

    // private setActiveBeneficiaryAccounts() {
    //   let activeBeneficiaryERNs: string[] = [];
    //   this.accounts.forEach(account => account.beneficiaryAccounts.forEach(beneficiaryAccount => activeBeneficiaryERNs.push(beneficiaryAccount.ern)));
    //   this.activeBeneficiaryAccounts = this.beneficiaryAccounts.filter(x => activeBeneficiaryERNs.some(y => y === x.ern));
    // }

    private setPoints() {
        this.accounts.forEach(account => {
            if (account.displayPoints) account.currencySymbol = 'Points';
        });

    }
}
