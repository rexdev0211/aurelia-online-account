import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class FormGroupCustomElement extends BaseElement {
  @bindable header: string;
  @bindable boldHeader: string;
  @bindable addClass:string;

  constructor(...args) {
    super(...args);
  }

}

