import { inject, Optional } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Constants } from './../constants';
import {
  Column,
  ColumnEditor,
  Editor,
  EditorArguments,
  EditorValidator,
  EditorValidatorOutput,
  GridOption,
  HtmlElementPosition,
  KeyCode,
  Locale,
} from './../models/index';
import { getDescendantProperty, getHtmlElementOffset, getTranslationPrefix, setDeepValue } from '../services/utilities';
import { textValidator } from '../editorValidators/textValidator';
import * as $ from 'jquery';

/*
 * An example of a 'detached' editor.
 * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
@inject(Optional.of(I18N))
export class LongTextEditor implements Editor {
  private _locales: Locale;
  private _$textarea: any;
  private _$wrapper: any;
  defaultValue: any;

  /** SlickGrid Grid object */
  grid: any;

  /** Grid options */
  gridOptions: GridOption;

  constructor(private i18n: I18N, private args: EditorArguments) {
    if (!args) {
      throw new Error('[Aurelia-Slickgrid] Something is wrong with this grid, an Editor must always have valid arguments.');
    }
    this.grid = args.grid;
    this.gridOptions = args.grid && args.grid.getOptions() as GridOption;

    // get locales provided by user in main file or else use default English locales via the Constants
    this._locales = this.gridOptions && this.gridOptions.locales || Constants.locales;

    this.init();
  }

  /** Get Column Definition object */
  get columnDef(): Column | undefined {
    return this.args && this.args.column;
  }

  /** Get Column Editor object */
  get columnEditor(): ColumnEditor {
    return this.columnDef && this.columnDef.internalColumnEditor || {};
  }

  /** Get the Editor DOM Element */
  get editorDomElement(): any {
    return this._$textarea;
  }

  get hasAutoCommitEdit() {
    return this.grid.getOptions().autoCommitEdit;
  }

  /** Get the Validator function, can be passed in Editor property or Column Definition */
  get validator(): EditorValidator | undefined {
    return (this.columnEditor && this.columnEditor.validator) || (this.columnDef && this.columnDef.validator);
  }

  init(): void {
    let cancelText = '';
    let saveText = '';

    if (this.i18n && this.i18n.tr && this.i18n.getLocale && this.i18n.getLocale()) {
      const translationPrefix = getTranslationPrefix(this.gridOptions);
      cancelText = this.i18n.tr(`${translationPrefix}CANCEL`);
      saveText = this.i18n.tr(`${translationPrefix}SAVE`);
    } else {
      cancelText = this._locales && this._locales.TEXT_CANCEL;
      saveText = this._locales && this._locales.TEXT_SAVE;
    }

    const columnId = this.columnDef && this.columnDef.id;
    const placeholder = this.columnEditor && this.columnEditor.placeholder || '';
    const title = this.columnEditor && this.columnEditor.title || '';
    const $container = $('body');

    this._$wrapper = $(`<div class="slick-large-editor-text editor-${columnId}" />`).appendTo($container);
    this._$textarea = $(`<textarea hidefocus rows="5" placeholder="${placeholder}" title="${title}">`).appendTo(this._$wrapper);

    $(`<div class="editor-footer">
          <button class="btn btn-save btn-primary btn-xs">${saveText}</button>
          <button class="btn btn-cancel btn-default btn-xs">${cancelText}</button>
      </div>`).appendTo(this._$wrapper);

    this._$wrapper.find('.btn-save').on('click', () => this.save());
    this._$wrapper.find('.btn-cancel').on('click', () => this.cancel());
    this._$textarea.on('keydown', this.handleKeyDown.bind(this));

    this.position(this.args && this.args.position);
    this._$textarea.focus().select();
  }

  cancel() {
    this._$textarea.val(this.defaultValue);
    if (this.args && this.args.cancelChanges) {
      this.args.cancelChanges();
    }
  }

  hide() {
    this._$wrapper.hide();
  }

  show() {
    this._$wrapper.show();
  }

  destroy() {
    this._$wrapper.remove();
  }

  focus() {
    this._$textarea.focus();
  }

  getValue(): string {
    return this._$textarea.val();
  }

  setValue(val: string) {
    this._$textarea.val(val);
  }

  applyValue(item: any, state: any) {
    const fieldName = this.columnDef && this.columnDef.field;
    if (fieldName !== undefined) {
      const isComplexObject = fieldName.indexOf('.') > 0; // is the field a complex object, "address.streetNumber"

      // validate the value before applying it (if not valid we'll set an empty string)
      const validation = this.validate(state);
      const newValue = (validation && validation.valid) ? state : '';

      // set the new value to the item datacontext
      if (isComplexObject) {
        setDeepValue(item, fieldName, newValue);
      } else {
        item[fieldName] = newValue;
      }
    }
  }

  isValueChanged(): boolean {
    const elmValue = this._$textarea.val();
    return (!(elmValue === '' && (this.defaultValue === null || this.defaultValue === undefined))) && (elmValue !== this.defaultValue);
  }

  loadValue(item: any) {
    const fieldName = this.columnDef && this.columnDef.field;

    if (fieldName !== undefined) {
      // is the field a complex object, "address.streetNumber"
      const isComplexObject = fieldName.indexOf('.') > 0;

      if (item && fieldName !== undefined && this.columnDef && (item.hasOwnProperty(fieldName) || isComplexObject)) {
        const value = (isComplexObject) ? getDescendantProperty(item, fieldName) : item[fieldName];
        this.defaultValue = value;
        this._$textarea.val(this.defaultValue);
        this._$textarea[0].defaultValue = this.defaultValue;
        this._$textarea.select();
      }
    }
  }

  position(parentPosition: HtmlElementPosition) {
    const containerOffset = getHtmlElementOffset(this.args.container);

    this._$wrapper
      .css('top', (containerOffset.top || parentPosition.top || 0))
      .css('left', (containerOffset.left || parentPosition.left || 0));
  }

  save() {
    const validation = this.validate();
    const isValid = (validation && validation.valid) || false;

    if (this.hasAutoCommitEdit && isValid) {
      this.grid.getEditorLock().commitCurrentEdit();
    } else {
      this.args.commitChanges();
    }
  }

  serializeValue() {
    return this._$textarea.val();
  }

  validate(inputValue?: any): EditorValidatorOutput {
    const elmValue = (inputValue !== undefined) ? inputValue : this._$textarea && this._$textarea.val && this._$textarea.val();
    return textValidator(elmValue, {
      editorArgs: this.args,
      errorMessage: this.columnEditor.errorMessage,
      required: this.columnEditor.required,
      validator: this.validator,
    });
  }

  // --
  // private functions
  // ------------------

  private handleKeyDown(event: KeyboardEvent) {
    const keyCode = event.keyCode || event.code;
    if (keyCode === KeyCode.ENTER && event.ctrlKey) {
      this.save();
    } else if (keyCode === KeyCode.ESCAPE) {
      event.preventDefault();
      this.cancel();
    } else if (keyCode === KeyCode.TAB && event.shiftKey) {
      event.preventDefault();
      if (this.args && this.grid) {
        this.grid.navigatePrev();
      }
    } else if (keyCode === KeyCode.TAB) {
      event.preventDefault();
      if (this.args && this.grid) {
        this.grid.navigateNext();
      }
    }
  }
}
