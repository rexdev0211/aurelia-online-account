import {ValidationRules} from "aurelia-validation";
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";

export class NewConversationModel extends OnlineAccountApi.MailboxMessageRequest {
    constructor() {
        super();
    }
}

ValidationRules
    .ensure((x: NewConversationModel) => x.to).required()
    .ensure((x: NewConversationModel) => x.from).required()
    .ensure((x: NewConversationModel) => x.subject).required()
    .ensure((x: NewConversationModel) => x.message).required().withMessage('Message is required.')
    .on(NewConversationModel);
