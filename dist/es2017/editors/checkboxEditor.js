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
        const columnId = this.columnDef && this.columnDef.id;
        this.$input = $(`<input type="checkbox" value="true" class="editor-checkbox editor-${columnId}" />`);
        this.$input.appendTo(this.args.container);
        this.$input.focus();
        // make the checkbox editor act like a regular checkbox that commit the value on click
        if (this.args.grid.getOptions().autoCommitEdit) {
            this.$input.click(() => this.args.grid.getEditorLock().commitCurrentEdit());
        }
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
        this.defaultValue = !!item[this.columnDef.field];
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
        item[this.columnDef.field] = state;
    }
    isValueChanged() {
        return (this.serializeValue() !== this.defaultValue);
    }
    validate() {
        if (this.validator) {
            const value = this.$input && this.$input.val && this.$input.val();
            const validationResults = this.validator(value, this.args);
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
}
//# sourceMappingURL=checkboxEditor.js.map