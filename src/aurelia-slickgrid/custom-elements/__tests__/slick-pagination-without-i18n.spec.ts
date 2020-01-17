import { bootstrap } from 'aurelia-bootstrapper';
import { EventAggregator } from 'aurelia-event-aggregator';
import { StageComponent } from 'aurelia-testing';
import { PLATFORM } from 'aurelia-pal';

import { Column, GridOption, Pager, Locale } from '../../models';
import { PaginationService, SharedService } from '../../services';

function removeExtraSpaces(textS: string) {
  return `${textS}`.replace(/\s{2,}/g, '');
}

const dataviewStub = {
  onPagingInfoChanged: jest.fn(),
  onRowCountChanged: jest.fn(),
  onRowsChanged: jest.fn(),
};

const mockBackendService = {
  resetPaginationOptions: jest.fn(),
  buildQuery: jest.fn(),
  updateOptions: jest.fn(),
  processOnFilterChanged: jest.fn(),
  processOnSortChanged: jest.fn(),
  processOnPaginationChanged: jest.fn(),
};

const mockGridOption = {
  enableAutoResize: true,
  backendServiceApi: {
    service: mockBackendService,
    process: jest.fn(),
    options: {
      columnDefinitions: [{ id: 'name', field: 'name' }] as Column[],
      datasetName: 'user',
    }
  },
  enablePagination: true,
  pagination: {
    pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
    pageSize: 25,
    totalItems: 85
  }
} as GridOption;

const gridStub = {
  autosizeColumns: jest.fn(),
  getColumnIndex: jest.fn(),
  getOptions: () => mockGridOption,
  getColumns: jest.fn(),
  setColumns: jest.fn(),
  onColumnsReordered: jest.fn(),
  onColumnsResized: jest.fn(),
  registerPlugin: jest.fn(),
};

const paginationServiceStub = {
  goToFirstPage: jest.fn(),
  goToLastPage: jest.fn(),
  goToNextPage: jest.fn(),
  goToPreviousPage: jest.fn(),
  goToPageNumber: jest.fn(),
  changeItemPerPage: jest.fn(),
  dispose: jest.fn(),
  init: jest.fn(),
} as unknown as PaginationService;

describe('Slick-Pagination Component without I18N', () => {
  let component;
  let mockPager: Pager;
  let ea: EventAggregator;
  let sharedService: SharedService;

  const view = `<slick-pagination id="slickPagingContainer-grid1"
  dataview.bind="dataview"
  grid.bind="grid"
  enable-translate.bind="enableTranslate"
  options.bind="paginationOptions"
  locales.bind="locales"
  total-items.bind="totalItems"
  backend-service-api.bind="backendServiceApi"
  grid-pagination-options.bind="gridPaginationOptions">
</slick-pagination>`;

  beforeEach(() => {
    ea = new EventAggregator();
    sharedService = new SharedService();
    mockPager = {
      from: 5,
      to: 10,
      itemsPerPage: 5,
      pageCount: 1,
      pageNumber: 2,
      availablePageSizes: [5, 10, 15, 20],
      totalItems: 100,
    };

    component = StageComponent
      .withResources([
        PLATFORM.moduleName('../slick-pagination'),
        PLATFORM.moduleName('../../value-converters/asgNumber')
      ])
      .inView(view)
      .boundTo({
        enableTranslate: true,
        dataview: dataviewStub,
        grid: gridStub,
        backendServiceApi: mockGridOption.backendServiceApi,
        totalItems: 100,
      });

    component.bootstrap((aurelia) => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(EventAggregator, ea);
      aurelia.container.registerInstance(PaginationService, paginationServiceStub);
      aurelia.container.registerInstance(SharedService, sharedService);
    });

    ea.publish(`paginationService:on-pagination-changed`, mockPager);
    ea.publish(`paginationService:on-pagination-refreshed`, true);
  });

  describe('Integration Tests', () => {
    afterEach(() => {
      // clear all the spyOn mocks to not influence next test
      jest.clearAllMocks();
    });

    it('should throw an error when "enableTranslate" is set and I18N Service is not provided', async () => {
      try {
        await component.manuallyHandleLifecycle().create(bootstrap);
        await component.bind({ enableTranslate: true });
        await component.attached();
        await component.detached();
      } catch (e) {
        expect(e.toString()).toContain('[Aurelia-Slickgrid] requires "I18N" to be installed and configured when the grid option "enableTranslate" is enabled.');
      }
    });

    it('should have defined locale and expect new text in the UI', async () => {
      const binding = {
        enableTranslate: false,
        locales: {
          TEXT_ITEMS_PER_PAGE: 'items per page',
          TEXT_ITEMS: 'items',
          TEXT_OF: 'of',
          TEXT_PAGE: 'page'
        } as Locale,
        options: {
          pageNumber: mockPager.pageNumber,
          pageSizes: mockPager.availablePageSizes,
          pageSize: mockPager.itemsPerPage,
          totalItems: mockPager.totalItems,
        },
        paginationOptions: {
          pageNumber: 1,
          pageSizes: [5, 10, 25, 50],
          pageSize: 10,
          totalItems: 100,
        },
        totalItems: 120,
      };

      component.enableTranslate = false;
      await component.manuallyHandleLifecycle().create(bootstrap);
      await component.bind(binding);
      await component.attached();
      await component.unbind();
      const binding2 = { ...binding, totalItems: 120 };
      await component.bind(binding2);
      await component.attached();
      ea.publish(`paginationService:on-pagination-changed`, mockPager);
      ea.publish(`paginationService:on-pagination-refreshed`, true);

      const pageInfoFromTo = await component.waitForElement('.page-info-from-to');
      const pageInfoTotalItems = await component.waitForElement('.page-info-total-items');
      expect(removeExtraSpaces(pageInfoFromTo.innerHTML)).toBe('<span data-test="item-from">5</span>-<span data-test="item-to">10</span>of');
      expect(removeExtraSpaces(pageInfoTotalItems.innerHTML)).toBe('<span data-test="total-items">100</span> items');

      component.dispose();
    });
  });
});
