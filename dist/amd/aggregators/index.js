define(["require", "exports", "./avgAggregator", "./minAggregator", "./maxAggregator", "./sumAggregator"], function (require, exports, avgAggregator_1, minAggregator_1, maxAggregator_1, sumAggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** Provides a list of different Aggregators for the Group Formatter */
    exports.Aggregators = {
        Avg: avgAggregator_1.AvgAggregator,
        Min: minAggregator_1.MinAggregator,
        Max: maxAggregator_1.MaxAggregator,
        Sum: sumAggregator_1.SumAggregator
    };
});
//# sourceMappingURL=index.js.map