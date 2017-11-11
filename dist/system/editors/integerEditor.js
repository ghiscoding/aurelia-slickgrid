System.register(["jquery", "./../models/index"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var $, index_1, IntegerEditor;
    return {
        setters: [
            function ($_1) {
                $ = $_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
            /*
             * An example of a 'detached' editor.
             * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
             */
            IntegerEditor = /** @class */ (function () {
                function IntegerEditor(args) {
                    this.args = args;
                    this.init();
                }
                IntegerEditor.prototype.init = function () {
                    this.$input = $("<input type=\"text\" class='editor-text' />")
                        .appendTo(this.args.container)
                        .on('keydown.nav', function (e) {
                        if (e.keyCode === index_1.KeyCode.LEFT || e.keyCode === index_1.KeyCode.RIGHT) {
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
            exports_1("IntegerEditor", IntegerEditor);
        }
    };
});
//# sourceMappingURL=integerEditor.js.map