import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";

export class MfaEnrollRequestModel extends OnlineAccountApi.MfaEnroll {
  constructor() {
    super();
  }
}

ValidationRules
  .ensure((x: MfaEnrollRequestModel) => x.emailAddress).required()
  .ensure((x: MfaEnrollRequestModel) => x.emailVerificationCode).required()
  .ensure((x: MfaEnrollRequestModel) => x.securedAccessCode).required().withMessage("Access Code is required.")
  .on(MfaEnrollRequestModel);
