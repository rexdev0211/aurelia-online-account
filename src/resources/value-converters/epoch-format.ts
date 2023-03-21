import * as moment from "moment";

export class EpochFormatValueConverter {
  toView(value: string, format: string = 'DD-MM-YYYY') {
    return moment.utc(parseInt(value)).format(format);
  }

  fromView(value: string, format: string = 'DD-MM-YYYY') {
    return moment.utc(value, format).valueOf();
  }
}

