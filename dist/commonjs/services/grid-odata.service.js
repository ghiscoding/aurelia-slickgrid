"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./global-utilities");
var aurelia_framework_1 = require("aurelia-framework");
var utilities_1 = require("./utilities");
var index_1 = require("./../models/index");
var odata_service_1 = require("./odata.service");
var timer;
var DEFAULT_FILTER_TYPING_DEBOUNCE = 750;
var DEFAULT_ITEMS_PER_PAGE = 25;
var DEFAULT_PAGE_SIZE = 20;
var GridOdataService = /** @class */ (function () {
    function GridOdataService() {
        this.defaultOptions = {
            top: DEFAULT_ITEMS_PER_PAGE,
            orderBy: '',
            caseType: index_1.CaseType.pascalCase
        };
        this.odataService = new odata_service_1.OdataService();
    }
    Object.defineProperty(GridOdataService.prototype, "_gridOptions", {
        /** Getter for the Grid Options pulled through the Grid Object */
        get: function () {
            return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
        },
        enumerable: true,
        configurable: true
    });
    GridOdataService.prototype.buildQuery = function () {
        return this.odataService.buildQuery();
    };
    /**
     * Initialize the Service
     * @param OData Options
     * @param pagination
     * @param grid
     */
    GridOdataService.prototype.init = function (options, pagination, grid) {
        this._grid = grid;
        var mergedOptions = __assign({}, this.defaultOptions, options);
        if (pagination && pagination.pageSize) {
            mergedOptions.top = pagination.pageSize;
        }
        this.odataService.options = __assign({}, mergedOptions, { top: mergedOptions.top || this.defaultOptions.top });
        this.options = this.odataService.options;
        this.pagination = pagination;
        // save current pagination as Page 1 and page size as "top"
        this._currentPagination = {
            pageNumber: 1,
            pageSize: this.odataService.options.top || this.defaultOptions.top || DEFAULT_PAGE_SIZE
        };
        if (grid && grid.getColumns) {
            this._columnDefinitions = grid.getColumns() || options.columnDefinitions || {};
            this._columnDefinitions = this._columnDefinitions.filter(function (column) { return !column.excludeFromQuery; });
        }
    };
    GridOdataService.prototype.updateOptions = function (serviceOptions) {
        this.options = __assign({}, this.options, serviceOptions);
    };
    GridOdataService.prototype.removeColumnFilter = function (fieldName) {
        this.odataService.removeColumnFilter(fieldName);
    };
    /** Get the Filters that are currently used by the grid */
    GridOdataService.prototype.getCurrentFilters = function () {
        return this._currentFilters;
    };
    /** Get the Pagination that is currently used by the grid */
    GridOdataService.prototype.getCurrentPagination = function () {
        return this._currentPagination;
    };
    /** Get the Sorters that are currently used by the grid */
    GridOdataService.prototype.getCurrentSorters = function () {
        return this._currentSorters;
    };
    /*
     * Reset the pagination options
     */
    GridOdataService.prototype.resetPaginationOptions = function () {
        this.odataService.updateOptions({
            skip: 0
        });
    };
    GridOdataService.prototype.saveColumnFilter = function (fieldName, value, terms) {
        this.odataService.saveColumnFilter(fieldName, value, terms);
    };
    /*
     * FILTERING
     */
    GridOdataService.prototype.processOnFilterChanged = function (event, args) {
        var _this = this;
        var serviceOptions = args.grid.getOptions();
        var backendApi = serviceOptions.backendServiceApi;
        if (backendApi === undefined) {
            throw new Error('Something went wrong in the GridOdataService, "backendServiceApi" is not initialized');
        }
        // only add a delay when user is typing, on select dropdown filter it will execute right away
        var debounceTypingDelay = 0;
        if (event && (event.type === 'keyup' || event.type === 'keydown')) {
            debounceTypingDelay = backendApi.filterTypingDebounce || DEFAULT_FILTER_TYPING_DEBOUNCE;
        }
        // keep current filters & always save it as an array (columnFilters can be an object when it is dealt by SlickGrid Filter)
        this._currentFilters = this.castFilterToColumnFilter(args.columnFilters);
        var promise = new Promise(function (resolve, reject) {
            // reset Pagination, then build the OData query which we will use in the WebAPI callback
            // wait a minimum user typing inactivity before processing any query
            clearTimeout(timer);
            timer = setTimeout(function () {
                // loop through all columns to inspect filters & set the query
                _this.updateFilters(args.columnFilters);
                _this.resetPaginationOptions();
                resolve(_this.odataService.buildQuery());
            }, debounceTypingDelay);
        });
        return promise;
    };
    /*
     * PAGINATION
     */
    GridOdataService.prototype.processOnPaginationChanged = function (event, args) {
        var pageSize = +(args.pageSize || DEFAULT_PAGE_SIZE);
        this.updatePagination(args.newPage, pageSize);
        // build the OData query which we will use in the WebAPI callback
        return this.odataService.buildQuery();
    };
    /*
     * SORTING
     */
    GridOdataService.prototype.processOnSortChanged = function (event, args) {
        var sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortCol: args.sortCol, sortAsc: args.sortAsc });
        // loop through all columns to inspect sorters & set the query
        this.updateSorters(sortColumns);
        // build the OData query which we will use in the WebAPI callback
        return this.odataService.buildQuery();
    };
    /**
     * loop through all columns to inspect filters & update backend service filteringOptions
     * @param columnFilters
     */
    GridOdataService.prototype.updateFilters = function (columnFilters, isUpdatedByPreset) {
        var searchBy = '';
        var searchByArray = [];
        var _loop_1 = function (columnId) {
            if (columnFilters.hasOwnProperty(columnId)) {
                var columnFilter_1 = columnFilters[columnId];
                // if user defined some "presets", then we need to find the filters from the column definitions instead
                var columnDef = void 0;
                if (isUpdatedByPreset && Array.isArray(this_1._columnDefinitions)) {
                    columnDef = this_1._columnDefinitions.find(function (column) {
                        return column.id === columnFilter_1.columnId;
                    });
                }
                else {
                    columnDef = columnFilter_1.columnDef;
                }
                if (!columnDef) {
                    throw new Error('[Backend Service API]: Something went wrong in trying to get the column definition of the specified filter (or preset filters). Did you make a typo on the filter columnId?');
                }
                var fieldName = columnDef.queryField || columnDef.queryFieldFilter || columnDef.field || columnDef.name || '';
                var fieldType = columnDef.type || 'string';
                var searchTerms = (columnFilter_1 ? columnFilter_1.searchTerms : null) || [];
                var fieldSearchValue = (Array.isArray(searchTerms) && searchTerms.length === 1) ? searchTerms[0] : '';
                if (typeof fieldSearchValue === 'undefined') {
                    fieldSearchValue = '';
                }
                if (typeof fieldSearchValue !== 'string' && !searchTerms) {
                    throw new Error("ODdata filter searchTerm property must be provided as type \"string\", if you use filter with options then make sure your IDs are also string. For example: filter: {type: FilterType.select, collection: [{ id: \"0\", value: \"0\" }, { id: \"1\", value: \"1\" }]");
                }
                fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
                var matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
                var operator = columnFilter_1.operator || ((matches) ? matches[1] : '');
                var searchValue = (!!matches) ? matches[2] : '';
                var lastValueChar = (!!matches) ? matches[3] : (operator === '*z' ? '*' : '');
                var bypassOdataQuery = columnFilter_1.bypassBackendQuery || false;
                // no need to query if search value is empty
                if (fieldName && searchValue === '' && searchTerms.length === 0) {
                    this_1.removeColumnFilter(fieldName);
                    return "continue";
                }
                // escaping the search value
                searchValue = searchValue.replace("'", "''"); // escape single quotes by doubling them
                searchValue = encodeURIComponent(searchValue); // encode URI of the final search value
                // extra query arguments
                if (bypassOdataQuery) {
                    // push to our temp array and also trim white spaces
                    if (fieldName) {
                        this_1.saveColumnFilter(fieldName, fieldSearchValue, searchTerms);
                    }
                }
                else {
                    searchBy = '';
                    // titleCase the fieldName so that it matches the WebApi names
                    if (this_1.odataService.options.caseType === index_1.CaseType.pascalCase) {
                        fieldName = String.titleCase(fieldName || '');
                    }
                    // when having more than 1 search term (then check if we have a "IN" or "NOT IN" filter search)
                    if (searchTerms && searchTerms.length > 1) {
                        var tmpSearchTerms = [];
                        if (operator === 'IN') {
                            // example:: (Stage eq "Expired" or Stage eq "Renewal")
                            for (var j = 0, lnj = searchTerms.length; j < lnj; j++) {
                                tmpSearchTerms.push(fieldName + " eq '" + searchTerms[j] + "'");
                            }
                            searchBy = tmpSearchTerms.join(' or ');
                            searchBy = "(" + searchBy + ")";
                        }
                        else if (operator === 'NIN' || operator === 'NOTIN' || operator === 'NOT IN') {
                            // example:: (Stage ne "Expired" and Stage ne "Renewal")
                            for (var k = 0, lnk = searchTerms.length; k < lnk; k++) {
                                tmpSearchTerms.push(fieldName + " ne '" + searchTerms[k] + "'");
                            }
                            searchBy = tmpSearchTerms.join(' and ');
                            searchBy = "(" + searchBy + ")";
                        }
                    }
                    else if (operator === '*' || operator === 'a*' || operator === '*z' || lastValueChar !== '') {
                        // first/last character is a '*' will be a startsWith or endsWith
                        searchBy = (operator === '*' || operator === '*z')
                            ? "endswith(" + fieldName + ", '" + searchValue + "')"
                            : "startswith(" + fieldName + ", '" + searchValue + "')";
                    }
                    else if (fieldType === index_1.FieldType.date) {
                        // date field needs to be UTC and within DateTime function
                        var dateFormatted = utilities_1.parseUtcDate(searchValue, true);
                        if (dateFormatted) {
                            searchBy = fieldName + " " + this_1.mapOdataOperator(operator) + " DateTime'" + dateFormatted + "'";
                        }
                    }
                    else if (fieldType === index_1.FieldType.string) {
                        // string field needs to be in single quotes
                        if (operator === '') {
                            searchBy = "substringof('" + searchValue + "', " + fieldName + ")";
                        }
                        else {
                            // searchBy = `substringof('${searchValue}', ${fieldNameCased}) ${this.mapOdataOperator(operator)} true`;
                            searchBy = fieldName + " " + this_1.mapOdataOperator(operator) + " '" + searchValue + "'";
                        }
                    }
                    else {
                        // any other field type (or undefined type)
                        searchValue = fieldType === index_1.FieldType.number ? searchValue : "'" + searchValue + "'";
                        searchBy = fieldName + " " + this_1.mapOdataOperator(operator) + " " + searchValue;
                    }
                    // push to our temp array and also trim white spaces
                    if (searchBy !== '') {
                        searchByArray.push(String.trim(searchBy));
                        this_1.saveColumnFilter(fieldName || '', fieldSearchValue, searchTerms);
                    }
                }
            }
        };
        var this_1 = this;
        // loop through all columns to inspect filters
        for (var columnId in columnFilters) {
            _loop_1(columnId);
        }
        // update the service options with filters for the buildQuery() to work later
        this.odataService.updateOptions({
            filter: (searchByArray.length > 0) ? searchByArray.join(' and ') : '',
            skip: undefined
        });
    };
    /**
     * Update the pagination component with it's new page number and size
     * @param newPage
     * @param pageSize
     */
    GridOdataService.prototype.updatePagination = function (newPage, pageSize) {
        this._currentPagination = {
            pageNumber: newPage,
            pageSize: pageSize
        };
        this.odataService.updateOptions({
            top: pageSize,
            skip: (newPage - 1) * pageSize
        });
    };
    /**
     * loop through all columns to inspect sorters & update backend service orderBy
     * @param columnFilters
     */
    GridOdataService.prototype.updateSorters = function (sortColumns, presetSorters) {
        var sortByArray = [];
        var sorterArray = [];
        if (!sortColumns && presetSorters) {
            // make the presets the current sorters, also make sure that all direction are in lowercase for OData
            sortByArray = presetSorters;
            sortByArray.forEach(function (sorter) { return sorter.direction = sorter.direction.toLowerCase(); });
            // display the correct sorting icons on the UI, for that it requires (columnId, sortAsc) properties
            var tmpSorterArray = sortByArray.map(function (sorter) {
                sorterArray.push({
                    columnId: sorter.columnId + '',
                    direction: sorter.direction
                });
                return {
                    columnId: sorter.columnId,
                    sortAsc: sorter.direction.toUpperCase() === index_1.SortDirection.ASC
                };
            });
            this._grid.setSortColumns(tmpSorterArray);
        }
        else if (sortColumns && !presetSorters) {
            // build the SortBy string, it could be multisort, example: customerNo asc, purchaserName desc
            if (sortColumns && sortColumns.length === 0) {
                sortByArray = new Array(this.defaultOptions.orderBy); // when empty, use the default sort
            }
            else {
                if (sortColumns) {
                    for (var _i = 0, sortColumns_1 = sortColumns; _i < sortColumns_1.length; _i++) {
                        var column = sortColumns_1[_i];
                        if (column.sortCol) {
                            var fieldName = (column.sortCol.queryField || column.sortCol.queryFieldSorter || column.sortCol.field || column.sortCol.id) + '';
                            var columnFieldName = (column.sortCol.field || column.sortCol.id) + '';
                            if (this.odataService.options.caseType === index_1.CaseType.pascalCase) {
                                fieldName = String.titleCase(fieldName);
                                columnFieldName = String.titleCase(columnFieldName);
                            }
                            sorterArray.push({
                                columnId: columnFieldName,
                                direction: column.sortAsc ? 'asc' : 'desc'
                            });
                        }
                    }
                    sortByArray = sorterArray;
                }
            }
        }
        // transform the sortby array into a CSV string for OData
        sortByArray = sortByArray;
        var csvString = sortByArray.map(function (sorter) { return sorter.columnId + " " + sorter.direction.toLowerCase(); }).join(',');
        this.odataService.updateOptions({
            orderBy: (this.odataService.options.caseType === index_1.CaseType.pascalCase) ? String.titleCase(csvString) : csvString
        });
        // keep current Sorters and update the service options with the new sorting
        this._currentSorters = sortByArray;
        // build the OData query which we will use in the WebAPI callback
        return this.odataService.buildQuery();
    };
    //
    // private functions
    // -------------------
    /**
     * Cast provided filters (could be in multiple format) into an array of ColumnFilter
     * @param columnFilters
     */
    GridOdataService.prototype.castFilterToColumnFilter = function (columnFilters) {
        // keep current filters & always save it as an array (columnFilters can be an object when it is dealt by SlickGrid Filter)
        var filtersArray = ((typeof columnFilters === 'object') ? Object.keys(columnFilters).map(function (key) { return columnFilters[key]; }) : columnFilters);
        return filtersArray.map(function (filter) {
            var columnDef = filter.columnDef;
            var header = (columnDef) ? (columnDef.headerKey || columnDef.name || '') : '';
            var tmpFilter = { columnId: filter.columnId || '' };
            if (filter.operator) {
                tmpFilter.operator = filter.operator;
            }
            if (Array.isArray(filter.searchTerms)) {
                tmpFilter.searchTerms = filter.searchTerms;
            }
            return tmpFilter;
        });
    };
    /**
     * Mapper for mathematical operators (ex.: <= is "le", > is "gt")
     * @param string operator
     * @returns string map
     */
    GridOdataService.prototype.mapOdataOperator = function (operator) {
        var map = '';
        switch (operator) {
            case '<':
                map = 'lt';
                break;
            case '<=':
                map = 'le';
                break;
            case '>':
                map = 'gt';
                break;
            case '>=':
                map = 'ge';
                break;
            case '<>':
            case '!=':
                map = 'ne';
                break;
            case '=':
            case '==':
            default:
                map = 'eq';
                break;
        }
        return map;
    };
    GridOdataService = __decorate([
        aurelia_framework_1.singleton(true),
        aurelia_framework_1.inject(odata_service_1.OdataService)
    ], GridOdataService);
    return GridOdataService;
}());
exports.GridOdataService = GridOdataService;
//# sourceMappingURL=grid-odata.service.js.map