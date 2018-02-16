System.register(["../models/index", "moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * From a Date FieldType, return it's equivalent moment.js format
     * refer to moment.js for the format standard used: https://momentjs.com/docs/#/parsing/string-format/
     * @param {FieldType} fieldType
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
    exports_1("mapMomentDateFormatWithFieldType", mapMomentDateFormatWithFieldType);
    /**
     * From a Date FieldType, return it's equivalent Flatpickr format
     * refer to Flatpickr for the format standard used: https://chmln.github.io/flatpickr/formatting/#date-formatting-tokens
     * also note that they seem very similar to PHP format (except for am/pm): http://php.net/manual/en/function.date.php
     * @param {FieldType} fieldType
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
    exports_1("mapFlatpickrDateFormatWithFieldType", mapFlatpickrDateFormatWithFieldType);
    /**
     * Mapper for mathematical operators (ex.: <= is "le", > is "gt")
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
    exports_1("mapOperatorType", mapOperatorType);
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
    exports_1("parseUtcDate", parseUtcDate);
    /**
     * Converts a string to camel case
     * @param {string} str the string to convert
     * @return {string} the string in camel case
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
    exports_1("toCamelCase", toCamelCase);
    /**
     * Converts a string to kabab (hypen) case
     * @param {string} str the string to convert
     * @return {string} the string in kabab case
     */
    function toKababCase(str) {
        return toCamelCase(str).replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    exports_1("toKababCase", toKababCase);
    var index_1, moment;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=utilities.js.map