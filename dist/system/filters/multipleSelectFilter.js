System.register(["aurelia-i18n", "aurelia-framework", "./../models/index", "jquery"], function (exports_1, context_1) {
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
    var __moduleName = context_1 && context_1.id;
    var aurelia_i18n_1, aurelia_framework_1, index_1, $, MultipleSelectFilter;
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
            MultipleSelectFilter = /** @class */ (function () {
                /**
                 * Initialize the Filter
                 */
                function MultipleSelectFilter(i18n) {
                    var _this = this;
                    this.i18n = i18n;
                    this.isFilled = false;
                    this.filterType = index_1.FilterType.multipleSelect;
                    // default options used by this Filter, user can overwrite any of these by passing "otions"
                    this.defaultOptions = {
                        container: 'body',
                        filter: false,
                        maxHeight: 200,
                        okButton: true,
                        addTitle: true,
                        countSelected: this.i18n.tr('X_OF_Y_SELECTED'),
                        allSelected: this.i18n.tr('ALL_SELECTED'),
                        selectAllText: this.i18n.tr('SELECT_ALL'),
                        selectAllDelimiter: ['', ''],
                        // we will subscribe to the onClose event for triggering our callback
                        // also add/remove "filled" class for styling purposes
                        onClose: function () {
                            var selectedItems = _this.$filterElm.multipleSelect('getSelects');
                            if (Array.isArray(selectedItems) && selectedItems.length > 0) {
                                _this.isFilled = true;
                                _this.$filterElm.addClass('filled').siblings('div .search-filter').addClass('filled');
                            }
                            else {
                                _this.isFilled = false;
                                _this.$filterElm.removeClass('filled').siblings('div .search-filter').removeClass('filled');
                            }
                            _this.callback(undefined, { columnDef: _this.columnDef, operator: 'IN', searchTerms: selectedItems });
                        }
                    };
                }
                /**
                 * Initialize the filter template
                 */
                MultipleSelectFilter.prototype.init = function (args) {
                    if (!args) {
                        throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
                    }
                    this.grid = args.grid;
                    this.callback = args.callback;
                    this.columnDef = args.columnDef;
                    this.searchTerms = args.searchTerms || [];
                    // step 1, create HTML string template
                    var filterTemplate = this.buildTemplateHtmlString();
                    // step 2, create the DOM Element of the filter & pre-load search terms
                    // also subscribe to the onClose event
                    this.createDomElement(filterTemplate);
                };
                /**
                 * Clear the filter values
                 */
                MultipleSelectFilter.prototype.clear = function (triggerFilterChange) {
                    if (triggerFilterChange === void 0) { triggerFilterChange = true; }
                    if (this.$filterElm && this.$filterElm.multipleSelect) {
                        // reload the filter element by it's id, to make sure it's still a valid element (because of some issue in the GraphQL example)
                        // this.$filterElm = $(`#${this.$filterElm[0].id}`);
                        this.$filterElm.multipleSelect('setSelects', []);
                        if (triggerFilterChange) {
                            this.$filterElm.removeClass('filled');
                            this.callback(undefined, { columnDef: this.columnDef, operator: 'IN', searchTerms: [] });
                        }
                    }
                };
                /**
                 * destroy the filter
                 */
                MultipleSelectFilter.prototype.destroy = function () {
                    if (this.$filterElm) {
                        this.$filterElm.off().remove();
                    }
                };
                //
                // private functions
                // ------------------
                /**
                 * Create the HTML template as a string
                 */
                MultipleSelectFilter.prototype.buildTemplateHtmlString = function () {
                    var _this = this;
                    if (!this.columnDef || !this.columnDef.filter || !this.columnDef.filter.collection) {
                        throw new Error("[Aurelia-SlickGrid] You need to pass a \"collection\" for the MultipleSelect Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example:: { filter: type: FilterType.multipleSelect, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] }");
                    }
                    var optionCollection = this.columnDef.filter.collection || [];
                    var labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
                    var valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';
                    var isEnabledTranslate = (this.columnDef.filter.enableTranslateLabel) ? this.columnDef.filter.enableTranslateLabel : false;
                    var options = '';
                    optionCollection.forEach(function (option) {
                        if (!option || (option[labelName] === undefined && option.labelKey === undefined)) {
                            throw new Error("A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example:: { filter: type: FilterType.multipleSelect, collection: [ { value: '1', label: 'One' } ]')");
                        }
                        var labelKey = (option.labelKey || option[labelName]);
                        var selected = (_this.findValueInSearchTerms(option[valueName]) >= 0) ? 'selected' : '';
                        var textLabel = ((option.labelKey || isEnabledTranslate) && _this.i18n && typeof _this.i18n.tr === 'function') ? _this.i18n.tr(labelKey || ' ') : labelKey;
                        // html text of each select option
                        options += "<option value=\"" + option[valueName] + "\" " + selected + ">" + textLabel + "</option>";
                        // if there's a search term, we will add the "filled" class for styling purposes
                        if (selected) {
                            _this.isFilled = true;
                        }
                    });
                    return "<select class=\"ms-filter search-filter\" multiple=\"multiple\">" + options + "</select>";
                };
                /**
                 * From the html template string, create a DOM element
                 * Subscribe to the onClose event and run the callback when that happens
                 * @param filterTemplate
                 */
                MultipleSelectFilter.prototype.createDomElement = function (filterTemplate) {
                    var $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
                    $($headerElm).empty();
                    // create the DOM element & add an ID and filter class
                    this.$filterElm = $(filterTemplate);
                    if (typeof this.$filterElm.multipleSelect !== 'function') {
                        throw new Error("multiple-select.js was not found, make sure to modify your \"angular-cli.json\" file and include \"../node_modules/angular-slickgrid/lib/multiple-select/multiple-select.js\" and it's css or SASS file");
                    }
                    this.$filterElm.attr('id', "filter-" + this.columnDef.id);
                    this.$filterElm.data('columnId', this.columnDef.id);
                    // if there's a search term, we will add the "filled" class for styling purposes
                    if (this.isFilled) {
                        this.$filterElm.addClass('filled');
                    }
                    // append the new DOM element to the header row
                    if (this.$filterElm && typeof this.$filterElm.appendTo === 'function') {
                        this.$filterElm.appendTo($headerElm);
                    }
                    // merge options & attach multiSelect
                    var filterOptions = (this.columnDef.filter) ? this.columnDef.filter.filterOptions : {};
                    var options = __assign({}, this.defaultOptions, filterOptions);
                    this.$filterElm = this.$filterElm.multipleSelect(options);
                };
                MultipleSelectFilter.prototype.findValueInSearchTerms = function (value) {
                    if (this.searchTerms && Array.isArray(this.searchTerms)) {
                        for (var i = 0; i < this.searchTerms.length; i++) {
                            if (this.searchTerms[i] && this.searchTerms[i] === value) {
                                return i;
                            }
                        }
                    }
                    return -1;
                };
                MultipleSelectFilter.prototype.subscribeOnClose = function () {
                    var _this = this;
                    this.$filterElm.multipleSelect({
                        onClose: function () {
                            var selectedItems = _this.$filterElm.multipleSelect('getSelects');
                            _this.callback(undefined, { columnDef: _this.columnDef, operator: 'IN', searchTerms: selectedItems });
                        }
                    });
                };
                MultipleSelectFilter = __decorate([
                    aurelia_framework_1.inject(aurelia_i18n_1.I18N)
                ], MultipleSelectFilter);
                return MultipleSelectFilter;
            }());
            exports_1("MultipleSelectFilter", MultipleSelectFilter);
        }
    };
});
//# sourceMappingURL=multipleSelectFilter.js.map