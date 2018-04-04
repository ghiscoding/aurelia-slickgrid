System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SortDirectionNumber;
    return {
        setters: [],
        execute: function () {
            (function (SortDirectionNumber) {
                SortDirectionNumber[SortDirectionNumber["asc"] = 1] = "asc";
                SortDirectionNumber[SortDirectionNumber["desc"] = -1] = "desc";
                SortDirectionNumber[SortDirectionNumber["neutral"] = 0] = "neutral";
            })(SortDirectionNumber || (SortDirectionNumber = {}));
            exports_1("SortDirectionNumber", SortDirectionNumber);
        }
    };
});
//# sourceMappingURL=sortDirectionNumber.enum.js.map