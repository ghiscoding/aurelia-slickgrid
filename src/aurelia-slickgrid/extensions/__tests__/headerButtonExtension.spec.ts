import { I18N } from 'aurelia-i18n';
import { GridOption } from '../../models/gridOption.interface';
import { HeaderButtonExtension } from '../headerButtonExtension';
import { ExtensionUtility } from '../extensionUtility';
import { SharedService } from '../../services/shared.service';
import { HeaderButton, HeaderButtonOnCommandArgs } from '../../models';

declare const Slick: any;

const gridStub = {
  getOptions: jest.fn(),
  registerPlugin: jest.fn(),
};

const mockAddon = jest.fn().mockImplementation(() => ({
  onCommand: new Slick.Event(),
  init: jest.fn(),
  destroy: jest.fn()
}));

jest.mock('slickgrid/plugins/slick.headerbuttons', () => mockAddon);
Slick.Plugins = {
  HeaderButtons: mockAddon
};

describe('headerButtonExtension', () => {
  let extension: HeaderButtonExtension;
  let extensionUtility: ExtensionUtility;
  let sharedService: SharedService;
  const mockOnCommandArgs = {
    button: {
      command: 'toggle-highlight',
      cssClass: 'fa fa-circle red',
      tooltip: 'Remove highlight.',
    },
    column: { id: 'field1', field: 'field1' },
    command: 'toggle-highlight',
    grid: gridStub
  } as HeaderButtonOnCommandArgs;
  const mockEventCallback = () => { };
  const gridOptionsMock = {
    enableHeaderButton: true,
    headerButton: {
      onExtensionRegistered: jest.fn(),
      onCommand: mockEventCallback
    }
  } as GridOption;

  beforeEach(() => {
    sharedService = new SharedService();
    extensionUtility = new ExtensionUtility({ tr: jest.fn() } as unknown as I18N, sharedService);
    extension = new HeaderButtonExtension(extensionUtility, sharedService);
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

      const instance = extension.register();
      const addonInstance = extension.getAddonInstance();

      expect(instance).toBeTruthy();
      expect(instance).toEqual(addonInstance);
      expect(mockAddon).toHaveBeenCalledWith({
        onCommand: expect.anything(),
        onExtensionRegistered: expect.anything(),
      });
      expect(pluginSpy).toHaveBeenCalledWith(instance);
    });

    it('should call internal event handler subscribe and expect the "onCommand" option to be called when addon notify is called', () => {
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
      const onCopySpy = jest.spyOn(SharedService.prototype.gridOptions.headerButton as HeaderButton, 'onCommand');
      const instance = extension.register();
      instance.onCommand.notify(mockOnCommandArgs, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalledWith(
        { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
        expect.anything()
      );
      expect(onCopySpy).toHaveBeenCalledWith(expect.anything(), mockOnCommandArgs);
    });

    it('should dispose of the addon', () => {
      const instance = extension.register();
      const destroySpy = jest.spyOn(instance, 'destroy');

      extension.dispose();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
