import * as Humanizer from 'humanize-string';
import * as changeCase from "change-case";

export class HumanizeValueConverter {

    constructor() {
    }

    toView(value, titleCase) {
        if (value === undefined || value === null) return value;
        return titleCase ? changeCase.titleCase(Humanizer(value)) : Humanizer(value);
    }

    fromView(value) {
    }
}

