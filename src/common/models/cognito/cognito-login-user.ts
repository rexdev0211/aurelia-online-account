import {ValidationRules} from 'aurelia-validation';

export class CognitoLoginUser {
  emailAddress:string;
  password:string;

  constructor(data?:Object) {
    Object.assign(this,
      data ||
        {
          'emailAddress': null,
          'password': null
        });
  }
}

ValidationRules
  .ensure((x: CognitoLoginUser) => x.emailAddress).required().email()
  .ensure((x: CognitoLoginUser) => x.password).required()
  .on(CognitoLoginUser);
