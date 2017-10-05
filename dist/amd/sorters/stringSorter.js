define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringSorter = function (value1, value2, sortDirection) {
        return sortDirection * (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1));
    };
});
