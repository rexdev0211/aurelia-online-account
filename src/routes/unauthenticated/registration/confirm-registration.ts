//import {
import {dispatchify} from "aurelia-store";
//  bindable
//} from 'aurelia-framework';
import {
  BasePage
} from 'bases/base-page';

export class ConfirmRegistrationPage extends BasePage {

  constructor(...args) {
    super(...args);
  }

  async deactivate() {
    await dispatchify('clearRegistrationRequest')();
  }
}

