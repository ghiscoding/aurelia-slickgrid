var AsgNumberValueConverter = /** @class */ (function () {
    function AsgNumberValueConverter() {
    }
    AsgNumberValueConverter.prototype.fromView = function (value, format) {
        var number = parseFloat(value);
        return isNaN(number) ? value : number;
    };
    return AsgNumberValueConverter;
}());
export { AsgNumberValueConverter };
//# sourceMappingURL=asgNumber.js.map