//import {
//  bindable
//} from 'aurelia-framework';
import {
  BasePage
} from '../../bases/base-page';
import {LoginModel} from "../../common/models/account/login-model";

export class SmsPage extends BasePage {

  constructor(...args) {
    super(...args);
  }

  canActivate(){
    let credential: LoginModel = this.container.get(LoginModel);
    if (!this.utils.getObjectValue(credential,'userName')) {
      this.utils.reloadAppAsync('unauthenticated');
      return false;
    }
  }
}

