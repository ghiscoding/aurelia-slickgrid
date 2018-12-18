System.register([], function (exports_1, context_1) {
    "use strict";
    var NumberValueConverter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            NumberValueConverter = /** @class */ (function () {
                function NumberValueConverter() {
                }
                NumberValueConverter.prototype.fromView = function (value, format) {
                    var number = parseFloat(value);
                    return isNaN(number) ? value : number;
                };
                return NumberValueConverter;
            }());
            exports_1("NumberValueConverter", NumberValueConverter);
        }
    };
});
//# sourceMappingURL=number.js.map