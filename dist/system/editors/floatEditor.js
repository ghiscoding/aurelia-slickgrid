System.register(["jquery", "./../models"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var $, models_1, defaultDecimalPlaces, allowEmptyValue, FloatEditor;
    return {
        setters: [
            function ($_1) {
                $ = $_1;
            },
            function (models_1_1) {
                models_1 = models_1_1;
            }
        ],
        execute: function () {
            defaultDecimalPlaces = 0;
            allowEmptyValue = false;
            /*
             * An example of a 'detached' editor.
             * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
             */
            FloatEditor = /** @class */ (function () {
                function FloatEditor(args) {
                    this.args = args;
                    this.init();
                }
                FloatEditor.prototype.init = function () {
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
                FloatEditor.prototype.destroy = function () {
                    this.$input.remove();
                };
                FloatEditor.prototype.focus = function () {
                    this.$input.focus();
                };
                FloatEditor.prototype.getDecimalPlaces = function () {
                    // returns the number of fixed decimal places or null
                    var rtn = this.args.column.editorFixedDecimalPlaces;
                    if (rtn === undefined) {
                        rtn = defaultDecimalPlaces;
                    }
                    return (!rtn && rtn !== 0 ? null : rtn);
                };
                FloatEditor.prototype.loadValue = function (item) {
                    this.defaultValue = item[this.args.column.field];
                    var decPlaces = this.getDecimalPlaces();
                    if (decPlaces !== null
                        && (this.defaultValue || this.defaultValue === 0)
                        && this.defaultValue.toFixed) {
                        this.defaultValue = this.defaultValue.toFixed(decPlaces);
                    }
                    this.$input.val(this.defaultValue);
                    this.$input[0].defaultValue = this.defaultValue;
                    this.$input.select();
                };
                FloatEditor.prototype.serializeValue = function () {
                    var rtn = parseFloat(this.$input.val()) || 0;
                    var decPlaces = this.getDecimalPlaces();
                    if (decPlaces !== null
                        && (rtn || rtn === 0)
                        && rtn.toFixed) {
                        rtn = parseFloat(rtn.toFixed(decPlaces));
                    }
                    return rtn;
                };
                FloatEditor.prototype.applyValue = function (item, state) {
                    item[this.args.column.field] = state;
                };
                FloatEditor.prototype.isValueChanged = function () {
                    return (!(this.$input.val() === '' && this.defaultValue === null)) && (this.$input.val() !== this.defaultValue);
                };
                FloatEditor.prototype.validate = function () {
                    if (isNaN(this.$input.val())) {
                        return {
                            valid: false,
                            msg: 'Please enter a valid number'
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
                return FloatEditor;
            }());
            exports_1("FloatEditor", FloatEditor);
        }
    };
});
//# sourceMappingURL=floatEditor.js.map