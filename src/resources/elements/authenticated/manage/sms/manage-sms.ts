import {ControllerValidateResult} from "aurelia-validation";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {UpdateMobilePhoneAuthModel} from "./update-mobile-phone-auth-model";
import {UpdateMobilePhoneModel} from "./update-mobile-phone-model";
import UpdateMobilePhoneAuthResponse = OnlineAccountApi.UpdateMobilePhoneAuthResponse;

export class ManageSmsCustomElement extends BaseElement {
    private authModel: UpdateMobilePhoneAuthModel;
    private model: UpdateMobilePhoneModel;

    constructor(...args) {
        super(...args);
    }

    confirmMobilePhoneChanged() {
        this.taskQueue.queueMicroTask(async () => await this.validationController.validate({object: this.authModel}));
    }


    async click() {

        if (!this.authModel) {
            this.authModel = new UpdateMobilePhoneAuthModel();
            return;
        }

        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.authModel});
        if (!validationResult.valid) return;

        this.authModel.sendSmsVerificationCode = this.authModel.sendEmailVerificationCode = true;
        let response: UpdateMobilePhoneAuthResponse = await this.serviceClients.onlineAccountApi.post(this.authModel);

        this.authModel = new UpdateMobilePhoneAuthModel(response.result);

        await this.notificationService.showMessage('success',
            'Check your EMAIL / PHONE for your SMS Enrollment verification code(s)',
            `Email: ${this.state.customerSummary.emailAddress}<br>Phone: ${this.authModel.mobilePhone}`);
    }

    back() {
        this.authModel = new UpdateMobilePhoneAuthModel();
    }

    async resendEmailVerificationCode() {
        try {

            this.authModel.sendEmailVerificationCode = true;

            this.authModel.sendSmsVerificationCode = false;

            await this.serviceClients.onlineAccountApi.post(this.authModel);

            await this.notificationService.showMessage('success',
                'Check your EMAIL for your SMS Enrollment verification code',
                `Email: ${this.state.customerSummary.emailAddress}`);

        } catch (e) {
            await this.notificationService.showMessage('success', e.responseStatus.errorCode, e.responseStatus.message);
        }
    }

    async resendSmsVerificationCode() {
        try {

            this.authModel.sendSmsVerificationCode = true;

            this.authModel.sendEmailVerificationCode = false;

            let response: UpdateMobilePhoneAuthResponse = await this.serviceClients.onlineAccountApi.post(this.authModel);

            this.authModel = new UpdateMobilePhoneAuthModel(response.result);

            await this.notificationService.showMessage(
                "success",
                "Success",
                `Please check your mobile phone [${this.authModel.mobilePhone}] for your verification code`,
                null
            );

        } catch (e) {
            await this.notificationService.showMessage('success', e.responseStatus.errorCode, e.responseStatus.message);
        }
    }

    async submitPreEnroll() {
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.authModel});
        if (!validationResult.valid) return;

        try {
            this.authModel.sendEmailVerificationCode = false;
            this.authModel.sendSmsVerificationCode = false;
            await this.serviceClients.onlineAccountApi.post(this.authModel);
            this.model = new UpdateMobilePhoneModel({crc: this.authModel.crc, mobilePhone: this.authModel.mobilePhone});
        } catch (e) {
            validationResult.results.push(
                this.validationController.addError(
                    e.message || e.responseStatus.message || 'Invalid Pin',
                    this.authModel,
                    "emailVerificationCode"
                )
            );
            validationResult.valid = false;
        }
    }

    async submit() {
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.model});
        if (!validationResult.valid) return;

        try {
            await this.serviceClients.onlineAccountApi.post(this.model);
            await this.notificationService.showMessage(
                'success',
                'SMS Updated Successfully',
                `SMS messages will now be delivered to <strong>${this.model.mobilePhone}</strong> going forward!`);
            location.hash = '#';
        } catch (e) {
            validationResult.results.push(
                this.validationController.addError(
                    e.message || e.responseStatus.message || 'Invalid Pin',
                    this.model,
                    "mfaVerificationCode"
                )
            );
            validationResult.valid = false;
        }
    }

}

