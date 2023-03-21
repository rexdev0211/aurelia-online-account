import {bindable, observable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ApplicationState, SelectedAccount} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {canCreateBeneficiary, canLinkBeneficiary, canUnlinkBeneficiary, canUpdateBeneficiary, getBeneficiaryAccounts, pagable} from "../../../../../common/services/shared";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {BeneficiaryViewType} from "./beneficiary-state";
import GridPageable = kendo.ui.GridPageable;
import ListBeneficiaryAccountsRequest = OnlineAccountApi.ListBeneficiaryAccountsRequest;
import ListBeneficiaryAccountsResponse = OnlineAccountApi.ListBeneficiaryAccountsResponse;

export class ManageBeneficiariesCustomElement extends BaseElement {
    @bindable value;
    @observable sourceAccount: SelectedAccount;
    @observable nickName: string;
    @observable viewType: BeneficiaryViewType;

    private canAdd: boolean = true;
    private canUpdate: boolean = true;
    private canLink: boolean = true;
    private canUnlink: boolean = true;

    private accounts: { text: string; value: string; name: string; currency: string; symbol: string }[];
    private grid: kendo.ui.Grid;
    private dataSource: kendo.data.DataSource;
    private pageable: GridPageable;

    //{ pageSizes: number[]; alwaysVisible: boolean; refresh: boolean; pageSize: number };

    constructor(...args) {
        super(...args);

        this.accounts = getBeneficiaryAccounts(this.state);

        let _this = this;

        this.pageable = pagable;

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
                    if (!_this.utils.getPropertyValue<SelectedAccount>(_this.state, '.beneficiaries.sourceAccount')) {
                        e.success({"total": 0, "data": []});
                        return;
                    }

                    let page = (e.data.page != null) ? e.data.page : 1;
                    let pageSize = (e.data.pageSize != null) ? e.data.pageSize : 25;
                    let skip = (e.data.skip != null) ? e.data.skip : 0;
                    let take = (e.data.take != null) ? e.data.take : skip === 0 ? pageSize : (page - 1) * pageSize;

                    let errorThrown: boolean = false;

                    this.serviceClients.onlineAccountApi.post(new ListBeneficiaryAccountsRequest({
                        accountERN: this.state.beneficiaries.sourceAccount.ern,
                        page: page,
                        pageSize: pageSize,
                        skip: skip,
                        take: take,
                        nickName: _this.nickName
                    }))
                    //NOTE: this try/catch style is required to make this work. DO NOT revert to async/await
                        .catch(response => {
                            errorThrown = true;
                            e.error(new Error(response.responseStatus.message));
                        })
                        .then(value => {
                            if (!errorThrown) {
                                let response = (value as ListBeneficiaryAccountsResponse);
                                e.success({"total": response.count, "data": response.results});
                            }
                        });
                }
            }
        });
    }

    onReady(e) {
        this.grid = e;
        this.grid.options.pageable = pagable;
    }

    clear() {
        this.nickName = null;
    }

    nickNameChanged(value: string) {
        this.grid.dataSource.read();
    }


    stateChanged(state: ApplicationState) {
        this.sourceAccount = this.utils.getPropertyValue<SelectedAccount>(this.state, ".beneficiaries.sourceAccount");
        this.viewType = this.utils.getPropertyValue<BeneficiaryViewType>(this.state, '.beneficiaries.view');
    }

    viewTypeChanged(value: BeneficiaryViewType, oldValue: BeneficiaryViewType) {
        if (!oldValue) return;

        if (value === BeneficiaryViewType.Manage && oldValue !== BeneficiaryViewType.Manage && this.grid) {
            this.grid.dataSource.read();
        }
    }

    async sourceAccountChanged(value: SelectedAccount, oldValue: SelectedAccount) {
        if (this.grid)
            this.grid.pager.page(1);
    }

    onDataBound(e) {
        let grid = e.sender;
        $('a[href*=\'#\']', grid.tbody).removeAttr('href');
    }

    async gridCommand(action, dataItem) {
        await dispatchify('setBeneficiariesSelected')(dataItem);
        switch (action) {
            case 'view':
                await dispatchify('setBeneficiariesView')(BeneficiaryViewType.View);
                break;
            case 'edit':
                await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Edit);
                break;
            case 'delete':
                await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Delete);
                break;

        }
        // alert(`Command '${e.data.commandName}' was executed`);
        // console.log(this);
    }

    async sourceChanged(e) {
        let dataItem = e.sender.dataItem();

        if (!dataItem.value) {
            await dispatchify('setBeneficiariesSource')(null);
            return;
        }

        let sourceAccount = new SelectedAccount(this.state.customerSummary.accounts.find(x => x.ern === dataItem.value));
        await dispatchify('setBeneficiariesSource')(sourceAccount);
        this.canAdd = (!sourceAccount.isManagedAccount || (sourceAccount.isManagedAccount && canCreateBeneficiary(this.state)));
        this.canUpdate = (!sourceAccount.isManagedAccount || (sourceAccount.isManagedAccount && canUpdateBeneficiary(this.state)));
        this.canLink = (!sourceAccount.isManagedAccount || (sourceAccount.isManagedAccount && canLinkBeneficiary(this.state)));
        this.canUnlink = (!sourceAccount.isManagedAccount || (sourceAccount.isManagedAccount && canUnlinkBeneficiary(this.state)));
    }


    async link() {
        if (!this.canLink) return;

        await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Link);
    }


    async create() {
        if (!this.canAdd) return;

        await dispatchify('setBeneficiariesView')(BeneficiaryViewType.Add);
    }
}

