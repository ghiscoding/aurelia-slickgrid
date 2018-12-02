import 'slickgrid/lib/jquery.jsonp-2.4.min';
import 'slickgrid/slick.remotemodel'; // SlickGrid Remote Plugin
import { bindable, bindingMode } from 'aurelia-framework';
import { AureliaGridInstance, Column, Formatter, GridOption } from '../../aurelia-slickgrid';

declare var Slick: any;

const brandFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  return dataContext && dataContext.brand && dataContext.brand.name || '';
};

const mpnFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  let link = '';
  if (dataContext && dataContext.octopart_url && dataContext.mpn) {
    link = `<a href="${dataContext.octopart_url}" target="_blank">${dataContext.mpn}</a>`;
  }
  return link;
};

export class Example17 {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) search = 'switch';
  private _eventHandler: any = new Slick.EventHandler();

  title = 'Example 17: Octopart Catalog Search - Remote Model Plugin';
  subTitle = `
    This example demonstrates how to use "slick.remotemodel.js" or any Remote implementation through an external Remote Service
    <ul>
      <li>If the demo throws some errors, try again later (there's a limit per day)</li>
      <li>
        Uses <a href="https://github.com/6pac/SlickGrid/blob/master/slick.remotemodel.js" target="_blank">slick.remotemodel.js</a>
        which is hooked up to load search results from Octopart, but can easily be extended
        to support any JSONP-compatible backend that accepts paging parameters.
      </li>
    </ul>
  `;
  aureliaGrid: AureliaGridInstance;
  columnDefinitions: Column[];
  customDataView: any;
  dataset = [];
  gridObj: any;
  gridOptions: GridOption;
  loaderDataView: any;
  loading = false; // spinner when loading data

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.loaderDataView = new Slick.Data.RemoteModel();
    this.customDataView = this.loaderDataView && this.loaderDataView.data;
  }

  attached() {
    this.hookAllLoaderEvents();
    this.loaderDataView.setSearch(this.search);
  }

  detached() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();
  }

  aureliaGridReady(aureliaGrid: any) {
    this.aureliaGrid = aureliaGrid;
    this.gridObj = aureliaGrid.slickGrid; // grid object
    this.loaderDataView.setSort('score', -1);
    this.gridObj.setSortColumn('score', false);

    // notify of a change to preload the first page
    this.gridObj.onViewportChanged.notify();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'mpn', name: 'MPN', field: 'mpn', formatter: mpnFormatter, width: 100, sortable: true },
      { id: 'brand', name: 'Brand', field: 'brand.name', formatter: brandFormatter, width: 100, sortable: true },
      { id: 'short_description', name: 'Description', field: 'short_description', width: 520 },
    ];

    this.gridOptions = {
      enableAutoResize: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableCellNavigation: true,
      enableColumnReorder: false,
      enableGridMenu: false,
      multiColumnSort: false
    };
  }

  hookAllLoaderEvents() {
    if (this._eventHandler && this._eventHandler.subscribe && this.loaderDataView && this.loaderDataView.onDataLoading && this.loaderDataView.onDataLoaded) {
      this._eventHandler.subscribe(this.loaderDataView.onDataLoading, (e: Event, args: any) => {
        this.loading = true;
      });

      this._eventHandler.subscribe(this.loaderDataView.onDataLoaded, (e: Event, args: any) => {
        if (args && this.gridObj && this.gridObj.invalidateRow && this.gridObj.updateRowCount && this.gridObj.render) {
          for (let i = args.from; i <= args.to; i++) {
            this.gridObj.invalidateRow(i);
          }
          this.gridObj.updateRowCount();
          this.gridObj.render();
          this.loading = false;
        }
      });
    }
  }

  searchChanged(newValue: string) {
    if (newValue && this.gridObj && this.gridObj.getViewport && this.loaderDataView && this.loaderDataView.ensureData && this.loaderDataView.setSearch) {
      const vp = this.gridObj.getViewport();
      this.loaderDataView.setSearch(newValue);
      this.loaderDataView.ensureData(vp.top, vp.bottom);
    }
  }

  onSort(e, args) {
    if (this.gridObj && this.gridObj.getViewport && this.loaderDataView && this.loaderDataView.ensureData && this.loaderDataView.setSort) {
      const vp = this.gridObj.getViewport();
      if (args && args.sortCol && args.sortCol.field) {
        this.loaderDataView.setSort(args.sortCol.field, args.sortAsc ? 1 : -1);
      }
      this.loaderDataView.ensureData(vp.top, vp.bottom);
    }
  }

  onViewportChanged(e, args) {
    if (this.gridObj && this.gridObj.getViewport && this.loaderDataView && this.loaderDataView.ensureData) {
      const vp = this.gridObj.getViewport();
      this.loaderDataView.ensureData(vp.top, vp.bottom);
    }
  }
}
