System.register(["jquery"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var $, InputFilter;
    return {
        setters: [
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            InputFilter = /** @class */ (function () {
                function InputFilter() {
                    this._clearFilterTriggered = false;
                }
                Object.defineProperty(InputFilter.prototype, "gridOptions", {
                    /** Getter for the Grid Options pulled through the Grid Object */
                    get: function () {
                        return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(InputFilter.prototype, "operator", {
                    get: function () {
                        return this.columnDef && this.columnDef.filter && this.columnDef.filter.operator || '';
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Initialize the Filter
                 */
                InputFilter.prototype.init = function (args) {
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
                    // step 1, create HTML string template
                    var filterTemplate = this.buildTemplateHtmlString();
                    // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
                    this.$filterElm = this.createDomElement(filterTemplate, searchTerm);
                    // step 3, subscribe to the keyup event and run the callback when that happens
                    // also add/remove "filled" class for styling purposes
                    this.$filterElm.keyup(function (e) {
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
                 * Clear the filter value
                 */
                InputFilter.prototype.clear = function () {
                    if (this.$filterElm) {
                        this._clearFilterTriggered = true;
                        this.searchTerms = [];
                        this.$filterElm.val('');
                        this.$filterElm.trigger('keyup');
                    }
                };
                /**
                 * destroy the filter
                 */
                InputFilter.prototype.destroy = function () {
                    if (this.$filterElm) {
                        this.$filterElm.off('keyup').remove();
                    }
                };
                /**
                 * Set value(s) on the DOM element
                 */
                InputFilter.prototype.setValues = function (values) {
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
                InputFilter.prototype.buildTemplateHtmlString = function () {
                    var columnId = this.columnDef && this.columnDef.id;
                    var placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
                    return "<input type=\"text\" class=\"form-control search-filter filter-" + columnId + "\" placeholder=\"" + placeholder + "\">";
                };
                /**
                 * From the html template string, create a DOM element
                 * @param filterTemplate
                 */
                InputFilter.prototype.createDomElement = function (filterTemplate, searchTerm) {
                    var columnId = this.columnDef && this.columnDef.id;
                    var $headerElm = this.grid.getHeaderRowColumn(columnId);
                    $($headerElm).empty();
                    // create the DOM element & add an ID and filter class
                    var $filterElm = $(filterTemplate);
                    var searchTermInput = searchTerm;
                    $filterElm.val(searchTermInput);
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
                return InputFilter;
            }());
            exports_1("InputFilter", InputFilter);
        }
    };
});
//# sourceMappingURL=inputFilter.js.map