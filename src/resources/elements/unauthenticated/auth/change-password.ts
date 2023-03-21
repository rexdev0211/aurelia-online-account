import { ControllerValidateResult } from 'aurelia-validation';
import {
  bindable
} from 'aurelia-framework';
import {
  BaseElement
} from 'bases/base-element';

export class ChangePasswordCustomElement extends BaseElement {
  private model
  constructor(...args) {
    super(...args);
    this.validationController.addObject(this.model);
  }

  async changePassword() {

  }
}
