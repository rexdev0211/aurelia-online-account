import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import UpdateMobilePhoneRequest = OnlineAccountApi.UpdateMobilePhoneRequest;

export class UpdateMobilePhoneModel extends UpdateMobilePhoneRequest {

    public constructor(init?: Partial<UpdateMobilePhoneRequest>) {
        super(init);
    }
}


ValidationRules
    .ensure((x: UpdateMobilePhoneModel) => x.mobilePhone).required()
    .ensure((x: UpdateMobilePhoneModel) => x.mfaVerificationCode).required()
    .ensure((x: UpdateMobilePhoneModel) => x.crc).required()
    .ensure((x: UpdateMobilePhoneModel) => x.securedAccessCode).required().withMessage("Access Code is required.")
    .on(UpdateMobilePhoneModel);
