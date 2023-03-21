import {SelectedAccount} from "../../../../../applicationState";

export class PaymentOrderState {
    sourceAccount: SelectedAccount

    constructor(init?: Partial<PaymentOrderState>) {
        (<any>Object).assign(this, init);
    }
}