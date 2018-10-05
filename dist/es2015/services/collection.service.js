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
let CollectionService = class CollectionService {
    constructor(i18n) {
        this.i18n = i18n;
    }
    /**
     * Filter 1 or more items from a collection
     * @param collection
     * @param filterByOptions
     */
    filterCollection(collection, filterByOptions, filterResultBy = FilterMultiplePassType.chain) {
        let filteredCollection = [];
        // when it's array, we will use the new filtered collection after every pass
        // basically if input collection has 10 items on 1st pass and 1 item is filtered out, then on 2nd pass the input collection will be 9 items
        if (Array.isArray(filterByOptions)) {
            filteredCollection = (filterResultBy === FilterMultiplePassType.merge) ? [] : [...collection];
            for (const filter of filterByOptions) {
                if (filterResultBy === FilterMultiplePassType.merge) {
                    const filteredPass = this.singleFilterCollection(collection, filter);
                    filteredCollection = uniqueArray([...filteredCollection, ...filteredPass]);
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
    }
    /**
     * Filter an item from a collection
     * @param collection
     * @param filterBy
     */
    singleFilterCollection(collection, filterBy) {
        let filteredCollection = [];
        if (filterBy) {
            const property = filterBy.property || '';
            const operator = filterBy.operator || OperatorType.equal;
            // just check for undefined since the filter value could be null, 0, '', false etc
            const value = typeof filterBy.value === 'undefined' ? '' : filterBy.value;
            switch (operator) {
                case OperatorType.equal:
                    filteredCollection = collection.filter((item) => item[property] === value);
                    break;
                case OperatorType.contains:
                    filteredCollection = collection.filter((item) => item[property].toString().indexOf(value.toString()) !== -1);
                    break;
                case OperatorType.notContains:
                    filteredCollection = collection.filter((item) => item[property].toString().indexOf(value.toString()) === -1);
                    break;
                case OperatorType.notEqual:
                default:
                    filteredCollection = collection.filter((item) => item[property] !== value);
            }
        }
        return filteredCollection;
    }
    /**
     * Sort 1 or more items in a collection
     * @param collection
     * @param sortByOptions
     * @param enableTranslateLabel
     */
    sortCollection(collection, sortByOptions, enableTranslateLabel) {
        let sortedCollection = [];
        if (sortByOptions) {
            if (Array.isArray(sortByOptions)) {
                // multi-sort
                sortedCollection = collection.sort((dataRow1, dataRow2) => {
                    for (let i = 0, l = sortByOptions.length; i < l; i++) {
                        const sortBy = sortByOptions[i];
                        if (sortBy) {
                            const sortDirection = sortBy.sortDesc ? SortDirectionNumber.desc : SortDirectionNumber.asc;
                            const propertyName = sortBy.property || '';
                            const fieldType = sortBy.fieldType || FieldType.string;
                            const value1 = (enableTranslateLabel) ? this.i18n.tr(dataRow1[propertyName] || ' ') : dataRow1[propertyName];
                            const value2 = (enableTranslateLabel) ? this.i18n.tr(dataRow2[propertyName] || ' ') : dataRow2[propertyName];
                            const sortResult = sortByFieldType(value1, value2, fieldType, sortDirection);
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
                const propertyName = sortByOptions.property || '';
                const sortDirection = sortByOptions.sortDesc ? SortDirectionNumber.desc : SortDirectionNumber.asc;
                const fieldType = sortByOptions.fieldType || FieldType.string;
                sortedCollection = collection.sort((dataRow1, dataRow2) => {
                    const value1 = (enableTranslateLabel) ? this.i18n.tr(dataRow1[propertyName] || ' ') : dataRow1[propertyName];
                    const value2 = (enableTranslateLabel) ? this.i18n.tr(dataRow2[propertyName] || ' ') : dataRow2[propertyName];
                    const sortResult = sortByFieldType(value1, value2, fieldType, sortDirection);
                    if (sortResult !== SortDirectionNumber.neutral) {
                        return sortResult;
                    }
                    return SortDirectionNumber.neutral;
                });
            }
        }
        return sortedCollection;
    }
};
CollectionService = __decorate([
    inject(I18N)
], CollectionService);
export { CollectionService };
//# sourceMappingURL=collection.service.js.map