import { I18N } from 'aurelia-i18n';
import { inject, BindingEngine } from 'aurelia-framework';
import { SelectFilter } from './selectFilter';
import { CollectionService } from '../services/collection.service';

@inject(BindingEngine, CollectionService, I18N)
export class MultipleSelectFilter extends SelectFilter {
  /**
   * Initialize the Filter
   */
  constructor(protected bindingEngine: BindingEngine, protected collectionService: CollectionService, protected i18n: I18N) {
    super(bindingEngine, collectionService, i18n, true);
  }
}
