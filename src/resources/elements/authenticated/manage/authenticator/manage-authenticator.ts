import {bindable} from 'aurelia-framework';
import {BaseElement} from "../../../../../bases/base-element";
import {dispatchify} from "aurelia-store";

export class ManageAuthenticatorCustomElement extends BaseElement {
  @bindable value: string;

  constructor(...args) {
    super(...args);
    dispatchify('getAuthDevices')();
  }

  attached() {
    this.value = "Hello World! @ManageAuthenticator!";
  }

  valueChanged(newValue: string, oldValue: string) {
  }
}

