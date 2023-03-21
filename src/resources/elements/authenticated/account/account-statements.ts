import {autoinject, bindable, observable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ApplicationState, SelectedAccount} from "../../../../applicationState";
import {BaseElement} from '../../../../bases/base-element';
import {JsvService} from "../../../../common/services/jsv-service";
import {
    filterClearBankAccounts,
    filterLocalAccounts,
    filterManagedAccounts,
    formatAccountSummary,
    hasBillingEnabled,
    pagable,
    sortBy
} from "../../../../common/services/shared";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import {AmountFormatValueConverter} from "../../../value-converters/currency-format";
import {DateFormatValueConverter} from "../../../value-converters/date-format";
import {base64StringToBlob} from "blob-util";
import * as FileSaver from "file-saver";
import ListAccountDocumentsRequest = OnlineAccountApi.ListAccountDocumentsRequest;
import ListAccountDocumentsResponse = OnlineAccountApi.ListAccountDocumentsResponse;

@autoinject
export class AccountStatementsCustomElement extends BaseElement {
    @observable sourceAccount: SelectedAccount;
    @bindable dataSource: kendo.data.DataSource;
    public grid: kendo.ui.Grid;
    private pageable: kendo.ui.GridPageable;
    private reloadGrid: boolean;
    private accounts: { text: string; value: string; name: string; currency: string; symbol: string }[];
    private documentType: OnlineAccountApi.AccountDocumentType;
    private reportTypes: OnlineAccountApi.EnumPropertyValue[];

    constructor(private jsv: JsvService,
                private amountFormat: AmountFormatValueConverter,
                private dateFormat: DateFormatValueConverter,
                ...args) {
        super(...args);

        this.accounts = this.state.customerSummary.accounts
            .filter(filterLocalAccounts())
            .filter(filterClearBankAccounts())
            .sort(sortBy(['accountName', 'currencyCode', 'code']))
            .map(formatAccountSummary())
            .concat(this.state.customerSummary.accounts
                .filter(filterManagedAccounts(['View Account Documents']))
                .filter(filterClearBankAccounts())
                .sort(sortBy(['accountName', 'currencyCode', 'code']))
                .map(formatAccountSummary()));

        this.reportTypes = hasBillingEnabled(this.state)
            ? this.state.enums.AccountDocumentType
            : this.state.enums.AccountDocumentType.slice(0, 1);


        this.pageable = pagable;

        let _this = this;

        this.dataSource = new kendo.data.DataSource({
            autoSync: true,
            serverPaging: true,
            pageSize: 10,
            schema: {
                total: "total", // total is returned in the "total" field of the response
                data: "data"
            },
            requestStart: function () {
                _this.progressService.startProgress();
            },
            requestEnd: function () {
                _this.progressService.stopProgress();
            },
            transport: {
                read: async (e: any) => {
                    // Reload Grid Exit Early
                    if (this.reloadGrid) {
                        this.reloadGrid = false;
                        e.success({"total": 0, "data": []});
                        return;
                    }

                    // No Source Account Exit Early
                    let sourceAccountCode = this.utils.getPropertyValue<string>(_this.state, '.payments.orders.sourceAccount.code');
                    if (!sourceAccountCode) {
                        e.success({"total": 0, "data": []});
                        return;
                    }

                    let page = (e.data.page != null) ? e.data.page : 1;
                    let pageSize = (e.data.pageSize != null) ? e.data.pageSize : 25;
                    let skip = (e.data.skip != null) ? e.data.skip : 0;
                    let take = (e.data.take != null) ? e.data.take : skip === 0 ? pageSize : (page - 1) * pageSize;

                    let errorThrown: boolean = false;

                    this.serviceClients.onlineAccountApi.get(new ListAccountDocumentsRequest({
                        acno: sourceAccountCode,
                        type: this.documentType,
                        page: page,
                        pageSize: pageSize,
                        skip: skip,
                        take: take,
                    }))
                        //NOTE: this try/catch style is required to make this work. DO NOT revert to async/await
                        .catch(response => {
                            errorThrown = true;
                            e.error(new Error(response.responseStatus.message));
                        })
                        .then(value => {
                            if (!errorThrown) {
                                let response = (value as ListAccountDocumentsResponse);
                                e.success({
                                    "total": response.count,
                                    "data": _this.utils.rehydrateMeta(response.results)
                                });
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

    stateChanged(state: ApplicationState) {
        this.sourceAccount = this.utils.getPropertyValue<SelectedAccount>(state, '.payments.orders.sourceAccount');
    }

    async sourceChanged(e) {
        let dataItem = e.sender.dataItem();

        if (!dataItem.value) {
            await dispatchify('setPaymentOrdersSource')(null);
            return;
        }

        await dispatchify('setPaymentOrdersSource')(new SelectedAccount(this.state.customerSummary.accounts.find(x => x.ern === dataItem.value)));
    }

    async sourceAccountChanged(sourceAccount: SelectedAccount) {
        await this.refreshGrid();
    }

    async accountTypeChanged(newValue, oldValue) {
        await this.refreshGrid();
    }

    async refreshGrid() {
        if (this.grid && this.sourceAccount) {
            this.reloadGrid = true;
            this.grid.pager.page(1);
            await this.grid.dataSource.read();
            this.grid.refresh();
        }
    }

    download($this) {
        kendo.confirm(`Download Account Document?<br><br>${$this.description}.PDF`)
            .then(async () => {
                let response = await this.serviceClients.onlineAccountApi.get(new OnlineAccountApi.GetAccountDocumentRequest({
                    acno: $this.acno,
                    ern: $this.ern
                }));

                if (response.result) {
                    FileSaver.saveAs(base64StringToBlob(response.result, 'application/pdf'), `${$this.description}.pdf`, false);
                }
            });
    }

}

