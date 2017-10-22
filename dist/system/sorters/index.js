System.register(["./dateUsShortSorter", "./dateSorter", "./dateIsoSorter", "./dateUsSorter", "./numericSorter", "./stringSorter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dateUsShortSorter_1, dateSorter_1, dateIsoSorter_1, dateUsSorter_1, numericSorter_1, stringSorter_1, Sorters;
    return {
        setters: [
            function (dateUsShortSorter_1_1) {
                dateUsShortSorter_1 = dateUsShortSorter_1_1;
            },
            function (dateSorter_1_1) {
                dateSorter_1 = dateSorter_1_1;
            },
            function (dateIsoSorter_1_1) {
                dateIsoSorter_1 = dateIsoSorter_1_1;
            },
            function (dateUsSorter_1_1) {
                dateUsSorter_1 = dateUsSorter_1_1;
            },
            function (numericSorter_1_1) {
                numericSorter_1 = numericSorter_1_1;
            },
            function (stringSorter_1_1) {
                stringSorter_1 = stringSorter_1_1;
            }
        ],
        execute: function () {
            exports_1("Sorters", Sorters = {
                date: dateSorter_1.dateSorter,
                dateIso: dateIsoSorter_1.dateIsoSorter,
                dateUs: dateUsSorter_1.dateUsSorter,
                dateUsShort: dateUsShortSorter_1.dateUsShortSorter,
                numeric: numericSorter_1.numericSorter,
                string: stringSorter_1.stringSorter
            });
        }
    };
});
//# sourceMappingURL=index.js.map