import {autoinject, bindable, observable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ApplicationState, SelectedAccount} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {JsvService} from "../../../../../common/services/jsv-service";
import {
  filterLocalAccounts,
  filterManagedAccounts,
  formatAccountSummary,
  pagable,
  sortBy
} from "../../../../../common/services/shared";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {AmountFormatValueConverter} from "../../../../value-converters/currency-format";
import {DateFormatValueConverter} from "../../../../value-converters/date-format";
import ListBusinessPaymentsRequest = OnlineAccountApi.ListBusinessPaymentsRequest;
import ListBusinessPaymentsResponse = OnlineAccountApi.ListBusinessPaymentsResponse;

@autoinject
export class PaymentOrdersCustomElement extends BaseElement {
  @observable sourceAccount: SelectedAccount;
  @bindable dataSource: kendo.data.DataSource;
  public grid: kendo.ui.Grid;
  private pageable: kendo.ui.GridPageable;
  private reloadGrid: boolean;
  private accounts: { text: string; value: string; name: string; currency: string; symbol: string }[];

  constructor(private jsv: JsvService,
              private amountFormat: AmountFormatValueConverter,
              private dateFormat: DateFormatValueConverter,
              ...args) {
    super(...args);

    this.accounts = this.state.customerSummary.accounts
      .filter(filterLocalAccounts())
      .sort(sortBy(['accountName', 'currencyCode', 'code']))
      .map(formatAccountSummary())
      .concat(this.state.customerSummary.accounts
        .filter(filterManagedAccounts(['Send Funds (Request)', 'Send Funds (Authorize)', 'Send Funds (Admin)',
          'Transfer Funds (Request)', 'Transfer Funds (Authorize)', 'Transfer Funds (Admin)']))
        .sort(sortBy(['accountName', 'currencyCode', 'code']))
        .map(formatAccountSummary()));

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
          let sourceAccountERN = this.utils.getPropertyValue<string>(_this.state, '.payments.orders.sourceAccount.ern');
          if (!sourceAccountERN) {
            e.success({"total": 0, "data": []});
            return;
          }

          let page = (e.data.page != null) ? e.data.page : 1;
          let pageSize = (e.data.pageSize != null) ? e.data.pageSize : 25;
          let skip = (e.data.skip != null) ? e.data.skip : 0;
          let take = (e.data.take != null) ? e.data.take : skip === 0 ? pageSize : (page - 1) * pageSize;

          let errorThrown: boolean = false;

          this.serviceClients.onlineAccountApi.post(new ListBusinessPaymentsRequest({
            accountERN: sourceAccountERN,
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
                let response = (value as ListBusinessPaymentsResponse);
                e.success({"total": response.count, "data": _this.utils.rehydrateMeta(response.results)});
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
    if (this.grid && sourceAccount) {
      this.reloadGrid = true;
      this.grid.pager.page(1);
      await this.grid.dataSource.read();
      this.grid.refresh();
    }
  }

}

