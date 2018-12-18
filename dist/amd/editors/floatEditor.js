define(["require", "exports", "../constants", "./../models/index", "jquery"], function (require, exports, constants_1, index_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultDecimalPlaces = 0;
    /*
     * An example of a 'detached' editor.
     * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
     */
    var FloatEditor = /** @class */ (function () {
        function FloatEditor(args) {
            this.args = args;
            this.init();
        }
        Object.defineProperty(FloatEditor.prototype, "columnDef", {
            /** Get Column Definition object */
            get: function () {
                return this.args && this.args.column || {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FloatEditor.prototype, "columnEditor", {
            /** Get Column Editor object */
            get: function () {
                return this.columnDef && this.columnDef.internalColumnEditor || {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FloatEditor.prototype, "validator", {
            /** Get the Validator function, can be passed in Editor property or Column Definition */
            get: function () {
                return this.columnEditor.validator || this.columnDef.validator;
            },
            enumerable: true,
            configurable: true
        });
        FloatEditor.prototype.init = function () {
            var _this = this;
            var columnId = this.columnDef && this.columnDef.id;
            this.$input = $("<input type=\"number\" class=\"editor-text editor-" + columnId + "\" step=\"" + this.getInputDecimalSteps() + "\" />")
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
            var rtn = (this.columnEditor.params && this.columnEditor.params.hasOwnProperty('decimalPlaces')) ? this.columnEditor.params.decimalPlaces : undefined;
            if (rtn === undefined) {
                rtn = defaultDecimalPlaces;
            }
            return (!rtn && rtn !== 0 ? null : rtn);
        };
        FloatEditor.prototype.getInputDecimalSteps = function () {
            var decimals = this.getDecimalPlaces();
            var zeroString = '';
            for (var i = 1; i < decimals; i++) {
                zeroString += '0';
            }
            if (decimals > 0) {
                return "0." + zeroString + "1";
            }
            return '1';
        };
        FloatEditor.prototype.loadValue = function (item) {
            this.defaultValue = item[this.columnDef.field];
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
            item[this.columnDef.field] = state;
        };
        FloatEditor.prototype.isValueChanged = function () {
            var elmValue = this.$input.val();
            return (!(elmValue === '' && this.defaultValue === null)) && (elmValue !== this.defaultValue);
        };
        FloatEditor.prototype.validate = function () {
            var elmValue = this.$input.val();
            var floatNumber = !isNaN(elmValue) ? parseFloat(elmValue) : null;
            var decPlaces = this.getDecimalPlaces();
            var minValue = this.columnEditor.minValue;
            var maxValue = this.columnEditor.maxValue;
            var errorMsg = this.columnEditor.errorMessage;
            var mapValidation = {
                '{{minValue}}': minValue,
                '{{maxValue}}': maxValue,
                '{{minDecimal}}': 0,
                '{{maxDecimal}}': decPlaces
            };
            if (this.validator) {
                var validationResults = this.validator(elmValue, this.args);
                if (!validationResults.valid) {
                    return validationResults;
                }
            }
            else if (isNaN(elmValue) || (decPlaces === 0 && !/^[-+]?(\d+(\.)?(\d)*)$/.test(elmValue))) {
                // when decimal value is 0 (which is the default), we accept 0 or more decimal values
                return {
                    valid: false,
                    msg: errorMsg || constants_1.Constants.VALIDATION_EDITOR_VALID_NUMBER
                };
            }
            else if (minValue !== undefined && maxValue !== undefined && floatNumber !== null && (floatNumber < minValue || floatNumber > maxValue)) {
                // MIN & MAX Values provided
                // when decimal value is bigger than 0, we only accept the decimal values as that value set
                // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
                return {
                    valid: false,
                    msg: errorMsg || constants_1.Constants.VALIDATION_EDITOR_NUMBER_BETWEEN.replace(/{{minValue}}|{{maxValue}}/gi, function (matched) { return mapValidation[matched]; })
                };
            }
            else if (minValue !== undefined && floatNumber !== null && floatNumber <= minValue) {
                // MIN VALUE ONLY
                // when decimal value is bigger than 0, we only accept the decimal values as that value set
                // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
                return {
                    valid: false,
                    msg: errorMsg || constants_1.Constants.VALIDATION_EDITOR_NUMBER_MIN.replace(/{{minValue}}/gi, function (matched) { return mapValidation[matched]; })
                };
            }
            else if (maxValue !== undefined && floatNumber !== null && floatNumber >= maxValue) {
                // MAX VALUE ONLY
                // when decimal value is bigger than 0, we only accept the decimal values as that value set
                // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
                return {
                    valid: false,
                    msg: errorMsg || constants_1.Constants.VALIDATION_EDITOR_NUMBER_MAX.replace(/{{maxValue}}/gi, function (matched) { return mapValidation[matched]; })
                };
            }
            else if ((decPlaces > 0 && !new RegExp("^(\\d*(\\.)?(\\d){0," + decPlaces + "})$").test(elmValue))) {
                // when decimal value is bigger than 0, we only accept the decimal values as that value set
                // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
                return {
                    valid: false,
                    msg: errorMsg || constants_1.Constants.VALIDATION_EDITOR_DECIMAL_BETWEEN.replace(/{{minDecimal}}|{{maxDecimal}}/gi, function (matched) { return mapValidation[matched]; })
                };
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