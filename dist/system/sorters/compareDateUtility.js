System.register(["moment"], function (exports_1, context_1) {
    "use strict";
    var moment;
    var __moduleName = context_1 && context_1.id;
    function compareDates(value1, value2, sortDirection, format, strict) {
        var diff = 0;
        if (value1 === null || value1 === '' || !moment(value1, format, strict).isValid()) {
            diff = -1;
        }
        else if (value2 === null || value2 === '' || !moment(value2, format, strict).isValid()) {
            diff = 1;
        }
        else {
            var date1 = moment(value1, format, strict);
            var date2 = moment(value2, format, strict);
            diff = parseInt(date1.format('X'), 10) - parseInt(date2.format('X'), 10);
        }
        return sortDirection * (diff === 0 ? 0 : (diff > 0 ? 1 : -1));
    }
    exports_1("compareDates", compareDates);
    return {
        setters: [
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=compareDateUtility.js.map