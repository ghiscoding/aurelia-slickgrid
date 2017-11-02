"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./utilities");
var index_1 = require("./../models/index");
var graphqlQueryBuilder_1 = require("./graphqlQueryBuilder");
var timer;
var GraphqlService = /** @class */ (function () {
    function GraphqlService() {
        this.serviceOptions = {};
        this.defaultOrderBy = { field: 'id', direction: index_1.SortDirection.ASC };
    }
    /**
     * Build the GraphQL query, since the service include/exclude cursor, the output query will be different.
     * @param serviceOptions GraphqlServiceOption
     */
    GraphqlService.prototype.buildQuery = function (serviceOptions) {
        if (!this.serviceOptions.datasetName || !this.serviceOptions.dataFilters) {
            throw new Error('GraphQL Service requires "datasetName" & "dataFilters" properties for it to work');
        }
        var queryQb = new graphqlQueryBuilder_1.default('query');
        var datasetQb = new graphqlQueryBuilder_1.default(this.serviceOptions.datasetName);
        var pageInfoQb = new graphqlQueryBuilder_1.default('pageInfo');
        var dataQb = (this.serviceOptions.isWithCursor) ? new graphqlQueryBuilder_1.default('edges') : new graphqlQueryBuilder_1.default('nodes');
        if (this.serviceOptions.isWithCursor) {
            // ...pageInfo { hasNextPage, endCursor }, edges { cursor, node { _filters_ } }
            pageInfoQb.find('hasNextPage', 'endCursor');
            dataQb.find(['cursor', { node: this.serviceOptions.dataFilters }]);
        }
        else {
            // ...pageInfo { hasNextPage }, nodes { _filters_ }
            pageInfoQb.find('hasNextPage');
            dataQb.find(this.serviceOptions.dataFilters);
        }
        datasetQb.find(['totalCount', pageInfoQb, dataQb]);
        // add dataset filters, could be Pagination and SortingFilters and/or FieldFilters
        var datasetFilters = this.serviceOptions.paginationOptions;
        if (this.serviceOptions.sortingOptions) {
            // orderBy: [{ field:x, direction: 'ASC' }]
            datasetFilters.orderBy = this.serviceOptions.sortingOptions;
        }
        if (this.serviceOptions.filteringOptions) {
            // filterBy: [{ fieldName: date, fieldOperator: '>', fieldValue: '2000-10-10' }]
            datasetFilters.filterBy = this.serviceOptions.filteringOptions;
        }
        // query { users(first: 20, orderBy: [], filterBy: [])}
        datasetQb.filter(datasetFilters);
        queryQb.find(datasetQb);
        var enumSearchProperties = ['direction:', 'field:', 'operator:'];
        return this.trimDoubleQuotesOnEnumField(queryQb.toString(), enumSearchProperties);
    };
    GraphqlService.prototype.initOptions = function (serviceOptions) {
        this.serviceOptions = serviceOptions || {};
    };
    /*
     * Reset the pagination options
     */
    GraphqlService.prototype.resetPaginationOptions = function () {
        var paginationOptions;
        if (this.serviceOptions.isWithCursor) {
            // first, last, after, before
            paginationOptions = {
                after: '',
                before: undefined,
                last: undefined
            };
        }
        else {
            // first, last, offset
            paginationOptions = this.serviceOptions.paginationOptions;
            paginationOptions.offset = 0;
        }
        this.updateOptions({ paginationOptions: paginationOptions });
    };
    GraphqlService.prototype.updateOptions = function (serviceOptions) {
        this.serviceOptions = __assign({}, this.serviceOptions, serviceOptions);
    };
    /*
     * FILTERING
     */
    GraphqlService.prototype.onFilterChanged = function (event, args) {
        var _this = this;
        var searchByArray = [];
        var serviceOptions = args.grid.getOptions();
        if (serviceOptions.onBackendEventApi === undefined || !serviceOptions.onBackendEventApi.filterTypingDebounce) {
            throw new Error('Something went wrong in the GraphqlService, "onBackendEventApi" is not initialized');
        }
        var debounceTypingDelay = 0;
        if (event.type === 'keyup' || event.type === 'keydown') {
            debounceTypingDelay = serviceOptions.onBackendEventApi.filterTypingDebounce || 700;
        }
        var promise = new Promise(function (resolve, reject) {
            if (!args || !args.grid) {
                throw new Error('Something went wrong when trying to attach the "attachBackendOnFilterSubscribe(event, args)" function, it seems that "args" is not populated correctly');
            }
            // loop through all columns to inspect filters
            for (var columnId in args.columnFilters) {
                if (args.columnFilters.hasOwnProperty(columnId)) {
                    var columnFilter = args.columnFilters[columnId];
                    var columnDef = columnFilter.columnDef;
                    var fieldName = columnDef.field || columnDef.name || '';
                    var fieldType = columnDef.type || 'string';
                    var fieldSearchValue = columnFilter.searchTerm;
                    if (typeof fieldSearchValue === 'undefined') {
                        fieldSearchValue = '';
                    }
                    if (typeof fieldSearchValue !== 'string') {
                        throw new Error("GraphQL filter term property must be provided type \"string\", if you use filter with options then make sure your ids are also string. For example: filter: {type: FormElementType.select, selectOptions: [{ id: \"0\", value: \"0\" }, { id: \"1\", value: \"1\" }]");
                    }
                    var searchTerms = columnFilter.listTerm || [];
                    fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
                    var matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
                    var operator = columnFilter.operator || ((matches) ? matches[1] : '');
                    var searchValue = (!!matches) ? matches[2] : '';
                    var lastValueChar = (!!matches) ? matches[3] : '';
                    // no need to query if search value is empty
                    if (fieldName && searchValue === '') {
                        // this.removeColumnFilter(fieldName);
                        continue;
                    }
                    // escaping the search value
                    searchValue = searchValue.replace("'", "''"); // escape single quotes by doubling them
                    searchValue = encodeURIComponent(searchValue); // encode URI of the final search value
                    if (operator === '*' || lastValueChar === '*') {
                        operator = (operator === '*') ? 'endsWith' : 'startsWith';
                    }
                    searchByArray.push({
                        field: fieldName,
                        operator: utilities_1.mapOperatorType(operator),
                        value: searchValue
                    });
                }
            }
            _this.updateOptions({ filteringOptions: searchByArray });
            // reset Pagination, then build the GraphQL query which we will use in the WebAPI callback
            // wait a minimum user typing inactivity before processing any query
            clearTimeout(timer);
            timer = setTimeout(function () {
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
     *     pageInfo {
     *       hasNextPage
     *     }
     *     nodes {
     *       name
     *       gender
     *     }
     *   }
     */
    GraphqlService.prototype.onPaginationChanged = function (event, args) {
        var paginationOptions;
        if (this.serviceOptions.isWithCursor) {
            paginationOptions = {
                first: args.pageSize
            };
        }
        else {
            paginationOptions = {
                first: args.pageSize,
                offset: (args.newPage - 1) * args.pageSize
            };
        }
        this.updateOptions({ paginationOptions: paginationOptions });
        // build the GraphQL query which we will use in the WebAPI callback
        return this.buildQuery();
    };
    /*
     * SORTING
     * we will use sorting as per a Facebook suggestion on a Github issue (with some small changes)
     * https://github.com/graphql/graphql-relay-js/issues/20#issuecomment-220494222
     */
    GraphqlService.prototype.onSortChanged = function (event, args) {
        var sortByArray = [];
        var sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortCol: args.sortCol, sortAsc: args.sortAsc });
        // build the orderBy array, it could be multisort, example
        // orderBy:[{sort: lastName, direction: ASC}, {sort: firstName, direction: DESC}]
        if (sortColumns && sortColumns.length === 0) {
            sortByArray = new Array(this.defaultOrderBy); // when empty, use the default sort
        }
        else {
            if (sortColumns) {
                for (var _i = 0, sortColumns_1 = sortColumns; _i < sortColumns_1.length; _i++) {
                    var column = sortColumns_1[_i];
                    var fieldName = column.sortCol.field || column.sortCol.id;
                    var direction = column.sortAsc ? index_1.SortDirection.ASC : index_1.SortDirection.DESC;
                    sortByArray.push({
                        field: fieldName,
                        direction: direction
                    });
                }
            }
        }
        this.updateOptions({ sortingOptions: sortByArray });
        // build the GraphQL query which we will use in the WebAPI callback
        return this.buildQuery();
    };
    /**
     * A function which takes an input string and removes double quotes only
     * on certain fields are identified as GraphQL enums
     * For example let say we identified ("direction:", "sort") as word which are GraphQL enum fields
     * then the result will be:
     * FROM
     * query { users (orderBy:[{sort:"firstName", direction:"ASC"} }
     * TO
     * query { users (orderBy:[{sort: firstName, direction: ASC}}
     * @param inputStr input string
     * @param enumSearchWords array of enum words to filter
     * @returns outputStr output string
     */
    GraphqlService.prototype.trimDoubleQuotesOnEnumField = function (inputStr, enumSearchWords) {
        var patternWordInQuotes = "s?(\".*?\")";
        var patternRegex = enumSearchWords.join(patternWordInQuotes + '|');
        patternRegex += patternWordInQuotes; // the last one should also have the pattern but without the pipe "|"
        // example with (sort: & direction:):  /sort:s?(".*?")|direction:s?(".*?")/
        var reg = new RegExp(patternRegex, 'g');
        return inputStr.replace(reg, function (group1, group2, group3) {
            var rep = group1.replace(/"/g, '');
            return rep;
        });
    };
    return GraphqlService;
}());
exports.GraphqlService = GraphqlService;
//# sourceMappingURL=graphql.service.js.map