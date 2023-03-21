import {ValidationRules} from 'aurelia-validation';

export class CognitoVerifyUser {
  emailAddress;
  code;

  constructor(data) {
    Object.assign(this,
      data ||
        {
          'emailAddress': null,
          'code': null
          
        });
  }
}

ValidationRules
  .ensure((x:CognitoVerifyUser) => x.emailAddress).required().then().email()
  .ensure((x:CognitoVerifyUser) => x.code).required()
  .on(CognitoVerifyUser);
