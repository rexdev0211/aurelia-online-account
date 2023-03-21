export class BeneficiaryBulkState {
    csvFileName: string;
    csvContents: string;

    constructor(init?: Partial<BeneficiaryBulkState>) {
        (<any>Object).assign(this, init);
    }
}
