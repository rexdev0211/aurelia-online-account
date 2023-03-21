import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class HeaderCustomElement extends BaseElement {
  @bindable value;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @Header!";
  }

  valueChanged(newValue:string, oldValue:string) {
  }
}

