import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../bases/base-element';

export class GpsTransactionRowCustomElement extends BaseElement {
  @bindable model;
  @bindable account;

  constructor(...args) {
    super(...args);
  }

}

