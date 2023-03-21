import {Container} from "aurelia-dependency-injection";
import {Store} from "aurelia-store";
import {ApplicationState} from "../../applicationState";
import {OnlineAccountApi} from "../../dtos/onlineaccount-api.dtos";
import BeneficiaryAccount = OnlineAccountApi.BeneficiaryAccount;
import BusinessAccountSummary = OnlineAccountApi.BusinessAccountSummary;
import MemberSummary = OnlineAccountApi.MemberSummary;

export class FriendlyERNValueConverter {

  toView(value) {
    if (!value.includes('ern::')) return value;
    let split = value.split(':').filter(x => x.length != 0);

    switch (split[0]) {
      case 'Transaction Limit':
      case 'Daily Limit':
        return `${split[0]}: ${this.getValue(split[3], split.slice(1).join('::'))}`;
        break;
      case 'ern':
        return this.getValue(split[2], value);
        break;
    }
  }

  getValue(type, value) {
    // @ts-ignore
    let state: ApplicationState = Container.instance.get(Store).state.source.value;

    switch (type) {
      case 'Business':
        let business = state.customerSummary.businesses.find(x => x.ern === value);
        return business
          ? `Business: ${business.businessName}`
          : value;
        break;

      case 'Customer':
        let member: MemberSummary = state.permissions.selectedBusiness.members.find(x => x.ern === value);
        return member
          ? member.name
          : value;
        break;

      case 'Account':
        let account: BusinessAccountSummary = state.permissions.selectedBusiness.accounts.find(xx => xx.ern === value);
        return account
          ? account.name
          : value;
        break;

      case 'BeneficiaryAccount':
        if (state.permissions.beneficiaryAccounts && state.permissions.beneficiaryAccounts.length) {
          let beneficiaryAccount: BeneficiaryAccount = state.permissions.beneficiaryAccounts.find(xx => xx.ern === value);
          return `Beneficiary: ${beneficiaryAccount.nickName}`;
        }

        return value;
        break;

      default:
        return value;
    }
  }

  fromView(value) {

  }
}

