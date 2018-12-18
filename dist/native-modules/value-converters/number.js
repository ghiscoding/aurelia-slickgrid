var NumberValueConverter = /** @class */ (function () {
    function NumberValueConverter() {
    }
    NumberValueConverter.prototype.fromView = function (value, format) {
        var number = parseFloat(value);
        return isNaN(number) ? value : number;
    };
    return NumberValueConverter;
}());
export { NumberValueConverter };
//# sourceMappingURL=number.js.map