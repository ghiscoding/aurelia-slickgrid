import { inject, Container } from 'aurelia-framework';
import { Filter, FilterType } from '../models/index';
import { SlickgridConfig } from '../slickgrid-config';

/** The name of the plugins the factory will initialize */
export const PLUGIN_NAME = 'GRID_FILTERS';

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
   * Creates a new Filter from the provided filterType
   * @param {FilterType | string} [filterType] the type of filter to create
   * as an enum or custom string. The default filter type will be used if no value is passed
   * @return {Filter} the new Filter
   */
  public createFilter(filterType?: FilterType | string): Filter {
    const filters = this.container.getAll(PLUGIN_NAME);

    let filter: Filter | undefined = filters.find((f: Filter) =>
      f.filterType === filterType);

    // default to the input filter type when none is found
    if (!filter) {
      filter = filters.find((f: Filter) => f.filterType === this._options.defaultFilterType);

      if (!filter) {
        const enumOrCustom = FilterType[this._options.defaultFilterType] ? 'FilterType.enum' : 'custom';

        throw new Error(`Default filter of type ${enumOrCustom}=${this._options.defaultFilterType} was not found`);
      }
    }

    return filter;
  }
}
