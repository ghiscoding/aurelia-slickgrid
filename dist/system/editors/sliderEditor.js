System.register(["../constants", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var constants_1, $, DEFAULT_MIN_VALUE, DEFAULT_MAX_VALUE, DEFAULT_STEP, SliderEditor;
    return {
        setters: [
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            DEFAULT_MIN_VALUE = 0;
            DEFAULT_MAX_VALUE = 100;
            DEFAULT_STEP = 1;
            /*
             * An example of a 'detached' editor.
             * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
             */
            SliderEditor = /** @class */ (function () {
                function SliderEditor(args) {
                    this.args = args;
                    this._elementRangeInputId = '';
                    this._elementRangeOutputId = '';
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
                    // define the input & slider number IDs
                    var itemId = this.args && this.args.item && this.args.item.id;
                    this._elementRangeInputId = "rangeInput_" + this.columnDef.field + "_" + itemId;
                    this._elementRangeOutputId = "rangeOutput_" + this.columnDef.field + "_" + itemId;
                    // create HTML string template
                    var editorTemplate = this.buildTemplateHtmlString();
                    this.$editorElm = $(editorTemplate);
                    this.$input = this.$editorElm.children('input');
                    this.$sliderNumber = this.$editorElm.children('div.input-group-addon.input-group-append').children();
                    // watch on change event
                    this.$editorElm
                        .appendTo(this.args.container)
                        .on('mouseup', function (event) { return _this.save(); });
                    // if user chose to display the slider number on the right side, then update it every time it changes
                    // we need to use both "input" and "change" event to be all cross-browser
                    if (!this.editorParams.hideSliderNumber) {
                        this.$editorElm.on('input change', function (e) {
                            var value = e && e.target && e.target.value || '';
                            if (value && document) {
                                var elm = document.getElementById(_this._elementRangeOutputId || '');
                                if (elm && elm.innerHTML) {
                                    elm.innerHTML = e.target.value;
                                }
                            }
                        });
                    }
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
                        return "\n      <div class=\"slider-editor\">\n        <input type=\"range\" id=\"" + this._elementRangeInputId + "\"\n          name=\"" + this._elementRangeInputId + "\"\n          defaultValue=\"" + defaultValue + "\" min=\"" + minValue + "\" max=\"" + maxValue + "\" step=\"" + step + "\"\n          class=\"form-control slider-editor-input range\" />\n      </div>";
                    }
                    return "\n      <div class=\"input-group slider-editor\">\n        <input type=\"range\" id=\"" + this._elementRangeInputId + "\"\n          name=\"" + this._elementRangeInputId + "\"\n          defaultValue=\"" + defaultValue + "\" min=\"" + minValue + "\" max=\"" + maxValue + "\" step=\"" + step + "\"\n          class=\"form-control slider-editor-input range\" />\n        <div class=\"input-group-addon input-group-append slider-value\"><span class=\"input-group-text\" id=\"" + this._elementRangeOutputId + "\">" + defaultValue + "</span></div>\n      </div>";
                };
                return SliderEditor;
            }());
            exports_1("SliderEditor", SliderEditor);
        }
    };
});
//# sourceMappingURL=sliderEditor.js.map