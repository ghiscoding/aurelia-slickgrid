define(["require", "exports", "./arrayToCsvFormatter", "./checkboxFormatter", "./checkmarkFormatter", "./complexObjectFormatter", "./dateIsoFormatter", "./dateTimeIsoAmPmFormatter", "./dateTimeUsAmPmFormatter", "./dateTimeUsFormatter", "./dateUsFormatter", "./deleteIconFormatter", "./editIconFormatter", "./hyperlinkFormatter", "./lowercaseFormatter", "./multipleFormatter", "./percentCompleteFormatter", "./percentCompleteBarFormatter", "./progressBarFormatter", "./translateFormatter", "./uppercaseFormatter", "./yesNoFormatter"], function (require, exports, arrayToCsvFormatter_1, checkboxFormatter_1, checkmarkFormatter_1, complexObjectFormatter_1, dateIsoFormatter_1, dateTimeIsoAmPmFormatter_1, dateTimeUsAmPmFormatter_1, dateTimeUsFormatter_1, dateUsFormatter_1, deleteIconFormatter_1, editIconFormatter_1, hyperlinkFormatter_1, lowercaseFormatter_1, multipleFormatter_1, percentCompleteFormatter_1, percentCompleteBarFormatter_1, progressBarFormatter_1, translateFormatter_1, uppercaseFormatter_1, yesNoFormatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        lowercase: lowercaseFormatter_1.lowercaseFormatter,
        multiple: multipleFormatter_1.multipleFormatter,
        percentComplete: percentCompleteFormatter_1.percentCompleteFormatter,
        percentCompleteBar: percentCompleteBarFormatter_1.percentCompleteBarFormatter,
        progressBar: progressBarFormatter_1.progressBarFormatter,
        translate: translateFormatter_1.translateFormatter,
        uppercase: uppercaseFormatter_1.uppercaseFormatter,
        yesNo: yesNoFormatter_1.yesNoFormatter
    };
});
//# sourceMappingURL=index.js.map