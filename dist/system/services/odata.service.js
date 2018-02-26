System.register(["./global-utilities", "./../models/index"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, OdataService;
    return {
        setters: [
            function (_1) {
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
            OdataService = /** @class */ (function () {
                function OdataService() {
                    this._odataOptions = {
                        filterQueue: [],
                        orderBy: ''
                    };
                    this._defaultSortBy = '';
                    this._columnFilters = {};
                }
                /*
                  * Build the OData query string from all the options provided
                  * @return string OData query
                  */
                OdataService.prototype.buildQuery = function () {
                    this._odataOptions.filterQueue = [];
                    var queryTmpArray = [];
                    if (this._odataOptions.top) {
                        queryTmpArray.push("$top=" + this._odataOptions.top);
                    }
                    if (this._odataOptions.skip) {
                        queryTmpArray.push("$skip=" + this._odataOptions.skip);
                    }
                    if (this._odataOptions.orderBy) {
                        var argument = '';
                        if (Array.isArray(this._odataOptions.orderBy)) {
                            argument = this._odataOptions.orderBy.join(','); // csv, that will form a query example like: $orderby=RoleName asc, Id desc
                        }
                        else {
                            argument = this._odataOptions.orderBy;
                        }
                        queryTmpArray.push("$orderby=" + argument);
                    }
                    if (this._odataOptions.filterBy || this._odataOptions.filter) {
                        if (this._odataOptions.filter) {
                            this._odataOptions.filterQueue = [];
                            var filterStr = this._odataOptions.filter;
                            if (Array.isArray(this._odataOptions.filter)) {
                                filterStr = this._odataOptions.filter.join(" " + (this._odataOptions.filterBySeparator || 'and') + " ");
                            }
                            this._odataOptions.filterQueue.push("(" + filterStr + ")");
                        }
                        // filterBy are passed manually by the user, however we will only add it if the column wasn't yet filtered
                        if (!!this._odataOptions.filterBy && !!this._odataOptions.filterBy.fieldName && !this._columnFilters[this._odataOptions.filterBy.fieldName.toLowerCase()]) {
                            if (this._odataOptions.filterBy.searchTerm !== '') {
                                this.saveColumnFilter(this._odataOptions.filterBy.fieldName.toLowerCase(), this._odataOptions.filterBy.searchTerm, this._odataOptions.filterBy.searchTerms);
                                this.updateFilterFromListTerms(this._odataOptions.filterBy);
                            }
                        }
                    }
                    if (this._odataOptions.filterQueue.length > 0) {
                        var query = this._odataOptions.filterQueue.join(" " + (this._odataOptions.filterBySeparator || 'and') + " ");
                        this._odataOptions.filter = query; // overwrite with
                        queryTmpArray.push("$filter=" + query);
                    }
                    // join all the odata functions by a '&'
                    return queryTmpArray.join('&');
                };
                OdataService.prototype.getFilterByColumn = function (columnName) {
                    return (!!this._columnFilters[columnName]) ? this._columnFilters[columnName] : null;
                };
                OdataService.prototype.getFilterCount = function () {
                    return (this._odataOptions.filterQueue) ? this._odataOptions.filterQueue.length : 0;
                };
                Object.defineProperty(OdataService.prototype, "columnFilters", {
                    get: function () {
                        return this._columnFilters;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OdataService.prototype, "options", {
                    get: function () {
                        return this._odataOptions;
                    },
                    set: function (options) {
                        this._odataOptions = options;
                    },
                    enumerable: true,
                    configurable: true
                });
                OdataService.prototype.removeColumnFilter = function (fieldName) {
                    delete this._columnFilters[fieldName];
                };
                OdataService.prototype.saveColumnFilter = function (fieldName, value, searchTerms) {
                    this._columnFilters[fieldName] = {
                        search: searchTerms,
                        value: value
                    };
                };
                /**
                 * Update the filter by a list of terms usually passed manually by the user as default filters
                 * @param filterOptions
                 * @returns
                 */
                OdataService.prototype.updateFilterFromListTerms = function (filterOptions) {
                    var _this = this;
                    // build the filter query
                    if (Array.isArray(filterOptions)) {
                        filterOptions.forEach(function (filterOptionObject) {
                            _this.updateFilterFromTerm(filterOptionObject);
                        });
                    }
                    else {
                        this.updateFilterFromTerm(filterOptions);
                    }
                };
                OdataService.prototype.updateFilterFromTerm = function (filterOptions) {
                    var searchBy = '';
                    var tmpSearchByArray = [];
                    var fieldName = filterOptions.fieldName;
                    var fieldSearchTerms = filterOptions.searchTerms;
                    var operator = filterOptions.operator;
                    // when having more than 1 search term (then check if we have a "IN" or "NOT IN" filter search)
                    if (!!fieldSearchTerms && fieldSearchTerms.length > 0) {
                        var tmpSearchTerms = [];
                        if (operator === 'IN') {
                            // example:: (Stage eq "Expired" or Stage eq "Renewal")
                            for (var j = 0, lnj = fieldSearchTerms.length; j < lnj; j++) {
                                tmpSearchTerms.push(fieldName + " eq '" + fieldSearchTerms[j] + "'");
                            }
                            searchBy = tmpSearchTerms.join(' or ');
                            searchBy = "$(" + searchBy + ")";
                        }
                        else if (operator === 'NIN' || operator === 'NOTIN' || operator === 'NOT IN') {
                            // example:: (Stage ne "Expired" and Stage ne "Renewal")
                            for (var k = 0, lnk = fieldSearchTerms.length; k < lnk; k++) {
                                tmpSearchTerms.push(fieldName + " ne '" + fieldSearchTerms[k] + "'");
                            }
                            searchBy = tmpSearchTerms.join(' and ');
                            searchBy = "$(" + searchBy + ")";
                        }
                    }
                    // push to our temp array and also trim white spaces
                    tmpSearchByArray.push(String.trim(searchBy));
                    // add to the filter queue only if it doesn't exist in the queue
                    var filter = (tmpSearchByArray.length > 0) ? tmpSearchByArray.join(' and ') : '';
                    if (this._odataOptions.filterQueue && this._odataOptions.filterQueue.indexOf(filter) === -1) {
                        this._odataOptions.filterQueue.push(filter);
                    }
                };
                /**
                 * Change any OData options that will be used to build the query
                 * @param object options
                 */
                OdataService.prototype.updateOptions = function (options) {
                    for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {
                        var property = _a[_i];
                        if (options.hasOwnProperty(property)) {
                            this._odataOptions[property] = options[property]; // replace of the property
                        }
                        // we need to keep the defaultSortBy for references whenever the user removes his Sorting
                        // then we would revert to the defaultSortBy and the only way is to keep a hard copy here
                        if (property === 'orderBy' || property === 'sortBy') {
                            var sortBy = options[property];
                            // make sure first char of each orderBy field is capitalize
                            if (this._odataOptions.caseType === index_1.CaseType.pascalCase) {
                                if (Array.isArray(sortBy)) {
                                    sortBy.forEach(function (field, index, inputArray) {
                                        inputArray[index] = String.titleCase(field);
                                    });
                                }
                                else {
                                    sortBy = String.titleCase(options[property]);
                                }
                            }
                            this._odataOptions.orderBy = sortBy;
                            this._defaultSortBy = sortBy;
                        }
                    }
                };
                return OdataService;
            }());
            exports_1("OdataService", OdataService);
        }
    };
});
//# sourceMappingURL=odata.service.js.map