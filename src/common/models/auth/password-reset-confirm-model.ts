import {Container} from 'aurelia-framework';
import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import {DataStore} from "../../data-stores/data-store";

export class PasswordResetConfirmModel extends OnlineAccountApi.PasswordResetConfirm {
  public confirmPassword: string;

  constructor() {
    super()
  }
}

ValidationRules
  .ensure((x: PasswordResetConfirmModel) => x.emailAddress).required().email()
  .ensure((x: PasswordResetConfirmModel) => x.emailVerificationCode).required()
  .ensure((x: PasswordResetConfirmModel) => x.mfaVerificationCode).required().when(object => Container.instance.get(DataStore).state.mfaSetup !== null)
  .ensure((x: PasswordResetConfirmModel) => x.newPassword).required().minLength(6)
  .ensure((x: PasswordResetConfirmModel) => x.confirmPassword).required().minLength(6).satisfiesRule("matchesProperty", "newPassword")
  .on(PasswordResetConfirmModel);
