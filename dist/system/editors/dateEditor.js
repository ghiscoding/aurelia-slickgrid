System.register(["./../services/utilities", "flatpickr", "flatpickr/dist/flatpickr.min.css", "jquery", "./../models"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utilities_1, flatpickr_1, $, models_1, DateEditor;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (flatpickr_1_1) {
                flatpickr_1 = flatpickr_1_1;
            },
            function (_1) {
            },
            function ($_1) {
                $ = $_1;
            },
            function (models_1_1) {
                models_1 = models_1_1;
            }
        ],
        execute: function () {
            /*
             * An example of a date picker editor using Flatpickr
             * https://chmln.github.io/flatpickr
             */
            DateEditor = /** @class */ (function () {
                function DateEditor(args) {
                    this.args = args;
                    this.init();
                }
                DateEditor.prototype.init = function () {
                    var pickerOptions = {
                        defaultDate: this.args.item[this.args.column.field] || null,
                        altInput: true,
                        altFormat: utilities_1.mapFlatpickrDateFormatWithFieldType(this.args.type || models_1.FieldType.dateIso)
                    };
                    this.$input = $("<input type=\"text\" value=\"" + this.defaultDate + "\" class=\"editor-text\" />");
                    this.$input.appendTo(this.args.container);
                    this.$input.focus().val(this.defaultDate).select();
                    this.flatInstance = flatpickr_1.default(this.$input[0], pickerOptions);
                };
                DateEditor.prototype.destroy = function () {
                    this.flatInstance.destroy();
                    this.$input.remove();
                };
                DateEditor.prototype.show = function () {
                    this.flatInstance.open();
                };
                DateEditor.prototype.hide = function () {
                    this.flatInstance.close();
                };
                DateEditor.prototype.focus = function () {
                    this.$input.focus();
                };
                DateEditor.prototype.loadValue = function (item) {
                    this.defaultDate = item[this.args.column.field];
                    this.$input.val(this.defaultDate);
                    this.$input.select();
                };
                DateEditor.prototype.serializeValue = function () {
                    return this.$input.val();
                };
                DateEditor.prototype.applyValue = function (item, state) {
                    item[this.args.column.field] = state;
                };
                DateEditor.prototype.isValueChanged = function () {
                    return (!(this.$input.val() === '' && this.defaultDate == null)) && (this.$input.val() !== this.defaultDate);
                };
                DateEditor.prototype.validate = function () {
                    if (this.args.column.validator) {
                        var validationResults = this.args.column.validator(this.$input.val(), this.args);
                        if (!validationResults.valid) {
                            return validationResults;
                        }
                    }
                    return {
                        valid: true,
                        msg: null
                    };
                };
                return DateEditor;
            }());
            exports_1("DateEditor", DateEditor);
        }
    };
});
//# sourceMappingURL=dateEditor.js.map