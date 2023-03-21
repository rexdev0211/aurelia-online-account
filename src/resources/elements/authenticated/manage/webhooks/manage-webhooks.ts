import {bindable, observable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ApplicationState, SelectedAccount} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {filterLocalAccounts, filterManagedAccounts, formatAccountSummary, pagable, sortBy} from "../../../../../common/services/shared";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import WebhookEvents from "../../../../../dtos/webhook-events";
import {BeneficiaryViewType} from "../../payments/beneficiaries/beneficiary-state";
import {WebhookViewType} from "./webhooks-state";
import GridPageable = kendo.ui.GridPageable;
import CustomerWebhookRequest = OnlineAccountApi.CustomerWebhookRequest;
import CustomerWebhookResponse = OnlineAccountApi.CustomerWebhookResponse;

export class ManageWebhooksCustomElement extends BaseElement {
    @bindable value: string;
    @observable sourceAccount: SelectedAccount;
    @observable viewType: WebhookViewType;

    private accounts: { text: string; value: string; name: string; currency: string; symbol: string }[];
    private showAddWebhookButton: boolean = false;
    private grid: kendo.ui.Grid;
    private webHooks: OnlineAccountApi.WebhookSummary[];
    private pageable: GridPageable;
    private dataSource: kendo.data.DataSource;

    constructor(...args) {
        super(...args);

        this.accounts = this.state.customerSummary.accounts
            .filter(filterLocalAccounts())
            .sort(sortBy(['accountName', 'currencyCode', 'code']))
            .map(formatAccountSummary())
            .concat(this.state.customerSummary.accounts
                .filter(filterManagedAccounts(['Send Funds (Request)', 'Send Funds (Authorize)', 'Send Funds (Admin)']))
                .sort(sortBy(['accountName', 'currencyCode', 'code']))
                .map(formatAccountSummary()));

        this.pageable = pagable;
    }

    onReady(e) {
        this.grid = e;
        this.grid.options.pageable = pagable;
    }

    attached() {
        this.taskQueue.queueMicroTask(() => {
            this.sourceAccountChanged(this.utils.getPropertyValue<SelectedAccount>(this.state, '.webhooks.sourceAccount'));
        });
    }

    stateChanged(state: ApplicationState) {
        this.sourceAccount = this.utils.getPropertyValue<SelectedAccount>(state, '.webhooks.sourceAccount');
        this.viewType = this.utils.getPropertyValue<WebhookViewType>(this.state, '.webhooks.view');
    }

    viewTypeChanged(value: WebhookViewType, oldValue: WebhookViewType) {
        if (!oldValue) return;

        if (value === WebhookViewType.Manage && oldValue !== WebhookViewType.Manage) {
            this.attached();
        }
    }

    sourceAccountChanged(sourceAccount: SelectedAccount) {
        this.webHooks = null;
        if (this.grid && sourceAccount) {
            this.webHooks = this.state.webhooks.items.filter(x => x.event.startsWith(`${WebhookEvents.TransactionActivity}.${sourceAccount.code}`));

            this.dataSource = new kendo.data.DataSource({
                data: this.webHooks
            });
            this.grid.setDataSource(this.dataSource);
            this.grid.pager.page(1);

            this.taskQueue.queueMicroTask(() => {
                $('.k-pager-refresh').off('click').on('click', async () => {
                    await dispatchify('fetchWebhooks')();
                });
            });
        }
        this.showAddWebhookButton = this.webHooks && !this.webHooks.length;
    }

    async sourceChanged(e) {
        let dataItem = e.sender.dataItem();

        if (!dataItem.value) {
            await dispatchify('setManageWebhooksSource')(null);
            return;
        }

        await dispatchify('setManageWebhooksSource')(new SelectedAccount(this.state.customerSummary.accounts.find(x => x.ern === dataItem.value)));
    }

    async addWebhook() {
        await dispatchify('setManageWebhooksView')(WebhookViewType.Add);
    }


    async gridCommand(e) {
        e.preventDefault();
        let dataItem = this.grid.dataItem($(e.currentTarget).closest("tr"));
        await dispatchify('selectWebhook')(dataItem);
        switch (e.data.commandName) {
            case 'view':
                await dispatchify('setManageWebhooksView')(BeneficiaryViewType.View);
                break;
            case 'edit':
                await dispatchify('setManageWebhooksView')(BeneficiaryViewType.Edit);
                break;
            case 'delete':
                kendo.confirm(`Are you sure you want to remove the webhook <strong>${this.state.webhooks.selectedWebhook.name}</strong><br>for event <strong>${this.state.webhooks.selectedWebhook.event}</strong>`)
                    .then(async t => {
                        let response: CustomerWebhookResponse = await this.serviceClients.onlineAccountApi.delete(new CustomerWebhookRequest({
                            ern: this.state.webhooks.selectedWebhook.ern
                        }));
                        if (response.result) {
                            await dispatchify('fetchWebhooks')();
                            this.attached();
                        }
                    })
                break;

        }
        // alert(`Command '${e.data.commandName}' was executed`);
        // console.log(this);
    }

}

