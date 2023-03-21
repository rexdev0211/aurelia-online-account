import {autoinject} from "aurelia-dependency-injection";
import {BindingEngine} from "aurelia-framework";

@autoinject()
export class DeepObserver {
    private _bindingEngine: BindingEngine;

    constructor(bindingEngine: BindingEngine) {
        this._bindingEngine = bindingEngine;
    }

    public observe(target: Object, property: string, callback: (n: any, o: any, name: string) => void): () => void {
        let subscriptions: { root: any, children: any[] } = {root: null, children: []};

        subscriptions.root = (this._bindingEngine.propertyObserver(target, property)
                .subscribe((n, o) => {
                        this.disconnect(subscriptions.children);
                        let path = property;
                        this.recurse(target, property, subscriptions.children, callback, path);
                    }
                )
        );
        return () => {
            this.disconnect(subscriptions.children);
            subscriptions.root.dispose();
        }
    }

    private disconnect(subscriptions) {
        while (subscriptions.length) {
            subscriptions.pop().dispose();
        }
    }

    private recurse(target, property, subscriptions, callback, path) {
        let sub = target[property];
        if (typeof sub === "object") {
            for (let p in sub)
                if (sub.hasOwnProperty(p)) {
                    this.recurse(sub, p, subscriptions, callback, `${path}${sub instanceof Array ? '[' + p + ']' : '.' + p}`);
                }
        }
        if (target != property) // Avoid re-observice root node
        {
            subscriptions.push(this._bindingEngine.propertyObserver(target, property).subscribe((n, o) => callback(n, o, path)));
        }
    };
}