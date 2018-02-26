"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Group, GroupTotals } from '../core'
// import { Item } from '../dataview'
var arrayToCsvFormatter_1 = require("./arrayToCsvFormatter");
var checkboxFormatter_1 = require("./checkboxFormatter");
var checkmarkFormatter_1 = require("./checkmarkFormatter");
var complexObjectFormatter_1 = require("./complexObjectFormatter");
var dateIsoFormatter_1 = require("./dateIsoFormatter");
var dateTimeIsoAmPmFormatter_1 = require("./dateTimeIsoAmPmFormatter");
var dateTimeUsAmPmFormatter_1 = require("./dateTimeUsAmPmFormatter");
var dateTimeUsFormatter_1 = require("./dateTimeUsFormatter");
var dateUsFormatter_1 = require("./dateUsFormatter");
var deleteIconFormatter_1 = require("./deleteIconFormatter");
var editIconFormatter_1 = require("./editIconFormatter");
var hyperlinkFormatter_1 = require("./hyperlinkFormatter");
var infoIconFormatter_1 = require("./infoIconFormatter");
var lowercaseFormatter_1 = require("./lowercaseFormatter");
var multipleFormatter_1 = require("./multipleFormatter");
var percentCompleteFormatter_1 = require("./percentCompleteFormatter");
var percentCompleteBarFormatter_1 = require("./percentCompleteBarFormatter");
var progressBarFormatter_1 = require("./progressBarFormatter");
var translateFormatter_1 = require("./translateFormatter");
var translateBooleanFormatter_1 = require("./translateBooleanFormatter");
var uppercaseFormatter_1 = require("./uppercaseFormatter");
var yesNoFormatter_1 = require("./yesNoFormatter");
/*
export interface GroupFormatter {
  (row: number, cell: number, value: any, columnDef: Column, dataContext: Group): string
}
export interface GroupTotalsFormatter {
  (row: number, cell: number, value: any, columnDef: Column, dataContext: GroupTotals): string
}
*/
/** Provides a list of different Formatters that will change the cell value displayed in the UI */
exports.Formatters = {
    /** Takes an array of string and converts it to a comma delimited string */
    arrayToCsv: arrayToCsvFormatter_1.arrayToCsvFormatter,
    /** When value is filled (true), it will display a checkbox Unicode icon */
    checkbox: checkboxFormatter_1.checkboxFormatter,
    /** When value is filled (true), it will display a Font-Awesome icon (fa-check) */
    checkmark: checkmarkFormatter_1.checkmarkFormatter,
    /** Takes a complex data object and return the data under that property (for example: "user.firstName" will return the first name "John") */
    complexObject: complexObjectFormatter_1.complexObjectFormatter,
    /** Takes a Date object and displays it as an ISO Date format */
    dateIso: dateIsoFormatter_1.dateIsoFormatter,
    /** Takes a Date object and displays it as an ISO Date+Time format */
    dateTimeIso: dateIsoFormatter_1.dateIsoFormatter,
    /** Takes a Date object and displays it as an ISO Date+Time+(am/pm) format */
    dateTimeIsoAmPm: dateTimeIsoAmPmFormatter_1.dateTimeIsoAmPmFormatter,
    /** Takes a Date object and displays it as an US Date format */
    dateUs: dateUsFormatter_1.dateUsFormatter,
    /** Takes a Date object and displays it as an US Date+Time format */
    dateTimeUs: dateTimeUsFormatter_1.dateTimeUsFormatter,
    /** Takes a Date object and displays it as an US Date+Time+(am/pm) format */
    dateTimeUsAmPm: dateTimeUsAmPmFormatter_1.dateTimeUsAmPmFormatter,
    /** Displays a Font-Awesome delete icon (fa-trash) */
    deleteIcon: deleteIconFormatter_1.deleteIconFormatter,
    /** Displays a Font-Awesome edit icon (fa-pencil) */
    editIcon: editIconFormatter_1.editIconFormatter,
    /** Takes a cell value and transforms it into an hyperlink, given that the value starts with 1 of these (http|ftp|https) */
    hyperlink: hyperlinkFormatter_1.hyperlinkFormatter,
    /** Displays a Font-Awesome edit icon (fa-info-circle) */
    infoIcon: infoIconFormatter_1.infoIconFormatter,
    /** Takes a value and displays it all lowercase */
    lowercase: lowercaseFormatter_1.lowercaseFormatter,
    /**
     * You can pipe multiple formatters (executed in sequence), use params to pass the list of formatters. For example::
     * { field: 'title', formatter: Formatters.multiple, params: { formatters: [ Formatters.lowercase, Formatters.uppercase ] }
     */
    multiple: multipleFormatter_1.multipleFormatter,
    /** Takes a cell value number (between 0-100) and displays a red (<50) or green (>=50) bar */
    percentComplete: percentCompleteFormatter_1.percentCompleteFormatter,
    /** Takes a cell value number (between 0-100) and displays Bootstrap "percent-complete-bar" a red (<30), silver (>30 & <70) or green (>=70) bar */
    percentCompleteBar: percentCompleteBarFormatter_1.percentCompleteBarFormatter,
    /** Takes a cell value number (between 0-100) and displays Bootstrap "progress-bar" a red (<30), silver (>30 & <70) or green (>=70) bar */
    progressBar: progressBarFormatter_1.progressBarFormatter,
    /** Takes a cell value and translates it (i18n). Requires an instance of the Translate Service:: `params: { i18n: this.translate } */
    translate: translateFormatter_1.translateFormatter,
    /** Takes a boolean value, cast it to upperCase string and finally translates it (i18n). */
    translateBoolean: translateBooleanFormatter_1.translateBooleanFormatter,
    /** Takes a value and displays it all uppercase */
    uppercase: uppercaseFormatter_1.uppercaseFormatter,
    /** Takes a boolean value and display a string 'Yes' or 'No' */
    yesNo: yesNoFormatter_1.yesNoFormatter
};
//# sourceMappingURL=index.js.map