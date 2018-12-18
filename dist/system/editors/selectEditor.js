System.register(["../services/index", "../services/utilities", "dompurify", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __assign = (this && this.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    var index_1, utilities_1, DOMPurify, $, SelectEditor;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (DOMPurify_1) {
                DOMPurify = DOMPurify_1;
            },
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            /**
             * Slickgrid editor class for multiple select lists
             */
            SelectEditor = /** @class */ (function () {
                function SelectEditor(bindingEngine, collectionService, i18n, args, isMultipleSelect) {
                    if (isMultipleSelect === void 0) { isMultipleSelect = true; }
                    var _this = this;
                    this.bindingEngine = bindingEngine;
                    this.collectionService = collectionService;
                    this.i18n = i18n;
                    this.args = args;
                    this.isMultipleSelect = isMultipleSelect;
                    /** Event Subscriptions */
                    this.subscriptions = [];
                    // flag to signal that the editor is destroying itself, helps prevent
                    // commit changes from being called twice and erroring
                    this._destroying = false;
                    this.gridOptions = this.args.grid.getOptions();
                    // provide the name attribute to the DOM element which will be needed to auto-adjust drop position (dropup / dropdown)
                    var columnId = this.columnDef && this.columnDef.id;
                    this.elementName = "editor-" + columnId;
                    var libOptions = {
                        autoAdjustDropHeight: true,
                        autoAdjustDropPosition: true,
                        autoAdjustDropWidthByTextSize: true,
                        container: 'body',
                        filter: false,
                        maxHeight: 275,
                        name: this.elementName,
                        single: true,
                        textTemplate: function ($elm) {
                            // render HTML code or not, by default it is sanitized and won't be rendered
                            var isRenderHtmlEnabled = _this.columnDef && _this.columnDef.internalColumnEditor && _this.columnDef.internalColumnEditor.enableRenderHtml || false;
                            return isRenderHtmlEnabled ? $elm.text() : $elm.html();
                        },
                        onBlur: function () { return _this.destroy(); },
                        onClose: function () {
                            if (!_this._destroying && args.grid.getOptions().autoCommitEdit) {
                                // do not use args.commitChanges() as this sets the focus to the next
                                // row. Also the select list will stay shown when clicking off the grid
                                var validation = _this.validate();
                                if (validation && validation.valid) {
                                    args.grid.getEditorLock().commitCurrentEdit();
                                }
                            }
                        }
                    };
                    if (isMultipleSelect) {
                        libOptions.single = false;
                        libOptions.addTitle = true;
                        libOptions.okButton = true;
                        libOptions.selectAllDelimiter = ['', ''];
                        if (this.i18n && this.i18n.tr) {
                            libOptions.countSelected = this.i18n.tr('X_OF_Y_SELECTED');
                            libOptions.allSelected = this.i18n.tr('ALL_SELECTED');
                            libOptions.selectAllText = this.i18n.tr('SELECT_ALL');
                        }
                    }
                    // assign the multiple select lib options
                    this.defaultOptions = libOptions;
                    this.init();
                }
                Object.defineProperty(SelectEditor.prototype, "collection", {
                    /** Get the Collection */
                    get: function () {
                        return this.columnDef && this.columnDef && this.columnDef.internalColumnEditor.collection || [];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectEditor.prototype, "collectionOptions", {
                    /** Getter for the Collection Options */
                    get: function () {
                        return this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.collectionOptions;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectEditor.prototype, "columnDef", {
                    /** Get Column Definition object */
                    get: function () {
                        return this.args && this.args.column || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectEditor.prototype, "columnEditor", {
                    /** Get Column Editor object */
                    get: function () {
                        return this.columnDef && this.columnDef.internalColumnEditor || {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectEditor.prototype, "customStructure", {
                    /** Getter for the Custom Structure if exist */
                    get: function () {
                        return this.columnDef && this.columnDef.internalColumnEditor && this.columnDef.internalColumnEditor.customStructure;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectEditor.prototype, "currentValues", {
                    /**
                     * The current selected values (multiple select) from the collection
                     */
                    get: function () {
                        var _this = this;
                        // collection of strings, just return the filtered string that are equals
                        if (this.collection.every(function (x) { return typeof x === 'string'; })) {
                            return this.collection.filter(function (c) { return _this.$editorElm.val().indexOf(c.toString()) !== -1; });
                        }
                        // collection of label/value pair
                        var separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
                        var isIncludingPrefixSuffix = this.collectionOptions && this.collectionOptions.includePrefixSuffixToSelectedValues || false;
                        return this.collection
                            .filter(function (c) { return _this.$editorElm.val().indexOf(c[_this.valueName].toString()) !== -1; })
                            .map(function (c) {
                            var labelText = c[_this.valueName];
                            var prefixText = c[_this.labelPrefixName] || '';
                            var suffixText = c[_this.labelSuffixName] || '';
                            // also translate prefix/suffix if enableTranslateLabel is true and text is a string
                            prefixText = (_this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? _this.i18n.tr(prefixText || ' ') : prefixText;
                            suffixText = (_this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? _this.i18n.tr(suffixText || ' ') : suffixText;
                            if (isIncludingPrefixSuffix) {
                                var tmpOptionArray = [prefixText, labelText, suffixText].filter(function (text) { return text; }); // add to a temp array for joining purpose and filter out empty text
                                return tmpOptionArray.join(separatorBetweenLabels);
                            }
                            return labelText;
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectEditor.prototype, "currentValue", {
                    /**
                     * The current selected values (single select) from the collection
                     */
                    get: function () {
                        var _this = this;
                        // collection of strings, just return the filtered string that are equals
                        if (this.collection.every(function (x) { return typeof x === 'string'; })) {
                            return index_1.findOrDefault(this.collection, function (c) { return c.toString() === _this.$editorElm.val(); });
                        }
                        // collection of label/value pair
                        var separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
                        var isIncludingPrefixSuffix = this.collectionOptions && this.collectionOptions.includePrefixSuffixToSelectedValues || false;
                        var itemFound = index_1.findOrDefault(this.collection, function (c) { return c[_this.valueName].toString() === _this.$editorElm.val(); });
                        if (itemFound) {
                            var labelText = itemFound[this.valueName];
                            if (isIncludingPrefixSuffix) {
                                var prefixText = itemFound[this.labelPrefixName] || '';
                                var suffixText = itemFound[this.labelSuffixName] || '';
                                // also translate prefix/suffix if enableTranslateLabel is true and text is a string
                                prefixText = (this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? this.i18n.tr(prefixText || ' ') : prefixText;
                                suffixText = (this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? this.i18n.tr(suffixText || ' ') : suffixText;
                                // add to a temp array for joining purpose and filter out empty text
                                var tmpOptionArray = [prefixText, labelText, suffixText].filter(function (text) { return text; });
                                return tmpOptionArray.join(separatorBetweenLabels);
                            }
                            return labelText;
                        }
                        return '';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SelectEditor.prototype, "validator", {
                    /** Get the Validator function, can be passed in Editor property or Column Definition */
                    get: function () {
                        return this.columnEditor.validator || this.columnDef.validator;
                    },
                    enumerable: true,
                    configurable: true
                });
                SelectEditor.prototype.init = function () {
                    if (!this.args) {
                        throw new Error('[Aurelia-SlickGrid] An editor must always have an "init()" with valid arguments.');
                    }
                    if (!this.columnDef || !this.columnEditor || (!this.columnEditor.collection && !this.columnEditor.collectionAsync)) {
                        throw new Error("[Aurelia-SlickGrid] You need to pass a \"collection\" (or \"collectionAsync\") inside Column Definition Editor for the MultipleSelect/SingleSelect Editor to work correctly.\n      Also each option should include a value/label pair (or value/labelKey when using Locale).\n      For example: { editor: { collection: [{ value: true, label: 'True' },{ value: false, label: 'False'}] } }");
                    }
                    this.enableTranslateLabel = this.columnEditor && this.columnEditor.enableTranslateLabel || false;
                    this.labelName = this.customStructure && this.customStructure.label || 'label';
                    this.labelPrefixName = this.customStructure && this.customStructure.labelPrefix || 'labelPrefix';
                    this.labelSuffixName = this.customStructure && this.customStructure.labelSuffix || 'labelSuffix';
                    this.optionLabel = this.customStructure && this.customStructure.optionLabel || 'value';
                    this.valueName = this.customStructure && this.customStructure.value || 'value';
                    if (this.enableTranslateLabel && (!this.i18n || typeof this.i18n.tr !== 'function')) {
                        throw new Error("[select-editor] The i18n Service is required for the Select Editor to work correctly");
                    }
                    // always render the Select (dropdown) DOM element, even if user passed a "collectionAsync",
                    // if that is the case, the Select will simply be without any options but we still have to render it (else SlickGrid would throw an error)
                    this.renderDomElement(this.collection);
                };
                SelectEditor.prototype.applyValue = function (item, state) {
                    item[this.columnDef.field] = state;
                };
                SelectEditor.prototype.destroy = function () {
                    this._destroying = true;
                    if (this.$editorElm && this.$editorElm.multipleSelect) {
                        this.$editorElm.multipleSelect('close');
                        this.$editorElm.remove();
                    }
                    this.subscriptions = index_1.disposeAllSubscriptions(this.subscriptions);
                };
                SelectEditor.prototype.loadValue = function (item) {
                    if (this.isMultipleSelect) {
                        this.loadMultipleValues(item);
                    }
                    else {
                        this.loadSingleValue(item);
                    }
                    this.refresh();
                };
                SelectEditor.prototype.loadMultipleValues = function (items) {
                    var _this = this;
                    // convert to string because that is how the DOM will return these values
                    this.defaultValue = items[this.columnDef.field].map(function (i) { return i.toString(); });
                    this.$editorElm.find('option').each(function (i, $e) {
                        $e.selected = (_this.defaultValue.indexOf($e.value) !== -1);
                    });
                };
                SelectEditor.prototype.loadSingleValue = function (item) {
                    var _this = this;
                    // convert to string because that is how the DOM will return these values
                    // make sure the prop exists first
                    this.defaultValue = item[this.columnDef.field] && item[this.columnDef.field].toString();
                    this.$editorElm.find('option').each(function (i, $e) {
                        $e.selected = (_this.defaultValue === $e.value);
                    });
                };
                SelectEditor.prototype.serializeValue = function () {
                    return (this.isMultipleSelect) ? this.currentValues : this.currentValue;
                };
                SelectEditor.prototype.focus = function () {
                    if (this.$editorElm && this.$editorElm.multipleSelect) {
                        this.$editorElm.multipleSelect('focus');
                    }
                };
                SelectEditor.prototype.isValueChanged = function () {
                    if (this.isMultipleSelect) {
                        return !utilities_1.arraysEqual(this.$editorElm.val(), this.defaultValue);
                    }
                    return this.$editorElm.val() !== this.defaultValue;
                };
                SelectEditor.prototype.validate = function () {
                    if (this.validator) {
                        var value = this.isMultipleSelect ? this.currentValues : this.currentValue;
                        var validationResults = this.validator(value, this.args);
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
                //
                // protected functions
                // ------------------
                /**
                 * user might want to filter certain items of the collection
                 * @param inputCollection
                 * @return outputCollection filtered and/or sorted collection
                 */
                SelectEditor.prototype.filterCollection = function (inputCollection) {
                    var outputCollection = inputCollection;
                    // user might want to filter certain items of the collection
                    if (this.columnEditor && this.columnEditor.collectionFilterBy) {
                        var filterBy = this.columnEditor.collectionFilterBy;
                        var filterCollectionBy = this.columnEditor.collectionOptions && this.columnEditor.collectionOptions.filterAfterEachPass || null;
                        outputCollection = this.collectionService.filterCollection(outputCollection, filterBy, filterCollectionBy);
                    }
                    return outputCollection;
                };
                /**
                 * user might want to sort the collection in a certain way
                 * @param inputCollection
                 * @return outputCollection filtered and/or sorted collection
                 */
                SelectEditor.prototype.sortCollection = function (inputCollection) {
                    var outputCollection = inputCollection;
                    // user might want to sort the collection
                    if (this.columnEditor && this.columnEditor.collectionSortBy) {
                        var sortBy = this.columnEditor.collectionSortBy;
                        outputCollection = this.collectionService.sortCollection(outputCollection, sortBy, this.enableTranslateLabel);
                    }
                    return outputCollection;
                };
                SelectEditor.prototype.renderDomElement = function (collection) {
                    if (!Array.isArray(collection) && this.collectionOptions && this.collectionOptions.collectionInObjectProperty) {
                        collection = utilities_1.getDescendantProperty(collection, this.collectionOptions.collectionInObjectProperty);
                    }
                    if (!Array.isArray(collection)) {
                        throw new Error('The "collection" passed to the Select Editor is not a valid array');
                    }
                    // user can optionally add a blank entry at the beginning of the collection
                    if (this.collectionOptions && this.collectionOptions.addBlankEntry) {
                        collection.unshift(this.createBlankEntry());
                    }
                    // assign the collection to a temp variable before filtering/sorting the collection
                    var newCollection = collection;
                    // user might want to filter and/or sort certain items of the collection
                    newCollection = this.filterCollection(newCollection);
                    newCollection = this.sortCollection(newCollection);
                    // step 1, create HTML string template
                    var editorTemplate = this.buildTemplateHtmlString(newCollection);
                    // step 2, create the DOM Element of the editor
                    // also subscribe to the onClose event
                    this.createDomElement(editorTemplate);
                };
                /** Build the template HTML string */
                SelectEditor.prototype.buildTemplateHtmlString = function (collection) {
                    var _this = this;
                    var options = '';
                    var columnId = this.columnDef && this.columnDef.id;
                    var separatorBetweenLabels = this.collectionOptions && this.collectionOptions.separatorBetweenTextLabels || '';
                    var isRenderHtmlEnabled = this.columnEditor.enableRenderHtml || false;
                    var sanitizedOptions = this.gridOptions && this.gridOptions.sanitizeHtmlOptions || {};
                    // collection could be an Array of Strings OR Objects
                    if (collection.every(function (x) { return typeof x === 'string'; })) {
                        collection.forEach(function (option) {
                            options += "<option value=\"" + option + "\" label=\"" + option + "\">" + option + "</option>";
                        });
                    }
                    else {
                        // array of objects will require a label/value pair unless a customStructure is passed
                        collection.forEach(function (option) {
                            if (!option || (option[_this.labelName] === undefined && option.labelKey === undefined)) {
                                throw new Error('[select-editor] A collection with value/label (or value/labelKey when using ' +
                                    'Locale) is required to populate the Select list, for example: ' +
                                    '{ collection: [ { value: \'1\', label: \'One\' } ])');
                            }
                            var labelKey = (option.labelKey || option[_this.labelName]);
                            var labelText = ((option.labelKey || _this.enableTranslateLabel) && labelKey) ? _this.i18n.tr(labelKey || ' ') : labelKey;
                            var prefixText = option[_this.labelPrefixName] || '';
                            var suffixText = option[_this.labelSuffixName] || '';
                            var optionLabel = option[_this.optionLabel] || '';
                            optionLabel = optionLabel.toString().replace(/\"/g, '\''); // replace double quotes by single quotes to avoid interfering with regular html
                            // also translate prefix/suffix if enableTranslateLabel is true and text is a string
                            prefixText = (_this.enableTranslateLabel && prefixText && typeof prefixText === 'string') ? _this.i18n.tr(prefixText || ' ') : prefixText;
                            suffixText = (_this.enableTranslateLabel && suffixText && typeof suffixText === 'string') ? _this.i18n.tr(suffixText || ' ') : suffixText;
                            optionLabel = (_this.enableTranslateLabel && optionLabel && typeof optionLabel === 'string') ? _this.i18n.tr(optionLabel || ' ') : optionLabel;
                            // add to a temp array for joining purpose and filter out empty text
                            var tmpOptionArray = [prefixText, labelText, suffixText].filter(function (text) { return text; });
                            var optionText = tmpOptionArray.join(separatorBetweenLabels);
                            // if user specifically wants to render html text, he needs to opt-in else it will stripped out by default
                            // also, the 3rd party lib will saninitze any html code unless it's encoded, so we'll do that
                            if (isRenderHtmlEnabled) {
                                // sanitize any unauthorized html tags like script and others
                                // for the remaining allowed tags we'll permit all attributes
                                var sanitizedText = DOMPurify.sanitize(optionText, sanitizedOptions);
                                optionText = utilities_1.htmlEncode(sanitizedText);
                            }
                            options += "<option value=\"" + option[_this.valueName] + "\" label=\"" + optionLabel + "\">" + optionText + "</option>";
                        });
                    }
                    return "<select id=\"" + this.elementName + "\" class=\"ms-filter search-filter editor-" + columnId + "\" " + (this.isMultipleSelect ? 'multiple="multiple"' : '') + ">" + options + "</select>";
                };
                /** Create a blank entry that can be added to the collection. It will also reuse the same collection structure provided by the user */
                SelectEditor.prototype.createBlankEntry = function () {
                    var _a;
                    var blankEntry = (_a = {},
                        _a[this.labelName] = '',
                        _a[this.valueName] = '',
                        _a);
                    if (this.labelPrefixName) {
                        blankEntry[this.labelPrefixName] = '';
                    }
                    if (this.labelSuffixName) {
                        blankEntry[this.labelSuffixName] = '';
                    }
                    return blankEntry;
                };
                /** From the html template string, create the DOM element of the Multiple/Single Select Editor */
                SelectEditor.prototype.createDomElement = function (editorTemplate) {
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
                        var elementOptions = (this.columnEditor) ? this.columnEditor.elementOptions : {};
                        this.editorElmOptions = __assign({}, this.defaultOptions, elementOptions);
                        this.$editorElm = this.$editorElm.multipleSelect(this.editorElmOptions);
                        setTimeout(function () { return _this.$editorElm.multipleSelect('open'); });
                    }
                };
                // refresh the jquery object because the selected checkboxes were already set
                // prior to this method being called
                SelectEditor.prototype.refresh = function () {
                    if (typeof this.$editorElm.multipleSelect === 'function') {
                        this.$editorElm.multipleSelect('refresh');
                    }
                };
                return SelectEditor;
            }());
            exports_1("SelectEditor", SelectEditor);
        }
    };
});
//# sourceMappingURL=selectEditor.js.map