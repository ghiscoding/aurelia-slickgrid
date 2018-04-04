define(["require", "exports", "./avgTotalsPercentageFormatter", "./avgTotalsDollarFormatter", "./avgTotalsFormatter", "./minTotalsFormatter", "./maxTotalsFormatter", "./sumTotalsColoredFormatter", "./sumTotalsDollarColoredBoldFormatter", "./sumTotalsDollarColoredFormatter", "./sumTotalsDollarBoldFormatter", "./sumTotalsDollarFormatter", "./sumTotalsFormatter", "./sumTotalsBoldFormatter"], function (require, exports, avgTotalsPercentageFormatter_1, avgTotalsDollarFormatter_1, avgTotalsFormatter_1, minTotalsFormatter_1, maxTotalsFormatter_1, sumTotalsColoredFormatter_1, sumTotalsDollarColoredBoldFormatter_1, sumTotalsDollarColoredFormatter_1, sumTotalsDollarBoldFormatter_1, sumTotalsDollarFormatter_1, sumTotalsFormatter_1, sumTotalsBoldFormatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** Provides a list of different Formatters that will change the cell value displayed in the UI */
    exports.GroupTotalFormatters = {
        /**
         * Average all the column totals
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g.: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        avgTotals: avgTotalsFormatter_1.avgTotalsFormatter,
        /**
         * Average all the column totals and display '$' at the end of the value
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g.: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        avgTotalsDollar: avgTotalsDollarFormatter_1.avgTotalsDollarFormatter,
        /**
         * Average all the column totals and display '%' at the end of the value
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g.: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        avgTotalsPercentage: avgTotalsPercentageFormatter_1.avgTotalsPercentageFormatter,
        /**
         * Show max value of all the column totals
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g.: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        maxTotals: maxTotalsFormatter_1.maxTotalsFormatter,
        /**
         * Show min value of all the column totals
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g.: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        minTotals: minTotalsFormatter_1.minTotalsFormatter,
        /**
         * Sums up all the column totals
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g.: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        sumTotals: sumTotalsFormatter_1.sumTotalsFormatter,
        /**
         * Sums up all the column totals and display it in bold font weight
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        sumTotalsBold: sumTotalsBoldFormatter_1.sumTotalsBoldFormatter,
        /**
         * Sums up all the column totals, change color of text to red/green on negative/positive value
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        sumTotalsColored: sumTotalsColoredFormatter_1.sumTotalsColoredFormatter,
        /**
         * Sums up all the column totals and display dollar sign
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        sumTotalsDollar: sumTotalsDollarFormatter_1.sumTotalsDollarFormatter,
        /**
         * Sums up all the column totals and display dollar sign and show it in bold font weight
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        sumTotalsDollarBold: sumTotalsDollarBoldFormatter_1.sumTotalsDollarBoldFormatter,
        /**
         * Sums up all the column totals, change color of text to red/green on negative/positive value
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        sumTotalsDollarColored: sumTotalsDollarColoredFormatter_1.sumTotalsDollarColoredFormatter,
        /**
         * Sums up all the column totals, change color of text to red/green on negative/positive value, show it in bold font weight as well
         * Extra options available in "params":: "groupFormatterPrefix" and "groupFormatterSuffix", e.g: params: { groupFormatterPrefix: '<i>Total</i>: ', groupFormatterSuffix: '$' }
         */
        sumTotalsDollarColoredBold: sumTotalsDollarColoredBoldFormatter_1.sumTotalsDollarColoredBoldFormatter,
    };
});
//# sourceMappingURL=index.js.map