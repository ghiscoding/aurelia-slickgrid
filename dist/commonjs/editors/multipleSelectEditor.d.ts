import { BindingEngine } from 'aurelia-framework';
import { CollectionService } from '../services/index';
import { I18N } from 'aurelia-i18n';
import { SelectEditor } from './selectEditor';
export declare class MultipleSelectEditor extends SelectEditor {
    protected bindingEngine: BindingEngine;
    protected collectionService: CollectionService;
    protected i18n: I18N;
    protected args: any;
    /**
     * Initialize the Editor
     */
    constructor(bindingEngine: BindingEngine, collectionService: CollectionService, i18n: I18N, args: any);
}
