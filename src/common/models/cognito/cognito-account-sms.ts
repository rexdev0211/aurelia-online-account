import { ValidationRules } from "aurelia-validation";

export class CognitoAccountSms {
  public phone: string;

  constructor() {}
}

ValidationRules.ensure((x: CognitoAccountSms) => x.phone)
  .required()
  .on(CognitoAccountSms);
