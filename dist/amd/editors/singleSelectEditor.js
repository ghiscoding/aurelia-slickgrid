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
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "../services/index", "sanitize-html", "jquery"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, index_1, sanitizeHtml, $) {
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
            this.defaultOptions = {
                container: 'body',
                filter: false,
                maxHeight: 200,
                width: 150,
                offsetLeft: 20,
                single: true,
                onOpen: function () { return _this.autoAdjustDropPosition(_this.$editorElm, _this.editorElmOptions); },
                textTemplate: function ($elm) {
                    // render HTML code or not, by default it is sanitized and won't be rendered
                    var isRenderHtmlEnabled = _this.columnDef && _this.columnDef.internalColumnEditor && _this.columnDef.internalColumnEditor.enableRenderHtml || false;
                    return isRenderHtmlEnabled ? $elm.text() : $elm.html();
                },
            };
            this.init();
        }
        Object.defineProperty(SingleSelectEditor.prototype, "columnDef", {
            /** Get Column Definition object */
            get: function () {
                return this.args && this.args.column || {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SingleSelectEditor.prototype, "columnEditor", {
            /** Get Column Editor object */
            get: function () {
                return this.columnDef && this.columnDef.internalColumnEditor || {};
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(SingleSelectEditor.prototype, "validator", {
            /** Get the Validator function, can be passed in Editor property or Column Definition */
            get: function () {
                return this.columnEditor.validator || this.columnDef.validator;
            },
            enumerable: true,
            configurable: true
        });
        SingleSelectEditor.prototype.init = function () {
            if (!this.args) {
                throw new Error('[Aurelia-SlickGrid] An editor must always have an "init()" with valid arguments.');
            }
            if (!this.columnDef || !this.columnDef.internalColumnEditor || !this.columnDef.internalColumnEditor.collection) {
                throw new Error("[Aurelia-SlickGrid] You need to pass a \"collection\" inside Column Definition Editor for the SingleSelect Editor to work correctly.\n      Also each option should include a value/label pair (or value/labelKey when using Locale).\n      For example: { editor: { collection: [{ value: true, label: 'True' },{ value: false, label: 'False'}] } }");
            }
            this.enableTranslateLabel = (this.columnDef.internalColumnEditor.enableTranslateLabel) ? this.columnDef.internalColumnEditor.enableTranslateLabel : false;
            this.labelName = this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.customStructure && this.columnDef.internalColumnEditor.customStructure.label || 'label';
            this.labelPrefixName = this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.customStructure && this.columnDef.internalColumnEditor.customStructure.labelPrefix || 'labelPrefix';
            this.labelSuffixName = this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.customStructure && this.columnDef.internalColumnEditor.customStructure.labelSuffix || 'labelSuffix';
            this.valueName = this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.customStructure && this.columnDef.internalColumnEditor.customStructure.value || 'value';
            var newCollection = this.columnDef.internalColumnEditor.collection || [];
            // user might want to filter certain items of the collection
            if (this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.collectionFilterBy) {
                var filterBy = this.columnDef.internalColumnEditor.collectionFilterBy;
                newCollection = this.collectionService.filterCollection(newCollection, filterBy);
            }
            // user might want to sort the collection
            if (this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.collectionSortBy) {
                var sortBy = this.columnDef.internalColumnEditor.collectionSortBy;
                newCollection = this.collectionService.sortCollection(newCollection, sortBy, this.enableTranslateLabel);
            }
            this.collection = newCollection;
            var editorTemplate = this.buildTemplateHtmlString(newCollection);
            this.createDomElement(editorTemplate);
        };
        SingleSelectEditor.prototype.applyValue = function (item, state) {
            item[this.columnDef.field] = state;
        };
        SingleSelectEditor.prototype.destroy = function () {
            this.$editorElm.remove();
        };
        SingleSelectEditor.prototype.loadValue = function (item) {
            var _this = this;
            // convert to string because that is how the DOM will return these values
            // make sure the prop exists first
            this.defaultValue = item[this.columnDef.field] && item[this.columnDef.field].toString();
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
            if (this.validator) {
                var validationResults = this.validator(this.currentValue);
                if (!validationResults.valid) {
                    return validationResults;
                }
            }
            // by default the editor is always valid
            // if user want it to be a required checkbox, he would have to provide his own validator
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
            var isAddingSpaceBetweenLabels = this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.customStructure && this.columnDef.internalColumnEditor.customStructure.addSpaceBetweenLabels || false;
            var isRenderHtmlEnabled = this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.enableRenderHtml || false;
            var sanitizedOptions = this.gridOptions && this.gridOptions.sanitizeHtmlOptions || {};
            collection.forEach(function (option) {
                if (!option || (option[_this.labelName] === undefined && option.labelKey === undefined)) {
                    throw new Error('A collection with value/label (or value/labelKey when using ' +
                        'Locale) is required to populate the Select list, for example: { internalColumnEditor: { ' +
                        '{ collection: [ { value: \'1\', label: \'One\' } ] } } }');
                }
                var labelKey = (option.labelKey || option[_this.labelName]);
                var labelText = (option.labelKey || _this.enableTranslateLabel) ? _this.i18n.tr(labelKey || ' ') : labelKey;
                var prefixText = option[_this.labelPrefixName] || '';
                var suffixText = option[_this.labelSuffixName] || '';
                var optionText = isAddingSpaceBetweenLabels ? prefixText + " " + labelText + " " + suffixText : (prefixText + labelText + suffixText);
                // if user specifically wants to render html text, he needs to opt-in else it will stripped out by default
                // also, the 3rd party lib will saninitze any html code unless it's encoded, so we'll do that
                if (isRenderHtmlEnabled) {
                    // sanitize any unauthorized html tags like script and others
                    // for the remaining allowed tags we'll permit all attributes
                    var sanitizeText = sanitizeHtml(optionText, sanitizedOptions);
                    optionText = index_1.htmlEncode(sanitizeText);
                }
                options += "<option value=\"" + option[_this.valueName] + "\">" + optionText + "</option>";
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
                var elementOptions = (this.columnDef.internalColumnEditor) ? this.columnDef.internalColumnEditor.elementOptions : {};
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