"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
var index_1 = require("./../models/index");
var $ = require("jquery");
var flatpickr = require("flatpickr");
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
        var locale = (gridOptions && gridOptions.locale) ? gridOptions.locale : 'en';
        var pickerOptions = {
            defaultDate: this.defaultDate,
            altInput: true,
            altFormat: inputFormat,
            dateFormat: outputFormat,
            closeOnSelect: false,
            onChange: function (selectedDates, dateStr, instance) {
                _this.save();
            },
        };
        // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
        if (locale !== 'en') {
            var localeDefault = require("flatpickr/dist/l10n/" + locale + ".js").default;
            pickerOptions['locale'] = (localeDefault && localeDefault[locale]) ? localeDefault[locale] : 'en';
        }
        this.$input = $("<input type=\"text\" data-defaultDate=\"" + this.defaultDate + "\" class=\"editor-text flatpickr\" />");
        this.$input.appendTo(this.args.container);
        this.flatInstance = flatpickr(this.$input[0], pickerOptions);
        this.flatInstance.open();
    };
    DateEditor.prototype.destroy = function () {
        // this.flatInstance.destroy();
        this.flatInstance.close();
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
//# sourceMappingURL=dateEditor.js.map