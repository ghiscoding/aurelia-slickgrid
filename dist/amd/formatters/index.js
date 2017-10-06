define(["require", "exports", "./checkboxFormatter", "./checkmarkFormatter", "./dateIsoFormatter", "./dateTimeIsoAmPmFormatter", "./dateTimeUsAmPmFormatter", "./dateTimeUsFormatter", "./dateUsFormatter", "./percentCompleteFormatter", "./percentCompleteBarFormatter", "./progressBarFormatter", "./yesNoFormatter"], function (require, exports, checkboxFormatter_1, checkmarkFormatter_1, dateIsoFormatter_1, dateTimeIsoAmPmFormatter_1, dateTimeUsAmPmFormatter_1, dateTimeUsFormatter_1, dateUsFormatter_1, percentCompleteFormatter_1, percentCompleteBarFormatter_1, progressBarFormatter_1, yesNoFormatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
});
