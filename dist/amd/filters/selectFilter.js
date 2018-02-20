var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-i18n", "aurelia-framework", "jquery"], function (require, exports, aurelia_i18n_1, aurelia_framework_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectFilter = /** @class */ (function () {
        function SelectFilter(i18n) {
            this.i18n = i18n;
        }
        /**
         * Initialize the Filter
         */
        SelectFilter.prototype.init = function (args) {
            var _this = this;
            if (!args) {
                throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
            }
            this.grid = args.grid;
            this.callback = args.callback;
            this.columnDef = args.columnDef;
            this.searchTerm = args.searchTerm || '';
            // step 1, create HTML string template
            var filterTemplate = this.buildTemplateHtmlString();
            // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
            this.$filterElm = this.createDomElement(filterTemplate);
            // step 3, subscribe to the change event and run the callback when that happens
            // also add/remove "filled" class for styling purposes
            this.$filterElm.change(function (e) {
                (e && e.target && e.target.value) ? _this.$filterElm.addClass('filled') : _this.$filterElm.removeClass('filled');
                _this.callback(e, { columnDef: _this.columnDef, operator: 'EQ' });
            });
        };
        /**
         * Clear the filter values
         */
        SelectFilter.prototype.clear = function (triggerFilterChange) {
            if (triggerFilterChange === void 0) { triggerFilterChange = true; }
            if (this.$filterElm) {
                this.$filterElm.val('');
                if (triggerFilterChange) {
                    this.$filterElm.trigger('change');
                }
            }
        };
        /**
         * destroy the filter
         */
        SelectFilter.prototype.destroy = function () {
            if (this.$filterElm) {
                this.$filterElm.off('change').remove();
            }
        };
        //
        // private functions
        // ------------------
        SelectFilter.prototype.buildTemplateHtmlString = function () {
            var _this = this;
            if (!this.columnDef || !this.columnDef.filter || (!this.columnDef.filter.collection && !this.columnDef.filter.selectOptions)) {
                throw new Error("[Aurelia-SlickGrid] You need to pass a \"collection\" for the Select Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example:: { filter: type: FilterType.select, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] }");
            }
            if (!this.columnDef.filter.collection && this.columnDef.filter.selectOptions) {
                console.warn("[Aurelia-SlickGrid] The Select Filter \"selectOptions\" property will de deprecated in future version. Please use the new \"collection\" property which is more generic and can be used with other Filters (not just Select).");
            }
            var optionCollection = this.columnDef.filter.collection || this.columnDef.filter.selectOptions || [];
            var labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
            var valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';
            var isEnabledTranslate = (this.columnDef.filter.enableTranslateLabel) ? this.columnDef.filter.enableTranslateLabel : false;
            var options = '';
            optionCollection.forEach(function (option) {
                if (!option || (option[labelName] === undefined && option.labelKey === undefined)) {
                    throw new Error("A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example:: { filter: type: FilterType.select, collection: [ { value: '1', label: 'One' } ]')");
                }
                var labelKey = option.labelKey || option[labelName];
                var textLabel = ((option.labelKey || isEnabledTranslate) && _this.i18n && typeof _this.i18n.tr === 'function') ? _this.i18n.tr(labelKey || ' ') : labelKey;
                options += "<option value=\"" + option[valueName] + "\">" + textLabel + "</option>";
            });
            return "<select class=\"form-control search-filter\">" + options + "</select>";
        };
        /**
         * From the html template string, create a DOM element
         * @param filterTemplate
         */
        SelectFilter.prototype.createDomElement = function (filterTemplate) {
            var $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
            $($headerElm).empty();
            // create the DOM element & add an ID and filter class
            var $filterElm = $(filterTemplate);
            var searchTerm = (typeof this.searchTerm === 'boolean') ? "" + this.searchTerm : this.searchTerm;
            $filterElm.val(searchTerm || '');
            $filterElm.attr('id', "filter-" + this.columnDef.id);
            $filterElm.data('columnId', this.columnDef.id);
            // append the new DOM element to the header row
            if ($filterElm && typeof $filterElm.appendTo === 'function') {
                $filterElm.appendTo($headerElm);
            }
            return $filterElm;
        };
        SelectFilter = __decorate([
            aurelia_framework_1.inject(aurelia_i18n_1.I18N)
        ], SelectFilter);
        return SelectFilter;
    }());
    exports.SelectFilter = SelectFilter;
});
//# sourceMappingURL=selectFilter.js.map