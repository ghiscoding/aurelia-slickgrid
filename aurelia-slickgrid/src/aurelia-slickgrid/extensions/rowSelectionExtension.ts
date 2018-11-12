import { singleton, inject } from 'aurelia-framework';
import { Extension } from './../models';
import { SharedService } from '../services/shared.service';

// using external non-typed js libraries
declare var Slick: any;
declare function require(name: string);

@singleton(true)
@inject(SharedService)
export class RowSelectionExtension implements Extension {
  private _extension: any;

  constructor(private sharedService: SharedService) { }

  dispose() {
    if (this._extension && this._extension.destroy) {
      this._extension.destroy();
    }
  }

  register(): any {
    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
      // dynamically import the SlickGrid plugin with requireJS
      require('slickgrid/plugins/slick.rowselectionmodel');

      this._extension = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || {});
      this.sharedService.grid.setSelectionModel(this._extension);
      return this._extension;
    }
    return null;
  }
}
