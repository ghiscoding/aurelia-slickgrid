You might find yourself re-using the same configurations over and over, in that case we got you covered. You can change any of the global options directly in the `main.js` (or `main.ts`) through a config as shown below:

```javascript
export function configure(aurelia) {
  aurelia.use.standardConfiguration().developmentLogging();

  aurelia.use.plugin('aurelia-slickgrid', config => {
    // change any of the default global options
    // for example we can change the Grid Menu (hamburger menu) default icon 
    config.options.gridMenu.iconCssClass = 'fa fa-ellipsis-v';
  });

  aurelia.start().then(() => aurelia.setRoot('app'));
}
```
##### or with aurelia-webpack-plugin 2.0 :
```javascript
export function configure(aurelia) {
  aurelia.use.standardConfiguration().developmentLogging();

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-slickgrid'), config => {
    // change any of the default global options
    // for example we can change the Grid Menu (hamburger menu) default icon 
    config.options.gridMenu.iconCssClass = 'fa fa-ellipsis-v';
  });

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
```

### List of Global Options
For the complete list of available Grid Option, you can take a look at the [Default Grid Options](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/global-grid-options.ts) file and/or technically any of the options from the [grid options - interface](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/models/gridOption.interface.ts) are configurable. 