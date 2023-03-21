import {Container} from "aurelia-framework";
import {DataStore} from "../../common/data-stores/data-store";
import {Utils} from "../../common/services/utils";


export class FilterOnStatePropertyValueConverter {

    toView(array, property, exp) {
        if (array === undefined || array === null || property === undefined || property === null || exp === undefined || exp === null) {
            return array;
        }
        let utils = Container.instance.get(Utils);
        let dataStore = Container.instance.get(DataStore);
        return array.filter((item) => {
            let value = utils.getPropertyValue<string>(item, property);
            if (!value) return false;

            if (!exp) return false;
            if (exp.startsWith('state')) {
                exp = utils.getObjectValue(dataStore, exp);
            }
            if (!exp) return false;

            return value.toLowerCase().indexOf(exp.toLowerCase()) > -1
        });
    }
}

export class FilterOnPropertyValueConverter {
    toView(array: Array<any>, property: any, exp: any) {
        if (array === undefined || array === null || property === undefined || property === null || exp === undefined || exp === null) {
            return array;
        }
        return array.filter((item) => {
            let value = Container.instance.get(Utils).getObjectValue(item, property);
            if (!value) return false;
            return value.toString().toLowerCase().indexOf(exp.toLowerCase()) > -1
        });
    }
}
