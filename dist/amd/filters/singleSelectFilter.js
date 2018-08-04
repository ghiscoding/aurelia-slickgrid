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
define(["require", "exports", "aurelia-i18n", "aurelia-framework", "./../models/index", "../services/collection.service", "../services/utilities", "sanitize-html", "jquery"], function (require, exports, aurelia_i18n_1, aurelia_framework_1, index_1, collection_service_1, utilities_1, sanitizeHtml, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SingleSelectFilter = /** @class */ (function () {
        function SingleSelectFilter(collectionService, i18n) {
            var _this = this;
            this.collectionService = collectionService;
            this.i18n = i18n;
            this.isFilled = false;
            this.enableTranslateLabel = false;
            // default options used by this Filter, user can overwrite any of these by passing "otions"
            this.defaultOptions = {
                container: 'body',
                filter: false,
                maxHeight: 200,
                single: true,
                textTemplate: function ($elm) {
                    // render HTML code or not, by default it is sanitized and won't be rendered
                    var isRenderHtmlEnabled = _this.columnDef && _this.columnDef.filter && _this.columnDef.filter.enableRenderHtml || false;
                    return isRenderHtmlEnabled ? $elm.text() : $elm.html();
                },
                onClose: function () {
                    var selectedItems = _this.$filterElm.multipleSelect('getSelects');
                    var selectedItem = '';
                    if (Array.isArray(selectedItems) && selectedItems.length > 0) {
                        selectedItem = selectedItems[0] || null;
                        _this.isFilled = true;
                        _this.$filterElm.addClass('filled').siblings('div .search-filter').addClass('filled');
                    }
                    else {
                        _this.isFilled = false;
                        _this.$filterElm.removeClass('filled').siblings('div .search-filter').removeClass('filled');
                    }
                    _this.callback(undefined, { columnDef: _this.columnDef, operator: _this.operator, searchTerms: (selectedItem ? [selectedItem] : null) });
                }
            };
        }
        Object.defineProperty(SingleSelectFilter.prototype, "operator", {
            get: function () {
                return (this.columnDef && this.columnDef.filter && this.columnDef.filter.operator) || index_1.OperatorType.equal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SingleSelectFilter.prototype, "gridOptions", {
            /** Getter for the Grid Options pulled through the Grid Object */
            get: function () {
                return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Initialize the Filter
         */
        SingleSelectFilter.prototype.init = function (args) {
            if (!args) {
                throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
            }
            this.grid = args.grid;
            this.callback = args.callback;
            this.columnDef = args.columnDef;
            this.searchTerms = args.searchTerms || [];
            if (!this.grid || !this.columnDef || !this.columnDef.filter || !this.columnDef.filter.collection) {
                throw new Error("[Aurelia-SlickGrid] You need to pass a \"collection\" for the MultipleSelect Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example: { filter: { model: Filters.singleSelect, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] } }");
            }
            this.enableTranslateLabel = this.columnDef.filter.enableTranslateLabel || false;
            this.labelName = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.label || 'label';
            this.labelPrefixName = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.labelPrefix || 'labelPrefix';
            this.labelSuffixName = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.labelSuffix || 'labelSuffix';
            this.valueName = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.value || 'value';
            var newCollection = this.columnDef && this.columnDef.filter && this.columnDef.filter.collection || [];
            // user might want to filter certain items of the collection
            if (this.gridOptions.params && this.columnDef.filter.collectionFilterBy) {
                var filterBy = this.columnDef.filter.collectionFilterBy;
                newCollection = this.collectionService.filterCollection(newCollection, filterBy);
            }
            // user might want to sort the collection
            if (this.columnDef.filter && this.columnDef.filter.collectionSortBy) {
                var sortBy = this.columnDef.filter.collectionSortBy;
                newCollection = this.collectionService.sortCollection(newCollection, sortBy, this.enableTranslateLabel);
            }
            var searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
            if (typeof searchTerm === 'boolean' || typeof searchTerm === 'number') {
                searchTerm = "" + searchTerm;
            }
            // step 1, create HTML string template
            var filterTemplate = this.buildTemplateHtmlString(newCollection || [], searchTerm);
            // step 2, create the DOM Element of the filter & pre-load search term
            this.createDomElement(filterTemplate);
        };
        /**
         * Clear the filter values
         */
        SingleSelectFilter.prototype.clear = function () {
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
        SingleSelectFilter.prototype.destroy = function () {
            if (this.$filterElm) {
                this.$filterElm.off().remove();
            }
        };
        /**
         * Set value(s) on the DOM element
         */
        SingleSelectFilter.prototype.setValues = function (values) {
            if (values) {
                values = Array.isArray(values) ? values : [values];
                this.$filterElm.multipleSelect('setSelects', values);
            }
        };
        //
        // private functions
        // ------------------
        /**
         * Create the HTML template as a string
         */
        SingleSelectFilter.prototype.buildTemplateHtmlString = function (optionCollection, searchTerm) {
            var _this = this;
            var options = '';
            var isAddingSpaceBetweenLabels = this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure && this.columnDef.filter.customStructure.addSpaceBetweenLabels || false;
            var isRenderHtmlEnabled = this.columnDef && this.columnDef.filter && this.columnDef.filter.enableRenderHtml || false;
            var sanitizedOptions = this.gridOptions && this.gridOptions.sanitizeHtmlOptions || {};
            optionCollection.forEach(function (option) {
                if (!option || (option[_this.labelName] === undefined && option.labelKey === undefined)) {
                    throw new Error("A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example: { filter: { model: Filter.singleSelect, collection: [ { value: '1', label: 'One' } ] } }");
                }
                var labelKey = (option.labelKey || option[_this.labelName]);
                var selected = (option[_this.valueName] === searchTerm) ? 'selected' : '';
                var labelText = ((option.labelKey || _this.enableTranslateLabel) && _this.i18n && typeof _this.i18n.tr === 'function') ? _this.i18n.tr(labelKey || ' ') : labelKey;
                var prefixText = option[_this.labelPrefixName] || '';
                var suffixText = option[_this.labelSuffixName] || '';
                var optionText = isAddingSpaceBetweenLabels ? prefixText + " " + labelText + " " + suffixText : (prefixText + labelText + suffixText);
                // if user specifically wants to render html text, he needs to opt-in else it will stripped out by default
                // also, the 3rd party lib will saninitze any html code unless it's encoded, so we'll do that
                if (isRenderHtmlEnabled) {
                    // sanitize any unauthorized html tags like script and others
                    // for the remaining allowed tags we'll permit all attributes
                    var sanitizeText = sanitizeHtml(optionText, sanitizedOptions);
                    optionText = utilities_1.htmlEncode(sanitizeText);
                }
                // html text of each select option
                options += "<option value=\"" + option[_this.valueName] + "\" " + selected + ">" + optionText + "</option>";
                // if there's a search term, we will add the "filled" class for styling purposes
                if (selected) {
                    _this.isFilled = true;
                }
            });
            return "<select class=\"ms-filter search-filter\">" + options + "</select>";
        };
        /**
         * From the html template string, create a DOM element
         * Subscribe to the onClose event and run the callback when that happens
         * @param filterTemplate
         */
        SingleSelectFilter.prototype.createDomElement = function (filterTemplate) {
            var $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
            $($headerElm).empty();
            // create the DOM element & add an ID and filter class
            this.$filterElm = $(filterTemplate);
            if (typeof this.$filterElm.multipleSelect !== 'function') {
                throw new Error("multiple-select.js was not found, make sure to read the HOWTO Wiki on how to install it");
            }
            this.$filterElm.attr('id', "filter-" + this.columnDef.id);
            this.$filterElm.data('columnId', this.columnDef.id);
            // append the new DOM element to the header row
            if (this.$filterElm && typeof this.$filterElm.appendTo === 'function') {
                this.$filterElm.appendTo($headerElm);
            }
            // merge options & attach multiSelect
            var filterOptions = (this.columnDef.filter) ? this.columnDef.filter.filterOptions : {};
            var options = __assign({}, this.defaultOptions, filterOptions);
            this.$filterElm = this.$filterElm.multipleSelect(options);
        };
        SingleSelectFilter = __decorate([
            aurelia_framework_1.inject(collection_service_1.CollectionService, aurelia_i18n_1.I18N)
        ], SingleSelectFilter);
        return SingleSelectFilter;
    }());
    exports.SingleSelectFilter = SingleSelectFilter;
});
//# sourceMappingURL=singleSelectFilter.js.map