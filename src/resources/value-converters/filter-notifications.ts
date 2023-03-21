import {inject} from "aurelia-framework";
import {DataStore} from "../../common/data-stores/data-store";
import {ApplicationState} from "../../applicationState";

@inject(DataStore)
export class FilterNotificationPrincipalsValueConverter {

    constructor(private ds: DataStore) {
    }

    toView(array, filter) {
        if (array === undefined || array === null) return array;
        if (!filter) return array;
        let state: ApplicationState = this.ds.state;
        let eventName = state.notifications.add.event.name;
        let eventKeys = Object.keys(state.notifications.profile.events[eventName]);
        return array.filter(x => !eventKeys.includes(x.ern));
    }
}

export class ConvertToBooleanValueConverter {
    toView(value) {
        return typeof (value) === 'boolean'
            ? value
            : value === 'true' || value === 'True';
    }

    fromView(value) {
        return value === true ? 'true' : 'false'
    }
}

