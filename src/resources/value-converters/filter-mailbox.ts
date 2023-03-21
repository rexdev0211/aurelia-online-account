export class FilterMailboxConversationsValueConverter {

    toView(array, filter) {
        if (array === undefined || array === null) return array;
        if (!filter) return array;
        return array.filter(x => x.mailbox.toLowerCase().includes(filter.toLowerCase()));
    }
}

export class FilterMailboxSubjectsValueConverter {

    toView(array, filter) {
        if (array === undefined || array === null) return array;
        if (!filter) return array;
        return array.filter(x => x.conversation.subject.toLowerCase().includes(filter.toLowerCase()));
    }
}

export class FilterMailboxMessagesValueConverter {

    toView(array, filter) {
        if (array === undefined || array === null) return array;
        if (!filter) return array;
        return array.filter(x => !!x.from.name && x.from.name.toLowerCase().includes(filter.toLowerCase()) ||
            !!x.from.email && x.from.email.toLowerCase().includes(filter.toLowerCase()) ||
            x.message.toLowerCase().includes(filter.toLowerCase()));
    }
}


export class FilterMailboxSubjectValueConverter {

    toView(value) {
        if (value === undefined || value === null) return value;
        let regex = /: (PendingTransaction > )([\w|\d]{4}...[\w|\d]{4}) > [\w|\d]{22} [<|>] [\w|\d]{22} @ [\d|,|.]+/g;
        return value.replace(regex, "") || value.substr(2, 32);
    }
}


export class FilterMailboxMessageValueConverter {

    toView(value) {
        if (value === undefined || value === null) return value;
        return value.replaceAll('\n', "<br/>");
    }
}
