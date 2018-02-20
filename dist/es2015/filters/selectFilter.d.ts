import { I18N } from 'aurelia-i18n';
import { FilterArguments } from './../models/filterArguments.interface';
import { FilterCallback } from './../models/filterCallback.interface';
import { Column, Filter } from './../models';
export declare class SelectFilter implements Filter {
    private i18n;
    $filterElm: any;
    grid: any;
    searchTerm: string | number | boolean;
    columnDef: Column;
    callback: FilterCallback;
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
    private buildTemplateHtmlString();
    /**
     * From the html template string, create a DOM element
     * @param filterTemplate
     */
    private createDomElement(filterTemplate);
}
