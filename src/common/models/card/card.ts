export class Card {
    id: string;
    accountId: string;
    name: string;
    number: string;
    exp: string;
    balance: number;
    availableBalance: number;

    get currencySymbol(): string {
        switch ((this.accountId ? this.accountId : '').substring(2, 4).toUpperCase()) {
            case 'EU':
            case 'EUR':
                return 'EUR';
                //return '€';
            case 'GB':
            case 'GBP':
            default:
                return 'GBP';
                //return '£';
        }
    }
}
