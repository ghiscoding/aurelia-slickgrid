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
 * Slickgrid editor class for multiple select lists
 */
var MultipleSelectEditor = /** @class */ (function () {
    function MultipleSelectEditor(args) {
        this.args = args;
        /**
         * The options label/value object to use in the select list
         */
        this.collection = [];
        var gridOptions = this.args.grid.getOptions();
        var params = gridOptions.params || this.args.column.params || {};
        this._i18n = params.i18n;
        this.defaultOptions = {
            container: 'body',
            filter: false,
            maxHeight: 200,
            addTitle: true,
            okButton: true,
            selectAllDelimiter: ['', ''],
            width: 150,
            offsetLeft: 20
        };
        if (this._i18n) {
            this.defaultOptions.countSelected = this._i18n.tr('X_OF_Y_SELECTED');
            this.defaultOptions.allSelected = this._i18n.tr('ALL_SELECTED');
            this.defaultOptions.selectAllText = this._i18n.tr('SELECT_ALL');
        }
        this.init();
    }
    Object.defineProperty(MultipleSelectEditor.prototype, "currentValues", {
        /**
         * The current selected values from the collection
         */
        get: function () {
            var _this = this;
            return this.collection
                .filter(function (c) { return _this.$editorElm.val().indexOf(c[_this.valueName].toString()) !== -1; })
                .map(function (c) { return c[_this.valueName]; });
        },
        enumerable: true,
        configurable: true
    });
    MultipleSelectEditor.prototype.init = function () {
        if (!this.args) {
            throw new Error('[Aurelia-SlickGrid] An editor must always have an "init()" with valid arguments.');
        }
        this.columnDef = this.args.column;
        var editorTemplate = this.buildTemplateHtmlString();
        this.createDomElement(editorTemplate);
    };
    MultipleSelectEditor.prototype.applyValue = function (item, state) {
        item[this.args.column.field] = state;
    };
    MultipleSelectEditor.prototype.destroy = function () {
        this.$editorElm.remove();
    };
    MultipleSelectEditor.prototype.loadValue = function (item) {
        var _this = this;
        // convert to string because that is how the DOM will return these values
        this.defaultValue = item[this.columnDef.field].map(function (i) { return i.toString(); });
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
    MultipleSelectEditor.prototype.serializeValue = function () {
        return this.currentValues;
    };
    MultipleSelectEditor.prototype.focus = function () {
        this.$editorElm.focus();
    };
    MultipleSelectEditor.prototype.isValueChanged = function () {
        return !index_1.arraysEqual(this.$editorElm.val(), this.defaultValue);
    };
    MultipleSelectEditor.prototype.validate = function () {
        if (this.args.column.validator) {
            var validationResults = this.args.column.validator(this.currentValues, this.args);
            if (!validationResults.valid) {
                return validationResults;
            }
        }
        return {
            valid: true,
            msg: null
        };
    };
    MultipleSelectEditor.prototype.buildTemplateHtmlString = function () {
        var _this = this;
        if (!this.columnDef || !this.columnDef.params || !this.columnDef.params.collection) {
            throw new Error('[Aurelia-SlickGrid] You need to pass a "collection" on the params property in the column definition for ' +
                'the MultipleSelect Editor to work correctly. Also each option should include ' +
                'a value/label pair (or value/labelKey when using Locale). For example: { params: { ' +
                '{ collection: [{ value: true, label: \'True\' },{ value: false, label: \'False\'}] } } }');
        }
        this.collection = this.columnDef.params.collection || [];
        this.labelName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.label : 'label';
        this.valueName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.value : 'value';
        var isEnabledTranslate = (this.columnDef.params.enableTranslateLabel) ? this.columnDef.params.enableTranslateLabel : false;
        var options = '';
        this.collection.forEach(function (option) {
            if (!option || (option[_this.labelName] === undefined && option.labelKey === undefined)) {
                throw new Error('A collection with value/label (or value/labelKey when using ' +
                    'Locale) is required to populate the Select list, for example: ' +
                    '{ collection: [ { value: \'1\', label: \'One\' } ])');
            }
            var labelKey = (option.labelKey || option[_this.labelName]);
            var textLabel = ((option.labelKey || isEnabledTranslate) && _this._i18n && typeof _this._i18n.tr === 'function') ? _this._i18n.tr(labelKey || ' ') : labelKey;
            options += "<option value=\"" + option[_this.valueName] + "\">" + textLabel + "</option>";
        });
        return "<select class=\"ms-filter search-filter\" multiple=\"multiple\">" + options + "</select>";
    };
    MultipleSelectEditor.prototype.createDomElement = function (editorTemplate) {
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
    MultipleSelectEditor.prototype.refresh = function () {
        if (typeof this.$editorElm.multipleSelect === 'function') {
            this.$editorElm.multipleSelect('refresh');
        }
    };
    return MultipleSelectEditor;
}());
exports.MultipleSelectEditor = MultipleSelectEditor;
//# sourceMappingURL=multipleSelectEditor.js.map