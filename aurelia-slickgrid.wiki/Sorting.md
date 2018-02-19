Sorting on the client side is really easy, you simply need to enable `sortable` (when not provided, it is considered as disabled) on each columns you want to sort and it will sort as a type string. Oh but wait, sorting as string might not always be ideal, what if we want to sort by number or by date? The answer is to simply pass a `type` as shown below.

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example4) / [Demo ViewModel](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example4.ts)
#### Usage
To use any of them, you need to import `FieldType` from `Aurelia-Slickgrid` as shown below. Also please note that `FieldType.string` is the default and you don't necessarily need to define it, though you could if you wish to see it in your column definition.
```javascript
import { FieldType } from 'aurelia-slickgrid';

export class Example {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, type: FieldType.float},
      { id: 'start', name: 'Start', field: 'start', sortable: true, type: FieldType.dateIso },
      { id: 'finish', name: 'Finish', field: 'finish', sortable: true, type: FieldType.dateIso },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true }
    ];
  }
}
```
