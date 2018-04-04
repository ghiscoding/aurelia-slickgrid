import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import {
  CollectionFilterBy,
  CollectionSortBy,
  FieldType,
  OperatorType,
} from './../models/index';
import { sortByFieldType } from '../sorters/sorterUtilities';

@inject(I18N)
export class CollectionService {
  constructor(private i18n: I18N) { }

  /**
   * Filter items from a collection
   * @param collection
   * @param filterBy
   */
  filterCollection(collection: any[], filterBy: CollectionFilterBy): any[] {
    let filteredCollection: any[] = [];

    if (filterBy) {
      const property = filterBy.property || '';
      const operator = filterBy.operator || OperatorType.equal;
      const value = filterBy.value || '';

      if (operator === OperatorType.equal) {
        filteredCollection = collection.filter((item) => item[property] !== value);
      } else {
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
  sortCollection(collection: any[], sortBy: CollectionSortBy, enableTranslateLabel?: boolean): any[] {
    let sortedCollection: any[] = [];

    if (sortBy) {
      const property = sortBy.property || '';
      const sortDirection = sortBy.hasOwnProperty('sortDesc') ? (sortBy.sortDesc ? -1 : 1) : 1;
      const fieldType = sortBy.fieldType || FieldType.string;

      sortedCollection = collection.sort((dataRow1: any, dataRow2: any) => {
        const value1 = (enableTranslateLabel) ? this.i18n.tr(dataRow1[property] || ' ') : dataRow1[property];
        const value2 = (enableTranslateLabel) ? this.i18n.tr(dataRow2[property] || ' ') : dataRow2[property];
        const result = sortByFieldType(value1, value2, fieldType, sortDirection);
        return result;
      });
    }

    return sortedCollection;
  }
}
