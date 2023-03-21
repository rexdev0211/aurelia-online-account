import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from 'dtos/onlineaccount-api.dtos';

// export class TransferFundsModel extends OnlineAccountApi.TransferFundsRequest {
// }
//
// ValidationRules
//   .ensure((x: TransferFundsModel) => x.sourceAccountERN).required().withMessage("Source account is required")
//   .ensure((x: TransferFundsModel) => x.destinationAccountERN).required().withMessage("Destination account is required")
//   .ensure((x: TransferFundsModel) => x.amount).required().satisfies((value: any, obj: TransferFundsModel) => parseFloat(value) > 0).withMessage("Invalid amount to transfer")
//   .on(TransferFundsModel);
