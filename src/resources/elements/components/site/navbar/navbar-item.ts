import {bindable} from 'aurelia-framework';
import {BaseElement} from "../../../../../bases/base-element";

export class NavbarItemCustomElement extends BaseElement {
  @bindable href:string;
  @bindable text:string;
  @bindable icon:string;

  constructor(...args) {
    super(...args);
  }
}

