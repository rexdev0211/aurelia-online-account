import {
  bindable
} from 'aurelia-framework';
import {
  BaseElement
} from '../../../bases/base-element';

export class DashboardCustomElement extends BaseElement {
  @bindable value:string;

  constructor(...args) {
    super(...args);
  }

  attached() {
    this.value = "Hello World! @Dashboard!";
  }
}

