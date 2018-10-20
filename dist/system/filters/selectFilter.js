System.register(["./../models/index", "../services/utilities", "dompurify", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __assign = (this && this.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
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
    var __moduleName = context_1 && context_1.id;
    var index_1, utilities_1, DOMPurify, $, SelectFilter;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (DOMPurify_1) {
                DOMPurify = DOMPurify_1;
            },
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            SelectFilter = /** @class */ (function () {
                /**
                 * Initialize the Filter
                 */
                function SelectFilter(bindingEngine, collectionService, i18n, isMultipleSelect) {
                    if (isMultipleSelect === void 0) { isMultipleSelect = true; }
                    var _this = this;
                    this.bindingEngine = bindingEngine;
                    this.collectionService = collectionService;
                    this.i18n = i18n;
                    this.isMultipleSelect = isMultipleSelect;
                    this.isFilled = false;
                    this.enableTranslateLabel = false;
                    this.subscriptions = [];
                    // default options used by this Filter, user can overwrite any of these by passing "otions"
                    var options = {
                        autoAdjustDropHeight: true,
                        autoAdjustDropPosition: true,
                        autoAdjustDropWidthByTextSize: true,
                        container: 'body',
                        filter: false,
                        maxHeight: 275,
                        single: true,
                        textTemplate: function ($elm) {
                            // render HTML code or not, by default it is sanitized and won't be rendered
                            var isRenderHtmlEnabled = _this.columnDef && _this.columnDef.filter && _this.columnDef.filter.enableRenderHtml || false;
                            return isRenderHtmlEnabled ? $elm.text() : $elm.html();
                        },
                        onClose: function () {
                            // we will subscribe to the onClose event for triggering our callback
                            // also add/remove "filled" class for styling purposes
                            var selectedItems = _this.$filterElm.multipleSelect('getSelects');
                            if (Array.isArray(selectedItems) && selectedItems.length > 0) {
                                _this.isFilled = true;
                                _this.$filterElm.addClass('filled').siblings('div .search-filter').addClass('filled');
                            }
                            else {
                                _this.isFilled = false;
                                _this.$filterElm.removeClass('filled').siblings('div .search-filter').removeClass('filled');
                            }
                            _this.callback(undefined, { columnDef: _this.columnDef, operator: _this.operator, searchTerms: selectedItems });
                        }
                    };
                    if (this.isMultipleSelect) {
                        options.single = false;
                        options.okButton = true;
                        options.addTitle = true; // show tooltip of all selected items while hovering the filter
                        options.countSelected = this.i18n.tr('X_OF_Y_SELECTED');
                        options.allSelected = this.i18n.tr('ALL_SELECTED');
                        options.selectAllText = this.i18n.tr('SELECT_ALL');
                        options.selectAllDelimiter = ['', '']; // remove default square brackets of default text "[Select All]" => "Select All"
                    }
                    this.defaultOptions = options;
                }
                Object.defineProperty(SelectFilter.prototype, "collectionOptions", {
                    /** Getter for the Collection Options */
                    get: function () {
                        return this.columnDef && this.columnDef.filter && this.columnDef.filter.collectionOptions || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectFilter.prototype, "columnFilter", {
                    /** Getter for the Filter Operator */
                    get: function () {
                        return this.columnDef && this.columnDef.filter || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectFilter.prototype, "customStructure", {
                    /** Getter for the Custom Structure if exist */
                    get: function () {
                        return this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectFilter.prototype, "gridOptions", {
                    /** Getter for the Grid Options pulled through the Grid Object */
                    get: function () {
                        return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectFilter.prototype, "operator", {
                    /** Getter for the Filter Operator */
                    get: function () {
                        return (this.columnDef && this.columnDef.filter && this.columnDef.filter.operator) || index_1.OperatorType.in;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Initialize the filter template
                 */
                SelectFilter.prototype.init = function (args) {
                    return __awaiter(this, void 0, void 0, function () {
                        var newCollection, collectionAsync;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!args) {
                                        throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
                                    }
                                    this.grid = args.grid;
                                    this.callback = args.callback;
                                    this.columnDef = args.columnDef;
                                    this.searchTerms = args.searchTerms || [];
                                    if (!this.grid || !this.columnDef || !this.columnFilter || (!this.columnFilter.collection && !this.columnFilter.collectionAsync)) {
                                        throw new Error("[Aurelia-SlickGrid] You need to pass a \"collection\" (or \"collectionAsync\") for the MultipleSelect Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example:: { filter: model: Filters.multipleSelect, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] }");
                                    }
                                    this.enableTranslateLabel = this.columnFilter && this.columnFilter.enableTranslateLabel || false;
                                    this.labelName = this.customStructure && this.customStructure.label || 'label';
                                    this.labelPrefixName = this.customStructure && this.customStructure.labelPrefix || 'labelPrefix';
                                    this.labelSuffixName = this.customStructure && this.customStructure.labelSuffix || 'labelSuffix';
                                    this.optionLabel = this.customStructure && this.customStructure.optionLabel || 'value';
                                    this.valueName = this.customStructure && this.customStructure.value || 'value';
                                    if (this.enableTranslateLabel && (!this.i18n || typeof this.i18n.tr !== 'function')) {
                                        throw new Error("[select-filter] The i18n Service is required for the Select Filter to work correctly");
                                    }
                                    newCollection = this.columnFilter.collection || [];
                                    this.renderDomElement(newCollection);
                                    collectionAsync = this.columnFilter.collectionAsync;
                                    if (!collectionAsync) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.renderOptionsAsync(collectionAsync)];
                                case 1:
                                    newCollection = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    // subscribe to both CollectionObserver and PropertyObserver
                                    // any collection changes will trigger a re-render of the DOM element filter
                                    if (collectionAsync || (this.columnFilter.enableCollectionWatch)) {
                                        this.watchCollectionChanges();
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                /**
                 * Clear the filter values
                 */
                SelectFilter.prototype.clear = function () {
                    if (this.$filterElm && this.$filterElm.multipleSelect) {
                        // reload the filter element by it's id, to make sure it's still a valid element (because of some issue in the GraphQL example)
                        this.$filterElm.multipleSelect('setSelects', []);
                        this.$filterElm.removeClass('filled');
                        this.searchTerms = [];
                        this.callback(undefined, { columnDef: this.columnDef, clearFilterTriggered: true });
                    }
                };
                /**
                 * destroy the filter
                 */
                SelectFilter.prototype.destroy = function () {
                    if (this.$filterElm) {
                        // remove event watcher
                        this.$filterElm.off().remove();
                        // also dispose of all Subscriptions
                        this.subscriptions = utilities_1.disposeAllSubscriptions(this.subscriptions);
                    }
                };
                /**
                 * Set value(s) on the DOM element
                 */
                SelectFilter.prototype.setValues = function (values) {
                    if (values) {
                        values = Array.isArray(values) ? values : [values];
                        this.$filterElm.multipleSelect('setSelects', values);
                    }
                };
                //
                // protected functions
                // ------------------
                /**
                 * user might want to filter certain items of the collection
                 * @param inputCollection
                 * @return outputCollection filtered and/or sorted collection
                 */
                SelectFilter.prototype.filterCollection = function (inputCollection) {
                    var outputCollection = inputCollection;
                    // user might want to filter certain items of the collection
                    if (this.columnFilter && this.columnFilter.collectionFilterBy) {
                        var filterBy = this.columnFilter.collectionFilterBy;
                        var filterCollectionBy = this.columnFilter.collectionOptions && this.columnFilter.collectionOptions.filterResultAfterEachPass || null;
                        outputCollection = this.collectionService.filterCollection(outputCollection, filterBy, filterCollectionBy);
                    }
                    return outputCollection;
                };
                /**
                 * user might want to sort the collection in a certain way
                 * @param inputCollection
                 * @return outputCollection filtered and/or sorted collection
                 */
                SelectFilter.prototype.sortCollection = function (inputCollection) {
                    var outputCollection = inputCollection;
                    // user might want to sort the collection
                    if (this.columnFilter && this.columnFilter.collectionSortBy) {
                        var sortBy = this.columnFilter.collectionSortBy;
                        outputCollection = this.collectionService.sortCollection(outputCollection, sortBy, this.enableTranslateLabel);
                    }
                    return outputCollection;
                };
                SelectFilter.prototype.renderOptionsAsync = function (collectionAsync) {
                    return __awaiter(this, void 0, void 0, function () {
                        var awaitedCollection, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    awaitedCollection = [];
                                    if (!collectionAsync) return [3 /*break*/, 6];
                                    return [4 /*yield*/, collectionAsync];
                                case 1:
                                    response = _a.sent();
                                    if (!Array.isArray(response)) return [3 /*break*/, 2];
                                    awaitedCollection = response; // from Promise
                                    return [3 /*break*/, 5];
                                case 2:
                                    if (!(response instanceof Response && typeof response['json'] === 'function')) return [3 /*break*/, 4];
                                    return [4 /*yield*/, response['json']()];
                                case 3:
                                    awaitedCollection = _a.sent(); // from Fetch
                                    return [3 /*break*/, 5];
                                case 4:
                                    if (response && response['content']) {
                                        awaitedCollection = response['content']; // from aurelia-http-client
                                    }
                                    _a.label = 5;
                                case 5:
                                    if (!Array.isArray(awaitedCollection)) {
                                        throw new Error('Something went wrong while trying to pull the collection from the "collectionAsync" call');
                                    }
                                    // copy over the array received from the async call to the "collection" as the new collection to use
                                    // this has to be BEFORE the `collectionObserver().subscribe` to avoid going into an infinite loop
                                    this.columnFilter.collection = awaitedCollection;
                                    // recreate Multiple Select after getting async collection
                                    this.renderDomElement(awaitedCollection);
                                    _a.label = 6;
                                case 6: return [2 /*return*/, awaitedCollection];
                            }
                        });
                    });
                };
                /**
                 * Subscribe to both CollectionObserver & PropertyObserver with BindingEngine.
                 * They each have their own purpose, the "propertyObserver" will trigger once the collection is replaced entirely
                 * while the "collectionObverser" will trigger on collection changes (`push`, `unshift`, `splice`, ...)
                 */
                SelectFilter.prototype.watchCollectionChanges = function () {
                    var _this = this;
                    // subscribe to the "collection" changes (array replace)
                    this.subscriptions.push(this.bindingEngine
                        .propertyObserver(this.columnFilter, 'collection')
                        .subscribe(function (newVal) {
                        // simply recreate/re-render the Select (dropdown) DOM Element
                        _this.renderDomElement(newVal);
                    }));
                    // subscribe to the "collection" changes (array `push`, `unshift`, `splice`, ...)
                    if (this.columnFilter && this.columnFilter.collection) {
                        this.subscriptions.push(this.bindingEngine
                            .collectionObserver(this.columnFilter.collection)
                            .subscribe(function (changes) {
                            if (Array.isArray(changes) && changes.length > 0) {
                                // simply recreate/re-render the Select (dropdown) DOM Element
                                var updatedCollection = _this.columnFilter.collection || [];
                                _this.renderDomElement(updatedCollection);
                            }
                        }));
                    }
                };
                SelectFilter.prototype.renderDomElement = function (collection) {
                    if (!Array.isArray(collection) && this.collectionOptions && this.collectionOptions.collectionInObjectProperty) {
                        collection = utilities_1.getDescendantProperty(collection, this.collectionOptions.collectionInObjectProperty);
                    }
                    if (!Array.isArray(collection)) {
                        throw new Error('The "collection" passed to the Select Filter is not a valid array');
                    }
                    // user can optionally add a blank entry at the beginning of the collection
                    if (this.collectionOptions && this.collectionOptions.addBlankEntry) {
                        collection.unshift(this.createBlankEntry());
                    }
                    // assign the collection to a temp variable before filtering/sorting the collection
                    var newCollection = collection;
                    // user might want to filter and/or sort certain items of the collection
                    newCollection = this.filterCollection(newCollection);
                    newCollection = this.sortCollection(newCollection);
                    // step 1, create HTML string template
                    var filterTemplate = this.buildTemplateHtmlString(newCollection, this.searchTerms);
                    // step 2, create the DOM Element of the filter & pre-load search terms
                    // also subscribe to the onClose event
                    this.createDomElement(filterTemplate);
                };
                /**
                 * Create the HTML template as a string
                 */
                SelectFilter.prototype.buildTemplateHtmlString = function (optionCollection, searchTerms) {
                    var _this = this;
                    var options = '';
                    var separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
                    var isRenderHtmlEnabled = this.columnFilter && this.columnFilter.enableRenderHtml || false;
                    var sanitizedOptions = this.gridOptions && this.gridOptions.sanitizeHtmlOptions || {};
                    optionCollection.forEach(function (option) {
                        if (!option || (option[_this.labelName] === undefined && option.labelKey === undefined)) {
                            throw new Error("[select-filter] A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example:: { filter: model: Filters.multipleSelect, collection: [ { value: '1', label: 'One' } ]')");
                        }
                        var labelKey = (option.labelKey || option[_this.labelName]);
                        var selected = (searchTerms.findIndex(function (term) { return term === option[_this.valueName]; }) >= 0) ? 'selected' : '';
                        var labelText = ((option.labelKey || _this.enableTranslateLabel) && labelKey) ? _this.i18n.tr(labelKey || ' ') : labelKey;
                        var prefixText = option[_this.labelPrefixName] || '';
                        var suffixText = option[_this.labelSuffixName] || '';
                        var optionLabel = option[_this.optionLabel] || '';
                        optionLabel = optionLabel.toString().replace(/\"/g, '\''); // replace double quotes by single quotes to avoid interfering with regular html
                        // also translate prefix/suffix if enableTranslateLabel is true and text is a string
                        prefixText = (_this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? _this.i18n.tr(prefixText || ' ') : prefixText;
                        suffixText = (_this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? _this.i18n.tr(suffixText || ' ') : suffixText;
                        optionLabel = (_this.enableTranslateLabel && optionLabel && typeof optionLabel === 'string') ? _this.i18n.tr(optionLabel || ' ') : optionLabel;
                        // add to a temp array for joining purpose and filter out empty text
                        var tmpOptionArray = [prefixText, labelText, suffixText].filter(function (text) { return text; });
                        var optionText = tmpOptionArray.join(separatorBetweenLabels);
                        // if user specifically wants to render html text, he needs to opt-in else it will stripped out by default
                        // also, the 3rd party lib will saninitze any html code unless it's encoded, so we'll do that
                        if (isRenderHtmlEnabled) {
                            // sanitize any unauthorized html tags like script and others
                            // for the remaining allowed tags we'll permit all attributes
                            var sanitizedText = DOMPurify.sanitize(optionText, sanitizedOptions);
                            optionText = utilities_1.htmlEncode(sanitizedText);
                        }
                        // html text of each select option
                        options += "<option value=\"" + option[_this.valueName] + "\" label=\"" + optionLabel + "\" " + selected + ">" + optionText + "</option>";
                        // if there's a search term, we will add the "filled" class for styling purposes
                        if (selected) {
                            _this.isFilled = true;
                        }
                    });
                    return "<select class=\"ms-filter search-filter\" multiple=\"multiple\">" + options + "</select>";
                };
                /** Create a blank entry that can be added to the collection. It will also reuse the same collection structure provided by the user */
                SelectFilter.prototype.createBlankEntry = function () {
                    var blankEntry = (_a = {},
                        _a[this.labelName] = '',
                        _a[this.valueName] = '',
                        _a);
                    if (this.labelPrefixName) {
                        blankEntry[this.labelPrefixName] = '';
                    }
                    if (this.labelSuffixName) {
                        blankEntry[this.labelSuffixName] = '';
                    }
                    return blankEntry;
                    var _a;
                };
                /**
                 * From the html template string, create a DOM element of the Multiple/Single Select Filter
                 * Subscribe to the onClose event and run the callback when that happens
                 * @param filterTemplate
                 */
                SelectFilter.prototype.createDomElement = function (filterTemplate) {
                    var fieldId = this.columnDef && this.columnDef.field || this.columnDef && this.columnDef.id;
                    // provide the name attribute to the DOM element which will be needed to auto-adjust drop position (dropup / dropdown)
                    this.elementName = "filter_" + fieldId;
                    this.defaultOptions.name = this.elementName;
                    var $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
                    $($headerElm).empty();
                    // create the DOM element & add an ID and filter class
                    this.$filterElm = $(filterTemplate);
                    if (typeof this.$filterElm.multipleSelect !== 'function') {
                        throw new Error("multiple-select.js was not found, make sure to read the HOWTO Wiki on how to install it");
                    }
                    this.$filterElm.attr('id', this.elementName);
                    this.$filterElm.data('columnId', fieldId);
                    // if there's a search term, we will add the "filled" class for styling purposes
                    if (this.isFilled) {
                        this.$filterElm.addClass('filled');
                    }
                    // append the new DOM element to the header row
                    if (this.$filterElm && typeof this.$filterElm.appendTo === 'function') {
                        this.$filterElm.appendTo($headerElm);
                    }
                    // merge options & attach multiSelect
                    var filterOptions = (this.columnFilter) ? this.columnFilter.filterOptions : {};
                    this.filterElmOptions = __assign({}, this.defaultOptions, filterOptions);
                    this.$filterElm = this.$filterElm.multipleSelect(this.filterElmOptions);
                };
                return SelectFilter;
            }());
            exports_1("SelectFilter", SelectFilter);
        }
    };
});
//# sourceMappingURL=selectFilter.js.map