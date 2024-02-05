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
A Row Detail allows you to open a detail panel which can contain extra and/or more detailed information about a row. For example, we have a user list but we want to display detailed information about this user (his full address, account info, last purchasers, ...) but we don't want to display this in the user grid (for performance and real estate reasons), so a Row Detail is perfect for this.

## Usage

##### View
```html
<aurelia-slickgrid
    grid-id="gridId"
    column-definitions.bind="columnDefs"
    grid-options.bind="gridOptions"
    dataset.bind="myDataset"
    on-aurelia-grid-created.delegate="aureliaGridReady($event.detail)">
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
  <h4><i class="fa fa-refresh fa-spin fa-2x fa-fw"></i>Loading...</h4>
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
      <div class="col-xs-2"><label>Effort Driven:</label> <i class.bind="model.effortDriven ? 'fa fa-check' : ''"></i></div>
    </div>

    <hr>

    <h4>
      Find out who is the Assignee
      <small>
        <button class="btn btn-primary btn-sm" click.delegate="alertAssignee(model.assignee)">Click Me</button>
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
    } else if (overrideContext && overrideContext.bindingContext && overrideContext.bindingContext.model) {
      this.model = overrideContext.bindingContext.model;
    } else if (overrideContext && overrideContext.parentOverrideContext && overrideContext.parentOverrideContext.bindingContext && overrideContext.parentOverrideContext.bindingContext.model) {
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
    <button class="btn btn-primary btn-danger btn-sm" click.delegate="deleteRow(model)" data-test="delete-btn">
      Delete Row
    </button>

    <!-- calling a Parent Component method -->
    <button class="btn btn-default btn-sm" click.delegate="callParentMethod(model)" data-test="parent-btn">
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
    on-aurelia-grid-created.delegate="aureliaGridReady($event.detail)">
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
