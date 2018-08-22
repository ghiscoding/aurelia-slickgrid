import { inject, BindingEngine } from 'aurelia-framework';
import { CollectionService } from '../services/index';
import { I18N } from 'aurelia-i18n';
import { SelectEditor } from './selectEditor';

@inject(BindingEngine, CollectionService, I18N)
export class SingleSelectEditor extends SelectEditor {
  /**
   * Initialize the Editor
   */
  constructor(protected bindingEngine: BindingEngine, protected collectionService: CollectionService, protected i18n: I18N, protected args: any) {
    super(bindingEngine, collectionService, i18n, args, false);
  }
}
