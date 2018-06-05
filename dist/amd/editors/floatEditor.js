define(["require", "exports", "jquery", "./../models/index"], function (require, exports, $, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultDecimalPlaces = 2;
    /*
     * An example of a 'detached' editor.
     * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
     */
    var FloatEditor = /** @class */ (function () {
        function FloatEditor(args) {
            this.args = args;
            this.init();
        }
        FloatEditor.prototype.init = function () {
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
        FloatEditor.prototype.destroy = function () {
            this.$input.remove();
        };
        FloatEditor.prototype.focus = function () {
            this.$input.focus();
        };
        FloatEditor.prototype.getDecimalPlaces = function () {
            // returns the number of fixed decimal places or null
            var columnEditor = this.args && this.args.column && this.args.column.internalColumnEditor && this.args.column.internalColumnEditor;
            var rtn = (columnEditor && columnEditor.params && columnEditor.params.hasOwnProperty('decimalPlaces')) ? columnEditor.params.decimalPlaces : undefined;
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
            var elmValue = this.$input.val();
            return (!(elmValue === '' && this.defaultValue === null)) && (elmValue !== this.defaultValue);
        };
        FloatEditor.prototype.validate = function () {
            var elmValue = this.$input.val();
            if (isNaN(elmValue)) {
                return {
                    valid: false,
                    msg: 'Please enter a valid number'
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
        return FloatEditor;
    }());
    exports.FloatEditor = FloatEditor;
});
//# sourceMappingURL=floatEditor.js.map