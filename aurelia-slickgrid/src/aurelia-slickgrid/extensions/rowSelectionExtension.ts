import { singleton, inject } from 'aurelia-framework';
import { SharedService } from '../services/shared.service';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(SharedService)
export class RowSelectionExtension {
  constructor(private sharedService: SharedService) { }

  register() {
    const plugin = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || {});
    this.sharedService.grid.setSelectionModel(plugin);

    return plugin;
  }
}
