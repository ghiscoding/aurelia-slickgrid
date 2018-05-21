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
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "./utilities", "./../models/index", "./graphqlQueryBuilder"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, utilities_1, index_1, graphqlQueryBuilder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // timer for keeping track of user typing waits
    var timer;
    var DEFAULT_FILTER_TYPING_DEBOUNCE = 750;
    var DEFAULT_ITEMS_PER_PAGE = 25;
    var DEFAULT_PAGE_SIZE = 20;
    var GraphqlService = /** @class */ (function () {
        function GraphqlService(i18n) {
            this.i18n = i18n;
            this.defaultOrderBy = { field: 'id', direction: index_1.SortDirection.ASC };
            this.defaultPaginationOptions = {
                first: DEFAULT_ITEMS_PER_PAGE,
                offset: 0
            };
        }
        Object.defineProperty(GraphqlService.prototype, "_gridOptions", {
            /** Getter for the Grid Options pulled through the Grid Object */
            get: function () {
                return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphqlService.prototype, "_columnDefinitions", {
            /** Getter for the Column Definitions pulled through the Grid Object */
            get: function () {
                return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Build the GraphQL query, since the service include/exclude cursor, the output query will be different.
         * @param serviceOptions GraphqlServiceOption
         */
        GraphqlService.prototype.buildQuery = function () {
            if (!this.options || !this.options.datasetName || (!this._columnDefinitions && !this.options.columnDefinitions)) {
                throw new Error('GraphQL Service requires "datasetName" & "columnDefinitions" properties for it to work');
            }
            // get the column definitions and exclude some if they were tagged as excluded
            var columnDefinitions = this._columnDefinitions || this.options.columnDefinitions;
            columnDefinitions = columnDefinitions.filter(function (column) { return !column.excludeFromQuery; });
            var queryQb = new graphqlQueryBuilder_1.default('query');
            var datasetQb = new graphqlQueryBuilder_1.default(this.options.datasetName);
            var dataQb = (this.options.isWithCursor) ? new graphqlQueryBuilder_1.default('edges') : new graphqlQueryBuilder_1.default('nodes');
            // get all the columnds Ids for the filters to work
            var columnIds = [];
            if (columnDefinitions && Array.isArray(columnDefinitions)) {
                for (var _i = 0, columnDefinitions_1 = columnDefinitions; _i < columnDefinitions_1.length; _i++) {
                    var column = columnDefinitions_1[_i];
                    columnIds.push(column.field);
                    // if extra "fields" are passed, also push them to columnIds
                    if (column.fields) {
                        columnIds.push.apply(columnIds, column.fields);
                    }
                }
                // columnIds = columnDefinitions.map((column) => column.field);
            }
            else {
                columnIds = this.options.columnIds || [];
            }
            // Slickgrid also requires the "id" field to be part of DataView
            // add it to the GraphQL query if it wasn't already part of the list
            if (columnIds.indexOf('id') === -1) {
                columnIds.unshift('id');
            }
            var filters = this.buildFilterQuery(columnIds);
            if (this.options.isWithCursor) {
                // ...pageInfo { hasNextPage, endCursor }, edges { cursor, node { _filters_ } }
                var pageInfoQb = new graphqlQueryBuilder_1.default('pageInfo');
                pageInfoQb.find('hasNextPage', 'endCursor');
                dataQb.find(['cursor', { node: filters }]);
                datasetQb.find(['totalCount', pageInfoQb, dataQb]);
            }
            else {
                // ...nodes { _filters_ }
                dataQb.find(filters);
                datasetQb.find(['totalCount', dataQb]);
            }
            // add dataset filters, could be Pagination and SortingFilters and/or FieldFilters
            var datasetFilters = __assign({}, this.options.paginationOptions, { first: ((this.options.paginationOptions && this.options.paginationOptions.first) ? this.options.paginationOptions.first : ((this.pagination && this.pagination.pageSize) ? this.pagination.pageSize : null)) || this.defaultPaginationOptions.first });
            if (!this.options.isWithCursor) {
                datasetFilters.offset = ((this.options.paginationOptions && this.options.paginationOptions.hasOwnProperty('offset')) ? +this.options.paginationOptions['offset'] : 0);
            }
            if (this.options.sortingOptions && Array.isArray(this.options.sortingOptions) && this.options.sortingOptions.length > 0) {
                // orderBy: [{ field:x, direction: 'ASC' }]
                datasetFilters.orderBy = this.options.sortingOptions;
            }
            if (this.options.filteringOptions && Array.isArray(this.options.filteringOptions) && this.options.filteringOptions.length > 0) {
                // filterBy: [{ field: date, operator: '>', value: '2000-10-10' }]
                datasetFilters.filterBy = this.options.filteringOptions;
            }
            if (this.options.addLocaleIntoQuery) {
                // first: 20, ... locale: "en-CA"
                datasetFilters.locale = this.i18n.getLocale() || 'en';
            }
            if (this.options.extraQueryArguments) {
                // first: 20, ... userId: 123
                for (var _a = 0, _b = this.options.extraQueryArguments; _a < _b.length; _a++) {
                    var queryArgument = _b[_a];
                    datasetFilters[queryArgument.field] = queryArgument.value;
                }
            }
            // query { users(first: 20, orderBy: [], filterBy: [])}
            datasetQb.filter(datasetFilters);
            queryQb.find(datasetQb);
            var enumSearchProperties = ['direction:', 'field:', 'operator:'];
            return this.trimDoubleQuotesOnEnumField(queryQb.toString(), enumSearchProperties, this.options.keepArgumentFieldDoubleQuotes || false);
        };
        /**
         * From an input array of strings, we want to build a GraphQL query string.
         * The process has to take the dot notation and parse it into a valid GraphQL query
         * Following this SO answer https://stackoverflow.com/a/47705476/1212166
         *
         * INPUT
         *  ['firstName', 'lastName', 'billing.address.street', 'billing.address.zip']
         * OUTPUT
         * firstName, lastName, billing{address{street, zip}}
         * @param inputArray
         */
        GraphqlService.prototype.buildFilterQuery = function (inputArray) {
            var set = function (o, a) {
                if (o === void 0) { o = {}; }
                var k = a.shift();
                o[k] = a.length ? set(o[k], a) : null;
                return o;
            };
            var output = inputArray.reduce(function (o, a) { return set(o, a.split('.')); }, {});
            return JSON.stringify(output)
                .replace(/\"|\:|null/g, '')
                .replace(/^\{/, '')
                .replace(/\}$/, '');
        };
        /**
         * Initialize the Service
         * @param GraphQL Service Options
         * @param pagination
         * @param grid
         */
        GraphqlService.prototype.init = function (serviceOptions, pagination, grid) {
            this._grid = grid;
            this.options = serviceOptions || {};
            if (pagination) {
                this.pagination = pagination;
            }
        };
        /**
         * Get an initialization of Pagination options
         * @return Pagination Options
         */
        GraphqlService.prototype.getInitPaginationOptions = function () {
            return (this.options.isWithCursor) ? { first: (this.pagination ? this.pagination.pageSize : DEFAULT_ITEMS_PER_PAGE) } : { first: (this.pagination ? this.pagination.pageSize : DEFAULT_ITEMS_PER_PAGE), offset: 0 };
        };
        /** Get the GraphQL dataset name */
        GraphqlService.prototype.getDatasetName = function () {
            return this.options.datasetName || '';
        };
        /** Get the Filters that are currently used by the grid */
        GraphqlService.prototype.getCurrentFilters = function () {
            return this._currentFilters;
        };
        /** Get the Pagination that is currently used by the grid */
        GraphqlService.prototype.getCurrentPagination = function () {
            return this._currentPagination;
        };
        /** Get the Sorters that are currently used by the grid */
        GraphqlService.prototype.getCurrentSorters = function () {
            return this._currentSorters;
        };
        /*
         * Reset the pagination options
         */
        GraphqlService.prototype.resetPaginationOptions = function () {
            var paginationOptions;
            if (this.options.isWithCursor) {
                // first, last, after, before
                paginationOptions = {
                    after: '',
                    before: undefined,
                    last: undefined
                };
            }
            else {
                // first, last, offset
                paginationOptions = (this.options.paginationOptions || this.getInitPaginationOptions());
                paginationOptions.offset = 0;
            }
            // save current pagination as Page 1 and page size as "first" set size
            this._currentPagination = {
                pageNumber: 1,
                pageSize: paginationOptions.first || DEFAULT_PAGE_SIZE
            };
            this.updateOptions({ paginationOptions: paginationOptions });
        };
        GraphqlService.prototype.updateOptions = function (serviceOptions) {
            this.options = __assign({}, this.options, serviceOptions);
        };
        /*
         * FILTERING
         */
        GraphqlService.prototype.onFilterChanged = function (event, args) {
            var _this = this;
            var gridOptions = this._gridOptions || args.grid.getOptions();
            var backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
            if (backendApi === undefined) {
                throw new Error('Something went wrong in the GraphqlService, "backendServiceApi" is not initialized');
            }
            // only add a delay when user is typing, on select dropdown filter it will execute right away
            var debounceTypingDelay = 0;
            if (event && (event.type === 'keyup' || event.type === 'keydown')) {
                debounceTypingDelay = backendApi.filterTypingDebounce || DEFAULT_FILTER_TYPING_DEBOUNCE;
            }
            var promise = new Promise(function (resolve, reject) {
                if (!args || !args.grid) {
                    throw new Error('Something went wrong when trying create the GraphQL Backend Service, it seems that "args" is not populated correctly');
                }
                // reset Pagination, then build the GraphQL query which we will use in the WebAPI callback
                // wait a minimum user typing inactivity before processing any query
                clearTimeout(timer);
                timer = setTimeout(function () {
                    // loop through all columns to inspect filters & set the query
                    _this.updateFilters(args.columnFilters, false);
                    _this.resetPaginationOptions();
                    resolve(_this.buildQuery());
                }, debounceTypingDelay);
            });
            return promise;
        };
        /*
         * PAGINATION
         * With cursor, the query can have 4 arguments (first, after, last, before), for example:
         *   users (first:20, after:"YXJyYXljb25uZWN0aW9uOjM=") {
         *     totalCount
         *     pageInfo {
         *       hasNextPage
         *       endCursor
         *     }
         *     edges {
         *       cursor
         *       node {
         *         name
         *         gender
         *       }
         *     }
         *   }
         * Without cursor, the query can have 3 arguments (first, last, offset), for example:
         *   users (first:20, offset: 10) {
         *     totalCount
         *     nodes {
         *       name
         *       gender
         *     }
         *   }
         */
        GraphqlService.prototype.onPaginationChanged = function (event, args) {
            var pageSize = +(args.pageSize || ((this.pagination) ? this.pagination.pageSize : DEFAULT_PAGE_SIZE));
            this.updatePagination(args.newPage, pageSize);
            // build the GraphQL query which we will use in the WebAPI callback
            return this.buildQuery();
        };
        /*
         * SORTING
         * we will use sorting as per a Facebook suggestion on a Github issue (with some small changes)
         * https://github.com/graphql/graphql-relay-js/issues/20#issuecomment-220494222
         */
        GraphqlService.prototype.onSortChanged = function (event, args) {
            var sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortCol: args.sortCol, sortAsc: args.sortAsc });
            // loop through all columns to inspect sorters & set the query
            this.updateSorters(sortColumns);
            // build the GraphQL query which we will use in the WebAPI callback
            return this.buildQuery();
        };
        /**
         * loop through all columns to inspect filters & update backend service filteringOptions
         * @param columnFilters
         */
        GraphqlService.prototype.updateFilters = function (columnFilters, isUpdatedByPreset) {
            // keep current filters & always save it as an array (columnFilters can be an object when it is dealt by SlickGrid Filter)
            this._currentFilters = this.castFilterToColumnFilter(columnFilters);
            var searchByArray = [];
            var searchValue;
            var _loop_1 = function (columnId) {
                if (columnFilters.hasOwnProperty(columnId)) {
                    var columnFilter_1 = columnFilters[columnId];
                    // if user defined some "presets", then we need to find the filters from the column definitions instead
                    var columnDef = void 0;
                    if (isUpdatedByPreset && Array.isArray(this_1._columnDefinitions)) {
                        columnDef = this_1._columnDefinitions.find(function (column) { return column.id === columnFilter_1.columnId; });
                    }
                    else {
                        columnDef = columnFilter_1.columnDef;
                    }
                    if (!columnDef) {
                        throw new Error('[Backend Service API]: Something went wrong in trying to get the column definition of the specified filter (or preset filters). Did you make a typo on the filter columnId?');
                    }
                    var fieldName = columnDef.queryField || columnDef.queryFieldFilter || columnDef.field || columnDef.name || '';
                    var searchTerms = (columnFilter_1 ? columnFilter_1.searchTerms : null) || [];
                    var fieldSearchValue = columnFilter_1.searchTerm;
                    if (typeof fieldSearchValue === 'undefined') {
                        fieldSearchValue = '';
                    }
                    if (typeof fieldSearchValue !== 'string' && !searchTerms) {
                        throw new Error("GraphQL filter searchTerm property must be provided as type \"string\", if you use filter with options then make sure your IDs are also string. For example: filter: {type: FilterType.select, collection: [{ id: \"0\", value: \"0\" }, { id: \"1\", value: \"1\" }]");
                    }
                    fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
                    var matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
                    var operator = columnFilter_1.operator || ((matches) ? matches[1] : '');
                    searchValue = (!!matches) ? matches[2] : '';
                    var lastValueChar = (!!matches) ? matches[3] : (operator === '*z' ? '*' : '');
                    // no need to query if search value is empty
                    if (fieldName && searchValue === '' && searchTerms.length === 0) {
                        return "continue";
                    }
                    // when having more than 1 search term (we need to create a CSV string for GraphQL "IN" or "NOT IN" filter search)
                    if (searchTerms && searchTerms.length > 0) {
                        searchValue = searchTerms.join(',');
                    }
                    else if (typeof searchValue === 'string') {
                        // escaping the search value
                        searchValue = searchValue.replace("'", "''"); // escape single quotes by doubling them
                        if (operator === '*' || operator === 'a*' || operator === '*z' || lastValueChar === '*') {
                            operator = (operator === '*' || operator === '*z') ? 'endsWith' : 'startsWith';
                        }
                    }
                    // if we didn't find an Operator but we have a Filter Type, we should use default Operator
                    // multipleSelect is "IN", while singleSelect is "EQ", else don't map any operator
                    if (!operator && columnDef.filter) {
                        operator = utilities_1.mapOperatorByFilterType(columnDef.filter.type || '');
                    }
                    // if we still don't have an operator find the proper Operator to use by it's field type
                    if (!operator) {
                        operator = utilities_1.mapOperatorByFieldType(columnDef.type || index_1.FieldType.string);
                    }
                    // build the search array
                    searchByArray.push({
                        field: fieldName,
                        operator: utilities_1.mapOperatorType(operator),
                        value: searchValue
                    });
                }
            };
            var this_1 = this;
            for (var columnId in columnFilters) {
                _loop_1(columnId);
            }
            // update the service options with filters for the buildQuery() to work later
            this.updateOptions({ filteringOptions: searchByArray });
        };
        /**
         * Update the pagination component with it's new page number and size
         * @param newPage
         * @param pageSize
         */
        GraphqlService.prototype.updatePagination = function (newPage, pageSize) {
            this._currentPagination = {
                pageNumber: newPage,
                pageSize: pageSize
            };
            var paginationOptions;
            if (this.options.isWithCursor) {
                paginationOptions = {
                    first: pageSize
                };
            }
            else {
                paginationOptions = {
                    first: pageSize,
                    offset: (newPage - 1) * pageSize
                };
            }
            this.updateOptions({ paginationOptions: paginationOptions });
        };
        /**
         * loop through all columns to inspect sorters & update backend service sortingOptions
         * @param columnFilters
         */
        GraphqlService.prototype.updateSorters = function (sortColumns, presetSorters) {
            var _this = this;
            var currentSorters = [];
            var graphqlSorters = [];
            if (!sortColumns && presetSorters) {
                // make the presets the current sorters, also make sure that all direction are in uppercase for GraphQL
                currentSorters = presetSorters;
                currentSorters.forEach(function (sorter) { return sorter.direction = sorter.direction.toUpperCase(); });
                // display the correct sorting icons on the UI, for that it requires (columnId, sortAsc) properties
                var tmpSorterArray = currentSorters.map(function (sorter) {
                    var columnDef = _this._columnDefinitions.find(function (column) { return column.id === sorter.columnId; });
                    if (columnDef) {
                        graphqlSorters.push({
                            field: (columnDef.queryField || columnDef.queryFieldSorter || columnDef.field || columnDef.id) + '',
                            direction: sorter.direction
                        });
                    }
                    return {
                        columnId: sorter.columnId,
                        sortAsc: sorter.direction.toUpperCase() === index_1.SortDirection.ASC
                    };
                });
                this._grid.setSortColumns(tmpSorterArray);
            }
            else if (sortColumns && !presetSorters) {
                // build the orderBy array, it could be multisort, example
                // orderBy:[{field: lastName, direction: ASC}, {field: firstName, direction: DESC}]
                if (sortColumns && sortColumns.length === 0) {
                    graphqlSorters = new Array(this.defaultOrderBy); // when empty, use the default sort
                    currentSorters = new Array({ columnId: this.defaultOrderBy.field, direction: this.defaultOrderBy.direction });
                }
                else {
                    if (sortColumns) {
                        for (var _i = 0, sortColumns_1 = sortColumns; _i < sortColumns_1.length; _i++) {
                            var column = sortColumns_1[_i];
                            if (column && column.sortCol) {
                                currentSorters.push({
                                    columnId: column.sortCol.id + '',
                                    direction: column.sortAsc ? index_1.SortDirection.ASC : index_1.SortDirection.DESC
                                });
                                graphqlSorters.push({
                                    field: (column.sortCol.queryField || column.sortCol.queryFieldSorter || column.sortCol.field || column.sortCol.id) + '',
                                    direction: column.sortAsc ? index_1.SortDirection.ASC : index_1.SortDirection.DESC
                                });
                            }
                        }
                    }
                }
            }
            // keep current Sorters and update the service options with the new sorting
            this._currentSorters = currentSorters;
            this.updateOptions({ sortingOptions: graphqlSorters });
        };
        /**
         * A function which takes an input string and removes double quotes only
         * on certain fields are identified as GraphQL enums (except fields with dot notation)
         * For example let say we identified ("direction:", "sort") as word which are GraphQL enum fields
         * then the result will be:
         * FROM
         * query { users (orderBy:[{field:"firstName", direction:"ASC"} }]) }
         * TO
         * query { users (orderBy:[{field: firstName, direction: ASC}})}
         *
         * EXCEPTIONS (fields with dot notation "." which are inside a "field:")
         * these fields will keep double quotes while everything else will be stripped of double quotes
         * query { users (orderBy:[{field:"billing.street.name", direction: "ASC"} }
         * TO
         * query { users (orderBy:[{field:"billing.street.name", direction: ASC}}
         * @param inputStr input string
         * @param enumSearchWords array of enum words to filter
         * @returns outputStr output string
         */
        GraphqlService.prototype.trimDoubleQuotesOnEnumField = function (inputStr, enumSearchWords, keepArgumentFieldDoubleQuotes) {
            var patternWordInQuotes = "s?((field:s*)?\".*?\")";
            var patternRegex = enumSearchWords.join(patternWordInQuotes + '|');
            patternRegex += patternWordInQuotes; // the last one should also have the pattern but without the pipe "|"
            // example with (field: & direction:):  /field:s?(".*?")|direction:s?(".*?")/
            var reg = new RegExp(patternRegex, 'g');
            return inputStr.replace(reg, function (group1, group2, group3) {
                // remove double quotes except when the string starts with a "field:"
                var removeDoubleQuotes = true;
                if (group1.startsWith('field:') && keepArgumentFieldDoubleQuotes) {
                    removeDoubleQuotes = false;
                }
                var rep = removeDoubleQuotes ? group1.replace(/"/g, '') : group1;
                return rep;
            });
        };
        //
        // private functions
        // -------------------
        /**
         * Cast provided filters (could be in multiple format) into an array of ColumnFilter
         * @param columnFilters
         */
        GraphqlService.prototype.castFilterToColumnFilter = function (columnFilters) {
            // keep current filters & always save it as an array (columnFilters can be an object when it is dealt by SlickGrid Filter)
            var filtersArray = (typeof columnFilters === 'object') ? Object.keys(columnFilters).map(function (key) { return columnFilters[key]; }) : columnFilters;
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
                else {
                    tmpFilter.searchTerm = filter.searchTerm;
                }
                return tmpFilter;
            });
        };
        GraphqlService = __decorate([
            aurelia_framework_1.inject(aurelia_i18n_1.I18N)
        ], GraphqlService);
        return GraphqlService;
    }());
    exports.GraphqlService = GraphqlService;
});
//# sourceMappingURL=graphql.service.js.map