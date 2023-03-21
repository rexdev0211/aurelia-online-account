import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class FooterItemCustomElement extends BaseElement {
  @bindable value;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @FooterItem!";
  }

  valueChanged(newValue:string, oldValue:string) {
  }
}

