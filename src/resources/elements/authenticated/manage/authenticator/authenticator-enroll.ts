import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {EnrollUserRequestModel} from "./enroll-user-request-model";
import EnrollUserResponse = OnlineAccountApi.EnrollUserResponse;

export class AuthenticatorEnrollCustomElement extends BaseElement {

  code;
  model: EnrollUserRequestModel;

  constructor(...args) {
    super(...args);
    this.code = null;
    this.model = new EnrollUserRequestModel();
    this.validationController.addObject(this.model);
  }


  async submit() {
    if (this.code) {
      location.hash = "#";
      return;
    }

    let validationResponse = await this.validationController.validate({object: this.model});
    if (!validationResponse.valid) return;

    let response: EnrollUserResponse = await this.serviceClients.onlineAccountApi.post(this.model);

    if (response.result)
      this.code = response.result;
  }
}

