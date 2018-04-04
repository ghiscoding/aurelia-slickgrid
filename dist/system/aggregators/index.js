System.register(["./avgAggregator", "./minAggregator", "./maxAggregator", "./sumAggregator"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var avgAggregator_1, minAggregator_1, maxAggregator_1, sumAggregator_1, Aggregators;
    return {
        setters: [
            function (avgAggregator_1_1) {
                avgAggregator_1 = avgAggregator_1_1;
            },
            function (minAggregator_1_1) {
                minAggregator_1 = minAggregator_1_1;
            },
            function (maxAggregator_1_1) {
                maxAggregator_1 = maxAggregator_1_1;
            },
            function (sumAggregator_1_1) {
                sumAggregator_1 = sumAggregator_1_1;
            }
        ],
        execute: function () {
            /** Provides a list of different Aggregators for the Group Formatter */
            exports_1("Aggregators", Aggregators = {
                Avg: avgAggregator_1.AvgAggregator,
                Min: minAggregator_1.MinAggregator,
                Max: maxAggregator_1.MaxAggregator,
                Sum: sumAggregator_1.SumAggregator
            });
        }
    };
});
//# sourceMappingURL=index.js.map