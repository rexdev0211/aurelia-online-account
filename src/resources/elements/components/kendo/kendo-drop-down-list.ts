import {bindingMode} from "aurelia-binding";
import {bindable} from "aurelia-templating";
import DropDownList = kendo.ui.DropDownList;

export class KendoDropDownList {
    @bindable({defaultBindingMode: bindingMode.twoWay}) value;
    @bindable filter;
    @bindable placeHolder: string;
    @bindable header: string;
    @bindable items: any[];
    @bindable textField: string = 'text';
    @bindable valueField: string = 'value';
    widget: DropDownList

    @bindable onChange = (e) => {
    };

    @bindable onReady = (e) => {
    };

}