import * as $ from 'jquery';
/*
 * An example of a 'detached' editor.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
export class CheckboxEditor {
    constructor(args) {
        this.args = args;
        this.init();
    }
    init() {
        this.$input = $(`<input type="checkbox" value="true" class="editor-checkbox" />`);
        this.$input.appendTo(this.args.container);
        this.$input.focus();
    }
    destroy() {
        this.$input.remove();
    }
    focus() {
        this.$input.focus();
    }
    hide() {
        this.$input.hide();
    }
    show() {
        this.$input.show();
    }
    loadValue(item) {
        this.defaultValue = !!item[this.args.column.field];
        if (this.defaultValue) {
            this.$input.prop('checked', true);
        }
        else {
            this.$input.prop('checked', false);
        }
    }
    preClick() {
        this.$input.prop('checked', !this.$input.prop('checked'));
    }
    serializeValue() {
        return this.$input.prop('checked');
    }
    applyValue(item, state) {
        item[this.args.column.field] = state;
    }
    isValueChanged() {
        return (this.serializeValue() !== this.defaultValue);
    }
    validate() {
        return {
            valid: true,
            msg: null
        };
    }
}
//# sourceMappingURL=checkboxEditor.js.map