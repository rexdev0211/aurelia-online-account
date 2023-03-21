import {dispatchify} from "aurelia-store";
import {ControllerValidateResult} from "aurelia-validation";
import {LoginModel} from "../../../../common/models/account/login-model";
import {MfaAuthenticateModel} from "../../../../common/models/mfa/mfa-authentication-model";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import {BaseElement} from "../../../../bases/base-element";
import AuthenticateMfa = OnlineAccountApi.AuthenticateMfa;
import AuthenticateResponse = OnlineAccountApi.AuthenticateResponse;

export class LoginMfaCustomElement extends BaseElement {
    private model: MfaAuthenticateModel = new MfaAuthenticateModel();

    constructor(...args) {
        super(...args);
        this.validationController.addObject(this.model);
    }

    async submit() {
        let validationResult: ControllerValidateResult = await this.validationController.validate();
        if (validationResult.valid) {
            try {
                let credential: LoginModel = this.container.get(LoginModel);

                let request = new AuthenticateMfa({
                    userName: credential.userName,
                    password: credential.password,
                    mfaVerificationCode: this.model.mfaVerificationCode
                });

                let response: AuthenticateResponse = await this.serviceClients.onlineAccountApi.post(request);

                if (response.refreshToken) {
                    await this.notificationService.showMessage('success', 'Success', 'Login Successful');
                    await dispatchify('setAuthUser')(response);

                    this.container.unregister(LoginModel);
                    this.utils.reloadAppAsync("authenticated");
                    location.reload();
                }
            } catch (e) {
                validationResult.results.push(
                    this.validationController.addError(
                        e.responseStatus.message,
                        this.model,
                        "mfaVerificationCode"
                    )
                );
                validationResult.valid = false;
            }
        }
    }
}
