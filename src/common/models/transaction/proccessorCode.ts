

export interface ProccessorCode {
    description: string;

}

export class TransactionCode implements ProccessorCode {
    description: string;
    transactionCode: number;

    constructor(description: string, transactionCode: number) {
        this.description = description;
        this.transactionCode = transactionCode;
    }
}

export class SourceAccountType implements ProccessorCode {
    description: string;
    sourceAccountType: number;

    constructor(description: string, sourceAccountType: number) {
        this.description = description;
        this.sourceAccountType = sourceAccountType;
    }
}

export class DestinationAccountType implements ProccessorCode {
    description: string;
    destinationAccountType: number;

    constructor(description: string, destinationAccountType: number) {
        this.description = description;
        this.destinationAccountType = destinationAccountType;
    }
}
