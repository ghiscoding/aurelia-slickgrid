System.register(["./../models/index", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, $, DEFAULT_MIN_VALUE, DEFAULT_MAX_VALUE, DEFAULT_STEP, SliderFilter;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            DEFAULT_MIN_VALUE = 0;
            DEFAULT_MAX_VALUE = 100;
            DEFAULT_STEP = 1;
            SliderFilter = /** @class */ (function () {
                function SliderFilter() {
                    this._clearFilterTriggered = false;
                    this._elementRangeInputId = '';
                    this._elementRangeOutputId = '';
                }
                Object.defineProperty(SliderFilter.prototype, "filterParams", {
                    /** Getter for the Filter Generic Params */
                    get: function () {
                        return this.columnDef && this.columnDef.filter && this.columnDef.filter.params || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SliderFilter.prototype, "filterProperties", {
                    /** Getter for the `filter` properties */
                    get: function () {
                        return this.columnDef && this.columnDef.filter || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SliderFilter.prototype, "operator", {
                    get: function () {
                        return (this.columnDef && this.columnDef.filter && this.columnDef.filter.operator) || index_1.OperatorType.equal;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Initialize the Filter
                 */
                SliderFilter.prototype.init = function (args) {
                    var _this = this;
                    if (!args) {
                        throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
                    }
                    this.grid = args.grid;
                    this.callback = args.callback;
                    this.columnDef = args.columnDef;
                    this.searchTerms = args.searchTerms || [];
                    // define the input & slider number IDs
                    this._elementRangeInputId = "rangeInput_" + this.columnDef.field;
                    this._elementRangeOutputId = "rangeOutput_" + this.columnDef.field;
                    // filter input can only have 1 search term, so we will use the 1st array index if it exist
                    var searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
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
                    // if user chose to display the slider number on the right side, then update it every time it changes
                    // we need to use both "input" and "change" event to be all cross-browser
                    if (!this.filterParams.hideSliderNumber) {
                        this.$filterElm.on('input change', function (e) {
                            var value = e && e.target && e.target.value || '';
                            if (value && document) {
                                var elm = document.getElementById(_this._elementRangeOutputId || '');
                                if (elm && elm.innerHTML) {
                                    elm.innerHTML = value;
                                }
                            }
                        });
                    }
                };
                /**
                 * Clear the filter value
                 */
                SliderFilter.prototype.clear = function () {
                    if (this.$filterElm) {
                        this._clearFilterTriggered = true;
                        this.searchTerms = [];
                        var clearedValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : DEFAULT_MIN_VALUE;
                        this.$filterElm.children('input').val(clearedValue);
                        this.$filterElm.children('div.input-group-addon.input-group-append').children().html(clearedValue);
                        this.$filterElm.trigger('change');
                    }
                };
                /**
                 * destroy the filter
                 */
                SliderFilter.prototype.destroy = function () {
                    if (this.$filterElm) {
                        this.$filterElm.off('change').remove();
                    }
                };
                /**
                 * Set value(s) on the DOM element
                 */
                SliderFilter.prototype.setValues = function (values) {
                    if (values) {
                        this.$filterElm.val(values);
                    }
                };
                //
                // private functions
                // ------------------
                /**
                 * Create the HTML template as a string
                 */
                SliderFilter.prototype.buildTemplateHtmlString = function () {
                    var columnId = this.columnDef && this.columnDef.id;
                    var minValue = this.filterProperties.hasOwnProperty('minValue') ? this.filterProperties.minValue : DEFAULT_MIN_VALUE;
                    var maxValue = this.filterProperties.hasOwnProperty('maxValue') ? this.filterProperties.maxValue : DEFAULT_MAX_VALUE;
                    var defaultValue = this.filterParams.hasOwnProperty('sliderStartValue') ? this.filterParams.sliderStartValue : minValue;
                    var step = this.filterProperties.hasOwnProperty('valueStep') ? this.filterProperties.valueStep : DEFAULT_STEP;
                    if (this.filterParams.hideSliderNumber) {
                        return "\n      <div class=\"search-filter filter-" + columnId + "\">\n        <input type=\"range\" id=\"" + this._elementRangeInputId + "\"\n          name=\"" + this._elementRangeInputId + "\"\n          defaultValue=\"" + defaultValue + "\" min=\"" + minValue + "\" max=\"" + maxValue + "\" step=\"" + step + "\"\n          class=\"form-control slider-filter-input range\" />\n      </div>";
                    }
                    return "\n      <div class=\"input-group search-filter filter-" + columnId + "\">\n        <input type=\"range\" id=\"" + this._elementRangeInputId + "\"\n          name=\"" + this._elementRangeInputId + "\"\n          defaultValue=\"" + defaultValue + "\" min=\"" + minValue + "\" max=\"" + maxValue + "\" step=\"" + step + "\"\n          class=\"form-control slider-filter-input range\" />\n        <div class=\"input-group-addon input-group-append slider-value\">\n          <span class=\"input-group-text\" id=\"" + this._elementRangeOutputId + "\">" + defaultValue + "</span>\n        </div>\n      </div>";
                };
                /**
                 * From the html template string, create a DOM element
                 * @param filterTemplate
                 */
                SliderFilter.prototype.createDomElement = function (filterTemplate, searchTerm) {
                    var columnId = this.columnDef && this.columnDef.id;
                    var $headerElm = this.grid.getHeaderRowColumn(columnId);
                    $($headerElm).empty();
                    // create the DOM element & add an ID and filter class
                    var $filterElm = $(filterTemplate);
                    var searchTermInput = (searchTerm || '0');
                    $filterElm.children('input').val(searchTermInput);
                    $filterElm.children('div.input-group-addon.input-group-append').children().html(searchTermInput);
                    $filterElm.attr('id', "filter-" + columnId);
                    $filterElm.data('columnId', columnId);
                    // if there's a search term, we will add the "filled" class for styling purposes
                    if (searchTerm) {
                        $filterElm.addClass('filled');
                    }
                    // append the new DOM element to the header row
                    if ($filterElm && typeof $filterElm.appendTo === 'function') {
                        $filterElm.appendTo($headerElm);
                    }
                    return $filterElm;
                };
                return SliderFilter;
            }());
            exports_1("SliderFilter", SliderFilter);
        }
    };
});
//# sourceMappingURL=sliderFilter.js.map