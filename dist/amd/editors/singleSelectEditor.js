var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "../services/index", "jquery"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, index_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // height in pixel of the multiple-select DOM element
    var SELECT_ELEMENT_HEIGHT = 26;
    /**
     * Slickgrid editor class for single select lists
     */
    var SingleSelectEditor = /** @class */ (function () {
        function SingleSelectEditor(collectionService, i18n, args) {
            var _this = this;
            this.collectionService = collectionService;
            this.i18n = i18n;
            this.args = args;
            /** The options label/value object to use in the select list */
            this.collection = [];
            this.gridOptions = this.args.grid.getOptions();
            var params = this.gridOptions.params || this.args.column.params || {};
            this.defaultOptions = {
                container: 'body',
                filter: false,
                maxHeight: 200,
                width: 150,
                offsetLeft: 20,
                single: true,
                onOpen: function () { return _this.autoAdjustDropPosition(_this.$editorElm, _this.editorElmOptions); },
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
            if (!this.columnDef || !this.columnDef.params || !this.columnDef.params.collection) {
                throw new Error("[Aurelia-SlickGrid] You need to pass a \"collection\" on the params property in the column definition for the MultipleSelect Editor to work correctly.\n      Also each option should include a value/label pair (or value/labelKey when using Locale).\n      For example: { params: { { collection: [{ value: true, label: 'True' },{ value: false, label: 'False'}] } } }");
            }
            this.enableTranslateLabel = (this.columnDef.params.enableTranslateLabel) ? this.columnDef.params.enableTranslateLabel : false;
            var newCollection = this.columnDef.params.collection || [];
            this.labelName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.label : 'label';
            this.valueName = (this.columnDef.params.customStructure) ? this.columnDef.params.customStructure.value : 'value';
            // user might want to filter certain items of the collection
            if (this.gridOptions.params && this.columnDef.params.collectionFilterBy) {
                var filterBy = this.columnDef.params.collectionFilterBy;
                newCollection = this.collectionService.filterCollection(newCollection, filterBy);
            }
            // user might want to sort the collection
            if (this.gridOptions.params && this.columnDef.params.collectionSortBy) {
                var sortBy = this.columnDef.params.collectionSortBy;
                newCollection = this.collectionService.sortCollection(newCollection, sortBy, this.enableTranslateLabel);
            }
            this.collection = newCollection;
            var editorTemplate = this.buildTemplateHtmlString(newCollection);
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
                if (_this.defaultValue === $e.value) {
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
        /**
         * Automatically adjust the multiple-select dropup or dropdown by available space
         */
        SingleSelectEditor.prototype.autoAdjustDropPosition = function (multipleSelectDomElement, multipleSelectOptions) {
            // height in pixel of the multiple-select element
            var selectElmHeight = SELECT_ELEMENT_HEIGHT;
            var windowHeight = $(window).innerHeight() || 300;
            var pageScroll = $('body').scrollTop() || 0;
            var $msDropContainer = multipleSelectOptions.container ? $(multipleSelectOptions.container) : multipleSelectDomElement;
            var $msDrop = $msDropContainer.find('.ms-drop');
            var msDropHeight = $msDrop.height() || 0;
            var msDropOffsetTop = $msDrop.offset().top;
            var space = windowHeight - (msDropOffsetTop - pageScroll);
            if (space < msDropHeight) {
                if (multipleSelectOptions.container) {
                    // when using a container, we need to offset the drop ourself
                    // and also make sure there's space available on top before doing so
                    var newOffsetTop = (msDropOffsetTop - msDropHeight - selectElmHeight);
                    if (newOffsetTop > 0) {
                        $msDrop.offset({ top: newOffsetTop < 0 ? 0 : newOffsetTop });
                    }
                }
                else {
                    // without container, we simply need to add the "top" class to the drop
                    $msDrop.addClass('top');
                }
                $msDrop.removeClass('bottom');
            }
            else {
                $msDrop.addClass('bottom');
                $msDrop.removeClass('top');
            }
        };
        /** Build the template HTML string */
        SingleSelectEditor.prototype.buildTemplateHtmlString = function (collection) {
            var _this = this;
            var options = '';
            collection.forEach(function (option) {
                if (!option || (option[_this.labelName] === undefined && option.labelKey === undefined)) {
                    throw new Error('A collection with value/label (or value/labelKey when using ' +
                        'Locale) is required to populate the Select list, for example: { params: { ' +
                        '{ collection: [ { value: \'1\', label: \'One\' } ] } } }');
                }
                var labelKey = (option.labelKey || option[_this.labelName]);
                var textLabel = (option.labelKey || _this.enableTranslateLabel) ? _this.i18n.tr(labelKey || ' ') : labelKey;
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
                this.editorElmOptions = __assign({}, this.defaultOptions, elementOptions);
                this.$editorElm = this.$editorElm.multipleSelect(this.editorElmOptions);
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
        SingleSelectEditor = __decorate([
            aurelia_framework_1.inject(index_1.CollectionService, aurelia_i18n_1.I18N)
        ], SingleSelectEditor);
        return SingleSelectEditor;
    }());
    exports.SingleSelectEditor = SingleSelectEditor;
});
//# sourceMappingURL=singleSelectEditor.js.map