//import {bindable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {BasePage} from '../../../../bases/base-page';

export class ManageRequestsPage extends BasePage {

  constructor(...args) {
    super(...args);
  }

  async deactivate() {
    await dispatchify('clearRequests')();
  }
}

