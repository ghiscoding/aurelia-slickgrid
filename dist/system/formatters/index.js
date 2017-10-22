System.register(["./checkboxFormatter", "./checkmarkFormatter", "./dateIsoFormatter", "./dateTimeIsoAmPmFormatter", "./dateTimeUsAmPmFormatter", "./dateTimeUsFormatter", "./dateUsFormatter", "./percentCompleteFormatter", "./percentCompleteBarFormatter", "./progressBarFormatter", "./yesNoFormatter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var checkboxFormatter_1, checkmarkFormatter_1, dateIsoFormatter_1, dateTimeIsoAmPmFormatter_1, dateTimeUsAmPmFormatter_1, dateTimeUsFormatter_1, dateUsFormatter_1, percentCompleteFormatter_1, percentCompleteBarFormatter_1, progressBarFormatter_1, yesNoFormatter_1, Formatters;
    return {
        setters: [
            function (checkboxFormatter_1_1) {
                checkboxFormatter_1 = checkboxFormatter_1_1;
            },
            function (checkmarkFormatter_1_1) {
                checkmarkFormatter_1 = checkmarkFormatter_1_1;
            },
            function (dateIsoFormatter_1_1) {
                dateIsoFormatter_1 = dateIsoFormatter_1_1;
            },
            function (dateTimeIsoAmPmFormatter_1_1) {
                dateTimeIsoAmPmFormatter_1 = dateTimeIsoAmPmFormatter_1_1;
            },
            function (dateTimeUsAmPmFormatter_1_1) {
                dateTimeUsAmPmFormatter_1 = dateTimeUsAmPmFormatter_1_1;
            },
            function (dateTimeUsFormatter_1_1) {
                dateTimeUsFormatter_1 = dateTimeUsFormatter_1_1;
            },
            function (dateUsFormatter_1_1) {
                dateUsFormatter_1 = dateUsFormatter_1_1;
            },
            function (percentCompleteFormatter_1_1) {
                percentCompleteFormatter_1 = percentCompleteFormatter_1_1;
            },
            function (percentCompleteBarFormatter_1_1) {
                percentCompleteBarFormatter_1 = percentCompleteBarFormatter_1_1;
            },
            function (progressBarFormatter_1_1) {
                progressBarFormatter_1 = progressBarFormatter_1_1;
            },
            function (yesNoFormatter_1_1) {
                yesNoFormatter_1 = yesNoFormatter_1_1;
            }
        ],
        execute: function () {
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
            exports_1("Formatters", Formatters = {
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
            });
        }
    };
});
//# sourceMappingURL=index.js.map