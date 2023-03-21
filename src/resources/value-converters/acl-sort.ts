import {Container} from 'aurelia-framework';
import {Store} from "aurelia-store";
import {ApplicationState} from "../../applicationState";

export class AclSortValueConverter {
    private state: ApplicationState;

    constructor() {
    }

    toView(value) {
        // @ts-ignore
        let state: ApplicationState = Container.instance.get(Store).state.source.value;

        if (!Array.isArray(value) || !value.length) return value;

        let results = value.sort((a, b) => state.enums.ACLOperations.findIndex(x => x.description === a.operation) - state.enums.ACLOperations.findIndex(x => x.description === b.operation));

        while (!state.enums.ACLOperations.some(x => x.description == results[0].operation)) {
            // @ts-ignore
            results.move(0, results.findIndex(x => x.operation === results[0].resource.split(':')[0]));
        }

        return results;
    }

    fromView(value) {
    }
}

