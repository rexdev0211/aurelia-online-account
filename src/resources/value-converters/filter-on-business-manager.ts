import {getManageBusiness} from "../../common/services/shared";

export class FilterOnBusinessManagerValueConverter {
    toView(array) {
        if (array === undefined || array === null) return array;

        let managedBusinesses = getManageBusiness();
        return array.filter((item) => managedBusinesses.some(x => x.resource == item.ern));
    }
}

