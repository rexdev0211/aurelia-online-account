import {bindable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ControllerValidateResult} from "aurelia-validation";
import {SelectedAccount} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {BeneficiaryViewType} from "./beneficiary-state";
import {LinkBeneficiaryModel} from "./link-beneficiary-model";
import BeneficiaryAccount = OnlineAccountApi.BeneficiaryAccount;
import LinkBeneficiaryResponse = OnlineAccountApi.LinkBeneficiaryResponse;
import ListAccountOwnerBeneficiaryAccountsRequest = OnlineAccountApi.ListAccountOwnerBeneficiaryAccountsRequest;
import ListAccountOwnerBeneficiaryAccountsResponse = OnlineAccountApi.ListAccountOwnerBeneficiaryAccountsResponse;

export class LinkBeneficiaryCustomElement extends BaseElement {
    @bindable value;

    private model: LinkBeneficiaryModel;
    private beneficiaryDataSource: kendo.data.DataSource;
    private beneficiary: BeneficiaryAccount;

    constructor(...args) {
        super(...args);

        let _this = this;

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
                    if (!_this.utils.getPropertyValue<SelectedAccount>(this.state, '.beneficiaries.sourceAccount')) {
                        e.success({"total": 0, "data": []});
                        return;
                    }

                    let errorThrown: boolean = false;
                    let request = new ListAccountOwnerBeneficiaryAccountsRequest({
                        accountERN: this.state.beneficiaries.sourceAccount.ern,
                        getDelta: true
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
                                let response = (value as ListAccountOwnerBeneficiaryAccountsResponse);
                                e.success({"total": response.count, "data": response.results});
                            }
                        });
                }
            }
        })
    }

    attached() {
        this.model = new LinkBeneficiaryModel({
            accountERN: this.state.beneficiaries.sourceAccount.ern
        });
    }

    async back() {
        await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Manage);
    }

    beneficiaryChanged(e) {
        this.beneficiary = e.sender.dataItem();
    }

    async submit() {
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.model});
        if (!validationResult.valid) return;

        kendo.confirm(`Are you sure you want to link the beneficiary <strong>${this.beneficiary.nickName}</strong><br>with account <strong>${this.state.beneficiaries.sourceAccount.code}</strong>`)
            .then(async t => {
                let response: LinkBeneficiaryResponse = await this.serviceClients.onlineAccountApi.post(this.model);
                if (response.result) await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Manage);
            });
    }
}
