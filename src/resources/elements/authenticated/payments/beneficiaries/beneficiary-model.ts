import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";

export class BeneficiaryModel extends OnlineAccountApi.BeneficiaryWithDocumentERNs {
  constructor() {
    super();
  }

  birthDateFormatted: string
}

ValidationRules
  .ensure((x: BeneficiaryModel) => x.firstName).required().when(object => object.beneficiaryType === OnlineAccountApi.BeneficiaryType.Person).minLength(2)
  .ensure((x: BeneficiaryModel) => x.lastName).required().when(object => object.beneficiaryType === OnlineAccountApi.BeneficiaryType.Person).minLength(2)
  // .ensure((x: BeneficiaryModel) => x.birthDate).required().when(object => object.beneficiaryType === OnlineAccountApi.BeneficiaryType.Person)
  .ensure((x: BeneficiaryModel) => x.businessName).required().when(object => object.beneficiaryType !== OnlineAccountApi.BeneficiaryType.Person).minLength(2)
  .ensure((x: BeneficiaryModel) => x.nickName).required()
  .ensure((x: BeneficiaryModel) => x.beneficiaryType).required()
  // .ensure((x: BeneficiaryModel) => x.documentERNs).minItems(1).withMessage('Beneficiary Documents must contain at least 1 item.')

  .on(BeneficiaryModel);
