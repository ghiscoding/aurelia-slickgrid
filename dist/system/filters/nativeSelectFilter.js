System.register(["aurelia-i18n", "aurelia-framework", "./../models/index", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var aurelia_i18n_1, aurelia_framework_1, index_1, $, NativeSelectFilter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aurelia_i18n_1_1) {
                aurelia_i18n_1 = aurelia_i18n_1_1;
            },
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            NativeSelectFilter = /** @class */ (function () {
                function NativeSelectFilter(i18n) {
                    this.i18n = i18n;
                    this._clearFilterTriggered = false;
                }
                Object.defineProperty(NativeSelectFilter.prototype, "operator", {
                    get: function () {
                        return (this.columnDef && this.columnDef.filter && this.columnDef.filter.operator) || index_1.OperatorType.equal;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Initialize the Filter
                 */
                NativeSelectFilter.prototype.init = function (args) {
                    var _this = this;
                    if (!args) {
                        throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
                    }
                    this.grid = args.grid;
                    this.callback = args.callback;
                    this.columnDef = args.columnDef;
                    this.searchTerms = args.searchTerms || [];
                    // filter input can only have 1 search term, so we will use the 1st array index if it exist
                    var searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
                    if (typeof searchTerm === 'boolean' || typeof searchTerm === 'number') {
                        searchTerm = "" + searchTerm;
                    }
                    // step 1, create HTML string template
                    var filterTemplate = this.buildTemplateHtmlString();
                    // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
                    this.$filterElm = this.createDomElement(filterTemplate, searchTerm);
                    // step 3, subscribe to the change event and run the callback when that happens
                    // also add/remove "filled" class for styling purposes
                    this.$filterElm.change(function (e) {
                        var value = e && e.target && e.target.value || '';
                        if (_this._clearFilterTriggered) {
                            _this.callback(e, { columnDef: _this.columnDef, clearFilterTriggered: _this._clearFilterTriggered });
                            _this._clearFilterTriggered = false; // reset flag for next use
                            _this.$filterElm.removeClass('filled');
                        }
                        else {
                            _this.$filterElm.addClass('filled');
                            _this.callback(e, { columnDef: _this.columnDef, operator: _this.operator, searchTerms: [value] });
                        }
                    });
                };
                /**
                 * Clear the filter values
                 */
                NativeSelectFilter.prototype.clear = function () {
                    if (this.$filterElm) {
                        this._clearFilterTriggered = true;
                        this.searchTerms = [];
                        this.$filterElm.val('');
                        this.$filterElm.trigger('change');
                    }
                };
                /**
                 * destroy the filter
                 */
                NativeSelectFilter.prototype.destroy = function () {
                    if (this.$filterElm) {
                        this.$filterElm.off('change').remove();
                    }
                };
                /**
                 * Set value(s) on the DOM element
                 */
                NativeSelectFilter.prototype.setValues = function (values) {
                    if (values) {
                        this.$filterElm.val(values);
                    }
                };
                //
                // private functions
                // ------------------
                NativeSelectFilter.prototype.buildTemplateHtmlString = function () {
                    var _this = this;
                    if (!this.columnDef || !this.columnDef.filter || !this.columnDef.filter.collection) {
                        throw new Error("[Aurelia-SlickGrid] You need to pass a \"collection\" for the Select Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example: { filter: { model: Filters.select, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] } }");
                    }
                    var columnId = this.columnDef && this.columnDef.id;
                    var optionCollection = this.columnDef.filter.collection || [];
                    var labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
                    var valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';
                    var isEnabledTranslate = (this.columnDef.filter.enableTranslateLabel) ? this.columnDef.filter.enableTranslateLabel : false;
                    var options = '';
                    // collection could be an Array of Strings OR Objects
                    if (optionCollection.every(function (x) { return typeof x === 'string'; })) {
                        optionCollection.forEach(function (option) {
                            options += "<option value=\"" + option + "\" label=\"" + option + "\">" + option + "</option>";
                        });
                    }
                    else {
                        optionCollection.forEach(function (option) {
                            if (!option || (option[labelName] === undefined && option.labelKey === undefined)) {
                                throw new Error("A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example:: { filter: model: Filters.select, collection: [ { value: '1', label: 'One' } ]')");
                            }
                            var labelKey = option.labelKey || option[labelName];
                            var textLabel = ((option.labelKey || isEnabledTranslate) && _this.i18n && typeof _this.i18n.tr === 'function') ? _this.i18n.tr(labelKey || ' ') : labelKey;
                            options += "<option value=\"" + option[valueName] + "\">" + textLabel + "</option>";
                        });
                    }
                    return "<select class=\"form-control search-filter filter-" + columnId + "\">" + options + "</select>";
                };
                /**
                 * From the html template string, create a DOM element
                 * @param filterTemplate
                 */
                NativeSelectFilter.prototype.createDomElement = function (filterTemplate, searchTerm) {
                    var columnId = this.columnDef && this.columnDef.id;
                    var $headerElm = this.grid.getHeaderRowColumn(columnId);
                    $($headerElm).empty();
                    // create the DOM element & add an ID and filter class
                    var $filterElm = $(filterTemplate);
                    var searchTermInput = (searchTerm || '');
                    $filterElm.val(searchTermInput);
                    $filterElm.attr('id', "filter-" + columnId);
                    $filterElm.data('columnId', columnId);
                    // append the new DOM element to the header row
                    if ($filterElm && typeof $filterElm.appendTo === 'function') {
                        $filterElm.appendTo($headerElm);
                    }
                    return $filterElm;
                };
                NativeSelectFilter = __decorate([
                    aurelia_framework_1.inject(aurelia_i18n_1.I18N)
                ], NativeSelectFilter);
                return NativeSelectFilter;
            }());
            exports_1("NativeSelectFilter", NativeSelectFilter);
        }
    };
});
//# sourceMappingURL=nativeSelectFilter.js.map