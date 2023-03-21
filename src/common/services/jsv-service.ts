export class JsvService {
    ESCAPE_CHARS = ['"', ',', '{', '}', '[', ']'];

    parse(str) {
        if (!str) return str;
        if (str[0] == '{') {
            return this.parseObject(str);
        } else if (str[0] == '[') {
            return this.parseArray(str);
        } else {
            return this.parseString(str);
        }
    }


    parseArray(str) {
        var to = [], value = this.stripList(str);
        if (!value) return to;

        if (value[0] == '{') {
            var ref = {i: 0};
            do {
                var itemValue = this.eatMapValue(value, ref);
                to.push(this.parse(itemValue));
            } while (++ref.i < value.length);
        } else {
            for (var ref = {i: 0}; ref.i < value.length; ref.i++) {
                var elementValue = this.eatElementValue(value, ref);
                to.push(this.parse(elementValue));
            }
        }
        return to;
    }

    parseObject(str) {
        if (str[0] != '{') {
            throw "Type definitions should start with a '{', got string starting with: "
            + str.substr(0, str.length < 50 ? str.length : 50);
        }

        var name, obj = {};

        if (str == '{}') return null;
        for (var ref = {i: 1}, strTypeLength = str.length; ref.i < strTypeLength; ref.i++) {
            name = this.eatMapKey(str, ref);
            ref.i++;
            var value = this.eatMapValue(str, ref);
            obj[name] = this.parse(value);
        }
        return obj;
    }

    eatElementValue(value, ref) {
        return this.eatUntilCharFound(value, ref, ',');
    }

    toCsvField(text) {
        return !text || this.containsAny(text, this.ESCAPE_CHARS)
            ? text
            : '"' + text.replace(/"/g, '""') + '"';
    }

    fromCsvField(text) {
        return this.parseString(text);
    }

    parseString(text) {
        return !text || text[0] != '"'
            ? text
            : text.substr(1, text.length - 2).replace(/""/g, '"');
    }

    stripList(value) {
        if (!value) return null;
        return value[0] == '['
            ? value.substr(1, value.length - 2)
            : value;
    }

    /**
     * @param value {string}
     * @param ref {ref int}
     * @param findChar {char}
     */
    eatUntilCharFound(value, ref, findChar) {
        var tokenStartPos = ref.i;
        var valueLength = value.length;
        if (value[tokenStartPos] != '"') {
            ref.i = value.indexOf(findChar, tokenStartPos);
            if (ref.i == -1) ref.i = valueLength;
            return value.substr(tokenStartPos, ref.i - tokenStartPos);
        }

        while (++ref.i < valueLength) {
            if (value[ref.i] == '"') {
                if (ref.i + 1 >= valueLength) {
                    return value.substr(tokenStartPos, ++ref.i - tokenStartPos);
                }
                if (value[ref.i + 1] == '"') {
                    ref.i++;
                } else if (value[ref.i + 1] == findChar) {
                    return value.substr(tokenStartPos, ++ref.i - tokenStartPos);
                }
            }
        }

        throw "Could not find ending quote";
    }

    /**
     *
     * @param value {string}
     * @param i {ref int}
     */
    eatMapKey(value, ref) {
        var tokenStartPos = ref.i;
        // tslint:disable-next-line:no-empty
        while (value[++ref.i] != ':' && ref.i < value.length) {
        }
        return value.substr(tokenStartPos, ref.i - tokenStartPos);
    }

    /**
     *
     * @param value {string}
     * @param ref {ref int}
     */
    eatMapValue(value, ref) {
        var tokenStartPos = ref.i;
        var valueLength = value.length;
        if (ref.i == valueLength) return null;

        var valueChar = value[ref.i];

        //If we are at the end, return.
        if (valueChar == ',' || valueChar == '}') {
            return null;
        }

        //Is List, i.e. [...]
        var withinQuotes = false;
        if (valueChar == '[') {
            var endsToEat = 1;
            while (++ref.i < valueLength && endsToEat > 0) {
                valueChar = value[ref.i];
                if (valueChar == '"')
                    withinQuotes = !withinQuotes;
                if (withinQuotes)
                    continue;
                if (valueChar == '[')
                    endsToEat++;
                if (valueChar == ']')
                    endsToEat--;
            }
            return value.substr(tokenStartPos, ref.i - tokenStartPos);
        }

        //Is Type/Map, i.e. {...}
        if (valueChar == '{') {
            var endsToEat = 1;
            while (++ref.i < valueLength && endsToEat > 0) {
                valueChar = value[ref.i];

                if (valueChar == '"')
                    withinQuotes = !withinQuotes;
                if (withinQuotes)
                    continue;
                if (valueChar == '{')
                    endsToEat++;
                if (valueChar == '}')
                    endsToEat--;
            }
            return value.substr(tokenStartPos, ref.i - tokenStartPos);
        }

        //Is Within Quotes, i.e. "..."
        if (valueChar == '"') {
            while (++ref.i < valueLength) {
                valueChar = value[ref.i];
                if (valueChar != '"') continue;
                var isLiteralQuote = ref.i + 1 < valueLength && value[ref.i + 1] == '"';
                ref.i++; //skip quote
                if (!isLiteralQuote)
                    break;
            }
            return value.substr(tokenStartPos, ref.i - tokenStartPos);
        }

        //Is Value
        while (++ref.i < valueLength) {
            valueChar = value[ref.i];
            if (valueChar == ',' || valueChar == '}')
                break;
        }

        return value.substr(tokenStartPos, ref.i - tokenStartPos);
    }

    isEmpty(a) {
        return (a === null || a === undefined || a === "");
    }

    isFunction(a) {
        return (typeof (a) === 'function') ? a.constructor.toString().match(/Function/) !== null : false;
    }

    isString(a) {
        if (a === null || a === undefined) return false;
        return (typeof (a) === 'string') ? true : (typeof (a) === 'object') ? a.constructor.toString().match(/string/i) !== null : false;
    }

    isDate(a: Date) {
        if (this.isEmpty(a)) return false;
        // @ts-ignore
        return (typeof (a) === 'date') ? true : (typeof (a) === 'object') ? a.constructor.toString().match(/date/i) !== null : false;
    }

    isArray(a: Array<any>) {
        // @ts-ignore
        if (a === null || a === undefined || a === "") return false;
        return (typeof (a) === 'object') ? a.constructor.toString().match(/array/i) !== null || a.length !== undefined : false;
    }

    toXsdDateTime(date) {
        function pad(n) {
            var s = n.toString();
            return s.length < 2 ? '0' + s : s;
        };
        var yyyy = date.getUTCFullYear();
        var MM = pad(date.getUTCMonth() + 1);
        var dd = pad(date.getUTCDate());
        var hh = pad(date.getUTCHours());
        var mm = pad(date.getUTCMinutes());
        var ss = pad(date.getUTCSeconds());
        var ms = pad(date.getUTCMilliseconds());

        return yyyy + '-' + MM + '-' + dd + 'T' + hh + ':' + mm + ':' + ss + '.' + ms + 'Z';
    }

    stringify(obj) {
        return this.serialize(obj);
    }

    serialize(obj) {
        if (obj === null || obj === undefined) return null;

        var typeOf = typeof (obj);
        if (obj === 'function') return null;

        if (typeOf === 'object') {
            var ctorStr = obj.constructor.toString().toLowerCase();
            if (ctorStr.indexOf('string') != -1)
                return this.escapeString(obj);
            if (ctorStr.indexOf('boolean') != -1)
                return obj ? "True" : "False";
            if (ctorStr.indexOf('number') != -1)
                return obj;
            if (ctorStr.indexOf('date') != -1)
                return this.escapeString(this.toXsdDateTime(obj));
            if (ctorStr.indexOf('array') != -1)
                return this.serializeArray(obj);

            return this.serializeObject(obj);
        } else {
          switch (typeOf) {
                case 'string':
                    return this.escapeString(obj);
                    break;
                case 'boolean':
                    return obj ? "True" : "False";
                    break;
            // @ts-ignore
                case 'date':
                    return this.escapeString(this.toXsdDateTime(obj));
                    break;
            // @ts-ignore
                case 'array':
                    return this.serializeArray(obj);
                    break;
                case 'number':
                default:
                    return obj;
            }
        }
    }

    serializeObject(obj) {
        // @ts-ignore
        var value, sb = new StringBuffer();
        for (var key in obj) {
            value = obj[key];
            if (!obj.hasOwnProperty(key) || this.isEmpty(value) || this.isFunction(value)) continue;

            if (sb.getLength() > 0)
                sb.append(',',null,null);

            sb.append(this.escapeString(key),null,null);
            sb.append(':',null,null);
            sb.append(this.serialize(value),null,null);
        }
        return '{' + sb.toString() + '}';
    }

    serializeArray(array: []) {
        // @ts-ignore
        var value, sb = new StringBuffer();
        for (var i = 0, len = array.length; i < len; i++) {
            value = array[i];
            if (this.isEmpty(value) || this.isFunction(value)) continue;

            if (sb.getLength() > 0)
                sb.append(',',null,null);

            sb.append(this.serialize(value),null,null);
        }
        return '[' + sb.toString() + ']';
    }

    escapeString(str: string) {
        if (str === undefined || str === null) return null;
        if (str === '') return '""';

        if (str.indexOf('"')) {
            str = str.replace(/"/g, '""');
        }
        if (this.containsAny(str, this.ESCAPE_CHARS)) {
            return '"' + str + '"';
        }
        return str;
    }

    containsAny(str: string, tests?: Array<any>) {
        if (!this.isString(str)) return;
        for (var i = 0, len = tests.length; i < len; i++) {
            if (str.indexOf(tests[i]) != -1) return true;
        }
        return false;
    }


}

/* Closure Library StringBuffer for efficient string concatenation */
export class StringBuffer {
    hasScriptEngine: boolean;
    HAS_JSCRIPT: boolean;
    bufferLength_ = 0;
    private buffer: any[] | string;

    constructor(opt_a1, var_args) {
        this.hasScriptEngine = 'ScriptEngine' in window;
        this.HAS_JSCRIPT = this.hasScriptEngine && window['ScriptEngine']() == 'JScript';

        this.buffer = this.HAS_JSCRIPT ? [] : '';

        if (opt_a1 != null) {
            this.append.apply(this, arguments);
        }

    }

    set(s) {
        this.clear();
        // @ts-ignore
        this.append(s);
    };

    append(a1, opt_a2, var_args) {
        if (this.HAS_JSCRIPT) {
            // IE version.
            if (opt_a2 == null) { // second argument is undefined (null == undefined)
                // Array assignment is 2x faster than Array push.  Also, use a1
                // directly to avoid arguments instantiation, another 2x improvement.
                // @ts-ignore
                this.buffer[this.bufferLength_++] = a1;
            } else {
                // @ts-ignore
                this.buffer.push.apply(/** @type {Array} */ (this.buffer), arguments);
                this.bufferLength_ = this.buffer.length;
            }
            return this;

        } else {
            // W3 version.
            this.buffer += a1;
            if (opt_a2 != null) { // second argument is undefined (null == undefined)
                for (var i = 1; i < arguments.length; i++) {
                    this.buffer += arguments[i];
                }
            }
            return this;
        }
    }

    clear() {
        if (this.HAS_JSCRIPT) {
            // @ts-ignore
            this.buffer.length = 0;  // Reuse the array to avoid creating new object.
            this.bufferLength_ = 0;
        } else {
            this.buffer = '';
        }
    }

    getLength() {
        return this.toString().length;
    };

    toString() {
        if (this.HAS_JSCRIPT) {
            // @ts-ignore
            var str = this.buffer.join('');
            this.clear();
            if (str) {
                // @ts-ignore
                this.append(str);
            }
            return str;
        } else {
            return /** @type {string} */ (this.buffer);
        }
    }
}
