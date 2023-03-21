import {SelectedAccount, SelectedBeneficiary} from "../../../../../applicationState";
import {BkaSendFundsModel} from "./bka-send-funds-model";

export class PaymentSendState {
    sourceAccount: SelectedAccount;
    destinationAccount: SelectedAccount;
    beneficiaryAccount: SelectedBeneficiary;
    paymentRequest: BkaSendFundsModel
}