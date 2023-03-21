import {ValidationRules} from 'aurelia-validation';

export class CognitoRegisterUser {
  name;
  emailAddress;
  password;

  constructor(data) {
    Object.assign(this,
      data ||
        {
          'name': null,
          'emailAddress': null,
          'password': null
        });
  }
}

ValidationRules
  .ensure((x:CognitoRegisterUser) => x.name).required()
  .ensure((x:CognitoRegisterUser) => x.emailAddress).required().then().email()
  .ensure((x:CognitoRegisterUser) => x.password).required()
  .on(CognitoRegisterUser);
