import {dispatchify} from "aurelia-store";
import {BaseElement} from "../../../../../bases/base-element";

export class SiteHeaderCustomElement extends BaseElement {
  private showUsername: boolean;

  constructor(...args) {
    super(...args);
  }

  logout() {
    this.auth.logoutUser();
  }

  async reload() {
    // Let's reload the customer record
    if (this.state.isAuthenticated) {
      await this.auth.refreshBearerToken();
      await this.utils.refreshAppAsync();
      await dispatchify("reloadCustomer")();
    }
  }

}
