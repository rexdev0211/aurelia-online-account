import * as numeral from "numeral";

require("numeral/locales/en-gb");

export class CurrencyFormatValueConverter {
  toView(value: number, symbol?: string) {
    if (symbol) {
      if (symbol === 'Points')
        return `${numeral(value / 100).format('(0,0.00)')} Points`;

      return `${symbol}${numeral(value / 100).format('(0,0.00)')}`;
    }

    numeral.locale("en-gb");
    numeral.defaultFormat("$0,0.00");
    return `${numeral(value / 100).format()}`; //.format('(0,0.00)');
  }

  fromView(value) {
    return numeral(value * 100).value();
  }
}

export class AmountFormatValueConverter {

  toView(value: number, symbol?: string) {
    value = Math.abs(value);
    if (symbol) {
      return `${symbol}${numeral(value).format("(0,0.00)")}`;
    }

    // numeral.locale("en-gb");
    // numeral.defaultFormat("$0,0.00");
    return `${numeral(value).format("(0,0.00)")}`; //.format('(0,0.00)');
  }

  fromView(value) {
    return numeral(value).value();
  }


}
