

export class AccountModel {
    code: string;
    token: number;
    actualBalance: number;
    availableBalance: number;

    constructor(code: string, token: number, actualBalance: number, availableBalance: number) {
        this.code = code;
        this.token = token;
        this.actualBalance = actualBalance;
        this.availableBalance = availableBalance;
    }
}
