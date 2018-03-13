define(["require", "exports", "../models/index", "moment"], function (require, exports, index_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Simple function to which will loop and create as demanded the number of white spaces,
     * this will be used in the Excel export
     * @param int nbSpaces: number of white spaces to create
     */
    function addWhiteSpaces(nbSpaces) {
        var result = '';
        for (var i = 0; i < nbSpaces; i++) {
            result += ' ';
        }
        return result;
    }
    exports.addWhiteSpaces = addWhiteSpaces;
    /**
     * decode text into html entity
     * @param string text: input text
     * @param string text: output text
     */
    function htmlEntityDecode(input) {
        return input.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    }
    exports.htmlEntityDecode = htmlEntityDecode;
    /**
     * decode text into html entity
     * @param string text: input text
     * @param string text: output text
     */
    function htmlEntityEncode(input) {
        var buf = [];
        for (var i = input.length - 1; i >= 0; i--) {
            buf.unshift(['&#', input[i].charCodeAt(), ';'].join(''));
        }
        return buf.join('');
    }
    exports.htmlEntityEncode = htmlEntityEncode;
    /**
     * From a Date FieldType, return it's equivalent moment.js format
     * refer to moment.js for the format standard used: https://momentjs.com/docs/#/parsing/string-format/
     * @param fieldType
     */
    function mapMomentDateFormatWithFieldType(fieldType) {
        var map;
        switch (fieldType) {
            case index_1.FieldType.dateTime:
            case index_1.FieldType.dateTimeIso:
                map = 'YYYY-MM-DD HH:mm:ss';
                break;
            case index_1.FieldType.dateTimeIsoAmPm:
                map = 'YYYY-MM-DD hh:mm:ss a';
                break;
            case index_1.FieldType.dateTimeIsoAM_PM:
                map = 'YYYY-MM-DD hh:mm:ss A';
                break;
            case index_1.FieldType.dateUs:
                map = 'MM/DD/YYYY';
                break;
            case index_1.FieldType.dateUsShort:
                map = 'M/D/YY';
                break;
            case index_1.FieldType.dateTimeUs:
                map = 'MM/DD/YYYY HH:mm:ss';
                break;
            case index_1.FieldType.dateTimeUsAmPm:
                map = 'MM/DD/YYYY hh:mm:ss a';
                break;
            case index_1.FieldType.dateTimeUsAM_PM:
                map = 'MM/DD/YYYY hh:mm:ss A';
                break;
            case index_1.FieldType.dateTimeUsShort:
                map = 'M/D/YY H:m:s';
                break;
            case index_1.FieldType.dateTimeUsShortAmPm:
                map = 'M/D/YY h:m:s a';
                break;
            case index_1.FieldType.dateUtc:
                map = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
                break;
            case index_1.FieldType.date:
            case index_1.FieldType.dateIso:
            default:
                map = 'YYYY-MM-DD';
                break;
        }
        return map;
    }
    exports.mapMomentDateFormatWithFieldType = mapMomentDateFormatWithFieldType;
    /**
     * From a Date FieldType, return it's equivalent Flatpickr format
     * refer to Flatpickr for the format standard used: https://chmln.github.io/flatpickr/formatting/#date-formatting-tokens
     * also note that they seem very similar to PHP format (except for am/pm): http://php.net/manual/en/function.date.php
     * @param fieldType
     */
    function mapFlatpickrDateFormatWithFieldType(fieldType) {
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
            case index_1.FieldType.dateTime:
            case index_1.FieldType.dateTimeIso:
                map = 'Y-m-d H:i:S';
                break;
            case index_1.FieldType.dateTimeIsoAmPm:
                map = 'Y-m-d h:i:S K'; // there is no lowercase in Flatpickr :(
                break;
            case index_1.FieldType.dateTimeIsoAM_PM:
                map = 'Y-m-d h:i:S K';
                break;
            case index_1.FieldType.dateUs:
                map = 'm/d/Y';
                break;
            case index_1.FieldType.dateUsShort:
                map = 'M/D/YY';
                break;
            case index_1.FieldType.dateTimeUs:
                map = 'm/d/Y H:i:S';
                break;
            case index_1.FieldType.dateTimeUsAmPm:
                map = 'm/d/Y h:i:S K'; // there is no lowercase in Flatpickr :(
                break;
            case index_1.FieldType.dateTimeUsAM_PM:
                map = 'M/D/YY h:i:s K';
                break;
            case index_1.FieldType.dateTimeUsShort:
                map = 'M/D/YY H:i:s';
                break;
            case index_1.FieldType.dateTimeUsShortAmPm:
                map = 'M/D/YY h:i:s K'; // there is no lowercase in Flatpickr :(
                break;
            case index_1.FieldType.dateUtc:
                map = 'Z';
                break;
            case index_1.FieldType.date:
            case index_1.FieldType.dateIso:
            default:
                map = 'Y-m-d';
                break;
        }
        return map;
    }
    exports.mapFlatpickrDateFormatWithFieldType = mapFlatpickrDateFormatWithFieldType;
    /**
     * Mapper for query operators (ex.: <= is "le", > is "gt")
     * @param string operator
     * @returns string map
     */
    function mapOperatorType(operator) {
        var map;
        switch (operator) {
            case '<':
                map = index_1.OperatorType.lessThan;
                break;
            case '<=':
                map = index_1.OperatorType.lessThanOrEqual;
                break;
            case '>':
                map = index_1.OperatorType.greaterThan;
                break;
            case '>=':
                map = index_1.OperatorType.greaterThanOrEqual;
                break;
            case '<>':
            case '!=':
            case 'neq':
            case 'NEQ':
                map = index_1.OperatorType.notEqual;
                break;
            case '*':
            case '.*':
            case 'startsWith':
                map = index_1.OperatorType.startsWith;
                break;
            case '*.':
            case 'endsWith':
                map = index_1.OperatorType.endsWith;
                break;
            case '=':
            case '==':
            case 'eq':
            case 'EQ':
                map = index_1.OperatorType.equal;
                break;
            case 'in':
            case 'IN':
                map = index_1.OperatorType.in;
                break;
            case 'notIn':
            case 'NIN':
            case 'NOT_IN':
                map = index_1.OperatorType.notIn;
                break;
            default:
                map = index_1.OperatorType.contains;
                break;
        }
        return map;
    }
    exports.mapOperatorType = mapOperatorType;
    /**
     * Mapper for query operator by a Field Type
     * For example a String should use "Contains" but a number should use "EQ" operator
     * @param operator
     * @returns string map
     */
    function mapOperatorByFieldType(fieldType) {
        var map;
        switch (fieldType) {
            case index_1.FieldType.string:
            case index_1.FieldType.unknown:
                map = index_1.OperatorType.contains;
                break;
            case index_1.FieldType.float:
            case index_1.FieldType.number:
            case index_1.FieldType.dateIso:
            case index_1.FieldType.date:
            case index_1.FieldType.dateUtc:
            case index_1.FieldType.dateTime:
            case index_1.FieldType.dateTimeIso:
            case index_1.FieldType.dateTimeIsoAmPm:
            case index_1.FieldType.dateTimeIsoAM_PM:
            case index_1.FieldType.dateUs:
            case index_1.FieldType.dateUsShort:
            case index_1.FieldType.dateTimeUs:
            case index_1.FieldType.dateTimeUsAmPm:
            case index_1.FieldType.dateTimeUsAM_PM:
            case index_1.FieldType.dateTimeUsShort:
            case index_1.FieldType.dateTimeUsShortAmPm:
            case index_1.FieldType.dateTimeUsShortAM_PM:
            default:
                map = index_1.OperatorType.equal;
                break;
        }
        return map;
    }
    exports.mapOperatorByFieldType = mapOperatorByFieldType;
    /**
     * Mapper for query operator by a Filter Type
     * For example a multiple-select typically uses 'IN' operator
     * @param operator
     * @returns string map
     */
    function mapOperatorByFilterType(filterType) {
        var map;
        switch (filterType) {
            case index_1.FilterType.multipleSelect:
                map = index_1.OperatorType.in;
                break;
            case index_1.FilterType.singleSelect:
                map = index_1.OperatorType.equal;
                break;
            default:
                map = index_1.OperatorType.contains;
                break;
        }
        return map;
    }
    exports.mapOperatorByFilterType = mapOperatorByFilterType;
    /**
     * Parse a date passed as a string and return a Date object (if valid)
     * @param string inputDateString
     * @returns string date formatted
     */
    function parseUtcDate(inputDateString, useUtc) {
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
    exports.parseUtcDate = parseUtcDate;
    /**
     * Converts a string to camel case
     * @param str the string to convert
     * @return the string in camel case
     */
    function toCamelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|[\s+\-_\/])/g, function (match, offset) {
            // remove white space or hypens or underscores
            if (/[\s+\-_\/]/.test(match)) {
                return '';
            }
            return offset === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }
    exports.toCamelCase = toCamelCase;
    /**
     * Converts a string to kebab (hypen) case
     * @param str the string to convert
     * @return the string in kebab case
     */
    function toKebabCase(str) {
        return toCamelCase(str).replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    exports.toKebabCase = toKebabCase;
    /**
     * Compares two arrays to determine if all the items are equal
     * @param a first array
     * @param b second array to compare with a
     * @param [orderMatters=false] flag if the order matters, if not arrays will be sorted
     * @return boolean true if equal, else false
     */
    function arraysEqual(a, b, orderMatters) {
        if (orderMatters === void 0) { orderMatters = false; }
        if (a === b) {
            return true;
        }
        if (a === null || b === null) {
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
    exports.arraysEqual = arraysEqual;
    /**
     * Uses the logic function to find an item in an array or returns the default
     * value provided (empty object by default)
     * @param any[] array the array to filter
     * @param function logic the logic to find the item
     * @param any [defaultVal={}] the default value to return
     * @return object the found object or deafult value
     */
    function findOrDefault(array, logic, defaultVal) {
        if (defaultVal === void 0) { defaultVal = {}; }
        return array.find(logic) || defaultVal;
    }
    exports.findOrDefault = findOrDefault;
});
//# sourceMappingURL=utilities.js.map