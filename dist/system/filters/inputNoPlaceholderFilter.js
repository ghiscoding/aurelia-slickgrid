System.register(["./../models/index", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, $, InputNoPlaceholderFilter;
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
            InputNoPlaceholderFilter = /** @class */ (function () {
                function InputNoPlaceholderFilter() {
                    this.filterType = index_1.FilterType.inputNoPlaceholder;
                }
                /**
                 * Initialize the Filter
                 */
                InputNoPlaceholderFilter.prototype.init = function (args) {
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
                    // step 3, subscribe to the keyup event and run the callback when that happens
                    // also add/remove "filled" class for styling purposes
                    this.$filterElm.keyup(function (e) {
                        (e && e.target && e.target.value) ? _this.$filterElm.addClass('filled') : _this.$filterElm.removeClass('filled');
                        _this.callback(e, { columnDef: _this.columnDef });
                    });
                };
                /**
                 * Clear the filter value
                 */
                InputNoPlaceholderFilter.prototype.clear = function (triggerFilterKeyup) {
                    if (triggerFilterKeyup === void 0) { triggerFilterKeyup = true; }
                    if (this.$filterElm) {
                        this.$filterElm.val('');
                        if (triggerFilterKeyup) {
                            this.$filterElm.trigger('keyup');
                        }
                    }
                };
                /**
                 * destroy the filter
                 */
                InputNoPlaceholderFilter.prototype.destroy = function () {
                    if (this.$filterElm) {
                        this.$filterElm.off('keyup').remove();
                    }
                };
                /**
                 * Set value(s) on the DOM element
                 */
                InputNoPlaceholderFilter.prototype.setValues = function (values) {
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
                InputNoPlaceholderFilter.prototype.buildTemplateHtmlString = function () {
                    return "<input type=\"text\" class=\"form-control search-filter\">";
                };
                /**
                 * From the html template string, create a DOM element
                 * @param filterTemplate
                 */
                InputNoPlaceholderFilter.prototype.createDomElement = function (filterTemplate) {
                    var $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
                    $($headerElm).empty();
                    // create the DOM element & add an ID and filter class
                    var $filterElm = $(filterTemplate);
                    var searchTerm = (typeof this.searchTerm === 'boolean') ? "" + this.searchTerm : this.searchTerm;
                    $filterElm.val(searchTerm);
                    $filterElm.attr('id', "filter-" + this.columnDef.id);
                    $filterElm.data('columnId', this.columnDef.id);
                    // if there's a search term, we will add the "filled" class for styling purposes
                    if (this.searchTerm) {
                        $filterElm.addClass('filled');
                    }
                    // append the new DOM element to the header row
                    if ($filterElm && typeof $filterElm.appendTo === 'function') {
                        $filterElm.appendTo($headerElm);
                    }
                    return $filterElm;
                };
                return InputNoPlaceholderFilter;
            }());
            exports_1("InputNoPlaceholderFilter", InputNoPlaceholderFilter);
        }
    };
});
//# sourceMappingURL=inputNoPlaceholderFilter.js.map