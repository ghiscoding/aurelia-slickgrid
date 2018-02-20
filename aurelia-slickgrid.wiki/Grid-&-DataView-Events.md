SlickGrid has a nice amount of [Grid Events](https://github.com/6pac/SlickGrid/wiki/Grid-Events) or [DataView Events](https://github.com/6pac/SlickGrid/wiki/Dataview-Events) which you can use by simply hook a `subscribe` to them (the `subscribe` are a custom `SlickGrid Event` and are **NOT** an `RxJS Observable` type but they very similar). There are 3 options to get access to all these events (For the first 2 you will have to get access to the `Grid` and the `DataView` objects which are exposed in `Aurelia-Slickgrid`):
1. with `bindable` values, so you can just call `gridChanged` and/or `dataviewChanged`
2. with `EventAggregator` has multiple event aggregators available (`Aurelia-Slickgrid` uses `publish` when the `Grid` and `DataView` becomes ready). Once you can the `grid` and/or `dataview` objects, you can then hook to any of the [SlickGrid Grid Events](https://github.com/6pac/SlickGrid/wiki/Grid-Events) and/or [SlickGrid DataView Events](https://github.com/6pac/SlickGrid/wiki/Dataview-Events).  
3. with `delegate` binding so you can add event handlers in your view. This library bubbles all events for the Grid and DataView by converting the camelcase methods to kebab case (ie. onMouseEnter will be sg-on-mouse-enter. "sg" (SlickGrid) is just an identifier to indicate the event is dispatched from slickgrid). Also, we expose events emitted from the `AureliaSlickgridCustomElement` (see [Example with Event Aggregators](#example-with-event-aggregators)). Slickgrid's EventData and Args parameters will be passed via $event.detail.eventData and $event.detail.args. For example:

```html
<template>
  <aurelia-slickgrid 
    grid-id="gridId" 
    column-definitions.bind="columnDefs" 
    grid-options.bind="gridOptions" 
    dataset.bind="myDataset"
    grid-height="400" 
    grid-width="800"
    sg-on-click.delegate="handleClick($event.detail.eventData, $event.detail.args)"
    sg-on-mouse-enter.delegate="handleMouse($event.detail.eventData, $event.detail.args)">
  </aurelia-slickgrid>
</template>
```

### Example with Event Aggregators
Aurelia-Slickgrid (starting with version `1.3.x`) have the following Events that you can subscribe to with an Event Aggregator:
- `onDataviewCreated`
- `onGridCreated`
- `onBeforeGridCreate`
- `onBeforeGridDestroy`
- `onAfterGridDestroyed`

###### Example
```javascript
constructor(private ea: EventAggregator) {
  ea.subscribe('onGridCreated', (grid) => {
    this.gridObj = grid;
  });
  ea.subscribe('onBeforeGridDestroy', (resp) => {
    console.log('onBeforeGridDestroy', resp);
  });
}
```

### Example with Bindable Grid/Dataview
##### View
Bind `dataview.bind` and `grid.bind`
```html
<aurelia-slickgrid 
  gridId="grid2" 
  dataview.bind="dataviewObj" 
  grid.bind="gridObj"
  columnDefinitions.bind="columnDefinitions" 
  gridOptions.bind="gridOptions" 
  dataset.bind="dataset">
</aurelia-slickgrid>
```

##### ViewModel
Hook yourself to the `Changed` event of the bindable `grid` object.
```javascript
export class GridEditorComponent implements OnInit {
  gridObjChanged(grid) {
    this.gridObj = grid;
  }
}
```

### How to use Grid/Dataview Events
Once the `Grid` and `DataView` are ready (via `changed` bindable events), you can subscribe to any [SlickGrid Events (click to see the full list)](https://github.com/6pac/SlickGrid/wiki/Grid-Events). See below for the `gridChanged(grid)` and `dataviewChanged(dataview)` functions. 
- The `GridExtraUtils` is to bring easy access to common functionality like getting a `column` from it's `row` and `cell` index.
- The example shown below is subscribing to `onClick` and ask the user to confirm a delete, then will delete it from the `DataView`. 
- Technically, the `Grid` and `DataView` are created at the same time by `Aurelia-Slickgrid`, so it's ok to call the `dataViewObj` within some code of the `gridObjChanged()` function since `DataView` object will already be available at that time.

**Note** The example below is demonstrated with `bind` with event `Changed` hook on the `grid` and `dataview` objects. However you can also use the `EventAggregator` as shown earlier. It's really up to you to choose the way you want to call these objects.

```javascript
import { inject, bindable } from 'aurelia-framework';
import { Editors, Formatters, GridExtraUtils } from 'aurelia-slickgrid';

export class GridEditorComponent implements OnInit {
  @bindable() gridObj: any;
  @bindable() dataviewObj: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];  
  dataviewObj: any;

  constructor(private controlService: ControlAndPluginService) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'delete', field: 'id', formatter: Formatters.deleteIcon, maxWidth: 30 }
      // ...
    ];

    this.gridOptions = {
      editable: true,
      enableCellNavigation: true,
      autoEdit: true
    };
  }

  // with bindable Dataview and Changed event
  dataviewObjChanged(dataview) {
    this.dataviewObj = dataview;
  }

  // with bindable Grid and Changed event
  gridObjChanged(grid) {
    this.gridObj = grid;
    this.subscribeToSomeGridEvents(grid);
  }

  subscribeToSomeGridEvents(grid) {
    grid.onCellChange.subscribe((e, args) => {
      console.log('onCellChange', args);
      // for example, CRUD with WebAPI calls
    });

    grid.onClick.subscribe((e, args) => {
      const column = GridExtraUtils.getColumnDefinitionAndData(args);

      if (column.columnDef.id === 'delete') {
        if (confirm('Are you sure?')) {
          this.dataviewObj.deleteItem(column.dataContext.id);
          this.dataviewObj.refresh();
        }
      }
    });
  }
}
```
