import { singleton, inject } from 'aurelia-framework';
import { Column, Extension, ExtensionName, GridOption } from '../models/index';
import { ExtensionUtility } from './extensionUtility';
import { SharedService } from '../services/shared.service';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(ExtensionUtility, SharedService)
export class RowDetailViewExtension implements Extension {
  private _eventHandler: any = new Slick.EventHandler();
  private _extension: any;

  constructor(private extensionUtility: ExtensionUtility, private sharedService: SharedService) { }

  dispose() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();

    if (this._extension && this._extension.destroy) {
      this._extension.destroy();
    }
  }

  /**
   * Create the plugin before the Grid creation, else it will behave oddly.
   * Mostly because the column definitions might change after the grid creation
   */
  create(columnDefinitions: Column[], gridOptions: GridOption) {
    if (columnDefinitions && gridOptions) {
      // dynamically import the SlickGrid plugin with requireJS
      this.extensionUtility.loadExtensionDynamically(ExtensionName.rowDetailView);

      if (!gridOptions.rowDetailView) {
        throw new Error('The Row Detail View requires options to be passed via the "rowDetailView" property of the Grid Options');
      }

      if (!this._extension) {
        this._extension = new Slick.Plugins.RowDetailView(gridOptions.rowDetailView);
      }
      const selectionColumn: Column = this._extension.getColumnDefinition();
      selectionColumn.excludeFromExport = true;
      selectionColumn.excludeFromQuery = true;
      selectionColumn.excludeFromHeaderMenu = true;
      columnDefinitions.unshift(selectionColumn);
      return this._extension;
    }
    return null;
  }

  register(rowSelectionPlugin?: any) {
    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
      // the plugin has to be created BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
      this.sharedService.grid.registerPlugin(this._extension);

      // this also requires the Row Selection Model to be registered as well
      if (!rowSelectionPlugin || !this.sharedService.grid.getSelectionModel()) {
        this.extensionUtility.loadExtensionDynamically(ExtensionName.rowSelection);
        rowSelectionPlugin = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || { selectActiveRow: true });
        this.sharedService.grid.setSelectionModel(rowSelectionPlugin);
      }

      // this._extension = this.create(this.sharedService.allColumns, this.sharedService.gridOptions);
      this.sharedService.grid.registerPlugin(this._extension);

      // hook all events
      if (this.sharedService.grid && this.sharedService.gridOptions.rowDetailView) {
        this._eventHandler.subscribe(this._extension.onAsyncResponse, (e: any, args: any) => {
          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onAsyncResponse === 'function') {
            this.sharedService.gridOptions.rowDetailView.onAsyncResponse(e, args);
          }
        });
        this._eventHandler.subscribe(this._extension.onAsyncEndUpdate, (e: any, args: any) => {
          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onAsyncEndUpdate === 'function') {
            this.sharedService.gridOptions.rowDetailView.onAsyncEndUpdate(e, args);
          }
        });
        this._eventHandler.subscribe(this._extension.onAfterRowDetailToggle, (e: any, args: any) => {
          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onAfterRowDetailToggle === 'function') {
            this.sharedService.gridOptions.rowDetailView.onAfterRowDetailToggle(e, args);
          }
        });
        this._eventHandler.subscribe(this._extension.onBeforeRowDetailToggle, (e: any, args: any) => {
          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onBeforeRowDetailToggle === 'function') {
            this.sharedService.gridOptions.rowDetailView.onBeforeRowDetailToggle(e, args);
          }
        });
        this._eventHandler.subscribe(this._extension.onRowBackToViewportRange, (e: any, args: any) => {
          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onRowBackToViewportRange === 'function') {
            this.sharedService.gridOptions.rowDetailView.onRowBackToViewportRange(e, args);
          }
        });
        this._eventHandler.subscribe(this._extension.onRowOutOfViewportRange, (e: any, args: any) => {
          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onRowOutOfViewportRange === 'function') {
            this.sharedService.gridOptions.rowDetailView.onRowOutOfViewportRange(e, args);
          }
        });
      }
      return this._extension;
    }
    return null;
  }
}
