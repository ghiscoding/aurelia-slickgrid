define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
     * An example of a 'detached' editor.
     * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
     */
    var CheckboxEditor = /** @class */ (function () {
        function CheckboxEditor(args) {
            this.args = args;
            this.init();
        }
        CheckboxEditor.prototype.init = function () {
            this.$input = $("<input type=\"checkbox\" value=\"true\" class=\"editor-checkbox\" hideFocus />");
            this.$input.appendTo(this.args.container);
            this.$input.focus();
        };
        CheckboxEditor.prototype.destroy = function () {
            this.$input.remove();
        };
        CheckboxEditor.prototype.focus = function () {
            this.$input.focus();
        };
        CheckboxEditor.prototype.loadValue = function (item) {
            this.defaultValue = !!item[this.args.column.field];
            if (this.defaultValue) {
                this.$input.prop('checked', true);
            }
            else {
                this.$input.prop('checked', false);
            }
        };
        CheckboxEditor.prototype.preClick = function () {
            this.$input.prop('checked', !this.$input.prop('checked'));
        };
        CheckboxEditor.prototype.serializeValue = function () {
            return this.$input.prop('checked');
        };
        CheckboxEditor.prototype.applyValue = function (item, state) {
            item[this.args.column.field] = state;
        };
        CheckboxEditor.prototype.isValueChanged = function () {
            return (this.serializeValue() !== this.defaultValue);
        };
        CheckboxEditor.prototype.validate = function () {
            return {
                valid: true,
                msg: null
            };
        };
        return CheckboxEditor;
    }());
    exports.CheckboxEditor = CheckboxEditor;
});
//# sourceMappingURL=checkboxEditor.js.map