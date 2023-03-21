import { AccountModel } from '../account/account-model';
import { Transaction } from './transaction';
import { Merchant } from '../merchant/merchant';
import { Customer } from '../customer/customer';

export class TransactionResponse {
    token: number;
    account: AccountModel;
    transaction: Transaction;
    merchant: Merchant;
    trans_link: string;
    customer: Customer;

    constructor(
        token: number,
        account: AccountModel,
        transaction: Transaction,
        merchant: Merchant,
        trans_link: string,
        customer: Customer
    ) {
        this.token = token;
        this.account = account;
        this.transaction = transaction;
        this.merchant = merchant;
        this.trans_link = trans_link;
        this.customer = customer;
    }
}
