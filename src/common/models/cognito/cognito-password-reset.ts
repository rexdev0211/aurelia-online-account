import {ValidationRules} from "aurelia-validation";

export class CognitoPasswordReset {
  emailAddress: string;

  constructor() {}
}

ValidationRules.ensure((x: CognitoPasswordReset) => x.emailAddress)
  .required()
  .email()
  .on(CognitoPasswordReset);
