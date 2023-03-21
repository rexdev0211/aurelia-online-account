import {bindingMode} from "aurelia-binding";
import {bindable} from "aurelia-templating";
import NumericTextBox = kendo.ui.NumericTextBox;

export class KendoMoneyInput {
  @bindable({defaultBindingMode: bindingMode.twoWay}) value;
  @bindable placeHolder: string;
  @bindable header: string;
  @bindable symbol: string;
  @bindable min: number;
  widget: NumericTextBox;

  @bindable onChange = (e) => {
  };

  @bindable onReady = (e) => {
  };

  symbolChanged(value) {
    if (this.widget) {
      let thisculture = kendo.culture();
      thisculture.numberFormat.currency.symbol = value;
      // @ts-ignore
      this.widget.options.culture = thisculture;
      this.widget.value(this.widget.value());
    }
  }
}
