var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./../services/utilities", "./../models/index", "aurelia-i18n", "aurelia-framework", "flatpickr", "moment", "jquery"], function (require, exports, utilities_1, index_1, aurelia_i18n_1, aurelia_framework_1, flatpickr, moment, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        Object.defineProperty(DateEditor.prototype, "columnDef", {
            /** Get Column Definition object */
            get: function () {
                return this.args && this.args.column || {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateEditor.prototype, "columnEditor", {
            /** Get Column Editor object */
            get: function () {
                return this.columnDef && this.columnDef.internalColumnEditor || {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateEditor.prototype, "validator", {
            /** Get the Validator function, can be passed in Editor property or Column Definition */
            get: function () {
                return this.columnEditor.validator || this.columnDef.validator;
            },
            enumerable: true,
            configurable: true
        });
        DateEditor.prototype.init = function () {
            var _this = this;
            if (this.args && this.args.column) {
                var columnId = this.columnDef && this.columnDef.id;
                this.defaultDate = (this.args.item) ? this.args.item[this.args.column.field] : null;
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
                this.$input = $("<input type=\"text\" data-defaultDate=\"" + this.defaultDate + "\" class=\"editor-text editor-" + columnId + " flatpickr\" />");
                this.$input.appendTo(this.args.container);
                this.flatInstance = (flatpickr && this.$input[0] && typeof this.$input[0].flatpickr === 'function') ? this.$input[0].flatpickr(pickerOptions) : null;
                this.show();
            }
        };
        DateEditor.prototype.loadFlatpickrLocale = function (locale) {
            // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
            var gridOptions = this.args && this.args.grid && this.args.grid.getOptions();
            if (gridOptions && gridOptions.params && gridOptions.params.flapickrLocale) {
                return gridOptions.params.flapickrLocale;
            }
            else if (locale !== 'en') {
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
        DateEditor.prototype.getColumnEditor = function () {
            return this.args && this.args.column && this.args.column.internalColumnEditor && this.args.column.internalColumnEditor;
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
            // autocommit will not focus the next editor
            var validation = this.validate();
            if (validation && validation.valid) {
                if (this.args.grid.getOptions().autoCommitEdit) {
                    this.args.grid.getEditorLock().commitCurrentEdit();
                }
                else {
                    this.args.commitChanges();
                }
            }
        };
        DateEditor.prototype.loadValue = function (item) {
            this.defaultDate = item[this.args.column.field];
            this.flatInstance.setDate(item[this.args.column.field]);
        };
        DateEditor.prototype.serializeValue = function () {
            var domValue = this.$input.val();
            if (!domValue) {
                return '';
            }
            var outputFormat = utilities_1.mapMomentDateFormatWithFieldType(this.args.column.type || index_1.FieldType.dateIso);
            var value = moment(domValue).format(outputFormat);
            return value;
        };
        DateEditor.prototype.applyValue = function (item, state) {
            if (!state) {
                return;
            }
            var outputFormat = utilities_1.mapMomentDateFormatWithFieldType(this.args.column.type || index_1.FieldType.dateIso);
            item[this.args.column.field] = moment(state, outputFormat).toDate();
        };
        DateEditor.prototype.isValueChanged = function () {
            return (!(this.$input.val() === '' && this.defaultDate == null)) && (this.$input.val() !== this.defaultDate);
        };
        DateEditor.prototype.validate = function () {
            if (this.validator) {
                var value = this.$input && this.$input.val && this.$input.val();
                var validationResults = this.validator(value, this.args);
                if (!validationResults.valid) {
                    return validationResults;
                }
            }
            // by default the editor is always valid
            // if user want it to be a required checkbox, he would have to provide his own validator
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
});
//# sourceMappingURL=dateEditor.js.map