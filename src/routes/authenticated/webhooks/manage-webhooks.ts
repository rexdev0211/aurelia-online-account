//import {bindable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {BasePage} from './../../../bases/base-page';

export class ManageWebhooksPage extends BasePage {

  constructor(...args) {
    super(...args);
  }

  async canActivate() {
    let canActivate = (this.utils.propExists(this.dataStore, 'state.customerSummary.ern') && this.dataStore.state.customerSummary.accounts.length > 0);

    if (canActivate) {
      await dispatchify('clearSourceAccount')();
    }

    return canActivate;
  }
}

