import {customAttribute} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';


@customAttribute("hover-css")
export class HoverCss {

    static inject = [Element, EventAggregator];
    _subscriptions = [];
    private element: any;
    private ea: EventAggregator;
    private _mouseEnterListener: any;
    private _mouseLeaveListener: any;
    private value: string;
    private colorClass: any;

    constructor(element, eventAggregator) {
        // The element injected will be the HTML Element that this attribute is attached to
        this.element = element;
        this.ea = eventAggregator;
    }

    attached() {
        // Listen for other instances of this attribute to broadcast to us
        this._subscriptions.push(this.ea.subscribe('hovercolor.change', this.onColorChange.bind(this)));

        // We need a reference to the bound function so that we can unsubscribe
        this._mouseEnterListener = this.publishMyEvent.bind(this);
        // Register the DOM listener for enter
        this.element.addEventListener("mouseenter", this._mouseEnterListener);

        // We need a reference to the bound function so that we can unsubscribe
        this._mouseLeaveListener = this.publishLeaveEvent.bind(this);
        // Register the DOM listener for leave
        this.element.addEventListener("mouseleave", this._mouseLeaveListener);
    }

    publishMyEvent() {
        // Here we publish to other hover color attributes that there's been a change
        // this.value comes from the value assigned to the attribute in the html, hover-color="someval", someval would be this.value
        // Can do hover-color.bind="someVMProp" if necessary
        //this.ea.publish("hovercolor.change", this.value);
        this.element.classList.add(this.value);
    }

    publishLeaveEvent() {
        // Publish out a change event with a null value to clear it out
        //this.ea.publish("hovercolor.change", null);
        this.element.classList.remove(this.value);
    }

    onColorChange(newColorClass) {
        // If we're already colored
        if (this.colorClass) {
            // Remove the hover color class
            this.element.classList.remove(this.colorClass);
            this.colorClass = null;
        }

        // If there's a new color class
        if (newColorClass) {
            // Add the new color class
            this.element.classList.add(newColorClass);
            this.colorClass = newColorClass;
        }
    }

    detached() {
        // Clean up when this is routed away
        this._subscriptions.forEach(s => s.dispose());
        this.element.removeEventListener("mouseenter", this._mouseEnterListener);
        this.element.removeEventListener("mouseleave", this._mouseLeaveListener);
    }
}
