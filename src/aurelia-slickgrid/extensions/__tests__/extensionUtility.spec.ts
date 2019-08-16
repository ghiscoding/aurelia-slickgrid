import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';
import { GridOption } from '../../models/gridOption.interface';
import { ExtensionUtility } from '../extensionUtility';
import { SharedService } from '../../services/shared.service';
import { ExtensionName } from '../../models';

declare var Slick: any;

const mockAddon = jest.fn().mockImplementation(() => ({
  init: jest.fn(),
  destroy: jest.fn()
}));

jest.mock('slickgrid/slick.groupitemmetadataprovider', () => mockAddon);
Slick.Data = {
  GroupItemMetadataProvider: mockAddon
};

describe('extensionUtility', () => {
  let i18n: I18N;
  let sharedService: SharedService;
  let utility: ExtensionUtility;

  describe('with I18N Service', () => {
    beforeEach(async () => {
      sharedService = new SharedService();
      i18n = new I18N(new EventAggregator(), new BindingSignaler());
      utility = new ExtensionUtility(i18n, sharedService);
      i18n.setup({
        resources: { en: { translation: { TITLE: 'Title' } }, fr: { translation: { TITLE: 'Titre' } } },
        lng: 'en',
        fallbackLng: 'en',
        debug: false
      });
      await i18n.setLocale('fr');
    });

    describe('arrayRemoveItemByIndex method', () => {
      it('should remove an item from the array', () => {
        const input = [{ field: 'field1', name: 'Field 1' }, { field: 'field2', name: 'Field 2' }, { field: 'field3', name: 'Field 3' }];
        const expected = [{ field: 'field1', name: 'Field 1' }, { field: 'field3', name: 'Field 3' }];

        const output = utility.arrayRemoveItemByIndex(input, 1);
        expect(output).toEqual(expected);
      });
    });

    describe('loadExtensionDynamically method', () => {
      // we can test only the GroupItemMetadataProvider which is not tested in any other extension test
      it('should check that groupItemMetaProvider gets loaded', () => {
        utility.loadExtensionDynamically(ExtensionName.groupItemMetaProvider);
        const groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
        expect(mockAddon).toHaveBeenCalled();
        expect(groupItemMetadataProvider).not.toBeNull();
      });
    });

    describe('getPickerTitleOutputString method', () => {
      it('should translate titleKey when there is one', () => {
        const gridOptionsMock = { enableTranslate: true, enableGridMenu: true, gridMenu: { hideForceFitButton: false, hideSyncResizeButton: true, columnTitleKey: 'TITLE' } } as GridOption;
        jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);

        const output = utility.getPickerTitleOutputString('columnTitle', 'gridMenu');

        expect(output).toEqual('Titre');
      });

      it('should return undefined when the given property is not found', () => {
        const gridOptionsMock = { enableTranslate: true, enableGridMenu: true, gridMenu: { hideForceFitButton: false, hideSyncResizeButton: true } } as GridOption;
        jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);

        const output = utility.getPickerTitleOutputString('unknown', 'gridMenu');

        expect(output).toEqual(undefined);
      });
    });

    describe('sortItems method', () => {
      it('should sort the items by their order property', () => {
        const inputArray = [{ field: 'field1', order: 3 }, { field: 'field2', order: 1 }, { field: 'field3', order: 2 }];
        const expectedArray = [{ field: 'field2', order: 1 }, { field: 'field3', order: 2 }, { field: 'field1', order: 3 }];

        utility.sortItems(inputArray, 'order');

        expect(inputArray).toEqual(expectedArray);
      });

      it('should sort the items by their order property when found and then return the object without the property', () => {
        const inputArray = [{ field: 'field1', order: 3 }, { field: 'field3', order: 2 }, { field: 'field2' }];
        const expectedArray = [{ field: 'field3', order: 2 }, { field: 'field1', order: 3 }, { field: 'field2' }];

        utility.sortItems(inputArray, 'order');

        expect(inputArray).toEqual(expectedArray);
      });
    });
  });

  describe('without I18N Service', () => {
    beforeEach(() => {
      i18n = null;
      utility = new ExtensionUtility(i18n, sharedService);
    });

    it('should throw an error if "enableTranslate" is set but the I18N Service is null', () => {
      const gridOptionsMock = { enableTranslate: true, enableGridMenu: true, gridMenu: { hideForceFitButton: false, hideSyncResizeButton: true, columnTitleKey: 'TITLE' } } as GridOption;
      jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);

      expect(() => utility.getPickerTitleOutputString('columnTitle', 'gridMenu')).toThrowError('[Aurelia-Slickgrid] requires "I18N" to be installed and configured');
    });
  });
});
