import {BaseElement} from "../../../../bases/base-element";
import {ControllerValidateResult} from "aurelia-validation";
import {LoginModel} from "../../../../common/models/account/login-model";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import {dispatchify} from "aurelia-store";

export class LoginPanelCustomElement extends BaseElement {
  private model: LoginModel = new LoginModel()

  constructor(...args) {
    super(...args);

    this.validationController.addObject(this.model);

    // this.model.userName = "charles.lindsay+gb96clrb04047700000250@intelligentmedia.io";//"charles.lindsay+cdeu41387600@intelligentmedia.io"; //"ryan.helms+gb88clrb04047600000378@intelligentmedia.io"; //;
    // this.model.password = "Abc123?/" //"abc123"; //"123456"; //;
  }

  async submit() {
    let validationResult: ControllerValidateResult = await this.validationController.validate();
    if (validationResult.valid) {
      try {

        let response: OnlineAccountApi.MfaAuthenticateResponse = await this.serviceClients.onlineAccountApi.post(this.model);

        this.container.registerInstance(LoginModel, this.model.toDto());

        if (response.result === '#/mfa') {
          let authRequest = new OnlineAccountApi.AuthenticateMfa({
            userName: this.model.userName,
            password: this.model.password
          });

          let authResponse: OnlineAccountApi.AuthenticateResponse = await this.serviceClients.onlineAccountApi.post(authRequest);
          await dispatchify('setAuthUser')(authResponse);
        }

        this.utils.reloadAppAsync('mfa', response.result);

      } catch (e) {
        validationResult.results.push(
          this.validationController.addError(
            "Invalid Username or Password",
            this.model,
            "userName"
          )
        );
        validationResult.valid = false;
      }
    }
  }
}
