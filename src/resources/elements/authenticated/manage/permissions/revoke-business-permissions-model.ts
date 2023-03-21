import {Container} from 'aurelia-framework';
import {dispatchify} from "aurelia-store";
import {ValidationRules} from "aurelia-validation";
import {ServiceClients} from "../../../../../common/services/clients/service-clients";
import {NotificationService} from "../../../../../common/services/notification-service";
import {OnlineAccountApi} from "../../../../../dtos/onlineaccount-api.dtos";
import BusinessRevokeAclRequest = OnlineAccountApi.BusinessRevokeAclRequest;
import BusinessRevokeAclResponse = OnlineAccountApi.BusinessRevokeAclResponse;
import PendingApproval = OnlineAccountApi.PendingApproval;

export class RevokeBusinessPermissionsModel extends BusinessRevokeAclRequest {

    constructor(init) {
        super(init)
    }

    static async postJob(validationController, model, message) {
        let validationResult = await validationController.validate({object: model});
        if (validationResult.valid) {
            let request = new BusinessRevokeAclRequest(model);
            let response: BusinessRevokeAclResponse = await Container.instance.get(ServiceClients).onlineAccountApi.post(request);

            if (!response.result) return;

            if (response.result.requestedBy.approvalState === PendingApproval.Approved)
                await dispatchify("upsertJob")(response.result);

            Container.instance.get(NotificationService).showMessage(
                "success",
                `Revoke Business Permission Scheduled Successfully`,
                message
            );
        }
    }
}

ValidationRules
    .ensure((x: RevokeBusinessPermissionsModel) => x.businessERN).required()
    .ensure((x: RevokeBusinessPermissionsModel) => x.principalERN).required()
    .ensure((x: RevokeBusinessPermissionsModel) => x.resourceERN).required()
    .ensure((x: RevokeBusinessPermissionsModel) => x.aclOperation).required()
    .on(RevokeBusinessPermissionsModel);
