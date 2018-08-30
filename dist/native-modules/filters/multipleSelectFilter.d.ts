import { I18N } from 'aurelia-i18n';
import { BindingEngine } from 'aurelia-framework';
import { SelectFilter } from './selectFilter';
import { CollectionService } from '../services/collection.service';
export declare class MultipleSelectFilter extends SelectFilter {
    protected bindingEngine: BindingEngine;
    protected collectionService: CollectionService;
    protected i18n: I18N;
    /**
     * Initialize the Filter
     */
    constructor(bindingEngine: BindingEngine, collectionService: CollectionService, i18n: I18N);
}
