import {BaseElement} from "../../../../bases/base-element";
import {bindable, inject} from "aurelia-framework";
import {dispatchify} from "aurelia-store";
import {MailboxCustomElement} from "./mailbox";

@inject(MailboxCustomElement)
export class ConversationsCustomElement extends BaseElement {

    @bindable parent;

    constructor(private mailboxCustomElement:MailboxCustomElement, ...args) {
        super(...args);
    }

    attached(){
        dispatchify('reloadMailbox')();
    }

    async select(item) {
        await dispatchify('setMailboxConversation')(item);
    }

    async addNew() {
        await dispatchify('setMailboxView')('Create');
    }

}
