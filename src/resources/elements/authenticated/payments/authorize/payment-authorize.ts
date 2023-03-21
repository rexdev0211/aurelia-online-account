import {autoinject, bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../../bases/base-element';
import {JsvService} from "../../../../../common/services/jsv-service";
import {pagable} from "../../../../../common/services/shared";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {AmountFormatValueConverter} from "../../../../value-converters/currency-format";
import {DateFormatValueConverter} from "../../../../value-converters/date-format";
import BusinessJobApproveRequest = OnlineAccountApi.BusinessJobApproveRequest;
import BusinessJobApproveResponse = OnlineAccountApi.BusinessJobApproveResponse;
import BusinessJobRejectRequest = OnlineAccountApi.BusinessJobRejectRequest;
import BusinessJobRejectResponse = OnlineAccountApi.BusinessJobRejectResponse;
import BusinessPendingJobsSummary = OnlineAccountApi.BusinessPendingJobsSummary;
import ListBusinessPendingPaymentsRequest = OnlineAccountApi.ListBusinessPendingPaymentsRequest;

@autoinject
export class PaymentAuthorizeCustomElement extends BaseElement {
    @bindable dataSource: BusinessPendingJobsSummary[];
    private pageable: kendo.ui.GridPageable;
    private grid: kendo.ui.Grid;
    private Grid: HTMLDivElement;

    constructor(private jsv: JsvService,
                private amountFormat: AmountFormatValueConverter,
                private dateFormat: DateFormatValueConverter,
                ...args) {
        super(...args);

        this.pageable = pagable;
    }

    async attached() {
        await this.reload();
    }

    async reload() {
        let data = await this.serviceClients.onlineAccountApi.post(new ListBusinessPendingPaymentsRequest({
            businessERNs: this.state.customerSummary.businesses.map(x => x.ern)
        }));

        this.dataSource = this.utils.rehydrateMeta(data.results.filter(x => x.results.length));

        let _this = this;
        this.taskQueue.queueMicroTask(() => {
            $('.k-pager-refresh').off('click').on('click', async () => {
                await _this.reload();
            });
        });

    }

    gridDataBound(e) {


        let grid = e.sender;

        grid.tbody.find("tr.k-master-row").click((e) => {
            let target = $(e.target);
            if ((target.hasClass("k-i-expand")) || (target.hasClass("k-i-collapse"))) {
                return;
            }

            let row = target.closest("tr.k-master-row");
            let icon = row.find(".k-i-expand");

            if (icon.length) {
                grid.expandRow(row);
            } else {
                grid.collapseRow(row);
            }
        })
    }

    approve(job) {
        let message = `<strong>Approve</strong> ${job.type === 'SendFunds' ? 'sending' : 'transferring'} <strong>${this.amountFormat.toView(job.input['Amount'] || job.input['Amount2'])}</strong> to <strong>${job.meta['DestinationAccountSummary'].name}</strong> on <strong>${this.dateFormat.toView(job.scheduleDate)}</strong><br>requested by <strong>${job.requestedBy.userAuthEmail}</strong>`;
        kendo.confirm(message).then(async t => {
            let response: BusinessJobApproveResponse = await this.serviceClients.onlineAccountApi.post(new BusinessJobApproveRequest({
                jobERN: job.jobERN
            }));
            if (response.result)
                await this.reload();
        });

    }

    reject(job) {
        let message = `<strong>Reject</strong> ${job.type === 'SendFunds' ? 'sending' : 'transferring'} <strong>${this.amountFormat.toView(job.input['Amount'] || job.input['Amount2'])}</strong> to <strong>${job.meta['DestinationAccountSummary'].name}</strong> on <strong>${this.dateFormat.toView(job.scheduleDate)}</strong><br>requested by <strong>${job.requestedBy.userAuthEmail}</strong>`;
        kendo.confirm(message).then(async t => {
            let response: BusinessJobRejectResponse = await this.serviceClients.onlineAccountApi.post(new BusinessJobRejectRequest({
                jobERN: job.jobERN
            }));
            if (response.result)
                await this.reload();
        });
    }

}

