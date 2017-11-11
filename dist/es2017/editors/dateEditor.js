import { mapFlatpickrDateFormatWithFieldType } from './../services/utilities';
import * as flatpickr from 'flatpickr';
import * as $ from 'jquery';
import { FieldType } from './../models/index';
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
        const pickerOptions = {
            defaultDate: this.args.item[this.args.column.field] || null,
            altInput: true,
            altFormat: mapFlatpickrDateFormatWithFieldType(this.args.type || FieldType.dateIso),
            onChange: (selectedDates, dateStr, instance) => {
                this.save();
            },
        };
        this.$input = $(`<input type="text" value="${this.defaultDate}" class="editor-text" />`);
        this.$input.appendTo(this.args.container);
        this.$input.focus().val(this.defaultDate).select();
        this.flatInstance = flatpickr(this.$input[0], pickerOptions);
        this.flatInstance.open();
    }
    destroy() {
        //this.flatInstance.destroy();
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
        this.$input.val(this.defaultDate);
        this.$input.select();
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