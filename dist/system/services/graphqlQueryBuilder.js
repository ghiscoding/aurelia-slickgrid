System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GraphqlQueryBuilder;
    return {
        setters: [],
        execute: function () {
            /**
             * This GraphqlQueryBuilder class is a lib that already exist
             * but was causing issues with TypeScript, RequireJS and other bundler/packagers
             * and so I rewrote it in pure TypeScript.
             *
             * The previous lib can be viewed here at this Github
             * https://github.com/codemeasandwich/graphql-query-builder
             */
            GraphqlQueryBuilder = /** @class */ (function () {
                /* Constructor, query/mutator you wish to use, and an alias or filter arguments. */
                function GraphqlQueryBuilder(queryFnName, aliasOrFilter) {
                    this.queryFnName = queryFnName;
                    this.head = [];
                    if (typeof aliasOrFilter === 'function') {
                        this.alias = aliasOrFilter;
                    }
                    else if (typeof aliasOrFilter === 'object') {
                        this.filter(aliasOrFilter);
                    }
                    else if (undefined === aliasOrFilter && 2 === arguments.length) {
                        throw new TypeError("You have passed undefined as Second argument to \"Query\"");
                    }
                    else if (undefined !== aliasOrFilter) {
                        throw new TypeError("Second argument to \"Query\" should be an alias name(String) or filter arguments(Object). was passed " + aliasOrFilter);
                    }
                }
                /**
                 * The parameters to run the query against.
                 * @param filters An object mapping attribute to values
                 */
                GraphqlQueryBuilder.prototype.filter = function (filters) {
                    for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
                        var prop = _a[_i];
                        if (typeof filters[prop] === 'function') {
                            continue;
                        }
                        var val = this.getGraphQLValue(filters[prop]);
                        if (val === '{}') {
                            continue;
                        }
                        this.head.push(prop + ":" + val);
                    }
                    return this;
                };
                /**
                 * Outlines the properties you wish to be returned from the query.
                 * @param {string|object} properties representing each attribute you want Returned
                 */
                GraphqlQueryBuilder.prototype.find = function () {
                    var searches = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        searches[_i] = arguments[_i];
                    }
                    if (!searches) {
                        throw new TypeError("find value can not be >>falsy<<");
                    }
                    // if its a string.. it may have other values
                    // else it sould be an Object or Array of maped values
                    var searchKeys = (searches.length === 1 && Array.isArray(searches[0])) ? searches[0] : searches;
                    this.body = this.parceFind(searchKeys);
                    return this;
                };
                /**
                 * set an alias for this result.
                 * @param {string} alias
                 */
                GraphqlQueryBuilder.prototype.setAlias = function (alias) {
                    this.alias = alias;
                };
                /**
                 * Return to the formatted query string
                 * @return {string}
                 */
                GraphqlQueryBuilder.prototype.toString = function () {
                    if (this.body === undefined) {
                        throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
                    }
                    return ((this.alias) ? (this.alias + ':') : '') + " " + this.queryFnName + " " + ((this.head.length > 0) ? '(' + this.head.join(',') + ')' : '') + "  { " + this.body + " }";
                };
                // --
                // PRIVATE FUNCTIONS
                // -----------------
                GraphqlQueryBuilder.prototype.parceFind = function (_levelA) {
                    var propsA = _levelA.map(function (currentValue, index) {
                        var itemX = _levelA[index];
                        if (itemX instanceof GraphqlQueryBuilder) {
                            return itemX.toString();
                        }
                        else if (!Array.isArray(itemX) && typeof itemX === 'object') {
                            var propsA_1 = Object.keys(itemX);
                            if (1 !== propsA_1.length) {
                                throw new RangeError("Alias objects should only have one value. was passed: " + JSON.stringify(itemX));
                            }
                            var propS = propsA_1[0];
                            var item = itemX[propS];
                            if (Array.isArray(item)) {
                                return new GraphqlQueryBuilder(propS).find(item);
                            }
                            return propS + " : " + item + " ";
                        }
                        else if (typeof itemX === 'string') {
                            return itemX;
                        }
                        else {
                            throw new RangeError("cannot handle Find value of " + itemX);
                        }
                    });
                    return propsA.join(',');
                };
                GraphqlQueryBuilder.prototype.getGraphQLValue = function (value) {
                    var _this = this;
                    if (typeof value === 'string') {
                        value = JSON.stringify(value);
                    }
                    else if (Array.isArray(value)) {
                        value = value.map(function (item) {
                            return _this.getGraphQLValue(item);
                        }).join();
                        value = "[" + value + "]";
                    }
                    else if (value instanceof Date) {
                        value = JSON.stringify(value);
                    }
                    else if (value !== null && typeof value === 'object') {
                        value = this.objectToString(value);
                    }
                    return value;
                };
                GraphqlQueryBuilder.prototype.objectToString = function (obj) {
                    var sourceA = [];
                    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
                        var prop = _a[_i];
                        if (typeof obj[prop] === 'function') {
                            continue;
                        }
                        sourceA.push(prop + ":" + this.getGraphQLValue(obj[prop]));
                    }
                    return "{" + sourceA.join() + "}";
                };
                return GraphqlQueryBuilder;
            }());
            exports_1("default", GraphqlQueryBuilder);
        }
    };
});
//# sourceMappingURL=graphqlQueryBuilder.js.map