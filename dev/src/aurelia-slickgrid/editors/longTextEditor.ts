// import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css';
import * as $ from 'jquery';
import { KeyCode } from './../models/keyCode.enum';

/*
 * An example of a 'detached' editor.
 * The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
export class LongTextEditor {
  args;
  $input;
  $wrapper;
  defaultValue;

  constructor(args) {
    this.args = args;
    this.init();
  }

  init() {
    const $container = $('body');

    this.$wrapper = $(`<div style="z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;"/>`).appendTo($container);
    this.$input = $(`<textarea hidefocus rows="5" style="background:white;width:250px;height:80px;border:0;outline:0">`).appendTo(this.$wrapper);

    $(`<div style="text-align:right"><button>Save</button><button>Cancel</button></div>`).appendTo(this.$wrapper);

    this.$wrapper.find('button:first').on('click', (event) => this.save());
    this.$wrapper.find('button:last').on('click', (event) => this.cancel());
    this.$input.bind('keydown', this.handleKeyDown);

    this.position(this.args.position);
    this.$input.focus().select();
  }

  handleKeyDown(e) {
    if (e.which === KeyCode.ENTER && e.ctrlKey) {
      this.save();
    } else if (e.which === KeyCode.ESCAPE) {
      e.preventDefault();
      this.cancel();
    } else if (e.which === KeyCode.TAB && e.shiftKey) {
      e.preventDefault();
      this.args.grid.navigatePrev();
    } else if (e.which === KeyCode.TAB) {
      e.preventDefault();
      this.args.grid.navigateNext();
    }
  }

  save() {
    this.args.commitChanges();
  }

  cancel() {
    this.$input.val(this.defaultValue);
    this.args.cancelChanges();
  }

  hide() {
    this.$wrapper.hide();
  }

  show() {
    this.$wrapper.show();
  }

  position(position) {
    this.$wrapper
      .css('top', position.top - 5)
      .css('left', position.left - 5);
  }

  destroy() {
    this.$wrapper.remove();
  }

  focus() {
    this.$input.focus();
  }

  loadValue = (item) {
    this.$input.val(this.defaultValue = item[this.args.column.field]);
    this.$input.select();
  }

  serializeValue() {
    return this.$input.val();
  }

  applyValue(item, state) {
    item[this.args.column.field] = state;
  }

  isValueChanged() {
    return (!(this.$input.val() === '' && this.defaultValue == null)) && (this.$input.val() !== this.defaultValue);
  }

  validate() {
    let valid = true;
    let msg = null;
    if (this.args.column.validator) {
      const validationResults = this.args.column.validator(this.$input.val(), this.args);
      valid = validationResults.valid;
      msg = validationResults.msg;
    }

    return {
      valid: true,
      msg: null
    };
  }
}
