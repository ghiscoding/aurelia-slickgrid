var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { OperatorType } from './../models/index';
import * as $ from 'jquery';
var DEFAULT_MIN_VALUE = 0;
var DEFAULT_MAX_VALUE = 100;
var DEFAULT_STEP = 1;
var CompoundSliderFilter = /** @class */ (function () {
    function CompoundSliderFilter(i18n) {
        this.i18n = i18n;
        this._clearFilterTriggered = false;
        this._elementRangeInputId = '';
        this._elementRangeOutputId = '';
    }
    Object.defineProperty(CompoundSliderFilter.prototype, "gridOptions", {
        /** Getter for the Grid Options pulled through the Grid Object */
        get: function () {
            return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompoundSliderFilter.prototype, "filterParams", {
        /** Getter for the Filter Generic Params */
        get: function () {
            return this.columnDef && this.columnDef.filter && this.columnDef.filter.params || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompoundSliderFilter.prototype, "filterProperties", {
        /** Getter for the `filter` properties */
        get: function () {
            return this.columnDef && this.columnDef.filter || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompoundSliderFilter.prototype, "operator", {
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
    CompoundSliderFilter.prototype.init = function (args) {
        var _this = this;
        if (args) {
            this.grid = args.grid;
            this.callback = args.callback;
            this.columnDef = args.columnDef;
            this.operator = args.operator || '';
            this.searchTerms = args.searchTerms || [];
            // define the input & slider number IDs
            this._elementRangeInputId = "rangeInput_" + this.columnDef.field;
            this._elementRangeOutputId = "rangeOutput_" + this.columnDef.field;
            // filter input can only have 1 search term, so we will use the 1st array index if it exist
            var searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
            // step 1, create the DOM Element of the filter which contain the compound Operator+Input
            // and initialize it if searchTerm is filled
            this.$filterElm = this.createDomElement(searchTerm);
            // step 3, subscribe to the keyup event and run the callback when that happens
            // also add/remove "filled" class for styling purposes
            this.$filterInputElm.change(function (e) {
                _this.onTriggerEvent(e);
            });
            this.$selectOperatorElm.change(function (e) {
                _this.onTriggerEvent(e);
            });
            // if user chose to display the slider number on the right side, then update it every time it changes
            // we need to use both "input" and "change" event to be all cross-browser
            if (!this.filterParams.hideSliderNumber) {
                this.$filterInputElm.on('input change', function (e) {
                    var value = e && e.target && e.target.value || '';
                    if (value && document) {
                        var elm = document.getElementById(_this._elementRangeOutputId || '');
                        if (elm && elm.innerHTML) {
                            elm.innerHTML = value;
                        }
                    }
                });
            }
        }
    };
    /**
     * Clear the filter value
     */
    CompoundSliderFilter.prototype.clear = function () {
        if (this.$filterElm && this.$selectOperatorElm) {
            this._clearFilterTriggered = true;
            this.searchTerms = [];
            var clearedValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : DEFAULT_MIN_VALUE;
            this.$selectOperatorElm.val(0);
            this.$filterInputElm.val(clearedValue);
            if (!this.filterParams.hideSliderNumber) {
                this.$containerInputGroupElm.children('div.input-group-addon.input-group-append').children().last().html(clearedValue);
            }
            this.onTriggerEvent(undefined);
        }
    };
    /**
     * destroy the filter
     */
    CompoundSliderFilter.prototype.destroy = function () {
        if (this.$filterElm) {
            this.$filterElm.off('change').remove();
        }
    };
    /**
     * Set value(s) on the DOM element
     */
    CompoundSliderFilter.prototype.setValues = function (values) {
        if (values && Array.isArray(values)) {
            this.$filterInputElm.val(values[0]);
            this.$containerInputGroupElm.children('div.input-group-addon.input-group-append').children().last().html(values[0]);
        }
    };
    //
    // private functions
    // ------------------
    /** Build HTML Template for the input range (slider) */
    CompoundSliderFilter.prototype.buildTemplateHtmlString = function () {
        var minValue = this.filterProperties.hasOwnProperty('minValue') ? this.filterProperties.minValue : DEFAULT_MIN_VALUE;
        var maxValue = this.filterProperties.hasOwnProperty('maxValue') ? this.filterProperties.maxValue : DEFAULT_MAX_VALUE;
        var defaultValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : minValue;
        var step = this.filterProperties.hasOwnProperty('valueStep') ? this.filterProperties.valueStep : DEFAULT_STEP;
        return "<input type=\"range\" id=\"" + this._elementRangeInputId + "\"\n              name=\"" + this._elementRangeInputId + "\"\n              defaultValue=\"" + defaultValue + "\" min=\"" + minValue + "\" max=\"" + maxValue + "\" step=\"" + step + "\"\n              class=\"form-control slider-filter-input range compound-slider\" />";
    };
    /** Build HTML Template for the text (number) that is shown appended to the slider */
    CompoundSliderFilter.prototype.buildTemplateSliderTextHtmlString = function () {
        var minValue = this.filterProperties.hasOwnProperty('minValue') ? this.filterProperties.minValue : DEFAULT_MIN_VALUE;
        var defaultValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : minValue;
        return "<div class=\"input-group-addon input-group-append slider-value\"><span class=\"input-group-text\" id=\"" + this._elementRangeOutputId + "\">" + defaultValue + "</span></div>";
    };
    /** Build HTML Template select dropdown (operator) */
    CompoundSliderFilter.prototype.buildSelectOperatorHtmlString = function () {
        var optionValues = this.getOptionValues();
        var optionValueString = '';
        optionValues.forEach(function (option) {
            optionValueString += "<option value=\"" + option.operator + "\" title=\"" + option.description + "\">" + option.operator + "</option>";
        });
        return "<select class=\"form-control\">" + optionValueString + "</select>";
    };
    /** Get the available operator option values */
    CompoundSliderFilter.prototype.getOptionValues = function () {
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
    CompoundSliderFilter.prototype.createDomElement = function (searchTerm) {
        var searchTermInput = (searchTerm || '0');
        var $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
        $($headerElm).empty();
        // create the DOM Select dropdown for the Operator
        this.$selectOperatorElm = $(this.buildSelectOperatorHtmlString());
        this.$filterInputElm = $(this.buildTemplateHtmlString());
        var $filterContainerElm = $("<div class=\"form-group search-filter\"></div>");
        this.$containerInputGroupElm = $("<div class=\"input-group search-filter\"></div>");
        var $operatorInputGroupAddon = $("<span class=\"input-group-addon input-group-prepend operator\"></span>");
        /* the DOM element final structure will be
          <div class="input-group">
            <div class="input-group-addon input-group-prepend operator">
              <select class="form-control"></select>
            </div>
            <input class="form-control" type="text" />
            <div class="input-group-addon input-group-prepend" id="rangeOuput_percentComplete"><span class="input-group-text">0</span></div>
          </div>
        */
        $operatorInputGroupAddon.append(this.$selectOperatorElm);
        this.$containerInputGroupElm.append($operatorInputGroupAddon);
        this.$containerInputGroupElm.append(this.$filterInputElm);
        if (!this.filterParams.hideSliderNumber) {
            var $sliderTextInputAppendAddon = $(this.buildTemplateSliderTextHtmlString());
            $sliderTextInputAppendAddon.children().html(searchTermInput);
            this.$containerInputGroupElm.append($sliderTextInputAppendAddon);
        }
        // create the DOM element & add an ID and filter class
        $filterContainerElm.append(this.$containerInputGroupElm);
        $filterContainerElm.attr('id', "filter-" + this.columnDef.field);
        this.$filterInputElm.val(searchTermInput);
        this.$filterInputElm.data('columnId', this.columnDef.field);
        if (this.operator) {
            this.$selectOperatorElm.val(this.operator);
        }
        // if there's a search term, we will add the "filled" class for styling purposes
        if (searchTerm) {
            $filterContainerElm.addClass('filled');
        }
        // append the new DOM element to the header row
        if ($filterContainerElm && typeof $filterContainerElm.appendTo === 'function') {
            $filterContainerElm.appendTo($headerElm);
        }
        return $filterContainerElm;
    };
    CompoundSliderFilter.prototype.onTriggerEvent = function (e) {
        if (this._clearFilterTriggered) {
            this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered });
            this._clearFilterTriggered = false; // reset flag for next use
        }
        else {
            var selectedOperator = this.$selectOperatorElm.find('option:selected').text();
            var value = this.$filterInputElm.val();
            (value) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
            this.callback(e, { columnDef: this.columnDef, searchTerms: (value ? [value] : null), operator: selectedOperator || '' });
        }
    };
    CompoundSliderFilter = __decorate([
        inject(I18N)
    ], CompoundSliderFilter);
    return CompoundSliderFilter;
}());
export { CompoundSliderFilter };
//# sourceMappingURL=compoundSliderFilter.js.map