"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var index_1 = require("./../models/index");
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
        var _this = this;
        this.$input = $("<input type=\"number\" class='editor-text' />")
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
        if (isNaN(elmValue)) {
            return {
                valid: false,
                msg: 'Please enter a valid integer'
            };
        }
        if (this.args.column.validator) {
            var validationResults = this.args.column.validator(elmValue);
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
//# sourceMappingURL=integerEditor.js.map