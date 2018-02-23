import { inject, All } from 'aurelia-framework';
import { Filter, FilterType, FormElementType } from '../models';

/** The name of the plugins the factory will initialize via Aurelia's All.Of */
export const PLUGIN_NAME = 'GRID_FILTERS';

/**
 * Factory class to Instantiates a Filter interface implementation
 */
@inject(All.of(PLUGIN_NAME))
export class FilterFactory {

  /**
   * Creates an instance of the FilterFactory class
   * @param {Filter[]} filters the array of supported Filter interfaces
   * @param {FilterType} [defaultFilterType=FilterType.input] an optional default filter type to use
   * when no filter type is found. Supply a different default value using Aurelia's Factory.Of
   * resolver
   */
  constructor(
    private filters: Filter[],
    private defaultFilterType: FilterType | FormElementType = FilterType.input
  ) { }

  /**
   * Creates a new Filter from the provided filterType
   * @param {FilterType | FormElementType} filterType the type of filter to create
   * @return {Filter} the new Filter
   */
  public createFilter(filterType: FilterType | FormElementType): Filter {
    const filter: Filter | undefined = this.filters.find((f: Filter) =>
      f.filterType === filterType);

    // default to the input filter type when none is found
    if (!filter) {
      const inputIndex: number = this.filters.findIndex((f: Filter) =>
        f.filterType === this.defaultFilterType);

      if (inputIndex === -1) {
        throw new Error(`Default filter of type ${FilterType[this.defaultFilterType] || this.defaultFilterType} was not found`);
      }

      return this.filters[inputIndex];
    }

    return filter;
  }
}
