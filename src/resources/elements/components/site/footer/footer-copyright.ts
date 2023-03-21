import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class FooterCopyrightCustomElement extends BaseElement {
  @bindable value;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @FooterCopyright!";
  }

  valueChanged(newValue:string, oldValue:string) {
  }
}

