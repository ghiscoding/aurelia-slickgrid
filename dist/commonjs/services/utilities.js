"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../models/index");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/first");
require("rxjs/add/operator/take");
require("rxjs/add/operator/toPromise");
var moment = require("moment");
/**
 * Try casting an input of type Promise | Observable into a Promise type.
 * @param input object which could be of type Promise or Observable
 * @param fromServiceName string representing the caller service name and will be used if we throw a casting problem error
 */
function castToPromise(input, fromServiceName) {
    if (fromServiceName === void 0) { fromServiceName = ''; }
    var promise = input;
    if (input instanceof Promise) {
        // if it's already a Promise then return it
        return input;
    }
    else if (input instanceof Observable_1.Observable) {
        promise = input.first().toPromise();
        if (!(promise instanceof Promise)) {
            promise = input.take(1).toPromise();
        }
        if (!(promise instanceof Promise)) {
            throw new Error("Something went wrong, Angular-Slickgrid " + fromServiceName + " is not able to convert the Observable into a Promise.\n        If you are using Angular HttpClient, you could try converting your http call to a Promise with \".toPromise()\"\n        for example::  this.http.post('graphql', { query: graphqlQuery }).toPromise()\n        ");
        }
    }
    return promise;
}
exports.castToPromise = castToPromise;
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
        case index_1.FieldType.dateTimeUsAM_PM:
            map = 'M/D/YY h:m:s A';
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
            map = 'm/d/Y h:i:S K';
            break;
        case index_1.FieldType.dateTimeUsShort:
            map = 'M/D/YY H:i:s';
            break;
        case index_1.FieldType.dateTimeUsShortAmPm:
            map = 'M/D/YY h:i:s K'; // there is no lowercase in Flatpickr :(
            break;
        case index_1.FieldType.dateTimeUsAM_PM:
            map = 'M/D/YY h:i:s K';
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
            map = index_1.OperatorType.equal;
            break;
        default:
            map = index_1.OperatorType.contains;
            break;
    }
    return map;
}
exports.mapOperatorType = mapOperatorType;
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
//# sourceMappingURL=utilities.js.map