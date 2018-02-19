The `Grid Menu` (also known as the `Hamburger Menu`) is now part of `Aurelia-Slickgrid` and is enabled by default (it requires `Slickgrid` version `2.3.10+`). 

## How to use it? 
#### It's Enabled by default
Technically, it's enable by default and so you don't have anything to do to enjoy it. However if you want to customize the content of the Grid Menu, then continue reading.

### Demo
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example9) / [Demo ViewModel](/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/examples/slickgrid/example9.ts)

## Customization 
### Column Picker
The Grid Menu comes, by default, with a `Column Picker`. This brings an easy way to show/hide certain column(s) from the grid. This functionality was copied from the [Column Picker Plugin](/ghiscoding/aurelia-slickgrid/wiki/SlickGrid-Controls-&-Plugins#column-picker) and brought over to the Grid Menu. 

### Custom Commands
The Grid Menu also comes, by default, with a list of custom commands
- Clear all Filters (you can hide it with `showClearAllFiltersCommand: false`)
- Toggle the Filter Row (you can hide it with `showToggleFilterCommand: false`)
- _Export to CSV_ (**not yet... but soon**)

This section is called Custom Commands because you can also customize this section with your own commands. To do that, you need to fill in 2 properties (an array of `customItems` and define `onGridMenuCommand` callback) in your Grid Options. For example, `Aurelia-Slickgrid` is configured by default with these settings (you can overwrite any one of them): 
```javascript
this.gridOptions = {
   enableAutoResize: true,
   enableGridMenu: true,   // <<-- this will automatically add extra custom commands
   enableFiltering: true,
   gridMenu: {
     customTitle: 'Custom Commands',
     columnTitle: 'Columns',
     iconCssClass: 'fa fa-ellipsis-v',
     menuWidth: 17,
     resizeOnShowHeaderRow: true,
     customItems: [
       {
         iconCssClass: 'fa fa-filter text-danger',
         title: 'Clear All Filters',
         disabled: false,
         command: 'clear-filter'
       },
       {
         iconCssClass: 'fa fa-random',
         title: 'Toggle Filter Row',
         disabled: false,
         command: 'toggle-filter'
       }
     ],
     onCommand: (e, args) => {
       if (args.command === 'toggle-filter') {
         this.gridObj.setHeaderRowVisibility(!this.gridObj.getOptions().showHeaderRow);
       } else if (args.command === 'clear-filter') {
         this.filterService.clearFilters();
         this.dataviewObj.refresh();
       }
     }
   }
};
```
#### Callback Hooks
There are 3 callback hooks which are accessible in the Grid Options
- onGridMenuBeforeShow
- onGridMenuCommand
- onGridMenuClose

For more info on all the available properties of the custom commands, you can read refer to the doc written in the Grid Menu [implementation](https://github.com/6pac/SlickGrid/blob/master/controls/slick.gridmenu.js) itself.

### How to Disable the Grid Menu?
You can disable the Grid Menu, by calling `enableGridMenu: false` from the Grid Options.
```javascript
this.gridOptions = {
   enableGridMenu: false,
};
```