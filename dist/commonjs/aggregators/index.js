"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var avgAggregator_1 = require("./avgAggregator");
var minAggregator_1 = require("./minAggregator");
var maxAggregator_1 = require("./maxAggregator");
var sumAggregator_1 = require("./sumAggregator");
/** Provides a list of different Aggregators for the Group Formatter */
exports.Aggregators = {
    Avg: avgAggregator_1.AvgAggregator,
    Min: minAggregator_1.MinAggregator,
    Max: maxAggregator_1.MaxAggregator,
    Sum: sumAggregator_1.SumAggregator
};
//# sourceMappingURL=index.js.map