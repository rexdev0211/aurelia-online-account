import {autoinject, bindable, computedFrom, observable} from 'aurelia-framework';
import * as $ from "jquery";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {AmountFormatValueConverter} from "../../../../value-converters/currency-format";
import BusinessJobApproveRequest = OnlineAccountApi.BusinessJobApproveRequest;
import BusinessJobApproveResponse = OnlineAccountApi.BusinessJobApproveResponse;
import BusinessJobRejectRequest = OnlineAccountApi.BusinessJobRejectRequest;
import BusinessJobRejectResponse = OnlineAccountApi.BusinessJobRejectResponse;
import Job = OnlineAccountApi.Job;

@autoinject
export class AuthorizeBulkPaymentDetailCustomElement extends BaseElement {
    @bindable job: Job;
    @bindable action;

    @observable sendAuthorizationCode: boolean = true;
    smsVerificationCodeInput: HTMLInputElement;
    smsVerificationCodeFocus: boolean;
    smsVerificationCode: string;
    mfaVerificationCode: string;
    private beneficiaries: Map<any, any>;

    constructor(private amountFormat: AmountFormatValueConverter, ...args) {
        super(...args);
        this.beneficiaries = new Map();
    }

    @computedFrom('action', 'sendAuthorizationCode', 'smsVerificationCode', 'mfaVerificationCode')
    get submitDisabled() {
        if (this.action === 'Authorise') {
            if (this.sendAuthorizationCode) return false;
            return !(this.smsVerificationCode && this.smsVerificationCode.length === 6 && this.mfaVerificationCode && this.mfaVerificationCode.length === 6);
        }
        return false;
    }

    @computedFrom('action', 'sendAuthorizationCode')
    get authStyle() {
        let style = 'margin-left: auto;';

        if (this.action !== 'Authorise') {
            return style;
        } else if (this.sendAuthorizationCode) {
            return style;
        }

        return null;
    }

    async attached() {
        const array = [];
        const rows = this.job.input.CsvContents.split(/(?!\B"[^"]*)\n(?![^"]*"\B)/g);

        rows.forEach((row, idx) => {
            const values = row.split(',');
            const checkedAndConvertedValues = [];
            values.forEach((value) => {
                const convertedToNumber = parseFloat(value);
                const thisValue = Number.isNaN(convertedToNumber) ? value : convertedToNumber;

                checkedAndConvertedValues.push(thisValue);
            });
            array.push(checkedAndConvertedValues);
        });

        // Process Rows
        for (let idx = 1; idx < rows.length; idx++) {
            let cols = rows[idx].split(',');
            let accno = cols[0];
            let beneficiaryName = cols[1];
            if (!this.beneficiaries.has(beneficiaryName)) {
                // Get AccountERN
                let accountERN = this.state.customerSummary.accounts.find(x => x.code == accno).ern;
                // Get Beneficiary
                let response = await this.serviceClients.onlineAccountApi.post(new OnlineAccountApi.ListBeneficiaryAccountsRequest({accountERN: accountERN, nickName: beneficiaryName}));
                // Save Beneficiary
                if (response.results.length) this.beneficiaries.set(beneficiaryName, response.results[0]);
            }

            // Append Beneficiary Name
            if (this.beneficiaries.has(beneficiaryName)) {
                cols[1] = `${cols[1]} @ ${this.beneficiaries.get(beneficiaryName).iban}`;
                rows[idx] = cols.join(",");
            }
        }

        // Update Job
        this.job.input.CsvContents = rows.join('\r\n');
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
        kendo.confirm(`Are you sure you want to <strong>authorise</strong> bulk payments totaling ${jobAmount}`)
            .then(async () => {
                try {
                    let result: BusinessJobApproveResponse = await _this.serviceClients.onlineAccountApi.post(new BusinessJobApproveRequest({
                        jobERN: this.job.jobERN,
                        sendVerificationCode: true
                    }));
                    if (result.sendSmsVerificationCode) {
                        await _this.notificationService.showMessage('success', 'SMS Verification Code Sent', `Please check your mobile phone [${this.state.customerSummary.mobilePhone}] for your SMS verification code.`);
                        _this.sendAuthorizationCode = false;
                        // _this.inputFocus();
                    }
                } catch (e) {
                }
            });
    }

    approve() {
        let _this = this;
        let jobAmount = this.amountFormat.toView(parseFloat(this.job.input.Amount || this.job.input.Amount2), this.utils.getPropertyValue<string>(this.job, '.meta.Currency.symbol'));
        kendo.confirm(`Are you sure you want to <strong>authorise</strong> bulk payments totaling ${jobAmount}`)
            .then(async t => {
                try {
                    await _this.serviceClients.onlineAccountApi.post(new BusinessJobApproveRequest({
                        jobERN: _this.job.jobERN,
                        smsVerificationCode: _this.smsVerificationCode,
                        mfaVerificationCode: _this.mfaVerificationCode
                    }));
                    $('.k-i-reload').click();
                } catch (e) {
                    _this.smsVerificationCode = null;
                    // _this.inputFocus();
                }
            });

    }

    reject() {
        let _this = this;
        let jobAmount = this.amountFormat.toView(parseFloat(this.job.input.Amount || this.job.input.Amount2), this.utils.getPropertyValue<string>(this.job, '.meta.Currency.symbol'));
        kendo.confirm(`Are you sure you want to <strong>authorise</strong> bulk payments totaling ${jobAmount}`)
            .then(async t => {
                let response: BusinessJobRejectResponse = await _this.serviceClients.onlineAccountApi.post(new BusinessJobRejectRequest({
                    jobERN: _this.job.jobERN
                }));
                if (response.result)
                    $('.k-i-reload').click();
            });
    }


}

