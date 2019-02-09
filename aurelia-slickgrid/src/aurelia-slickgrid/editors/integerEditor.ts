import { Constants } from './../constants';
import { Column, Editor, EditorValidator, EditorValidatorOutput, KeyCode } from './../models/index';
import * as $ from 'jquery';

/*
 * An example of a 'detached' editor.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
export class IntegerEditor implements Editor {
  $input: any;
  defaultValue: any;

  constructor(private args: any) {
    this.init();
  }

  /** Get Column Definition object */
  get columnDef(): Column {
    return this.args && this.args.column || {};
  }

  /** Get Column Editor object */
  get columnEditor(): any {
    return this.columnDef && this.columnDef.internalColumnEditor || {};
  }

  /** Get the Validator function, can be passed in Editor property or Column Definition */
  get validator(): EditorValidator {
    return this.columnEditor.validator || this.columnDef.validator;
  }

  init(): void {
    const columnId = this.columnDef && this.columnDef.id;
    const placeholder = this.columnEditor && this.columnEditor.placeholder || '';

    this.$input = $(`<input type="number" class="editor-text editor-${columnId}" placeholder="${placeholder}" />`)
      .appendTo(this.args.container)
      .on('keydown.nav', (e) => {
        if (e.keyCode === KeyCode.LEFT || e.keyCode === KeyCode.RIGHT) {
          e.stopImmediatePropagation();
        }
      });

    setTimeout(() => {
      this.$input.focus().select();
    }, 50);
  }

  destroy() {
    this.$input.off('keydown.nav').remove();
  }

  focus() {
    this.$input.focus();
  }

  loadValue(item: any) {
    this.defaultValue = parseInt(item[this.args.column.field], 10);
    this.$input.val(this.defaultValue);
    this.$input[0].defaultValue = this.defaultValue;
    this.$input.select();
  }

  serializeValue() {
    return parseInt(this.$input.val() as string, 10) || 0;
  }

  applyValue(item: any, state: any) {
    item[this.args.column.field] = state;
  }

  isValueChanged() {
    const elmValue = this.$input.val();
    const value = isNaN(elmValue) ? elmValue : parseInt(elmValue, 10);
    return (!(value === '' && this.defaultValue === null)) && (value !== this.defaultValue);
  }

  validate(): EditorValidatorOutput {
    const elmValue = this.$input.val();
    const errorMsg = this.columnEditor.params && this.columnEditor.errorMessage;

    if (this.validator) {
      const validationResults = this.validator(elmValue, this.args);
      if (!validationResults.valid) {
        return validationResults;
      }
    } else if (isNaN(elmValue as number) || !/^[+-]?\d+$/.test(elmValue)) {
      return {
        valid: false,
        msg: errorMsg || Constants.VALIDATION_EDITOR_VALID_INTEGER
      };
    }

    return {
      valid: true,
      msg: null
    };
  }
}
