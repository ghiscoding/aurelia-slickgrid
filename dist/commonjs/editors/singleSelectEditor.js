"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../services/index");
var $ = require("jquery");
/**
 * Slickgrid editor class for single select lists
 */
var SingleSelectEditor = /** @class */ (function () {
    function SingleSelectEditor(args) {
        this.args = args;
        /**
         * The options label/value object to use in the select list
         */
        this.collection = [];
        this._i18n = this.args.column.params.i18n;
        this.defaultOptions = {
            container: 'body',
            filter: false,
            maxHeight: 200,
            width: 150,
            offsetLeft: 20,
            single: true
        };
        this.init();
    }
    Object.defineProperty(SingleSelectEditor.prototype, "currentValue", {
        /**
         * The current selected value from the collection
         */
        get: function () {
            var _this = this;
            return index_1.findOrDefault(this.collection, function (c) {
                return c[_this.valueName].toString() === _this.$editorElm.val();
            })[this.valueName];
        },
        enumerable: true,
        configurable: true
    });
    SingleSelectEditor.prototype.init = function () {
        if (!this.args) {
            throw new Error('[Aurelia-SlickGrid] An editor must always have an "init()" with valid arguments.');
        }
        this.columnDef = this.args.column;
        var editorTemplate = this.buildTemplateHtmlString();
        this.createDomElement(editorTemplate);
    };
    SingleSelectEditor.prototype.applyValue = function (item, state) {
        item[this.args.column.field] = state;
    };
    SingleSelectEditor.prototype.destroy = function () {
        this.$editorElm.remove();
    };
    SingleSelectEditor.prototype.loadValue = function (item) {
        var _this = this;
        // convert to string because that is how the DOM will return these values
        this.defaultValue = item[this.columnDef.field].toString();
        this.$editorElm.find('option').each(function (i, $e) {
            if (_this.defaultValue.indexOf($e.value) !== -1) {
                $e.selected = true;
            }
            else {
                $e.selected = false;
            }
        });
        this.refresh();
    };
    SingleSelectEditor.prototype.serializeValue = function () {
        return this.currentValue;
    };
    SingleSelectEditor.prototype.focus = function () {
        this.$editorElm.focus();
    };
    SingleSelectEditor.prototype.isValueChanged = function () {
        return this.$editorElm.val() !== this.defaultValue;
    };
    SingleSelectEditor.prototype.validate = function () {
        if (this.args.column.validator) {
            var validationResults = this.args.column.validator(this.currentValue, this.args);
            if (!validationResults.valid) {
                return validationResults;
            }
        }
        return {
            valid: true,
            msg: null
        };
    };
    SingleSelectEditor.prototype.buildTemplateHtmlString = function () {
        var _this = this;
        if (!this.columnDef || !this.columnDef.params || !this.columnDef.params.collection) {
            throw new Error('[Aurelia-SlickGrid] You need to pass a "collection" on the params property in the column definition for ' +
                'the SingleSelect Editor to work correctly. Also each option should include ' +
                'a value/label pair (or value/labelKey when using Locale). For example: { params: { ' +
                '{ collection: [{ value: true, label: \'True\' }, { value: false, label: \'False\'}] } } }');
        }
        this.collection = this.columnDef.params.collection || [];
        this.labelName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.label : 'label';
        this.valueName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.value : 'value';
        var isEnabledTranslate = (this.columnDef.params.enableTranslateLabel) ? this.columnDef.params.enableTranslateLabel : false;
        var options = '';
        this.collection.forEach(function (option) {
            if (!option || (option[_this.labelName] === undefined && option.labelKey === undefined)) {
                throw new Error('A collection with value/label (or value/labelKey when using ' +
                    'Locale) is required to populate the Select list, for example: { params: { ' +
                    '{ collection: [ { value: \'1\', label: \'One\' } ] } } }');
            }
            var labelKey = (option.labelKey || option[_this.labelName]);
            var textLabel = ((option.labelKey || isEnabledTranslate) && _this._i18n && typeof _this._i18n.tr === 'function') ? _this._i18n.tr(labelKey || ' ') : labelKey;
            options += "<option value=\"" + option[_this.valueName] + "\">" + textLabel + "</option>";
        });
        return "<select class=\"ms-filter search-filter\">" + options + "</select>";
    };
    SingleSelectEditor.prototype.createDomElement = function (editorTemplate) {
        var _this = this;
        this.$editorElm = $(editorTemplate);
        if (this.$editorElm && typeof this.$editorElm.appendTo === 'function') {
            this.$editorElm.appendTo(this.args.container);
        }
        if (typeof this.$editorElm.multipleSelect !== 'function') {
            // fallback to bootstrap
            this.$editorElm.addClass('form-control');
        }
        else {
            var elementOptions = (this.columnDef.params) ? this.columnDef.params.elementOptions : {};
            var options = __assign({}, this.defaultOptions, elementOptions);
            this.$editorElm = this.$editorElm.multipleSelect(options);
            setTimeout(function () { return _this.$editorElm.multipleSelect('open'); });
        }
    };
    // refresh the jquery object because the selected checkboxes were already set
    // prior to this method being called
    SingleSelectEditor.prototype.refresh = function () {
        if (typeof this.$editorElm.multipleSelect === 'function') {
            this.$editorElm.multipleSelect('refresh');
        }
    };
    return SingleSelectEditor;
}());
exports.SingleSelectEditor = SingleSelectEditor;
//# sourceMappingURL=singleSelectEditor.js.map