/*
 * jsturbo
 * https://bitbucket.org/eduardoportilho/jsturbo
 * Version: 0.0.16 - 2016-02-10
 */
/* '10'.pad(4, '-'); // --10 */
String.prototype.pad = function(width, z) {
	z = z || '0';
	var n = this + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/* (pretty lenient) 1.234,00 -> 1234.00 (NaN se nao conseguir) */
String.prototype.toNumber = function() {
    var stringProcessada = this
            .replace(/[^\d\.,]/g, '') //tira tudo que não for numero, ponto e virgula
            .replace(/,/g, '.');       //troca virgula por ponto
    var idxUltimoPonto = stringProcessada.lastIndexOf('.');
    if(idxUltimoPonto > 0) {
        var parteInteira = stringProcessada.substring(0, idxUltimoPonto).replace(/\./g, '');
        stringProcessada = parteInteira + '.' + stringProcessada.substring(idxUltimoPonto+1);
    }
    if(stringProcessada.trim().length == 0) return NaN;

    var signal = this.indexOf('-') === 0 ? -1 : 1;
    // * para garatir que é numero e corrigir sinal
    return stringProcessada * signal;
};

String.prototype.isNumber = function(decimalSeparator) {
    var str = this;
    if(decimalSeparator) {
        //caso especial: se o sep não for ponto, ter ponto invalida (expect('1.'.isNumber(',')).toBeFalsy();)
        if(decimalSeparator !== '.' && str.indexOf('.') >= 0) {
            return false;
        }
        str = this.replace(decimalSeparator, '.');
    }
    return !isNaN(Number(str));
};
Number.prototype.format = function(options) {
	options = options || {};
    var formatted = this.toString();
    if(options.decimalPlaces) {
    	formatted = this.toFixed(options.decimalPlaces);
    }
    if(options.decimalSeparator) {
    	formatted = formatted.replace(/\./, options.decimalSeparator);
    }

    return '' + formatted;
};


Number.isInt = function(n) {
    return typeof n== "number" && isFinite(n) && n%1===0;
};

Number.isNumber = function(n) {
    return typeof n== "number" && isFinite(n);
};

Number.toNumber = function(any) {
    if(Object.isEmpty(any)) return NaN;
    return any.toString().toNumber();
};
/**
 * Examples:
 * 
 * [1,2,3,4,5,6].minus( [3,4,5] );  
 * // => [1, 2, 6]
 * 
 * ["test1", "test2","test3","test4","test5","test6"].minus(["test1","test2","test3","test4"]);  
 * // => ["test5", "test6"]
 **/
Array.prototype.minus = function(array) {
    return this.filter(function(i) {return array.indexOf(i) < 0;});
};
Array.prototype.plus = function(array) {
    return this.concat(array);
};
Array.prototype.last = function() {
    return this[this.length-1];
};
Array.prototype.contains = function(searchElement) {
    return this.indexOf(searchElement)>=0;
};
Array.prototype.spread = function(prop) {
    return this.map(function(it) {return it[prop] });
};
Array.prototype.clone = function() {
	return this.slice(0);
};
Date.prototype.toStringDMY = function() {
    return [this.getDate().toString().pad(2), (this.getMonth()+1).toString().pad(2), this.getFullYear().toString().pad(4)].join('/');
};

Date.prototype.isToday = function() {
    return this.toStringDMY() === new Date().toStringDMY();
};

Date.fromStringDMY = function(ddmmyyyy) {
	ddmmyyyy = ddmmyyyy.replace(/\D/g, '');
	var day = parseInt(ddmmyyyy.substr(0, 2));
	var month = parseInt(ddmmyyyy.substr(2, 2)) - 1;
	var year = parseInt(ddmmyyyy.substr(4, 4));
	return new Date(year, month, day, 0, 0, 0, 0);
};

/**
 * Require: <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
 **/

function Time(hours, minutes, seconds, negative) {
    this.hours = (hours == undefined) ? 0 : Math.round(hours);
    this.minutes = (minutes == undefined) ? 0 : Math.round(minutes);
    this.seconds = (seconds == undefined) ? 0 : Math.round(seconds);
    this.negative = negative || false;

    if(!Number.isNumber(this.hours) || !Number.isNumber(this.minutes) || !Number.isNumber(this.seconds)) throw new Error("Invalid time");
}

Time.prototype.inMinutes = function() {
    var signal = this.negative ? -1 : 1;
    return  (this.hours * 60 + this.minutes )* signal;
};

Time.prototype.inSeconds = function() {
    var signal = this.negative ? -1 : 1;
    return  (this.hours * 3600 + this.minutes* 60 + this.seconds )* signal;
};

Time.prototype.plus = function(time) {
    var s1 = this.inSeconds();
    var s2 = time.inSeconds();
    return Time.fromSeconds(s1+s2);
};

Time.prototype.minus = function(time) {
    var s1 = this.inSeconds();
    var s2 = time.inSeconds();
    return Time.fromSeconds(s1-s2);
};

Time.prototype.toString = function(pattern, trimZeroHour) {
    if(trimZeroHour == undefined) {
        trimZeroHour = (pattern == undefined);
    }
    pattern = pattern || "HH:mm:ss";
    var signal = this.negative ? '-' : '';
    pattern = pattern.replace(/hh/gi, this.hours.toString().pad(2));
    pattern = pattern.replace(/mm/gi, this.minutes.toString().pad(2));
    pattern = pattern.replace(/ss/gi, this.seconds.toString().pad(2));
    if(trimZeroHour && pattern.indexOf('00:') == 0 && pattern.indexOf(':') !== pattern.lastIndexOf(':')) {
        pattern = pattern.substr(3);
    }

    return signal + pattern;
};

/* static */

Time.fromSeconds = function(seconds) {
    var negative = seconds < 0;

    seconds = Math.abs(seconds);
    var h = parseInt(seconds/3600, 10);
    var rem = seconds - (h*3600);
    var m = parseInt(rem/60, 10);
    var s = rem - (m*60);
    return new Time(h,m,s,negative);
};

Time.fromMinutes = function(minutes) {
    var negative = minutes < 0;
    minutes = Math.abs(minutes);
    var h = parseInt(minutes/60, 10);
    var m = minutes - (h*60);
    return new Time(h,m, 0, negative);
};

Time.fromString = function(hhmmAsText, pattern) {
    if(pattern) {
        var si = pattern.toLowerCase().indexOf('s');
        var sf = pattern.toLowerCase().lastIndexOf('s');
        var s = 0;
        if(si >= 0) {
            s = parseInt(hhmmAsText.substring(si, sf+1));
        }

        var mi = pattern.toLowerCase().indexOf('m');
        var mf = pattern.toLowerCase().lastIndexOf('m');
        var m = 0;
        if(mi >= 0) {
            m = parseInt(hhmmAsText.substring(mi, mf+1));
        }

        var hi = pattern.toLowerCase().indexOf('h');
        var hf = pattern.toLowerCase().lastIndexOf('h');
        var h = 0;
        if(hi >= 0) {
            h = parseInt(hhmmAsText.substring(hi, hf+1));
        }

        return new Time(h, m, s);
    } else {
        var negative = (hhmmAsText.indexOf('-') === 0);
        var parts = hhmmAsText.split(':').map(function(it){ return parseInt(it, 10); });
        var sec =  0, min = 0, hour = 0;
        if(parts.length == 3) {
            hour = parts[0];
            min = parts[1];
            sec = parts[2];
        } else if(parts.length == 2) {
            min = parts[0];
            sec = parts[1];
        } else if(parts.length == 1) {
            sec = parts[0];
        } else {
            throw new Error("Invalid time");
        }
        return new Time(hour, min, sec, negative);
    }
};

Time.isTime = function (hhmmAsText) {
    try {
        var time = Time.fromString(hhmmAsText);
        return Number.isInt(time.hours) && Number.isInt(time.minutes) && Number.isInt(time.seconds);
    } catch(any) { return false; }
};

Time.now = function() {
    var dt = new Date();
    return new Time(dt.getHours(), dt.getMinutes(), dt.getSeconds());
};
function DecimalInput(decimalSeparator, decimalPlaces) {
	this.decimalSeparator = decimalSeparator || '.';
    this.decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2; 
}

DecimalInput.prototype.nextValidState = function(input) {
    var previousState = input.slice(0, -1);
    var inputedChar = input.slice(-1);
    //caso especial: . será considerado número mesmo se o sep. for diferente
    if(inputedChar === '.' && inputedChar !== this.decimalSeparator) {
    	return previousState;
    }
    if(inputedChar === this.decimalSeparator) {
        return previousState.indexOf(this.decimalSeparator) >= 0 ? previousState : input;
    } 
    if(!input.isNumber(this.decimalSeparator)) {
        return previousState;
    }
    var inputDecimalPlaces = input.indexOf(this.decimalSeparator) >= 0 ? input.split(this.decimalSeparator)[1].length : 0;


    return inputDecimalPlaces <= this.decimalPlaces ? input : previousState;
};
jQuery.fn.spreadText = function() {
    return this.map(function() {
        return $(this).text();
    }).get();
};
Object.getNestedPropertyValue = function(object, propName) {
	if(typeof propName !== 'string') {
		return undefined;
	}
	var propNames = propName.split('.');
	var obj = object;

	while(propNames.length > 0) {
		var key = propNames.shift();
		if(obj === null || obj === undefined) {
			return undefined;
		}

		obj = obj[key];
	}
	return obj;
};

Object.isEmpty = function(any) {
	if(any === undefined || any === null) {
		return true;
	}
	if(typeof any === 'string') {
		return any.trim().length <= 0;
	}
	if(Array.isArray(any)) {
		return any.length <= 0;
	}
	if(typeof any === 'object') {
		return Object.keys(any).length <= 0;
	}
	return false;
};

Object.isNestedPropertyEmpty = function(object, propName) {
	return Object.isEmpty( Object.getNestedPropertyValue(object, propName) );
};

Object.convertInnerObjects = function(object, shouldTransform, transform) {
	if (typeof object !== "object") return object;

    for (var key in object) {
        if (!object.hasOwnProperty(key)) continue;

        var value = object[key];

        if(shouldTransform(value)) {
            object[key] = transform(value);
        } else if (typeof value === "object") {
            // Recurse into object
            Object.convertInnerObjects(value, shouldTransform, transform);
        }
    }
    return object;
};