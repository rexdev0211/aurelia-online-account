import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class NavbarItemsCustomElement extends BaseElement {
  @bindable items:any;

  constructor(...args) {
    super(...args);
  }
}

