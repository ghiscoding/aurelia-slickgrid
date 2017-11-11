System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testFilterCondition;
    return {
        setters: [],
        execute: function () {
            exports_1("testFilterCondition", testFilterCondition = function (operator, value1, value2) {
                switch (operator) {
                    case '<': return (value1 < value2);
                    case '<=': return (value1 <= value2);
                    case '>': return (value1 > value2);
                    case '>=': return (value1 >= value2);
                    case '!=':
                    case '<>': return (value1 !== value2);
                    case '=':
                    case '==': return (value1 === value2);
                }
                return true;
            });
        }
    };
});
//# sourceMappingURL=filterUtilities.js.map