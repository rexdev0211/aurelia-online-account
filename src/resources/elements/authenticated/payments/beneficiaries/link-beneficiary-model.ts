import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import LinkBeneficiaryRequest = OnlineAccountApi.LinkBeneficiaryRequest;


export class LinkBeneficiaryModel extends LinkBeneficiaryRequest {

    constructor(init?: Partial<LinkBeneficiaryRequest>) {
        super(init);
    }
}

ValidationRules
    .ensure((x: LinkBeneficiaryModel) => x.beneficiaryAccountERN).required()
    .ensure((x: LinkBeneficiaryModel) => x.accountERN).required()
    .on(LinkBeneficiaryModel)




