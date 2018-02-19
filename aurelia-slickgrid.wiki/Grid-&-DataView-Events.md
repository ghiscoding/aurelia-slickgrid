SlickGrid has nice amount of [Grid Events](https://github.com/6pac/SlickGrid/wiki/Grid-Events) or [DataView Events](https://github.com/6pac/SlickGrid/wiki/Dataview-Events) which you can use by simply hooking a `subscribe` to them (the `subscribe` is a custom `SlickGrid Event` and is **NOT** an `RxJS Observable` type but is very similar). To get access to all these events, you will have to bind to the `Grid` and the `DataView` objects which are exposed in `Aurelia-Slickgrid` with `EventEmitter` (`Aurelia-Slickgrid` uses `emit` after the `Grid` and `DataView` becomes ready). Once these are called, it basically mean that the `Grid` and `DataView` are ready and we can `subscribe` to any of the [SlickGrid Events](https://github.com/6pac/SlickGrid/wiki/Grid-Events). 

### Event Aggregator
Aurelia-Slickgrid (starting with version `1.3.x`) have the following Events that you can subscribe to with an Event Aggregator:
- `onDataviewCreated`
- `onGridCreated`
- `onBeforeGridCreate`
- `onBeforeGridDestroy`
- `onAfterGridDestroyed`

###### Example
```javascript
constructor(private ea: EventAggregator) {
  ea.subscribe('onBeforeGridDestroy', (resp) => {
    console.log('onBeforeGridDestroy', resp);
  });
}
```

### View
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

### ViewModel
Once the `Grid` and `DataView` are ready (via `changed` bindable events), you can subscribe to any [SlickGrid Events (click to see the full list)](https://github.com/6pac/SlickGrid/wiki/Grid-Events). See below for the `gridChanged(grid)` and `dataviewChanged(dataview)` functions. 
- The `GridExtraUtils` is to bring easy access to common functionality like getting a `column` from it's `row` and `cell` index.
- The example shown below is subscribing to `onClick` and ask the user to confirm a delete, then will delete it from the `DataView`. 
- Technically, the `Grid` and `DataView` are created at the same time by `Aurelia-Slickgrid`, so it's ok to call the `dataViewObj` within some code of the `gridObjChanged()` function since `DataView` object will already be available at that time.

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

  gridObjChanged(grid) {
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
  dataviewObjChanged(dataview) {
    this.dataviewObj = dataview;
  }
}
```