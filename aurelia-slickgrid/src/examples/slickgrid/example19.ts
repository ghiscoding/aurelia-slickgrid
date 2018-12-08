import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { Column, FieldType, Formatters, GridOption, AureliaGridInstance, Filters, GridStateChange, ExtensionName } from '../../aurelia-slickgrid';
import { autoinject, TemplatingEngine, ViewCompiler, Container, ViewResources, ViewSlot, createOverrideContext, PLATFORM, View } from 'aurelia-framework';

declare var $: any;

export interface CreatedView {
  id: string | number;
  dataContext: any;
  rowIndex: number;
  view?: View;
  viewSlot?: ViewSlot;
}

@autoinject()
export class Example19 {
  title = 'Example 19: Row Detail View';
  subTitle = `
    Add functionality to show extra information with a Row Detail View
  `;

  aureliaGrid: AureliaGridInstance;
  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];
  name = 'John';
  owningElementView: any;
  bindingContext: any;
  overrideContext: any;
  detailView: any;
  subscriptions: Subscription[];
  slots: CreatedView[] = [];
  visibleRenderedCellCount = 0;
  gridRowBuffer = 0;
  isOutOfViewportRange = false;
  outOfViewportRangeRows: number[] = [];

  constructor(
    private ea: EventAggregator,
    private container: Container,
    private viewCompiler: ViewCompiler,
    private viewResources: ViewResources,
  ) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();

    // on browser resize, we need to recalculate visible rendered range
    this.ea.subscribe(`asg:onAfterResize`, () => {
      const renderedRange = this.aureliaGrid.slickGrid.getRenderedRange() || {};
      this.visibleRenderedCellCount = renderedRange.bottom - renderedRange.top - this.gridRowBuffer;
      // console.log('resized new getRenderedRange', renderedRange, this.visibleRenderedCellCount);
    });
  }

  // Custom attribute doesn't have its own view
  // Only the view of the custom element that owns it
  created(owningElementView, thisView) {
    this.owningElementView = owningElementView;
  }

  bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
    this.gridRowBuffer = aureliaGrid && aureliaGrid.slickGrid && aureliaGrid.slickGrid.getOptions().minRowBuffer;
    // const plugin = this.aureliaGrid.pluginService.getExtensionByName(ExtensionName.rowDetailView);
    // this.detailView = plugin && plugin.extension;
    // console.log('plugin', this.detailView);
    console.log(this.gridRowBuffer);
    setTimeout(() => {
      const renderedRange = this.aureliaGrid.slickGrid.getRenderedRange() || {};
      this.visibleRenderedCellCount = renderedRange.bottom - renderedRange.top - this.gridRowBuffer;
      // console.log('getRenderedRange', renderedRange, this.visibleRenderedCellCount);
    }, 100);

    // console.log('detailView', this.detailView);


  }

  disposeAllViewSlot() {
    this.slots.forEach((slot) => this.disposeViewSlot(slot));
    this.slots = [];
    // console.log('disposeAllViewSlot', this.slots)
  }

  disposeViewSlot(expandedView) {
    if (expandedView && expandedView.view && expandedView.viewSlot && expandedView.view.unbind && expandedView.viewSlot.remove) {
      const container = $('#container_' + this.slots[0].id);
      if (container && container.length > 0) {
        expandedView.viewSlot.remove(expandedView.view);
        expandedView.view.unbind();
        container.empty();
        // console.log('properly disposed of the View/ViewSlot');
        return expandedView;
      }
    }
    return null;
  }

  renderView(itemDetail: any, addToSlotArray = true) {
    const containerElement = $('#container_' + itemDetail.id);
    // console.log(`finished ${addToSlotArray ? 'creating' : 're-rendering'} the post async template ${itemDetail.id}`, itemDetail, containerElement);
    const viewFactory = this.viewCompiler.compile('<template><compose view-model.bind="template" model.bind="modeling"></compose><template>', this.viewResources);

    if (containerElement.length) {
      // Creates a view
      containerElement.empty();
      const view = viewFactory.create(this.container);
      // Bind the view and it's children
      // view.bind(this.bindingContext);

      const viewModel = {
        template: PLATFORM.moduleName('examples/slickgrid/detail-view'),
        model: itemDetail
      };

      view.bind(viewModel, createOverrideContext(viewModel));

      const viewSlot = new ViewSlot(containerElement[0], true);

      // Add the view to the slot
      viewSlot.add(view);

      const slotObj = this.slots.find((obj) => obj.id === itemDetail.id);

      if (slotObj) {
        slotObj.view = view;
        slotObj.viewSlot = viewSlot;
      }
      return true;
    } else {
      return false;
    }
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, width: 70, filterable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', formatter: Formatters.decimal, params: { minDecimalPlaces: 1, maxDecimalPlaces: 2 }, sortable: true, type: FieldType.number, minWidth: 90, filterable: true },
      { id: 'percent2', name: '% Complete', field: 'percentComplete2', formatter: Formatters.progressBar, type: FieldType.number, sortable: true, minWidth: 100, filterable: true, filter: { model: Filters.slider, operator: '>' } },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
        minWidth: 100,
        formatter: Formatters.checkmark, type: FieldType.boolean,
        filterable: true, sortable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableFiltering: true,
      enableRowDetailView: true,
      rowDetailView: {
        cssClass: 'detail-view-toggle',
        preTemplate: this.loadingTemplate,
        postTemplate: this.loadView,
        process: (item) => this.simulateServerCall(item),

        // false by default, clicking anywhere on the row will open the detail view
        // else only clicking on the icon would work
        // if you use editor or cell navigation you would want this flag set to false (default)
        useRowClick: true,

        // how many grid rows do we want to use for the detail panel
        // also note that the detail view adds an extra 1 row for padding purposes
        // so if you choose 4 panelRows, the display will in fact use 5 rows
        panelRows: 6,
        keyPrefix: '__',

        onExtensionRegistered: (extension) => {
          this.hookAllEvents(extension);
          console.log('extension', extension);
        }
      },
      rowSelectionOptions: {
        selectActiveRow: true
      },
      enableExcelCopyBuffer: true,
    };
  }

  getData() {
    // mock a dataset
    this.dataset = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      this.dataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: (i % 33 === 0) ? null : Math.random() * 100 + '',
        percentComplete: randomPercent,
        percentComplete2: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }
  }

  loadingTemplate() {
    return `<i class="fa fa-refresh fa-spin fa-2x fa-fw"></i> <h4>Loading...</h4>`;
  }

  loadView(itemDetail) {
    return `<div id="container_${itemDetail.id}" class="au-target"></div>`;
  }

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  simulateServerCall(item) {
    const randomNames = ['John Doe', 'Jane Doe', 'Chuck Norris', 'Bumblebee', 'Jackie Chan', 'Elvis Presley', 'Bob Marley', 'Mohammed Ali', 'Bruce Lee', 'Rocky Balboa'];

    return new Promise((resolve) => {
      // fill the template on delay
      setTimeout(() => {
        // let's add some property to our item for a better simulation
        const itemDetail = item;
        itemDetail.assignee = randomNames[this.randomNumber(0, 10)];
        itemDetail.reporter = randomNames[this.randomNumber(0, 10)];
        this.notifyTemplate(itemDetail);
        resolve(itemDetail);
      }, 1000);
    });
  }

  notifyTemplate(itemDetail) {
    if (this.detailView) {
      // notify the onAsyncResponse with the "args.itemDetail" (required property)
      // the plugin will then use itemDetail to populate the detail panel with "postTemplate"
      this.detailView.onAsyncResponse.notify({
        itemDetail
      }, undefined, this);
    }
  }

  onColumnsReordered(e, args) {
    this.slots.forEach((slot) => {
      slot.rowIndex = null;
      this.redrawView(slot);
    });
  }
  onScroll(e, args) {
    this.calculateOutOfRangeViews();
  }

  onSort(e, args) {
    // on sort, all row detail are collapsed so we can clear the out of view rows
    // this.disposeAllViewSlot();
    // this.outOfViewportRangeRows = [];
    this.slots.forEach((slot) => {
      slot.rowIndex = null;
      this.redrawView(slot);
    });
  }

  hookAllEvents(extension) {
    this.detailView = extension;

    this.detailView.onBeforeRowDetailToggle.subscribe((e, args) => {
      // console.log('before toggling row detail', args.item);
      // console.log(`is ${args.item.__collapsed ? 'expanding' : 'collapsing'}`);

      // expanding
      if (args && args.item && args.item.__collapsed) {
        // console.log('yes we are expanding');
        // expanding row detail
        if (args && args.item) {
          const viewInfo: CreatedView = {
            id: args.item.id,
            dataContext: args.item,
            rowIndex: this.aureliaGrid.dataView.getIdxById(args.item.id)
          };
          this.updateArrayById(this.slots, viewInfo, true);
          // console.log('slots', this.slots)
        }
      } else {
        // collapsing, so dispose of the View/ViewSlot
        // console.log('closing!!!');
        const foundSlotIndex = this.slots.findIndex((slot: CreatedView) => slot.id === args.item.id);
        if (foundSlotIndex >= 0) {
          // console.log('found slot', this.slots[foundSlotIndex])
          if (this.disposeViewSlot(this.slots[foundSlotIndex])) {
            this.slots.splice(foundSlotIndex, 1);
          }
        }
      }
    });

    this.detailView.onAfterRowDetailToggle.subscribe((e, args) => {
      // console.log('after toggling row detail', args.item);
      // this.detailView.collapseAll();
      this.slots.forEach((slot) => {
        this.renderView(slot.dataContext, false);
      });
    });

    this.detailView.onRowOutOfViewportRange.subscribe((e, args) => {
      console.log('reached out of range', args);
    });

    this.detailView.onRowBackToViewportRange.subscribe((e, args) => {
      console.log('back to Viewport range', args);
      this.slots.forEach((slot) => {
        // this.redrawView(slot);
      });
    });

    this.detailView.onAsyncEndUpdate.subscribe((e, args) => {
      this.renderView(args && args.itemDetail, true);
    });
  }

  /** Dispatched event of a Grid State Changed event (which contain a "change" and the "gridState") */
  onGridStateChanged(gridStateChanges: GridStateChange) {
    // console.log('Client sample, Grid State changed:: ', gridStateChanges);
    if (gridStateChanges.change.type === 'filter') {
      this.slots.forEach((slot) => {
        // setTimeout(() => {
        slot.rowIndex = null;
        // this.aureliaGrid.slickGrid.invalidateRows();
        // this.detailView.calculateDetailView(slot.dataContext);
        // this.aureliaGrid.slickGrid.render();

        // this.detailView.onFilter(slot.dataContext);
        this.redrawView(slot);
        // }, 100);
      });
      this.calculateOutOfRangeViews();
    }
  }

  calculateOutOfRangeViews() {
    if (this.aureliaGrid && this.aureliaGrid.slickGrid) {
      const renderedRange = this.aureliaGrid.slickGrid.getRenderedRange();

      this.slots.forEach((slot) => {
        const rowIndex = slot.rowIndex || this.aureliaGrid.dataView.getRowById(slot.id);
        // console.log('rowIndex', rowIndex)
        const isAddingToArray = this.isRowOutOfViewportRange(rowIndex, renderedRange);

        if (!isAddingToArray && this.outOfViewportRangeRows.findIndex((rowIdx) => rowIdx === rowIndex) >= 0) {
          this.redrawView(slot);
          console.log('outOfViewportRangeRows', this.outOfViewportRangeRows);
        } else if (isAddingToArray) {
          this.updateOutOfRangeRows(rowIndex, isAddingToArray);
          console.log('outOfViewportRangeRows', this.outOfViewportRangeRows);
        }

        // console.log('array of out of range', this.outOfViewportRangeRows);
      });
    }
  }

  redrawView(slot) {
    const rowIndex = slot.rowIndex || this.aureliaGrid.dataView.getRowById(slot.id);
    // console.log('redrawView', rowIndex)
    const containerElement = $('#container_' + slot.id);
    if (containerElement && containerElement.length) {
      this.updateOutOfRangeRows(rowIndex, false);
      this.renderView(slot.dataContext, false);
      // console.log('came back to visible range - re-render', rowIndex);
    }
  }

  isRowOutOfViewportRange(rowIndex: number, renderedRange: { top: number, bottom: number }): boolean {
    if (Math.abs(renderedRange.bottom - this.gridRowBuffer - rowIndex) > this.visibleRenderedCellCount * 2) {
      console.log('ts reached out of range', renderedRange.bottom, (renderedRange.bottom - this.gridRowBuffer), this.gridRowBuffer, this.visibleRenderedCellCount);
      return true;
    }
    return false;
  }

  updateOutOfRangeRows(rowIndex, isAdding = false) {
    const arrayRowIndex = this.outOfViewportRangeRows.findIndex((rowIdx) => rowIdx === rowIndex);

    if (isAdding && arrayRowIndex < 0) {
      this.outOfViewportRangeRows.push(rowIndex);
    } else if (!isAdding && arrayRowIndex >= 0) {
      this.outOfViewportRangeRows.splice(arrayRowIndex, 1);
    }
  }

  updateArrayById(inputArray: any[], inputObj: any, isAdding = false) {
    const arrayRowIndex = inputArray.findIndex((obj) => obj.id === inputObj.id);
    if (isAdding && arrayRowIndex < 0) {
      inputArray.push(inputObj);
    } else if (!isAdding && arrayRowIndex >= 0) {
      inputArray.splice(arrayRowIndex, 1);
    }
  }
}
