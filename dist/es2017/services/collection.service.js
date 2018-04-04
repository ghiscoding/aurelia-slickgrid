var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { FieldType, OperatorType, } from './../models/index';
import { sortByFieldType } from '../sorters/sorterUtilities';
let CollectionService = class CollectionService {
    constructor(i18n) {
        this.i18n = i18n;
    }
    /**
     * Filter items from a collection
     * @param collection
     * @param filterBy
     */
    filterCollection(collection, filterBy) {
        let filteredCollection = [];
        if (filterBy) {
            const property = filterBy.property || '';
            const operator = filterBy.operator || OperatorType.equal;
            const value = filterBy.value || '';
            if (operator === OperatorType.equal) {
                filteredCollection = collection.filter((item) => item[property] !== value);
            }
            else {
                filteredCollection = collection.filter((item) => item[property] === value);
            }
        }
        return filteredCollection;
    }
    /**
     * Sort items in a collection
     * @param collection
     * @param sortBy
     * @param columnDef
     * @param translate
     */
    sortCollection(collection, sortBy, enableTranslateLabel) {
        let sortedCollection = [];
        if (sortBy) {
            const property = sortBy.property || '';
            const sortDirection = sortBy.hasOwnProperty('sortDesc') ? (sortBy.sortDesc ? -1 : 1) : 1;
            const fieldType = sortBy.fieldType || FieldType.string;
            sortedCollection = collection.sort((dataRow1, dataRow2) => {
                const value1 = (enableTranslateLabel) ? this.i18n.tr(dataRow1[property] || ' ') : dataRow1[property];
                const value2 = (enableTranslateLabel) ? this.i18n.tr(dataRow2[property] || ' ') : dataRow2[property];
                const result = sortByFieldType(value1, value2, fieldType, sortDirection);
                return result;
            });
        }
        return sortedCollection;
    }
};
CollectionService = __decorate([
    inject(I18N)
], CollectionService);
export { CollectionService };
//# sourceMappingURL=collection.service.js.map