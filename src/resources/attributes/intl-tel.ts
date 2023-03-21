import {
  customAttribute,
  bindable,
  bindingMode,
  inject,
  DOM
} from "aurelia-framework";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/js/utils";

@inject(DOM.Element)
@customAttribute("intl-tel", bindingMode.twoWay)
export class IntlTelCustomAttribute {
  iti: intlTelInput;
  @bindable({ primaryProperty: true, defaultBindingMode: bindingMode.twoWay })
  value;

  constructor(private element: HTMLInputElement) {}

  attached() {
    this.iti = intlTelInput(this.element);
    this.element.addEventListener("blur", () => this.blur());
  }

  detached() {
    this.element.removeEventListener("blur", () => this.blur());
    this.iti.destroy();
  }

  blur = () => {
    this.value = this.element.value = this.iti.getNumber();
    this.element.dispatchEvent(new CustomEvent("change", { bubbles: true }));
  };
}
