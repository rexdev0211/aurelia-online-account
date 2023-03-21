import { EventService } from "./../../common/services/event-service";
import { inject, DOM, bindable } from "aurelia-framework";
import * as $ from "jquery";

import * as LogManager from "aurelia-logging";
const logger = LogManager.getLogger("disable-while-loading");

@inject(DOM.Element, EventService)
export class DisableWhileLoadingCustomAttribute {
  @bindable({ primaryProperty: true })
  disabled: boolean = true;

  private subscriptions: Array<any> = [];

  constructor(
    private element: HTMLElement,
    private eventService: EventService
  ) {}

  disabledChanged(newValue: boolean, oldValue: boolean) {
    if (newValue) {
      this.disable();
    } else {
      this.enable();
    }
  }

  attached() {
    logger.debug(this.element.id, "disable-while-loading:attached");

    this.subscriptions = [];
    this.subscriptions.push(
      this.eventService.subscribe(
        this.eventService.events.progressServiceProcessing,
        () => this.disable()
      )
    );
    this.subscriptions.push(
      this.eventService.subscribe(
        this.eventService.events.progressServiceComplete,
        () => this.enable()
      )
    );
  }

  detached() {
    logger.debug(this.element.id, "disable-while-loading:detached");

    $(this.element).off("click");

    let i = this.subscriptions.length;
    while (i--) {
      this.subscriptions[i].dispose();
    }

    this.subscriptions = [];
  }

  disable() {
    logger.debug(this.element.id, "disable-while-loading:disable");
    this.element.setAttribute("disabled", "disabled");
  }

  enable() {
    if (!this.disabled) {
      logger.debug(this.element.id, "disable-while-loading:enable");
      this.element.removeAttribute("disabled");
    }
  }
}
