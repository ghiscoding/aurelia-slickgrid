#### Index
- [Row Selection](/ghiscoding/aurelia-slickgrid/wiki/Row-Selection)
- [Register a Plugin](/ghiscoding/aurelia-slickgrid/wiki/SlickGrid-Plugins#register-a-plugin)

#### Event
You can `subscribe` to a SlickGrid Event (not an `Observable`) named `onSelectedRowsChanged` and hook a callback function to it. 
```javascript
// args is an object returning: { rows: number[] }
grid.onSelectedRowsChanged.subscribe((e, args) => {
  console.log('onSelectedRowsChanged', args);
});
```
Refer to the [Wiki - Grid On Events](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-&-DataView-Events) to know how to connect an Event.

## Register a Plugin
You can register a Plugin or multiple Plugins by calling `registerPlugins` from the Grid Options. The property accept a single Plugin or an array of Plugins.

#### Grid Option
To enable/disable Row(s) Selection, you can call the `enableRowSelection` flag in the Grid Options. You could also choose to select the active row (`false` by default) by calling `rowSelection: { selectActiveRow: true; }`
```javascript
this.gridOptions = {
  registerPlugins: myPlugin
}
```
OR multiple Plugins
```javascript
this.gridOptions = {
  registerPlugins: [myPlugin1, myPlugin2]
}
```
