import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from 'dtos/onlineaccount-api.dtos';
import FinishRegistrationRequest = OnlineAccountApi.FinishRegistrationRequest;

export class ConfirmRegistrationModel extends OnlineAccountApi.FinishRegistrationRequest {
    newPassword: string;
    confirmPassword: string;
    agreeTermsConditions: boolean;
    agreePricingFees: boolean;

    constructor(init?: Partial<FinishRegistrationRequest>) {
        super(init);
    }
}

ValidationRules
    .ensure((x: ConfirmRegistrationModel) => x.emailAddress).required()
    .ensure((x: ConfirmRegistrationModel) => x.emailVerificationCode).required().minLength(6)
    .ensure((x: ConfirmRegistrationModel) => x.smsVerificationCode).required().minLength(6)
    .ensure((x: ConfirmRegistrationModel) => x.newPassword).required().minLength(6)
    .ensure((x: ConfirmRegistrationModel) => x.confirmPassword).required().minLength(6).satisfiesRule("matchesProperty", "newPassword")
    .ensure((x: ConfirmRegistrationModel) => x.securityQuestion).required().satisfies((value: any, object: ConfirmRegistrationModel) => {
    return value && value.toString().split(" ").length >= 2;
}).withMessage("You must have at least two words for your question")
    .ensure((x: ConfirmRegistrationModel) => x.securityAnswer).required().minLength(4)
    .ensure((x: ConfirmRegistrationModel) => x.agreeTermsConditions).required().withMessage("You must agree to the terms")
    .ensure((x: ConfirmRegistrationModel) => x.agreePricingFees).required().withMessage("You must agree to the terms")
    .on(ConfirmRegistrationModel);
