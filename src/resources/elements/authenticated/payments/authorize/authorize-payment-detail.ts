import {autoinject, bindable, Container, observable} from 'aurelia-framework';
import * as $ from "jquery";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {AmountFormatValueConverter} from "../../../../value-converters/currency-format";
import {PaymentAuthorizeCustomElement} from "./payment-authorize";
import BusinessJobApproveRequest = OnlineAccountApi.BusinessJobApproveRequest;
import BusinessJobApproveResponse = OnlineAccountApi.BusinessJobApproveResponse;
import BusinessJobRejectRequest = OnlineAccountApi.BusinessJobRejectRequest;
import BusinessJobRejectResponse = OnlineAccountApi.BusinessJobRejectResponse;
import Job = OnlineAccountApi.Job;

@autoinject
export class AuthorizePaymentDetailCustomElement extends BaseElement {
    @bindable job: Job;
    @bindable action;

    @observable sendAuthorizationCode: boolean;
    smsVerificationCodeInput: HTMLInputElement;
    smsVerificationCodeFocus: boolean;
    smsVerificationCode: string;

    constructor(private amountFormat: AmountFormatValueConverter, ...args) {
        super(...args);
    }

    attached() {
    }

    inputFocus() {
        this.smsVerificationCodeFocus = false;
        this.smsVerificationCodeFocus = true;
    }

    click() {
        if (this.sendAuthorizationCode) return this.sendCode();
        if (this.action === 'Authorise') return this.approve();
        if (this.action === 'Reject') return this.reject();
    }

    actionChanged(value: string, oldValue: string) {
        this.sendAuthorizationCode = (value === 'Authorise');
    }

    sendCode() {
        let _this = this;
        let jobAmount = this.amountFormat.toView(parseFloat(this.job.input.Amount || this.job.input.Amount2), this.utils.getPropertyValue<string>(this.job, '.meta.Currency.symbol'));
        kendo.confirm(`Are you sure you want to <strong>authorise</strong> payment of ${jobAmount} to account ${this.job.meta.DestinationAccountSummary['code']}`)
            .then(async () => {
                try {
                    let result: BusinessJobApproveResponse = await _this.serviceClients.onlineAccountApi.post(new BusinessJobApproveRequest({
                        jobERN: this.job.jobERN,
                        sendVerificationCode: true
                    }));
                    await _this.notificationService.showMessage('success', 'SMS Verification Code Sent', `Please check your mobile phone [${this.state.customerSummary.mobilePhone}] for your SMS verification code.`);
                    _this.sendAuthorizationCode = false;
                    _this.inputFocus();
                } catch (e) {
                }
            });
    }

    approve() {
        let _this = this;
        let jobAmount = this.amountFormat.toView(parseFloat(this.job.input.Amount || this.job.input.Amount2), this.utils.getPropertyValue<string>(this.job, '.meta.Currency.symbol'));
        kendo.confirm(`Are you sure you want to <strong>authorise</strong> payment of ${jobAmount} to account ${this.job.meta.DestinationAccountSummary['code']}`)
            .then(async t => {
                try {
                    await _this.serviceClients.onlineAccountApi.post(new BusinessJobApproveRequest({
                        jobERN: _this.job.jobERN,
                        smsVerificationCode: _this.smsVerificationCode
                    }));
                    $('.k-i-reload').click();
                } catch (e) {
                    _this.smsVerificationCode = null;
                    _this.inputFocus();
                }
            });

    }

    reject() {
        let _this = this;
        let jobAmount = this.amountFormat.toView(parseFloat(this.job.input.Amount || this.job.input.Amount2), this.utils.getPropertyValue<string>(this.job, '.meta.Currency.symbol'));
        kendo.confirm(`Are you sure you want to <strong>reject</strong> payment of ${jobAmount} to account ${this.job.meta.DestinationAccountSummary['code']}`)
            .then(async t => {
                let response: BusinessJobRejectResponse = await _this.serviceClients.onlineAccountApi.post(new BusinessJobRejectRequest({
                    jobERN: _this.job.jobERN
                }));
                if (response.result)
                    $('.k-i-reload').click();
            });
    }

}

