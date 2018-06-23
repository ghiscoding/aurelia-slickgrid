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
}
//# sourceMappingURL=checkboxEditor.js.map