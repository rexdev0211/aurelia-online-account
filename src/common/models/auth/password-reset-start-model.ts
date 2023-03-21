import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";

export class PasswordResetStartModel extends OnlineAccountApi.PasswordReset {
  constructor() {
    super()
  }
}

ValidationRules.ensure((x: PasswordResetStartModel) => x.emailAddress)
  .required()
  .email()
  .on(PasswordResetStartModel);
