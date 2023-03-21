import {bindable} from 'aurelia-framework';
import {ValidationRules} from "aurelia-validation";
import {BaseElement} from "../../../bases/base-element";

export class PendingTransactionMessageCustomElement extends BaseElement {
    @bindable outgoing = true;
    @bindable source;
    @bindable parent;
    model;

    constructor(...args) {
        super(...args);
    }

    attached() {
        this.model = new PendingTransactionMessageModel();
    }

    stateChanged(newState, oldState) {
    }

    async validate() {
        let validationResult = await this.validationController.validate({object: this.model});
        return validationResult.valid;
    }
}

export class PendingTransactionMessageModel {
    message:string;
}

ValidationRules.ensure((x:PendingTransactionMessageModel) => x.message).required().on(PendingTransactionMessageModel);

