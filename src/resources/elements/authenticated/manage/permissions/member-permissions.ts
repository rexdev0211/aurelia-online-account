import {autoinject, observable} from 'aurelia-framework';
import {ApplicationState} from "../../../../../applicationState";
import {BaseElement} from '../../../../../bases/base-element';
import {pagable} from "../../../../../common/services/shared";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import {AclSortValueConverter} from "../../../../value-converters/acl-sort";
import {FriendlyACLValueConverter} from "../../../../value-converters/friendly-acl";
import {FriendlyERNValueConverter} from "../../../../value-converters/friendly-ern";
import {RevokeBusinessPermissionsModel} from "./revoke-business-permissions-model";
import GridPageable = kendo.ui.GridPageable;
import MemberSummary = OnlineAccountApi.MemberSummary;

@autoinject
export class MemberPermissionsCustomElement extends BaseElement {
    @observable selectedMember: MemberSummary;
    private grid: kendo.ui.Grid;
    private pageable: GridPageable;
    private granted: { principal: string; resource: string; type: string; operation: string }[];
    private denied: { principal: string; resource: string; type: string; operation: string }[];

    constructor(private aclSort: AclSortValueConverter, private friendlyACL: FriendlyACLValueConverter, private friendlyERN: FriendlyERNValueConverter,
                ...args) {
        super(...args);

        this.pageable = pagable;
    }

    gridReady(e) {
        this.grid = e;
    }

    attached() {
        this.taskQueue.queueMicroTask(() => this.selectedMemberChanged(this.selectedMember));
    }

    stateChanged(value: ApplicationState) {
        this.selectedMember = this.utils.getPropertyValue<MemberSummary>(value, '.permissions.selectedMember');
    }

    isDenied(acl: { principal: string; resource: string; type: string; operation: string }) {
        if (acl.type === 'Deny') return false;

        return this.denied.some(x => {
            return x.operation === acl.operation && x.principal === acl.principal && x.resource === acl.resource
        });
    }

    selectedMemberChanged(value: MemberSummary) {
        if (!(value && this.grid)) return;

        this.granted = this.state.permissions.selectedBusiness.grantedClaims.filter(x => x.principal === value.ern)
            .map(x => {
                return {type: 'Grant', operation: x.operation, resource: x.resource, principal: x.principal};
            });

        this.denied = this.state.permissions.selectedBusiness.deniedClaims.filter(x => x.principal === value.ern)
            .map(x => {
                return {type: 'Deny', operation: x.operation, resource: x.resource, principal: x.principal};
            });


        let gridData: [] = this.aclSort.toView(this.granted.concat(this.denied));
        this.grid.setDataSource(new kendo.data.DataSource({
            data: gridData
        }));
        this.grid.pager.page(1);
    }

    showRevoke(acl) {
        let operations = ['Shareholder', 'Director', 'Signatory', 'Secretary', 'Significant Control (Other)'];
        let limits = ['Yearly Limit', 'Quarterly Limit', 'Monthly Limit', 'Weekly Limit', 'Daily Limit', 'Transaction Limit'];
        if (limits.some(x => acl.resource.split(':')[0].endsWith(x))) {
            return false;
        }
        return !operations.some(x => acl.operation === x);
    }

    async revokeAcl(acl) {
        let message = `<h1>Remove?</h1>Type: <strong>${acl.type}</strong><br>Operation: <strong>${this.friendlyACL.toView(acl.operation)}</strong><br>For: <strong>${this.selectedMember.name}</strong><br>On: <strong>${this.friendlyERN.toView(acl.resource)}</strong>`;

        kendo.confirm(message)
            .then(async t => {
                await RevokeBusinessPermissionsModel.postJob(this.validationController, new RevokeBusinessPermissionsModel({
                    businessERN: this.state.permissions.selectedBusiness.ern,
                    principalERN: acl.principal,
                    resourceERN: acl.resource,
                    aclOperation: this.state.enums.ACLOperations.find(x => x.description === acl.operation).name,
                }), message.replace('<h1>Remove?</h1>', ''));
            });
    }

}
