import { singleton, inject } from 'aurelia-framework';
import { SharedService } from '../services/shared.service';
import { Extension } from '../models';

// using external non-typed js libraries
declare var Slick: any;
declare function require(name: string);

@singleton(true)
@inject(SharedService)
export class AutoTooltipExtension implements Extension {
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
      require('slickgrid/plugins/slick.autotooltips');

      this._extension = new Slick.AutoTooltips(this.sharedService.gridOptions.autoTooltipOptions || {});
      this.sharedService.grid.registerPlugin(this._extension);

      return this._extension;
    }
    return null;
  }
}
