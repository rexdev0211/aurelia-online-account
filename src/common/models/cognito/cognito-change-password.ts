import { ValidationRules } from "aurelia-validation";

export class CognitoChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  constructor() {}
}
ValidationRules.ensure((x: CognitoChangePassword) => x.currentPassword)
  .required()
  .minLength(6)
  .ensure((x: CognitoChangePassword) => x.newPassword)
  .required()
  .minLength(6)
  .satisfiesRule("notMatchesProperty", "currentPassword")
  .withMessage('New password must be different than old password')
  .ensure((x: CognitoChangePassword) => x.confirmPassword)
  .required()
  .minLength(6)
  .satisfiesRule("matchesProperty", "newPassword")
  .on(CognitoChangePassword);
