export class PaymentBulkState {
    csvFileName: string;
    csvContents: string;

    constructor(init?: Partial<PaymentBulkState>) {
        (<any>Object).assign(this, init);
    }
}
