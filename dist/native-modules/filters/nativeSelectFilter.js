var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';
import { OperatorType } from './../models/index';
import * as $ from 'jquery';
var NativeSelectFilter = /** @class */ (function () {
    function NativeSelectFilter(i18n) {
        this.i18n = i18n;
        this._clearFilterTriggered = false;
    }
    Object.defineProperty(NativeSelectFilter.prototype, "operator", {
        get: function () {
            return (this.columnDef && this.columnDef.filter && this.columnDef.filter.operator) || OperatorType.equal;
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
        var optionCollection = this.columnDef.filter.collection || [];
        var labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
        var valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';
        var isEnabledTranslate = (this.columnDef.filter.enableTranslateLabel) ? this.columnDef.filter.enableTranslateLabel : false;
        var options = '';
        optionCollection.forEach(function (option) {
            if (!option || (option[labelName] === undefined && option.labelKey === undefined)) {
                throw new Error("A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example: { filter: { model: Filters.select, collection: [ { value: '1', label: 'One' } ] } }");
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
    NativeSelectFilter.prototype.createDomElement = function (filterTemplate, searchTerm) {
        var $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
        $($headerElm).empty();
        // create the DOM element & add an ID and filter class
        var $filterElm = $(filterTemplate);
        var searchTermInput = (searchTerm || '');
        $filterElm.val(searchTermInput);
        $filterElm.attr('id', "filter-" + this.columnDef.id);
        $filterElm.data('columnId', this.columnDef.id);
        // append the new DOM element to the header row
        if ($filterElm && typeof $filterElm.appendTo === 'function') {
            $filterElm.appendTo($headerElm);
        }
        return $filterElm;
    };
    NativeSelectFilter = __decorate([
        inject(I18N)
    ], NativeSelectFilter);
    return NativeSelectFilter;
}());
export { NativeSelectFilter };
//# sourceMappingURL=nativeSelectFilter.js.map