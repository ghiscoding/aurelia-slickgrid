var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject, All } from 'aurelia-framework';
import { FilterType } from '../models/index';
/** The name of the plugins the factory will initialize via Aurelia's All.Of */
export const PLUGIN_NAME = 'GRID_FILTERS';
/**
 * Factory class to Instantiates a Filter interface implementation
 */
let FilterFactory = class FilterFactory {
    /**
     * Creates an instance of the FilterFactory class
     * @param {Filter[]} filters the array of supported Filter interfaces
     * @param {FilterType} [defaultFilterType=FilterType.input] an optional default filter type to use
     * when no filter type is found. Supply a different default value using Aurelia's Factory.Of
     * resolver
     */
    constructor(filters, defaultFilterType = FilterType.input) {
        this.filters = filters;
        this.defaultFilterType = defaultFilterType;
    }
    /**
     * Creates a new Filter from the provided filterType
     * @param {FilterType | FormElementType | string} filterType the type of filter to create
     * as an enum or custom string
     * @return {Filter} the new Filter
     */
    createFilter(filterType) {
        const filter = this.filters.find((f) => f.filterType === filterType);
        // default to the input filter type when none is found
        if (!filter) {
            const inputIndex = this.filters.findIndex((f) => f.filterType === this.defaultFilterType);
            if (inputIndex === -1) {
                throw new Error(`Default filter of type ${FilterType[this.defaultFilterType] || this.defaultFilterType} was not found`);
            }
            return this.filters[inputIndex];
        }
        return filter;
    }
};
FilterFactory = __decorate([
    inject(All.of(PLUGIN_NAME))
], FilterFactory);
export { FilterFactory };
//# sourceMappingURL=filterFactory.js.map