import {Container} from 'aurelia-dependency-injection';
import {Store} from "aurelia-store";
import {ApplicationState, SelectedAccount} from "../../applicationState";
import {OnlineAccountApi} from "../../dtos/onlineaccount-api.dtos";
import {
    BeneficiaryAccountModel
} from "../../resources/elements/authenticated/payments/beneficiaries/beneficiary-account-model";
import {CurrencyFormatValueConverter} from "../../resources/value-converters/currency-format";
import {DataStore} from "../data-stores/data-store";
import {Utils} from "./utils";
import AccountSummary = OnlineAccountApi.AccountSummary;

export function hasAnyAcl(operations: string[], erns: string[]) {
    if (!operations.length) return false;
// @ts-ignore
    let state: ApplicationState = Container.instance.get(Store).state.source.value
    return state.customerSummary.aclClaims.some(x => operations.includes(x.operation) && erns.includes(x.resource));
}

export function formatAccountSummary(): (x: AccountSummary) => { text: string; value: string, name: string, currency: string, symbol: string } {
    return x => {
        let managedAccount = '';
        let accountName = '';
        if (x.businessERN) managedAccount = '[Managed]   ';
        if (x.accountHolder) accountName = `${x.accountHolder} : `;
        return {
            text: `${managedAccount}${x.code} : ${accountName}${new CurrencyFormatValueConverter().toView(x.presentBalance, x.currencySymbol)}`,
            value: x.ern,
            name: x.accountName,
            currency: x.currencyCode,
            symbol: x.currencySymbol
        };
    }
}

// @ts-ignore
export function notificationAccounts(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let accounts = Container.instance.get(Utils).propExists(state, ".customerSummary.ern") && state.customerSummary.accounts.length > 0
        ? state.customerSummary.accounts.map(x => {
            return {name: x.code, code: x.code};
        })
        : [];

    return accounts;
}

// @ts-ignore
export function hasAccounts(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return Container.instance.get(Utils).propExists(state, ".customerSummary.ern") && state.customerSummary.accounts.length > 0;
}

// @ts-ignore
export function hasMultipleAccounts(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return Container.instance.get(Utils).propExists(state, ".customerSummary.ern") && state.customerSummary.accounts.length > 1;
}

// @ts-ignore
export function getBkaAccounts(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return Container.instance.get(Utils).propExists(state, ".customerSummary.ern") && state.customerSummary.accounts.filter(filterClearBankAccounts);
}

// @ts-ignore
export function hasBkaAccounts(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return getBkaAccounts(state).some(x => true);
}

// @ts-ignore
export function canManageWebhooks(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return Container.instance.get(Utils).propExists(state, ".customerSummary.ern") && state.customerSummary.webHookEnabled;
}

// @ts-ignore
export function canManageRiskProfiles(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let operations = ['Risk Profile Manager (Admin)', 'Risk Profile Manager (Authorize)', 'Risk Profile Managers (Request)'];
    return state.customerSummary && state.customerSummary.aclClaims && state.customerSummary.aclClaims.some(x => operations.includes(x.operation));
}

// @ts-ignore
export function canManageNotifications(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return getManageBusinessNotifications(state).length > 0
}

// @ts-ignore
export function getBeneficiaryAccounts(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return state.customerSummary.accounts
        .filter(filterLocalAccounts())
        .filter(filterClearBankAccounts())
        .sort(sortBy(['accountName', 'currencyCode', 'code']))
        .map(formatAccountSummary())
        .concat(state.customerSummary.accounts
            .filter(filterManagedAccounts([
                'Beneficiary Add (Admin)',
                'Beneficiary Add (Request)',
                'Beneficiary Update (Admin)',
                'Beneficiary Update (Request)',
                'Beneficiary Link (Admin)',
                'Beneficiary Link (Request)',
                'Beneficiary Unlink (Admin)',
                'Beneficiary Unlink (Request)'
            ]))
            .sort(sortBy(['accountName', 'currencyCode', 'code']))
            .map(formatAccountSummary()));
}

// @ts-ignore
export function hasBeneficiaryAccounts(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return getBeneficiaryAccounts(state).some(x => true);
}

// @ts-ignore
export function canManageBusiness(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return getManageBusiness(state).length > 0
}

// @ts-ignore
export function canUsePki(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return state.customerSummary.pkiEnabled;
}

// @ts-ignore
export function hasBillingEnabled(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    return state.customerSummary.accounts.some(x => !!x.billingProfileERN);
}

// @ts-ignore
export function getManageBusiness(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let operations = ['Manage Permissions (Admin)', 'Manage Permissions (Request)'];
    let businesses = state.customerSummary && state.customerSummary.aclClaims && state.customerSummary.aclClaims.filter(x => operations.includes(x.operation));
    return businesses || [];
}

// @ts-ignore
export function getManageBusinessNotifications(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let operations = ['Manage Notifications (Admin)', 'Manage Notifications (Request)'];
    let businesses = state.customerSummary && state.customerSummary.aclClaims && state.customerSummary.aclClaims.filter(x => operations.includes(x.operation));
    return businesses || [];
}

// @ts-ignore
export function canAuthorizeBusiness(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let operations = [
        'Manage Permissions (Admin)',
        'Manage Permissions (Authorize)',
        'Beneficiary Add (Admin)',
        'Beneficiary Add (Authorize)',
        'Beneficiary Link (Admin)',
        'Beneficiary Link (Authorize)',
        'Beneficiary Unlink (Admin)',
        'Beneficiary Unlink (Authorize)',
    ];

    return state.customerSummary && state.customerSummary.aclClaims && state.customerSummary.aclClaims.some(x => operations.includes(x.operation));
}

// @ts-ignore
export function canAuthorizePayments(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let operations = ['Send Funds (Admin)', 'Send Funds (Authorize)', 'Transfer Funds (Admin)', 'Transfer Funds (Authorize)'];
    return state.customerSummary && state.customerSummary.aclClaims && state.customerSummary.aclClaims.some(x => operations.includes(x.operation));
}

// @ts-ignore
export function canCreateBeneficiary(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let operations = ['Beneficiary Add (Admin)', 'Beneficiary Add (Request)'];
    let erns = [
        Container.instance.get(Utils).getPropertyValue<string>(state, '.beneficiaries.sourceAccount.ern'),
        Container.instance.get(Utils).getPropertyValue<string>(state, '.beneficiaries.sourceAccount.businessERN')
    ].filter(x => !!x);

    return hasAnyAcl(operations, erns);
}

// @ts-ignore
export function canUpdateBeneficiary(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let operations = ['Beneficiary Update (Admin)', 'Beneficiary Update (Request)'];
    let erns = [
        Container.instance.get(Utils).getPropertyValue<string>(state, '.beneficiaries.sourceAccount.ern'),
        Container.instance.get(Utils).getPropertyValue<string>(state, '.beneficiaries.sourceAccount.businessERN')
    ].filter(x => !!x);

    return hasAnyAcl(operations, erns);
}

// @ts-ignore
export function canLinkBeneficiary(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let operations = ['Beneficiary Link (Admin)', 'Beneficiary Link (Request)'];
    let erns = [
        Container.instance.get(Utils).getPropertyValue<string>(state, '.beneficiaries.sourceAccount.ern'),
        Container.instance.get(Utils).getPropertyValue<string>(state, '.beneficiaries.sourceAccount.businessERN')
    ].filter(x => !!x);

    return hasAnyAcl(operations, erns);
}

// @ts-ignore
export function canUnlinkBeneficiary(state: ApplicationState = Container.instance.get(Store).state.source.value) {
    let operations = ['Beneficiary Unlink (Admin)', 'Beneficiary Unlink (Request)'];
    let erns = [
        Container.instance.get(Utils).getPropertyValue<string>(state, '.beneficiaries.sourceAccount.ern'),
        Container.instance.get(Utils).getPropertyValue<string>(state, '.beneficiaries.sourceAccount.businessERN')
    ].filter(x => !!x);

    return hasAnyAcl(operations, erns);
}

export function currencyCodeToCulture(currencyCode: string) {
    switch (currencyCode) {
        case 'EUR':
            return 'de-DE';
        case 'GBP':
            return 'en-GB';
        default:
            return 'en-US';
    }
}

export function formatBeneficiaryAccount(): (x: BeneficiaryAccountModel) => { text: string; value: string } {
    return x => {
        return {
            text: x.nickName,
            value: x.ern
        }
    }
}

export function filterAccountSummaries(aclOperations?: Array<string>): (x: Array<OnlineAccountApi.AccountSummary>) => Array<OnlineAccountApi.AccountSummary> {
    return x => [...x.filter(xx => !xx.businessERN && new SelectedAccount(xx).isClearBankAccount), ...x.filter(xx => xx.businessERN && new SelectedAccount(xx).isClearBankAccount && xx.aclClaims.some(xxx => aclOperations.includes(xxx.operation)))];
}

export function filterLocalAccounts(): (x: OnlineAccountApi.AccountSummary) => boolean {
    return x => !x.businessERN
}

export function filterManagedAccounts(aclOperations: Array<string> = []): (x: OnlineAccountApi.AccountSummary) => boolean {
    // @ts-ignore
    let state: ApplicationState = Container.instance.get(Store).state.source.value;

    return account => {
        if (!aclOperations.length) return !!account.businessERN;
        if (!account.businessERN) return false;

        return hasAnyAcl(aclOperations, [account.ern, account.businessERN])
    }
}

export function filterClearBankAccounts(): (x: OnlineAccountApi.AccountSummary) => boolean {
    return x => {
        let clearBankAccount = new SelectedAccount(x).isClearBankAccount;
        return clearBankAccount;
    }
}

export function filterGpsAccounts(): (x: OnlineAccountApi.AccountSummary) => boolean {
    return x => {
        let clearBankAccount = new SelectedAccount(x).isClearBankAccount;
        return !clearBankAccount;
    }
}

export function sortBy(fields: Array<string>): (a: any, b: any) => number {
    return (a, b) => fields.map(o => {
        let dir = 1;
        if (o[0] === '-') {
            dir = -1;
            o = o.substring(1);
        }
        return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
    }).reduce((p, n) => p ? p : n, 0);
}

export function getSelectAccount(): (x: string) => SelectedAccount {
    return x => new SelectedAccount(Container.instance.get(DataStore).state.customerSummary.accounts.find(y => y.ern == x));
}

export function isFunction(functionToCheck: any) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export const pagable: kendo.ui.GridPageable = {
    refresh: true,
    alwaysVisible: true,
    pageSize: 10,
    pageSizes: [10, 25, 50, 100, 500, 1000, 2500, 5000],
    info: true
}

