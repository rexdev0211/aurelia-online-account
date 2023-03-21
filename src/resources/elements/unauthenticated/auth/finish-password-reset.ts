import {
  bindable
} from 'aurelia-framework';
import {
  BaseElement
} from './../../../../bases/base-element';

export class FinishPasswordResetCustomElement extends BaseElement {
  @bindable value:string;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @FinishPasswordReset!";
  }

  valueChanged(newValue:string, oldValue:string) {
  }
}

