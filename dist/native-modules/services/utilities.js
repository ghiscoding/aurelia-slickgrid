import { FieldType, OperatorType } from '../models/index';
import * as moment from 'moment';
import * as $ from 'jquery';
/**
 * Simple function to which will loop and create as demanded the number of white spaces,
 * this will be used in the Excel export
 * @param int nbSpaces: number of white spaces to create
 */
export function addWhiteSpaces(nbSpaces) {
    var result = '';
    for (var i = 0; i < nbSpaces; i++) {
        result += ' ';
    }
    return result;
}
/** HTML encode using jQuery */
export function htmlEncode(value) {
    // create a in-memory div, set it's inner text(which jQuery automatically encodes)
    // then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}
/** HTML decode using jQuery */
export function htmlDecode(value) {
    return $('<div/>').html(value).text();
}
/**
 * decode text into html entity
 * @param string text: input text
 * @param string text: output text
 */
export function htmlEntityDecode(input) {
    return input.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    });
}
/**
 * decode text into html entity
 * @param string text: input text
 * @param string text: output text
 */
export function htmlEntityEncode(input) {
    var buf = [];
    for (var i = input.length - 1; i >= 0; i--) {
        buf.unshift(['&#', input[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
}
/**
 * Take a number (or a string) and display it as a formatted decimal string with defined minimum and maximum decimals
 * @param input
 * @param minDecimal
 * @param maxDecimal
 */
export function decimalFormatted(input, minDecimal, maxDecimal) {
    if (isNaN(+input)) {
        return input;
    }
    var minDec = (minDecimal === undefined) ? 2 : minDecimal;
    var maxDec = (maxDecimal === undefined) ? 2 : maxDecimal;
    var amount = String(Math.round(+input * Math.pow(10, maxDec)) / Math.pow(10, maxDec));
    if (amount.indexOf('.') < 0) {
        amount += '.';
    }
    while ((amount.length - amount.indexOf('.')) <= minDec) {
        amount += '0';
    }
    return amount;
}
/**
 * From a Date FieldType, return it's equivalent moment.js format
 * refer to moment.js for the format standard used: https://momentjs.com/docs/#/parsing/string-format/
 * @param fieldType
 */
export function mapMomentDateFormatWithFieldType(fieldType) {
    var map;
    switch (fieldType) {
        case FieldType.dateTime:
        case FieldType.dateTimeIso:
            map = 'YYYY-MM-DD HH:mm:ss';
            break;
        case FieldType.dateTimeIsoAmPm:
            map = 'YYYY-MM-DD hh:mm:ss a';
            break;
        case FieldType.dateTimeIsoAM_PM:
            map = 'YYYY-MM-DD hh:mm:ss A';
            break;
        case FieldType.dateUs:
            map = 'MM/DD/YYYY';
            break;
        case FieldType.dateUsShort:
            map = 'M/D/YY';
            break;
        case FieldType.dateTimeUs:
            map = 'MM/DD/YYYY HH:mm:ss';
            break;
        case FieldType.dateTimeUsAmPm:
            map = 'MM/DD/YYYY hh:mm:ss a';
            break;
        case FieldType.dateTimeUsAM_PM:
            map = 'MM/DD/YYYY hh:mm:ss A';
            break;
        case FieldType.dateTimeUsShort:
            map = 'M/D/YY H:m:s';
            break;
        case FieldType.dateTimeUsShortAmPm:
            map = 'M/D/YY h:m:s a';
            break;
        case FieldType.dateUtc:
            map = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
            break;
        case FieldType.date:
        case FieldType.dateIso:
        default:
            map = 'YYYY-MM-DD';
            break;
    }
    return map;
}
/**
 * From a Date FieldType, return it's equivalent Flatpickr format
 * refer to Flatpickr for the format standard used: https://chmln.github.io/flatpickr/formatting/#date-formatting-tokens
 * also note that they seem very similar to PHP format (except for am/pm): http://php.net/manual/en/function.date.php
 * @param fieldType
 */
export function mapFlatpickrDateFormatWithFieldType(fieldType) {
    /*
      d: Day of the month, 2 digits with leading zeros	01 to 31
      D: A textual representation of a day	Mon through Sun
      l: (lowercase 'L')	A full textual representation of the day of the week	Sunday through Saturday
      j: Day of the month without leading zeros	1 to 31
      J: Day of the month without leading zeros and ordinal suffix	1st, 2nd, to 31st
      w: Numeric representation of the day of the week	0 (for Sunday) through 6 (for Saturday)
      F: A full textual representation of a month	January through December
      m: Numeric representation of a month, with leading zero	01 through 12
      n: Numeric representation of a month, without leading zeros	1 through 12
      M: A short textual representation of a month	Jan through Dec
      U: The number of seconds since the Unix Epoch	1413704993
      y: A two digit representation of a year	99 or 03
      Y: A full numeric representation of a year, 4 digits	1999 or 2003
      H: Hours (24 hours)	00 to 23
      h: Hours	1 to 12
      i: Minutes	00 to 59
      S: Seconds, 2 digits	00 to 59
      s: Seconds	0, 1 to 59
      K: AM/PM	AM or PM
    */
    var map;
    switch (fieldType) {
        case FieldType.dateTime:
        case FieldType.dateTimeIso:
            map = 'Y-m-d H:i:S';
            break;
        case FieldType.dateTimeIsoAmPm:
            map = 'Y-m-d h:i:S K'; // there is no lowercase in Flatpickr :(
            break;
        case FieldType.dateTimeIsoAM_PM:
            map = 'Y-m-d h:i:S K';
            break;
        case FieldType.dateUs:
            map = 'm/d/Y';
            break;
        case FieldType.dateUsShort:
            map = 'm/d/y';
            break;
        case FieldType.dateTimeUs:
            map = 'm/d/Y H:i:S';
            break;
        case FieldType.dateTimeUsAmPm:
            map = 'm/d/Y h:i:S K'; // there is no lowercase in Flatpickr :(
            break;
        case FieldType.dateTimeUsAM_PM:
            map = 'm/d/Y h:i:s K';
            break;
        case FieldType.dateTimeUsShort:
            map = 'm/d/y H:i:s';
            break;
        case FieldType.dateTimeUsShortAmPm:
            map = 'm/d/y h:i:s K'; // there is no lowercase in Flatpickr :(
            break;
        case FieldType.dateUtc:
            map = 'Z';
            break;
        case FieldType.date:
        case FieldType.dateIso:
        default:
            map = 'Y-m-d';
            break;
    }
    return map;
}
/**
 * Mapper for query operators (ex.: <= is "le", > is "gt")
 * @param string operator
 * @returns string map
 */
export function mapOperatorType(operator) {
    var map;
    switch (operator) {
        case '<':
            map = OperatorType.lessThan;
            break;
        case '<=':
            map = OperatorType.lessThanOrEqual;
            break;
        case '>':
            map = OperatorType.greaterThan;
            break;
        case '>=':
            map = OperatorType.greaterThanOrEqual;
            break;
        case '<>':
        case '!=':
        case 'neq':
        case 'NEQ':
            map = OperatorType.notEqual;
            break;
        case '*':
        case '.*':
        case 'startsWith':
            map = OperatorType.startsWith;
            break;
        case '*.':
        case 'endsWith':
            map = OperatorType.endsWith;
            break;
        case '=':
        case '==':
        case 'eq':
        case 'EQ':
            map = OperatorType.equal;
            break;
        case 'in':
        case 'IN':
            map = OperatorType.in;
            break;
        case 'notIn':
        case 'NIN':
        case 'NOT_IN':
            map = OperatorType.notIn;
            break;
        default:
            map = OperatorType.contains;
            break;
    }
    return map;
}
/**
 * Mapper for query operator by a Field Type
 * For example a String should use "Contains" but a number should use "EQ" operator
 * @param operator
 * @returns string map
 */
export function mapOperatorByFieldType(fieldType) {
    var map;
    switch (fieldType) {
        case FieldType.string:
        case FieldType.unknown:
            map = OperatorType.contains;
            break;
        case FieldType.float:
        case FieldType.number:
        case FieldType.date:
        case FieldType.dateIso:
        case FieldType.dateUtc:
        case FieldType.dateTime:
        case FieldType.dateTimeIso:
        case FieldType.dateTimeIsoAmPm:
        case FieldType.dateTimeIsoAM_PM:
        case FieldType.dateUs:
        case FieldType.dateUsShort:
        case FieldType.dateTimeUs:
        case FieldType.dateTimeUsAmPm:
        case FieldType.dateTimeUsAM_PM:
        case FieldType.dateTimeUsShort:
        case FieldType.dateTimeUsShortAmPm:
        case FieldType.dateTimeUsShortAM_PM:
        default:
            map = OperatorType.equal;
            break;
    }
    return map;
}
/**
 * Parse a date passed as a string and return a Date object (if valid)
 * @param string inputDateString
 * @returns string date formatted
 */
export function parseUtcDate(inputDateString, useUtc) {
    var date = null;
    if (/^[0-9\-\/]*$/.test(inputDateString)) {
        // get the UTC datetime with moment.js but we need to decode the value so that it's valid text
        var dateString = decodeURIComponent(inputDateString);
        var dateMoment = moment(new Date(dateString));
        if (dateMoment.isValid() && dateMoment.year().toString().length === 4) {
            date = (useUtc) ? dateMoment.utc().format() : dateMoment.format();
        }
    }
    return date;
}
/**
 * Sanitize, return only the text without HTML tags
 * @input htmlString
 * @return text
 */
export function sanitizeHtmlToText(htmlString) {
    var temp = document.createElement('div');
    temp.innerHTML = htmlString;
    return temp.textContent || temp.innerText;
}
/**
 * Converts a string to camel case
 * @param str the string to convert
 * @return the string in camel case
 */
export function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|[\s+\-_\/])/g, function (match, offset) {
        // remove white space or hypens or underscores
        if (/[\s+\-_\/]/.test(match)) {
            return '';
        }
        return offset === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}
/**
 * Converts a string to kebab (hypen) case
 * @param str the string to convert
 * @return the string in kebab case
 */
export function toKebabCase(str) {
    return toCamelCase(str).replace(/([A-Z])/g, '-$1').toLowerCase();
}
/**
 * Compares two arrays to determine if all the items are equal
 * @param a first array
 * @param b second array to compare with a
 * @param [orderMatters=false] flag if the order matters, if not arrays will be sorted
 * @return boolean true if equal, else false
 */
export function arraysEqual(a, b, orderMatters) {
    if (orderMatters === void 0) { orderMatters = false; }
    if (a === b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    if (!orderMatters) {
        a.sort();
        b.sort();
    }
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Compares two objects to determine if all the properties are equal
 * We will do a deep check recursively to make sure all properties really are the same
 * @param x first object
 * @param y second object to compare with a
 */
export function objectsDeepEqual(x, y) {
    var ok = Object.keys;
    var tx = typeof x;
    var ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (ok(x).length === ok(y).length &&
        ok(x).every(function (key) { return objectsDeepEqual(x[key], y[key]); })) : (x === y);
}
/**
 * Uses the logic function to find an item in an array or returns the default
 * value provided (empty object by default)
 * @param any[] array the array to filter
 * @param function logic the logic to find the item
 * @param any [defaultVal={}] the default value to return
 * @return object the found object or deafult value
 */
export function findOrDefault(array, logic, defaultVal) {
    if (defaultVal === void 0) { defaultVal = {}; }
    return array.find(logic) || defaultVal;
}
//# sourceMappingURL=utilities.js.map