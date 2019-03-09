import { Constants } from './../constants';
import { mapFlatpickrDateFormatWithFieldType, mapMomentDateFormatWithFieldType } from './../services/utilities';
import { Column, ColumnEditor, Editor, EditorValidator, EditorValidatorOutput, FieldType } from './../models/index';
import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';
import * as flatpickr from 'flatpickr';
import * as moment from 'moment';
import * as $ from 'jquery';

declare function require(name: string): any;

/*
 * An example of a date picker editor using Flatpickr
 * https://chmln.github.io/flatpickr
 */
@inject(I18N)
export class DateEditor implements Editor {
  $input: any;
  flatInstance: any;
  defaultDate: string;

  constructor(private i18n: I18N, private args: any) {
    this.init();
  }

  /** Get Column Definition object */
  get columnDef(): Column {
    return this.args && this.args.column || {};
  }

  /** Get Column Editor object */
  get columnEditor(): ColumnEditor {
    return this.columnDef && this.columnDef.internalColumnEditor || {};
  }

  /** Get the Validator function, can be passed in Editor property or Column Definition */
  get validator(): EditorValidator {
    return this.columnEditor.validator || this.columnDef.validator;
  }

  init(): void {
    if (this.args && this.args.column) {
      const columnId = this.columnDef && this.columnDef.id;
      const placeholder = this.columnEditor && this.columnEditor.placeholder || '';
      this.defaultDate = (this.args.item) ? this.args.item[this.args.column.field] : null;
      const inputFormat = mapFlatpickrDateFormatWithFieldType(this.args.column.type || FieldType.dateIso);
      const outputFormat = mapFlatpickrDateFormatWithFieldType(this.args.column.outputType || FieldType.dateUtc);
      let currentLocale = this.i18n.getLocale() || 'en';
      if (currentLocale.length > 2) {
        currentLocale = currentLocale.substring(0, 2);
      }

      const pickerOptions: any = {
        defaultDate: this.defaultDate,
        altInput: true,
        altFormat: inputFormat,
        dateFormat: outputFormat,
        closeOnSelect: false,
        locale: (currentLocale !== 'en') ? this.loadFlatpickrLocale(currentLocale) : 'en',
        onChange: (selectedDates: any[] | any, dateStr: string, instance: any) => {
          this.save();
        },
      };

      // merge options with optional user's custom options
      const pickerMergedOptions = { ...pickerOptions, ...this.columnEditor.editorOptions };

      this.$input = $(`<input type="text" data-defaultDate="${this.defaultDate}" class="editor-text editor-${columnId} flatpickr" placeholder="${placeholder}" />`);
      this.$input.appendTo(this.args.container);
      this.flatInstance = (flatpickr && this.$input[0] && typeof this.$input[0].flatpickr === 'function') ? this.$input[0].flatpickr(pickerMergedOptions) : null;
      this.show();
    }
  }

  loadFlatpickrLocale(locale: string) {
    // change locale if needed, Flatpickr reference: https://chmln.github.io/flatpickr/localization/
    const gridOptions = this.args && this.args.grid && this.args.grid.getOptions();
    if (gridOptions && gridOptions.params && gridOptions.params.flapickrLocale) {
      return gridOptions.params.flapickrLocale;
    } else if (locale !== 'en') {
      const localeDefault: any = require(`flatpickr/dist/l10n/${locale}.js`).default;
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
    // autocommit will not focus the next editor
    const validation = this.validate();
    if (validation && validation.valid) {
      if (this.args.grid.getOptions().autoCommitEdit) {
        this.args.grid.getEditorLock().commitCurrentEdit();
      } else {
        this.args.commitChanges();
      }
    }
  }

  loadValue(item: any) {
    const fieldName = this.columnDef && this.columnDef.field;

    // when it's a complex object, then pull the object name only, e.g.: "user.firstName" => "user"
    const fieldNameFromComplexObject = fieldName.indexOf('.') ? fieldName.substring(0, fieldName.indexOf('.')) : '';

    if (item && this.columnDef && (item.hasOwnProperty(fieldName) || item.hasOwnProperty(fieldNameFromComplexObject))) {
      this.defaultDate = item[fieldNameFromComplexObject || fieldName];
      this.flatInstance.setDate(item[this.args.column.field]);
    }
  }

  serializeValue() {
    const domValue: string = this.$input.val();

    if (!domValue) {
      return '';
    }

    const outputFormat = mapMomentDateFormatWithFieldType(this.args.column.type || FieldType.dateIso);
    const value = moment(domValue).format(outputFormat);

    return value;
  }

  applyValue(item: any, state: any) {
    if (!state) {
      return;
    }

    const fieldName = this.columnDef && this.columnDef.field;
    const outputFormat = mapMomentDateFormatWithFieldType(this.args.column.type || FieldType.dateIso);

    // when it's a complex object, then pull the object name only, e.g.: "user.firstName" => "user"
    const fieldNameFromComplexObject = fieldName.indexOf('.') ? fieldName.substring(0, fieldName.indexOf('.')) : '';
    item[fieldNameFromComplexObject || fieldName] = moment(state, outputFormat).toDate();
  }

  isValueChanged() {
    return (!(this.$input.val() === '' && this.defaultDate == null)) && (this.$input.val() !== this.defaultDate);
  }

  validate(): EditorValidatorOutput {
    const isRequired = this.columnEditor.required;
    const elmValue = this.$input && this.$input.val && this.$input.val();
    const errorMsg = this.columnEditor.errorMessage;

    if (this.validator) {
      const value = this.$input && this.$input.val && this.$input.val();
      return this.validator(value, this.args);
    }

    // by default the editor is almost always valid (except when it's required but not provided)
    if (isRequired && elmValue === '') {
      return {
        valid: false,
        msg: errorMsg || Constants.VALIDATION_REQUIRED_FIELD
      };
    }

    return {
      valid: true,
      msg: null
    };
  }
}
