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
exports.Formatters = {
    arrayToCsv: arrayToCsvFormatter_1.arrayToCsvFormatter,
    checkbox: checkboxFormatter_1.checkboxFormatter,
    checkmark: checkmarkFormatter_1.checkmarkFormatter,
    complexObject: complexObjectFormatter_1.complexObjectFormatter,
    dateIso: dateIsoFormatter_1.dateIsoFormatter,
    dateTimeIso: dateIsoFormatter_1.dateIsoFormatter,
    dateTimeIsoAmPm: dateTimeIsoAmPmFormatter_1.dateTimeIsoAmPmFormatter,
    dateUs: dateUsFormatter_1.dateUsFormatter,
    dateTimeUs: dateTimeUsFormatter_1.dateTimeUsFormatter,
    dateTimeUsAmPm: dateTimeUsAmPmFormatter_1.dateTimeUsAmPmFormatter,
    deleteIcon: deleteIconFormatter_1.deleteIconFormatter,
    editIcon: editIconFormatter_1.editIconFormatter,
    hyperlink: hyperlinkFormatter_1.hyperlinkFormatter,
    infoIcon: infoIconFormatter_1.infoIconFormatter,
    lowercase: lowercaseFormatter_1.lowercaseFormatter,
    multiple: multipleFormatter_1.multipleFormatter,
    percentComplete: percentCompleteFormatter_1.percentCompleteFormatter,
    percentCompleteBar: percentCompleteBarFormatter_1.percentCompleteBarFormatter,
    progressBar: progressBarFormatter_1.progressBarFormatter,
    translate: translateFormatter_1.translateFormatter,
    uppercase: uppercaseFormatter_1.uppercaseFormatter,
    yesNo: yesNoFormatter_1.yesNoFormatter
};
//# sourceMappingURL=index.js.map