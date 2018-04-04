import { I18N } from 'aurelia-i18n';
import { CollectionFilterBy, CollectionSortBy } from './../models/index';
export declare class CollectionService {
    private i18n;
    constructor(i18n: I18N);
    /**
     * Filter items from a collection
     * @param collection
     * @param filterBy
     */
    filterCollection(collection: any[], filterBy: CollectionFilterBy): any[];
    /**
     * Sort items in a collection
     * @param collection
     * @param sortBy
     * @param columnDef
     * @param translate
     */
    sortCollection(collection: any[], sortBy: CollectionSortBy, enableTranslateLabel?: boolean): any[];
}
