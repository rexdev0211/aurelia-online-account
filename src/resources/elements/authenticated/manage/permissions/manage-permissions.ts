import {autoinject, bindable, computedFrom, observable} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ApplicationState} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {AmountFormatValueConverter} from "../../../../value-converters/currency-format";
import {FriendlyACLValueConverter} from "../../../../value-converters/friendly-acl";
import {FriendlyERNValueConverter} from "../../../../value-converters/friendly-ern";
import {KendoDropDownList} from "../../../components/kendo/kendo-drop-down-list";
import {DenyBusinessPermissionsModel} from "./deny-business-permissions-model";
import {GrantBusinessPermissionsModel} from "./grant-business-permissions-model";
import CustomerBusinessSummary = OnlineAccountApi.CustomerBusinessSummary;
import ListBusinessBeneficiaryAccountsRequest = OnlineAccountApi.ListBusinessBeneficiaryAccountsRequest;
import ListBusinessBeneficiaryAccountsResponse = OnlineAccountApi.ListBusinessBeneficiaryAccountsResponse;
import MemberSummary = OnlineAccountApi.MemberSummary;

@autoinject
export class ManagePermissionsCustomElement extends BaseElement {
    @observable selectedBusiness: CustomerBusinessSummary;
    @bindable limitValue;
    @bindable selectedOperation;
    @bindable selectedResource;
    @bindable selectedMember;
    private resource: KendoDropDownList;
    private resourceItems: { text: string, value: string }[];
    private permissionItems: OnlineAccountApi.EnumPropertyValue[];
    private operation: KendoDropDownList;

    constructor(private friendlyERN: FriendlyERNValueConverter,
                private friendlyACL: FriendlyACLValueConverter,
                private currency: AmountFormatValueConverter,
                ...args) {
        super(...args);

        this.selectedMember = this.utils.getPropertyValue<MemberSummary>(this.state, '.permissions.selectedMember');
    }

    @computedFrom('selectedMember', 'selectedOperation', 'selectedResource', 'limitValue')
    get disableAclAdd() {
        return this.showLimitValue
            ? !this.selectedMember || !this.selectedOperation || !this.selectedResource || !this.limitValue
            : !this.selectedMember || !this.selectedOperation || !this.selectedResource
    }

    @computedFrom('selectedOperation')
    get showLimitValue() {
        if (!this.selectedOperation) return false;

        switch (this.selectedOperation.description) {
            case 'Send Funds Transaction Limit':
            case 'Send Funds Daily Limit':
            case 'Send Funds Weekly Limit':
            case 'Send Funds Monthly Limit':
            case 'Send Funds Quarterly Limit':
            case 'Send Funds Yearly Limit':

            case 'Transfer Funds Transaction Limit':
            case 'Transfer Funds Daily Limit':
            case 'Transfer Funds Weekly Limit':
            case 'Transfer Funds Monthly Limit':
            case 'Transfer Funds Quarterly Limit':
            case 'Transfer Funds Yearly Limit':
                return true;
            default:
                return false;
        }
    }

    stateChanged(valie: ApplicationState) {
        this.selectedBusiness = this.utils.getPropertyValue<CustomerBusinessSummary>(this.state, '.permissions.selectedBusiness');
    }

    async selectedBusinessChanged(value: CustomerBusinessSummary) {
        if (value) {
            this.selectedMember = null;

            this.resourceItems = [];

            this.resourceItems.push({text: `Business: ${this.state.permissions.selectedBusiness.businessName}`, value: this.state.permissions.selectedBusiness.ern});

            this.state.permissions.selectedBusiness.accounts.forEach(x => {
                this.resourceItems.push({text: x.name, value: x.ern});
            });

            let response: ListBusinessBeneficiaryAccountsResponse = await this.serviceClients.onlineAccountApi.post(new ListBusinessBeneficiaryAccountsRequest({
                businessERN: this.state.permissions.selectedBusiness.ern
            }));

            await dispatchify('setPermissionsBeneficiaryAccounts')(response.results);

            response.results.forEach(x => this.resourceItems.push({text: `Beneficiary: ${x.nickName}`, value: x.ern}));

            if (this.resource)
                this.resource.widget.setDataSource(new kendo.data.DataSource({data: this.resourceItems}));

        }
    }

    async selectedMemberChanged(value: MemberSummary) {
        await dispatchify('setPermissionsSelectedMember')(value);
    }

    selectedResourceChanged(value: string) {
        if (value) {
            if (value.toLowerCase().includes('business')) {
                this.permissionItems = this.state.enums.ACLOperations.slice(5);//.filter(x => x.name.includes('ManageBusinessPermissions'))
            } else {
                this.permissionItems = this.state.enums.ACLOperations.slice(5)
                    .filter(x => !x.name.includes('ManageBusinessPermissions'));
            }
        } else {
            this.permissionItems = [];
        }

        if (this.operation)
            this.operation.widget.setDataSource(new kendo.data.DataSource({data: this.permissionItems}));
    }

    async attached() {
        if (this.state.customerSummary.businesses.length == 1)
            await dispatchify('setPermissionsSelectedBusiness')(this.state.customerSummary.businesses[0]);
    }

    async businessChanged(e) {
        let dataItem = e.sender.dataItem();

        if (!dataItem.ern) {
            await dispatchify('clearPermissions')();
            return;
        }

        await dispatchify('setPermissionsSelectedBusiness')(dataItem);
    }

    async grantAcl() {
        let message = this.showLimitValue
            ? `<h1>Add?</h1>Operation: <strong>${this.selectedOperation.description}</strong><br>Of: <strong>${this.currency.toView(this.limitValue)}</strong><br>For: <strong>${this.selectedMember.name}</strong><br>On: <strong>${this.friendlyERN.toView(this.selectedResource)}</strong>`
            : `<h1>Add?</h1>Type: <strong>GRANT</strong><br>Operation: <strong>${this.selectedOperation.description}</strong><br>For: <strong>${this.selectedMember.name}</strong><br>On: <strong>${this.friendlyERN.toView(this.selectedResource)}</strong>`;

        kendo.confirm(message)
            .then(async t => {
                await GrantBusinessPermissionsModel.postJob(this.validationController, new GrantBusinessPermissionsModel({
                    businessERN: this.state.permissions.selectedBusiness.ern,
                    principalERN: this.selectedMember.ern,
                    resourceERN: this.selectedResource,
                    aclOperation: this.selectedOperation.name,
                    limitValue: this.limitValue
                }), message.replace('<h1>Add?</h1>', ''));
            });
    }

    async denyAcl() {
        let message = `<h1>Add?</h1>Type: <strong>DENY</strong><br>Operation: <strong>${this.selectedOperation.description}</strong><br>For: <strong>${this.selectedMember.name}</strong><br>On: <strong>${this.friendlyERN.toView(this.selectedResource)}</strong>`;


        kendo.confirm(message)
            .then(async t => {
                await DenyBusinessPermissionsModel.postJob(this.validationController, new DenyBusinessPermissionsModel({
                    businessERN: this.state.permissions.selectedBusiness.ern,
                    principalERN: this.selectedMember.ern,
                    resourceERN: this.selectedResource,
                    aclOperation: this.selectedOperation.name,
                }), message.replace('<h1>Add?</h1>', ''));
            });
    }

}

