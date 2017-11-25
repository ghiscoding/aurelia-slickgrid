import { mapFlatpickrDateFormatWithFieldType } from './../services/utilities';
import { FieldType } from './../models/index';
import * as $ from 'jquery';
import * as flatpickr from 'flatpickr';
/*
 * An example of a date picker editor using Flatpickr
 * https://chmln.github.io/flatpickr
 */
export class DateEditor {
    constructor(args) {
        this.args = args;
        this.init();
    }
    init() {
        const gridOptions = this.args.grid.getOptions();
        this.defaultDate = this.args.item[this.args.column.field] || null;
        const inputFormat = mapFlatpickrDateFormatWithFieldType(this.args.column.type || FieldType.dateIso);
        const outputFormat = mapFlatpickrDateFormatWithFieldType(this.args.column.outputType || FieldType.dateUtc);
        const locale = (gridOptions && gridOptions.locale) ? gridOptions.locale : 'en';
        const pickerOptions = {
            defaultDate: this.defaultDate,
            altInput: true,
            altFormat: inputFormat,
            dateFormat: outputFormat,
            closeOnSelect: false,
            onChange: (selectedDates, dateStr, instance) => {
                this.save();
            },
        };
        // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
        if (locale !== 'en') {
            const localeDefault = require(`flatpickr/dist/l10n/${locale}.js`).default;
            pickerOptions['locale'] = (localeDefault && localeDefault[locale]) ? localeDefault[locale] : 'en';
        }
        this.$input = $(`<input type="text" data-defaultDate="${this.defaultDate}" class="editor-text flatpickr" />`);
        this.$input.appendTo(this.args.container);
        this.flatInstance = flatpickr(this.$input[0], pickerOptions);
        this.flatInstance.open();
    }
    destroy() {
        // this.flatInstance.destroy();
        this.flatInstance.close();
        this.$input.remove();
    }
    show() {
        this.flatInstance.open();
    }
    hide() {
        this.flatInstance.close();
    }
    focus() {
        this.$input.focus();
    }
    save() {
        this.args.commitChanges();
    }
    loadValue(item) {
        this.defaultDate = item[this.args.column.field];
    }
    serializeValue() {
        return this.$input.val();
    }
    applyValue(item, state) {
        item[this.args.column.field] = state;
    }
    isValueChanged() {
        return (!(this.$input.val() === '' && this.defaultDate == null)) && (this.$input.val() !== this.defaultDate);
    }
    validate() {
        if (this.args.column.validator) {
            const validationResults = this.args.column.validator(this.$input.val(), this.args);
            if (!validationResults.valid) {
                return validationResults;
            }
        }
        return {
            valid: true,
            msg: null
        };
    }
}
//# sourceMappingURL=dateEditor.js.map