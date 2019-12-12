import { inject, Optional, singleton } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { Constants } from '../constants';
import {
  CellMenu,
  Column,
  Extension,
  ExtensionName,
  MenuCommandItem,
  MenuItemCallbackArgs,
  MenuOptionItem,
  Locale,
  SlickEventHandler,
} from '../models/index';
import { FilterService } from '../services/filter.service';
import { SortService } from '../services/sort.service';
import { SharedService } from '../services/shared.service';
import { ExtensionUtility } from './extensionUtility';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(
  EventAggregator,
  ExtensionUtility,
  Optional.of(I18N),
  SharedService,
)
export class CellMenuExtension implements Extension {
  private _addon: any;
  private _eventHandler: SlickEventHandler;
  private _locales: Locale;

  constructor(
    private ea: EventAggregator,
    private extensionUtility: ExtensionUtility,
    private i18n: I18N,
    private sharedService: SharedService,
  ) {
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
  }

  /** Get the instance of the SlickGrid addon (control or plugin). */
  getAddonInstance() {
    return this._addon;
  }

  /**
   * Create the Action Cell Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...)
   * @param grid
   * @param dataView
   * @param columnDefinitions
   */
  register(): any {
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableTranslate && (!this.i18n || !this.i18n.tr)) {
      throw new Error('[Aurelia-Slickgrid] requires "I18N" to be installed and configured when the grid option "enableTranslate" is enabled.');
    }

    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
      // get locales provided by user in main file or else use default English locales via the Constants
      this._locales = this.sharedService.gridOptions && this.sharedService.gridOptions.locales || Constants.locales;

      // dynamically import the SlickGrid plugin (addon) with RequireJS
      this.extensionUtility.loadExtensionDynamically(ExtensionName.cellMenu);

      this.sharedService.gridOptions.cellMenu = { ...this.getDefaultCellMenuOptions(), ...this.sharedService.gridOptions.cellMenu };
      // if (this.sharedService.gridOptions.enableCellMenu) {
      //   this.sharedService.gridOptions.cellMenu = this.addcellMenuCustomCommands(this.sharedService.gridOptions, this.sharedService.columnDefinitions);
      // }

      // translate the item keys when necessary
      if (this.sharedService.gridOptions.enableTranslate) {
        this.translateCellMenu();
      }

      this._addon = new Slick.Plugins.CellMenu(this.sharedService.gridOptions.cellMenu);
      this.sharedService.grid.registerPlugin(this._addon);

      // hook all events
      if (this.sharedService.grid && this.sharedService.gridOptions.cellMenu) {
        if (this.sharedService.gridOptions.cellMenu.onExtensionRegistered) {
          this.sharedService.gridOptions.cellMenu.onExtensionRegistered(this._addon);
        }
        this._eventHandler.subscribe(this._addon.onCommand, (event: Event, args: MenuItemCallbackArgs<MenuCommandItem>) => {
          if (this.sharedService.gridOptions.cellMenu && typeof this.sharedService.gridOptions.cellMenu.onCommand === 'function') {
            this.sharedService.gridOptions.cellMenu.onCommand(event, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onOptionSelected, (event: Event, args: MenuItemCallbackArgs<MenuOptionItem>) => {
          if (this.sharedService.gridOptions.cellMenu && typeof this.sharedService.gridOptions.cellMenu.onOptionSelected === 'function') {
            this.sharedService.gridOptions.cellMenu.onOptionSelected(event, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onBeforeMenuShow, (event: Event, args: { cell: number; row: number; grid: any; }) => {
          if (this.sharedService.gridOptions.cellMenu && typeof this.sharedService.gridOptions.cellMenu.onBeforeMenuShow === 'function') {
            this.sharedService.gridOptions.cellMenu.onBeforeMenuShow(event, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onBeforeMenuClose, (event: Event, args: { cell: number; row: number; grid: any; menu: any; }) => {
          if (this.sharedService.gridOptions.cellMenu && typeof this.sharedService.gridOptions.cellMenu.onBeforeMenuClose === 'function') {
            this.sharedService.gridOptions.cellMenu.onBeforeMenuClose(event, args);
          }
        });
      }
      return this._addon;
    }
    return null;
  }

  /** Translate the Cell Menu titles, we need to loop through all column definition to re-translate them */
  translateCellMenu() {
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.cellMenu) {
      this.resetMenuTranslations(this.sharedService.visibleColumns);
    }
  }

  /**
   * @return default Action Cell Menu options
   */
  private getDefaultCellMenuOptions(): CellMenu {
    return {
      minWidth: 140,
    };
  }

  /**
   * Reset all the internal Menu options which have text to translate
   * @param grid menu object
   */
  private resetMenuTranslations(columnDefinitions: Column[]) {
    columnDefinitions.forEach((columnDef: Column) => {
      if (columnDef && columnDef.cellMenu && columnDef.cellMenu.commandItems) {
        const columnCellMenuCommandItems: Array<MenuCommandItem> | Array<'divider'> = columnDef.cellMenu.commandItems || [];
        const columnCellMenuOptionItems: Array<MenuOptionItem> | Array<'divider'> = columnDef.cellMenu.optionItems || [];
        columnDef.cellMenu.commandTitle = this.i18n && this.i18n.tr && this.i18n.tr(columnDef.cellMenu.commandTitleKey) || this._locales && this._locales.TEXT_COMMANDS || columnDef.cellMenu.commandTitle;
        columnDef.cellMenu.optionTitle = this.i18n && this.i18n.tr && this.i18n.tr(columnDef.cellMenu.optionTitleKey) || columnDef.cellMenu.optionTitle;

        columnCellMenuCommandItems.forEach((item) => {
          switch (item.command) {
            case 'export-csv':
              item.title = this.i18n.tr('EXPORT_TO_CSV') || this._locales && this._locales.TEXT_EXPORT_IN_CSV_FORMAT;
              break;
            case 'export-excel':
              item.title = this.i18n.tr('EXPORT_TO_EXCEL') || this._locales && this._locales.TEXT_EXPORT_TO_EXCEL;
              break;
            case 'export-text-delimited':
              item.title = this.i18n.tr('EXPORT_TO_TAB_DELIMITED') || this._locales && this._locales.TEXT_EXPORT_IN_TEXT_FORMAT;
              break;
            default:
              item.title = this.i18n && this.i18n.tr && this.i18n.tr(item.titleKey) || item.title;
              break;
          }

          // re-translate if there's a "titleKey"
          if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableTranslate) {
            this.extensionUtility.translateItems(columnCellMenuCommandItems, 'titleKey', 'title');
          }
        });

        columnCellMenuOptionItems.forEach(item => {
          item.title = this.i18n && this.i18n.tr && this.i18n.tr(item.titleKey) || item.title;
        });
      }
    });
  }

  // --
  // private functions
  // ------------------

}
