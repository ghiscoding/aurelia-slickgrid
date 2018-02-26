import { Filter, FilterType, FormElementType } from '../models/index';
/** The name of the plugins the factory will initialize via Aurelia's All.Of */
export declare const PLUGIN_NAME = "GRID_FILTERS";
/**
 * Factory class to Instantiates a Filter interface implementation
 */
export declare class FilterFactory {
    private filters;
    private defaultFilterType;
    /**
     * Creates an instance of the FilterFactory class
     * @param {Filter[]} filters the array of supported Filter interfaces
     * @param {FilterType} [defaultFilterType=FilterType.input] an optional default filter type to use
     * when no filter type is found. Supply a different default value using Aurelia's Factory.Of
     * resolver
     */
    constructor(filters: Filter[], defaultFilterType?: FilterType | FormElementType);
    /**
     * Creates a new Filter from the provided filterType
     * @param {FilterType | FormElementType | string} filterType the type of filter to create
     * as an enum or custom string
     * @return {Filter} the new Filter
     */
    createFilter(filterType: FilterType | FormElementType | string): Filter;
}
