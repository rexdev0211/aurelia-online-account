import {autoinject, bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {AmountFormatValueConverter} from "../../../../value-converters/currency-format";
import * as $ from 'jquery';
import {dispatchify} from "aurelia-store";
import BusinessJobRejectRequest = OnlineAccountApi.BusinessJobRejectRequest;
import BusinessJobRejectResponse = OnlineAccountApi.BusinessJobRejectResponse;
import Job = OnlineAccountApi.Job;
import {PendingTransactionModal} from "../../../transactions/pending-transaction-modal";
import {PaymentDetailModal} from "./payment-detail-modal";

@autoinject
export class PaymentDetailCustomElement extends BaseElement {
    @bindable job: Job;

    constructor(private amountFormat: AmountFormatValueConverter, ...args) {
        super(...args);
    }

    cancel() {
        let _this = this;
        let jobAmount = this.amountFormat.toView(parseFloat(this.job.input.Amount || this.job.input.Amount2), this.utils.getPropertyValue<string>(this.job, '.meta.Currency.symbol'));
        kendo.confirm(`Are you sure you want to <strong>cancel</strong> payment of ${jobAmount} to account ${this.job.meta.DestinationAccountSummary['code']}`)
            .then(async t => {
                let response: BusinessJobRejectResponse = await _this.serviceClients.onlineAccountApi.post(new BusinessJobRejectRequest({
                    jobERN: _this.job.jobERN
                }));
                if (response.result)
                    $('.k-i-reload').click()
            });
    }

    async viewJobStatus() {
        await dispatchify("setJobViewerERN")(this.job.jobERN);
        await dispatchify("setCurrentJob")(this.job);
        //location.hash = "#/job/status";

        await this.dialogService.open({
            viewModel: PaymentDetailModal,
            lock: false
        })
    }

}

