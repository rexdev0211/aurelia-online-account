import {bindingMode} from "aurelia-binding";
import {bindable} from "aurelia-templating";
import MaskedTextBox = kendo.ui.MaskedTextBox;

export class KendoMaskedTextBox {
    @bindable({defaultBindingMode: bindingMode.twoWay}) value;
    @bindable placeHolder: string;
    @bindable header: string;
    @bindable css;
    @bindable mask = '';
    @bindable hasFocus: boolean = false;
    widget: MaskedTextBox;

    @bindable onChange = (e) => {
    };

    @bindable onReady = (e) => {
    };

    onFocus() {
        this.hasFocus = true;
    }

    onBlur() {
        this.hasFocus = false;
    }


}