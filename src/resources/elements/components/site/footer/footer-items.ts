import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class FooterItemsCustomElement extends BaseElement {
  @bindable value;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @FooterItems!";
  }

  valueChanged(newValue:string, oldValue:string) {
  }
}

