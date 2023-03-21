import {dispatchify} from "aurelia-store";
import {ControllerValidateResult} from "aurelia-validation";
import {BeneficiaryViewType} from "./beneficiary-state";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {EditBeneficiaryModel} from "./edit-beneficiary-model";
import EditBeneficiaryResponse = OnlineAccountApi.EditBeneficiaryResponse;

export class EditBeneficiaryCustomElement extends BaseElement {
    public model: EditBeneficiaryModel;

    constructor(...args) {
        super(...args);
    }

    attached() {
        this.model = new EditBeneficiaryModel({
            beneficiaryAccountERN: this.state.beneficiaries.selectedBeneficiary.ern,
            nickName: this.state.beneficiaries.selectedBeneficiary.nickName,
            documentERNs: []
        });
    }

    async back() {
        await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Manage);
    }

    async submit() {
        let validationResult: ControllerValidateResult = await this.validationController.validate({object: this.model});
        if (!validationResult.valid) return;

        let response: EditBeneficiaryResponse = await this.serviceClients.onlineAccountApi.put(this.model);
        if (response.result) await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Manage);
    }
}

