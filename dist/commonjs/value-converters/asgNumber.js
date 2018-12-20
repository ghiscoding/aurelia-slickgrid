"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AsgNumberValueConverter = /** @class */ (function () {
    function AsgNumberValueConverter() {
    }
    AsgNumberValueConverter.prototype.fromView = function (value, format) {
        var number = parseFloat(value);
        return isNaN(number) ? value : number;
    };
    return AsgNumberValueConverter;
}());
exports.AsgNumberValueConverter = AsgNumberValueConverter;
//# sourceMappingURL=asgNumber.js.map