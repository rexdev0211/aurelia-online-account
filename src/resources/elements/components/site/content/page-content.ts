import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';

export class PageContentCustomElement extends BaseElement {
  @bindable css:string;

  constructor(...args) {
    super(...args);
  }

}

