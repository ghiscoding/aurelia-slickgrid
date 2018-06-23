var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "./../models/index", "jquery"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, index_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DEFAULT_MIN_VALUE = 0;
    var DEFAULT_MAX_VALUE = 100;
    var DEFAULT_STEP = 1;
    var CompoundSliderFilter = /** @class */ (function () {
        function CompoundSliderFilter(i18n) {
            this.i18n = i18n;
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
                return this._operator || index_1.OperatorType.empty;
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
            }
        };
        /**
         * Clear the filter value
         */
        CompoundSliderFilter.prototype.clear = function () {
            if (this.$filterElm && this.$selectOperatorElm) {
                var clearedValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : DEFAULT_MIN_VALUE;
                this.$selectOperatorElm.val(0);
                this.$filterInputElm.val(clearedValue);
                if (!this.filterParams.hideSliderNumber) {
                    this.$containerInputGroupElm.children('span.input-group-addon').last().html(clearedValue);
                }
                this.onTriggerEvent(undefined, true);
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
                this.$containerInputGroupElm.children('span.input-group-addon').last().html(values[0]);
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
            return "<input type=\"range\" id=\"rangeInput_" + this.columnDef.field + "\"\n              name=\"rangeInput_" + this.columnDef.field + "\"\n              defaultValue=\"" + defaultValue + "\" min=\"" + minValue + "\" max=\"" + maxValue + "\" step=\"" + step + "\"\n              class=\"form-control slider-filter-input range compound-slider\"\n              onmousemove=\"$('#rangeOuput_" + this.columnDef.field + "').html(rangeInput_" + this.columnDef.field + ".value)\" />";
        };
        /** Build HTML Template for the text (number) that is shown appended to the slider */
        CompoundSliderFilter.prototype.buildTemplateSliderTextHtmlString = function () {
            var minValue = this.filterProperties.hasOwnProperty('minValue') ? this.filterProperties.minValue : DEFAULT_MIN_VALUE;
            var defaultValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : minValue;
            return "<span class=\"input-group-addon slider-value\" id=\"rangeOuput_" + this.columnDef.field + "\">" + defaultValue + "</span>";
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
            var $operatorInputGroupAddon = $("<span class=\"input-group-addon operator\"></span>");
            /* the DOM element final structure will be
              <div class="input-group">
                <div class="input-group-addon operator">
                  <select class="form-control"></select>
                </div>
                <input class="form-control" type="text" />
                <span class="input-group-addon" id="rangeOuput_percentComplete">0</span>
              </div>
            */
            $operatorInputGroupAddon.append(this.$selectOperatorElm);
            this.$containerInputGroupElm.append($operatorInputGroupAddon);
            this.$containerInputGroupElm.append(this.$filterInputElm);
            if (!this.filterParams.hideSliderNumber) {
                var $sliderTextInputAppendAddon = $(this.buildTemplateSliderTextHtmlString());
                $sliderTextInputAppendAddon.html(searchTermInput);
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
        CompoundSliderFilter.prototype.onTriggerEvent = function (e, clearFilterTriggered) {
            if (clearFilterTriggered) {
                this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: true });
            }
            else {
                var selectedOperator = this.$selectOperatorElm.find('option:selected').text();
                var value = this.$filterInputElm.val();
                (value) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
                this.callback(e, { columnDef: this.columnDef, searchTerms: (value ? [value] : null), operator: selectedOperator || '' });
            }
        };
        CompoundSliderFilter = __decorate([
            aurelia_framework_1.inject(aurelia_i18n_1.I18N)
        ], CompoundSliderFilter);
        return CompoundSliderFilter;
    }());
    exports.CompoundSliderFilter = CompoundSliderFilter;
});
//# sourceMappingURL=compoundSliderFilter.js.map