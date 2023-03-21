import {dispatchify} from 'aurelia-store';
import {ControllerValidateResult} from 'aurelia-validation';
import {PasswordResetStartModel} from "../../../../common/models/auth/password-reset-start-model";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import {BaseElement} from './../../../../bases/base-element';

export class StartPasswordResetCustomElement extends BaseElement {
  private model: PasswordResetStartModel;

  constructor(...args) {
    super(...args);
    this.model = new PasswordResetStartModel();
    this.validationController.addObject(this.model);
  }

  async submit() {
    let validationResult: ControllerValidateResult = await this.validationController.validate();
    if (validationResult.valid) {
      let response: OnlineAccountApi.PasswordResetResponse = await this.serviceClients.onlineAccountApi.post(this.model);
      if (response.result) {
        await dispatchify('saveEmailAddress')(this.model.emailAddress);
        await dispatchify('mfaSetup')(response.mfa);
        location.hash = '#/confirm/password/reset';
      }
    }
  }
}

