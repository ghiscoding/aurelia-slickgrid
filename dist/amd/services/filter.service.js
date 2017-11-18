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
define(["require", "exports", "../filter-conditions/index", "./../filter-templates/index", "../models/index", "jquery"], function (require, exports, index_1, index_2, index_3, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FilterService = /** @class */ (function () {
        function FilterService() {
            this._columnFilters = {};
        }
        FilterService.prototype.init = function (grid, gridOptions, columnDefinitions) {
            this._columnDefinitions = columnDefinitions;
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
            this.subscriber.subscribe(this.attachBackendOnFilterSubscribe);
            grid.onHeaderRowCellRendered.subscribe(function (e, args) {
                _this.addFilterTemplateToHeaderRow(args);
            });
        };
        FilterService.prototype.attachBackendOnFilterSubscribe = function (event, args) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceOptions, query, responseProcess;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!args || !args.grid) {
                                throw new Error('Something went wrong when trying to attach the "attachBackendOnFilterSubscribe(event, args)" function, it seems that "args" is not populated correctly');
                            }
                            serviceOptions = args.grid.getOptions();
                            if (!serviceOptions || !serviceOptions.onBackendEventApi || !serviceOptions.onBackendEventApi.process || !serviceOptions.onBackendEventApi.service) {
                                throw new Error("onBackendEventApi requires at least a \"process\" function and a \"service\" defined");
                            }
                            // run a preProcess callback if defined
                            if (serviceOptions.onBackendEventApi.preProcess !== undefined) {
                                serviceOptions.onBackendEventApi.preProcess();
                            }
                            return [4 /*yield*/, serviceOptions.onBackendEventApi.service.onFilterChanged(event, args)];
                        case 1:
                            query = _a.sent();
                            return [4 /*yield*/, serviceOptions.onBackendEventApi.process(query)];
                        case 2:
                            responseProcess = _a.sent();
                            // send the response process to the postProcess callback
                            if (serviceOptions.onBackendEventApi.postProcess !== undefined) {
                                serviceOptions.onBackendEventApi.postProcess(responseProcess);
                            }
                            return [2 /*return*/];
                    }
                });
            });
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
            dataView.setFilterArgs({ columnFilters: this._columnFilters, grid: this._grid });
            dataView.setFilter(this.customFilter);
            this.subscriber.subscribe(function (e, args) {
                var columnId = args.columnId;
                if (columnId != null) {
                    dataView.refresh();
                }
            });
            grid.onHeaderRowCellRendered.subscribe(function (e, args) {
                _this.addFilterTemplateToHeaderRow(args);
            });
        };
        FilterService.prototype.customFilter = function (item, args) {
            for (var _i = 0, _a = Object.keys(args.columnFilters); _i < _a.length; _i++) {
                var columnId = _a[_i];
                var columnFilter = args.columnFilters[columnId];
                var columnIndex = args.grid.getColumnIndex(columnId);
                var columnDef = args.grid.getColumns()[columnIndex];
                var fieldType = columnDef.type || index_3.FieldType.string;
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
                if (!index_1.FilterConditions.executeMappedCondition(conditionOptions)) {
                    return false;
                }
            }
            return true;
        };
        FilterService.prototype.destroy = function () {
            this.subscriber.unsubscribe();
        };
        FilterService.prototype.callbackSearchEvent = function (e, args) {
            if (e.target.value === '' || e.target.value === null) {
                // delete the property from the columnFilters when it becomes empty
                // without doing this, it would leave an incorrect state of the previous column filters when filtering on another column
                delete this._columnFilters[args.columnDef.id];
            }
            else {
                this._columnFilters[args.columnDef.id] = {
                    columnId: args.columnDef.id,
                    columnDef: args.columnDef,
                    searchTerm: e.target.value,
                    operator: args.operator || null
                };
            }
            this.triggerEvent(this.subscriber, {
                columnId: args.columnDef.id,
                columnDef: args.columnDef,
                columnFilters: this._columnFilters,
                searchTerm: e.target.value,
                serviceOptions: this._onFilterChangedOptions,
                grid: this._grid
            }, e);
        };
        FilterService.prototype.addFilterTemplateToHeaderRow = function (args) {
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
                        filterTemplate = index_2.FilterTemplates.input(searchTerm, columnDef_1);
                    }
                    else {
                        // custom Select template
                        if (columnDef_1.filter.type === index_3.FormElementType.select) {
                            filterTemplate = index_2.FilterTemplates.select(searchTerm, columnDef_1);
                        }
                    }
                    // when hiding/showing (Column Picker or Grid Menu), it will come re-create yet again the filters
                    // because of that we need to first get searchTerm from the columnFilters (that is what the user input last)
                    // if nothing is found, we can then use the optional searchTerm passed to the Grid Option (that is couple lines before)
                    var inputSearchTerm = (this_1._columnFilters[columnDef_1.id]) ? this_1._columnFilters[columnDef_1.id].searchTerm : searchTerm || null;
                    // create the DOM Element
                    header = this_1._grid.getHeaderRowColumn(columnDef_1.id);
                    $(header).empty();
                    elm = $(filterTemplate);
                    elm.attr('id', "filter-" + columnDef_1.id);
                    elm.data('columnId', columnDef_1.id);
                    elm.val(inputSearchTerm);
                    if (elm && typeof elm.appendTo === 'function') {
                        elm.appendTo(header);
                    }
                    // depending on the DOM Element type, we will watch the correct event
                    var filterType = (columnDef_1.filter && columnDef_1.filter.type) ? columnDef_1.filter.type : index_3.FormElementType.input;
                    switch (filterType) {
                        case index_3.FormElementType.select:
                            elm.change(function (e) { return _this.callbackSearchEvent(e, { columnDef: columnDef_1, operator: 'EQ' }); });
                            break;
                        case index_3.FormElementType.multiSelect:
                            elm.change(function (e) { return _this.callbackSearchEvent(e, { columnDef: columnDef_1, operator: 'IN' }); });
                            break;
                        case index_3.FormElementType.input:
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
        /** Clear the search filters (below the column titles) */
        FilterService.prototype.clearFilters = function (dataview) {
            // remove the text inside each search input fields
            $('.slick-headerrow-column .search-filter').val('');
            // we need to loop through all columnFilters and delete them 1 by 1
            // only trying to make columnFilter an empty (without looping) would not trigger a dataset change
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
});
//# sourceMappingURL=filter.service.js.map