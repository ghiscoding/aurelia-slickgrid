#### index
- CRUD Methods
  - [Add Item](#add-an-item-row)
  - [Delete Item](#delete-an-item-row)
  - [Update Item](#update-an-item-row)
  - [Upsert Item](#upsert-an-item-row)
  - [Default Option Flags](#crud-default-option-flags)
- [Highlight a Row](#highlight-a-row-item)

### Description
When working with the grid, you might want to Add / Update or Hightlight an item row from the Datagrid.

**Note:** This is strictly a client side event, you still have to implement any backend change yourself.

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example11) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example11.ts)

## CRUD Methods
### Add an Item (row)
Please note that you need to provide the `id` by yourself and remember that it has to be **unique**, else the `Slickgrid DataView` will throw you an error in the console.

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

##### ViewModel
```typescript
import { AureliaGridInstance} from 'aurelia-slickgrid';

export class GridBasicComponent {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  addNewItem() {
    const newItem = {
      id: this.dataset.length + 1, // it's up to you to decide on what the ID will be, as long as it's unique
      // ... your item properties
    };

    // add the item to the grid
    this.aureliaGrid.gridService.addItem(newItem);
  }
}
```

#### Add Item Position (top/bottom)
When adding an item, you can add it on top (default) of the grid or at the bottom of the grid. In order to change that, you can use the `position` property.
```ts
// add the item to the end of grid
this.aureliaGrid.gridService.addItem(newItem, { position: 'bottom' });
```

#### Change default flags
When adding an item, you have access to change any of the default flags through the second argument of `addItem` method.
```ts
// add the item to the end of grid
this.aureliaGrid.gridService.addItem(newItem, {
  // the defaults are shown below
  highlightRow: true, // do we want to highlight the row after the insert
  position: 'top',    // which position of the grid to add the item
  resortGrid: false,  // do we want to resort the grid after the insert
  selectRow: false,   // do we want to select the row after the insert
  triggerEvent: true  // do we want to trigger an event after the insert
});
```

### Delete an Item (row)
To delete a row, you can use `deleteItem(s)` and the pass the entire object(s) or use `deleteItemById(s) in which you need to provide the object `id` to delete and the method will find it in the grid and remove it from the grid. Also please note that it's only deleting from the grid (by removing it from the DataView), meaning that it won't remove it from your database.

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
```typescript
import { AureliaGridInstance} from 'aurelia-slickgrid';

export class GridBasicComponent {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  removeItem(itemId: number | string) {
    // remove the item from the grid
    this.aureliaGrid.gridService.deleteItemById(itemId);

    // or multiple Ids passed as an array (number or string)
    // this.aureliaGrid.gridService.deleteItemByIds([1, 2]); // e.g. remove user id 1 and 2
  }
}
```

#### Change default flags
When adding an item, you have access to change any of the default flags through the second argument of `addItem` method.
```ts
// add the item to the end of grid
this.aureliaGrid.gridService.deleteItemById(123, {
  // the defaults are shown below
  triggerEvent: true  // do we want to trigger an event after the insert
});
```

### Update an Item (row)
To update an item, you can use `updateItem(s)` and the pass the entire object(s) in this case it does not require you to know the row number, it will try to find the row by itself (it uses the "id" for that) and update the item. The other way would be to use `updateItemById` in which you need to provide the object `id` to update the item.

##### ViewModel
```ts
import { AureliaGridInstance } from 'aurelia-slickgrid';

export class GridBasicComponent {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  updateItem(upItem) {
    this.aureliaGrid.gridService.updateItem(newItem);
  }
}
```

#### Change default flags
When adding an item, you have access to change any of the default flags through the second argument of `addItem` method.
```ts
// add the item to the end of grid
this.aureliaGrid.gridService.updateItem(newItem, {
  // the defaults are shown below
  highlightRow: true,       // do we want to highlight the row after the update
  selectRow: false,         // do we want to select the row after the update
  scrollRowIntoView: false, // do we want to scroll the row into the viewport after the update
  triggerEvent: true        // do we want to trigger an event after the update
});
```

### Upsert an Item (row)
Upsert will do an Insert when not found or update if it found the item already exist in the grid.

##### Component
```ts
import { AureliaGridInstance } from 'aurelia-slickgrid';

export class GridBasicComponent {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  updateItem(upItem) {
    this.aureliaGrid.gridService.upsertItem(upItem);
  }
}
```

### CRUD Default Option Flags
All the CRUD methods have default option flags that can be changed which will do certain actions. The default option flags are the following for each of the CRUD method (`upsert` will use the flags of the insert or the update depending on which method it calls).
```ts
const GridServiceDeleteOptionDefaults: GridServiceDeleteOption = {
  triggerEvent: true  // do we want to trigger an event after the insert
};

const GridServiceInsertOptionDefaults: GridServiceInsertOption = {
  highlightRow: true, // do we want to highlight the row after the insert
  position: 'top',    // which position of the grid to add the item
  resortGrid: false,  // do we want to resort the grid after the insert
  selectRow: false,   // do we want to select the row after the insert
  triggerEvent: true  // do we want to trigger an event after the insert
};

const GridServiceUpdateOptionDefaults: GridServiceUpdateOption = {
  highlightRow: true,       // do we want to highlight the row after the update
  selectRow: false,         // do we want to select the row after the update
  scrollRowIntoView: false, // do we want to scroll the row into the viewport after the update
  triggerEvent: true        // do we want to trigger an event after the update
};
```

## Highlight a row item
Highlighting a row is customizable with SASS, you can change the highlighted color and/or animation by changing the [SASS variables](https://github.com/ghiscoding/slickgrid-universal/blob/master/packages/common/src/styles/_variables.scss) `$row-highlight-background-color` and/or `$row-highlight-fade-animation`
Take a look at all the available [SASS variables](https://github.com/ghiscoding/slickgrid-universal/blob/master/packages/common/src/styles/_variables.scss).

##### ViewModel
```typescript
import { AureliaGridInstance } from 'aurelia-slickgrid';

@autoinject ()
export class GridBasicComponent {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  updateItem(rowNumber) {
    const fadingDelay = 2000; // in milliseconds

    // you can pass an optional fading delay (1500ms by default)
    this.aureliaGrid.gridService.highlightRow(rowNumber, fadingDelay);
  }
}
```
