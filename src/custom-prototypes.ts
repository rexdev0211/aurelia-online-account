export class CustomPrototypes {
    static loadPrototypes() {
        // @ts-ignore
        Array.prototype.move = function (from, to) {
            this.splice(to, 0, this.splice(from, 1)[0]);
        };

        // @ts-ignore
        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        Object.defineProperty(Object.prototype, "getProp", {
            value: function (prop) {
                let key, self = this;
                for (key in self) {
                    if (key.toLowerCase() == prop.toLowerCase()) {
                        return self[key];
                    }
                }
            },
            //this keeps jquery happy
            enumerable: false
        });
    }
}