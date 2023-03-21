import {bindable, bindingMode} from 'aurelia-framework';
import {ControllerValidateResult} from "aurelia-validation";
import clipboard from "clipboard-polyfill";
import qr from "qr-image";
import {BaseElement} from '../../../../../bases/base-element';
import {LoginModel} from "../../../../../common/models/account/login-model";
import {MfaEnrollRequestModel} from "../../../../../common/models/mfa/mfa-enrollment-model";
import {MfaPreValidationModel} from "../../../../../common/models/mfa/mfa-prevalidation-model";
import {MfaValidationModel} from "../../../../../common/models/mfa/mfa-validation-model";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import MfaEnrollResponse = OnlineAccountApi.MfaEnrollResponse;


export class ManageMfaCustomElement extends BaseElement {
    @bindable({defaultBindingMode: bindingMode.twoWay}) secretCode;
    @bindable({defaultBindingMode: bindingMode.twoWay}) otpAuth;
    @bindable({defaultBindingMode: bindingMode.twoWay}) qrImage;
    changeMFA: boolean = false;

    private enrollModel: MfaEnrollRequestModel = new MfaEnrollRequestModel();
    private validationModel: MfaValidationModel = new MfaValidationModel();
    private preEnrollModel: MfaPreValidationModel = new MfaPreValidationModel();

    private credential: LoginModel;

    constructor(...args) {
        super(...args);
        this.validationController.addObject(this.validationModel);
        this.preEnrollModel.emailAddress = this.state.customerSummary.emailAddress;
        this.enrollModel.emailAddress = this.state.customerSummary.emailAddress;
        this.validationModel.emailAddress = this.state.customerSummary.emailAddress;
    }

    async click() {
        try {
            this.changeMFA = true;
            await this.serviceClients.onlineAccountApi.post(this.preEnrollModel);
            await this.notificationService.showMessage('success',
                'Check your email for your MFA Enrollment verification code',
                `Email: ${this.preEnrollModel.emailAddress}`);
        } catch (e) {
            await this.notificationService.showMessage('success', e.responseStatus.errorCode, e.responseStatus.message);
        }
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

    async submit() {
        let validationResult: ControllerValidateResult = await this.validationController.validate();
        if (validationResult.valid) {
            try {
                await this.serviceClients.onlineAccountApi.post(this.validationModel);
                await this.notificationService.showMessage('success', 'MFA Updated Successfully', 'Please use your new MFA codes going forward!');
                location.hash = '#';
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
    }

}
