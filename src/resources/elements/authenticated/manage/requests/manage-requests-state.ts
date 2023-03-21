import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import CustomerBusinessLookup = OnlineAccountApi.CustomerBusinessLookup;

export class ManageRequestsState {
    selectedBusiness: CustomerBusinessLookup

    constructor(init?: Partial<ManageRequestsState>) {
        (<any>Object).assign(this, init);
    }
}