import { Container } from 'aurelia-framework';
import { ColumnFilter, Filter } from '../models/index';
import { SlickgridConfig } from '../slickgrid-config';
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
     * Creates a new Filter from the provided ColumnFilter or fallbacks to the default filter
     * @param {columnFilter} a ColumnFilter object
     * @return {Filter} the new Filter
     */
    createFilter(columnFilter: ColumnFilter | undefined): Filter | undefined;
}
