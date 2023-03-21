import {bindable} from 'aurelia-framework';
import {BaseElement} from '../../../../bases/base-element';

export class GridBoxItemsCustomElement extends BaseElement {
    @bindable value;
    private items: { key: string, value: string }[]
    private ignore: string[];

    constructor(...args) {
        super(...args);
        this.ignore = ['uid', 'documenterns','jobern'];
    }

    bind() {
        this.buildDataSource();
    }

    valueChanged(newValue: any, oldValue: any) {
        this.buildDataSource();
    }

    buildDataSource() {
        this.items = [];
        this.formatObject(this.value);
    }

    formatObject(object) {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                let value = object[key];
                if (object[key] instanceof Object) {
                } else if (!key.startsWith('_') && !this.ignore.includes(key.toLowerCase())) {
                    this.items.push({key: key, value: value});
                }
            }
        }
    }
}

