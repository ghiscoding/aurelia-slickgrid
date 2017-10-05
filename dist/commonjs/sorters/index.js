"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateUsShortSorter_1 = require("./dateUsShortSorter");
var dateSorter_1 = require("./dateSorter");
var dateIsoSorter_1 = require("./dateIsoSorter");
var dateUsSorter_1 = require("./dateUsSorter");
var numericSorter_1 = require("./numericSorter");
var stringSorter_1 = require("./stringSorter");
exports.Sorters = {
    date: dateSorter_1.dateSorter,
    dateIso: dateIsoSorter_1.dateIsoSorter,
    dateUs: dateUsSorter_1.dateUsSorter,
    dateUsShort: dateUsShortSorter_1.dateUsShortSorter,
    numeric: numericSorter_1.numericSorter,
    string: stringSorter_1.stringSorter
};
