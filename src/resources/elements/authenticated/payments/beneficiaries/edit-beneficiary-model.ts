import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import EditBeneficiaryRequest = OnlineAccountApi.EditBeneficiaryRequest;


export class EditBeneficiaryModel extends EditBeneficiaryRequest {

    constructor(init?: Partial<EditBeneficiaryRequest>) {
        super(init);
    }
}

ValidationRules
    .ensure((x: EditBeneficiaryModel) => x.beneficiaryAccountERN).required()
    .ensure((x: EditBeneficiaryModel) => x.nickName).required()
    .on(EditBeneficiaryModel)




