import {
  BasePage
} from '../../../bases/base-page';

export class TransferFundsPage extends BasePage {

  constructor(...args) {
    super(...args);
  }

  canActivate() {
    return (this.utils.propExists(this.dataStore, 'state.customerSummary.ern') && this.dataStore.state.customerSummary.accounts.length);
  }
}

