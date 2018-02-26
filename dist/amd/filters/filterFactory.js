var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "../models/index"], function (require, exports, aurelia_framework_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** The name of the plugins the factory will initialize via Aurelia's All.Of */
    exports.PLUGIN_NAME = 'GRID_FILTERS';
    /**
     * Factory class to Instantiates a Filter interface implementation
     */
    var FilterFactory = /** @class */ (function () {
        /**
         * Creates an instance of the FilterFactory class
         * @param {Filter[]} filters the array of supported Filter interfaces
         * @param {FilterType} [defaultFilterType=FilterType.input] an optional default filter type to use
         * when no filter type is found. Supply a different default value using Aurelia's Factory.Of
         * resolver
         */
        function FilterFactory(filters, defaultFilterType) {
            if (defaultFilterType === void 0) { defaultFilterType = index_1.FilterType.input; }
            this.filters = filters;
            this.defaultFilterType = defaultFilterType;
        }
        /**
         * Creates a new Filter from the provided filterType
         * @param {FilterType | FormElementType | string} filterType the type of filter to create
         * as an enum or custom string
         * @return {Filter} the new Filter
         */
        FilterFactory.prototype.createFilter = function (filterType) {
            var _this = this;
            var filter = this.filters.find(function (f) {
                return f.filterType === filterType;
            });
            // default to the input filter type when none is found
            if (!filter) {
                var inputIndex = this.filters.findIndex(function (f) {
                    return f.filterType === _this.defaultFilterType;
                });
                if (inputIndex === -1) {
                    throw new Error("Default filter of type " + (index_1.FilterType[this.defaultFilterType] || this.defaultFilterType) + " was not found");
                }
                return this.filters[inputIndex];
            }
            return filter;
        };
        FilterFactory = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.All.of(exports.PLUGIN_NAME))
        ], FilterFactory);
        return FilterFactory;
    }());
    exports.FilterFactory = FilterFactory;
});
//# sourceMappingURL=filterFactory.js.map