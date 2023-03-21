import {bindable} from 'aurelia-framework';
import {BaseElement} from './../../../../../bases/base-element';

export class AuthenticatorDevicesCustomElement extends BaseElement {
  @bindable value;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @AuthenticatorDevices!";
  }

  valueChanged(newValue:string, oldValue:string) {
  }
}

