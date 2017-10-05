define(["require", "exports", "./dateUsShortSorter", "./dateSorter", "./dateIsoSorter", "./dateUsSorter", "./numericSorter", "./stringSorter"], function (require, exports, dateUsShortSorter_1, dateSorter_1, dateIsoSorter_1, dateUsSorter_1, numericSorter_1, stringSorter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sorters = {
        date: dateSorter_1.dateSorter,
        dateIso: dateIsoSorter_1.dateIsoSorter,
        dateUs: dateUsSorter_1.dateUsSorter,
        dateUsShort: dateUsShortSorter_1.dateUsShortSorter,
        numeric: numericSorter_1.numericSorter,
        string: stringSorter_1.stringSorter
    };
});
