import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import EnrollUserRequest = OnlineAccountApi.EnrollUserRequest;

export class EnrollUserRequestModel extends EnrollUserRequest {

  public constructor(init?: Partial<EnrollUserRequest>) {
    super(init);
  }
}

ValidationRules
  .ensure((x: EnrollUserRequest) => x.securedAccessCode).required().withMessage("Access Code is required.")
  .on(EnrollUserRequestModel);
