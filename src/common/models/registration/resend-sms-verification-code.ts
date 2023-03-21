import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";

export class ResendSmsVerificationCode extends OnlineAccountApi.ResendSmsVerificationCodeRequest {
  constructor(emailAddress: string) {
    super();
    this.emailAddress = emailAddress;
  }
}
