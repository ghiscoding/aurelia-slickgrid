System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Constants;
    return {
        setters: [],
        execute: function () {
            Constants = /** @class */ (function () {
                function Constants() {
                }
                Constants.TEXT_CANCEL = 'Cancel';
                Constants.TEXT_CLEAR_ALL_FILTERS = 'Clear All Filters';
                Constants.TEXT_CLEAR_ALL_SORTING = 'Clear All Sorting';
                Constants.TEXT_COLUMNS = 'Columns';
                Constants.TEXT_COMMANDS = 'Commands';
                Constants.TEXT_EXPORT_IN_CSV_FORMAT = 'Export in CSV format';
                Constants.TEXT_EXPORT_IN_TEXT_FORMAT = 'Export in Text format (Tab delimited)';
                Constants.TEXT_FORCE_FIT_COLUMNS = 'Force fit columns';
                Constants.TEXT_HIDE_COLUMN = 'Hide Column';
                Constants.TEXT_REFRESH_DATASET = 'Refresh Dataset';
                Constants.TEXT_SAVE = 'Save';
                Constants.TEXT_SYNCHRONOUS_RESIZE = 'Synchronous resize';
                Constants.TEXT_SORT_ASCENDING = 'Sort Ascending';
                Constants.TEXT_SORT_DESCENDING = 'Sort Descending';
                Constants.TEXT_TOGGLE_FILTER_ROW = 'Toggle Filter Row';
                Constants.VALIDATION_EDITOR_DECIMAL_BETWEEN = 'Please enter a valid number with a maximum of {{maxDecimal}} decimals';
                Constants.VALIDATION_EDITOR_NUMBER_BETWEEN = 'Please enter a valid number between {{minValue}} and {{maxValue}}';
                Constants.VALIDATION_EDITOR_NUMBER_MAX = 'Please enter a valid number that is lower than {{maxValue}}';
                Constants.VALIDATION_EDITOR_NUMBER_MIN = 'Please enter a valid number that is greater than {{minValue}}';
                Constants.VALIDATION_EDITOR_VALID_NUMBER = 'Please enter a valid number';
                Constants.VALIDATION_EDITOR_VALID_INTEGER = 'Please enter a valid integer number';
                return Constants;
            }());
            exports_1("Constants", Constants);
        }
    };
});
//# sourceMappingURL=constants.js.map