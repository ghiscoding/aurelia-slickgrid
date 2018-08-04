import { FieldType, OperatorType } from '../models/index';
/**
 * Simple function to which will loop and create as demanded the number of white spaces,
 * this will be used in the Excel export
 * @param int nbSpaces: number of white spaces to create
 */
export declare function addWhiteSpaces(nbSpaces: number): string;
/** HTML encode using jQuery */
export declare function htmlEncode(value: string): any;
/** HTML decode using jQuery */
export declare function htmlDecode(value: string): string;
/**
 * decode text into html entity
 * @param string text: input text
 * @param string text: output text
 */
export declare function htmlEntityDecode(input: string): string;
/**
 * decode text into html entity
 * @param string text: input text
 * @param string text: output text
 */
export declare function htmlEntityEncode(input: any): string;
/**
 * Take a number (or a string) and display it as a formatted decimal string with defined minimum and maximum decimals
 * @param input
 * @param minDecimal
 * @param maxDecimal
 */
export declare function decimalFormatted(input: number | string, minDecimal?: number, maxDecimal?: number): string | number;
/**
 * From a Date FieldType, return it's equivalent moment.js format
 * refer to moment.js for the format standard used: https://momentjs.com/docs/#/parsing/string-format/
 * @param fieldType
 */
export declare function mapMomentDateFormatWithFieldType(fieldType: FieldType): string;
/**
 * From a Date FieldType, return it's equivalent Flatpickr format
 * refer to Flatpickr for the format standard used: https://chmln.github.io/flatpickr/formatting/#date-formatting-tokens
 * also note that they seem very similar to PHP format (except for am/pm): http://php.net/manual/en/function.date.php
 * @param fieldType
 */
export declare function mapFlatpickrDateFormatWithFieldType(fieldType: FieldType): string;
/**
 * Mapper for query operators (ex.: <= is "le", > is "gt")
 * @param string operator
 * @returns string map
 */
export declare function mapOperatorType(operator: string): OperatorType;
/**
 * Mapper for query operator by a Field Type
 * For example a String should use "Contains" but a number should use "EQ" operator
 * @param operator
 * @returns string map
 */
export declare function mapOperatorByFieldType(fieldType: FieldType | string): OperatorType;
/**
 * Parse a date passed as a string and return a Date object (if valid)
 * @param string inputDateString
 * @returns string date formatted
 */
export declare function parseUtcDate(inputDateString: string, useUtc: boolean): string | null;
/**
 * Sanitize, return only the text without HTML tags
 * @input htmlString
 * @return text
 */
export declare function sanitizeHtmlToText(htmlString: string): string;
/**
 * Converts a string to camel case
 * @param str the string to convert
 * @return the string in camel case
 */
export declare function toCamelCase(str: string): string;
/**
 * Converts a string to kebab (hypen) case
 * @param str the string to convert
 * @return the string in kebab case
 */
export declare function toKebabCase(str: string): string;
/**
 * Compares two arrays to determine if all the items are equal
 * @param a first array
 * @param b second array to compare with a
 * @param [orderMatters=false] flag if the order matters, if not arrays will be sorted
 * @return boolean true if equal, else false
 */
export declare function arraysEqual(a: any[], b: any[], orderMatters?: boolean): boolean;
/**
 * Compares two objects to determine if all the properties are equal
 * We will do a deep check recursively to make sure all properties really are the same
 * @param x first object
 * @param y second object to compare with a
 */
export declare function objectsDeepEqual(x: any, y: any): boolean;
/**
 * Uses the logic function to find an item in an array or returns the default
 * value provided (empty object by default)
 * @param any[] array the array to filter
 * @param function logic the logic to find the item
 * @param any [defaultVal={}] the default value to return
 * @return object the found object or deafult value
 */
export declare function findOrDefault(array: any[], logic: (item: any) => boolean, defaultVal?: {}): any;
