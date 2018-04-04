"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
var index_1 = require("./../models/index");
var aurelia_i18n_1 = require("aurelia-i18n");
var aurelia_framework_1 = require("aurelia-framework");
var flatpickr = require("flatpickr");
var $ = require("jquery");
/*
 * An example of a date picker editor using Flatpickr
 * https://chmln.github.io/flatpickr
 */
var DateEditor = /** @class */ (function () {
    function DateEditor(i18n, args) {
        this.i18n = i18n;
        this.args = args;
        this.init();
    }
    DateEditor.prototype.init = function () {
        var _this = this;
        var gridOptions = this.args.grid.getOptions();
        this.defaultDate = this.args.item[this.args.column.field] || null;
        var inputFormat = utilities_1.mapFlatpickrDateFormatWithFieldType(this.args.column.type || index_1.FieldType.dateIso);
        var outputFormat = utilities_1.mapFlatpickrDateFormatWithFieldType(this.args.column.outputType || index_1.FieldType.dateUtc);
        var currentLocale = this.i18n.getLocale() || 'en';
        if (currentLocale.length > 2) {
            currentLocale = currentLocale.substring(0, 2);
        }
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
    DateEditor = __decorate([
        aurelia_framework_1.inject(aurelia_i18n_1.I18N)
    ], DateEditor);
    return DateEditor;
}());
exports.DateEditor = DateEditor;
//# sourceMappingURL=dateEditor.js.map