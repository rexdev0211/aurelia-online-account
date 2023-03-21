import {observable} from "aurelia-framework";
import * as moment from "moment";
import {ApplicationState, BsBreakpoint, SelectedAccount} from "../../../../applicationState";
import {BaseElement} from "../../../../bases/base-element";
import {TransactionLineItem} from "../../../../common/models/transaction/transactionLineItem";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import {PendingTransactionModal} from "../../transactions/pending-transaction-modal";
import environment from "../../../../environment";
import {dispatchify} from "aurelia-store";
import GridColumn = kendo.ui.GridColumn;
import ListTransactionsRequest = OnlineAccountApi.ListTransactionsRequest;
import ListTransactionsResponse = OnlineAccountApi.ListTransactionsResponse;
import ListPendingPaymentOrdersRequest = OnlineAccountApi.ListPendingPaymentOrdersRequest;
import ListPendingPaymentOrdersResponse = OnlineAccountApi.ListPendingPaymentOrdersResponse;
import ListBatchPaymentsRequest = OnlineAccountApi.ListBatchPaymentsRequest;
import ListBatchPaymentsResponse = OnlineAccountApi.ListBatchPaymentsResponse;
import CancelBatchPaymentResponse = OnlineAccountApi.CancelBatchPaymentResponse;
import CancelBatchPaymentRequest = OnlineAccountApi.CancelBatchPaymentRequest;

export class AccountTransactionsCustomElement extends BaseElement {
    @observable selectedAccount: SelectedAccount;
    @observable filterDateRange: OnlineAccountApi.IDateRange;
    @observable breakpoint: BsBreakpoint;

    @observable showPendingOnly: boolean = false;

    hasPendingTransactions: boolean = false;

    private transactionGrid: kendo.ui.Grid;
    private pendingTransactionGrid: kendo.ui.Grid;
    private pendingPaymentsGrid: kendo.ui.Grid;
    private batchPaymentsGrid: kendo.ui.Grid;
    private transactionDateRange: kendo.ui.DateRangePicker;
    private transactionsFilter: string;

    private TransactionDateRangeInput: HTMLDivElement;
    private TransactionGrid: HTMLDivElement;
    private PendingTransactionGrid: HTMLDivElement;
    private dataSourcePendingPayments: kendo.data.DataSource;
    private dataSourceBatchPayments: kendo.data.DataSource;
    private hasPendingPayments: boolean;
    private hasBatchPayments: boolean;
    private filterAmount: string;
    private filterReference: string;
    private filterName: string;
    @observable goFast: boolean;
    private showGoFast: boolean;

    constructor(...args) {
        super(...args);

        let _this = this;

        this.showGoFast = environment().features['goFast'];
        this.goFast = this.state.goFast;

        this.subscriptions.push(this.eventService.subscribe('refresh:grid', () => {
            _this.pendingTransactionGrid.dataSource.read();
            _this.transactionGrid.dataSource.read();
        }));

        this.subscriptions.push(this.eventService.subscribe('refresh:grid:pending:payments', () => {
            _this.pendingPaymentsGrid.dataSource.read();
        }));

        this.subscriptions.push(this.eventService.subscribe('refresh:grid:batch:payments', () => {
            _this.batchPaymentsGrid.dataSource.read();
        }));

        this.dataSourcePendingPayments = new kendo.data.DataSource({
            autoSync: true,
            serverPaging: false,
            schema: {
                total: "total", // total is returned in the "total" field of the response
                data: "data"
            },
            requestStart: function () {
                _this.progressService.startProgress(true);
            },
            requestEnd: function () {
                _this.progressService.stopProgress();
            },
            transport: {
                read: async (e: any) => {
                    let accountCode = this.utils.getPropertyValue<string>(_this.state, '.accounts.sourceAccount.code');

                    if (!accountCode) {
                        e.success({"total": 0, "data": []});
                        return;
                    }

                    let response: OnlineAccountApi.ListPendingPaymentOrdersResponse;
                    let errorThrown: boolean = false;

                    this.serviceClients.onlineAccountApi.get(new ListPendingPaymentOrdersRequest({
                        accountCode: accountCode,
                    }))
                        //NOTE: this try/catch style is required to make this work. DO NOT revert to async/await
                        .catch(response => {
                            errorThrown = true;
                            e.error(new Error(response.responseStatus.message));
                        })
                        .then(value => {
                            if (!errorThrown) {
                                let response = (value as ListPendingPaymentOrdersResponse);
                                let results = response.results;
                                let data = results
                                    ? results.map(value => this.utils.rehydrateMeta(value))
                                    : [];

                                this.hasPendingPayments = data.length > 0;

                                e.success({"total": data.length, "data": data});
                            }
                        });
                }
            }
        })

        this.dataSourceBatchPayments = new kendo.data.DataSource({
            autoSync: true,
            serverPaging: false,
            schema: {
                total: "total", // total is returned in the "total" field of the response
                data: "data"
            },
            requestStart: function () {
                _this.progressService.startProgress(true);
            },
            requestEnd: function () {
                _this.progressService.stopProgress();
            },
            transport: {
                read: async (e: any) => {

                    let response: ListBatchPaymentsResponse;
                    let errorThrown: boolean = false;

                    this.serviceClients.onlineAccountApi.get(new ListBatchPaymentsRequest())
                        //NOTE: this try/catch style is required to make this work. DO NOT revert to async/await
                        .catch(response => {
                            errorThrown = true;
                            e.error(new Error(response.responseStatus.message));
                        })
                        .then(value => {
                            if (!errorThrown) {
                                let response = (value as ListBatchPaymentsResponse);
                                let results = response.results;
                                let data = results
                                    ? results.map(value => this.utils.rehydrateMeta(value))
                                    : [];

                                this.hasBatchPayments = data.length > 0;

                                e.success({"total": data.length, "data": data});
                            }
                        });
                }
            }
        })
    }

    goFastChanged(newValue, oldValue) {
        dispatchify('setGoFast')(newValue);
    }

    detached() {
        this.clearSubscriptions();
    }

    showPendingOnlyChanged(newValue, oldValue) {
        this.transactionGrid?.dataSource.read();
    }

    cancelBatchJob(job) {
        kendo.confirm('Please Note: This process cannot be undone and will stop any remaining jobs from executing.<br>Are you sure you want to cancel this batch job?')
            .then(async () => {
                let response: CancelBatchPaymentResponse = await this.serviceClients.onlineAccountApi.delete(new CancelBatchPaymentRequest({
                    jobERN: job.jobERN
                }));

                if (response.result === 'Job Cancelled') {
                    await this.notificationService.showMessage('success', 'Success', response.result);
                } else {
                    await this.notificationService.showMessage('error', 'Error', response.result);
                }
            })
    }

    async openModal(item) {
        let response = await this.serviceClients.onlineAccountApi.get(new OnlineAccountApi.ListPendingTransactionMessagesRequest({pendingTransactionERN: (item as any).pendingTransactionERN}));
        await this.dialogService.open({
            viewModel: PendingTransactionModal,
            model: {
                source: response.result,
                display: 'Messages',
                allowReject: false
            },
            lock: true
        }).whenClosed(response => {
        });
    }

    stateChanged(state: ApplicationState) {
        this.selectedAccount = state.accounts.sourceAccount;
        this.breakpoint = state.breakpoint;
    }

    breakpointChanged(value: BsBreakpoint) {
        if (value && this.transactionGrid) {
            value.bp < 3
                ? this.transactionGrid.hideColumn(1)
                : this.transactionGrid.showColumn(1);
        }
    }

    async selectedAccountChanged(newValue: SelectedAccount, oldValue?: SelectedAccount) {

        if (newValue && this.transactionGrid) {

            this.transactionGrid.pager.page(1);
            this.hasPendingTransactions = false;
            this.hasPendingPayments = false;
            this.hasBatchPayments = false;

            if (!newValue.isClearBankAccount) {
                this.pendingTransactionGrid?.dataSource?.read();
            } else {
                this.pendingPaymentsGrid?.dataSource?.read();
                this.batchPaymentsGrid?.dataSource?.read();
            }
        }
    }

    attached() {
        let _this: AccountTransactionsCustomElement = this;

        this.transactionDateRange = new kendo.ui.DateRangePicker($(this.TransactionDateRangeInput)[0], {
            format: 'dd/MM/yyyy',
            change: (e: kendo.ui.DateRangePickerChangeEvent) => {
                _this.setDateRangeFilter(e.sender.range())
            }
        });


        this.pendingTransactionGrid = new kendo.ui.Grid($(this.PendingTransactionGrid)[0], {
            toolbar: ["excel"],
            dataSource: new kendo.data.DataSource({
                autoSync: true,
                serverPaging: false,
                schema: {
                    total: "total", // total is returned in the "total" field of the response
                    data: "data"
                },
                requestStart: function () {
                    _this.progressService.startProgress(true);
                },
                requestEnd: function () {
                    _this.progressService.stopProgress();
                },
                transport: {
                    read: async (e: any) => {
                        let sourceAccountERN = this.utils.getPropertyValue<string>(_this.state, '.accounts.sourceAccount.ern');
                        let isClearBankAccount = this.utils.getPropertyValue<string>(_this.state, '.accounts.sourceAccount.isClearBankAccount');
                        if (!sourceAccountERN || isClearBankAccount) {
                            e.success({"total": 0, "data": []});
                            return;
                        }

                        let response: OnlineAccountApi.ListTransactionsResponse;
                        let errorThrown: boolean = false;

                        this.serviceClients.onlineAccountApi.post(new ListTransactionsRequest({
                            accountCode: this.state.accounts.sourceAccount.code,
                            state: 'PENDING'
                        }))
                            //NOTE: this try/catch style is required to make this work. DO NOT revert to async/await
                            .catch(response => {
                                errorThrown = true;
                                e.error(new Error(response.responseStatus.message));
                            })
                            .then(value => {
                                if (!errorThrown) {
                                    let response = (value as ListTransactionsResponse);
                                    let results = response.results;
                                    let data = results
                                        ? results.map(value => new TransactionLineItem(value))
                                        : [];

                                    this.hasPendingTransactions = data.length > 0;

                                    e.success({"total": response.count, "data": data});
                                }
                            });
                    }
                }
            }),
            autoBind: true,
            persistSelection: true,
            dataBound: (e) => {
                let grid = e.sender;

                grid.tbody.find("tr.k-master-row").click(function (e) {
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
            },
            columns: <GridColumn[]>[
                <GridColumn>{
                    field: "date",
                    title: "Date",
                    textAlign: "Center",
                    width: 130,
                    headerAttributes: {style: "text-align: center"},
                    attributes: {style: "text-align: center"}
                },
                <GridColumn>{field: "description", title: "Description", width: "100%"},
                <GridColumn>{
                    field: "formattedAmount",
                    title: "Amount",
                    width: 120,
                    headerAttributes: {style: "text-align: center"},
                    attributes: {style: "text-align: center"}
                },
                <GridColumn>{
                    field: "formattedLedgerBalance",
                    title: "Ledger Balance",
                    width: 140,
                    headerAttributes: {style: "text-align: center"},
                    attributes: {style: "text-align: center"}
                },
            ],
            detailTemplate: $("#detailTemplate").html(),
            detailInit: (e) => {
                _this.templateingEngine.enhance({
                    element: $(e.detailRow)[0],
                    bindingContext: {
                        transaction: e.data,
                        account: this.state.accounts.sourceAccount
                    }
                });
            },
            excelExport: (e: kendo.ui.GridExcelExportEvent) => {
                let element = $(this.PendingTransactionGrid);
                (e.workbook as any).fileName = `${this.state.accounts.sourceAccount.code}-PENDING-${moment().format('YYYYMMDD')}`;
                if (e.sender.columns.some(x => x.hidden)) {
                    element.css('max-height', element.height());
                    element.css('overflow', 'none');
                    kendo.ui.progress(element, true);
                    e.preventDefault();
                    for (let x = 4; x < e.sender.columns.length; x++) {
                        e.sender.showColumn(x);
                    }
                    setTimeout(() => e.sender.saveAsExcel());
                } else {
                    for (let x = 4; x < e.sender.columns.length; x++) {
                        e.sender.hideColumn(x);
                    }
                    kendo.ui.progress(element, false);
                    element.css('max-height', '');
                    element.css('overflow', '');
                }
            }
        });

        this.transactionGrid = new kendo.ui.Grid($(this.TransactionGrid)[0], {
            toolbar: ["excel"],
            dataSource: new kendo.data.DataSource({
                autoSync: true,
                serverPaging: true,
                pageSize: 10,
                schema: {
                    total: "total", // total is returned in the "total" field of the response
                    data: "data"
                },
                requestStart: function () {
                    _this.progressService.startProgress(true);
                },
                requestEnd: function () {
                    _this.progressService.stopProgress();
                },
                transport: {
                    read: async (e: any) => {
                        let sourceAccountERN = this.utils.getPropertyValue<string>(_this.state, '.accounts.sourceAccount.ern');
                        if (!sourceAccountERN) {
                            e.success({"total": 0, "data": []});
                            return;
                        }

                        let page = (e.data.page != null) ? e.data.page : 1;
                        let pageSize = (e.data.pageSize != null) ? e.data.pageSize : 25;
                        let skip = (e.data.skip != null) ? e.data.skip : 0;
                        let take = (e.data.take != null) ? e.data.take : skip === 0 ? pageSize : (page - 1) * pageSize;

                        if (!this.filterDateRange) {
                            this.filterDateRange = {from: null, to: null};
                        }

                        let response: OnlineAccountApi.ListTransactionsResponse;
                        let errorThrown: boolean = false;

                        let request = new ListTransactionsRequest({
                            accountCode: this.state.accounts.sourceAccount.code,
                            page: page,
                            pageSize: pageSize,
                            skip: skip,
                            take: take,
                            from: this.filterDateRange.from,
                            to: this.filterDateRange.to,
                            filterName: this.filterName,
                            filterReference: this.filterReference,
                            filterAmount: this.filterAmount,
                            goFast: this.state.goFast
                        });

                        if (this.selectedAccount?.isClearBankAccount && this.showPendingOnly)
                            request.state = 'PENDING'

                        this.serviceClients.onlineAccountApi.post(request)
                            //NOTE: this try/catch style is required to make this work. DO NOT revert to async/await
                            .catch(response => {
                                errorThrown = true;
                                e.error(new Error(response.responseStatus.message));
                            })
                            .then(value => {
                                if (!errorThrown) {
                                    let response = (value as ListTransactionsResponse);
                                    if (!response || !response.results) e.success({"total": 0, "data": []});

                                    let results = response.results;
                                    let data = results
                                        ? results.map(value => new TransactionLineItem(value))
                                        : [];

                                    e.success({"total": response.count, "data": data});
                                }
                            });
                    }
                }
            }),
            pageable: {
                refresh: true,
                pageSize: 10,
                pageSizes: [10, 25, 50, 100, 500, 1000, 2500, 5000]
            },
            autoBind: true,
            persistSelection: true,
            dataBound: function (e) {
                let grid = e.sender;

                // Expand / Collapse Detail Row
                grid.tbody.find("tr.k-master-row").click(function (e) {
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
                });

                // Highlight Hold Transactions
                // iterate the table rows and apply custom row and cell styling
                const rows = e.sender.tbody.children();
                for (let j = 0; j < rows.length; j++) {

                    let row = $(rows[j]);
                    const dataItem: TransactionLineItem = (e.sender.dataItem(row) as unknown) as TransactionLineItem;

                    if (dataItem.hold) {
                        row.addClass("table-danger");
                    }
                }

            },
            columns: <GridColumn[]>[
                <GridColumn>{
                    field: "date",
                    title: "Date",
                    textAlign: "Center",
                    width: 130,
                    headerAttributes: {style: "text-align: center"},
                    attributes: {style: "text-align: center"}
                },
                <GridColumn>{field: "description", title: "Description", width: "100%"},
                <GridColumn>{
                    field: "formattedAmount",
                    title: "Amount",
                    width: 120,
                    headerAttributes: {style: "text-align: center"},
                    attributes: {style: "text-align: center"}
                },
                <GridColumn>{
                    field: "formattedAccountBalance",
                    title: "Balance",
                    width: 140,
                    headerAttributes: {style: "text-align: center"},
                    attributes: {style: "text-align: center"}
                },
                <GridColumn>{field: "counterpartBban", hidden: true, title: 'BBAN'},
                <GridColumn>{field: "counterpartIban", hidden: true, title: 'IBAN'},
                <GridColumn>{field: "reference", title: "Reference", width: 180, hidden: true},
                <GridColumn>{field: "accountName", hidden: true, title: 'AccountName'},
                <GridColumn>{field: "accountTransactionOwnerName", hidden: true, title: 'IntendedBeneficiary'},
                <GridColumn>{field: "counterpartInstitutionName", hidden: true, title: 'InstitutionName'},
                <GridColumn>{field: "scheme", hidden: true, title: 'Scheme'},
                <GridColumn>{field: "transactionId", hidden: true, title: 'Transaction Id'},
                <GridColumn>{field: "amount", hidden: true, title: 'Amount Raw'},
                <GridColumn>{field: "currencyCode", hidden: true, title: 'Currency'},
                <GridColumn>{field: "nickName", hidden: true, title: 'Friendly Name'}
            ],
            detailTemplate: $("#detailTemplate").html(),
            detailInit: (e) => {
                _this.templateingEngine.enhance({
                    element: $(e.detailRow)[0],
                    bindingContext: {
                        transaction: e.data,
                        account: this.state.accounts.sourceAccount
                    }
                });
            },
            excelExport: (e: kendo.ui.GridExcelExportEvent) => {
                let element = $(this.TransactionGrid);
                (e.workbook as any).fileName = `${this.state.accounts.sourceAccount.code}-${moment().format('YYYYMMDD')}`;
                if (e.sender.columns.some(x => x.hidden)) {
                    element.css('max-height', element.height());
                    element.css('overflow', 'none');
                    kendo.ui.progress(element, true);
                    e.preventDefault();
                    for (let x = 4; x < e.sender.columns.length; x++) {
                        e.sender.showColumn(x);
                    }
                    setTimeout(() => e.sender.saveAsExcel());
                } else {
                    for (let x = 4; x < e.sender.columns.length; x++) {
                        e.sender.hideColumn(x);
                    }
                    kendo.ui.progress(element, false);
                    element.css('max-height', '');
                    element.css('overflow', '');
                }
            }
        });
    }

    filterDateRangeChanged(value: OnlineAccountApi.IDateRange) {
        if (this.pendingTransactionGrid) this.pendingTransactionGrid.dataSource.read();
        if (this.transactionGrid) {
            this.transactionGrid.dataSource.read();
            this.transactionGrid.pager.page(1);
        }
    }


    clearFilterDateRange() {
        this.filterAmount = this.filterName = this.filterReference = null;
        this.transactionDateRange.range({start: null, end: null});
        this.filterDateRange = {from: null, to: null};
    }

    refreshGrid() {
        if (this.transactionGrid) {
            this.transactionGrid.dataSource.read();
            this.transactionGrid.pager.page(1);
        }
    }

    private setDateRangeFilter(range: any) {
        if (range.start && range.end) {
            let from = this.utils.getUTCDate(range.start);
            let to = this.utils.getUTCDate(range.end);

            if (this.filterDateRange.from !== from || this.filterDateRange.to !== to)
                this.filterDateRange = {
                    from: from,
                    to: to
                };
        }
    }

}

