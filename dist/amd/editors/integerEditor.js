define(["require", "exports", "jquery", "./../models"], function (require, exports, $, models_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
     * An example of a 'detached' editor.
     * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
     */
    var IntegerEditor = /** @class */ (function () {
        function IntegerEditor(args) {
            this.args = args;
            this.init();
        }
        IntegerEditor.prototype.init = function () {
            this.$input = $("<input type=\"text\" class='editor-text' />")
                .appendTo(this.args.container)
                .on('keydown.nav', function (e) {
                if (e.keyCode === models_1.KeyCode.LEFT || e.keyCode === models_1.KeyCode.RIGHT) {
                    e.stopImmediatePropagation();
                }
            })
                .focus()
                .select();
        };
        IntegerEditor.prototype.destroy = function () {
            this.$input.remove();
        };
        IntegerEditor.prototype.focus = function () {
            this.$input.focus();
        };
        IntegerEditor.prototype.loadValue = function (item) {
            this.defaultValue = item[this.args.column.field];
            this.$input.val(this.defaultValue);
            this.$input[0].defaultValue = this.defaultValue;
            this.$input.select();
        };
        IntegerEditor.prototype.serializeValue = function () {
            return parseInt(this.$input.val(), 10) || 0;
        };
        IntegerEditor.prototype.applyValue = function (item, state) {
            item[this.args.column.field] = state;
        };
        IntegerEditor.prototype.isValueChanged = function () {
            return (!(this.$input.val() === '' && this.defaultValue === null)) && (this.$input.val() !== this.defaultValue);
        };
        IntegerEditor.prototype.validate = function () {
            if (isNaN(this.$input.val())) {
                return {
                    valid: false,
                    msg: 'Please enter a valid integer'
                };
            }
            if (this.args.column.validator) {
                var validationResults = this.args.column.validator(this.$input.val());
                if (!validationResults.valid) {
                    return validationResults;
                }
            }
            return {
                valid: true,
                msg: null
            };
        };
        return IntegerEditor;
    }());
    exports.IntegerEditor = IntegerEditor;
});
//# sourceMappingURL=integerEditor.js.map