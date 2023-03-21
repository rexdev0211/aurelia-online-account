import {Container} from 'aurelia-framework';
import {Store} from "aurelia-store";
import * as moment from "moment";
import {ApplicationState} from "../../../applicationState";
import {Utils} from "../../services/utils";

export class TransactionLineItem {
    //view data
    hold: boolean;
    date: string;
    description: string;
    amount: string;
    accountBalance: string;

    formattedAccountBalance: string;
    formattedLedgerBalance: string;
    formattedAmount: string;

    //amount & balance with hack Padding
    amountPadding: string;
    availableBalancePadding: string;

    fee: string;

    mcc: string;
    fx: string;
    fixed: string;
    rate: string;

    category: string;
    timestamp: string;
    country: string;
    sourceType: string;

    //other data
    transactionCode: number;
    note: string;
    sortCode: string;
    accountNumber: string;
    type: string;
    debitCreditCode: string;
    transactionType: string;
    account: string;

    transaction;
    payload;
    currencyCode: string;
    currencySymbol: string;
    reference: string;
    private counterpartIban: string;
    private counterpartBban: string;
    private counterpartAccountName: string;
    private counterpartInstitutionName: string;
    private scheme: string;
    private transactionId: string;
    private nickName: string;
    private counterpartAccountTransactionOwnerName: string;
    private accountTransactionOwnerName: string;
    private accountName: string;
    private pendingTransactionERN: string;
    private internalReference: string;
    private ern: string;

    constructor(transactionDetail) {
        if (transactionDetail.jobERN) {
            ////////////////////////////////////////////////////////////////////////////////////////
            /// Outgoing Pending Payment
            ////////////////////////////////////////////////////////////////////////////////////////
            this.ern = transactionDetail.jobERN;
            this.date = moment.utc(transactionDetail.createdDate).local().format("YYYY-MM-DD");
            this.description = transactionDetail.input.getProp("PaymentReference2");
            this.amount = transactionDetail.input.getProp("Amount2");
        }

        // @ts-ignore
        let state: ApplicationState = Container.instance.get(Store).state.source.value;

        if (state.accounts.sourceAccount) {
            this.currencyCode = state.accounts.sourceAccount.currencyCode;
            this.currencySymbol = state.accounts.sourceAccount.currencySymbol;
        }

        Container.instance.get(Utils).rehydrateMeta(transactionDetail);

        this.hold = transactionDetail.hold === true;
        if (this.hold) {
            if (transactionDetail.meta?.EddEvent) {
                this.pendingTransactionERN = transactionDetail.meta.EddEvent.pendingTransactionERN;
            }
        }

        switch (transactionDetail.type) {
            case undefined:
                ////////////////////////////////////////////////////////////////////////////////////////
                /// TransactionHistoryRecord
                ////////////////////////////////////////////////////////////////////////////////////////
                // this.payload = transactionDetail.payload;
                this.ern = transactionDetail.id;
                this.date = moment.utc(transactionDetail.transactionTimeSearch).local().format("YYYY-MM-DD");
                this.account = transactionDetail.accno;
                // this.internalReference = this.payload.getProp("InternalReference");
                this.description = `${this.hold ? '[PENDING] ' : ''}${transactionDetail.paymentReference}`;
                this.amount = this.format(Math.abs(transactionDetail.transactionAmount) * 100);
                this.debitCreditCode = transactionDetail.transactionAmount < 0 ? 'Debit' : 'Credit';
                this.transactionType = transactionDetail.txnCode;
                this.accountBalance = transactionDetail.accountBalance ? this.format(transactionDetail.accountBalance * 100) : '0';
                this.timestamp = moment.utc(transactionDetail.transactionTimeSearch).local().format("YYYY-MM-DD hh:mm:ss A");
                this.formattedAmount = this.formatAmount(this.currencySymbol, this.amount, this.debitCreditCode);
                this.formattedAccountBalance = this.formatAvailableBalance(this.currencySymbol, this.accountBalance);
                this.reference = transactionDetail.paymentReference;

                let cpParts = transactionDetail.counterparty?.split(',').map(x => x.trim()) || [];
                let bfParts = transactionDetail.beneficiary?.split(',').map(x => x.trim()) || [];
                while (cpParts.length < 3) cpParts.push('');
                while (bfParts.length < 3) bfParts.push('');


                this.counterpartIban = cpParts[1];
                this.counterpartAccountName = cpParts[0];
                this.counterpartInstitutionName = cpParts[2];

                this.accountTransactionOwnerName = bfParts[0];
                this.accountName = bfParts[0];

                if (this.counterpartIban) {
                    this.sortCode = this.counterpartIban.substring(14);
                    this.accountNumber = this.counterpartIban.substring(8, 6);
                } else if (this.counterpartBban) {
                    this.sortCode = this.counterpartBban.substring(10);
                    this.accountNumber = this.counterpartBban.substring(4, 6);
                }
                this.scheme = transactionDetail.txnCode;
                if (this.scheme == "Transfer") this.scheme = "Enumis";
                this.transactionId = transactionDetail.itemId;
                // this.nickName = this.payload.getProp('CounterpartAccount_BeneficiaryNickName') || 'N/A';
                if (this.debitCreditCode.toLowerCase() == "debit") this.amount = `-${this.amount}`;
                break;

            case "Enumis.DataModel.Tables.ClearBankTransaction, Enumis.DataModel":
            case "Enumis.DataModel.Tables.ClearBankTransaction,Enumis.DataModel":

                ////////////////////////////////////////////////////////////////////////////////////////
                /// ClearBank Transaction
                ////////////////////////////////////////////////////////////////////////////////////////

                const timestampModified = transactionDetail.payload.getProp('TransactionTime') || transactionDetail.payload.getProp('TimestampModified') || transactionDetail.payload.getProp('TimestampSettled');

                this.payload = transactionDetail.payload;
                this.ern = transactionDetail.ern;
                this.date = moment.utc(timestampModified).local().format("YYYY-MM-DD");
                this.account = transactionDetail.account;
                this.internalReference = this.payload.getProp("InternalReference");
                this.description = `${this.hold ? '[PENDING] ' : ''}${this.payload.getProp("reference")}`;
                this.amount = this.format(this.payload.getProp("amount") * 100);
                this.debitCreditCode = this.payload.getProp("debitCreditCode");
                this.transactionType = this.payload.getProp("transactionType");
                this.accountBalance = this.format(this.payload.getProp("actBal"));
                this.timestamp = moment.utc(timestampModified).local().format("YYYY-MM-DD hh:mm:ss A");
                this.formattedAmount = this.formatAmount(this.currencySymbol, this.amount, this.debitCreditCode);
                this.formattedAccountBalance = this.formatAvailableBalance(this.currencySymbol, this.accountBalance);
                this.reference = this.payload.getProp('reference');
                this.counterpartIban = this.payload.getProp('counterpartAccount_Iban');
                this.counterpartBban = this.payload.getProp('counterpartAccount_Bban');
                this.counterpartAccountName = this.payload.getProp('counterpartAccount_AccountName') || this.payload.getProp('counterpartAccount_OwnerName');
                this.counterpartInstitutionName = this.payload.getProp('counterpartAccount_InstitutionName');
                this.counterpartAccountTransactionOwnerName = this.payload.getProp('CounterpartAccount_TransactionOwnerName');
                this.accountTransactionOwnerName = this.payload.getProp('Account_TransactionOwnerName');

                this.accountName = this.counterpartAccountTransactionOwnerName || this.counterpartAccountName || 'Not Provided';

                if (this.counterpartIban) {
                    this.sortCode = this.counterpartIban.substr(14);
                    this.accountNumber = this.counterpartIban.substr(8, 6);
                } else if (this.counterpartBban) {
                    this.sortCode = this.counterpartBban.substr(10);
                    this.accountNumber = this.counterpartBban.substr(4, 6);
                }
                this.scheme = this.payload.getProp('scheme');
                if (this.scheme == "Transfer") this.scheme = "Enumis";
                this.transactionId = this.payload.getProp("TransactionId");
                this.nickName = this.payload.getProp('CounterpartAccount_BeneficiaryNickName') || 'N/A';
                if (this.debitCreditCode.toLowerCase() == "debit") this.amount = `-${this.amount}`;

                break;

            case "Enumis.DataModel.Tables.GpsTransaction, Enumis.DataModel":
            case "Enumis.DataModel.Tables.GpsTransaction,Enumis.DataModel":

                ////////////////////////////////////////////////////////////////////////////////////////
                /// GPS Transaction
                ////////////////////////////////////////////////////////////////////////////////////////

                const txn_GPS_Timestamp = parseInt(transactionDetail.payload.getProp("txn_GPS_Timestamp"));
                this.ern = transactionDetail.ern;
                this.date = moment.utc(txn_GPS_Timestamp).local().format("YYYY-MM-DD");
                this.description = transactionDetail.payload.getProp("txn_Desc");

                const feeRate = parseFloat(transactionDetail.payload.getProp("fee_Rate")) * 100;
                const feeFixed = parseFloat(transactionDetail.payload.getProp("fee_Fixed")) * 100;
                const billAmt = parseFloat(transactionDetail.payload.getProp("bill_Amt")) * 100;

                let overrideFeeRate = parseFloat(transactionDetail?.meta?.PropertyOverrides?.getProp("Fee_Rate")) * 100;
                let overrideFeeFixed = parseFloat(transactionDetail?.meta?.PropertyOverrides?.getProp("Fee_Fixed")) * 100;
                this.amount = this.format(billAmt + ((overrideFeeRate || feeRate) + (overrideFeeFixed || feeFixed)));

                const avlBal = parseFloat(transactionDetail.payload.getProp("avl_Bal")) * 100;
                const ldgBal = parseFloat(transactionDetail.payload.getProp("ActBal")) * 100;

                this.accountBalance = this.format(avlBal);
                const ledgerBalance = this.format(ldgBal);

                this.fee = this.format(feeRate + feeFixed);
                this.timestamp = moment.utc(txn_GPS_Timestamp).local().format("YYYY-MM-DD hh:mm:ss A");
                this.country = transactionDetail.payload.getProp("txn_Ctry") || "N/A";

                this.formattedAmount = `${this.currencySymbol}${this.amount}`;
                this.formattedAccountBalance = `${this.currencySymbol}${this.accountBalance}`;
                this.formattedLedgerBalance = `${this.currencySymbol}${ledgerBalance}`;
                break;
        }
    }

    private format(value: number): string {
        return (value / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    private addPadding(value: string): string {
        return value.charAt(0) && value.charAt(0) != "-"
            ? '<span style="visibility:hidden;">-</span>' + value
            : value;
    }

    private formatAmount(symbol: string, amount: any, debitCreditCode: string) {
        if (symbol === 'Points')
            return debitCreditCode.toLowerCase() == "debit"
                ? `-${amount} ${symbol}`
                : `${amount} ${symbol}`;

        return debitCreditCode.toLowerCase() == "debit"
            ? `-${symbol}${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
            : `${symbol}${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    private formatAvailableBalance(symbol: string, amount: any) {
        if (symbol === 'Points')
            return `${parseFloat("" + amount).toFixed(2)} ${symbol}`;

        return `${symbol}${(amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

}
