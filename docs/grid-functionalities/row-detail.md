#### index
- [Usage](#usage)
- [Changing Addon Options Dynamically](#changing-addon-options-dynamically)
- [Calling Addon Methods Dynamically](#calling-addon-methods-dynamically)
- [Row Detail - Preload Component - Loading Spinner](#row-detail---preload-component-loading-spinner)
- [Row Detail - View Component](#row-detail---view-component)
- [Access Parent Component (grid) from the Child Component (row detail)](#access-parent-component-grid-from-the-child-component-row-detail)
- Troubleshooting
  - [Adding a Column dynamically is removing the Row Selection, why is that?](#adding-a-column-dynamically-is-removing-the-row-selection-why-is-that)

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example19) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example19.ts)

### Description
A Row Detail allows you to open a detail panel which can contain extra and/or more detailed information about a row. For example, we have a user list but we want to display detailed information about this user (his full address, account info, last purchasers, ...) but these are extra details that we don't want to display this in the user grid (for performance and real estate reasons)... so a Row Detail is perfect for that use case.

> **NOTE** Please note that because of the complexity behind Row Detail, the following features cannot be mixed with Row Detail because they will cause UI problems
> - Grouping
> - Pagination
> - Tree Data
> - RowSpan

> **NOTE 2** Also please note that because SlickGrid is using its built-in Virtual Scroll feature by default (for perf reasons), this will call render and re-render multiple times and that happens whenever the Row Detail gets out of the grid viewport.
> For this reason, you should avoid using dynamic elements (i.e. form inputs) because whenever a re-render kicks in, it will reset and re-render these elements as if nothing happened.
> So you should consider using Row Detail mainly for showing static data (hence where its name comes from "Row Detail" to show more detailed info) and even though it works with dynamic elements, you have to know its limitation.

## Usage

##### View
```html
<aurelia-slickgrid
    grid-id="gridId"
    column-definitions.bind="columnDefs"
    grid-options.bind="gridOptions"
    dataset.bind="myDataset"
    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
```

##### Component
```ts
import { AureliaGridInstance, GridState } from 'aurelia-slickgrid';

export class GridExample {
  aureliaGrid: AureliaGridInstance;

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  attached() {
    this.defineGrid();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [ /*...*/ ];

    this.gridOptions = {
      enableRowDetailView: true,
      rowSelectionOptions: {
        selectActiveRow: true
      },
      rowDetailView: {
        // We can load the "process" asynchronously in 3 different ways (aurelia-http-client, aurelia-fetch-client OR even Promise)
        process: (item) => this.http.get(`api/item/${item.id}`),

        // load only once and reuse the same item detail without calling process method
        loadOnce: true,

        // limit expanded row to only 1 at a time
        singleRowExpand: false,

        // false by default, clicking anywhere on the row will open the detail view
        // when set to false, only the "+" icon would open the row detail
        // if you use editor or cell navigation you would want this flag set to false (default)
        useRowClick: true,

        // how many grid rows do we want to use for the row detail panel (this is only set once and will be used for all row detail)
        // also note that the detail view adds an extra 1 row for padding purposes
        // so if you choose 4 panelRows, the display will in fact use 5 rows
        panelRows: this.detailViewRowCount,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // expandableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1),

        // Preload View Template
        preloadView: PLATFORM.moduleName('examples/preload.html'),

        // ViewModel Template to load when row detail data is ready
        viewModel: PLATFORM.moduleName('examples/detail-view'),

        // Optionally pass your Parent Component reference to your Child Component (row detail component)
        parent: this
      }
    };
  }
}
```

### Changing Addon Options Dynamically
Row Detail is an addon (commonly known as a plugin and are opt-in addon), because this is not built-in SlickGrid and instead are opt-in, we need to get the instance of that addon object. Once we have the instance, we can use `getOptions` and `setOptions` to get/set any of the addon options, adding `rowDetail` with intellisense should give you this info.

#### Examples
- Dynamically change the Detail View Row Count (how many grid rows do we want to use for the row detail panel)
```ts
changeDetailViewRowCount() {
  if (this.aureliaGrid?.extensionService) {
    const rowDetailInstance = this.aureliaGrid.extensionService.getExtensionInstanceByName(ExtensionName.rowDetailView);
    const options = rowDetailInstance.getOptions();
    options.panelRows = this.detailViewRowCount; // change number of rows dynamically
    rowDetailInstance.setOptions(options);
  }
}
```

### Calling Addon Methods Dynamically
Same as previous paragraph, after we get the SlickGrid addon instance, we can call any of the addon methods, adding `rowDetail` with intellisense should give you this info.

#### Examples
- Dynamically close all Row Detail Panels
```ts
closeAllRowDetail() {
  if (this.aureliaGrid && this.aureliaGrid.extensionService) {
    const rowDetailInstance = this.aureliaGrid.extensionService.getExtensionInstanceByName(ExtensionName.rowDetailView);
    rowDetailInstance.collapseAll();
  }
}
```
- Dynamically close a single Row Detail by it's grid index
This requires a bit more work, you can call the method `collapseDetailView(item)` but it requires to pass the row item object (data context) and it feasible but it's just more work as can be seen below.
```ts
closeRowDetail(gridRowIndex: number) {
  if (this.aureliaGrid && this.aureliaGrid.extensionService) {
    const rowDetailInstance = this.aureliaGrid.extensionService.getExtensionInstanceByName(ExtensionName.rowDetailView);
    const item = this.aureliaGrid.gridService.getDataItemByRowIndex(gridRowIndex);
    rowDetailInstance.collapseDetailView(item);
  }
}
```

### Row Detail - Preload Component (loading spinner)
Most of the time we would get data asynchronously, during that time we can show a loading spinner to the user via the `preloadComponent` grid option.

###### View (`preload.html`)
```html
<template>
  <h4><i class="mdi mdi-sync mdi-spin-1s mdi-50px"></i>Loading...</h4>
</template>
```

###### Component
```ts
    this.gridOptions = {
      enableRowDetailView: true,
      rowDetailView: {
        //  ... row detail options

        // Preload View Component
        preloadComponent: RowDetailPreloadComponent,
      }
    };
```

### Row Detail - ViewModel
Same concept as the preload, we pass an Aurelia ViewModel to the `viewModel` that will be used to render our Row Detail.

###### Grid Component
```ts
    this.gridOptions = {
      enableRowDetailView: true,
      rowDetailView: {
        //  ... row detail options

        // View Component to load when row detail data is ready
        viewComponent: RowDetailViewComponent,
      }
    };
```

###### Row Detail View (`detail-view.html`)
```html
<template>
  <div class="container-fluid">
    <h2>${model.title}</h2>
    <div class="row">
      <div class="col-xs-3"><label>Assignee:</label> <input class="form-control" value.bind="model.assignee" /></div>
      <div class="col-xs-3"><label>Reporter:</label> <span>${model.reporter}</span></div>
      <div class="col-xs-2"><label>Duration:</label> <span>${model.duration}</span></div>
      <div class="col-xs-2"><label>% Complete:</label> <span>${model.percentComplete}</span></div>
    </div>

    <div class="row">
      <div class="col-xs-3"><label>Start:</label> <span>${model.start | dateFormat: 'YYYY-MM-DD'}</span></div>
      <div class="col-xs-3"><label>Finish:</label> <span>${model.finish | dateFormat: 'YYYY-MM-DD'}</span></div>
      <div class="col-xs-2"><label>Effort Driven:</label> <i class.bind="model.effortDriven ? 'mdi mdi-check' : ''"></i></div>
    </div>

    <hr>

    <h4>
      Find out who is the Assignee
      <small>
        <button class="btn btn-primary btn-sm btn-icon" click.trigger="alertAssignee(model.assignee)">Click Me</button>
      </small>
    </h4>
  </div>
</template>
```

###### Row Detail ViewModel (`detail-view.ts`)
```ts
import { bindable } from 'aurelia-framework';

export class DetailViewCustomElement {
  @bindable() model: {
    duration: Date;
    percentComplete: number;
    reporter: string;
    start: Date;
    finish: Date;
    effortDriven: boolean;
    assignee: string; title: string;
  };

  bind(bindingContext, overrideContext) {
    if (bindingContext.model) {
      this.model = bindingContext.model;
    } else if (overrideContext?.bindingContext?.model) {
      this.model = overrideContext.bindingContext.model;
    } else if (overrideContext?.parentOverrideContext?.bindingContext?.model) {
      this.model = overrideContext.parentOverrideContext.bindingContext.model;
    }
  }

  alertAssignee(name: string) {
    if (typeof name === 'string') {
      alert(`Assignee on this task is: ${name.toUpperCase()}`);
    } else {
      alert('No one is assigned to this task.');
    }
  }
}
```

### Access Parent Component (grid) from the Child Component (row detail)
The Row Detail provides you access to the following references (SlickGrid, DataView, Parent Component and the Addon (3rd party plugin)), however please note that all of these references are available from the start **except** the Parent Component instance, for that one you need to reference it inside your Row Detail Grid Options like so:

```ts
// Parent Component (grid)
this.gridOptions = {
  enableRowDetailView: true,
  rowDetailView: {
    // ...
    // ViewModel Template to load when row detail data is ready
    viewModel: PLATFORM.moduleName('examples/slickgrid/example19-detail-view'),

    // Optionally pass your Parent Component reference to your Child Component (row detail component)
    parent: this  // <-- THIS REFERENCE
  }

  // a Parent Method that we want to access
  showFlashMessage(message: string, alertType = 'info') {
    this.message = message;
    this.flashAlertType = alertType;
  }
}
```

Then in our Child Component, we can do some action on the Grid, the DataView or even call a method form the Parent Component (the `showFlashMessage` in our demo), with that in mind, here is the code of the Child Component

##### View
```html
<div class="container-fluid">
  <h3>${model.title}</h3>

    <-- delete a row using the DataView & SlickGrid objects -->
    <button class="btn btn-primary btn-danger btn-sm" click.trigger="deleteRow(model)" data-test="delete-btn">
      Delete Row
    </button>

    <!-- calling a Parent Component method -->
    <button class="btn btn-default btn-sm" click.trigger="callParentMethod(model)" data-test="parent-btn">
      Call Parent Method
    </button>
</div>
```

##### Component
```ts
import { GridRowDetailComponent } from './grid-rowdetail.component';

export class DetailViewCustomElement{
  model: {
    duration: Date;
    percentComplete: number;
    reporter: string;
    start: Date;
    finish: Date;
    effortDriven: boolean;
    assignee: string;
    title: string;
  };

  // you also have access to the following objects (it must match the exact property names shown below)
  addon: any; // row detail addon instance
  grid: any;
  dataView: any;

  // you can also optionally use the Parent Component reference
  // NOTE that you MUST provide it through the "parent" property in your "rowDetail" grid options
  parent: GridRowDetail;

  constructor() { }

  alertAssignee(name: string) {
    if (typeof name === 'string') {
      alert(`Assignee on this task is: ${name.toUpperCase()}`);
    } else {
      alert('No one is assigned to this task.');
    }
  }

  deleteRow(model) {
    if (confirm(`Are you sure that you want to delete ${model.title}?`)) {
      // you first need to collapse all rows (via the 3rd party addon instance)
      this.addon.collapseAll();

      // then you can delete the item from the dataView
      this.dataView.deleteItem(model.id);

      // and perhaps display a flash message by calling a method on the Parent Component
      this.parent.showFlashMessage(`Deleted row with ${model.title}`, 'danger');
    }
  }

  callParentMethod(model) {
    this.parent.showFlashMessage(`We just called Parent Method from the Row Detail Child Component on ${model.title}`);
  }
}
```

## Troubleshooting
### Adding a Column dynamically is removing the Row Selection, why is that?
The reason is because the Row Selection (checkbox) plugin is a special column and Aurelia-Slickgrid is adding an extra column dynamically for the Row Selection checkbox and that is **not** reflected in your local copy of `columnDefinitions`. To address this issue, you need to get the Aurelia-Slickgrid internal copy of all columns (including the extra columns), you can get it via `getAllColumnDefinitions()` from the Grid Service and then you can use to that array and that will work.

```html
<aurelia-slickgrid grid-id="grid16"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset"
    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
```
```ts
aureliaGridReady(aureliaGrid: AureliaGridInstance) {
  this.aureliaGrid = aureliaGrid;
}

addNewColumn() {
  const newColumn = { /*...*/ };

  const allColumns = this.aureliaGrid.gridService.getAllColumnDefinitions();
  allColumns.push(newColumn);
  this.columnDefinitions = allColumns.slice(); // or use spread operator [...cols]

  // you could also use SlickGrid setColumns() method
  // this.aureliaGrid.slickGrid.setColumns(cols);
}
```

## Row Detail with Inner Grid

You can also add an inner grid inside a Row Detail, however there are a few things to know off and remember. Any time a Row Detail is falling outside the main grid viewport, it will be unmounted and until it comes back into the viewport which is then remounted. The process of unmounting and remounting means that Row Detail previous states aren't preserved, however you could use Grid State & Presets to overcome this problem.

##### Component

Main Grid Component

```ts
import { bindable } from 'aurelia';
import { type AureliaGridInstance, type Column, ExtensionName, type GridOption, type SlickRowDetailView, } from 'aurelia-slickgrid';

export class MainGrid implements OnInit {
  columnDefinitions: Column[] = [];
  gridOptions!: GridOption;
  aureliaGrid!: AureliaGridInstance;
  dataset: Distributor[] = [];
  showSubTitle = true;

  get rowDetailInstance(): SlickRowDetailView {
    return this.aureliaGrid?.extensionService.getExtensionInstanceByName(ExtensionName.rowDetailView);
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  constructor() {
    this.defineGrid();
  }

  attached() {
    this.dataset = this.getData();
  }

  defineGrid() {
    this.columnDefinitions = [ /*...*/ ];
    this.gridOptions = {
      enableRowDetailView: true,
      rowSelectionOptions: {
        selectActiveRow: true
      },
      preRegisterExternalExtensions: (pubSubService) => {
        // Row Detail View is a special case because of its requirement to create extra column definition dynamically
        // so it must be pre-registered before SlickGrid is instantiated, we can do so via this option
        const rowDetail = new SlickRowDetailView(pubSubService as EventPubSubService);
        return [{ name: ExtensionName.rowDetailView, instance: rowDetail }];
      },
      rowDetailView: {
        process: (item: any) => simulateServerAsyncCall(item),
        loadOnce: false, // IMPORTANT, you can't use loadOnce with inner grid because only HTML template are re-rendered, not JS events
        panelRows: 10,
        preloadComponent: PreloadComponent,
        viewComponent:  InnerGridComponent,
      },
    };
  }
}
```

Now, let's define our Inner Grid Component

```html
<div class.bind="innerGridClass">
  <h4>Order Details (id: ${ model.id })</h4>
  <div class="container-fluid">
    <aurelia-slickgrid
      grid-id.bind="gridId"
      column-definitions.bind="innerColDefs"
      grid-options.bind="innerGridOptions"
      dataset.bind="innerDataset"
      instances.bind="aureliaGrid"
      on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
      on-before-grid-destroy.trigger="handleBeforeGridDestroy()">
    </aurelia-slickgrid>
  </div>
</div>

```

```ts
import { bindable } from 'aurelia';
import { type AureliaGridInstance, type Column, ExtensionName, type GridOption, type SlickRowDetailView, } from 'aurelia-slickgrid';

export interface Distributor { /* ... */ }
export interface OrderData { /* ... */ }

export class InnerGridComponent {
  @bindable() model!: Distributor;
  innerColDefs: Column[] = [];
  innerGridOptions!: GridOption;
  angularGrid!: AngularGridInstance;
  innerDataset: any[] = [];
  innerGridId = '';
  innerGridClass = '';

  attached() {
    this.gridId = `innergrid-${this.model.id}`;
    this.innerGridClass = `row-detail-${this.model.id}`;
    this.defineGrid();
    this.innerDataset = [...this.model.orderData];
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  defineGrid() {
    // OPTIONALLY reapply Grid State as Presets before unmounting the compoment
    let gridState: GridState | undefined;
    const gridStateStr = sessionStorage.getItem(`gridstate_${this.innerGridClass}`);
    if (gridStateStr) {
      gridState = JSON.parse(gridStateStr);
    }

    this.innerColDefs = [
      { id: 'orderId', field: 'orderId', name: 'Order ID', filterable: true, sortable: true },
      { id: 'shipCity', field: 'shipCity', name: 'Ship City', filterable: true, sortable: true },
      { id: 'freight', field: 'freight', name: 'Freight', filterable: true, sortable: true, type: 'number' },
      { id: 'shipName', field: 'shipName', name: 'Ship Name', filterable: true, sortable: true },
    ];

    this.innerGridOptions = {
      autoResize: {
        container: `.${this.innerGridClass}`,
      },
      enableFiltering: true,
      enableSorting: true,
      datasetIdPropertyName: 'orderId',
      presets: gridState, // reapply grid state presets
    };
  }

  // OPTIONALLY save Grid State before unmounting the compoment
  handleBeforeGridDestroy() {
    const gridState = this.angularGrid.gridStateService.getCurrentGridState();
    sessionStorage.setItem(`gridstate_${this.innerGridClass}`, JSON.stringify(gridState));
  }
}
```
