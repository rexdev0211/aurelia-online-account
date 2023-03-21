import {ControllerValidateResult} from "aurelia-validation";
import {BaseElement} from "../../../../bases/base-element";
import {ChangePasswordRequestModel} from "../../../../common/models/auth/change-password-request-model";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";

export class CustomerCustomElement extends BaseElement {
  private model: ChangePasswordRequestModel = new ChangePasswordRequestModel();

  constructor(...args) {
    super(...args);

    this.validationController.addObject(this.model);
  }

  async changePassword() {
    let validationResult: ControllerValidateResult = await this.validationController.validate();
    if (validationResult.valid) {
      try {
        let response: OnlineAccountApi.ChangePasswordResponse = await this.serviceClients.onlineAccountApi.post(this.model);
        if (response.result) {
          this.model = new ChangePasswordRequestModel();
          this.notificationService.showMessage("success", "Your password has been changed", "Please use your new password the next time you login!");
        }
      } catch (e) {
        this.notificationService.showMessage("error", e.response.errorCode, e.responseStatus.message);
      }
    }
  }
}
