import { I18N } from 'aurelia-i18n';
import { Subscription } from 'aurelia-event-aggregator';
import { BindingEngine } from 'aurelia-framework';
import { CollectionCustomStructure, CollectionOption, Column, ColumnFilter, Filter, FilterArguments, FilterCallback, GridOption, MultipleSelectOption, OperatorType, OperatorString, SearchTerm } from './../models/index';
import { CollectionService } from '../services/collection.service';
export declare class SelectFilter implements Filter {
    protected bindingEngine: BindingEngine;
    protected collectionService: CollectionService;
    protected i18n: I18N;
    protected isMultipleSelect: boolean;
    /** DOM Element Name, useful for auto-detecting positioning (dropup / dropdown) */
    elementName: string;
    /** Filter Multiple-Select options */
    filterElmOptions: MultipleSelectOption;
    /** The JQuery DOM element */
    $filterElm: any;
    grid: any;
    searchTerms: SearchTerm[];
    columnDef: Column;
    callback: FilterCallback;
    defaultOptions: MultipleSelectOption;
    isFilled: boolean;
    labelName: string;
    labelPrefixName: string;
    labelSuffixName: string;
    optionLabel: string;
    valueName: string;
    enableTranslateLabel: boolean;
    subscriptions: Subscription[];
    /**
     * Initialize the Filter
     */
    constructor(bindingEngine: BindingEngine, collectionService: CollectionService, i18n: I18N, isMultipleSelect?: boolean);
    /** Getter for the Collection Options */
    protected readonly collectionOptions: CollectionOption;
    /** Getter for the Filter Operator */
    readonly columnFilter: ColumnFilter;
    /** Getter for the Custom Structure if exist */
    readonly customStructure: CollectionCustomStructure | undefined;
    /** Getter for the Grid Options pulled through the Grid Object */
    readonly gridOptions: GridOption;
    /** Getter for the Filter Operator */
    readonly operator: OperatorType | OperatorString;
    /**
     * Initialize the filter template
     */
    init(args: FilterArguments): Promise<void>;
    /**
     * Clear the filter values
     */
    clear(): void;
    /**
     * destroy the filter
     */
    destroy(): void;
    /**
     * Set value(s) on the DOM element
     */
    setValues(values: SearchTerm | SearchTerm[]): void;
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
    protected renderOptionsAsync(collectionAsync: Promise<any | any[]>): Promise<any[]>;
    /**
     * Subscribe to both CollectionObserver & PropertyObserver with BindingEngine.
     * They each have their own purpose, the "propertyObserver" will trigger once the collection is replaced entirely
     * while the "collectionObverser" will trigger on collection changes (`push`, `unshift`, `splice`, ...)
     */
    protected watchCollectionChanges(): void;
    protected renderDomElement(collection: any[]): void;
    /**
     * Create the HTML template as a string
     */
    protected buildTemplateHtmlString(optionCollection: any[], searchTerms: SearchTerm[]): string;
    /** Create a blank entry that can be added to the collection. It will also reuse the same collection structure provided by the user */
    protected createBlankEntry(): any;
    /**
     * From the html template string, create a DOM element of the Multiple/Single Select Filter
     * Subscribe to the onClose event and run the callback when that happens
     * @param filterTemplate
     */
    protected createDomElement(filterTemplate: string): void;
}
