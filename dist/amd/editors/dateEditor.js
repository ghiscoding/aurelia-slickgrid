define(["require", "exports", "./../services/utilities", "./../models/index", "aurelia-i18n", "flatpickr", "jquery"], function (require, exports, utilities_1, index_1, aurelia_i18n_1, flatpickr, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
     * An example of a date picker editor using Flatpickr
     * https://chmln.github.io/flatpickr
     */
    var DateEditor = /** @class */ (function () {
        function DateEditor(args) {
            this.args = args;
            this.init();
        }
        DateEditor.prototype.init = function () {
            var _this = this;
            var gridOptions = this.args.grid.getOptions();
            this.defaultDate = this.args.item[this.args.column.field] || null;
            var inputFormat = utilities_1.mapFlatpickrDateFormatWithFieldType(this.args.column.type || index_1.FieldType.dateIso);
            var outputFormat = utilities_1.mapFlatpickrDateFormatWithFieldType(this.args.column.outputType || index_1.FieldType.dateUtc);
            var currentLocale = this.getCurrentLocale(this.args.column, gridOptions);
            var pickerOptions = {
                defaultDate: this.defaultDate,
                altInput: true,
                altFormat: inputFormat,
                dateFormat: outputFormat,
                closeOnSelect: false,
                locale: (currentLocale !== 'en') ? this.loadFlatpickrLocale(currentLocale) : 'en',
                onChange: function (selectedDates, dateStr, instance) {
                    _this.save();
                },
            };
            this.$input = $("<input type=\"text\" data-defaultDate=\"" + this.defaultDate + "\" class=\"editor-text flatpickr\" />");
            this.$input.appendTo(this.args.container);
            this.flatInstance = (flatpickr && this.$input[0] && typeof this.$input[0].flatpickr === 'function') ? this.$input[0].flatpickr(pickerOptions) : null;
            this.show();
        };
        DateEditor.prototype.getCurrentLocale = function (columnDef, gridOptions) {
            var params = columnDef.params || {};
            if (params.i18n && params.i18n instanceof aurelia_i18n_1.I18N) {
                return params.i18n.getLocale();
            }
            return 'en';
        };
        DateEditor.prototype.loadFlatpickrLocale = function (locale) {
            // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
            if (locale !== 'en') {
                var localeDefault = require("flatpickr/dist/l10n/" + locale + ".js").default;
                return (localeDefault && localeDefault[locale]) ? localeDefault[locale] : 'en';
            }
            return 'en';
        };
        DateEditor.prototype.destroy = function () {
            this.hide();
            this.$input.remove();
            // this.flatInstance.destroy();
        };
        DateEditor.prototype.show = function () {
            if (this.flatInstance && typeof this.flatInstance.open === 'function') {
                this.flatInstance.open();
            }
        };
        DateEditor.prototype.hide = function () {
            if (this.flatInstance && typeof this.flatInstance.close === 'function') {
                this.flatInstance.close();
            }
        };
        DateEditor.prototype.focus = function () {
            this.$input.focus();
        };
        DateEditor.prototype.save = function () {
            this.args.commitChanges();
        };
        DateEditor.prototype.loadValue = function (item) {
            this.defaultDate = item[this.args.column.field];
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
    exports.DateEditor = DateEditor;
});
//# sourceMappingURL=dateEditor.js.map