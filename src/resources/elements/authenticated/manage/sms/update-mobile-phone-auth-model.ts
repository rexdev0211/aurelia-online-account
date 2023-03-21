import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import UpdateMobilePhoneAuthRequest = OnlineAccountApi.UpdateMobilePhoneAuthRequest;

export class UpdateMobilePhoneAuthModel extends UpdateMobilePhoneAuthRequest {
  confirmMobilePhone: string;

  public constructor(init?: Partial<UpdateMobilePhoneAuthRequest>) {
    super(init);
  }
}


ValidationRules
  .ensure((x: UpdateMobilePhoneAuthModel) => x.mobilePhone).required()

  .ensure((x: UpdateMobilePhoneAuthModel) => x.confirmMobilePhone)
  .satisfiesRule("matchesProperty", "mobilePhone").when(x => !x.crc)

  .ensure((x: UpdateMobilePhoneAuthModel) => x.emailVerificationCode).required().when(x => !!x.crc)

  .ensure((x: UpdateMobilePhoneAuthModel) => x.smsVerificationCode).required().when(x => !!x.crc)

  .on(UpdateMobilePhoneAuthModel);
