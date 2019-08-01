import { I18N } from 'aurelia-i18n';
import { BindingEngine, inject, Optional } from 'aurelia-framework';
import { SelectFilter } from './selectFilter';
import { CollectionService } from '../services/collection.service';

@inject(BindingEngine, CollectionService, Optional.of(I18N))
export class SingleSelectFilter extends SelectFilter {
  /**
   * Initialize the Filter
   */
  constructor(protected bindingEngine: BindingEngine, protected collectionService: CollectionService, protected i18n: I18N) {
    super(bindingEngine, collectionService, i18n, false);
  }
}
