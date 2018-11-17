System.register(["jquery", "./../models/index"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var $, index_1, TextEditor;
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
            TextEditor = /** @class */ (function () {
                function TextEditor(args) {
                    this.args = args;
                    this.init();
                }
                Object.defineProperty(TextEditor.prototype, "columnDef", {
                    /** Get Column Definition object */
                    get: function () {
                        return this.args && this.args.column || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextEditor.prototype, "columnEditor", {
                    /** Get Column Editor object */
                    get: function () {
                        return this.columnDef && this.columnDef.internalColumnEditor || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextEditor.prototype, "validator", {
                    /** Get the Validator function, can be passed in Editor property or Column Definition */
                    get: function () {
                        return this.columnEditor.validator || this.columnDef.validator;
                    },
                    enumerable: true,
                    configurable: true
                });
                TextEditor.prototype.init = function () {
                    var columnId = this.columnDef && this.columnDef.id;
                    this.$input = $("<input type=\"text\" class=\"editor-text editor-" + columnId + "\" />")
                        .appendTo(this.args.container)
                        .on('keydown.nav', function (e) {
                        if (e.keyCode === index_1.KeyCode.LEFT || e.keyCode === index_1.KeyCode.RIGHT) {
                            e.stopImmediatePropagation();
                        }
                    })
                        .focus()
                        .select();
                };
                TextEditor.prototype.destroy = function () {
                    this.$input.remove();
                };
                TextEditor.prototype.focus = function () {
                    this.$input.focus();
                };
                TextEditor.prototype.getValue = function () {
                    return this.$input.val();
                };
                TextEditor.prototype.setValue = function (val) {
                    this.$input.val(val);
                };
                TextEditor.prototype.loadValue = function (item) {
                    this.defaultValue = item[this.args.column.field] || '';
                    this.$input.val(this.defaultValue);
                    this.$input[0].defaultValue = this.defaultValue;
                    this.$input.select();
                };
                TextEditor.prototype.serializeValue = function () {
                    return this.$input.val();
                };
                TextEditor.prototype.applyValue = function (item, state) {
                    item[this.args.column.field] = state;
                };
                TextEditor.prototype.isValueChanged = function () {
                    return (!(this.$input.val() === '' && this.defaultValue === null)) && (this.$input.val() !== this.defaultValue);
                };
                TextEditor.prototype.validate = function () {
                    if (this.validator) {
                        var value = this.$input && this.$input.val && this.$input.val();
                        var validationResults = this.validator(value, this.args);
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
                };
                return TextEditor;
            }());
            exports_1("TextEditor", TextEditor);
        }
    };
});
//# sourceMappingURL=textEditor.js.map