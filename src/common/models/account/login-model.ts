import {OnlineAccountApi} from 'dtos/onlineaccount-api.dtos';
import {ValidationRules} from "aurelia-validation";

export class LoginModel extends OnlineAccountApi.MfaAuthenticate {

  public constructor(init?: Partial<LoginModel>) {
    super();
    (<any>Object).assign(this, init);
  }

  toDto() {
    return {
      userName: this.userName,
      password: this.password
    }
  }
}

ValidationRules
  .ensure((x: LoginModel) => x.userName).required()
  .ensure((x: LoginModel) => x.password).required()
  .on(LoginModel);;
