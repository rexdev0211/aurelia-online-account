import * as moment from 'moment';
import { Padding } from './padding';
import { Fees } from './fees';

//TODO: accountNumber & availableBalance should not belong to this class, all data needed for view will be in separate class,
//      models will be mapped 1 to 1
export class Transaction {
    id: number;
    link: string;
    accountNumber: string;
    timestamp: moment.Moment;
    description: string;
    note: string;
    type: string;
    transactionAmount: number;
    settleAmount: number;
    billAmount: number;
    padding: Padding;
    fees: Fees;
    proccessorCode: any[];
    mtid: string;
    availableBalance: number;
    stateCode: string;

    get currencySymbol(): string {
        switch ((this.accountNumber ? this.accountNumber : '').substring(2, 4).toUpperCase()) {
            case 'EU':
            case 'EUR':
                return 'EUR ';
            //return '€';
            case 'GB':
            case 'GBP':
            default:
                return 'GBP ';
                //return '£';
        }
    }

    constructor(
        id: number,
        link: string,
        accountNumber: string,
        timestamp: moment.Moment,
        description: string,
        note: string,
        type: string,
        transactionAmount: number,
        settleAmount: number,
        billAmount: number,
        padding: Padding,
        fees: Fees,
        proccessorCode: any[],
        mtid: string,
        availableBalance: number,
        stateCode: string
    ) {
            this.id = id;
            this.link = link;
            this.accountNumber = accountNumber;
            this.timestamp = timestamp;
            this.description = description;
            this.note = note;
            this.type = type;
            this.transactionAmount = transactionAmount;
            this.settleAmount = settleAmount;
            this.billAmount = billAmount;
            this.padding = padding;
            this.fees = fees;
            this.proccessorCode = proccessorCode;
            this.mtid = mtid;
            this.availableBalance = availableBalance;
            this.stateCode = stateCode;
    }
}
