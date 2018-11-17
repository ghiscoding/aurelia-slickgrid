var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { mapFlatpickrDateFormatWithFieldType } from '../services/utilities';
import { FieldType, OperatorType } from './../models/index';
import * as flatpickr from 'flatpickr';
import * as $ from 'jquery';
var CompoundDateFilter = /** @class */ (function () {
    function CompoundDateFilter(i18n) {
        this.i18n = i18n;
        this._clearFilterTriggered = false;
    }
    Object.defineProperty(CompoundDateFilter.prototype, "gridOptions", {
        /** Getter for the Grid Options pulled through the Grid Object */
        get: function () {
            return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompoundDateFilter.prototype, "operator", {
        get: function () {
            return this._operator || OperatorType.empty;
        },
        set: function (op) {
            this._operator = op;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize the Filter
     */
    CompoundDateFilter.prototype.init = function (args) {
        var _this = this;
        if (args) {
            this.grid = args.grid;
            this.callback = args.callback;
            this.columnDef = args.columnDef;
            this.operator = args.operator || '';
            this.searchTerms = args.searchTerms || [];
            // date input can only have 1 search term, so we will use the 1st array index if it exist
            var searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
            // step 1, create the DOM Element of the filter which contain the compound Operator+Input
            // and initialize it if searchTerm is filled
            this.$filterElm = this.createDomElement(searchTerm);
            // step 3, subscribe to the keyup event and run the callback when that happens
            // also add/remove "filled" class for styling purposes
            this.$filterInputElm.keyup(function (e) {
                _this.onTriggerEvent(e);
            });
            this.$selectOperatorElm.change(function (e) {
                _this.onTriggerEvent(e);
            });
        }
    };
    /**
     * Clear the filter value
     */
    CompoundDateFilter.prototype.clear = function () {
        if (this.flatInstance && this.$selectOperatorElm) {
            this._clearFilterTriggered = true;
            this.searchTerms = [];
            this.$selectOperatorElm.val(0);
            this.flatInstance.clear();
        }
    };
    /**
     * destroy the filter
     */
    CompoundDateFilter.prototype.destroy = function () {
        if (this.$filterElm) {
            this.$filterElm.off('keyup').remove();
        }
    };
    /**
     * Set value(s) on the DOM element
     */
    CompoundDateFilter.prototype.setValues = function (values) {
        if (values && Array.isArray(values)) {
            this.flatInstance.setDate(values[0]);
        }
    };
    //
    // private functions
    // ------------------
    CompoundDateFilter.prototype.buildDatePickerInput = function (searchTerm) {
        var _this = this;
        var inputFormat = mapFlatpickrDateFormatWithFieldType(this.columnDef.type || FieldType.dateIso);
        var outputFormat = mapFlatpickrDateFormatWithFieldType(this.columnDef.outputType || this.columnDef.type || FieldType.dateUtc);
        var currentLocale = this.i18n.getLocale() || 'en';
        if (currentLocale.length > 2) {
            currentLocale = currentLocale.substring(0, 2);
        }
        var pickerOptions = {
            defaultDate: searchTerm || '',
            altInput: true,
            altFormat: outputFormat,
            dateFormat: inputFormat,
            wrap: true,
            closeOnSelect: true,
            locale: (currentLocale !== 'en') ? this.loadFlatpickrLocale(currentLocale) : 'en',
            onChange: function (selectedDates, dateStr, instance) {
                _this._currentValue = dateStr;
                // when using the time picker, we can simulate a keyup event to avoid multiple backend request
                // since backend request are only executed after user start typing, changing the time should be treated the same way
                if (pickerOptions.enableTime) {
                    _this.onTriggerEvent(new CustomEvent('keyup'));
                }
                else {
                    _this.onTriggerEvent(undefined);
                }
            }
        };
        // add the time picker when format is UTC (Z) or has the 'h' (meaning hours)
        if (outputFormat && (outputFormat === 'Z' || outputFormat.toLowerCase().indexOf('h') > -1)) {
            pickerOptions.enableTime = true;
        }
        var placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
        var $filterInputElm = $("<div class=\"flatpickr\"><input type=\"text\" class=\"form-control\" data-input placeholder=\"" + placeholder + "\"></div>");
        this.flatInstance = (flatpickr && $filterInputElm[0] && typeof $filterInputElm[0].flatpickr === 'function') ? $filterInputElm[0].flatpickr(pickerOptions) : null;
        return $filterInputElm;
    };
    CompoundDateFilter.prototype.buildSelectOperatorHtmlString = function () {
        var optionValues = this.getOptionValues();
        var optionValueString = '';
        optionValues.forEach(function (option) {
            optionValueString += "<option value=\"" + option.operator + "\" title=\"" + option.description + "\">" + option.operator + "</option>";
        });
        return "<select class=\"form-control\">" + optionValueString + "</select>";
    };
    CompoundDateFilter.prototype.getOptionValues = function () {
        return [
            { operator: '', description: '' },
            { operator: '=', description: '' },
            { operator: '<', description: '' },
            { operator: '<=', description: '' },
            { operator: '>', description: '' },
            { operator: '>=', description: '' },
            { operator: '<>', description: '' }
        ];
    };
    /**
     * Create the DOM element
     */
    CompoundDateFilter.prototype.createDomElement = function (searchTerm) {
        var columnId = this.columnDef && this.columnDef.id;
        var $headerElm = this.grid.getHeaderRowColumn(columnId);
        $($headerElm).empty();
        // create the DOM Select dropdown for the Operator
        this.$selectOperatorElm = $(this.buildSelectOperatorHtmlString());
        this.$filterInputElm = this.buildDatePickerInput(searchTerm);
        var $filterContainerElm = $("<div class=\"form-group search-filter filter-" + columnId + "\"></div>");
        var $containerInputGroup = $("<div class=\"input-group flatpickr\"></div>");
        var $operatorInputGroupAddon = $("<div class=\"input-group-addon input-group-prepend operator\"></div>");
        /* the DOM element final structure will be
          <div class="input-group">
            <div class="input-group-addon input-group-prepend operator">
              <select class="form-control"></select>
            </div>
            <div class=flatpickr>
              <input type="text" class="form-control" data-input>
            </div>
          </div>
        */
        $operatorInputGroupAddon.append(this.$selectOperatorElm);
        $containerInputGroup.append($operatorInputGroupAddon);
        $containerInputGroup.append(this.$filterInputElm);
        // create the DOM element & add an ID and filter class
        $filterContainerElm.append($containerInputGroup);
        $filterContainerElm.attr('id', "filter-" + columnId);
        this.$filterInputElm.data('columnId', columnId);
        if (this.operator) {
            this.$selectOperatorElm.val(this.operator);
        }
        // if there's a search term, we will add the "filled" class for styling purposes
        if (searchTerm) {
            $filterContainerElm.addClass('filled');
            this._currentValue = searchTerm;
        }
        // append the new DOM element to the header row
        if ($filterContainerElm && typeof $filterContainerElm.appendTo === 'function') {
            $filterContainerElm.appendTo($headerElm);
        }
        return $filterContainerElm;
    };
    CompoundDateFilter.prototype.loadFlatpickrLocale = function (locale) {
        // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
        if (this.gridOptions && this.gridOptions.params && this.gridOptions.params.flapickrLocale) {
            return this.gridOptions.params.flapickrLocale;
        }
        else if (locale !== 'en') {
            var localeDefault = require("flatpickr/dist/l10n/" + locale + ".js").default;
            return (localeDefault && localeDefault[locale]) ? localeDefault[locale] : 'en';
        }
        return 'en';
    };
    CompoundDateFilter.prototype.onTriggerEvent = function (e) {
        if (this._clearFilterTriggered) {
            this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered });
            this._clearFilterTriggered = false; // reset flag for next use
        }
        else {
            var selectedOperator = this.$selectOperatorElm.find('option:selected').text();
            (this._currentValue) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
            this.callback(e, { columnDef: this.columnDef, searchTerms: (this._currentValue ? [this._currentValue] : null), operator: selectedOperator || '' });
        }
    };
    CompoundDateFilter.prototype.hide = function () {
        if (this.flatInstance && typeof this.flatInstance.close === 'function') {
            this.flatInstance.close();
        }
    };
    CompoundDateFilter.prototype.show = function () {
        if (this.flatInstance && typeof this.flatInstance.open === 'function') {
            this.flatInstance.open();
        }
    };
    CompoundDateFilter = __decorate([
        inject(I18N)
    ], CompoundDateFilter);
    return CompoundDateFilter;
}());
export { CompoundDateFilter };
//# sourceMappingURL=compoundDateFilter.js.map