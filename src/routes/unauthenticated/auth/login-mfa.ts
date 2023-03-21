//import {
//  bindable
//} from 'aurelia-framework';
import {
  BasePage
} from './../../../bases/base-page';
import {LoginModel} from "../../../common/models/account/login-model";

export class LoginMfaPage extends BasePage {

  constructor(...args) {
    super(...args);
  }

  canActivate(){
    let credential: LoginModel = this.container.get(LoginModel);
    if (!this.utils.getObjectValue(credential,'userName')) {
      location.hash = '#/';
      return false;
    }
  }
}

