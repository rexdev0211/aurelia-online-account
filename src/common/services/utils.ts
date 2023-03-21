import {Aurelia, computedFrom, Container, inject, observable, PLATFORM} from "aurelia-framework";
import {Router} from "aurelia-router";
import {dispatchify} from "aurelia-store";
import * as numeral from "numeral";
import {JsvService} from "./jsv-service";
import {StorageService} from './storage-service';

@inject(Aurelia, Router, StorageService)
export class Utils {
    @observable systemMaintenance = false;

    constructor(private aurelia: Aurelia, private router: Router, private cache: StorageService) {
    }

    @computedFrom('systemMaintenance')
    get isSecureHost(): boolean {
        return true;// !this.systemMaintenance && (location.protocol.includes('https:') || location.host.includes('localhost'));
    }

    systemMaintenanceChanged(newValue: boolean, oldValue?: boolean) {
        if (newValue === false && oldValue === true) {
            location.reload();
        }
    }

    getState() {

    }

    getAccountCurrencySymbol(accountCode) {
        let currencyCountry = accountCode.substr(2, 2);

        switch (currencyCountry.toUpperCase()) {
            case "US":
                return "$";
            case "GB":
                return "£";
            case "EU":
                return "€";
            default:
                "";
        }
    }

    getSafeERN(ern) {
        return ern.replace(/::/g, "_");
    }

    getUTCDate(value: Date): number {
        return new Date(`${this.toJSONLocal(value)}T00:00:00Z`).getTime()
    }

    toJSONLocal(date) {
        var local = new Date(date);
        local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    }

    removeUnderscore(value) {
        function formatObject(object) {
            for (let key in object) {
                if (object.hasOwnProperty(key)) {
                    if (object[key] instanceof Object) {
                        formatObject(object[key]);
                    } else if (key.startsWith("_")) {
                        let element = object[key];
                        object[key.substr(1)] = element;
                        delete object[key];
                    }
                }
            }
        }

        formatObject(value);
        return value;
    }

    zeroPad(num, padlen, padchar = '0') {
        let pad = new Array(1 + padlen).join(padchar);
        return (pad + num).slice(-pad.length);
    }

    setCurrencySymbol(value, lookfor) {
        let vm = this;

        function formatObject(object) {
            for (let key in object) {
                if (object.hasOwnProperty(key)) {
                    if (object[key] instanceof Object) {
                        formatObject(object[key]);
                    } else if (key.endsWith(lookfor || "AccountCode")) {
                        let element = object[key];
                        object.currencySymbol = vm.getAccountCurrencySymbol(element);
                    }
                }
            }
        }

        formatObject(value);
        return value;
    }

    setDateFormatted(value, lookfor) {
        let vm = this;

        function formatObject(object) {
            for (let key in object) {
                if (object.hasOwnProperty(key)) {
                    if (object[key] instanceof Object) {
                        formatObject(object[key]);
                    } else if (key.endsWith(lookfor || "Date")) {
                        let element = object[key];
                        object[`${key}Formatted`] = numeral(element / 100).format(
                            "(0,0.00)"
                        );
                    }
                }
            }
        }

        formatObject(value);
        return value;
    }

    setBalanceFormatted(value, lookfor) {
        let vm = this;

        function formatObject(object) {
            for (let key in object) {
                if (object.hasOwnProperty(key)) {
                    if (object[key] instanceof Object) {
                        formatObject(object[key]);
                    } else if (key.endsWith(lookfor || "Balance")) {
                        let element = object[key];
                        object[`${key}Formatted`] = `${object.currencySymbol}${numeral(
                            element / 100
                        ).format("(0,0.00)")}`;
                    }
                }
            }
        }

        formatObject(value);
        return value;
    }

    setCountryFormatted(value, lookfor) {
        function formatObject(object) {
            for (let key in object) {
                if (object.hasOwnProperty(key)) {
                    if (object[key] instanceof Object) {
                        formatObject(object[key]);
                    } else if (key.endsWith(lookfor || "country")) {
                        let element = object[key];
                        object[`${key}Formatted`] = this.countries.find(
                            x => x.value === "" + element
                        ).description;
                    }
                }
            }
        }

        formatObject(value);
        return value;
    }

    setCamelCase(obj) {
        let camelCaseReviver = (key, value) => {
            if (value && typeof value === "object") {
                for (let k in value) {
                    if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
                        if (k === k.toUpperCase()) {
                            value[k.toLowerCase()] = value[k];
                        } else {
                            value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
                        }
                        delete value[k];
                    }
                }
            }
            return value;
        };

        if (Array.isArray(obj)) {
            let i = obj.length;
            while (i--) {
                obj[i] = JSON.parse(JSON.stringify(obj[i]), camelCaseReviver);
            }
        } else {
            obj = JSON.parse(JSON.stringify(obj), camelCaseReviver);
        }

        return obj;
    }

    toCamelCase(str) {
        return str
            .split(" ")
            .map((word, index) => {
                // If it is the first word make sure to lowercase all the chars.
                if (index === 0) {
                    return word.toLowerCase();
                }
                // If it is not the first word only upper case the first char and lowercase the rest.
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join("");
    }

    toTitleCase(str) {
        let words = str.split(" ");
        for (let i = 0; i < words.length; i++) {
            let j = words[i].charAt(0).toUpperCase();
            words[i] = j + words[i].substr(1);
        }
        return words.join(" ");
    }

    toPaddedString(value, pad = "000") {
        let str = "" + value;
        return pad.substring(0, pad.length - str.length) + str;
    }

    resolve(path, obj) {
        return path.split(".").reduce((prev, curr) => {
            return prev ? prev[curr] : null;
        }, obj || self);
    }

    isValidDate(dateString) {
        let regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateString.match(regEx)) return false; // Invalid format
        let d = new Date(dateString);
        if (!d.getTime()) return false; // Invalid date (or this could be epoch)
        return d.toISOString().slice(0, 10) === dateString;
    }

    propExists<T>(obj: T, path: string) {
        if (path.startsWith('.')) path = path.slice(1);
        return !!path.split(".").reduce((obj, prop) => {
            return obj && obj[prop] ? obj[prop] : undefined;
        }, obj);
    }

    getObjectValue(obj: Object, path: string): Object {
        if (path.startsWith('.')) path = path.slice(1);
        if (this.propExists(obj, path)) {
            for (let i = 0, pathParts = path.split("."), len = pathParts.length; i < len; i++) {
                obj = obj[pathParts[i]];
            }
            return obj;
        }
        return null;
    }

    getPropertyValue<T>(obj: Object, path: string): T {
        if (path.startsWith('.')) path = path.slice(1);
        if (this.propExists(obj, path)) {
            for (let i = 0, pathParts = path.split("."), len = pathParts.length; i < len; i++) {
                obj = obj[pathParts[i]];
            }
            return obj as T;
        }
        return null;
    }

    reloadAppAsync = async (root: string, path?: string) => {
        this.router.navigate(path || "/", {
            replace: true,
            trigger: false
        });

        await this.aurelia.setRoot(PLATFORM.moduleName(root));
    };

    refreshAppAsync = async (dispatch: boolean = true) => {
        // @ts-ignore
        let root = this.aurelia.root.behavior.elementName.split('-')[0];
        if (dispatch) await dispatchify('selectAccount')(null);
        await this.reloadAppAsync(root, location.hash);
    }

    rehydrateMeta(value: any, exclude: string = null, lookFor: string = 'meta') {
        function rehydrateObject(object) {
            if (!object.rehydrateMeta) {
                object.rehydrateMeta = true;
                for (let key in object) {
                    if (object.hasOwnProperty(key)) {
                        if (key.toLowerCase().endsWith(lookFor.toLowerCase())) {
                            for (let metaKey in object[key]) {
                                if (Object.prototype.toString.call(object[key][metaKey]) === "[object String]")
                                    object[key][metaKey] = Container.instance.get(JsvService).parse(object[key][metaKey]);
                            }
                        } else if (object[key] instanceof Object) {
                            if (!exclude || exclude.toLowerCase() !== key.toLowerCase())
                                rehydrateObject(object[key]);
                        }
                    }
                }
            }
        }

        rehydrateObject(value);
        return value;
    }

    mapOrder(array: any[], order: string[], key?: string) {

        array.sort(function (a, b) {
            let A = a[key], B = b[key];

            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            } else {
                return -1;
            }

        });

        return array;
    };

    distinctBy<T>(key: keyof T, array: T[]) {
        const keys = array.map(value => value[key]);
        return array.filter((value, index) => keys.indexOf(value[key]) === index);
    }

    toCamel(o) {
        let newO, origKey, newKey, value
        if (o instanceof Array) {
            return o.map((value) => {
                if (typeof value === "object") {
                    value = this.toCamel(value)
                }
                return value
            })
        } else {
            newO = {}
            for (origKey in o) {
                if (o.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
                    value = o[origKey]
                    if (value instanceof Array || (value !== null && value.constructor === Object)) {
                        value = this.toCamel(value)
                    }
                    newO[newKey] = value
                }
            }
        }
        return newO
    }
}
