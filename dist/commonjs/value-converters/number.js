"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NumberValueConverter = /** @class */ (function () {
    function NumberValueConverter() {
    }
    NumberValueConverter.prototype.fromView = function (value, format) {
        var number = parseFloat(value);
        return isNaN(number) ? value : number;
    };
    return NumberValueConverter;
}());
exports.NumberValueConverter = NumberValueConverter;
//# sourceMappingURL=number.js.map