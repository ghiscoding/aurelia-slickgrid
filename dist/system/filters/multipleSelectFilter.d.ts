import { I18N } from 'aurelia-i18n';
import { Column, Filter, FilterArguments, FilterCallback, MultipleSelectOption, OperatorType, OperatorString, SearchTerm } from './../models/index';
import { CollectionService } from '../services/collection.service';
export declare class MultipleSelectFilter implements Filter {
    private collectionService;
    private i18n;
    $filterElm: any;
    grid: any;
    searchTerms: SearchTerm[];
    columnDef: Column;
    callback: FilterCallback;
    defaultOptions: MultipleSelectOption;
    isFilled: boolean;
    labelName: string;
    valueName: string;
    enableTranslateLabel: boolean;
    /**
     * Initialize the Filter
     */
    constructor(collectionService: CollectionService, i18n: I18N);
    /** Getter for the Grid Options pulled through the Grid Object */
    private readonly gridOptions;
    readonly operator: OperatorType | OperatorString;
    /**
     * Initialize the filter template
     */
    init(args: FilterArguments): void;
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
    setValues(values: SearchTerm[]): void;
    /**
     * Create the HTML template as a string
     */
    private buildTemplateHtmlString(optionCollection);
    /**
     * From the html template string, create a DOM element
     * Subscribe to the onClose event and run the callback when that happens
     * @param filterTemplate
     */
    private createDomElement(filterTemplate);
    private findValueInSearchTerms(value);
    private subscribeOnClose();
}
