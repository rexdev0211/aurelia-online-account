import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import MfaPreEnroll = OnlineAccountApi.MfaPreEnroll;

export class MfaPreValidationModel extends MfaPreEnroll {
  constructor() {
    super();
  }
}

ValidationRules
  .ensure((x: MfaPreValidationModel) => x.emailAddress).required()
  .on(MfaPreValidationModel);
