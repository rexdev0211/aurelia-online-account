import {ControllerValidateResult} from "aurelia-validation";
import {BaseElement} from '../../../../../bases/base-element';
import {ChangePasswordRequestModel} from "../../../../../common/models/auth/change-password-request-model";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";

export class ManagePasswordCustomElement extends BaseElement {
    private model: ChangePasswordRequestModel = new ChangePasswordRequestModel();

    constructor(...args) {
        super(...args);
    }

    async changePassword() {
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.model});
        if (validationResult.valid) {
            try {
                let response: OnlineAccountApi.ChangePasswordResponse = await this.serviceClients.onlineAccountApi.post(this.model);
                if (response.result) {
                    this.model = new ChangePasswordRequestModel();
                    await this.notificationService.showMessage("success", "Your password has been changed", "Please use your new password the next time you login!");
                }
            } catch (e) {
                await this.notificationService.showMessage("error", e.responseStatus.errorCode, e.responseStatus.message);
            }
        }
    }

}

