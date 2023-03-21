import {bindable} from 'aurelia-framework';
import {BaseElement} from "../../../../../bases/base-element";

export class ManageDigitalCertificatesCustomElement extends BaseElement {
  @bindable value: string;
  add: boolean = false;

  constructor(...args) {
    super(...args);
  }

}

