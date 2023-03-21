import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";

export class MailboxMessageModel extends OnlineAccountApi.MailboxMessageRequest {

    constructor(init?: Partial<MailboxMessageModel>) {
        super();
        (Object as any).assign(this, init);
    }
}

ValidationRules
    .ensure((x: MailboxMessageModel) => x.from).required()
    .ensure((x: MailboxMessageModel) => x.subject).required()
    .ensure((x: MailboxMessageModel) => x.message).required()
    .on(MailboxMessageModel);
