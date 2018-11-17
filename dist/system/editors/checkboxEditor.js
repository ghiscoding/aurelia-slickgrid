System.register(["jquery"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var $, CheckboxEditor;
    return {
        setters: [
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            /*
             * An example of a 'detached' editor.
             * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
             */
            CheckboxEditor = /** @class */ (function () {
                function CheckboxEditor(args) {
                    this.args = args;
                    this.init();
                }
                Object.defineProperty(CheckboxEditor.prototype, "columnDef", {
                    /** Get Column Definition object */
                    get: function () {
                        return this.args && this.args.column || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CheckboxEditor.prototype, "columnEditor", {
                    /** Get Column Editor object */
                    get: function () {
                        return this.columnDef && this.columnDef.internalColumnEditor || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CheckboxEditor.prototype, "validator", {
                    /** Get the Validator function, can be passed in Editor property or Column Definition */
                    get: function () {
                        return this.columnEditor.validator || this.columnDef.validator;
                    },
                    enumerable: true,
                    configurable: true
                });
                CheckboxEditor.prototype.init = function () {
                    var _this = this;
                    var columnId = this.columnDef && this.columnDef.id;
                    this.$input = $("<input type=\"checkbox\" value=\"true\" class=\"editor-checkbox editor-" + columnId + "\" />");
                    this.$input.appendTo(this.args.container);
                    this.$input.focus();
                    // make the checkbox editor act like a regular checkbox that commit the value on click
                    if (this.args.grid.getOptions().autoCommitEdit) {
                        this.$input.click(function () { return _this.args.grid.getEditorLock().commitCurrentEdit(); });
                    }
                };
                CheckboxEditor.prototype.destroy = function () {
                    this.$input.remove();
                };
                CheckboxEditor.prototype.focus = function () {
                    this.$input.focus();
                };
                CheckboxEditor.prototype.hide = function () {
                    this.$input.hide();
                };
                CheckboxEditor.prototype.show = function () {
                    this.$input.show();
                };
                CheckboxEditor.prototype.loadValue = function (item) {
                    this.defaultValue = !!item[this.columnDef.field];
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
                    item[this.columnDef.field] = state;
                };
                CheckboxEditor.prototype.isValueChanged = function () {
                    return (this.serializeValue() !== this.defaultValue);
                };
                CheckboxEditor.prototype.validate = function () {
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
                return CheckboxEditor;
            }());
            exports_1("CheckboxEditor", CheckboxEditor);
        }
    };
});
//# sourceMappingURL=checkboxEditor.js.map