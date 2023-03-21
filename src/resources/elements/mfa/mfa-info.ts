import { bindable } from "aurelia-framework";
import {dispatchify} from "aurelia-store";
import { BaseElement } from "bases/base-element";

export class MfaInfoCustomElement extends BaseElement {
  constructor(...args) {
    super(...args);
  }

  async click() {
    await dispatchify("mfaTypeSelected")('totp');
    location.hash = "#/mfa/setup";
  }
}
