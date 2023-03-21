import {bindingMode} from "aurelia-binding";
import {bindable} from "aurelia-templating";
import DropDownList = kendo.ui.DropDownList;

export class CraRiskFactor {
    // @bindable({defaultBindingMode: bindingMode.twoWay}) value;
    @bindable countries;
    @bindable industries;
    @bindable riskFactor;
    @bindable selectedIndex;
    @bindable debugMode;

    @bindable onChange = (e) => {
    };

    @bindable onReady = (e) => {
    };

}