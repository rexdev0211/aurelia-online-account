import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import EnrollUserRequest = OnlineAccountApi.EnrollUserRequest;
import EnrollDigitalSignatureRequest = OnlineAccountApi.EnrollDigitalSignatureRequest;

export class GenerateDigitalCertificateModel extends EnrollDigitalSignatureRequest {

  public constructor(init?: Partial<EnrollDigitalSignatureRequest>) {
    super(init);
  }
}

ValidationRules
  .ensure((x: GenerateDigitalCertificateModel) => x.csr).required().withMessage("CSR is required.")
  .on(GenerateDigitalCertificateModel);
