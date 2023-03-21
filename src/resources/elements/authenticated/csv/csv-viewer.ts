import {bindable, computedFrom} from 'aurelia-framework';
import {BaseElement} from '../../../../bases/base-element';
import {OnlineAccountApi} from "../../../../dtos/onlineaccount-api.dtos";
import CsvValidationErrors = OnlineAccountApi.CsvValidationErrors;

export class ErrorLine {
    lineNumber: number;
    lineValue: string;
    lineError: Array<string>;

    constructor(init?: Partial<ErrorLine>) {
        (<any>Object).assign(this, init);
    }
}

export class CsvViewerCustomElement extends BaseElement {
    @bindable validationErrors: CsvValidationErrors = null;
    @bindable csv: string;
    @bindable useHeader: boolean = true;
    public hasErrors: boolean;
    private header: string[];
    private lines: string[];
    private originalLines: string[];
    private errorLines: Array<ErrorLine>

    constructor(...args) {
        super(...args);
    }

    @computedFrom('validationErrors')
    get errorCount() {
        return this.errorLines?.length ?? 0;
    }

    @computedFrom('originalLines','lines')
    get lineCount() {
        return this.originalLines?.length ?? this.lines?.length ?? 0;
    }

    bind() {
        if (this.csv) this.csvChanged(this.csv);
    }

    validationErrorsChanged(newValue: CsvValidationErrors, oldValue: CsvValidationErrors) {
        this.errorLines = [];
        for (const newValueKey in newValue) {
            this.errorLines.push(new ErrorLine({
                lineNumber: parseInt(newValueKey),
                lineValue: this.lines[parseInt(newValueKey) - 1],
                lineError: newValue[newValueKey]
            }));
        }

        if (this.errorLines.length) {
            this.hasErrors = true;
            this.originalLines = this.lines;
            this.lines = [];
        }
    }

    csvChanged(newValue: string, oldValue?: string) {
        this.validationErrors = null;

        if (!newValue) {
            this.header = this.lines = this.originalLines = [];
            return;
        }

        let data = newValue.split('\n');
        this.header = data.slice(0, 1)[0].split(',');
        this.lines = data.slice(1).filter(x => !!x);
    }

    getValidCsv() {
        if (!this.originalLines.length) return null;
        let filteredLines = this.originalLines.filter((value, index) => !this.errorLines.some(x => x.lineNumber == index + 1));
        let header = this.header.join(',');
        return [header, ...filteredLines];
    }

    getInvalidCsv() {
        if (!this.originalLines.length) return null;
        let filteredLines = this.originalLines.filter((value, index) => this.errorLines.some(x => x.lineNumber == index + 1));
        let header = this.header.join(',');
        return [header, ...filteredLines];
    }

    detached() {
        this.errorLines = this.originalLines = this.header = this.lines = this.validationErrors = undefined;
    }

}

