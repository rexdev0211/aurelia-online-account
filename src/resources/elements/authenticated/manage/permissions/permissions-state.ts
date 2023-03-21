import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import BeneficiaryAccount = OnlineAccountApi.BeneficiaryAccount;
import CustomerBusinessSummary = OnlineAccountApi.CustomerBusinessSummary;
import MemberSummary = OnlineAccountApi.MemberSummary;

export class PermissionsState {
    selectedBusiness: CustomerBusinessSummary
    selectedMember: MemberSummary;
    beneficiaryAccounts: BeneficiaryAccount[];

    constructor(init?: Partial<PermissionsState>) {
        (<any>Object).assign(this, init);
    }
}