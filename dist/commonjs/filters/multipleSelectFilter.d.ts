import { I18N } from 'aurelia-i18n';
import { Column, Filter, FilterArguments, FilterCallback, FilterType, GridOption, MultipleSelectOption, SearchTerm } from './../models/index';
import { CollectionService } from '../services/collection.service';
export declare class MultipleSelectFilter implements Filter {
    private collectionService;
    private i18n;
    $filterElm: any;
    grid: any;
    gridOptions: GridOption;
    searchTerms: SearchTerm[];
    columnDef: Column;
    callback: FilterCallback;
    defaultOptions: MultipleSelectOption;
    isFilled: boolean;
    filterType: FilterType;
    labelName: string;
    valueName: string;
    enableTranslateLabel: boolean;
    /**
     * Initialize the Filter
     */
    constructor(collectionService: CollectionService, i18n: I18N);
    /**
     * Initialize the filter template
     */
    init(args: FilterArguments): void;
    /**
     * Clear the filter values
     */
    clear(triggerFilterChange?: boolean): void;
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
