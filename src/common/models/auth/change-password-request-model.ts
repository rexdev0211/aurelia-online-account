import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";

export class ChangePasswordRequestModel extends OnlineAccountApi.ChangePasswordRequest {
  public confirmPassword: string;

  constructor() {
    super()
  }
}

ValidationRules
  .ensure((x: ChangePasswordRequestModel) => x.mfaVerificationCode).required().minLength(6)
  .ensure((x: ChangePasswordRequestModel) => x.currentPassword).required().minLength(6)
  .ensure((x: ChangePasswordRequestModel) => x.newPassword).required().minLength(6)
  .ensure((x: ChangePasswordRequestModel) => x.confirmPassword).required().minLength(6).satisfiesRule("matchesProperty", "newPassword")
  .on(ChangePasswordRequestModel);
