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
import './global-utilities';
import { inject } from 'aurelia-framework';
import { parseUtcDate } from './utilities';
import { CaseType, FieldType } from './../models/index';
import { OdataService } from './odata.service';
var timer;
var DEFAULT_FILTER_TYPING_DEBOUNCE = 750;
var DEFAULT_ITEMS_PER_PAGE = 25;
var GridOdataService = /** @class */ (function () {
    function GridOdataService(odataService) {
        this.odataService = odataService;
        this.defaultOptions = {
            top: DEFAULT_ITEMS_PER_PAGE,
            orderBy: ''
        };
    }
    GridOdataService.prototype.buildQuery = function () {
        return this.odataService.buildQuery();
    };
    GridOdataService.prototype.initOptions = function (options, pagination) {
        this.odataService.options = __assign({}, this.defaultOptions, options, { top: options.top || (pagination ? pagination.pageSize : null) || this.defaultOptions.top });
        this.options = options;
        this.pagination = pagination;
    };
    GridOdataService.prototype.updateOptions = function (serviceOptions) {
        this.options = __assign({}, this.options, serviceOptions);
    };
    GridOdataService.prototype.removeColumnFilter = function (fieldName) {
        this.odataService.removeColumnFilter(fieldName);
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
    GridOdataService.prototype.onFilterChanged = function (event, args) {
        var _this = this;
        var searchBy = '';
        var searchByArray = [];
        var serviceOptions = args.grid.getOptions();
        var backendApi = serviceOptions.backendServiceApi || serviceOptions.onBackendEventApi;
        if (backendApi === undefined) {
            throw new Error('Something went wrong in the GridOdataService, "backendServiceApi" is not initialized');
        }
        // only add a delay when user is typing, on select dropdown filter it will execute right away
        var debounceTypingDelay = 0;
        if (event.type === 'keyup' || event.type === 'keydown') {
            debounceTypingDelay = backendApi.filterTypingDebounce || DEFAULT_FILTER_TYPING_DEBOUNCE;
        }
        var promise = new Promise(function (resolve, reject) {
            // loop through all columns to inspect filters
            for (var columnId in args.columnFilters) {
                if (args.columnFilters.hasOwnProperty(columnId)) {
                    var columnFilter = args.columnFilters[columnId];
                    var columnDef = columnFilter.columnDef;
                    if (!columnDef) {
                        return;
                    }
                    var fieldName = columnDef.queryField || columnDef.field || columnDef.name;
                    var fieldType = columnDef.type || 'string';
                    var searchTerms = (columnFilter ? columnFilter.searchTerms : null) || [];
                    var fieldSearchValue = columnFilter.searchTerm;
                    if (typeof fieldSearchValue === 'undefined') {
                        fieldSearchValue = '';
                    }
                    if (typeof fieldSearchValue !== 'string' && !searchTerms) {
                        throw new Error("ODdata filter searchTerm property must be provided as type \"string\", if you use filter with options then make sure your IDs are also string. For example: filter: {type: FilterType.select, collection: [{ id: \"0\", value: \"0\" }, { id: \"1\", value: \"1\" }]");
                    }
                    fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
                    var matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
                    var operator = columnFilter.operator || ((matches) ? matches[1] : '');
                    var searchValue = (!!matches) ? matches[2] : '';
                    var lastValueChar = (!!matches) ? matches[3] : '';
                    var bypassOdataQuery = columnFilter.bypassBackendQuery || false;
                    // no need to query if search value is empty
                    if (fieldName && searchValue === '') {
                        _this.removeColumnFilter(fieldName);
                        continue;
                    }
                    // escaping the search value
                    searchValue = searchValue.replace("'", "''"); // escape single quotes by doubling them
                    searchValue = encodeURIComponent(searchValue); // encode URI of the final search value
                    // extra query arguments
                    if (bypassOdataQuery) {
                        // push to our temp array and also trim white spaces
                        if (fieldName) {
                            _this.saveColumnFilter(fieldName, fieldSearchValue, searchTerms);
                        }
                    }
                    else {
                        searchBy = '';
                        // titleCase the fieldName so that it matches the WebApi names
                        var fieldNameTitleCase = String.titleCase(fieldName || '');
                        // when having more than 1 search term (then check if we have a "IN" or "NOT IN" filter search)
                        if (searchTerms && searchTerms.length > 0) {
                            var tmpSearchTerms = [];
                            if (operator === 'IN') {
                                // example:: (Stage eq "Expired" or Stage eq "Renewal")
                                for (var j = 0, lnj = searchTerms.length; j < lnj; j++) {
                                    tmpSearchTerms.push(fieldNameTitleCase + " eq '" + searchTerms[j] + "'");
                                }
                                searchBy = tmpSearchTerms.join(' or ');
                                searchBy = "(" + searchBy + ")";
                            }
                            else if (operator === 'NIN' || operator === 'NOTIN' || operator === 'NOT IN') {
                                // example:: (Stage ne "Expired" and Stage ne "Renewal")
                                for (var k = 0, lnk = searchTerms.length; k < lnk; k++) {
                                    tmpSearchTerms.push(fieldNameTitleCase + " ne '" + searchTerms[k] + "'");
                                }
                                searchBy = tmpSearchTerms.join(' and ');
                                searchBy = "(" + searchBy + ")";
                            }
                        }
                        else if (operator === '*' || lastValueChar !== '') {
                            // first/last character is a '*' will be a startsWith or endsWith
                            searchBy = operator === '*'
                                ? "endswith(" + fieldNameTitleCase + ", '" + searchValue + "')"
                                : "startswith(" + fieldNameTitleCase + ", '" + searchValue + "')";
                        }
                        else if (fieldType === FieldType.date) {
                            // date field needs to be UTC and within DateTime function
                            var dateFormatted = parseUtcDate(searchValue, true);
                            if (dateFormatted) {
                                searchBy = fieldNameTitleCase + " " + _this.mapOdataOperator(operator) + " DateTime'" + dateFormatted + "'";
                            }
                        }
                        else if (fieldType === FieldType.string) {
                            // string field needs to be in single quotes
                            searchBy = "substringof('" + searchValue + "', " + fieldNameTitleCase + ")";
                        }
                        else {
                            // any other field type (or undefined type)
                            searchValue = fieldType === FieldType.number ? searchValue : "'" + searchValue + "'";
                            searchBy = fieldNameTitleCase + " " + _this.mapOdataOperator(operator) + " " + searchValue;
                        }
                        // push to our temp array and also trim white spaces
                        if (searchBy !== '') {
                            searchByArray.push(String.trim(searchBy));
                            _this.saveColumnFilter(fieldName || '', fieldSearchValue, searchTerms);
                        }
                    }
                }
            }
            // build the filter query
            _this.odataService.updateOptions({
                filter: (searchByArray.length > 0) ? searchByArray.join(' and ') : '',
                skip: undefined
            });
            // reset Pagination, then build the OData query which we will use in the WebAPI callback
            // wait a minimum user typing inactivity before processing any query
            clearTimeout(timer);
            timer = setTimeout(function () {
                _this.resetPaginationOptions();
                resolve(_this.odataService.buildQuery());
            }, debounceTypingDelay);
        });
        return promise;
    };
    /*
     * PAGINATION
     */
    GridOdataService.prototype.onPaginationChanged = function (event, args) {
        var pageSize = +args.pageSize || 20;
        this.odataService.updateOptions({
            top: pageSize,
            skip: (args.newPage - 1) * pageSize
        });
        // build the OData query which we will use in the WebAPI callback
        return this.odataService.buildQuery();
    };
    /*
     * SORTING
     */
    GridOdataService.prototype.onSortChanged = function (event, args) {
        var sortByArray = [];
        var sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortCol: args.sortCol, sortAsc: args.sortAsc });
        // build the SortBy string, it could be multisort, example: customerNo asc, purchaserName desc
        if (sortColumns && sortColumns.length === 0) {
            sortByArray = new Array(this.defaultOptions.orderBy); // when empty, use the default sort
        }
        else {
            if (sortColumns) {
                for (var _i = 0, sortColumns_1 = sortColumns; _i < sortColumns_1.length; _i++) {
                    var column = sortColumns_1[_i];
                    var fieldName = column.sortCol.queryField || column.sortCol.field || column.sortCol.id;
                    if (this.odataService.options.caseType === CaseType.pascalCase) {
                        fieldName = String.titleCase(fieldName);
                    }
                    var direction = column.sortAsc ? 'asc' : 'desc';
                    var sortByColumnString = fieldName + " " + direction;
                    sortByArray.push(sortByColumnString);
                }
            }
        }
        // transform the sortby array into a CSV string
        var csvArray = sortByArray.join(',');
        this.odataService.updateOptions({
            orderBy: (this.odataService.options.caseType === CaseType.pascalCase) ? String.titleCase(csvArray) : csvArray
        });
        // build the OData query which we will use in the WebAPI callback
        return this.odataService.buildQuery();
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
        inject(OdataService)
    ], GridOdataService);
    return GridOdataService;
}());
export { GridOdataService };
//# sourceMappingURL=grid-odata.service.js.map