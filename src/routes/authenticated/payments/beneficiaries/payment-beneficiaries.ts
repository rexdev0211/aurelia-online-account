import {dispatchify} from "aurelia-store";
import {BasePage} from '../../../../bases/base-page';
import {BeneficiaryViewType} from "../../../../resources/elements/authenticated/payments/beneficiaries/beneficiary-state";

export class PaymentBeneficiariesPage extends BasePage {

    constructor(...args) {
        super(...args);
    }

    async activate() {
        let view = this.utils.getPropertyValue<BeneficiaryViewType>(this.state, '.beneficiaries.view');
        await dispatchify('setBeneficiariesView')(view || BeneficiaryViewType.Manage);
    }

    async deactivate() {
        await dispatchify('clearBeneficiaries')();
    }
}

