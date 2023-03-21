import {autoinject, bindable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
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
import ListBusinessPendingRequestsRequest = OnlineAccountApi.ListBusinessPendingRequestsRequest;
import ListBusinessPendingRequestsResponse = OnlineAccountApi.ListBusinessPendingRequestsResponse;

@autoinject
export class ManageRequestsCustomElement extends BaseElement {
    @bindable dataSource: kendo.data.DataSource;
    private pageable: kendo.ui.GridPageable;
    private grid: kendo.ui.Grid;

    constructor(private jsv: JsvService,
                private amountFormat: AmountFormatValueConverter,
                private dateFormat: DateFormatValueConverter,
                ...args) {
        super(...args);

        this.pageable = pagable;

        if (this.state.customerSummary.businesses.length === 1) {
            dispatchify('setRequestsSelectedBusiness')(this.state.customerSummary.businesses[0]);
        }

        this.dataSource = new kendo.data.DataSource({
            autoSync: true,
            serverPaging: true,
            pageSize: 10,
            schema: {
                total: "total", // total is returned in the "total" field of the response
                data: "data"
            },
            requestStart: () => {
                this.progressService.startProgress();
            },
            requestEnd: () => {
                this.progressService.stopProgress();
            },
            transport: {
                read: async (e: any) => {
                    let sourceAccountERN = this.utils.getPropertyValue<string>(this.state, '.requests.selectedBusiness.ern');
                    if (!sourceAccountERN) {
                        e.success({"total": 0, "data": []});
                        return;
                    }
                    let page = (e.data.page != null) ? e.data.page : 1;
                    let pageSize = (e.data.pageSize != null) ? e.data.pageSize : 25;
                    let skip = (e.data.skip != null) ? e.data.skip : 0;
                    let take = (e.data.take != null) ? e.data.take : skip === 0 ? pageSize : (page - 1) * pageSize;

                    let errorThrown: boolean = false;

                    this.serviceClients.onlineAccountApi.post(new ListBusinessPendingRequestsRequest({
                        businessERN: sourceAccountERN,
                        page: page,
                        pageSize: pageSize,
                        skip: skip,
                        take: take,
                    }))
                        //NOTE: this try/catch style is required to make this work. DO NOT revert to async/await
                        .catch(response => {
                            errorThrown = true;
                            e.success({"total": 0, "data": []});
                        })
                        .then(value => {
                            if (!errorThrown) {
                                let response = (value as ListBusinessPendingRequestsResponse);
                                e.success({"total": response.count, "data": response.results});
                            }
                        });
                }
            }
        })

        // if (this.utils.getPropertyValue<CustomerBusinessLookup>(this.state, '.requests.selectedBusiness')) this.reload();
    }

    onReady(e) {
        this.grid = e;
    }

    async businessChanged(e) {
        let dataItem = e.sender.dataItem();

        if (!dataItem.ern) {
            await dispatchify('clearRequests')();
            return;
        }

        await dispatchify('setRequestsSelectedBusiness')(dataItem);
        this.grid.dataSource.read();
    }

    // async reload() {
    //     if (!this.state.requests.selectedBusiness && !this.state.requests.selectedBusiness.ern) return;
    //
    //     let data = await this.serviceClients.onlineAccountApi.post(new ListBusinessPendingRequestsRequest({
    //         businessERN: this.state.requests.selectedBusiness.ern
    //     }));
    //
    //     this.dataSource = new kendo.data.DataSource({data: this.utils.rehydrateMeta(data.result.results)});
    //
    //     let _this = this;
    //     this.taskQueue.queueMicroTask(() => {
    //         $('.k-pager-refresh').off('click').on('click', async () => {
    //             await _this.reload();
    //         });
    //     });
    //
    //     if (this.grid)
    //         this.grid.setDataSource(this.dataSource);
    // }

    approve(job) {
        let message = `<strong>Approve</strong> ${job.type}<br>requested by <strong>${job.requestedBy.userAuthEmail}</strong>`;
        kendo.confirm(message).then(async t => {
            let response: BusinessJobApproveResponse = await this.serviceClients.onlineAccountApi.post(new BusinessJobApproveRequest({
                jobERN: job.jobERN
            }));
            if (response.result)
                this.grid.dataSource.read();
        });

    }

    reject(job) {
        let message = `<strong>Approve</strong> ${job.type}<br>requested by <strong>${job.requestedBy.userAuthEmail}</strong>`;
        kendo.confirm(message).then(async t => {
            let response: BusinessJobRejectResponse = await this.serviceClients.onlineAccountApi.post(new BusinessJobRejectRequest({
                jobERN: job.jobERN
            }));
            if (response.result)
                this.grid.dataSource.read();
        });
    }

}

