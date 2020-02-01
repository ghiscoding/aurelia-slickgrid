import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';

import { CellMenuExtension } from '../cellMenuExtension';
import { ExtensionUtility } from '../extensionUtility';
import { SharedService } from '../../services/shared.service';
import { Column, GridOption, MenuCommandItemCallbackArgs, MenuOptionItemCallbackArgs } from '../../models';

declare var Slick: any;

const dataViewStub = {
  refresh: jest.fn(),
};

const gridStub = {
  autosizeColumns: jest.fn(),
  getColumnIndex: jest.fn(),
  getColumns: jest.fn(),
  getOptions: jest.fn(),
  registerPlugin: jest.fn(),
  setColumns: jest.fn(),
  setHeaderRowVisibility: jest.fn(),
  setTopPanelVisibility: jest.fn(),
  setPreHeaderPanelVisibility: jest.fn(),
  setSortColumns: jest.fn(),
  onSort: new Slick.Event(),
};

const mockAddon = jest.fn().mockImplementation(() => ({
  init: jest.fn(),
  destroy: jest.fn(),
  onAfterMenuShow: new Slick.Event(),
  onBeforeMenuClose: new Slick.Event(),
  onBeforeMenuShow: new Slick.Event(),
  onColumnsChanged: new Slick.Event(),
  onCommand: new Slick.Event(),
  onOptionSelected: new Slick.Event(),
}));

jest.mock('slickgrid/plugins/slick.cellmenu', () => mockAddon);
Slick.Plugins = {
  CellMenu: mockAddon
};

describe('CellMenuExtension', () => {
  const columnsMock: Column[] = [{ id: 'field1', field: 'field1', width: 100, nameKey: 'TITLE' }, { id: 'field2', field: 'field2', width: 75 }];
  let extensionUtility: ExtensionUtility;
  let ea: EventAggregator;
  let i18n: I18N;
  let extension: CellMenuExtension;
  let sharedService: SharedService;

  const gridOptionsMock = {
    enableAutoSizeColumns: true,
    enableCellMenu: true,
    enableTranslate: true,
    backendServiceApi: {
      service: {
        buildQuery: jest.fn(),
      },
      internalPostProcess: jest.fn(),
      preProcess: jest.fn(),
      process: jest.fn(),
      postProcess: jest.fn(),
    },
    cellMenu: {
      autoAdjustDrop: true,
      autoAlignSide: true,
      autoAdjustDropOffset: 0,
      autoAlignSideOffset: 0,
      hideMenuOnScroll: true,
      maxHeight: 'none',
      width: 'auto',
      onExtensionRegistered: jest.fn(),
      onCommand: () => { },
      onAfterMenuShow: () => { },
      onBeforeMenuShow: () => { },
      onBeforeMenuClose: () => { },
      onOptionSelected: () => { },
    },
    multiColumnSort: true,
    pagination: {
      totalItems: 0
    },
    showHeaderRow: false,
    showTopPanel: false,
    showPreHeaderPanel: false
  } as unknown as GridOption;

  describe('with I18N Service', () => {
    beforeEach(() => {
      ea = new EventAggregator();
      sharedService = new SharedService();
      i18n = new I18N(ea, new BindingSignaler());
      extensionUtility = new ExtensionUtility(i18n, sharedService);
      extension = new CellMenuExtension(extensionUtility, i18n, sharedService);
      i18n.setup({
        resources: {
          en: {
            translation: {
              TITLE: 'Title',
              COMMANDS: 'Commands',
              COLUMNS: 'Columns',
              HIDE_COLUMN: 'Hide Column',
              REMOVE_FILTER: 'Remove Filter',
              REMOVE_SORT: 'Remove Sort',
              SORT_ASCENDING: 'Sort Ascending',
              SORT_DESCENDING: 'Sort Descending',
              OPTIONS_LIST: 'Options List',
            },
          },
          fr: {
            translation: {
              TITLE: 'Titre',
              COMMANDS: 'Commandes',
              COLUMNS: 'Colonnes',
              HIDE_COLUMN: 'Cacher la colonne',
              REMOVE_FILTER: 'Supprimer le filtre',
              REMOVE_SORT: 'Supprimer le tri',
              SORT_ASCENDING: 'Trier par ordre croissant',
              SORT_DESCENDING: 'Trier par ordre décroissant',
              OPTIONS_LIST: 'Liste d\'options',
            }
          }
        },
        lng: 'en',
        fallbackLng: 'en',
        debug: false
      });
      i18n.setLocale('fr');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return null when either the grid object or the grid options is missing', () => {
      const output = extension.register();
      expect(output).toBeNull();
    });

    describe('registered addon', () => {
      beforeEach(() => {
        jest.spyOn(SharedService.prototype, 'dataView', 'get').mockReturnValue(dataViewStub);
        jest.spyOn(SharedService.prototype, 'grid', 'get').mockReturnValue(gridStub);
        jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);
        jest.spyOn(SharedService.prototype, 'allColumns', 'get').mockReturnValue(columnsMock);
        jest.spyOn(SharedService.prototype, 'visibleColumns', 'get').mockReturnValue(columnsMock);
        jest.spyOn(SharedService.prototype, 'columnDefinitions', 'get').mockReturnValue(columnsMock);
      });

      it('should register the addon', () => {
        const pluginSpy = jest.spyOn(SharedService.prototype.grid, 'registerPlugin');
        const onRegisteredSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onExtensionRegistered');

        const instance = extension.register();
        const addonInstance = extension.getAddonInstance();

        expect(instance).toBeTruthy();
        expect(instance).toEqual(addonInstance);
        expect(mockAddon).toHaveBeenCalledWith({
          autoAdjustDrop: true,
          autoAlignSide: true,
          autoAdjustDropOffset: 0,
          autoAlignSideOffset: 0,
          hideMenuOnScroll: true,
          maxHeight: 'none',
          width: 'auto',
          onCommand: expect.anything(),
          onOptionSelected: expect.anything(),
          onBeforeMenuClose: expect.anything(),
          onBeforeMenuShow: expect.anything(),
          onAfterMenuShow: expect.anything(),
          onExtensionRegistered: expect.anything(),
        });
        expect(onRegisteredSpy).toHaveBeenCalledWith(instance);
        expect(pluginSpy).toHaveBeenCalledWith(instance);
      });

      it('should call internal event handler subscribe and expect the "onBeforeMenuShow" option to be called when addon notify is called', () => {
        const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
        const onb4CloseSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuClose');
        const onb4ShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuShow');
        const onAfterShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onAfterMenuShow');
        const onCommandSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onCommand');
        const onOptionSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onOptionSelected');

        const instance = extension.register();
        instance.onBeforeMenuShow.notify({ cell: 0, row: 0, grid: gridStub }, new Slick.EventData(), gridStub);

        expect(handlerSpy).toHaveBeenCalledTimes(5);
        expect(handlerSpy).toHaveBeenCalledWith(
          { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
          expect.anything()
        );
        expect(onb4ShowSpy).toHaveBeenCalledWith(expect.anything(), { cell: 0, row: 0, grid: gridStub });
        expect(onb4CloseSpy).not.toHaveBeenCalled();
        expect(onCommandSpy).not.toHaveBeenCalled();
        expect(onOptionSpy).not.toHaveBeenCalled();
        expect(onAfterShowSpy).not.toHaveBeenCalled();
      });

      it('should call internal event handler subscribe and expect the "onBeforeMenuClose" option to be called when addon notify is called', () => {
        const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
        const onb4CloseSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuClose');
        const onb4ShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuShow');
        const onAfterShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onAfterMenuShow');
        const onCommandSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onCommand');
        const onOptionSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onOptionSelected');

        const menuElm = document.createElement('div');
        const instance = extension.register();
        instance.onBeforeMenuClose.notify({ cell: 0, row: 0, grid: gridStub, menu: menuElm }, new Slick.EventData(), gridStub);

        expect(handlerSpy).toHaveBeenCalledTimes(5);
        expect(handlerSpy).toHaveBeenCalledWith(
          { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
          expect.anything()
        );
        expect(onb4CloseSpy).toHaveBeenCalledWith(expect.anything(), { cell: 0, row: 0, grid: gridStub, menu: menuElm });
        expect(onb4ShowSpy).not.toHaveBeenCalled();
        expect(onCommandSpy).not.toHaveBeenCalled();
        expect(onOptionSpy).not.toHaveBeenCalled();
        expect(onAfterShowSpy).not.toHaveBeenCalled();
      });

      it('should call internal event handler subscribe and expect the "onAfterMenuShow" option to be called when addon notify is called', () => {
        const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
        const onb4CloseSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuClose');
        const onb4ShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuShow');
        const onAfterShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onAfterMenuShow');
        const onCommandSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onCommand');
        const onOptionSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onOptionSelected');

        const instance = extension.register();
        instance.onAfterMenuShow.notify({ cell: 0, row: 0, grid: gridStub }, new Slick.EventData(), gridStub);

        expect(handlerSpy).toHaveBeenCalledTimes(5);
        expect(handlerSpy).toHaveBeenCalledWith(
          { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
          expect.anything()
        );
        expect(onAfterShowSpy).toHaveBeenCalledWith(expect.anything(), { cell: 0, row: 0, grid: gridStub });
        expect(onb4CloseSpy).not.toHaveBeenCalled();
        expect(onb4ShowSpy).not.toHaveBeenCalled();
        expect(onCommandSpy).not.toHaveBeenCalled();
        expect(onOptionSpy).not.toHaveBeenCalled();
      });

      it('should call internal event handler subscribe and expect the "onCommand" option to be called when addon notify is called', () => {
        const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
        const onb4CloseSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuClose');
        const onb4ShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuShow');
        const onAfterShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onAfterMenuShow');
        const onCommandSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onCommand');
        const onOptionSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onOptionSelected');

        const instance = extension.register();
        instance.onCommand.notify({ grid: gridStub, command: 'help' }, new Slick.EventData(), gridStub);

        expect(handlerSpy).toHaveBeenCalledTimes(5);
        expect(handlerSpy).toHaveBeenCalledWith(
          { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
          expect.anything()
        );
        expect(onCommandSpy).toHaveBeenCalledWith(expect.anything(), { grid: gridStub, command: 'help' });
        expect(onOptionSpy).not.toHaveBeenCalled();
        expect(onb4CloseSpy).not.toHaveBeenCalled();
        expect(onb4ShowSpy).not.toHaveBeenCalled();
        expect(onAfterShowSpy).not.toHaveBeenCalled();
      });

      it('should call internal event handler subscribe and expect the "onOptionSelected" option to be called when addon notify is called', () => {
        const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
        const onb4CloseSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuClose');
        const onb4ShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onBeforeMenuShow');
        const onAfterShowSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onAfterMenuShow');
        const onCommandSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onCommand');
        const onOptionSpy = jest.spyOn(SharedService.prototype.gridOptions.cellMenu, 'onOptionSelected');

        const instance = extension.register();
        instance.onOptionSelected.notify({ grid: gridStub, command: 'help' }, new Slick.EventData(), gridStub);

        expect(handlerSpy).toHaveBeenCalledTimes(5);
        expect(handlerSpy).toHaveBeenCalledWith(
          { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
          expect.anything()
        );
        expect(onOptionSpy).toHaveBeenCalledWith(expect.anything(), { grid: gridStub, command: 'help' });
        expect(onCommandSpy).not.toHaveBeenCalled();
        expect(onb4CloseSpy).not.toHaveBeenCalled();
        expect(onb4ShowSpy).not.toHaveBeenCalled();
        expect(onAfterShowSpy).not.toHaveBeenCalled();
      });

      it('should dispose of the addon', () => {
        const instance = extension.register();
        const destroySpy = jest.spyOn(instance, 'destroy');

        extension.dispose();

        expect(destroySpy).toHaveBeenCalled();
      });
    });

    describe('translateCellMenu method', () => {
      it('should call the resetCellMenuTranslations and have all cell menu commands translated', () => {
        const mockColumns: Column[] = [{
          id: 'field1', field: 'field1', width: 100,
          cellMenu: {
            commandTitleKey: 'COMMANDS',
            commandItems: [
              { iconCssClass: 'fa fa-sort-asc', title: 'Trier par ordre croissant', titleKey: 'SORT_ASCENDING', command: 'sort-asc', positionOrder: 50 },
              { iconCssClass: 'fa fa-sort-desc', title: 'Trier par ordre décroissant', titleKey: 'SORT_DESCENDING', command: 'sort-desc', positionOrder: 51 },
              { divider: true, command: '', positionOrder: 52 },
              { iconCssClass: 'fa fa-filter', title: 'Supprimer le filtre', titleKey: 'REMOVE_FILTER', command: 'clear-filter', positionOrder: 53 },
              { iconCssClass: 'fa fa-unsorted', title: 'Supprimer le tri', titleKey: 'REMOVE_SORT', command: 'clear-sort', positionOrder: 54 },
              { iconCssClass: 'fa fa-times', command: 'hide', titleKey: 'HIDE_COLUMN', positionOrder: 55, title: 'Cacher la colonne' },
            ]
          }
        }];
        jest.spyOn(SharedService.prototype, 'allColumns', 'get').mockReturnValue(mockColumns);

        i18n.setLocale('en');
        extension.translateCellMenu();

        expect(mockColumns).toEqual([{
          id: 'field1', field: 'field1', width: 100,
          cellMenu: {
            commandTitle: 'Commands',
            commandTitleKey: 'COMMANDS',
            commandItems: [
              { iconCssClass: 'fa fa-sort-asc', title: 'Sort Ascending', titleKey: 'SORT_ASCENDING', command: 'sort-asc', positionOrder: 50 },
              { iconCssClass: 'fa fa-sort-desc', title: 'Sort Descending', titleKey: 'SORT_DESCENDING', command: 'sort-desc', positionOrder: 51 },
              { divider: true, command: '', positionOrder: 52 },
              { iconCssClass: 'fa fa-filter', title: 'Remove Filter', titleKey: 'REMOVE_FILTER', command: 'clear-filter', positionOrder: 53 },
              { iconCssClass: 'fa fa-unsorted', title: 'Remove Sort', titleKey: 'REMOVE_SORT', command: 'clear-sort', positionOrder: 54 },
              { iconCssClass: 'fa fa-times', titleKey: 'HIDE_COLUMN', command: 'hide', positionOrder: 55, title: 'Hide Column' },
            ]
          }
        }]);
      });

      it('should call the resetCellMenuTranslations and have all cell menu options translated', () => {
        const mockColumns: Column[] = [{
          id: 'field1', field: 'field1', width: 100,
          cellMenu: {
            optionTitleKey: 'OPTIONS_LIST',
            optionItems: [
              { iconCssClass: 'fa fa-sort-asc', title: 'Trier par ordre croissant', titleKey: 'SORT_ASCENDING', option: 'sort-asc', positionOrder: 50 },
              { iconCssClass: 'fa fa-sort-desc', title: 'Trier par ordre décroissant', titleKey: 'SORT_DESCENDING', option: 'sort-desc', positionOrder: 51 },
              'divider',
              { iconCssClass: 'fa fa-filter', title: 'Supprimer le filtre', titleKey: 'REMOVE_FILTER', option: 'clear-filter', positionOrder: 53 },
              { iconCssClass: 'fa fa-unsorted', title: 'Supprimer le tri', titleKey: 'REMOVE_SORT', option: 'clear-sort', positionOrder: 54 },
              { iconCssClass: 'fa fa-times', option: 'hide', titleKey: 'HIDE_COLUMN', positionOrder: 55, title: 'Cacher la colonne' },
            ]
          }
        }];
        jest.spyOn(SharedService.prototype, 'allColumns', 'get').mockReturnValue(mockColumns);

        i18n.setLocale('en');
        extension.translateCellMenu();

        expect(mockColumns).toEqual([{
          id: 'field1', field: 'field1', width: 100,
          cellMenu: {
            optionTitle: 'Options List',
            optionTitleKey: 'OPTIONS_LIST',
            optionItems: [
              { iconCssClass: 'fa fa-sort-asc', title: 'Sort Ascending', titleKey: 'SORT_ASCENDING', option: 'sort-asc', positionOrder: 50 },
              { iconCssClass: 'fa fa-sort-desc', title: 'Sort Descending', titleKey: 'SORT_DESCENDING', option: 'sort-desc', positionOrder: 51 },
              'divider',
              { iconCssClass: 'fa fa-filter', title: 'Remove Filter', titleKey: 'REMOVE_FILTER', option: 'clear-filter', positionOrder: 53 },
              { iconCssClass: 'fa fa-unsorted', title: 'Remove Sort', titleKey: 'REMOVE_SORT', option: 'clear-sort', positionOrder: 54 },
              { iconCssClass: 'fa fa-times', titleKey: 'HIDE_COLUMN', option: 'hide', positionOrder: 55, title: 'Hide Column' },
            ]
          }
        }]);
      });
    });

    describe('sortMenuItems method', () => {
      it('should sort the columns by their "positionOrder"', () => {
        const mockColumns: Column[] = [{
          id: 'field1', field: 'field1', width: 100,
          cellMenu: {
            commandTitle: 'Commands List',
            commandItems: [
              { iconCssClass: 'fa fa-unsorted', title: 'Supprimer le tri', command: 'clear-sort', positionOrder: 54 },
              { iconCssClass: 'fa fa-filter', title: 'Supprimer le filtre', command: 'clear-filter', positionOrder: 53 },
              { iconCssClass: 'fa fa-sort-asc', title: 'Trier par ordre croissant', command: 'sort-asc', positionOrder: 50 },
              { iconCssClass: 'fa fa-sort-desc', title: 'Trier par ordre décroissant', command: 'sort-desc', positionOrder: 51 },
              { divider: true, command: '', positionOrder: 52 },
              { iconCssClass: 'fa fa-times', command: 'hide', positionOrder: 55, title: 'Cacher la colonne' },
            ],
            optionTitle: 'Options List',
            optionItems: [
              { iconCssClass: 'fa fa-arrow-right', title: 'Option 2', option: 2, positionOrder: 51 },
              { divider: true, option: '', positionOrder: 52 },
              { iconCssClass: 'fa fa-circle-question', title: 'Option 1', option: 1, positionOrder: 50 },
              { iconCssClass: 'fa fa-filter', title: 'Option 3', option: 3, positionOrder: 55 },
              { iconCssClass: 'fa fa-unsorted', title: 'Option 4', option: 4, positionOrder: 54 },
            ]
          }
        }];

        extension.sortMenuItems(mockColumns);

        expect(mockColumns).toEqual([{
          id: 'field1', field: 'field1', width: 100,
          cellMenu: {
            commandTitle: 'Commands List',
            commandItems: [
              { iconCssClass: 'fa fa-sort-asc', title: 'Trier par ordre croissant', command: 'sort-asc', positionOrder: 50 },
              { iconCssClass: 'fa fa-sort-desc', title: 'Trier par ordre décroissant', command: 'sort-desc', positionOrder: 51 },
              { divider: true, command: '', positionOrder: 52 },
              { iconCssClass: 'fa fa-filter', title: 'Supprimer le filtre', command: 'clear-filter', positionOrder: 53 },
              { iconCssClass: 'fa fa-unsorted', title: 'Supprimer le tri', command: 'clear-sort', positionOrder: 54 },
              { iconCssClass: 'fa fa-times', command: 'hide', positionOrder: 55, title: 'Cacher la colonne' },
            ],
            optionTitle: 'Options List',
            optionItems: [
              { iconCssClass: 'fa fa-circle-question', title: 'Option 1', option: 1, positionOrder: 50 },
              { iconCssClass: 'fa fa-arrow-right', title: 'Option 2', option: 2, positionOrder: 51 },
              { divider: true, option: '', positionOrder: 52 },
              { iconCssClass: 'fa fa-unsorted', title: 'Option 4', option: 4, positionOrder: 54 },
              { iconCssClass: 'fa fa-filter', title: 'Option 3', option: 3, positionOrder: 55 },
            ]
          }
        }]);
      });
    });

    describe('without I18N Service', () => {
      beforeEach(() => {
        i18n = null;
        extension = new CellMenuExtension({} as ExtensionUtility, i18n, { gridOptions: { enableTranslate: true } } as SharedService);
      });

      it('should throw an error if "enableTranslate" is set but the I18N Service is null', () => {
        expect(() => extension.register()).toThrowError('[Aurelia-Slickgrid] requires "I18N" to be installed and configured');
      });
    });
  });
});
