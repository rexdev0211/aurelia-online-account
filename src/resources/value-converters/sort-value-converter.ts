import {sortBy} from "../../common/services/shared";

export class SortValueConverter {
    /**
     * @desc Sorts the array
     * @param {Array} array the array to sort
     * @param {String} [propertyName] the property name to sort by or [-propertyName] for reverse order
     */
    toView(array, propertyName: string | Array<string>) {
        if (!Array.isArray(array) || !array.length) return array;

        if (!Array.isArray(propertyName)) propertyName = [propertyName];

        return array.slice(0).sort(sortBy(propertyName));
    }

}
