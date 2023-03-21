import {SelectedAccount} from "../../../../../applicationState";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import BeneficiaryAccount = OnlineAccountApi.BeneficiaryAccount;
import {BeneficiaryBulkState} from "./bulk/beneficiary-bulk-state";

export class BeneficiaryState {
    view: BeneficiaryViewType = BeneficiaryViewType.Manage;
    sourceAccount: SelectedAccount;
    selectedBeneficiary: BeneficiaryAccount
    bulk: BeneficiaryBulkState

    constructor(init?: Partial<BeneficiaryState>) {
        (<any>Object).assign(this, init);
    }
}

export enum BeneficiaryViewType {
    Manage = 'Manage',
    Add = 'Add',
    Link = 'Link',
    View = 'View',
    Edit = 'Edit',
    Delete = 'Delete',
}
