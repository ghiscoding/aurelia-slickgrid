define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MinAggregator = /** @class */ (function () {
        function MinAggregator(field) {
            this._field = field;
        }
        MinAggregator.prototype.init = function () {
            this._min = null;
        };
        MinAggregator.prototype.accumulate = function (item) {
            var val = (item && item.hasOwnProperty(this._field)) ? item[this._field] : null;
            if (val != null && val !== '' && !isNaN(val)) {
                if (this._min == null || val < this._min) {
                    this._min = val;
                }
            }
        };
        MinAggregator.prototype.storeResult = function (groupTotals) {
            if (!groupTotals.min) {
                groupTotals.min = {};
            }
            groupTotals.min[this._field] = this._min;
        };
        return MinAggregator;
    }());
    exports.MinAggregator = MinAggregator;
});
//# sourceMappingURL=minAggregator.js.map