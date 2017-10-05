"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numericSorter = function (value1, value2, sortDirection) {
    var x = (isNaN(value1) || value1 === '' || value1 === null) ? -99e+10 : parseFloat(value1);
    var y = (isNaN(value2) || value2 === '' || value2 === null) ? -99e+10 : parseFloat(value2);
    return sortDirection * (x === y ? 0 : (x > y ? 1 : -1));
};
