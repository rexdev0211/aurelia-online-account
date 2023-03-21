import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from 'dtos/onlineaccount-api.dtos';
import StartRegistrationRequest = OnlineAccountApi.StartRegistrationRequest;

export class StartRegistrationModel extends OnlineAccountApi.StartRegistrationRequest {
    confirmEmailAddress: string;
    confirmMobilePhone: string;

    constructor(init?: Partial<StartRegistrationRequest>) {
        super(init);
    }
}

ValidationRules
    .ensure((x: StartRegistrationModel) => x.emailAddress).required().email()
    .ensure((x: StartRegistrationModel) => x.accessCode).required()
    .ensure((x: StartRegistrationModel) => x.accountCode).required()
    .ensure((x: StartRegistrationModel) => x.birthDate).required()
    .ensure((x: StartRegistrationModel) => x.mobilePhone).required().satisfiesRule('isIntlPhone')

    .ensure((x: StartRegistrationModel) => x.confirmEmailAddress).required().satisfiesRule("matchesProperty", "emailAddress")
    .ensure((x: StartRegistrationModel) => x.confirmMobilePhone).required().satisfiesRule("matchesProperty", "mobilePhone")

    .on(StartRegistrationModel);
