System.register(["./booleanFilterCondition", "./dateFilterCondition", "./dateIsoFilterCondition", "./dateUsFilterCondition", "./dateUsShortFilterCondition", "./dateUtcFilterCondition", "./executeMappedCondition", "./filterUtilities", "./numberFilterCondition", "./stringFilterCondition"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var booleanFilterCondition_1, dateFilterCondition_1, dateIsoFilterCondition_1, dateUsFilterCondition_1, dateUsShortFilterCondition_1, dateUtcFilterCondition_1, executeMappedCondition_1, filterUtilities_1, numberFilterCondition_1, stringFilterCondition_1, FilterConditions;
    return {
        setters: [
            function (booleanFilterCondition_1_1) {
                booleanFilterCondition_1 = booleanFilterCondition_1_1;
            },
            function (dateFilterCondition_1_1) {
                dateFilterCondition_1 = dateFilterCondition_1_1;
            },
            function (dateIsoFilterCondition_1_1) {
                dateIsoFilterCondition_1 = dateIsoFilterCondition_1_1;
            },
            function (dateUsFilterCondition_1_1) {
                dateUsFilterCondition_1 = dateUsFilterCondition_1_1;
            },
            function (dateUsShortFilterCondition_1_1) {
                dateUsShortFilterCondition_1 = dateUsShortFilterCondition_1_1;
            },
            function (dateUtcFilterCondition_1_1) {
                dateUtcFilterCondition_1 = dateUtcFilterCondition_1_1;
            },
            function (executeMappedCondition_1_1) {
                executeMappedCondition_1 = executeMappedCondition_1_1;
            },
            function (filterUtilities_1_1) {
                filterUtilities_1 = filterUtilities_1_1;
            },
            function (numberFilterCondition_1_1) {
                numberFilterCondition_1 = numberFilterCondition_1_1;
            },
            function (stringFilterCondition_1_1) {
                stringFilterCondition_1 = stringFilterCondition_1_1;
            }
        ],
        execute: function () {
            exports_1("FilterConditions", FilterConditions = {
                executeMappedCondition: executeMappedCondition_1.executeMappedCondition,
                booleanFilter: booleanFilterCondition_1.booleanFilterCondition,
                dateFilter: dateFilterCondition_1.dateFilterCondition,
                dateIsoFilter: dateIsoFilterCondition_1.dateIsoFilterCondition,
                dateUtcFilter: dateUtcFilterCondition_1.dateUtcFilterCondition,
                dateUsFilter: dateUsFilterCondition_1.dateUsFilterCondition,
                dateUsShortFilter: dateUsShortFilterCondition_1.dateUsShortFilterCondition,
                numberFilter: numberFilterCondition_1.numberFilterCondition,
                stringFilter: stringFilterCondition_1.stringFilterCondition,
                testFilter: filterUtilities_1.testFilterCondition
            });
        }
    };
});
//# sourceMappingURL=index.js.map