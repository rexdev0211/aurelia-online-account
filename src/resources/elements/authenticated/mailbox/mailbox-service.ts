import {dispatchify} from "aurelia-store";

export class MailboxService {
    public views: Array<string> = ['Conversations', 'Subjects', 'Messages', 'Create'];

    async reloadMailbox() {
        await dispatchify('reloadMailbox')();
    }

    async clearSubject() {
        await dispatchify('setMailboxSubject')(null);
        await dispatchify('setMailboxMessages')(null);
        await dispatchify('setMailboxView')(this.views[1]);
    }

    async clearConversation() {
        await dispatchify('setMailboxConversation')(null);
        await dispatchify('setMailboxSubject')(null);
        await dispatchify('setMailboxMessages')(null);
        await dispatchify('setMailboxView')(this.views[0]);
    }

    downloadPdf() {
        alert('not implemented');
    }

}
