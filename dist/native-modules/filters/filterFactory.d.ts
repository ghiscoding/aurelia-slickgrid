import { Container } from 'aurelia-framework';
import { Filter, FilterType, FormElementType } from '../models/index';
import { SlickgridConfig } from '../slickgrid-config';
/** The name of the plugins the factory will initialize */
export declare const PLUGIN_NAME = "GRID_FILTERS";
/**
 * Factory class to create a Filter interface implementation
 */
export declare class FilterFactory {
    private container;
    private config;
    /**
     * The options from the SlickgridConfig
     */
    private _options;
    /**
     * Creates an instance of the FilterFactory class
     * @param {Container} container the Aurelia container
     * @param {SlickgridConfig} config the slickgrid configuration settings
     */
    constructor(container: Container, config: SlickgridConfig);
    /**
     * Creates a new Filter from the provided filterType
     * @param {FilterType | FormElementType | string} [filterType] the type of filter to create
     * as an enum or custom string. The default filter type will be used if no value is passed
     * @return {Filter} the new Filter
     */
    createFilter(filterType?: FilterType | FormElementType | string): Filter;
}
