import { ExtensionService, SharedService } from '..';
import { Column, GridOption } from '../../models';

jest.mock('flatpickr', () => { });

const dataviewStub = {
  onRowCountChanged: jest.fn(),
  onRowsChanged: jest.fn(),
};

const gridStub = {
  autosizeColumns: jest.fn(),
  getColumnIndex: jest.fn(),
  getOptions: jest.fn(),
  getColumns: jest.fn(),
  setColumns: jest.fn(),
  onColumnsReordered: jest.fn(),
  onColumnsResized: jest.fn(),
  registerPlugin: jest.fn(),
};

describe('Shared Service', () => {
  let mockColumns: Column[];
  let mockGridOptions: GridOption;
  let service: SharedService;

  beforeEach(() => {
    mockColumns = [{ id: 'field1', field: 'field1', width: 100 }, { id: 'field2', field: 'field2', width: 100 }];
    mockGridOptions = { enableAutoResize: true };
    service = new SharedService();
  });

  it('should call "allColumns" GETTER and return all columns', () => {
    const spy = jest.spyOn(service, 'allColumns', 'get').mockReturnValue(mockColumns);

    const columns = service.allColumns;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(mockColumns);
  });

  it('should call "allColumns" SETTER and expect GETTER to return the same', () => {
    const spy = jest.spyOn(service, 'allColumns', 'set');

    service.allColumns = mockColumns;
    const columns = service.allColumns;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(mockColumns);
  });

  it('should call "columnDefinitions" GETTER and expect columns array to be empty when Grid object does not exist', () => {
    const columns = service.columnDefinitions;
    expect(columns).toEqual([]);
  });

  it('should call "columnDefinitions" GETTER and expect columns array returned', () => {
    const columnSpy = jest.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);

    service.grid = gridStub;
    const columns = service.columnDefinitions;

    expect(columnSpy).toHaveBeenCalled();
    expect(columns).toEqual(mockColumns);
  });

  it('should call "dataView" GETTER and return all columns', () => {
    const spy = jest.spyOn(service, 'dataView', 'get').mockReturnValue(dataviewStub);

    const columns = service.dataView;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(dataviewStub);
  });

  it('should call "dataView" SETTER and expect GETTER to return the same', () => {
    const spy = jest.spyOn(service, 'dataView', 'set');

    service.dataView = dataviewStub;
    const columns = service.dataView;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(dataviewStub);
  });

  it('should call "grid" GETTER and return all columns', () => {
    const spy = jest.spyOn(service, 'grid', 'get').mockReturnValue(gridStub);

    const columns = service.grid;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(gridStub);
  });

  it('should call "grid" SETTER and expect GETTER to return the same', () => {
    const spy = jest.spyOn(service, 'grid', 'set');

    service.grid = gridStub;
    const columns = service.grid;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(gridStub);
  });

  it('should call "gridOptions" GETTER and expect options to return empty object when Grid object does not exist', () => {
    const options = service.gridOptions;
    expect(options).toEqual({});
  });

  it('should call "gridOptions" GETTER and return all options', () => {
    const spy = jest.spyOn(service, 'gridOptions', 'get').mockReturnValue(mockGridOptions);

    const options = service.gridOptions;

    expect(spy).toHaveBeenCalled();
    expect(options).toEqual(mockGridOptions);
  });

  it('should call "gridOptions" GETTER and expect options array returned', () => {
    const spy = jest.spyOn(gridStub, 'getOptions').mockReturnValue(mockGridOptions);

    service.grid = gridStub;
    const options = service.gridOptions;

    expect(spy).toHaveBeenCalled();
    expect(options).toEqual(mockGridOptions);
  });

  it('should call "groupItemMetadataProvider" GETTER and return all columns', () => {
    const spy = jest.spyOn(service, 'groupItemMetadataProvider', 'get').mockReturnValue(mockColumns);

    const columns = service.groupItemMetadataProvider;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(mockColumns);
  });

  it('should call "groupItemMetadataProvider" SETTER and expect GETTER to return the same', () => {
    const spy = jest.spyOn(service, 'groupItemMetadataProvider', 'set');

    service.groupItemMetadataProvider = mockColumns;
    const columns = service.groupItemMetadataProvider;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(mockColumns);
  });

  it('should call "visibleColumns" GETTER and return all columns', () => {
    const spy = jest.spyOn(service, 'visibleColumns', 'get').mockReturnValue(mockColumns);

    const columns = service.visibleColumns;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(mockColumns);
  });

  it('should call "visibleColumns" SETTER and expect GETTER to return the same', () => {
    const spy = jest.spyOn(service, 'visibleColumns', 'set');

    service.visibleColumns = mockColumns;
    const columns = service.visibleColumns;

    expect(spy).toHaveBeenCalled();
    expect(columns).toEqual(mockColumns);
  });
});
