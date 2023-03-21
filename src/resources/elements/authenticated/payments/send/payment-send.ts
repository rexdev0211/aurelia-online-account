import {observable} from "aurelia-framework";
import {dispatchify} from "aurelia-store";
import {ControllerValidateResult} from "aurelia-validation";
import {ApplicationState, SelectedAccount, SelectedBeneficiary} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {
    filterLocalAccounts,
    filterManagedAccounts,
    formatAccountSummary,
    sortBy
} from "../../../../../common/services/shared";
import {DocumentStoreApi} from "../../../../../dtos/documentstore-api.dtos";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import environment from "../../../../../environment";
import {KendoDatePicker} from "../../../components/kendo/kendo-date-picker";
import {KendoDropDownList} from "../../../components/kendo/kendo-drop-down-list";
import {BeneficiaryViewType} from "../beneficiaries/beneficiary-state";
import {BkaSendFundsModel} from "./bka-send-funds-model";
import {ForSendFundsModel} from "./for-send-funds-model";
import * as moment from 'moment';
import ChapsStatusRequest = OnlineAccountApi.ChapsStatusRequest;
import ChapsStatusResponse = OnlineAccountApi.ChapsStatusResponse;
import ClearBankPaymentScheme = OnlineAccountApi.ClearBankPaymentScheme;
import ListBeneficiaryAccountsRequest = OnlineAccountApi.ListBeneficiaryAccountsRequest;
import ListBeneficiaryAccountsResponse = OnlineAccountApi.ListBeneficiaryAccountsResponse;
import BkaSendFundsResponse = OnlineAccountApi.BkaSendFundsResponse;

export class PaymentSendCustomElement extends BaseElement {
    @observable beneficiaryAccount: SelectedBeneficiary = null;
    @observable sourceAccount: SelectedAccount = null;
    @observable documentERNs: Array<string> = [];
    @observable scheme: ClearBankPaymentScheme = null;

    datePicker: KendoDatePicker;

    private readonly accounts: { text: string; value: string; name: string; currency: string; symbol: string }[];
    private readonly beneficiaryDataSource: kendo.data.DataSource;

    private beneficiary: KendoDropDownList;
    private symbol: string;
    private minDate: Date = new Date();
    private model: (BkaSendFundsModel | ForSendFundsModel);
    private paymentSchemes: string[];
    private showLinkBeneficiary: boolean;
    private showAddBeneficiary: boolean;
    private fees: BkaSendFundsResponse;

    constructor(...args) {
        super(...args);
        let _this = this;

        this.accounts = this.state.customerSummary.accounts
            .filter(filterLocalAccounts())
            .sort(sortBy(['accountName', 'currencyCode', 'code']))
            .map(formatAccountSummary())
            .concat(this.state.customerSummary.accounts
                .filter(filterManagedAccounts(['Send Funds (Request)', 'Send Funds (Authorize)', 'Send Funds (Admin)']))
                .sort(sortBy(['accountName', 'currencyCode', 'code']))
                .map(formatAccountSummary()));

        this.beneficiaryDataSource = new kendo.data.DataSource({
            autoSync: true,
            serverPaging: false,
            serverFiltering: true,
            schema: {
                total: "total", // total is returned in the "total" field of the response
                data: "data"
            },
            requestStart: function () {
                _this.progressService.startProgress();
            },
            requestEnd: function () {
                _this.progressService.stopProgress();
            },
            transport: {
                read: async (e: any) => {
                    if (!_this.sourceAccount) {
                        e.success({"total": 0, "data": []});
                        return;
                    }

                    let errorThrown: boolean = false;
                    let request = new ListBeneficiaryAccountsRequest({
                        accountERN: this.state.payments.send.sourceAccount.ern,
                    });

                    if (e.data.filter && e.data.filter.filters.length) {
                        let nickName = e.data.filter.filters[0].value;
                        if (nickName) request.nickName = nickName;
                    }

                    this.serviceClients.onlineAccountApi.post(request)
                        //NOTE: this try/catch style is required to make this work. DO NOT revert to async/await
                        .catch(response => {
                            errorThrown = true;
                            e.error(new Error(response.responseStatus.message));
                        })
                        .then(value => {
                            if (!errorThrown) {
                                let response = (value as ListBeneficiaryAccountsResponse);
                                e.success({"total": response.count, "data": response.results});
                            }
                        });
                }
            }
        })

        this.paymentSchemes = Object.keys(ClearBankPaymentScheme);
    }

    async beneficiaryChanged(e) {
        await dispatchify('setPaymentSendBeneficiary')(e.sender.dataItem());
    }

    async paymentDateChanged(e) {
        await this.validationController.validate({
            object: this.model,
            propertyName: "paymentDate"
        });

        if (this.model instanceof BkaSendFundsModel && (this.model as BkaSendFundsModel).scheme === ClearBankPaymentScheme.CHAPS) {
            await this.validateScheme((this.model as BkaSendFundsModel).scheme, ClearBankPaymentScheme.FPS);
        }
    }

    stateChanged(state: ApplicationState) {
        this.beneficiaryAccount = this.utils.getPropertyValue<SelectedBeneficiary>(state, "payments.send.beneficiaryAccount");
        this.sourceAccount = this.utils.getPropertyValue<SelectedAccount>(state, "payments.send.sourceAccount");
    }

    beneficiaryAccountChanged(value: SelectedBeneficiary, oldValue: SelectedBeneficiary) {
        if (value) {
            this.scheme = ClearBankPaymentScheme.FPS;
        }
    }

    async schemeChanged(value: ClearBankPaymentScheme, oldValue: ClearBankPaymentScheme) {
        if (this.model instanceof BkaSendFundsModel) (this.model as BkaSendFundsModel).scheme = value;
        await this.validateScheme(value, oldValue)
    }

    async validateScheme(value: ClearBankPaymentScheme, oldValue: ClearBankPaymentScheme) {
        if (value === ClearBankPaymentScheme.CHAPS) {
            // if not today, always allow?
            let paymentDate = (this.model as BkaSendFundsModel).paymentDate;
            let paymentLong = parseInt(paymentDate.toString())
            let momentDate = moment.utc(paymentLong);

            // Exit early if we are not scheduling for today.
            if (new Date().getDate() !== momentDate.day()) {
                return;
            }

            let response: ChapsStatusResponse = await this.serviceClients.onlineAccountApi.get(new ChapsStatusRequest({localTimeMs: paymentDate}));
            if (response.result) {
                if (!response.result.available) {
                    kendo.alert(`CHAPS is not supported at this time. Please try again Monday through Friday between 8:00 AM and 4:30 PM`);
                    this.scheme = oldValue;
                }
            }
        }
    }

    async sourceAccountChanged(value: SelectedAccount, oldValue: SelectedAccount) {
        if (!value) return;

        this.showLinkBeneficiary = value.isManagedAccount
            ? this.state.customerSummary.accounts.filter(filterManagedAccounts(['Beneficiary Link (Admin)', 'Beneficiary Link (Request)'])).some(x => true)
            : true;

        this.showAddBeneficiary = value.isManagedAccount
            ? this.state.customerSummary.accounts.filter(filterManagedAccounts(['Beneficiary Add (Admin)', 'Beneficiary Add (Request)'])).some(x => true)
            : true;

        if (oldValue && oldValue.isClearBankAccount === value.isClearBankAccount) {
            this.beneficiary.widget.setDataSource(this.beneficiaryDataSource);
            return;
        }


        this.model = value.isClearBankAccount
            // @ts-ignore
            ? new BkaSendFundsModel({accountERN: value.ern, paymentDate: this.minDate.getTime()})
            : new ForSendFundsModel({accountERN: value.ern});

        // if (this.model instanceof BkaSendFundsModel) {
        //     debugger;
        //     (this.model as BkaSendFundsModel).paymentDate = this.minDate.getTime();
        // }

        await dispatchify('setPaymentSendBeneficiary')(null);

        if (value.isClearBankAccount) {
            this.beneficiary.widget.setDataSource(this.beneficiaryDataSource);
        }
    }

    async sourceChanged(e) {
        let dataItem = e.sender.dataItem();

        if (!dataItem.value) {
            await dispatchify('clearPayments')();
            return;
        }

        this.symbol = dataItem.symbol;

        await dispatchify('setPaymentSendSource')(new SelectedAccount(this.state.customerSummary.accounts.find(x => x.ern === dataItem.value)));
    }

    async amountChanged(e) {
        await this.validationController.validate({
            object: this.model,
            propertyName: "amount"
        });
    }

    documentERNsChanged(value: Array<string>) {
        if (value.length) {
            (this.model as BkaSendFundsModel).documentERNs = value;
        }
    }

    uploadComplete(response: DocumentStoreApi.DocumentUploadResponse) {
        this.documentERNs = [...this.documentERNs, response.results[0].ern];
    }

    async sendSmsCode() {
        kendo.confirm('WARNING: This action will invalidate any previously sent codes.</br>Are you sure you want to send a new verification code?')
            .then(async t => {
                await this.resendSmsVerificationCode();
            });
    }

    async resendSmsVerificationCode() {
        (this.model as BkaSendFundsModel).smsVerificationCode = null;
        (this.model as BkaSendFundsModel).sendVerificationCode = true;

        this.fees = await this.serviceClients.onlineAccountApi.post(this.model);
        await this.notificationService.showMessage('success', 'SMS Verification Code Sent', `Please check your mobile phone [${this.state.customerSummary.mobilePhone}] for your SMS verification code.`);
        (this.model as BkaSendFundsModel).sendVerificationCode = false;
    }

    async back() {
        await dispatchify('setPaymentSendRequest')(null);
    }

    async submit() {
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.model});
        if (!validationResult.valid) return;

        // Lets validate amount
        if (!environment().debug)
            if (this.model.amount * 100 > this.state.payments.send.sourceAccount.presentBalance) {
                validationResult.results.push(
                    this.validationController.addError(
                        "Cannot send more than you have available",
                        this.model,
                        "amount"
                    )
                );
                return;
            }

        if (!this.sourceAccount.isClearBankAccount) {
            try {
                await ForSendFundsModel.post(this.validationController, this.model);
            } catch (e) {
                if (e.responseStatus) {
                    let tempString = e.responseStatus.message.split("|");
                    if (tempString.length > 1) {
                        let errorMessage = tempString[1];
                        validationResult.results.push(
                            this.validationController.addError(
                                errorMessage,
                                this.model,
                                tempString[0]
                            )
                        );
                    } else {
                        await this.notificationService.showMessage('error', e.responseStatus.errorCode, e.responseStatus.message);
                    }
                    validationResult.valid = false;
                }
            }
        }

        if (this.sourceAccount.isClearBankAccount) {

            // Handle Pre Request
            if (!this.state.payments.send.paymentRequest) {
                (this.model as BkaSendFundsModel).requireSmsVerificationCode = true;
                await dispatchify('setPaymentSendRequest')(this.model);
                await this.resendSmsVerificationCode();
            }
            // Handle Request
            else {
                try {
                    await BkaSendFundsModel.post(this.validationController, this.model);
                } catch (e) {
                    await this.notificationService.showMessage("error", e.responseStatus.errorCode, e.responseStatus.message);
                }
            }
        }

    }


    async linkBeneficiary() {
        await dispatchify('setBeneficiariesSource')(this.state.payments.send.sourceAccount);
        await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Link);
        location.hash = '#/payments/beneficiaries';
    }

    async addBeneficiary() {
        await dispatchify('setBeneficiariesSource')(this.state.payments.send.sourceAccount);
        await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Add);
        location.hash = '#/payments/beneficiaries';
    }

}

