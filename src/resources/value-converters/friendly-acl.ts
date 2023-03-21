import {Container} from 'aurelia-framework';
import {Store} from "aurelia-store";
import {ApplicationState} from "../../applicationState";

export class FriendlyACLValueConverter {

    toView(value) {
        // @ts-ignore
        let state: ApplicationState = Container.instance.get(Store).state.source.value;

        if (!value.includes('_')) return value;
        let operation = state.enums.aclOperations.find(x => x.name == value);
        return operation ? operation.description : value;
    }

    fromView(value) {
    }
}

