import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import MfaAuthenticate = OnlineAccountApi.MfaAuthenticate;

export class MfaAuthenticateModel extends MfaAuthenticate {
  public mfaVerificationCode: string;

  constructor() {
    super();
  }
}

ValidationRules
  .ensure((x: MfaAuthenticateModel) => x.mfaVerificationCode).required()
  .on(MfaAuthenticateModel);
