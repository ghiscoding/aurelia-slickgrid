var MaxAggregator = /** @class */ (function () {
    function MaxAggregator(field) {
        this._field = field;
    }
    MaxAggregator.prototype.init = function () {
        this._max = null;
    };
    MaxAggregator.prototype.accumulate = function (item) {
        var val = (item && item.hasOwnProperty(this._field)) ? item[this._field] : null;
        if (val != null && val !== '' && !isNaN(val)) {
            if (this._max == null || val > this._max) {
                this._max = val;
            }
        }
    };
    MaxAggregator.prototype.storeResult = function (groupTotals) {
        if (!groupTotals.max) {
            groupTotals.max = {};
        }
        groupTotals.max[this._field] = this._max;
    };
    return MaxAggregator;
}());
export { MaxAggregator };
//# sourceMappingURL=maxAggregator.js.map