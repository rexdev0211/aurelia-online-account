import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";

export class SelectAccountModel {
  sourceAccountERN: string;
}

ValidationRules.ensure((x: SelectAccountModel) => x.sourceAccountERN)
  .required().withMessage("Source account is required")
  .on(SelectAccountModel);
