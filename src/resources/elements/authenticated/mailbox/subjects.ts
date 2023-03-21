import {BaseElement} from "../../../../bases/base-element";
import {dispatchify} from "aurelia-store";
import {MailboxService} from "./mailbox-service";
import {inject} from "aurelia-framework";

@inject(MailboxService)
export class SubjectsCustomElement extends BaseElement {

    constructor(private mailboxService: MailboxService, ...args) {
        super(...args);
    }

    async attached() {
        await dispatchify('reloadMailbox')();
    }


    async select(item) {
        await dispatchify('setMailboxSubject')(item);
    }

    async clearConversation() {
        await dispatchify('setMailboxConversation')(null);
        await dispatchify('fetchMailboxes')();
    }

    async addNew() {
        await dispatchify('setMailboxView')('Create');
    }

}
