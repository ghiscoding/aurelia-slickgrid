System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AvgAggregator;
    return {
        setters: [],
        execute: function () {
            AvgAggregator = /** @class */ (function () {
                function AvgAggregator(field) {
                    this._count = 0;
                    this._field = field;
                }
                AvgAggregator.prototype.init = function () {
                    this._count = 0;
                    this._nonNullCount = 0;
                    this._sum = 0;
                };
                AvgAggregator.prototype.accumulate = function (item) {
                    var val = (item && item.hasOwnProperty(this._field)) ? item[this._field] : null;
                    this._count++;
                    if (val != null && val !== '' && !isNaN(val)) {
                        this._nonNullCount++;
                        this._sum += parseFloat(val);
                    }
                };
                AvgAggregator.prototype.storeResult = function (groupTotals) {
                    if (!groupTotals.avg) {
                        groupTotals.avg = {};
                    }
                    if (this._nonNullCount !== 0) {
                        groupTotals.avg[this._field] = this._sum / this._nonNullCount;
                    }
                };
                return AvgAggregator;
            }());
            exports_1("AvgAggregator", AvgAggregator);
        }
    };
});
//# sourceMappingURL=avgAggregator.js.map