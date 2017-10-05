var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "./../filter-conditions/executeMappedCondition", "./../filter-templates/inputFilterTemplate", "./../filter-templates/selectFilterTemplate", "./../models/fieldType", "./../models/formElementType"], function (require, exports, aurelia_framework_1, executeMappedCondition_1, inputFilterTemplate_1, selectFilterTemplate_1, fieldType_1, formElementType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        FilterService.prototype.attachBackendOnFilter = function () {
            this.subscriber = new Slick.Event();
            this.subscriber.subscribe(this._gridOptions.onFilterChanged);
            this.addFilterTemplateToHeaderRow();
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
                // const fieldName = columnDef.field || columnDef.name;
                var fieldType = columnDef.type || fieldType_1.FieldType.string;
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
                if (!executeMappedCondition_1.executeMappedCondition(conditionOptions)) {
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
                    // const columnId = columnDef.id;
                    var listTerm = (columnDef_1.filter && columnDef_1.filter.listTerm) ? columnDef_1.filter.listTerm : null;
                    var searchTerm = (columnDef_1.filter && columnDef_1.filter.searchTerm) ? columnDef_1.filter.searchTerm : null;
                    // keep the filter in a columnFilters for later reference
                    this_1.keepColumnFilters(searchTerm, listTerm, columnDef_1);
                    if (!columnDef_1.filter) {
                        searchTerm = (columnDef_1.filter && columnDef_1.filter.searchTerm) ? columnDef_1.filter.searchTerm : null;
                        filterTemplate = inputFilterTemplate_1.inputFilterTemplate(searchTerm, columnDef_1);
                    }
                    else {
                        // custom Select template
                        if (columnDef_1.filter.type === formElementType_1.FormElementType.select) {
                            filterTemplate = selectFilterTemplate_1.selectFilterTemplate(searchTerm, columnDef_1);
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
                    // depending on the DOM Element type, we will watch the corrent event
                    var filterType = (columnDef_1.filter && columnDef_1.filter.type) ? columnDef_1.filter.type : formElementType_1.FormElementType.input;
                    switch (filterType) {
                        case formElementType_1.FormElementType.select:
                        case formElementType_1.FormElementType.multiSelect:
                            elm.change(function (e) { return _this.callbackSearchEvent(e, { columnDef: columnDef_1 }); });
                            break;
                        case formElementType_1.FormElementType.input:
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
        FilterService = __decorate([
            aurelia_framework_1.inject()
        ], FilterService);
        return FilterService;
    }());
    exports.FilterService = FilterService;
});
