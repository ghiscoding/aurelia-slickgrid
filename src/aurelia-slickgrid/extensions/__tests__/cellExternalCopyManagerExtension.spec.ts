import { I18N } from 'aurelia-i18n';
import { GridOption } from '../../models/gridOption.interface';
import { CellExternalCopyManagerExtension } from '../cellExternalCopyManagerExtension';
import { ExtensionUtility } from '../extensionUtility';
import { SharedService } from '../../services/shared.service';

declare var Slick: any;

const gridStub = {
  getOptions: jest.fn(),
  registerPlugin: jest.fn(),
  setSelectionModel: jest.fn(),
};

const mockCore = jest.fn().mockImplementation(() => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  unsubscribeAll: jest.fn(),
}));
const mockAddon = jest.fn().mockImplementation(() => ({
  init: jest.fn(),
  destroy: jest.fn(),
  onCopyCells: jest.fn(),
  onCopyCancelled: jest.fn(),
  onPasteCells: jest.fn(),
}));
const mockSelectionModel = jest.fn().mockImplementation(() => ({
  init: jest.fn(),
  destroy: jest.fn()
}));

jest.mock('slickgrid/slick.core', () => mockCore);
Slick.EventHandler = mockCore;

jest.mock('slickgrid/plugins/slick.cellexternalcopymanager', () => mockAddon);
Slick.CellExternalCopyManager = mockAddon;

jest.mock('slickgrid/plugins/slick.cellselectionmodel', () => mockSelectionModel);
Slick.CellSelectionModel = mockSelectionModel;

describe('cellExternalCopyManagerExtension', () => {
  let extension: CellExternalCopyManagerExtension;
  let extensionUtility: ExtensionUtility;
  let sharedService: SharedService;
  const gridOptionsMock = {
    enableCheckboxSelector: true,
    excelCopyBufferOptions: {
      onExtensionRegistered: jest.fn(),
      onCopyCells: jest.fn(),
      onCopyCancelled: jest.fn(),
      onPasteCells: jest.fn(),
    }
  } as GridOption;

  beforeEach(() => {
    extensionUtility = new ExtensionUtility({} as I18N, sharedService);
    sharedService = new SharedService();
    extension = new CellExternalCopyManagerExtension(extensionUtility, sharedService);
  });

  it('should return null when either the grid object or the grid options is missing', () => {
    const output = extension.register();
    expect(output).toBeNull();
  });

  describe('registered addon', () => {
    beforeEach(() => {
      jest.spyOn(SharedService.prototype, 'grid', 'get').mockReturnValue(gridStub);
      jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);
    });

    it('should register the addon', () => {
      const pluginSpy = jest.spyOn(SharedService.prototype.grid, 'registerPlugin');
      const optionSpy = jest.spyOn(SharedService.prototype.gridOptions.excelCopyBufferOptions, 'onExtensionRegistered');

      const instance = extension.register();

      expect(optionSpy).toHaveBeenCalledWith(instance);
      expect(pluginSpy).toHaveBeenCalledWith(instance);
      expect(mockSelectionModel).toHaveBeenCalled();
      expect(mockAddon).toHaveBeenCalledWith({
        clipboardCommandHandler: expect.anything(),
        dataItemColumnValueExtractor: expect.anything(),
        newRowCreator: expect.anything(),
        includeHeaderWhenCopying: false,
        readOnlyMode: false,
        onCopyCancelled: expect.anything(),
        onCopyCells: expect.anything(),
        onExtensionRegistered: expect.anything(),
        onPasteCells: expect.anything(),
      });
    });

    xit('should call internal event handler subscribe and expect the "onCopyCells" option to be called', () => {
      const instance = extension.register();

      expect(mockCore).toHaveBeenCalledWith({})
    });

    it('should dispose of the addon', () => {
      const instance = extension.register();
      const destroySpy = jest.spyOn(instance, 'destroy');

      extension.dispose();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
