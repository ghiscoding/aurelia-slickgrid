import { FieldType, OperatorType } from '../models/index';
import * as moment from 'moment';

/**
 * Simple function to which will loop and create as demanded the number of white spaces,
 * this will be used in the Excel export
 * @param int nbSpaces: number of white spaces to create
 */
export function addWhiteSpaces(nbSpaces: number): string {
  let result = '';

  for (let i = 0; i < nbSpaces; i++) {
    result += ' ';
  }
  return result;
}

/**
 * decode text into html entity
 * @param string text: input text
 * @param string text: output text
 */
export function htmlEntityDecode(input: string): string {
  return input.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });
}

/**
 * decode text into html entity
 * @param string text: input text
 * @param string text: output text
 */
export function htmlEntityEncode(input: any): string {
  const buf = [];
  for (let i = input.length - 1; i >= 0; i--) {
    buf.unshift(['&#', input[i].charCodeAt(), ';'].join(''));
  }
  return buf.join('');
}

/**
 * From a Date FieldType, return it's equivalent moment.js format
 * refer to moment.js for the format standard used: https://momentjs.com/docs/#/parsing/string-format/
 * @param fieldType
 */
export function mapMomentDateFormatWithFieldType(fieldType: FieldType): string {
  let map: string;
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
export function mapFlatpickrDateFormatWithFieldType(fieldType: FieldType): string {
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
  let map: string;
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
      map = 'M/D/YY';
      break;
    case FieldType.dateTimeUs:
      map = 'm/d/Y H:i:S';
      break;
    case FieldType.dateTimeUsAmPm:
      map = 'm/d/Y h:i:S K'; // there is no lowercase in Flatpickr :(
      break;
    case FieldType.dateTimeUsAM_PM:
      map = 'M/D/YY h:i:s K';
      break;
    case FieldType.dateTimeUsShort:
      map = 'M/D/YY H:i:s';
      break;
    case FieldType.dateTimeUsShortAmPm:
      map = 'M/D/YY h:i:s K'; // there is no lowercase in Flatpickr :(
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
 * Mapper for mathematical operators (ex.: <= is "le", > is "gt")
 * @param string operator
 * @returns string map
 */
export function mapOperatorType(operator: string): OperatorType {
  let map: OperatorType;
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
 * Parse a date passed as a string and return a Date object (if valid)
 * @param string inputDateString
 * @returns string date formatted
 */
export function parseUtcDate(inputDateString: string, useUtc: boolean): string | null {
  let date = null;

  if (/^[0-9\-\/]*$/.test(inputDateString)) {
    // get the UTC datetime with moment.js but we need to decode the value so that it's valid text
    const dateString = decodeURIComponent(inputDateString);
    const dateMoment = moment(new Date(dateString));
    if (dateMoment.isValid() && dateMoment.year().toString().length === 4) {
      date = (useUtc) ? dateMoment.utc().format() : dateMoment.format();
    }
  }

  return date;
}

/**
 * Converts a string to camel case
 * @param str the string to convert
 * @return the string in camel case
 */
export function toCamelCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w|[\s+\-_\/])/g, (match: string, offset: number) => {
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
export function toKebabCase(str: string): string {
  return toCamelCase(str).replace(/([A-Z])/g, '-$1').toLowerCase();
}
