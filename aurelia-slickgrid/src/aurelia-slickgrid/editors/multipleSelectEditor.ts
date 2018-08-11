import { CollectionService } from '../services/index';
import { I18N } from 'aurelia-i18n';
import { SelectEditor } from './selectEditor';
import { inject } from 'aurelia-framework';

@inject(CollectionService, I18N)
export class MultipleSelectEditor extends SelectEditor {
  /**
   * Initialize the Editor
   */
  constructor(protected collectionService: CollectionService, protected i18n: I18N, protected args: any) {
    super(collectionService, i18n, args, true);
  }
}
