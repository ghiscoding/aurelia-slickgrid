import { singleton, inject } from 'aurelia-framework';
import { SharedService } from '../services/shared.service';
import { DraggableGrouping, Extension, ExtensionName, GridOption, Grouping, SlickEventHandler } from '../models/index';
import { ExtensionUtility } from './extensionUtility';

// using external non-typed js libraries
declare const Slick: any;

@singleton(true)
@inject(ExtensionUtility, SharedService)
export class DraggableGroupingExtension implements Extension {
  private _addon: any;
  private _draggableGroupingOptions: DraggableGrouping | null;
  private _eventHandler: SlickEventHandler;

  constructor(private extensionUtility: ExtensionUtility, private sharedService: SharedService) {
    this._eventHandler = new Slick.EventHandler();
  }

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  dispose() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();

    if (this._addon && this._addon.destroy) {
      this._addon.destroy();
    }
    this.extensionUtility.nullifyFunctionNameStartingWithOn(this._draggableGroupingOptions);
    this._addon = null;
    this._draggableGroupingOptions = null;
  }

  /**
   * Bind/Create different plugins before the Grid creation.
   * For example the multi-select have to be added to the column definition before the grid is created to work properly
   */
  create(gridOptions: GridOption) {
    if (gridOptions) {
      // dynamically import the SlickGrid plugin (addon) with RequireJS
      this.extensionUtility.loadExtensionDynamically(ExtensionName.draggableGrouping);

      if (!this._addon && gridOptions) {
        this._addon = new Slick.DraggableGrouping(gridOptions.draggableGrouping || {});
      }
      return this._addon;
    }
    return null;
  }

  /** Get the instance of the SlickGrid addon (control or plugin). */
  getAddonInstance() {
    return this._addon;
  }

  register(): any {
    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
      this.sharedService.grid.registerPlugin(this._addon);

      // Events
      if (this.sharedService.grid && this.sharedService.gridOptions.draggableGrouping) {
        this._draggableGroupingOptions = this.sharedService.gridOptions.draggableGrouping;
        if (this._addon && this._draggableGroupingOptions.onExtensionRegistered) {
          this._draggableGroupingOptions.onExtensionRegistered(this._addon);
        }
        this._eventHandler.subscribe(this._addon.onGroupChanged, (e: any, args: { caller?: string; groupColumns: Grouping[] }) => {
          if (this._draggableGroupingOptions && typeof this._draggableGroupingOptions.onGroupChanged === 'function') {
            this._draggableGroupingOptions.onGroupChanged(e, args);
          }
        });
      }

      return this._addon;
    }
    return null;
  }
}
