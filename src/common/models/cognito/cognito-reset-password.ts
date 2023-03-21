import {ValidationRules} from "aurelia-validation";

export class CognitoResetPassword {
  emailAddress;
  verificationCode;
  newPassword;
  confirmPassword;

  constructor() {
  }
}

ValidationRules.ensure((x: CognitoResetPassword) => x.emailAddress).required().email()
  .ensure((x: CognitoResetPassword) => x.verificationCode).required().minLength(6)
  .ensure((x: CognitoResetPassword) => x.newPassword).required().minLength(6)
  .ensure((x: CognitoResetPassword) => x.confirmPassword).required().minLength(6).satisfiesRule("matchesProperty", "newPassword")

  .on(CognitoResetPassword);
