//import {
//  bindable
//} from 'aurelia-framework';
import {
  BasePage
} from './../../../../bases/base-page';

export class RemoveBeneficiaryPage extends BasePage {

  constructor(...args) {
    super(...args);
  }

  canActivate() {
    return this.canActivateState(s => this.utils.propExists(s, "selectedBeneficiary"), '#/account/send/funds');
  }
}

