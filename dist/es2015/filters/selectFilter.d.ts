import { I18N } from 'aurelia-i18n';
import { Column, Filter, FilterType, FilterArguments, FilterCallback, SearchTerm } from './../models/index';
export declare class SelectFilter implements Filter {
    private i18n;
    $filterElm: any;
    grid: any;
    searchTerm: SearchTerm;
    columnDef: Column;
    callback: FilterCallback;
    filterType: FilterType;
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
    private buildTemplateHtmlString();
    /**
     * From the html template string, create a DOM element
     * @param filterTemplate
     */
    private createDomElement(filterTemplate);
}
