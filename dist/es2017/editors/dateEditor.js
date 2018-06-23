var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { mapFlatpickrDateFormatWithFieldType, mapMomentDateFormatWithFieldType } from './../services/utilities';
import { FieldType } from './../models/index';
import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';
import * as flatpickr from 'flatpickr';
import * as moment from 'moment';
import * as $ from 'jquery';
/*
 * An example of a date picker editor using Flatpickr
 * https://chmln.github.io/flatpickr
 */
let DateEditor = class DateEditor {
    constructor(i18n, args) {
        this.i18n = i18n;
        this.args = args;
        this.init();
    }
    /** Get Column Definition object */
    get columnDef() {
        return this.args && this.args.column || {};
    }
    /** Get Column Editor object */
    get columnEditor() {
        return this.columnDef && this.columnDef.internalColumnEditor || {};
    }
    /** Get the Validator function, can be passed in Editor property or Column Definition */
    get validator() {
        return this.columnEditor.validator || this.columnDef.validator;
    }
    init() {
        if (this.args && this.args.column) {
            this.defaultDate = (this.args.item) ? this.args.item[this.args.column.field] : null;
            const inputFormat = mapFlatpickrDateFormatWithFieldType(this.args.column.type || FieldType.dateIso);
            const outputFormat = mapFlatpickrDateFormatWithFieldType(this.args.column.outputType || FieldType.dateUtc);
            let currentLocale = this.i18n.getLocale() || 'en';
            if (currentLocale.length > 2) {
                currentLocale = currentLocale.substring(0, 2);
            }
            const pickerOptions = {
                defaultDate: this.defaultDate,
                altInput: true,
                altFormat: inputFormat,
                dateFormat: outputFormat,
                closeOnSelect: false,
                locale: (currentLocale !== 'en') ? this.loadFlatpickrLocale(currentLocale) : 'en',
                onChange: (selectedDates, dateStr, instance) => {
                    this.save();
                },
            };
            this.$input = $(`<input type="text" data-defaultDate="${this.defaultDate}" class="editor-text flatpickr" />`);
            this.$input.appendTo(this.args.container);
            this.flatInstance = (flatpickr && this.$input[0] && typeof this.$input[0].flatpickr === 'function') ? this.$input[0].flatpickr(pickerOptions) : null;
            this.show();
        }
    }
    loadFlatpickrLocale(locale) {
        // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
        if (locale !== 'en') {
            const localeDefault = require(`flatpickr/dist/l10n/${locale}.js`).default;
            return (localeDefault && localeDefault[locale]) ? localeDefault[locale] : 'en';
        }
        return 'en';
    }
    destroy() {
        this.hide();
        this.$input.remove();
        // this.flatInstance.destroy();
    }
    getColumnEditor() {
        return this.args && this.args.column && this.args.column.internalColumnEditor && this.args.column.internalColumnEditor;
    }
    show() {
        if (this.flatInstance && typeof this.flatInstance.open === 'function') {
            this.flatInstance.open();
        }
    }
    hide() {
        if (this.flatInstance && typeof this.flatInstance.close === 'function') {
            this.flatInstance.close();
        }
    }
    focus() {
        this.$input.focus();
    }
    save() {
        this.args.commitChanges();
    }
    loadValue(item) {
        this.defaultDate = item[this.args.column.field];
        this.flatInstance.setDate(item[this.args.column.field]);
    }
    serializeValue() {
        const domValue = this.$input.val();
        if (!domValue) {
            return '';
        }
        const outputFormat = mapMomentDateFormatWithFieldType(this.args.column.type || FieldType.dateIso);
        const value = moment(domValue).format(outputFormat);
        return value;
    }
    applyValue(item, state) {
        if (!state) {
            return;
        }
        const outputFormat = mapMomentDateFormatWithFieldType(this.args.column.type || FieldType.dateIso);
        item[this.args.column.field] = moment(state, outputFormat).toDate();
    }
    isValueChanged() {
        return (!(this.$input.val() === '' && this.defaultDate == null)) && (this.$input.val() !== this.defaultDate);
    }
    validate() {
        if (this.validator) {
            const validationResults = this.validator(this.$input.val());
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
    }
};
DateEditor = __decorate([
    inject(I18N)
], DateEditor);
export { DateEditor };
//# sourceMappingURL=dateEditor.js.map