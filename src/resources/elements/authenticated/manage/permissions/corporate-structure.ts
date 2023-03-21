import {bindable, bindingMode} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class CorporateStructureCustomElement extends BaseElement {
    @bindable header = 'Corporate Structure';
    @bindable includeRow = true;
    @bindable selectable = false;
    @bindable({defaultBindingMode: bindingMode.twoWay}) value;

    constructor(...args) {
        super(...args);
    }

    select(member) {
        if (!this.selectable) return;
        this.value = member;
    }

}

