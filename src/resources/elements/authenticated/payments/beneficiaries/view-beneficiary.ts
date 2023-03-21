import {dispatchify} from "aurelia-store";
import {bindable} from "aurelia-templating";
import {BeneficiaryViewType} from "./beneficiary-state";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import LinkBeneficiaryRequest = OnlineAccountApi.LinkBeneficiaryRequest;
import LinkBeneficiaryResponse = OnlineAccountApi.LinkBeneficiaryResponse;

export class ViewBeneficiaryCustomElement extends BaseElement {
    @bindable showDelete: boolean;

    constructor(...args) {
        super(...args);
    }

    async back() {
        await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Manage);
    }

    delete() {
        if (!this.showDelete) return;

        kendo.confirm(`Are you sure you want to remove the beneficiary <strong>${this.state.beneficiaries.selectedBeneficiary.nickName}</strong><br>from account <strong>${this.state.beneficiaries.sourceAccount.code}</strong>`)
            .then(async t => {
                let response: LinkBeneficiaryResponse = await this.serviceClients.onlineAccountApi.delete(new LinkBeneficiaryRequest({
                    accountERN: this.state.beneficiaries.sourceAccount.ern,
                    beneficiaryAccountERN: this.state.beneficiaries.selectedBeneficiary.ern
                }));

                if (response.result) this.back();
            });
    }
}

