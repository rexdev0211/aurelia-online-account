import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";

export class BeneficiaryAccountModel extends OnlineAccountApi.BeneficiaryAccount {
  constructor() {
    super();
  }
}

ValidationRules
  .ensure((x: BeneficiaryAccountModel) => x.accountName).required()
  // .ensure((x: BeneficiaryAccountModel) => x.bankName).required()
  // .ensure((x: BeneficiaryAccountModel) => x.swift).required()
  .ensure((x: BeneficiaryAccountModel) => x.iban).required().when(object => (!object.sortCode || !object.accountNumber))
  .ensure((x: BeneficiaryAccountModel) => x.iban).minLength(22).when(object => object.iban && (!object.sortCode || !object.accountNumber))
  .ensure((x: BeneficiaryAccountModel) => x.sortCode).required().when(object => !object.iban)
  .ensure((x: BeneficiaryAccountModel) => x.accountNumber).required().when(object => !object.iban)
  .ensure((x: BeneficiaryAccountModel) => x.nickName).required().satisfiesRule('uniqueBeneficiaryNickName')

  .on(BeneficiaryAccountModel);
