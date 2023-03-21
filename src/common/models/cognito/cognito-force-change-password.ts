import { ValidationRules } from "aurelia-validation";

export class CognitoForceChangePassword {
  newPassword: string;
  confirmPassword: string;

  constructor() {}
}
ValidationRules.ensure((x: CognitoForceChangePassword) => x.newPassword)
  .required()
  .minLength(6)
  .ensure((x: CognitoForceChangePassword) => x.confirmPassword)
  .required()
  .minLength(6)
  .satisfiesRule("matchesProperty", "newPassword")
  .on(CognitoForceChangePassword);
