import { BindingEngine } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Subscription } from 'aurelia-event-aggregator';
import { CollectionCustomStructure, CollectionOption, Editor, EditorValidator, EditorValidatorOutput, Column, GridOption, MultipleSelectOption, SelectOption } from './../models/index';
import { CollectionService } from '../services/index';
/**
 * Slickgrid editor class for multiple select lists
 */
export declare class SelectEditor implements Editor {
    protected bindingEngine: BindingEngine;
    protected collectionService: CollectionService;
    protected i18n: I18N;
    protected args: any;
    protected isMultipleSelect: boolean;
    /** The JQuery DOM element */
    $editorElm: any;
    /** Editor Multiple-Select options */
    editorElmOptions: MultipleSelectOption;
    /** DOM Element Name, useful for auto-detecting positioning (dropup / dropdown) */
    elementName: string;
    /** The multiple-select options for a multiple select list */
    defaultOptions: MultipleSelectOption;
    /** The default item values that are set */
    defaultValue: any[];
    /** The property name for labels in the collection */
    labelName: string;
    /** The property name for a prefix that can be added to the labels in the collection */
    labelPrefixName: string;
    /** The property name for a suffix that can be added to the labels in the collection */
    labelSuffixName: string;
    /** A label that can be added to each option and can be used as an alternative to display selected options */
    optionLabel: string;
    /** The property name for values in the collection */
    valueName: string;
    /** Grid options */
    gridOptions: GridOption;
    /** Do we translate the label? */
    enableTranslateLabel: boolean;
    /** Event Subscriptions */
    subscriptions: Subscription[];
    _destroying: boolean;
    constructor(bindingEngine: BindingEngine, collectionService: CollectionService, i18n: I18N, args: any, isMultipleSelect?: boolean);
    /** Get the Collection */
    readonly collection: SelectOption[];
    /** Getter for the Collection Options */
    readonly collectionOptions: CollectionOption;
    /** Get Column Definition object */
    readonly columnDef: Column;
    /** Get Column Editor object */
    readonly columnEditor: any;
    /** Getter for the Custom Structure if exist */
    protected readonly customStructure: CollectionCustomStructure;
    /**
     * The current selected values (multiple select) from the collection
     */
    readonly currentValues: any[];
    /**
     * The current selected values (single select) from the collection
     */
    readonly currentValue: number | string;
    /** Get the Validator function, can be passed in Editor property or Column Definition */
    readonly validator: EditorValidator;
    init(): void;
    applyValue(item: any, state: any): void;
    destroy(): void;
    loadValue(item: any): void;
    loadMultipleValues(items: any[]): void;
    loadSingleValue(item: any): void;
    serializeValue(): any;
    focus(): void;
    isValueChanged(): boolean;
    validate(): EditorValidatorOutput;
    /**
     * user might want to filter certain items of the collection
     * @param inputCollection
     * @return outputCollection filtered and/or sorted collection
     */
    protected filterCollection(inputCollection: any[]): any[];
    /**
     * user might want to sort the collection in a certain way
     * @param inputCollection
     * @return outputCollection filtered and/or sorted collection
     */
    protected sortCollection(inputCollection: any[]): any[];
    protected renderDomElement(collection: any[]): void;
    /** Build the template HTML string */
    protected buildTemplateHtmlString(collection: any[]): string;
    /** Create a blank entry that can be added to the collection. It will also reuse the same collection structure provided by the user */
    protected createBlankEntry(): any;
    /** From the html template string, create the DOM element of the Multiple/Single Select Editor */
    protected createDomElement(editorTemplate: string): void;
    protected refresh(): void;
}
