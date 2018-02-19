For row selection, you can simply play with couple of grid options (see below) and subscribe to `onSelectedRowsChanged` (a SlickGrid Event that is, it's not an Observable). However please note that `onSelectedRowsChanged` is a function available on the `Grid` object and you will need bind to `(gridChanged)` to get the object when grid is ready. There are 2 types of row selection(s) which you can do.

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example10) / [Demo ViewModel](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example10.ts)

## Single Row Selection
For a single row selection, you need to `enableCellNavigation` and `enableRowSelection` to `True` and as describe earlier, subscribe to `onSelectedRowsChanged` (for that you need to bind to `(gridChanged)`). 

#### View
```html
<aurelia-slickgrid gridId="grid4"
    grid.bind="gridObj"
    columnDefinitions.bind="columnDefinitions" 
    gridOptions.bind="gridOptions" 
    dataset.bind="dataset">
</aurelia-slickgrid>
```

#### ViewModel
```javascript
this.gridOptions = {
  enableAutoResize: true,
  enableCellNavigation: true,
  enableRowSelection: true
}

gridObjChanged(grid) {
  grid.onSelectedRowsChanged.subscribe((e, args) => {
    if (Array.isArray(args.rows)) {
      this.selectedObjects = args.rows.map(idx => {
        const item = grid.getDataItem(idx);
        return item.title || '';
      });
    }
  });
}
```

## Multiple Row Selections
As for multiple row selections, you need to disable `enableCellNavigation` and enable `enableCheckboxSelector` and `enableRowSelection`. Then as describe earlier, you will subscribe to `onSelectedRowsChanged` (for that you need to bind to `(gridChanged)`). 

#### View
```html
<aurelia-slickgrid gridId="grid4"
    grid.bind="gridObj"
    columnDefinitions.bind="columnDefinitions" 
    gridOptions.bind="gridOptions" 
    dataset.bind="dataset">
</aurelia-slickgrid>
```

#### ViewModel
```javascript
this.gridOptions = {
  enableAutoResize: true,
  enableCellNavigation: false,
  enableCheckboxSelector: true,
  enableRowSelection: true
}

gridObjChanged(grid) {
  grid.onSelectedRowsChanged.subscribe((e, args) => {
    if (Array.isArray(args.rows)) {
      this.selectedObjects = args.rows.map(idx => {
        const item = grid.getDataItem(idx);
        return item.title || '';
      });
    }
  });
}
```