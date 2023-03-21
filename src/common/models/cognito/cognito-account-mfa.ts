import {ValidationRules} from "aurelia-validation";

export class CognitoAccountMfa {
  public verificationCode: string;

  constructor() {}
}

ValidationRules.ensure((x: CognitoAccountMfa) => x.verificationCode)
  .required()
  .minLength(6)
  .on(CognitoAccountMfa);
