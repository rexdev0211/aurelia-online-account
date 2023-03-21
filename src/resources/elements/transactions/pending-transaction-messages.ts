import {bindable, computedFrom} from "aurelia-framework";
import * as moment from 'moment'
import {BaseElement} from "../../../bases/base-element";
import {OnlineAccountApi} from "../../../dtos/onlineaccount-api.dtos";
import Enumerable from "linq";

export class PendingTransactionMessagesCustomElement extends BaseElement {
    @bindable source;
    @bindable parent;
    @bindable messages;

    ascending = false;
    private currentYear: number;
    private allowReject: boolean;
    private conversation: OnlineAccountApi.PendingTransactionMessages;

    constructor(...args) {
        super(...args);
        this.currentYear = new Date().getUTCFullYear();
    }

    @computedFrom('messages')
    get years() {
        return this.messages
            ? Array.from(this.messages.keys())
            : [];
    }

    keys(year) {
        return Array.from(this.messages.get(year).keys());
    }

    async bind() {
        await this.buildMessages();
    }

    async sourceChanged(newSource, oldSource) {
        await this.buildMessages();
    }

    async toggleSort() {
        this.ascending = !this.ascending;
        await this.buildMessages();
    }

    async buildMessages() {
        let keys = this.source.messages.map(x => x.date).sort();
        if (!this.ascending) keys.reverse();

        this.messages = new Map();

        for (const key of keys) {
            let keyDate = moment.utc(key);
            let date = keyDate.format('MMM DD');
            let year = keyDate.format('YYYY');
            if (!this.messages.has(year)) this.messages.set(year, new Map());
            if (!this.messages.get(year).has(date)) this.messages.get(year).set(date, []);
            this.messages.get(year).get(date).push(this.source.messages.find(x => x.date === key));
        }

        this.allowReject = this.canReject();
    }

    canReject() {
        if (!this.source.canReject) return false;
        let rejectClaims = ['Reject Funds (Admin)', 'Reject Funds (Request)'];
        let foundClaims = Enumerable.from(this.state.customerSummary.aclClaims).where(x => rejectClaims.some(y => y === x.operation));
        if (!foundClaims.any()) return false;
        let resources = [this.state.accounts.sourceAccount.ern];
        if (this.state.accounts.sourceAccount.customerERN) resources.push(this.state.accounts.sourceAccount.customerERN);
        if (this.state.accounts.sourceAccount.businessERN) resources.push(this.state.accounts.sourceAccount.businessERN);
        return foundClaims.any(x => resources.some(y => y === x.resource));
    }

    addResponse() {
        this.parent.display = 'MessageIn';
    }

    rejectTransaction() {
        kendo.confirm("Are you sure you want to reject this transaction?")
            .then(async () => {
                let request = new OnlineAccountApi.RejectPendingTransactionRequest({pendingTransactionERN: this.source.pendingTransactionERN})
                let response = await this.serviceClients.onlineAccountApi.post(request);
                if (response.result) {
                    kendo.alert(response.result);
                }

                await this.parent.dialogController.ok();
            });
    }
}

