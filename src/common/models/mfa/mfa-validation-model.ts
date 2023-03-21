import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import MfaConfirm = OnlineAccountApi.MfaConfirm;

export class MfaValidationModel extends MfaConfirm {
  constructor() {
    super();
  }
}

ValidationRules
  .ensure((x: MfaValidationModel) => x.pin1).required()
  .ensure((x: MfaValidationModel) => x.pin2).required().satisfiesRule('notMatchesProperty', 'pin1')
  .on(MfaValidationModel);
