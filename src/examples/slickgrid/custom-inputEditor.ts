import {
  Column,
  ColumnEditor,
  Editor,
  EditorValidator,
  EditorValidationResult,
  KeyCode
} from '../../aurelia-slickgrid';

/*
 * An example of a 'detached' editor.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
export class CustomInputEditor implements Editor {
  private _lastInputEvent?: KeyboardEvent;
  inputElm!: HTMLInputElement;
  defaultValue: any;

  constructor(private args: any) {
    this.init();
  }

  /** Get Column Definition object */
  get columnDef(): Column {
    return this.args?.column ?? {};
  }

  /** Get Column Editor object */
  get columnEditor(): ColumnEditor {
    return this.columnDef?.internalColumnEditor ?? {};
  }

  /** Get the Validator function, can be passed in Editor property or Column Definition */
  get validator(): EditorValidator | undefined {
    return (this.columnEditor?.validator) || (this.columnDef?.validator);
  }

  init(): void {
    const placeholder = this.columnEditor?.placeholder || '';

    this.inputElm = document.createElement('input');
    this.inputElm.className = 'editor-text';
    this.inputElm.placeholder = placeholder;
    this.args.container.appendChild(this.inputElm);

    this.inputElm.addEventListener('keydown', this.handleKeydown.bind(this));

    setTimeout(() => {
      this.inputElm.focus();
      this.inputElm.select();
    }, 50);
  }

  handleKeydown(event: KeyboardEvent) {
    this._lastInputEvent = event;
    if (event.keyCode === KeyCode.LEFT || event.keyCode === KeyCode.RIGHT) {
      event.stopImmediatePropagation();
    }
  }

  destroy() {
    this.inputElm.removeEventListener('keydown', this.handleKeydown.bind(this));
    this.inputElm.remove();
  }

  focus() {
    this.inputElm.focus();
  }

  getValue() {
    return this.inputElm.value;
  }

  setValue(val: string) {
    this.inputElm.value = val;
  }

  loadValue(item: any) {
    this.defaultValue = item[this.args.column.field] || '';
    this.inputElm.value = this.defaultValue;
    this.inputElm.defaultValue = this.defaultValue;
    this.inputElm.select();
  }

  serializeValue() {
    return this.inputElm.value;
  }

  applyValue(item: any, state: any) {
    const validation = this.validate(state);
    item[this.args.column.field] = (validation && validation.valid) ? state : '';
  }

  isValueChanged(): boolean {
    const lastEvent = this._lastInputEvent?.keyCode;
    if (this.columnEditor?.alwaysSaveOnEnterKey && lastEvent === KeyCode.ENTER) {
      return true;
    }
    return (!(this.inputElm.value === '' && this.defaultValue === null)) && (this.inputElm.value !== this.defaultValue);
  }

  validate(inputValue?: any): EditorValidationResult {
    if (this.validator) {
      const value = (inputValue !== undefined) ? inputValue : this.inputElm?.value;
      return this.validator(value, this.args);
    }

    return {
      valid: true,
      msg: null
    };
  }
}
