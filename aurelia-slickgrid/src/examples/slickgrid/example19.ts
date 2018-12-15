import { Subscription } from 'aurelia-event-aggregator';
import {
  autoinject,
  createOverrideContext,
  Container,
  PLATFORM,
  View,
  ViewCompiler,
  ViewResources,
  ViewSlot
} from 'aurelia-framework';
import {
  Column,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  GridStateChange
} from '../../aurelia-slickgrid';

declare var $: any;

export interface CreatedView {
  id: string | number;
  dataContext: any;
  view?: View;
  viewSlot?: ViewSlot;
}

@autoinject()
export class Example19 {
  title = 'Example 19: Row Detail View';
  subTitle = `
    Add functionality to show extra information with a Row Detail View
    <ul>
      <li>Click on the row "+" icon or anywhere on the row to open it (the latter can be changed via property "useRowClick: false")</li>
      <li>Pass any View Template (via an external template file) to the Row Detail</li>
    </ul>
  `;

  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];

  bindingContext: any;
  overrideContext: any;
  detailViewExtension: any;
  slots: CreatedView[] = [];
  subscriptions: Subscription[];

  constructor(
    private container: Container,
    private viewCompiler: ViewCompiler,
    private viewResources: ViewResources,
  ) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  bind(bindingContext, overrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  disposeAllViewSlot() {
    this.slots.forEach((slot) => this.disposeViewSlot(slot));
    this.slots = [];
  }

  disposeViewSlot(expandedView: CreatedView) {
    if (expandedView && expandedView.view && expandedView.viewSlot && expandedView.view.unbind && expandedView.viewSlot.remove) {
      const container = $('#container_' + this.slots[0].id);
      if (container && container.length > 0) {
        expandedView.viewSlot.remove(expandedView.view);
        expandedView.view.unbind();
        container.empty();
        return expandedView;
      }
    }
    return null;
  }

  /** Render (or rerender) the View Slot (Row Detail) */
  renderView(itemDetail: any) {
    const containerElement = $('#container_' + itemDetail.id);
    const viewFactory = this.viewCompiler.compile('<template><compose view-model.bind="template" model.bind="modeling"></compose><template>', this.viewResources);

    if (containerElement.length) {
      // Creates a view
      containerElement.empty();
      const view = viewFactory.create(this.container);
      const viewModel = {
        template: PLATFORM.moduleName('examples/slickgrid/detail-view'),
        model: itemDetail
      };

      view.bind(viewModel, createOverrideContext(viewModel));

      // Add the view to the slot
      const viewSlot = new ViewSlot(containerElement[0], true);
      viewSlot.add(view);

      const slotObj = this.slots.find((obj) => obj.id === itemDetail.id);

      if (slotObj) {
        slotObj.view = view;
        slotObj.viewSlot = viewSlot;
      }
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
      rowSelectionOptions: {
        selectActiveRow: true
      },
      rowDetailView: {
        preTemplate: this.loadingTemplate,
        postTemplate: this.loadView,
        process: (item) => this.simulateServerAsyncCall(item),

        // false by default, clicking anywhere on the row will open the detail view
        // when set to false, only the "+" icon would open the row detail
        // if you use editor or cell navigation you would want this flag set to false (default)
        useRowClick: true,

        // how many grid rows do we want to use for the row detail panel (this is only set once and will be used for all row detail)
        // also note that the detail view adds an extra 1 row for padding purposes
        // so if you choose 4 panelRows, the display will in fact use 5 rows
        panelRows: 7,

        // hook to multiple events of the plugin
        onExtensionRegistered: (extension) => this.detailViewExtension = extension,
        onBeforeRowDetailToggle: (e, args) => this.onBeforeRowDetailToggle(e, args),
        onAfterRowDetailToggle: (e, args) => this.slots.forEach((slot) => this.renderView(slot.dataContext)),
        onRowOutOfViewportRange: (e, args) => console.log('reached out of range', args),
        onRowBackToViewportRange: (e, args) => this.onRowBackToViewportRange(e, args),
        onAsyncEndUpdate: (e, args) => this.renderView(args && args.item), // triggers after backend called "onAsyncResponse.notify()"
      }
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

  loadView(itemDetail: any) {
    return `<div id="container_${itemDetail.id}" class="au-target"></div>`;
  }

  /** Just for demo purposes, we will simulate an async server call and return more details on the selected row item */
  simulateServerAsyncCall(item) {
    // random set of names to use for more item detail
    const randomNames = ['John Doe', 'Jane Doe', 'Chuck Norris', 'Bumblebee', 'Jackie Chan', 'Elvis Presley', 'Bob Marley', 'Mohammed Ali', 'Bruce Lee', 'Rocky Balboa'];

    // fill the template on async delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const itemDetail = item;

        // let's add some property to our item for a better async simulation
        itemDetail.assignee = randomNames[this.randomNumber(0, 10)];
        itemDetail.reporter = randomNames[this.randomNumber(0, 10)];

        // this will notify the Row Detail Plugin of the updated item details
        this.notifyTemplate(itemDetail);

        // resolve the data after delay specified
        resolve(itemDetail);
      }, 1000);
    });
  }

  /**
   * notify the onAsyncResponse with the "args.item" (required property)
   * the plugin will then use item to populate the row detail panel with the "postTemplate"
   * @param item
   */
  notifyTemplate(item) {
    if (this.detailViewExtension) {
      this.detailViewExtension.onAsyncResponse.notify({ item }, undefined, this);
    }
  }

  /** On Column Reordering, we need to redraw the View */
  onColumnsReordered(e, args) {
    this.slots.forEach((slot) => {
      this.redrawView(slot);
    });
  }

  /** on sort, all row detail are collapsed so we can dispose of all the Views as well */
  onSort(e, args) {
    this.disposeAllViewSlot();
  }

  onBeforeRowDetailToggle(e, args) {
    // expanding
    if (args && args.item && args.item.__collapsed) {
      // expanding row detail
      if (args && args.item) {
        const viewInfo: CreatedView = {
          id: args.item.id,
          dataContext: args.item
        };
        this.addToArrayWhenNotFound(this.slots, viewInfo);
      }
    } else {
      // collapsing, so dispose of the View/ViewSlot
      const foundSlotIndex = this.slots.findIndex((slot: CreatedView) => slot.id === args.item.id);
      if (foundSlotIndex >= 0) {
        if (this.disposeViewSlot(this.slots[foundSlotIndex])) {
          this.slots.splice(foundSlotIndex, 1);
        }
      }
    }
  }

  /** When Row comes back to Viewport Range, we need to redraw the View */
  onRowBackToViewportRange(e: Event, args: { grid: any; item: any; rowId: number; rowIndex: number; expandedRows: any[]; rowIdsOutOfViewport: number[]; }) {
    if (args && args.item) {
      this.slots.forEach((slot) => {
        if (slot.id === args.item.id) {
          this.redrawView(slot);
        }
      });
    }
  }

  /** Dispatched event of a Grid State Changed event (which contain a "change" and the "gridState") */
  onGridStateChanged(gridStateChanges: GridStateChange) {
    if (gridStateChanges.change.type === 'filter') {
      this.slots.forEach((slot) => {
        this.redrawView(slot);
      });
    }
  }

  /** Redraw the necessary View Slot */
  redrawView(slot: CreatedView) {
    const containerElement = $('#container_' + slot.id);
    if (containerElement && containerElement.length) {
      this.renderView(slot.dataContext);
    }
  }

  private addToArrayWhenNotFound(inputArray: any[], inputObj: any) {
    const arrayRowIndex = inputArray.findIndex((obj) => obj.id === inputObj.id);
    if (arrayRowIndex < 0) {
      inputArray.push(inputObj);
    }
  }

  private randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
