import { inject, DOM } from "aurelia-framework";
import * as $ from 'jquery';

@inject(DOM.Element)
export class ChangeCaseCustomAttribute {
  actions = ["sentence", "title", "capital", "lower", "upper"];
  private action: string = null;
  constructor(private element: HTMLInputElement) {
    this.element = element;
  }

  attached() {
    this.element.addEventListener("keyup", () => this.changeCase());
    this.element.addEventListener("blur", () => this.changeCase());
  }
  detached() {
    this.element.removeEventListener("keyup", () => this.changeCase());
    this.element.removeEventListener("blur", () => this.changeCase());
  }

  valueChanged(newValue, oldValue) {
    this.action = this.actions.find(x => x === newValue.toLowerCase());
  }

  changeCase = () => {
    if (!this.action) return;
    let start = this.element.selectionStart;
    let end = this.element.selectionEnd;
    switch (this.action) {
      case "sentence":
        this.element.value = this.sentenceCase(this.element.value);
        break;
      case "title":
        this.element.value = this.titleCase(this.element.value);
        break;
      case "capital":
        this.element.value = this.capitalCase(this.element.value);
        break;
      case "lower":
        this.element.value = this.lowerCase(this.element.value);
        break;
      case "upper":
        this.element.value = this.upperCase(this.element.value);
        break;
    }
    this.element.setSelectionRange(start, end);
  };

  sentenceCase = str => {
    let res = str.split(/\.\s+/g);
    if (res) {
      let r = $.map(res, elem => {
        return elem.charAt(0).toUpperCase() + elem.slice(1);
      });

      return r.join(". ");
    } else {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  //reference: https://github.com/gouch/to-title-case
  titleCase = str => {
    let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    str = str.toLowerCase();
    return str.replace(
      /[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g,
      (match, index, title) => {
        if (
          index > 0 &&
          index + match.length !== title.length &&
          match.search(smallWords) > -1 &&
          title.charAt(index - 2) !== ":" &&
          (title.charAt(index + match.length) !== "-" ||
            title.charAt(index - 1) === "-") &&
          title.charAt(index - 1).search(/[^\s-]/) < 0
        ) {
          return match.toLowerCase();
        }

        if (match.substr(1).search(/[A-Z]|\../) > -1) {
          return match;
        }

        return match.charAt(0).toUpperCase() + match.substr(1);
      }
    );
  };

  //reference: https://medium.freecodecamp.com/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27
  capitalCase = str => {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  lowerCase = str => {
    return str.toLowerCase();
  };

  upperCase = str => {
    return str.toUpperCase();
  };
}
