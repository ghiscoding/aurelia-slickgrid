When working with the grid, you might want to Add / Update or Hightlight an item row from the Datagrid.

**Note:** This is strictly a client side event, you still have to implement any backend change yourself.

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example11) / [Demo Component](/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example11.ts)

## Add an Item (row)
Please note that you need to provide the `id` by yourself and remember that it has to be **unique**, else the `Slickgrid DataView` will throw you an error in the console.
### Component
```javascript
import { autoinject } from 'aurelia-framework';
import { GridExtraService } from 'aurelia-slickgrid';

@autoinject ()
export class GridBasicComponent {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  constructor(private gridExtraService: GridExtraService) {
  }

  addNewItem() {
    const newItem = {
      id: this.dataset.length + 1, // it's up to you to decide on what the ID will be, as long as it's unique
      // ... your item properties
    };

    // add the item to the grid
    this.gridExtraService.addItemToDatagrid(newItem);
  }
}
```

## Update an Item (row)
Updating an item is very similar to adding an item. It does not require you to know the row number, it will try to find it by itself (it uses the "id" for that). 
### Component
```javascript
import { autoinject } from 'aurelia-framework';
import { GridExtraService } from 'aurelia-slickgrid';

@autoinject ()
export class GridBasicComponent {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  constructor(private gridExtraService: GridExtraService) {}

  updateItem(upItem) {
    this.gridExtraService.updateDataGridItem(upItem);
  }
}
```

## Highlight a row item
Highlighting a row is customizable with SASS, you can change the highlighted color and/or animation by changing the [SASS variables](https://github.com/ghiscoding/Angular-Slickgrid/blob/master/src/app/modules/angular-slickgrid/styles/_variables.scss) `$row-highlight-background-color` and/or `$row-highlight-fade-animation`
Take a look at all the available [SASS variables](https://github.com/ghiscoding/Angular-Slickgrid/blob/master/src/app/modules/angular-slickgrid/styles/_variables.scss).
### Component
```javascript
import { autoinject } from 'aurelia-framework';
import { GridExtraService } from 'aurelia-slickgrid';

@autoinject ()
export class GridBasicComponent {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  constructor(private gridExtraService: GridExtraService) {}

  updateItem(rowNumber) {
    const fadingDelay = 2000; // in milliseconds

    // you can pass an optional fading delay (1500ms by default)
    this.gridExtraService.highlightRow(rowNumber, fadingDelay);
  }
}
```