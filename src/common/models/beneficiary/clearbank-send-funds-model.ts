import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";

// export class ClearbankSendFundsModel extends OnlineAccountApi.BkaSendFundsRequest {
//   paymentDateFormatted: string;
//   amountFormatted: string;
//   requireSmsVerificationCode: boolean = false;
//
//   constructor() {
//     super();
//   }
// }
//
// ValidationRules
//   .ensure((x: ClearbankSendFundsModel) => x.scheme).required()
//   .ensure((x: ClearbankSendFundsModel) => x.accountERN).required()
//   .ensure((x: ClearbankSendFundsModel) => x.beneficiaryAccountERN).required()
//   .ensure((x: ClearbankSendFundsModel) => x.amount).required().satisfies((value: any, obj: ClearbankSendFundsModel) => parseFloat(value) > 0)
//   .ensure((x: ClearbankSendFundsModel) => x.paymentDate).required().satisfies((value: any, obj: ClearbankSendFundsModel) => parseFloat(value) >= new Date(new Date().toISOString().split('T')[0]).getTime())
//   .ensure((x: ClearbankSendFundsModel) => x.paymentReference).required().matches(/^[a-zA-Z0-9 ,.-]+$/)
//   .ensure((x: ClearbankSendFundsModel) => x.paymentReference).maxLength(18).when(x => x.scheme == OnlineAccountApi.ClearBankPaymentScheme.FPS)
//   .ensure((x: ClearbankSendFundsModel) => x.paymentReference).maxLength(35).when(x => x.scheme != OnlineAccountApi.ClearBankPaymentScheme.FPS)
//   .ensure((x: ClearbankSendFundsModel) => x.smsVerificationCode).required().when(x => x.requireSmsVerificationCode)
//
//   .on(ClearbankSendFundsModel);
