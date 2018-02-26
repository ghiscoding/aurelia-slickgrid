var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "./../filter-conditions/index", "./../filters/index", "./../models/index"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, index_1, index_2, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FilterService = /** @class */ (function () {
        function FilterService(filterFactory) {
            this.filterFactory = filterFactory;
            this._filters = [];
            this._columnFilters = {};
            this.onFilterChanged = new aurelia_event_aggregator_1.EventAggregator();
        }
        FilterService.prototype.init = function (grid, gridOptions, columnDefinitions) {
            this._gridOptions = gridOptions;
            this._grid = grid;
        };
        /**
         * Attach a backend filter hook to the grid
         * @param grid SlickGrid Grid object
         * @param gridOptions Grid Options object
         */
        FilterService.prototype.attachBackendOnFilter = function (grid, options) {
            var _this = this;
            this.subscriber = new Slick.Event();
            this.emitFilterChangedBy('remote');
            this.subscriber.subscribe(this.attachBackendOnFilterSubscribe);
            this._filters = [];
            grid.onHeaderRowCellRendered.subscribe(function (e, args) {
                _this.addFilterTemplateToHeaderRow(args);
            });
        };
        FilterService.prototype.attachBackendOnFilterSubscribe = function (event, args) {
            return __awaiter(this, void 0, void 0, function () {
                var gridOptions, backendApi, query, processResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!args || !args.grid) {
                                throw new Error('Something went wrong when trying to attach the "attachBackendOnFilterSubscribe(event, args)" function, it seems that "args" is not populated correctly');
                            }
                            gridOptions = args.grid.getOptions() || {};
                            backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
                            if (!backendApi || !backendApi.process || !backendApi.service) {
                                throw new Error("BackendServiceApi requires at least a \"process\" function and a \"service\" defined");
                            }
                            // run a preProcess callback if defined
                            if (backendApi.preProcess) {
                                backendApi.preProcess();
                            }
                            return [4 /*yield*/, backendApi.service.onFilterChanged(event, args)];
                        case 1:
                            query = _a.sent();
                            return [4 /*yield*/, backendApi.process(query)];
                        case 2:
                            processResult = _a.sent();
                            // from the result, call our internal post process to update the Dataset and Pagination info
                            if (processResult && backendApi.internalPostProcess) {
                                backendApi.internalPostProcess(processResult);
                            }
                            // send the response process to the postProcess callback
                            if (backendApi.postProcess !== undefined) {
                                backendApi.postProcess(processResult);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Clear the search filters (below the column titles) */
        FilterService.prototype.clearFilters = function () {
            this._filters.forEach(function (filter, index) {
                if (filter && filter.clear) {
                    // clear element and trigger a change
                    filter.clear(true);
                }
            });
            // we need to loop through all columnFilters and delete them 1 by 1
            // only trying to clear columnFilter (without looping through) would not trigger a dataset change
            for (var columnId in this._columnFilters) {
                if (columnId && this._columnFilters[columnId]) {
                    delete this._columnFilters[columnId];
                }
            }
            // we also need to refresh the dataView and optionally the grid (it's optional since we use DataView)
            if (this._dataView) {
                this._dataView.refresh();
                this._grid.invalidate();
                this._grid.render();
            }
        };
        /**
         * Attach a local filter hook to the grid
         * @param grid SlickGrid Grid object
         * @param gridOptions Grid Options object
         * @param dataView
         */
        FilterService.prototype.attachLocalOnFilter = function (grid, options, dataView) {
            var _this = this;
            this._dataView = dataView;
            this.subscriber = new Slick.Event();
            this.emitFilterChangedBy('local');
            dataView.setFilterArgs({ columnFilters: this._columnFilters, grid: this._grid });
            dataView.setFilter(this.customLocalFilter.bind(this, dataView));
            this.subscriber.subscribe(function (e, args) {
                var columnId = args.columnId;
                if (columnId != null) {
                    dataView.refresh();
                }
            });
            this._filters = [];
            grid.onHeaderRowCellRendered.subscribe(function (e, args) {
                _this.addFilterTemplateToHeaderRow(args);
            });
        };
        FilterService.prototype.customLocalFilter = function (dataView, item, args) {
            for (var _i = 0, _a = Object.keys(args.columnFilters); _i < _a.length; _i++) {
                var columnId = _a[_i];
                var columnFilter = args.columnFilters[columnId];
                var columnIndex = args.grid.getColumnIndex(columnId);
                var columnDef = args.grid.getColumns()[columnIndex];
                var fieldType = columnDef.type || index_3.FieldType.string;
                var conditionalFilterFn = (columnDef.filter && columnDef.filter.conditionalFilter) ? columnDef.filter.conditionalFilter : null;
                var filterSearchType = (columnDef.filterSearchType) ? columnDef.filterSearchType : null;
                var cellValue = item[columnDef.queryField || columnDef.field];
                var searchTerms = (columnFilter && columnFilter.searchTerms) ? columnFilter.searchTerms : null;
                var fieldSearchValue = (columnFilter && (columnFilter.searchTerm !== undefined || columnFilter.searchTerm !== null)) ? columnFilter.searchTerm : undefined;
                if (typeof fieldSearchValue === 'undefined') {
                    fieldSearchValue = '';
                }
                fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
                var matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
                var operator = columnFilter.operator || ((matches) ? matches[1] : '');
                var searchTerm = (!!matches) ? matches[2] : '';
                var lastValueChar = (!!matches) ? matches[3] : '';
                // when using a Filter that is not a custom type, we want to make sure that we have a default operator type
                // for example a multiple-select should always be using IN, while a single select will use an EQ
                var filterType = (columnDef.filter && columnDef.filter.type) ? columnDef.filter.type : index_3.FilterType.input;
                if (!operator && filterType !== index_3.FilterType.custom) {
                    switch (filterType) {
                        case index_3.FilterType.select:
                        case index_3.FilterType.multipleSelect:
                            operator = 'IN';
                            break;
                        case index_3.FilterType.singleSelect:
                            operator = 'EQ';
                            break;
                        default:
                            operator = operator;
                            break;
                    }
                }
                // no need to query if search value is empty
                if (searchTerm === '' && !searchTerms) {
                    return true;
                }
                // filter search terms should always be string (even though we permit the end user to input numbers)
                // so make sure each term are strings
                // run a query if user has some default search terms
                if (searchTerms && Array.isArray(searchTerms)) {
                    for (var k = 0, ln = searchTerms.length; k < ln; k++) {
                        // make sure all search terms are strings
                        searchTerms[k] = ((searchTerms[k] === undefined || searchTerms[k] === null) ? '' : searchTerms[k]) + '';
                    }
                }
                // when using localization (i18n), we should use the formatter output to search as the new cell value
                if (columnDef && columnDef.params && columnDef.params.useFormatterOuputToFilter) {
                    var rowIndex = (dataView && typeof dataView.getIdxById === 'function') ? dataView.getIdxById(item.id) : 0;
                    cellValue = columnDef.formatter(rowIndex, columnIndex, cellValue, columnDef, item, this._grid);
                }
                // make sure cell value is always a string
                if (typeof cellValue === 'number') {
                    cellValue = cellValue.toString();
                }
                var conditionOptions = {
                    fieldType: fieldType,
                    searchTerms: searchTerms,
                    searchTerm: searchTerm,
                    cellValue: cellValue,
                    operator: operator,
                    cellValueLastChar: lastValueChar,
                    filterSearchType: filterSearchType
                };
                if (conditionalFilterFn && typeof conditionalFilterFn === 'function') {
                    conditionalFilterFn(conditionOptions);
                }
                if (!index_1.FilterConditions.executeMappedCondition(conditionOptions)) {
                    return false;
                }
            }
            return true;
        };
        FilterService.prototype.destroy = function () {
            this.destroyFilters();
            if (this.subscriber && typeof this.subscriber.unsubscribe === 'function') {
                this.subscriber.unsubscribe();
            }
        };
        /**
         * Destroy the filters, since it's a singleton, we don't want to affect other grids with same columns
         */
        FilterService.prototype.destroyFilters = function () {
            // we need to loop through all columnFilters and delete them 1 by 1
            // only trying to make columnFilter an empty (without looping) would not trigger a dataset change
            for (var columnId in this._columnFilters) {
                if (columnId && this._columnFilters[columnId]) {
                    delete this._columnFilters[columnId];
                }
            }
            // also destroy each Filter instances
            this._filters.forEach(function (filter, index) {
                if (filter && filter.destroy) {
                    filter.destroy(true);
                }
            });
        };
        FilterService.prototype.callbackSearchEvent = function (e, args) {
            var targetValue = (e && e.target) ? e.target.value : undefined;
            var searchTerms = (args && args.searchTerms && Array.isArray(args.searchTerms)) ? args.searchTerms : [];
            var columnId = (args && args.columnDef) ? args.columnDef.id || '' : '';
            if (!targetValue && searchTerms.length === 0) {
                // delete the property from the columnFilters when it becomes empty
                // without doing this, it would leave an incorrect state of the previous column filters when filtering on another column
                delete this._columnFilters[columnId];
            }
            else {
                var colId = '' + columnId;
                this._columnFilters[colId] = {
                    columnId: colId,
                    columnDef: args.columnDef || null,
                    searchTerms: args.searchTerms || [],
                    searchTerm: ((e && e.target) ? e.target.value : ''),
                    operator: args.operator || ''
                };
            }
            this.triggerEvent(this.subscriber, {
                columnId: columnId,
                columnDef: args.columnDef || null,
                columnFilters: this._columnFilters,
                searchTerms: args.searchTerms || undefined,
                searchTerm: ((e && e.target) ? e.target.value : null),
                serviceOptions: this._onFilterChangedOptions,
                grid: this._grid
            }, e);
        };
        FilterService.prototype.addFilterTemplateToHeaderRow = function (args) {
            var columnDef = args.column;
            var columnId = columnDef.id || '';
            if (columnDef && columnId !== 'selector' && columnDef.filterable) {
                var searchTerms = (columnDef.filter && columnDef.filter.searchTerms) ? columnDef.filter.searchTerms : [];
                var searchTerm = (columnDef.filter && (columnDef.filter.searchTerm !== undefined || columnDef.filter.searchTerm !== null)) ? columnDef.filter.searchTerm : '';
                // keep the filter in a columnFilters for later reference
                this.keepColumnFilters(searchTerm || '', searchTerms, columnDef);
                // when hiding/showing (with Column Picker or Grid Menu), it will try to re-create yet again the filters (since SlickGrid does a re-render)
                // because of that we need to first get searchTerm(s) from the columnFilters (that is what the user last entered)
                // if nothing is found, we can then use the optional searchTerm(s) passed to the Grid Option (that is couple of lines earlier)
                searchTerm = ((this._columnFilters[columnDef.id]) ? this._columnFilters[columnDef.id].searchTerm : searchTerm) || '';
                searchTerms = ((this._columnFilters[columnDef.id]) ? this._columnFilters[columnDef.id].searchTerms : searchTerms) || [];
                var filterArguments = {
                    grid: this._grid,
                    searchTerm: searchTerm,
                    searchTerms: searchTerms,
                    columnDef: columnDef,
                    callback: this.callbackSearchEvent.bind(this)
                };
                // depending on the Filter type, we will watch the correct event
                var filterType = (columnDef.filter && columnDef.filter.type) ? columnDef.filter.type : index_3.FilterType.input;
                var filter_1;
                switch (filterType) {
                    case index_3.FilterType.custom:
                        if (columnDef && columnDef.filter && columnDef.filter.customFilter) {
                            filter_1 = columnDef.filter.customFilter;
                        }
                        else {
                            throw new Error('[Aurelia-Slickgrid] A Filter type of "custom" must include a Filter class that is defined and instantiated.');
                        }
                        break;
                    default:
                        filter_1 = this.filterFactory.createFilter(filterType);
                        break;
                }
                if (filter_1) {
                    filter_1.init(filterArguments);
                    var filterExistIndex = this._filters.findIndex(function (filt) { return filter_1.columnDef.name === filt.columnDef.name; });
                    // add to the filters arrays or replace it when found
                    if (filterExistIndex === -1) {
                        this._filters.push(filter_1);
                    }
                    else {
                        this._filters[filterExistIndex] = filter_1;
                    }
                }
            }
        };
        /**
         * A simple function that is attached to the subscriber and emit a change when the sort is called.
         * Other services, like Pagination, can then subscribe to it.
         * @param {string} sender
         */
        FilterService.prototype.emitFilterChangedBy = function (sender) {
            var _this = this;
            this.subscriber.subscribe(function () { return _this.onFilterChanged.publish('filterService:changed', "onFilterChanged by " + sender); });
        };
        FilterService.prototype.keepColumnFilters = function (searchTerm, searchTerms, columnDef) {
            if (searchTerm !== undefined && searchTerm !== null && searchTerm !== '') {
                this._columnFilters[columnDef.id] = {
                    columnId: columnDef.id,
                    columnDef: columnDef,
                    searchTerm: searchTerm,
                    type: (columnDef && columnDef.filter && columnDef.filter.type) ? columnDef.filter.type : index_3.FilterType.input
                };
            }
            if (searchTerms && Array.isArray(searchTerms) && searchTerms.length > 0) {
                // this._columnFilters.searchTerms = searchTerms;
                this._columnFilters[columnDef.id] = {
                    columnId: columnDef.id,
                    columnDef: columnDef,
                    searchTerms: searchTerms,
                    type: (columnDef && columnDef.filter && columnDef.filter.type) ? columnDef.filter.type : index_3.FilterType.input
                };
            }
        };
        FilterService.prototype.triggerEvent = function (evt, args, e) {
            e = e || new Slick.EventData();
            return evt.notify(args, e, args.grid);
        };
        FilterService = __decorate([
            aurelia_framework_1.inject(index_2.FilterFactory)
        ], FilterService);
        return FilterService;
    }());
    exports.FilterService = FilterService;
});
//# sourceMappingURL=filter.service.js.map