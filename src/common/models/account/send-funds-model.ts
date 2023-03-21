import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";

// export class SendFundsModel extends OnlineAccountApi.SendFundsRequest {
// }
//
// ValidationRules.ensure((x: SendFundsModel) => x.sourceAccountERN)
//   .required().withMessage("Source account is required")
//   .ensure((x: SendFundsModel) => x.destinationAccountERN)
//   .required().withMessage("Destination account is required")
//   .ensure((x: SendFundsModel) => x.lastName)
//   .required().withMessage("Destination account holder's last name is required")
//   .ensure((x: SendFundsModel) => x.amount)
//   .required()
//   .satisfies((value: any, obj: SendFundsModel) => parseFloat(value) > 0)
//   .withMessage("Invalid Amount to transfer")
//   .on(SendFundsModel);
