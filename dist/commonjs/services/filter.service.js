"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./utilities");
var filter_conditions_1 = require("../filter-conditions");
var models_1 = require("../models");
var filter_templates_1 = require("./../filter-templates");
var $ = require("jquery");
var FilterService = /** @class */ (function () {
    function FilterService() {
    }
    FilterService.prototype.init = function (grid, gridOptions, columnDefinitions, columnFilters) {
        this._columnDefinitions = columnDefinitions;
        this._columnFilters = columnFilters;
        this._gridOptions = gridOptions;
        this._grid = grid;
    };
    /**
     * Attach a backend filter hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     */
    FilterService.prototype.attachBackendOnFilter = function (grid, options) {
        this.subscriber = new Slick.Event();
        this.subscriber.subscribe(this.attachBackendOnFilterSubscribe);
        this.addFilterTemplateToHeaderRow();
    };
    FilterService.prototype.attachBackendOnFilterSubscribe = function (event, args) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceOptions, backendApi, query, observableOrPromise, responseProcess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!args || !args.grid) {
                            throw new Error('Something went wrong when trying to attach the "attachBackendOnFilterSubscribe(event, args)" function, it seems that "args" is not populated correctly');
                        }
                        serviceOptions = args.grid.getOptions();
                        if (serviceOptions === undefined || serviceOptions.onBackendEventApi === undefined || serviceOptions.onBackendEventApi.process === undefined || serviceOptions.onBackendEventApi.service === undefined) {
                            throw new Error("onBackendEventApi requires at least a \"process\" function and a \"service\" defined");
                        }
                        backendApi = serviceOptions.onBackendEventApi;
                        // run a preProcess callback if defined
                        if (backendApi.preProcess !== undefined) {
                            backendApi.preProcess();
                        }
                        return [4 /*yield*/, backendApi.service.onFilterChanged(event, args)];
                    case 1:
                        query = _a.sent();
                        observableOrPromise = backendApi.process(query);
                        return [4 /*yield*/, utilities_1.castToPromise(observableOrPromise)];
                    case 2:
                        responseProcess = _a.sent();
                        // send the response process to the postProcess callback
                        if (backendApi.postProcess !== undefined) {
                            backendApi.postProcess(responseProcess);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FilterService.prototype.testFilterCondition = function (operator, value1, value2) {
        switch (operator) {
            case '<': return (value1 < value2) ? true : false;
            case '<=': return (value1 <= value2) ? true : false;
            case '>': return (value1 > value2) ? true : false;
            case '>=': return (value1 >= value2) ? true : false;
            case '!=':
            case '<>': return (value1 !== value2) ? true : false;
            case '=':
            case '==': return (value1 === value2) ? true : false;
        }
        return true;
    };
    /**
     * Attach a local filter hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     * @param dataView
     */
    FilterService.prototype.attachLocalOnFilter = function (dataView) {
        this._dataView = dataView;
        this.subscriber = new Slick.Event();
        dataView.setFilterArgs({ columnFilters: this._columnFilters, grid: this._grid });
        dataView.setFilter(this.customFilter);
        this.subscriber.subscribe(function (e, args) {
            var columnId = args.columnId;
            if (columnId != null) {
                dataView.refresh();
            }
        });
        this.addFilterTemplateToHeaderRow();
    };
    FilterService.prototype.customFilter = function (item, args) {
        for (var _i = 0, _a = Object.keys(args.columnFilters); _i < _a.length; _i++) {
            var columnId = _a[_i];
            var columnFilter = args.columnFilters[columnId];
            var columnIndex = args.grid.getColumnIndex(columnId);
            var columnDef = args.grid.getColumns()[columnIndex];
            var fieldType = columnDef.type || models_1.FieldType.string;
            var conditionalFilterFn = (columnDef.filter && columnDef.filter.conditionalFilter) ? columnDef.filter.conditionalFilter : null;
            var filterSearchType = (columnDef.filterSearchType) ? columnDef.filterSearchType : null;
            var cellValue = item[columnDef.field];
            var fieldSearchValue = columnFilter.searchTerm;
            if (typeof fieldSearchValue === 'undefined') {
                fieldSearchValue = '';
            }
            fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
            var matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
            var operator = columnFilter.operator || ((matches) ? matches[1] : '');
            var searchTerm = (!!matches) ? matches[2] : '';
            var lastValueChar = (!!matches) ? matches[3] : '';
            // no need to query if search value is empty
            if (searchTerm === '') {
                return true;
            }
            if (typeof cellValue === 'number') {
                cellValue = cellValue.toString();
            }
            var conditionOptions = {
                fieldType: fieldType,
                searchTerm: searchTerm,
                cellValue: cellValue,
                operator: operator,
                cellValueLastChar: lastValueChar,
                filterSearchType: filterSearchType
            };
            if (conditionalFilterFn && typeof conditionalFilterFn === 'function') {
                conditionalFilterFn(conditionOptions);
            }
            if (!filter_conditions_1.FilterConditions.executeMappedCondition(conditionOptions)) {
                return false;
            }
        }
        return true;
    };
    FilterService.prototype.destroy = function () {
        this.subscriber.unsubscribe();
    };
    FilterService.prototype.callbackSearchEvent = function (e, args) {
        this._columnFilters[args.columnDef.id] = {
            columnId: args.columnDef.id,
            columnDef: args.columnDef,
            searchTerm: e.target.value
        };
        this.triggerEvent(this.subscriber, {
            columnId: args.columnDef.id,
            columnDef: args.columnDef,
            columnFilters: this._columnFilters,
            searchTerm: e.target.value,
            serviceOptions: this._onFilterChangedOptions,
            grid: this._grid
        }, e);
    };
    FilterService.prototype.addFilterTemplateToHeaderRow = function () {
        var _this = this;
        var _loop_1 = function (i) {
            if (this_1._columnDefinitions[i].id !== 'selector' && this_1._columnDefinitions[i].filterable) {
                var filterTemplate = '';
                var elm = null;
                var header = void 0;
                var columnDef_1 = this_1._columnDefinitions[i];
                var columnId = columnDef_1.id;
                var listTerm = (columnDef_1.filter && columnDef_1.filter.listTerm) ? columnDef_1.filter.listTerm : null;
                var searchTerm = (columnDef_1.filter && columnDef_1.filter.searchTerm) ? columnDef_1.filter.searchTerm : '';
                // keep the filter in a columnFilters for later reference
                this_1.keepColumnFilters(searchTerm, listTerm, columnDef_1);
                if (!columnDef_1.filter) {
                    searchTerm = (columnDef_1.filter && columnDef_1.filter.searchTerm) ? columnDef_1.filter.searchTerm : null;
                    filterTemplate = filter_templates_1.FilterTemplates.input(searchTerm, columnDef_1);
                }
                else {
                    // custom Select template
                    if (columnDef_1.filter.type === models_1.FormElementType.select) {
                        filterTemplate = filter_templates_1.FilterTemplates.select(searchTerm, columnDef_1);
                    }
                }
                // create the DOM Element
                header = this_1._grid.getHeaderRowColumn(columnDef_1.id);
                $(header).empty();
                elm = $(filterTemplate);
                elm.val(searchTerm);
                elm.data('columnId', columnDef_1.id);
                if (elm && typeof elm.appendTo === 'function') {
                    elm.appendTo(header);
                }
                // depending on the DOM Element type, we will watch the correct event
                var filterType = (columnDef_1.filter && columnDef_1.filter.type) ? columnDef_1.filter.type : models_1.FormElementType.input;
                switch (filterType) {
                    case models_1.FormElementType.select:
                    case models_1.FormElementType.multiSelect:
                        elm.change(function (e) { return _this.callbackSearchEvent(e, { columnDef: columnDef_1 }); });
                        break;
                    case models_1.FormElementType.input:
                    default:
                        elm.keyup(function (e) { return _this.callbackSearchEvent(e, { columnDef: columnDef_1 }); });
                        break;
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < this._columnDefinitions.length; i++) {
            _loop_1(i);
        }
    };
    FilterService.prototype.keepColumnFilters = function (searchTerm, listTerm, columnDef) {
        if (searchTerm) {
            this._columnFilters[columnDef.id] = {
                columnId: columnDef.id,
                columnDef: columnDef,
                searchTerm: searchTerm
            };
            if (listTerm) {
                this._columnFilters.listTerm = listTerm;
            }
        }
    };
    FilterService.prototype.triggerEvent = function (evt, args, e) {
        e = e || new Slick.EventData();
        return evt.notify(args, e, args.grid);
    };
    return FilterService;
}());
exports.FilterService = FilterService;
//# sourceMappingURL=filter.service.js.map