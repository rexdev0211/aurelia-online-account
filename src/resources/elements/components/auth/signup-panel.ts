import {bindable} from "aurelia-framework";
import {BaseElement} from "../../../../bases/base-element";

export class SignupPanelCustomElement extends BaseElement {
  @bindable
  value;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @SignupPanel!";
  }

  valueChanged(newValue: string, oldValue: string) {}

  click() {
    location.hash = "#/start/registration";
  }
}
