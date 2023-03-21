import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class FooterCustomElement extends BaseElement {
  @bindable value;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @Footer!";
  }

  valueChanged(newValue:string, oldValue:string) {
  }
}

