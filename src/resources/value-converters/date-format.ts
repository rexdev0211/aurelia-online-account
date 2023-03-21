import * as moment from 'moment';

export class DateFormatValueConverter {
    private defaultFormat: string = 'DD/MM/YYYY';

    toView(value, format?: string) {
        format = (format || this.defaultFormat);

        if (format.toLowerCase() === 'z') format = 'YYYY-MM-DD HH:mm:ss';
        if (format.toLowerCase() === 'iso') format = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
        if (format.toLowerCase() === 'zzz') format = 'YYYY-MM-DD[ ]HH:mm:ss.SSS';

        if (value === null || value === undefined || '' + value === '') return;

        if (typeof value === 'string' && value.indexOf('/Date(') > -1) {
            value = value.substr(6, value.length);
            value = value.substr(0, value.length - 2);
        }

        if (typeof value === 'string') value = parseInt(value, 10);

        let response = format === 'ago'
            ? moment.utc(value).fromNow()
            : moment.utc(value).format(format);
        //console.log(response);
        return response;
    }

    fromView(value: string, format?: string) {
        format = (format || this.defaultFormat);
        if (format.toLowerCase() === 'iso') format = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
        if (format.toLowerCase() === 'zzz') format = 'YYYY-MM-DD[ ]HH:mm:ss.SSS';
        return moment.utc(value, format).valueOf(); //'YYYY-MM-DD'
    }
}
