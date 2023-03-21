import {autoinject, bindable} from 'aurelia-framework';
import * as $ from "jquery";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {AmountFormatValueConverter} from "../../../../value-converters/currency-format";
import BusinessJobApproveRequest = OnlineAccountApi.BusinessJobApproveRequest;
import BusinessJobRejectRequest = OnlineAccountApi.BusinessJobRejectRequest;
import BusinessJobRejectResponse = OnlineAccountApi.BusinessJobRejectResponse;
import Job = OnlineAccountApi.Job;

@autoinject
export class RequestDetailCustomElement extends BaseElement {
    @bindable job: Job;
    @bindable action;

    constructor(private amountFormat: AmountFormatValueConverter, ...args) {
        super(...args);
    }

    click() {
        if (this.action === 'Authorise') return this.approve();
        if (this.action === 'Reject') return this.reject();
    }

    approve() {
        let _this = this;
        kendo.confirm(`Are you sure you want to <strong>authorise</strong> this business action?`)
            .then(async t => {
                try {
                    await _this.serviceClients.onlineAccountApi.post(new BusinessJobApproveRequest({
                        jobERN: _this.job.jobERN,
                    }));
                    $('.k-i-reload').click();
                } catch (e) {
                }
            });
    }

    reject() {
        let _this = this;
        kendo.confirm(`Are you sure you want to <strong>reject</strong> this business action?`)
            .then(async t => {
                let response: BusinessJobRejectResponse = await _this.serviceClients.onlineAccountApi.post(new BusinessJobRejectRequest({
                    jobERN: _this.job.jobERN
                }));
                if (response.result)
                    $('.k-i-reload').click();
            });
    }

}

