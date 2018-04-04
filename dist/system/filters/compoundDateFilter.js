System.register(["aurelia-framework", "aurelia-i18n", "../services/utilities", "./../models/index", "flatpickr", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_framework_1, aurelia_i18n_1, utilities_1, index_1, flatpickr, $, CompoundDateFilter;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (aurelia_i18n_1_1) {
                aurelia_i18n_1 = aurelia_i18n_1_1;
            },
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (flatpickr_1) {
                flatpickr = flatpickr_1;
            },
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            CompoundDateFilter = /** @class */ (function () {
                function CompoundDateFilter(i18n) {
                    this.i18n = i18n;
                    this.filterType = index_1.FilterType.compoundDate;
                }
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
                        this.searchTerm = args.searchTerm;
                        if (this.grid && typeof this.grid.getOptions === 'function') {
                            this.gridOptions = this.grid.getOptions();
                        }
                        // step 1, create the DOM Element of the filter which contain the compound Operator+Input
                        // and initialize it if searchTerm is filled
                        this.$filterElm = this.createDomElement();
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
                CompoundDateFilter.prototype.clear = function (triggerFilterKeyup) {
                    if (triggerFilterKeyup === void 0) { triggerFilterKeyup = true; }
                    if (this.flatInstance && this.$selectOperatorElm) {
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
                    if (values) {
                        this.flatInstance.setDate(values);
                    }
                };
                //
                // private functions
                // ------------------
                CompoundDateFilter.prototype.buildDatePickerInput = function (searchTerm) {
                    var _this = this;
                    var inputFormat = utilities_1.mapFlatpickrDateFormatWithFieldType(this.columnDef.type || index_1.FieldType.dateIso);
                    var outputFormat = utilities_1.mapFlatpickrDateFormatWithFieldType(this.columnDef.outputType || this.columnDef.type || index_1.FieldType.dateUtc);
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
                    if (outputFormat && (outputFormat === 'Z' || outputFormat.toLowerCase().includes('h'))) {
                        pickerOptions.enableTime = true;
                    }
                    var placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
                    var $filterInputElm = $("<div class=flatpickr><input type=\"text\" class=\"form-control\" data-input placeholder=\"" + placeholder + "\"></div>");
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
                CompoundDateFilter.prototype.createDomElement = function () {
                    var $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
                    $($headerElm).empty();
                    var searchTerm = (this.searchTerm || '');
                    if (searchTerm) {
                        this._currentValue = searchTerm;
                    }
                    // create the DOM Select dropdown for the Operator
                    this.$selectOperatorElm = $(this.buildSelectOperatorHtmlString());
                    this.$filterInputElm = this.buildDatePickerInput(searchTerm);
                    var $filterContainerElm = $("<div class=\"form-group search-filter\"></div>");
                    var $containerInputGroup = $("<div class=\"input-group flatpickr\"></div>");
                    var $operatorInputGroupAddon = $("<div class=\"input-group-addon operator\"></div>");
                    /* the DOM element final structure will be
                      <div class="input-group">
                        <div class="input-group-addon operator">
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
                    $filterContainerElm.attr('id', "filter-" + this.columnDef.id);
                    this.$filterInputElm.data('columnId', this.columnDef.id);
                    if (this.operator) {
                        this.$selectOperatorElm.val(this.operator);
                    }
                    // if there's a search term, we will add the "filled" class for styling purposes
                    if (this.searchTerm) {
                        $filterContainerElm.addClass('filled');
                    }
                    // append the new DOM element to the header row
                    if ($filterContainerElm && typeof $filterContainerElm.appendTo === 'function') {
                        $filterContainerElm.appendTo($headerElm);
                    }
                    return $filterContainerElm;
                };
                CompoundDateFilter.prototype.loadFlatpickrLocale = function (locale) {
                    // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
                    if (locale !== 'en') {
                        var localeDefault = require("flatpickr/dist/l10n/" + locale + ".js").default;
                        return (localeDefault && localeDefault[locale]) ? localeDefault[locale] : 'en';
                    }
                    return 'en';
                };
                CompoundDateFilter.prototype.onTriggerEvent = function (e) {
                    var selectedOperator = this.$selectOperatorElm.find('option:selected').text();
                    (this._currentValue) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
                    this.callback(e, { columnDef: this.columnDef, searchTerm: this._currentValue, operator: selectedOperator || '=' });
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
                    aurelia_framework_1.inject(aurelia_i18n_1.I18N)
                ], CompoundDateFilter);
                return CompoundDateFilter;
            }());
            exports_1("CompoundDateFilter", CompoundDateFilter);
        }
    };
});
//# sourceMappingURL=compoundDateFilter.js.map