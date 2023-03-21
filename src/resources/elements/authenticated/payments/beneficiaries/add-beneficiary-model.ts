import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {BeneficiaryAccountModel} from "./beneficiary-account-model";
import {BeneficiaryModel} from "./beneficiary-model";


export class AddBeneficiaryModel extends OnlineAccountApi.AddBeneficiaryRequest {
    beneficiary: BeneficiaryModel = new BeneficiaryModel();
    account: BeneficiaryAccountModel = new BeneficiaryAccountModel();

    constructor() {
        super();
    }
}

ValidationRules
    .ensure((x: AddBeneficiaryModel) => x.beneficiary).required()
    .ensure((x: AddBeneficiaryModel) => x.account).required()
    .on(AddBeneficiaryModel)
