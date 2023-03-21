import { bindable } from "aurelia-framework";
import { BaseElement } from "bases/base-element";

export class MfaSetupCustomElement extends BaseElement {
  constructor(...args) {
    super(...args);
  }

  click() {
    location.hash = "#/mfa/sms";
  }
}
