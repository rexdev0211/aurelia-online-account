//import {
//  bindable
//} from 'aurelia-framework';
import {BasePage} from '../../../../bases/base-page';
import {EditBeneficiaryCustomElement} from "../../../../resources/elements/authenticated/payments/beneficiaries/edit-beneficiary";

export class EditBeneficiaryPage extends BasePage {
    private viewModel: EditBeneficiaryCustomElement;

    constructor(...args) {
        super(...args);
    }

    canActivate() {
        return this.canActivateState(s => this.utils.propExists(s, "selectedBeneficiary"), '#/account/send/funds');
    }

    canDeactivate() {
        if (this && this.viewModel.model.documentERNs.length) {
            return kendo.confirm('You have unsaved documents.  Are you sure you want to leave this screen?')
                .then(t => true, t => false);
        }
        return true;
    }
}

