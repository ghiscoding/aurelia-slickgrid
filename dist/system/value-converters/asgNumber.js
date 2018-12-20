System.register([], function (exports_1, context_1) {
    "use strict";
    var AsgNumberValueConverter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            AsgNumberValueConverter = /** @class */ (function () {
                function AsgNumberValueConverter() {
                }
                AsgNumberValueConverter.prototype.fromView = function (value, format) {
                    var number = parseFloat(value);
                    return isNaN(number) ? value : number;
                };
                return AsgNumberValueConverter;
            }());
            exports_1("AsgNumberValueConverter", AsgNumberValueConverter);
        }
    };
});
//# sourceMappingURL=asgNumber.js.map