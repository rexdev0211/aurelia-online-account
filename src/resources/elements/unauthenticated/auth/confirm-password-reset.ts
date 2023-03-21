import {ControllerValidateResult} from "aurelia-validation";
import {PasswordResetConfirmModel} from "../../../../common/models/auth/password-reset-confirm-model";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import {BaseElement} from "./../../../../bases/base-element";

export class ConfirmPasswordResetCustomElement extends BaseElement {
  model: PasswordResetConfirmModel = new PasswordResetConfirmModel();

  constructor(...args) {
    super(...args);
    this.model.emailAddress = this.state.emailAddress;
    this.validationController.addObject(this.model);
  }

  async submit() {
    let validationResult: ControllerValidateResult = await this.validationController.validate();
    if (validationResult.valid) {
      let response: OnlineAccountApi.PasswordResetConfirmResponse = await this.serviceClients.onlineAccountApi.post(this.model);
      if (response.result) {
        await this.notificationService.showMessage('success', 'Success', 'Please login with your new credentials');
        location.hash = '#/'
      }
    }
  }
}
