import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../bases/base-element';

export class LoginContainerCustomElement extends BaseElement {
  @bindable value;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @LoginContainer!";
  }

  valueChanged(newValue:string, oldValue:string) {
  }
}

