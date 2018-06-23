"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var $ = require("jquery");
var DEFAULT_MIN_VALUE = 0;
var DEFAULT_MAX_VALUE = 100;
var DEFAULT_STEP = 1;
/*
 * An example of a 'detached' editor.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
var SliderEditor = /** @class */ (function () {
    function SliderEditor(args) {
        this.args = args;
        this.init();
    }
    Object.defineProperty(SliderEditor.prototype, "columnDef", {
        /** Get Column Definition object */
        get: function () {
            return this.args && this.args.column || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SliderEditor.prototype, "columnEditor", {
        /** Get Column Editor object */
        get: function () {
            return this.columnDef && this.columnDef.internalColumnEditor || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SliderEditor.prototype, "editorParams", {
        /** Getter for the Editor Generic Params */
        get: function () {
            return this.columnEditor.params || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SliderEditor.prototype, "validator", {
        /** Get the Validator function, can be passed in Editor property or Column Definition */
        get: function () {
            return this.columnEditor.validator || this.columnDef.validator;
        },
        enumerable: true,
        configurable: true
    });
    SliderEditor.prototype.init = function () {
        var _this = this;
        var container = this.args.container;
        // create HTML string template
        var editorTemplate = this.buildTemplateHtmlString();
        this.$editorElm = $(editorTemplate);
        this.$input = this.$editorElm.children('input');
        this.$sliderNumber = this.$editorElm.children('span.input-group-addon');
        // watch on change event
        this.$editorElm
            .appendTo(this.args.container)
            .on('change', function (event) { return _this.save(); });
    };
    SliderEditor.prototype.destroy = function () {
        this.$editorElm.remove();
    };
    SliderEditor.prototype.focus = function () {
        this.$editorElm.focus();
    };
    SliderEditor.prototype.save = function () {
        this.args.commitChanges();
    };
    SliderEditor.prototype.cancel = function () {
        this.$input.val(this.defaultValue);
        this.args.cancelChanges();
    };
    SliderEditor.prototype.loadValue = function (item) {
        // this.$input.val(this.defaultValue = item[this.columnDef.field]);
        this.defaultValue = item[this.columnDef.field];
        this.$input.val(this.defaultValue);
        this.$input[0].defaultValue = this.defaultValue;
        this.$sliderNumber.html(this.defaultValue);
    };
    SliderEditor.prototype.serializeValue = function () {
        return parseInt(this.$input.val(), 10) || 0;
    };
    SliderEditor.prototype.applyValue = function (item, state) {
        item[this.columnDef.field] = state;
    };
    SliderEditor.prototype.isValueChanged = function () {
        var elmValue = this.$input.val();
        console.log(elmValue);
        return (!(elmValue === '' && this.defaultValue === null)) && (elmValue !== this.defaultValue);
    };
    SliderEditor.prototype.validate = function () {
        var elmValue = this.$input.val();
        var minValue = this.columnEditor.minValue;
        var maxValue = this.columnEditor.maxValue;
        var errorMsg = this.columnEditor.errorMessage;
        var mapValidation = {
            '{{minValue}}': minValue,
            '{{maxValue}}': maxValue
        };
        if (this.validator) {
            var validationResults = this.validator(elmValue);
            if (!validationResults.valid) {
                return validationResults;
            }
        }
        else if (minValue !== undefined && (elmValue < minValue || elmValue > maxValue)) {
            // when decimal value is bigger than 0, we only accept the decimal values as that value set
            // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
            return {
                valid: false,
                msg: errorMsg || constants_1.Constants.VALIDATION_EDITOR_NUMBER_BETWEEN.replace(/{{minValue}}|{{maxValue}}/gi, function (matched) {
                    return mapValidation[matched];
                })
            };
        }
        return {
            valid: true,
            msg: null
        };
    };
    //
    // private functions
    // ------------------
    /**
     * Create the HTML template as a string
     */
    SliderEditor.prototype.buildTemplateHtmlString = function () {
        var minValue = this.columnEditor.hasOwnProperty('minValue') ? this.columnEditor.minValue : DEFAULT_MIN_VALUE;
        var maxValue = this.columnEditor.hasOwnProperty('maxValue') ? this.columnEditor.maxValue : DEFAULT_MAX_VALUE;
        var defaultValue = this.editorParams.hasOwnProperty('sliderStartValue') ? this.editorParams.sliderStartValue : minValue;
        var step = this.columnEditor.hasOwnProperty('valueStep') ? this.columnEditor.valueStep : DEFAULT_STEP;
        var itemId = this.args && this.args.item && this.args.item.id;
        if (this.editorParams.hideSliderNumber) {
            return "\n      <div class=\"slider-editor\">\n        <input type=\"range\" id=\"rangeInput_" + this.columnDef.field + "_" + itemId + "\"\n          name=\"rangeInput_" + this.columnDef.field + "_" + itemId + "\"\n          defaultValue=\"" + defaultValue + "\" min=\"" + minValue + "\" max=\"" + maxValue + "\" step=\"" + step + "\"\n          class=\"form-control slider-editor-input range\" />\n      </div>";
        }
        return "\n      <div class=\"input-group slider-editor\">\n        <input type=\"range\" id=\"rangeInput_" + this.columnDef.field + "_" + itemId + "\"\n          name=\"rangeInput_" + this.columnDef.field + "_" + itemId + "\"\n          defaultValue=\"" + defaultValue + "\" min=\"" + minValue + "\" max=\"" + maxValue + "\" step=\"" + step + "\"\n          class=\"form-control slider-editor-input range\"\n          onmousemove=\"$('#rangeOuput_" + this.columnDef.field + "_" + itemId + "').html(rangeInput_" + this.columnDef.field + "_" + itemId + ".value)\" />\n        <span class=\"input-group-addon slider-value\" id=\"rangeOuput_" + this.columnDef.field + "_" + itemId + "\">" + defaultValue + "</span>\n      </div>";
    };
    return SliderEditor;
}());
exports.SliderEditor = SliderEditor;
//# sourceMappingURL=sliderEditor.js.map