import {EventService} from "../../../../common/services/event-service";
import {bindable, DOM, inject, noView} from "aurelia-framework";
import * as NProgress from "nprogress";

@noView()
@inject(DOM.Element, EventService)
export class LoadingIndicatorCustomElement {
  @bindable
  loading:boolean = false;

  constructor(element: HTMLElement, private eventService: EventService) {
    NProgress.configure({
      //parent: "#js-header"
    }); //

    this.eventService.subscribe(
      this.eventService.events.progressServiceProcessing,
      () => (this.loading = true)
    );

    this.eventService.subscribe(
      this.eventService.events.progressServiceComplete,
      () => (this.loading = false)
    );
  }

  loadingChanged(newValue) {
    if (newValue) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }
}
