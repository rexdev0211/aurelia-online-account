import {bindingMode} from "aurelia-binding";
import {Container} from 'aurelia-framework';
import {bindable} from "aurelia-templating";
import {Utils} from "../../../../common/services/utils";
import NumericTextBox = kendo.ui.NumericTextBox;

export class KendoDatePicker {
    @bindable widget: NumericTextBox;

    @bindable({defaultBindingMode: bindingMode.twoWay}) value;
    @bindable initialValue: Date = null;
    @bindable onChange
    @bindable onReady

    @bindable placeHolder: string = '';
    @bindable header: string;
    @bindable format: string = 'dd/MM/yyyy';
    @bindable min: Date;
    @bindable utc: boolean = true;


    minChanged(value: Date) {
        if (!this.utc) return;

        let utcDate = value.toISOString().split('T')[0].split('-').map(x => parseInt(x, 10));
        this.min = new Date(utcDate[0], utcDate[1] - 1, utcDate[2], 0, 0, 0, 0);
    }

    changeEvent(e) {
        // Lets return UTC Date

        this.value = e.sender.value()
            ? this.utc
                ? Container.instance.get(Utils).getUTCDate(e.sender.value())
                : e.sender.value().getTime()
            : null;

        if (this.onChange) this.onChange(e);

    }


    readyEvent(e: kendo.ui.DatePicker) {
        if (this.initialValue) e.value(this.initialValue.toISOString().split('T')[0]);

        this.placeHolder = this.format.toLowerCase();

        e.options.parseFormats = this.buildParseFormats(e.options.parseFormats);

        if (this.onReady) this.onReady(e);
    }

    buildParseFormats(values: Array<string>) {
        let formats = new Array<string>();
        values.forEach(value => {
            if (value.indexOf('/') !== -1) {
                formats.push(value);
                formats.push(value.split('/').join('-'));
            }
            if (value.indexOf('-') !== -1) {
                formats.push(value);
                formats.push(value.split('-').join('/'));
            }
        });
        return formats;
    }

}