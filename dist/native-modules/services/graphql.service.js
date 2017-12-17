var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { mapOperatorType } from './utilities';
import QueryBuilder from './graphqlQueryBuilder';
import { SortDirection } from './../models/index';
// timer for keeping track of user typing waits
var timer;
var GraphqlService = /** @class */ (function () {
    function GraphqlService() {
        this.serviceOptions = {};
        this.defaultOrderBy = { field: 'id', direction: SortDirection.ASC };
    }
    /**
     * Build the GraphQL query, since the service include/exclude cursor, the output query will be different.
     * @param serviceOptions GraphqlServiceOption
     */
    GraphqlService.prototype.buildQuery = function () {
        if (!this.serviceOptions || !this.serviceOptions.datasetName || (!this.serviceOptions.columnIds && !this.serviceOptions.dataFilters && !this.serviceOptions.columnDefinitions)) {
            throw new Error('GraphQL Service requires "datasetName" & ("dataFilters" or "columnDefinitions") properties for it to work');
        }
        var queryQb = new QueryBuilder('query');
        var datasetQb = new QueryBuilder(this.serviceOptions.datasetName);
        var pageInfoQb = new QueryBuilder('pageInfo');
        var dataQb = (this.serviceOptions.isWithCursor) ? new QueryBuilder('edges') : new QueryBuilder('nodes');
        // get all the columnds Ids for the filters to work
        var columnIds;
        if (this.serviceOptions.columnDefinitions) {
            columnIds = Array.isArray(this.serviceOptions.columnDefinitions) ? this.serviceOptions.columnDefinitions.map(function (column) { return column.field; }) : [];
        }
        else {
            columnIds = this.serviceOptions.columnIds || this.serviceOptions.dataFilters || [];
        }
        // Slickgrid also requires the "id" field to be part of DataView
        // push it to the GraphQL query if it wasn't already part of the list
        if (!columnIds.includes('id')) {
            columnIds.push('id');
        }
        var filters = this.buildFilterQuery(columnIds);
        if (this.serviceOptions.isWithCursor) {
            // ...pageInfo { hasNextPage, endCursor }, edges { cursor, node { _filters_ } }
            pageInfoQb.find('hasNextPage', 'endCursor');
            dataQb.find(['cursor', { node: filters }]);
        }
        else {
            // ...pageInfo { hasNextPage }, nodes { _filters_ }
            pageInfoQb.find('hasNextPage');
            dataQb.find(filters);
        }
        datasetQb.find(['totalCount', pageInfoQb, dataQb]);
        // add dataset filters, could be Pagination and SortingFilters and/or FieldFilters
        var datasetFilters = this.serviceOptions.paginationOptions;
        if (this.serviceOptions.sortingOptions) {
            // orderBy: [{ field:x, direction: 'ASC' }]
            datasetFilters.orderBy = this.serviceOptions.sortingOptions;
        }
        if (this.serviceOptions.filteringOptions) {
            // filterBy: [{ field: date, operator: '>', value: '2000-10-10' }]
            datasetFilters.filterBy = this.serviceOptions.filteringOptions;
        }
        // query { users(first: 20, orderBy: [], filterBy: [])}
        datasetQb.filter(datasetFilters);
        queryQb.find(datasetQb);
        var enumSearchProperties = ['direction:', 'field:', 'operator:'];
        return this.trimDoubleQuotesOnEnumField(queryQb.toString(), enumSearchProperties, this.serviceOptions.keepArgumentFieldDoubleQuotes || false);
    };
    /**
     * From an input array of strings, we want to build a GraphQL query string.
     * The process has to take the dot notation and parse it into a valid GraphQL query
     * Following this SO answer https://stackoverflow.com/a/47705476/1212166
     *
     * INPUT
     *  ['firstName', 'lastName', 'billing.address.street', 'billing.address.zip']
     * OUTPUT
     * firstName, lastName, shipping{address{street, zip}}
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
                        continue;
                    }
                    // escaping the search value
                    searchValue = searchValue.replace("'", "''"); // escape single quotes by doubling them
                    if (operator === '*' || lastValueChar === '*') {
                        operator = (operator === '*') ? 'endsWith' : 'startsWith';
                    }
                    searchByArray.push({
                        field: fieldName,
                        operator: mapOperatorType(operator),
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
        // orderBy:[{field: lastName, direction: ASC}, {field: firstName, direction: DESC}]
        if (sortColumns && sortColumns.length === 0) {
            sortByArray = new Array(this.defaultOrderBy); // when empty, use the default sort
        }
        else {
            if (sortColumns) {
                for (var _i = 0, sortColumns_1 = sortColumns; _i < sortColumns_1.length; _i++) {
                    var column = sortColumns_1[_i];
                    var fieldName = column.sortCol.field || column.sortCol.id;
                    var direction = column.sortAsc ? SortDirection.ASC : SortDirection.DESC;
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
    return GraphqlService;
}());
export { GraphqlService };
//# sourceMappingURL=graphql.service.js.map