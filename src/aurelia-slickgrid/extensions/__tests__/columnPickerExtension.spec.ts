import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';
import { GridOption } from '../../models/gridOption.interface';
import { ColumnPickerExtension } from '../columnPickerExtension';
import { ExtensionUtility } from '../extensionUtility';
import { SharedService } from '../../services/shared.service';
import { Column } from '../../models';

declare const Slick: any;

const gridStub = {
  getOptions: jest.fn(),
  registerPlugin: jest.fn(),
};

const mockAddon = jest.fn().mockImplementation(() => ({
  init: jest.fn(),
  destroy: jest.fn(),
  updateAllTitles: jest.fn(),
  onColumnsChanged: new Slick.Event(),
}));

jest.mock('slickgrid/controls/slick.columnpicker', () => mockAddon);
Slick.Controls = {
  ColumnPicker: mockAddon
};

describe('columnPickerExtension', () => {
  const columnsMock: Column[] = [{ id: 'field1', field: 'field1', width: 100, nameKey: 'TITLE' }, { id: 'field2', field: 'field2', width: 75 }];
  let extensionUtility: ExtensionUtility;
  let i18n: I18N;
  let extension: ColumnPickerExtension;
  let sharedService: SharedService;

  const gridOptionsMock = {
    enableColumnPicker: true,
    enableTranslate: true,
    columnPicker: {
      hideForceFitButton: false,
      hideSyncResizeButton: true,
      onExtensionRegistered: jest.fn(),
      onColumnsChanged: () => { }
    },
  } as GridOption;

  beforeEach(() => {
    sharedService = new SharedService();
    i18n = new I18N(new EventAggregator(), new BindingSignaler());
    extensionUtility = new ExtensionUtility(i18n, sharedService);
    extension = new ColumnPickerExtension(extensionUtility, sharedService);
    i18n.setup({
      resources: {
        en: {
          translation: {
            TITLE: 'Title', COMMANDS: 'Commands', COLUMNS: 'Columns', FORCE_FIT_COLUMNS: 'Force fit columns', SYNCHRONOUS_RESIZE: 'Synchronous resize'
          }
        },
        fr: {
          translation: {
            TITLE: 'Titre', COMMANDS: 'Commandes', COLUMNS: 'Colonnes', FORCE_FIT_COLUMNS: 'Ajustement forcé des colonnes', SYNCHRONOUS_RESIZE: 'Redimension synchrone'
          }
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      debug: false
    });
    i18n.setLocale('fr');
  });

  it('should return null when either the grid object or the grid options is missing', () => {
    const output = extension.register();
    expect(output).toBeNull();
  });

  describe('registered addon', () => {
    beforeEach(() => {
      jest.spyOn(SharedService.prototype, 'grid', 'get').mockReturnValue(gridStub);
      jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);
      jest.spyOn(SharedService.prototype, 'allColumns', 'get').mockReturnValue(columnsMock);
      jest.spyOn(SharedService.prototype, 'visibleColumns', 'get').mockReturnValue(columnsMock.slice(0, 1));
      jest.spyOn(SharedService.prototype, 'columnDefinitions', 'get').mockReturnValue(columnsMock);
    });

    it('should register the addon', () => {
      const onRegisteredSpy = jest.spyOn(SharedService.prototype.gridOptions.columnPicker, 'onExtensionRegistered');
      const instance = extension.register();
      const addonInstance = extension.getAddonInstance();

      expect(instance).toBeTruthy();
      expect(instance).toEqual(addonInstance);
      expect(onRegisteredSpy).toHaveBeenCalledWith(instance);
      expect(mockAddon).toHaveBeenCalledWith(columnsMock, gridStub, gridOptionsMock);
    });

    it('should call internal event handler subscribe and expect the "onColumnSpy" option to be called when addon notify is called', () => {
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
      const onColumnSpy = jest.spyOn(SharedService.prototype.gridOptions.columnPicker, 'onColumnsChanged');
      const visibleColsSpy = jest.spyOn(SharedService.prototype, 'visibleColumns', 'set');

      const instance = extension.register();
      instance.onColumnsChanged.notify({ columns: columnsMock.slice(0, 1), grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalledTimes(1);
      expect(handlerSpy).toHaveBeenCalledWith(
        { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
        expect.anything()
      );
      expect(onColumnSpy).toHaveBeenCalledWith(expect.anything(), { columns: columnsMock.slice(0, 1), grid: gridStub });
      expect(visibleColsSpy).not.toHaveBeenCalled();
    });

    it(`should call internal event handler subscribe and expect the "onColumnSpy" option to be called when addon notify is called
    and it should override "visibleColumns" when array passed as arguments is bigger than previous visible columns`, () => {
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
      const onColumnSpy = jest.spyOn(SharedService.prototype.gridOptions.columnPicker, 'onColumnsChanged');
      const visibleColsSpy = jest.spyOn(SharedService.prototype, 'visibleColumns', 'set');

      const instance = extension.register();
      instance.onColumnsChanged.notify({ columns: columnsMock, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalledTimes(1);
      expect(handlerSpy).toHaveBeenCalledWith(
        { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
        expect.anything()
      );
      expect(onColumnSpy).toHaveBeenCalledWith(expect.anything(), { columns: columnsMock, grid: gridStub });
      expect(visibleColsSpy).toHaveBeenCalledWith(columnsMock);
    });

    it('should dispose of the addon', () => {
      const instance = extension.register();
      const destroySpy = jest.spyOn(instance, 'destroy');

      extension.dispose();

      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('translateColumnPicker method', () => {
    it('should translate the column picker header titles', () => {
      const utilitySpy = jest.spyOn(extensionUtility, 'getPickerTitleOutputString');
      const translateSpy = jest.spyOn(extensionUtility, 'translateItems');

      const instance = extension.register();
      extension.translateColumnPicker();
      const updateColsSpy = jest.spyOn(instance, 'updateAllTitles');

      expect(utilitySpy).toHaveBeenCalled();
      expect(translateSpy).toHaveBeenCalled();
      expect(updateColsSpy).toHaveBeenCalledWith(SharedService.prototype.gridOptions.columnPicker);
      expect(SharedService.prototype.gridOptions.columnPicker.columnTitle).toBe('Colonnes');
      expect(SharedService.prototype.gridOptions.columnPicker.forceFitTitle).toBe('Ajustement forcé des colonnes');
      expect(SharedService.prototype.gridOptions.columnPicker.syncResizeTitle).toBe('Redimension synchrone');
      expect(columnsMock).toEqual([
        { id: 'field1', field: 'field1', width: 100, name: 'Titre', nameKey: 'TITLE' },
        { id: 'field2', field: 'field2', width: 75 }
      ]);
    });
  });
});
