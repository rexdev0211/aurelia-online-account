import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class HeaderLogoCustomElement extends BaseElement {
  @bindable value;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @HeaderLogo!";
  }

  valueChanged(newValue:string, oldValue:string) {
  }
}

