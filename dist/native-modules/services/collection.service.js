var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { FilterMultiplePassType, FieldType, OperatorType, SortDirectionNumber, } from './../models/index';
import { sortByFieldType } from '../sorters/sorterUtilities';
import { uniqueArray } from './utilities';
var CollectionService = /** @class */ (function () {
    function CollectionService(i18n) {
        this.i18n = i18n;
    }
    /**
     * Filter 1 or more items from a collection
     * @param collection
     * @param filterByOptions
     */
    CollectionService.prototype.filterCollection = function (collection, filterByOptions, filterResultBy) {
        if (filterResultBy === void 0) { filterResultBy = FilterMultiplePassType.chain; }
        var filteredCollection = [];
        // when it's array, we will use the new filtered collection after every pass
        // basically if input collection has 10 items on 1st pass and 1 item is filtered out, then on 2nd pass the input collection will be 9 items
        if (Array.isArray(filterByOptions)) {
            filteredCollection = (filterResultBy === FilterMultiplePassType.merge) ? [] : collection.slice();
            for (var _i = 0, filterByOptions_1 = filterByOptions; _i < filterByOptions_1.length; _i++) {
                var filter = filterByOptions_1[_i];
                if (filterResultBy === FilterMultiplePassType.merge) {
                    var filteredPass = this.singleFilterCollection(collection, filter);
                    filteredCollection = uniqueArray(filteredCollection.concat(filteredPass));
                }
                else {
                    filteredCollection = this.singleFilterCollection(filteredCollection, filter);
                }
            }
        }
        else {
            filteredCollection = this.singleFilterCollection(collection, filterByOptions);
        }
        return filteredCollection;
    };
    /**
     * Filter an item from a collection
     * @param collection
     * @param filterBy
     */
    CollectionService.prototype.singleFilterCollection = function (collection, filterBy) {
        var filteredCollection = [];
        if (filterBy) {
            var property_1 = filterBy.property || '';
            var operator = filterBy.operator || OperatorType.equal;
            // just check for undefined since the filter value could be null, 0, '', false etc
            var value_1 = typeof filterBy.value === 'undefined' ? '' : filterBy.value;
            switch (operator) {
                case OperatorType.equal:
                    filteredCollection = collection.filter(function (item) { return item[property_1] === value_1; });
                    break;
                case OperatorType.contains:
                    filteredCollection = collection.filter(function (item) { return item[property_1].toString().indexOf(value_1.toString()) !== -1; });
                    break;
                case OperatorType.notContains:
                    filteredCollection = collection.filter(function (item) { return item[property_1].toString().indexOf(value_1.toString()) === -1; });
                    break;
                case OperatorType.notEqual:
                default:
                    filteredCollection = collection.filter(function (item) { return item[property_1] !== value_1; });
            }
        }
        return filteredCollection;
    };
    /**
     * Sort 1 or more items in a collection
     * @param collection
     * @param sortByOptions
     * @param enableTranslateLabel
     */
    CollectionService.prototype.sortCollection = function (collection, sortByOptions, enableTranslateLabel) {
        var _this = this;
        var sortedCollection = [];
        if (sortByOptions) {
            if (Array.isArray(sortByOptions)) {
                // multi-sort
                sortedCollection = collection.sort(function (dataRow1, dataRow2) {
                    for (var i = 0, l = sortByOptions.length; i < l; i++) {
                        var sortBy = sortByOptions[i];
                        if (sortBy) {
                            var sortDirection = sortBy.sortDesc ? SortDirectionNumber.desc : SortDirectionNumber.asc;
                            var propertyName = sortBy.property || '';
                            var fieldType = sortBy.fieldType || FieldType.string;
                            var value1 = (enableTranslateLabel) ? _this.i18n.tr(dataRow1[propertyName] || ' ') : dataRow1[propertyName];
                            var value2 = (enableTranslateLabel) ? _this.i18n.tr(dataRow2[propertyName] || ' ') : dataRow2[propertyName];
                            var sortResult = sortByFieldType(value1, value2, fieldType, sortDirection);
                            if (sortResult !== SortDirectionNumber.neutral) {
                                return sortResult;
                            }
                        }
                    }
                    return SortDirectionNumber.neutral;
                });
            }
            else {
                // single sort
                var propertyName_1 = sortByOptions.property || '';
                var sortDirection_1 = sortByOptions.sortDesc ? SortDirectionNumber.desc : SortDirectionNumber.asc;
                var fieldType_1 = sortByOptions.fieldType || FieldType.string;
                sortedCollection = collection.sort(function (dataRow1, dataRow2) {
                    var value1 = (enableTranslateLabel) ? _this.i18n.tr(dataRow1[propertyName_1] || ' ') : dataRow1[propertyName_1];
                    var value2 = (enableTranslateLabel) ? _this.i18n.tr(dataRow2[propertyName_1] || ' ') : dataRow2[propertyName_1];
                    var sortResult = sortByFieldType(value1, value2, fieldType_1, sortDirection_1);
                    if (sortResult !== SortDirectionNumber.neutral) {
                        return sortResult;
                    }
                    return SortDirectionNumber.neutral;
                });
            }
        }
        return sortedCollection;
    };
    CollectionService = __decorate([
        inject(I18N)
    ], CollectionService);
    return CollectionService;
}());
export { CollectionService };
//# sourceMappingURL=collection.service.js.map