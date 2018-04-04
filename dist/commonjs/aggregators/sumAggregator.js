"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SumAggregator = /** @class */ (function () {
    function SumAggregator(field) {
        this._sum = 0;
        this._field = field;
    }
    SumAggregator.prototype.init = function () {
        this._sum = 0;
    };
    SumAggregator.prototype.accumulate = function (item) {
        var val = (item && item.hasOwnProperty(this._field)) ? item[this._field] : null;
        if (val != null && val !== '' && !isNaN(val)) {
            this._sum += parseFloat(val);
        }
    };
    SumAggregator.prototype.storeResult = function (groupTotals) {
        if (!groupTotals.sum) {
            groupTotals.sum = {};
        }
        groupTotals.sum[this._field] = this._sum;
    };
    return SumAggregator;
}());
exports.SumAggregator = SumAggregator;
//# sourceMappingURL=sumAggregator.js.map