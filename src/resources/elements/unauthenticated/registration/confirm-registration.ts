import {ControllerValidateResult} from "aurelia-validation";
import {BaseElement} from "bases/base-element";
import {OnlineAccountApi} from "dtos/onlineaccount-api.dtos";
import {LoginModel} from "../../../../common/models/account/login-model";
import {ResendSmsVerificationCode} from "../../../../common/models/registration/resend-sms-verification-code";
import {ConfirmRegistrationModel} from "./confirm-registration-model";
import FinishRegistrationResponse = OnlineAccountApi.FinishRegistrationResponse;
import ResendEmailVerificationCodeRequest = OnlineAccountApi.ResendEmailVerificationCodeRequest;

export class ConfirmRegistrationCustomElement extends BaseElement {
    private readonly model: ConfirmRegistrationModel;

    constructor(...args) {
        super(...args);

        // this.model.newPassword = "123456";
        // this.model.confirmPassword = "123456";
        // this.model.securityQuestion = "The Question";
        // this.model.securityAnswer = "The Answer";
        // this.model.agreePricingFees = true;
        // this.model.agreeTermsConditions = true;

        this.model = new ConfirmRegistrationModel({emailAddress: this.state.registration.request.emailAddress});

        this.validationController.addObject(this.model);
    }

    async resendConfirmationCode() {
        let resendEmailVerificationCodeRequest = new ResendEmailVerificationCodeRequest({emailAddress: this.state.registration.request.emailAddress});
        let res: OnlineAccountApi.ResendEmailVerificationCodeResponse = await this.serviceClients.onlineAccountApi.post(resendEmailVerificationCodeRequest);
        await this.notificationService.showMessage(
            "success",
            "Success",
            `Please check your email address [${this.state.registration.request.emailAddress}] for your verification code`,
            null
        );
    }

    async resendMobileConfirmationCode() {
        let resendSmsVerificationCodeRequest = new ResendSmsVerificationCode(this.state.registration.request.emailAddress);
        let res: OnlineAccountApi.ResendSmsVerificationCodeResponse = await this.serviceClients.onlineAccountApi.post(resendSmsVerificationCodeRequest);
        await this.notificationService.showMessage(
            "success",
            "Success",
            `Please check your mobile phone [${this.state.registration.request.mobilePhone}] for your verification code`,
            null
        );
    }

    async submit() {
        let validationResult: ControllerValidateResult = await this.validationController.validate();
        if (!validationResult.valid) return;

        try {

            let response: FinishRegistrationResponse = await this.serviceClients.onlineAccountApi.post(this.model as OnlineAccountApi.FinishRegistrationRequest);
            if (response.result) {

                let user = new LoginModel({
                    userName: this.model.emailAddress,
                    password: this.model.confirmPassword
                });

                this.container.registerInstance(LoginModel, user.toDto());
                location.hash = "#/finish/registration";
            }
        } catch (e) {
            let messageSplit = e.responseStatus.message.split("|");
            if (messageSplit.length) {
                let errorMessage = messageSplit[1];
                validationResult.results.push(
                    this.validationController.addError(
                        errorMessage,
                        this.model,
                        messageSplit[0]
                    )
                );
            } else {
                validationResult.results.push(
                    this.validationController.addError(
                        e.responseStatus.message,
                        this.model,
                        "sourceERN"
                    )
                );
            }
            validationResult.valid = false;
        }
    }
}
