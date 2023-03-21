//import {
import {dispatchify} from "aurelia-store";
//  bindable
//} from 'aurelia-framework';
import {BasePage} from '../../../../bases/base-page';

export class ManageBeneficiaryPage extends BasePage {

  constructor(...args) {
    super(...args);
  }

  async canActivate() {
    let canActivate = this.canActivateState(s => (this.utils.propExists(s, "customerSummary.beneficiaryAccounts") && s.customerSummary.activeBeneficiaryAccounts.length > 0), '#/');

    if (canActivate) {
      await dispatchify('clearSourceAccount')();
    }

    return canActivate;
  }
}

