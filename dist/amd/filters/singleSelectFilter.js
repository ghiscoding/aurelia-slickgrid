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
define(["require", "exports", "aurelia-i18n", "aurelia-framework", "./../models/index", "jquery"], function (require, exports, aurelia_i18n_1, aurelia_framework_1, index_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SingleSelectFilter = /** @class */ (function () {
        function SingleSelectFilter(i18n) {
            var _this = this;
            this.i18n = i18n;
            this.filterType = index_1.FilterType.singleSelect;
            this.isFilled = false;
            // default options used by this Filter, user can overwrite any of these by passing "otions"
            this.defaultOptions = {
                container: 'body',
                filter: false,
                maxHeight: 200,
                single: true,
                onClose: function () {
                    var selectedItems = _this.$filterElm.multipleSelect('getSelects');
                    var selectedItem = '';
                    if (Array.isArray(selectedItems) && selectedItems.length > 0) {
                        selectedItem = selectedItems[0];
                        _this.isFilled = true;
                        _this.$filterElm.addClass('filled').siblings('div .search-filter').addClass('filled');
                    }
                    else {
                        _this.isFilled = false;
                        _this.$filterElm.removeClass('filled').siblings('div .search-filter').removeClass('filled');
                    }
                    _this.callback(undefined, { columnDef: _this.columnDef, operator: 'EQ', searchTerm: selectedItem });
                }
            };
        }
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
            this.searchTerm = args.searchTerm || '';
            // step 1, create HTML string template
            var filterTemplate = this.buildTemplateHtmlString();
            // step 2, create the DOM Element of the filter & pre-load search term
            this.createDomElement(filterTemplate);
        };
        /**
         * Clear the filter values
         */
        SingleSelectFilter.prototype.clear = function (triggerFilterChange) {
            if (triggerFilterChange === void 0) { triggerFilterChange = true; }
            if (this.$filterElm && this.$filterElm.multipleSelect) {
                // reload the filter element by it's id, to make sure it's still a valid element (because of some issue in the GraphQL example)
                // this.$filterElm = $(`#${this.$filterElm[0].id}`);
                this.$filterElm.multipleSelect('setSelects', []);
                if (triggerFilterChange) {
                    this.callback(undefined, { columnDef: this.columnDef, operator: 'IN', searchTerm: undefined });
                }
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
        SingleSelectFilter.prototype.buildTemplateHtmlString = function () {
            var _this = this;
            if (!this.columnDef || !this.columnDef.filter || !this.columnDef.filter.collection) {
                throw new Error("[Aurelia-SlickGrid] You need to pass a \"collection\" for the SingleSelect Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example:: { filter: type: FilterType.singleSelect, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] }");
            }
            var optionCollection = this.columnDef.filter.collection || [];
            var labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
            var valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';
            var isEnabledTranslate = (this.columnDef.filter.enableTranslateLabel) ? this.columnDef.filter.enableTranslateLabel : false;
            var options = '';
            optionCollection.forEach(function (option) {
                if (!option || (option[labelName] === undefined && option.labelKey === undefined)) {
                    throw new Error("A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example:: { filter: type: FilterType.singleSelect, collection: [ { value: '1', label: 'One' } ]')");
                }
                var labelKey = (option.labelKey || option[labelName]);
                var selected = (option[valueName] === _this.searchTerm) ? 'selected' : '';
                var textLabel = ((option.labelKey || isEnabledTranslate) && _this.i18n && typeof _this.i18n.tr === 'function') ? _this.i18n.tr(labelKey || ' ') : labelKey;
                // html text of each select option
                options += "<option value=\"" + option[valueName] + "\" " + selected + ">" + textLabel + "</option>";
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
            aurelia_framework_1.inject(aurelia_i18n_1.I18N)
        ], SingleSelectFilter);
        return SingleSelectFilter;
    }());
    exports.SingleSelectFilter = SingleSelectFilter;
});
//# sourceMappingURL=singleSelectFilter.js.map