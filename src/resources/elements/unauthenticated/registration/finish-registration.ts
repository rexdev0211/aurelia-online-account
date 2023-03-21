import {BaseElement} from "../../../../bases/base-element";
import {LoginModel} from "../../../../common/models/account/login-model";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import {dispatchify} from "aurelia-store";

export class FinishRegistrationCustomElement extends BaseElement {
  constructor(...args) {
    super(...args);
  }

  async click() {
    try {
      let credential = this.container.get(LoginModel);

      let mfaRequest = new OnlineAccountApi.MfaAuthenticate(credential);
      let mfaResponse: OnlineAccountApi.MfaAuthenticateResponse = await this.serviceClients.onlineAccountApi.post(mfaRequest);

      let authRequest = new OnlineAccountApi.AuthenticateMfa({
        userName: credential.userName,
        password: credential.password
      });

      let authResponse: OnlineAccountApi.AuthenticateResponse = await this.serviceClients.onlineAccountApi.post(authRequest);
      await dispatchify('setAuthUser')(authResponse);

      await this.utils.reloadAppAsync('mfa', mfaResponse.result);
    } catch (e) {
      await this.utils.reloadAppAsync('unauthenticated', '#');
    }
  }
}
