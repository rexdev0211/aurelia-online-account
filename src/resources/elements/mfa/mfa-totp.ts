import {bindingMode} from "aurelia-binding";
import {bindable} from "aurelia-framework";
import {dispatchify} from "aurelia-store";
import {ControllerValidateResult} from "aurelia-validation";
import {BaseElement} from "bases/base-element";
import clipboard from "clipboard-polyfill";
import qr from "qr-image";
import {LoginModel} from "../../../common/models/account/login-model";
import {MfaEnrollRequestModel} from "../../../common/models/mfa/mfa-enrollment-model";
import {MfaPreValidationModel} from "../../../common/models/mfa/mfa-prevalidation-model";
import {MfaValidationModel} from "../../../common/models/mfa/mfa-validation-model";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import AuthenticateMfa = OnlineAccountApi.AuthenticateMfa;
import AuthenticateResponse = OnlineAccountApi.AuthenticateResponse;
import MfaEnrollResponse = OnlineAccountApi.MfaEnrollResponse;


export class MfaTotpCustomElement extends BaseElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) secretCode;
    @bindable({defaultBindingMode: bindingMode.twoWay}) otpAuth;
    @bindable({defaultBindingMode: bindingMode.twoWay}) qrImage;

    private enrollModel: MfaEnrollRequestModel = new MfaEnrollRequestModel();
    private validationModel: MfaValidationModel = new MfaValidationModel();
    private preEnrollModel: MfaPreValidationModel = new MfaPreValidationModel();

    private credential: LoginModel;

    constructor(...args) {
        super(...args);
        this.validationController.addObject(this.validationModel);
    }

    async attached() {
        this.credential = this.container.get(LoginModel);
        this.validationModel.emailAddress = this.credential.userName;
        this.preEnrollModel.emailAddress = this.credential.userName;
        this.enrollModel.emailAddress = this.credential.userName;

        await this.serviceClients.onlineAccountApi.post(this.preEnrollModel);
    }

    async submitPreEnroll() {
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.enrollModel});
        if (validationResult.valid) {
            try {
                let response: MfaEnrollResponse = await this.serviceClients.onlineAccountApi.post(this.enrollModel);
                this.secretCode = response.result.manualEntryKey;
            } catch (e) {
                validationResult.results.push(
                    this.validationController.addError(
                        e.message || e.responseStatus.message || 'Invalid Pin',
                        this.enrollModel,
                        "pin"
                    )
                );
                validationResult.valid = false;
            }
        }
    }

    secretCodeChanged(newValue, oldValue) {
        if (newValue) {
            this.otpAuth = `otpauth://totp/Enumis:${this.validationModel.emailAddress}?secret=${newValue}&issuer=Enumis`;
            this.qrImage = qr.imageSync(this.otpAuth, {type: "svg"});
        }
    }

    copyToClipboard = async () => {
        try {
            await clipboard.writeText(this.secretCode);
            this.notificationService.showMessage(
                "success",
                "Success",
                "Secret key copied to clipboard"
            );
        } catch (e) {
            this.notificationService.showMessage("error", "Error", e.message);
        }
    };

    back = () => {
        history.back();
    };

    submit = async () => {
        let validationResult: ControllerValidateResult = await this.validationController.validate();
        if (validationResult.valid) {
            try {
                let credential: LoginModel = this.container.get(LoginModel);
                this.validationModel.emailAddress = credential.userName;

                let validationResponse = await this.serviceClients.onlineAccountApi.post(this.validationModel);
                if (validationResponse.result) {
                    await this.notificationService.showMessage("success", "Success", "Your MFA has been successfully registered.");
                    let request = new AuthenticateMfa({
                        userName: credential.userName,
                        password: credential.password,
                        mfaVerificationCode: this.validationModel.pin2
                    });

                    let response: AuthenticateResponse = await this.serviceClients.onlineAccountApi.post(request);
                    await dispatchify('setAuthUser')(response);
                    this.container.unregister(LoginModel);
                    this.utils.reloadAppAsync("authenticated");
                } else {
                    await this.notificationService.showMessage("error", "Invalid PINS", "Please try again waiting 30 seconds for a new set of pins");
                    this.validationModel.pin1 = '';
                    this.validationModel.pin2 = '';
                }

            } catch (e) {
                this.validationModel.pin1 = this.validationModel.pin2 = null;
                validationResult.results.push(
                    this.validationController.addError(
                        e.responseStatus.message,
                        this.validationModel,
                        "pin1"
                    )
                );
                validationResult.valid = false;
            }
        }
    };
}
