System.register(["aurelia-framework", "aurelia-i18n", "./../models/index", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var aurelia_framework_1, aurelia_i18n_1, index_1, $, CompoundInputFilter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (aurelia_i18n_1_1) {
                aurelia_i18n_1 = aurelia_i18n_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            CompoundInputFilter = /** @class */ (function () {
                function CompoundInputFilter(i18n) {
                    this.i18n = i18n;
                    this._clearFilterTriggered = false;
                    this._inputType = 'text';
                }
                Object.defineProperty(CompoundInputFilter.prototype, "gridOptions", {
                    /** Getter for the Grid Options pulled through the Grid Object */
                    get: function () {
                        return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CompoundInputFilter.prototype, "inputType", {
                    /** Getter of input type (text, number, password) */
                    get: function () {
                        return this._inputType;
                    },
                    /** Setter of input type (text, number, password) */
                    set: function (type) {
                        this._inputType = type;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CompoundInputFilter.prototype, "operator", {
                    /** Getter of the Operator to use when doing the filter comparing */
                    get: function () {
                        return this._operator || index_1.OperatorType.empty;
                    },
                    /** Getter of the Operator to use when doing the filter comparing */
                    set: function (op) {
                        this._operator = op;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Initialize the Filter
                 */
                CompoundInputFilter.prototype.init = function (args) {
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
                        this.$filterInputElm.on('keyup input change', function (e) {
                            _this.onTriggerEvent(e);
                        });
                        this.$selectOperatorElm.on('change', function (e) {
                            _this.onTriggerEvent(e);
                        });
                    }
                };
                /**
                 * Clear the filter value
                 */
                CompoundInputFilter.prototype.clear = function () {
                    if (this.$filterElm && this.$selectOperatorElm) {
                        this._clearFilterTriggered = true;
                        this.searchTerms = [];
                        this.$selectOperatorElm.val(0);
                        this.$filterInputElm.val('');
                        this.onTriggerEvent(undefined);
                    }
                };
                /**
                 * destroy the filter
                 */
                CompoundInputFilter.prototype.destroy = function () {
                    if (this.$filterElm && this.$selectOperatorElm) {
                        this.$filterElm.off('keyup input change').remove();
                        this.$selectOperatorElm.off('change');
                    }
                };
                /**
                 * Set value(s) on the DOM element
                 */
                CompoundInputFilter.prototype.setValues = function (values) {
                    if (values && Array.isArray(values)) {
                        this.$filterElm.val(values[0]);
                    }
                };
                //
                // private functions
                // ------------------
                CompoundInputFilter.prototype.buildInputHtmlString = function () {
                    var placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
                    return "<input class=\"form-control\" type=\"" + (this._inputType || 'text') + "\" placeholder=\"" + placeholder + "\" />";
                };
                CompoundInputFilter.prototype.buildSelectOperatorHtmlString = function () {
                    var optionValues = this.getOptionValues();
                    var optionValueString = '';
                    optionValues.forEach(function (option) {
                        optionValueString += "<option value=\"" + option.operator + "\" title=\"" + option.description + "\">" + option.operator + "</option>";
                    });
                    return "<select class=\"form-control\">" + optionValueString + "</select>";
                };
                CompoundInputFilter.prototype.getOptionValues = function () {
                    var type = (this.columnDef.type && this.columnDef.type) ? this.columnDef.type : index_1.FieldType.string;
                    var optionValues = [];
                    switch (type) {
                        case index_1.FieldType.string:
                            optionValues = [
                                { operator: '', description: this.i18n.tr('CONTAINS') },
                                { operator: '=', description: this.i18n.tr('EQUALS') },
                                { operator: 'a*', description: this.i18n.tr('STARTS_WITH') },
                                { operator: '*z', description: this.i18n.tr('ENDS_WITH') },
                            ];
                            break;
                        default:
                            optionValues = [
                                { operator: '', description: this.i18n.tr('CONTAINS') },
                                { operator: '=', description: '' },
                                { operator: '<', description: '' },
                                { operator: '<=', description: '' },
                                { operator: '>', description: '' },
                                { operator: '>=', description: '' },
                                { operator: '<>', description: '' }
                            ];
                            break;
                    }
                    return optionValues;
                };
                /**
                 * Create the DOM element
                 */
                CompoundInputFilter.prototype.createDomElement = function (searchTerm) {
                    var columnId = this.columnDef && this.columnDef.id;
                    var $headerElm = this.grid.getHeaderRowColumn(columnId);
                    $($headerElm).empty();
                    // create the DOM Select dropdown for the Operator
                    this.$selectOperatorElm = $(this.buildSelectOperatorHtmlString());
                    this.$filterInputElm = $(this.buildInputHtmlString());
                    var $filterContainerElm = $("<div class=\"form-group search-filter filter-" + columnId + "\"></div>");
                    var $containerInputGroup = $("<div class=\"input-group\"></div>");
                    var $operatorInputGroupAddon = $("<div class=\"input-group-addon input-group-prepend operator\"></div>");
                    /* the DOM element final structure will be
                      <div class="input-group">
                        <div class="input-group-addon input-group-prepend operator">
                          <select class="form-control"></select>
                        </div>
                        <input class="form-control" type="text" />
                      </div>
                    */
                    $operatorInputGroupAddon.append(this.$selectOperatorElm);
                    $containerInputGroup.append($operatorInputGroupAddon);
                    $containerInputGroup.append(this.$filterInputElm);
                    // create the DOM element & add an ID and filter class
                    $filterContainerElm.append($containerInputGroup);
                    $filterContainerElm.attr('id', "filter-" + columnId);
                    this.$filterInputElm.val(searchTerm);
                    this.$filterInputElm.data('columnId', columnId);
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
                /** Event trigger, could be called by the Operator dropdown or the input itself */
                CompoundInputFilter.prototype.onTriggerEvent = function (e) {
                    if (this._clearFilterTriggered) {
                        this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered });
                        this._clearFilterTriggered = false; // reset flag for next use
                    }
                    else {
                        var selectedOperator = this.$selectOperatorElm.find('option:selected').text();
                        var value = this.$filterInputElm.val();
                        (value !== null && value !== undefined && value !== '') ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
                        this.callback(e, { columnDef: this.columnDef, searchTerms: (value ? [value] : null), operator: selectedOperator || '' });
                    }
                };
                CompoundInputFilter = __decorate([
                    aurelia_framework_1.inject(aurelia_i18n_1.I18N)
                ], CompoundInputFilter);
                return CompoundInputFilter;
            }());
            exports_1("CompoundInputFilter", CompoundInputFilter);
        }
    };
});
//# sourceMappingURL=compoundInputFilter.js.map