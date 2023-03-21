import {bindable, observable} from 'aurelia-framework';
import {ApplicationState, SelectedAccount} from "../../../../applicationState";
import {BaseElement} from '../../../../bases/base-element';
import {sortBy} from "../../../../common/services/shared";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import ResourceLimit = OnlineAccountApi.ResourceLimit;

export class SpendingActivityCustomElement extends BaseElement {
    @observable bp: number;
    @bindable principal;
    @bindable stateSource = 'customerSpending';
    private send: { ledger: number; actual: number; key: string }[];
    private transfer: { ledger: number; actual: number; key: string }[];
    private currencySymbol: string;
    private position: string;

    constructor(...args) {
        super(...args);
    }

    stateChanged(state: ApplicationState) {
        this.bp = this.utils.getPropertyValue<number>(state, '.breakpoint.bp');
    }

    bpChanged(newValue: number, oldValue: number) {
        this.position = newValue < 2 ? 'left' : 'right';
    }

    bind() {
        if (this.principal) this.principalChanged(this.principal);
    }

    principalChanged(principal: SelectedAccount, oldPrincipal?: SelectedAccount) {
        let principalERN = this.utils.getPropertyValue<string>(principal, 'ern');
        if (!principalERN) return;

        let sendStateLocation = `${this.stateSource}.send`;
        let sendStateData = this.utils.getPropertyValue<ResourceLimit>(this.state, sendStateLocation);
        if (sendStateData) {
            let sendPrincipalData = this.utils.getPropertyValue<string>(sendStateData, principalERN);
            if (sendPrincipalData)
                this.send = this.parseData(sendPrincipalData);
        }

        let transferStateLocation = `${this.stateSource}.transfer`;
        let transferStateData = this.utils.getPropertyValue<ResourceLimit>(this.state, transferStateLocation);
        if (transferStateData) {
            let transferPrincipalData = this.utils.getPropertyValue<string>(transferStateData, principalERN);
            if (transferPrincipalData)
                this.transfer = this.parseData(transferPrincipalData);
        }
        this.currencySymbol = principal.currencySymbol;
    }

    parseData(value: any) {
        if (!value) return null;

        let sortOrder = ['YD', 'YW', 'YM', 'YQ', 'Y'];
        let displayOrder = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

        let keys = Object.keys(value).map(x => {
            return {key: x, sort: sortOrder.indexOf(x.replace(/[^A-Z]/g, '')), year: x.split('-')[0].replace(/[^0-9]/g, '')};
        });

        let sortKeys = keys.sort(sortBy(['year', 'sort']));

        let currentKeys = sortKeys.filter((value1, index, array) => value1.year === array[0].year);

        let sortData = currentKeys.map(x => {
            return {key: displayOrder[x.sort], ledger: value[x.key].ledger, actual: value[x.key].actual};
        });

        return sortData;
    }
}

