"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkboxFormatter_1 = require("./checkboxFormatter");
var checkmarkFormatter_1 = require("./checkmarkFormatter");
var dateIsoFormatter_1 = require("./dateIsoFormatter");
var dateTimeIsoAmPmFormatter_1 = require("./dateTimeIsoAmPmFormatter");
var dateTimeUsAmPmFormatter_1 = require("./dateTimeUsAmPmFormatter");
var dateTimeUsFormatter_1 = require("./dateTimeUsFormatter");
var dateUsFormatter_1 = require("./dateUsFormatter");
var percentCompleteBarFormatter_1 = require("./percentCompleteBarFormatter");
var percentCompleteFormatter_1 = require("./percentCompleteFormatter");
var progressBarFormatter_1 = require("./progressBarFormatter");
var yesNoFormatter_1 = require("./yesNoFormatter");
// import { Group, GroupTotals } from '../core'
// import { Item } from '../dataview'
/*
export interface GroupFormatter {
  (row: number, cell: number, value: any, columnDef: Column, dataContext: Group): string
}

export interface GroupTotalsFormatter {
  (row: number, cell: number, value: any, columnDef: Column, dataContext: GroupTotals): string
}
*/
exports.Formatters = {
    checkbox: checkboxFormatter_1.checkboxFormatter,
    checkmark: checkmarkFormatter_1.checkmarkFormatter,
    dateIso: dateIsoFormatter_1.dateIsoFormatter,
    dateTimeIso: dateIsoFormatter_1.dateIsoFormatter,
    dateTimeIsoAmPm: dateTimeIsoAmPmFormatter_1.dateTimeIsoAmPmFormatter,
    dateUs: dateUsFormatter_1.dateUsFormatter,
    dateTimeUs: dateTimeUsFormatter_1.dateTimeUsFormatter,
    dateTimeUsAmPm: dateTimeUsAmPmFormatter_1.dateTimeUsAmPmFormatter,
    percentComplete: percentCompleteFormatter_1.percentCompleteFormatter,
    percentCompleteBar: percentCompleteBarFormatter_1.percentCompleteBarFormatter,
    progressBar: progressBarFormatter_1.progressBarFormatter,
    yesNo: yesNoFormatter_1.yesNoFormatter
};
