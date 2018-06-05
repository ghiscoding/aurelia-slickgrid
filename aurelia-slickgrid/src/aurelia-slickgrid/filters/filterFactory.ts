import { inject, Container } from 'aurelia-framework';
import { ColumnFilter, Filter } from '../models/index';
import { SlickgridConfig } from '../slickgrid-config';

/**
 * Factory class to create a Filter interface implementation
 */
@inject(Container, SlickgridConfig)
export class FilterFactory {
  /**
   * The options from the SlickgridConfig
   */
  private _options: any;

  /**
   * Creates an instance of the FilterFactory class
   * @param {Container} container the Aurelia container
   * @param {SlickgridConfig} config the slickgrid configuration settings
   */
  constructor(private container: Container, private config: SlickgridConfig) {
    this._options = config.options;
  }

  /**
   * Creates a new Filter from the provided ColumnFilter or fallbacks to the default filter
   * @param {columnFilter} a ColumnFilter object
   * @return {Filter} the new Filter
   */
  public createFilter(columnFilter: ColumnFilter | undefined): Filter | undefined {
    let filter: Filter | undefined;

    if (columnFilter && columnFilter.model) {
      // the model either needs to be retrieved or is already instantiated
      filter = typeof columnFilter.model === 'function' ? this.container.get(columnFilter.model) : columnFilter.model;
    }

    // fallback to the default filter
    if (!filter && this._options.defaultFilter) {
      filter = this.container.get(this._options.defaultFilter);
    }

    return filter;
  }
}
