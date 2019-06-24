import { singleton, inject } from 'aurelia-framework';
import { Extension, ExtensionName } from './../models/index';
import { ExtensionUtility } from './extensionUtility';
import { SharedService } from '../services/shared.service';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(ExtensionUtility, SharedService)
export class RowSelectionExtension implements Extension {
  private _addon: any;

  constructor(private extensionUtility: ExtensionUtility, private sharedService: SharedService) { }

  dispose() {
    if (this._addon && this._addon.destroy) {
      this._addon.destroy();
    }
  }

  register(): any {
    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
      // dynamically import the SlickGrid plugin (addon) with RequireJS
      this.extensionUtility.loadExtensionDynamically(ExtensionName.rowSelection);

      this._addon = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || {});
      this.sharedService.grid.setSelectionModel(this._addon);
      return this._addon;
    }
    return null;
  }
}
