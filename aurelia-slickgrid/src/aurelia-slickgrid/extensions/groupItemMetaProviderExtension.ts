import { singleton, inject } from 'aurelia-framework';
import { SharedService } from '../services/shared.service';

@singleton(true)
@inject(SharedService)
export class GroupItemMetaProviderExtension {
  constructor(private sharedService: SharedService) { }

  /** register the group item metadata provider to add expand/collapse group handlers */
  register() {
    const plugin = this.sharedService.groupItemMetadataProvider || {};
    this.sharedService.grid.registerPlugin(plugin);

    return plugin;
  }
}
