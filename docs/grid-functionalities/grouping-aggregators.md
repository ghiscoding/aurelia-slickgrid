#### index
- [Demo](#demo)
- [Description](#description)
- [Setup](#setup)
- [Aggregators](#aggregators)
- [SortComparers](https://github.com/ghiscoding/slickgrid-universal/blob/master/packages/common/src/sortComparers/sortComparers.index.ts)
- [GroupTotalsFormatter](#group-totals-formatter)
- [Custom GroupTotalsFormatter](#custom-grouptotalsformatter)
- [Set a Grouping](#set-a-grouping)
- [Clear Grouping / Collapse All / Expand All](#clear-grouping--collapse-all--expand-all)
- [Styling - Change Icons](#styling-change-icons)

## Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example13) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example13.ts)

##### Draggable Grouping
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example18) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example18.ts)

### Description
Fully dynamic and interactive multi-level grouping with filtering and aggregates that is achieved with the help of the `DataView` object in `SlickGrid`. Each grouping level can have its own aggregates (over child rows, child groups, or all descendant rows). An aggregate can be seen as sub-totals, totals, average, ... or any defined group(s).

How does it work in `SlickGrid`?
The important thing to understand while working with `SlickGrid` is that Grouping requires you to provide 2 things, if you omit 1 of them, it will simply not work. These 2 things are
1. You will need to define which type of aggregate (accumulator) you want to use
   - Aurelia-Slickgrid provides the following built-in `Aggregators`: `Avg`, `Min`, `Max`, `Sum`
2. You need to add a `groupTotalsFormatter` on the column definition you want it to be calculated
   - this is very similar to a Formatter, except that they are designed to show aggregate results, e.g:: `Total: 142.50$`

These 2 steps go hands in hands, a `groupTotalsFormatter` would have nothing to show if it does not have an `Aggregator`.

### Setup
One of the very first thing that you need to do is to provide the `SlickGrid DataView` object to your `ViewModel`. The `DataView` is where we will define all of our Grouping. You can get the `dataView` object through an Event Emitter `onDataviewCreated` like so:

##### View
```html
<aurelia-slickgrid
   grid-id="grid1"
   column-definitions.bind="columnDefinitions"
   grid-options.bind="gridOptions" dataset.bind="dataset"
   on-aurelia-grid-created.delegate="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
```
##### Component

```typescript
export class Example {
  aureliaGrid: AureliaGridInstance;
  gridObj: any;
  dataViewObj: any;

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;

    // the Aurelia Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = aureliaGrid.slickGrid;
    this.dataViewObj = aureliaGrid.dataView;
  }

  attached() {
    // populate the grid
  }
}
```

### Aggregators
The `Aggregators` is basically the accumulator, the logic that will do the sum (or any other aggregate we defined). We simply need to instantiate the `Aggregator` by passing the column definition `field` that will be used to accumulate. For example, if we have a column definition of Cost and we want to calculate it's sum, we can call the `Aggregator` as follow
```ts
new Aggregators.Sum('cost')
```
The available built-in `Aggregators` are
- `Aggregators.Avg` (calculate the Average of a group)
- `Aggregators.Min` (returns the Minimum value of a group)
- `Aggregators.Max` (returns the Maximum value of a group)
- `Aggregators.Sum` (calculate the Sum of a group)
- `Aggregators.Clone` (will clone the same grouped text and display it in as an aggregated value)
- `Aggregators.Distinct` (will show distinct value)

### Group Totals Formatter
When defining your column definitions, you will need to decide which of the column will have an aggregate. Once that decision is made, you will add a `groupTotalsFormatter` to that column definition in question (a Formatter for the group total). For example, let say that we have a cost and we want a total sum grouped by a duration, the code would look like below.

##### Available Group Total Formatters
You can see the full list under [`groupingFormatters.index.ts`](https://github.com/ghiscoding/slickgrid-universal/blob/master/packages/common/src/grouping-formatters/groupingFormatters.index.ts)
Note: the Group Total Formatters named as currency will have these extra `params` (`groupFormatterPrefix`, `groupFormatterSuffix`, `groupFormatterCurrencyPrefix`, `groupFormatterCurrencySuffix`) and also the other common Formatter `params` (`minDecimal`, `maxDecimal`, `decimalSeparator`, `thousandSeparator`, `displayNegativeNumberWithParentheses`).

- `avgTotalsPercentageFormatter`
- `avgTotalsDollarFormatter`
- `avgTotalsCurrencyFormatter`
- `avgTotalsFormatter`
- `minTotalsFormatter`
- `maxTotalsFormatter`
- `sumTotalsColoredFormatter`
- `sumTotalsCurrencyFormatter`
- `sumTotalsCurrencyColoredFormatter`
- `sumTotalsDollarColoredBoldFormatter`
- `sumTotalsDollarColoredFormatter`
- `sumTotalsDollarBoldFormatter`
- `sumTotalsDollarFormatter`
- `sumTotalsFormatter`
- `sumTotalsBoldFormatter`

##### ViewModel
```typescript
export class Example {
  this.columnDefinitions = [
    {
      id: 'title', name: 'Title', field: 'title'
    },
    {
      id: 'duration', name: 'Duration', field: 'duration',
      type: FieldType.number,
      groupTotalsFormatter: GroupTotalFormatters.sumTotals,
      params: { groupFormatterPrefix: 'Total: ' }
    },
    {
      id: 'cost', name: 'Cost', field: 'cost',
      exportWithFormatter: true,    // for a Dollar Formatter, we also want it to be displayed in the export to file
      formatter: Formatters.dollar,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsDollar,
      params: { groupFormatterPrefix: '<b>Total</b>: ' /*, groupFormatterSuffix: ' USD'*/ }
    }
  ];

  this.gridOptions = {
    enableGrouping: true,        // don't forget to enable the grouping
    exportOptions: {
      sanitizeDataExport: true   // you can also sanitize the exported data (it will remove any HTML tags)
    }
  };
}
```

#### Prefix/Suffix to a `groupTotalsFormatter`
We can also pass prefix and/or suffix to each `groupTotalsFormatter` by adding them to the `params` object. Also note that you can also type HTML to be interpreted. For example, let say we would like `Total:` to show as bold and a suffix of 'USD' , you can write it this way:

**Note** prefix/suffix are concatenated without spaces, if you require a space then make sure to add it in accordingly.

##### ViewModel
```ts
{
  id: 'cost', name: 'Cost', field: 'cost',
  groupTotalsFormatter: GroupTotalFormatters.sumTotalsDollar,
  params: { groupFormatterPrefix: '<b>Total</b>: ', groupFormatterSuffix: ' USD' }
}
```

### Custom `groupTotalsFormatter`
You can also create a custom `groupTotalsFormatter` similarly to a Formatter, just a create a function that will return a string, for example:

##### ViewModel
```typescript
defineGrid() {
  this.columnDefinitions = [
      {
        id: 'cost', name: 'Cost', field: 'cost',
        groupTotalsFormatter: this.sumTotalsFormatter
      }
  ];
}

sumTotalsFormatter(totals, columnDef) {
  const val = totals.sum && totals.sum[columnDef.field];
  if (val != null) {
    return 'total: ' + ((Math.round(parseFloat(val) * 100) / 100));
  }
  return '';
}
```

### Set a Grouping
Once you have added a `groupTotalsFormatter` and defined which aggregate you want to use, you will want to create a grouping function. If we take again our example of a grid with multiple task and we want to group our task by duration and calculate the duration average and the cost total sum, we can write the following function

##### ViewModel
```ts
groupByDuration() {
    this.dataviewObj.setGrouping({
      getter: 'duration',  // the column `field` to group by
      formatter: (g) => {
        // (required) what will be displayed on top of each group
        return `Duration:  ${g.value} <span style="color:green">(${g.count} items)</span>`;
      },
      comparer: (a, b) => {
        // (optional) comparer is helpful to sort the grouped data
        // code below will sort the grouped value in ascending order
        return SortComparers.numeric(a.value, b.value, SortDirectionNumber.asc);
      },
      aggregators: [
        // (optional), what aggregators (accumulator) to use and on which field to do so
        new Aggregators.Avg('percentComplete'),
        new Aggregators.Sum('cost')
      ],
      aggregateCollapsed: false,  // (optional), do we want our aggregator to be collapsed?
      lazyTotalsCalculation: true // (optional), do we want to lazily calculate the totals? True is commonly used
    });
  }
```

### Clear Grouping / Collapse All / Expand All
To "Clear all Grouping", "Collapse all Groups" and "Expand all Groups", we can simply call the associated `DataView` function, like so:

##### ViewModel
```ts
  clearGrouping() {
    this.dataviewObj.setGrouping([]);
  }

  collapseAllGroups() {
    this.dataviewObj.collapseAllGroups();
  }

  expandAllGroups() {
    this.dataviewObj.expandAllGroups();
  }
```

### Styling (change icons)
The current icons are Font Awesome chevron (right/down), however if you wish to use +/- icons. You can simply update the SASS variables to use whichever icons (or even Font Family icon) you desire. The SASS variables you can change are
```css
$icon-group-color:                      $primary-color;
$icon-group-expanded:                   "\f107";
$icon-group-collapsed:                  "\f105";
$icon-group-font-size:                  ($icon-font-size + 2px);
$icon-group-font-weight:                bold;
$icon-group-margin-right:               2px;
$icon-group-height:                     20px;
$icon-group-width:                      14px;

/* Grouping Totals Formatter */
$group-totals-formatter-color:          gray;
$group-totals-formatter-bgcolor:        white;
$group-totals-formatter-font-size:      14px;
```

For more info on SASS styling and variables, please read the [Wiki - SASS Styling](../styling/styling.md),
