import {bindable, bindingMode, observable} from 'aurelia-framework';
import * as moment from "moment";
import {BaseElement} from './../../../bases/base-element';

export enum DatePickerType {
  DateOfBirth = 'DateOfBirth',
  Schedule = 'Schedule'
}

export class DatePickerCustomElement extends BaseElement {
  @bindable type: DatePickerType = DatePickerType.DateOfBirth;
  @bindable header: string;
  @bindable({defaultBindingMode: bindingMode.twoWay}) value: (number | string);
  @bindable format: string;


  @observable private year: string;
  @observable private month: string;
  @observable private day: string;

  private now: string[];

  private days: { value: string; description: string }[];
  private months: { value: string; description: string }[];
  private years: { value: string; description: string }[];
  private yearChanged: Function;
  private monthChanged: Function;
  private dayChanged: Function;

  constructor(...args) {
    super(...args);

    this.yearChanged = () => this.updateValue();
    this.monthChanged = () => this.updateValue();
    this.dayChanged = () => this.updateValue();
  }

  bind() {
    this.createLists(this);
  }

  private createLists(_this) {
    this.days = Array.from({length: 31}, (v, i) => i + 1).map(x => {
      return {
        value: _this.utils.zeroPad(x, 2),
        description: _this.utils.zeroPad(x, 2)
      };
    });

    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ].map(x => {
      return {
        value: moment()
          .month(x)
          .format("MM"),
        description: x
      };
    });

    this.now = moment.utc()
      .toISOString()
      .split("T")[0]
      .split("-");

    let year = parseInt(this.now[0]);
    let discount = this.type == DatePickerType.DateOfBirth ? 0 : -1;
    this.years = Array.from({length: 99}, (v, i) => year - discount - i).map(
      x => {
        return {value: "" + x, description: "" + x};
      }
    );

    if (this.type == DatePickerType.Schedule) {
      this.years = this.years.slice(1, 2);
      this.year = this.now[0];
      this.month = moment.utc().format('MMMM');
      this.day = this.now[2];
    }
  }

  updateValue() {
    if (this.day && this.month && this.year) {
      this.value = this.format
        ? moment.utc(`${this.month}-${this.day}-${this.year}`).format(this.format)
        : moment.utc(`${this.month}-${this.day}-${this.year}`).valueOf();
    }
  }

}

