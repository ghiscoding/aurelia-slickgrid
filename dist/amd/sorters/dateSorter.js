define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dateSorter = function (value1, value2, sortDirection) {
        if (!moment(value1, moment.ISO_8601).isValid() || !moment(value2, moment.ISO_8601, true).isValid()) {
            return 0;
        }
        var date1 = moment(value1);
        var date2 = moment(value2);
        var diff = parseInt(date1.format('X'), 10) - parseInt(date2.format('X'), 10);
        return sortDirection * (diff === 0 ? 0 : (diff > 0 ? 1 : -1));
    };
});
