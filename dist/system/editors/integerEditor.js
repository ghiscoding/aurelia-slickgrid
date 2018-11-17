System.register(["./../constants", "./../models/index", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var constants_1, index_1, $, IntegerEditor;
    return {
        setters: [
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function ($_1) {
                $ = $_1;
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
                Object.defineProperty(IntegerEditor.prototype, "columnDef", {
                    /** Get Column Definition object */
                    get: function () {
                        return this.args && this.args.column || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(IntegerEditor.prototype, "columnEditor", {
                    /** Get Column Editor object */
                    get: function () {
                        return this.columnDef && this.columnDef.internalColumnEditor || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(IntegerEditor.prototype, "validator", {
                    /** Get the Validator function, can be passed in Editor property or Column Definition */
                    get: function () {
                        return this.columnEditor.validator || this.columnDef.validator;
                    },
                    enumerable: true,
                    configurable: true
                });
                IntegerEditor.prototype.init = function () {
                    var _this = this;
                    var columnId = this.columnDef && this.columnDef.id;
                    this.$input = $("<input type=\"number\" class=\"editor-text editor-" + columnId + "\" />")
                        .appendTo(this.args.container)
                        .on('keydown.nav', function (e) {
                        if (e.keyCode === index_1.KeyCode.LEFT || e.keyCode === index_1.KeyCode.RIGHT) {
                            e.stopImmediatePropagation();
                        }
                    });
                    setTimeout(function () {
                        _this.$input.focus().select();
                    }, 50);
                };
                IntegerEditor.prototype.destroy = function () {
                    this.$input.remove();
                };
                IntegerEditor.prototype.focus = function () {
                    this.$input.focus();
                };
                IntegerEditor.prototype.loadValue = function (item) {
                    this.defaultValue = parseInt(item[this.args.column.field], 10);
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
                    var elmValue = this.$input.val();
                    var value = isNaN(elmValue) ? elmValue : parseInt(elmValue, 10);
                    return (!(value === '' && this.defaultValue === null)) && (value !== this.defaultValue);
                };
                IntegerEditor.prototype.validate = function () {
                    var elmValue = this.$input.val();
                    var errorMsg = this.columnEditor.params && this.columnEditor.errorMessage;
                    if (this.validator) {
                        var validationResults = this.validator(elmValue, this.args);
                        if (!validationResults.valid) {
                            return validationResults;
                        }
                    }
                    else if (isNaN(elmValue) || !/^[+-]?\d+$/.test(elmValue)) {
                        return {
                            valid: false,
                            msg: errorMsg || constants_1.Constants.VALIDATION_EDITOR_VALID_INTEGER
                        };
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