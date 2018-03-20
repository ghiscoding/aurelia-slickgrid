import { I18N } from 'aurelia-i18n';
import { Column, Filter, FilterType, FilterArguments, FilterCallback, MultipleSelectOption, SearchTerm } from './../models/index';
export declare class SingleSelectFilter implements Filter {
    private i18n;
    $filterElm: any;
    grid: any;
    searchTerm: SearchTerm;
    columnDef: Column;
    callback: FilterCallback;
    defaultOptions: MultipleSelectOption;
    filterType: FilterType;
    isFilled: boolean;
    constructor(i18n: I18N);
    /**
     * Initialize the Filter
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
    setValues(values: SearchTerm | SearchTerm[]): void;
    /**
     * Create the HTML template as a string
     */
    private buildTemplateHtmlString();
    /**
     * From the html template string, create a DOM element
     * Subscribe to the onClose event and run the callback when that happens
     * @param filterTemplate
     */
    private createDomElement(filterTemplate);
}
