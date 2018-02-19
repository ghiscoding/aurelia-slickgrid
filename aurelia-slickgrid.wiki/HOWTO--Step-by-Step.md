<a name="step1"></a>
### 1. Install NPM Package
Install the `Aurelia-Slickgrid`, `Slickgrid`, `Bootstrap 3.x`, `Font-Awesome` and `jQuery 3.x` NPM packages with
```bash
npm install --save aurelia-slickgrid slickgrid jquery bootstrap font-awesome
# or with yarn add
```

<a name="step2"></a>
### 2. For `Aurelia-CLI`, modify the `aurelia.json` file
#### For `WebPack`, scroll to step 3.
With `Aurelia-CLI`, some may try to import the packages with `au import [packageName]` or simply add the following to your `aurelia.json` file. 

**Note:** I can assure you that the last 3 are not going to work with `au import`, so you better off copying them from below.
```json
"jquery",
"moment",
{
  "name": "aurelia-slickgrid",
  "path": "../node_modules/aurelia-slickgrid/dist/amd",
  "main": "index",
  "resources": ["**/*.{css,html}"]
},
{
  "name": "bootstrap",
  "path": "../node_modules/bootstrap/dist",
  "main": "js/bootstrap.min",
  "deps": ["jquery"],
  "exports": "$",
  "resources": ["css/bootstrap.css"]
},
{
  "name": "flatpickr",
  "path": "../node_modules/flatpickr/dist",
  "main": "flatpickr.min",
  "resources": ["flatpickr.min.css"]
},
{
  "name": "jquery-event",
  "path": "../node_modules/slickgrid/lib",
  "main": "jquery.event.drag-2.3.0"
},
{
  "name": "jquery-ui",
  "path": "../node_modules/slickgrid/lib",
  "main": "jquery-ui-1.11.3.min"
},
{
  "name": "slickgrid",
  "main": "slick.grid",
  "path": "../node_modules/slickgrid",
  "deps": [
    "jquery",
    "jquery-event",
    "jquery-ui"
  ]
}
```

##### If you use `i18n`, you will also need these
```javascript
{
  "name": "i18next",
  "path": "../node_modules/i18next/dist/umd",
  "main": "i18next"
},
{
  "name": "aurelia-i18n",
  "path": "../node_modules/aurelia-i18n/dist/amd",
  "main": "aurelia-i18n"
},
{
  "name": "i18next-xhr-backend",
  "path": "../node_modules/i18next-xhr-backend/dist/umd",
  "main": "i18nextXHRBackend"
},
```

<a name="step3"></a>
### 3. CSS / SASS Styles
Load the default Bootstrap theme style or scroll down for SASS customization.

#### CSS
Default compiled `css` (if you use the plain Bootstrap Theme CSS, you could simply add it to your `index.html` file and be done with it).

##### Aurelia-CLI
```html
<link rel="stylesheet" type="text/css" href="scripts/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="../node_modules/flatpickr/dist/flatpickr.min.css">

<!-- Slickgrid Bootstrap theme, unless you use SASS import -->
<link rel="stylesheet" type="text/css" href="../node_modules/aurelia-slickgrid/dist/styles/css/slickgrid-theme-bootstrap.css">
```
##### WebPack
```javascript
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'flatpickr/dist/flatpickr.min.css';

// if you use CSS instead of SASS
import 'aurelia-slickgrid/dist/styles/css/slickgrid-theme-bootstrap.css';
```

#### SASS (scss)
You could also compile the SASS files with your own customization, for that simply take any of the [_variables.scss](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/styles/_variables.scss) (without the `!default` flag) variable from the file and make sure to import the Bootstrap Theme afterward. For example, you could modify your `style.scss` with the following changes:

```scss
/* for example, let's change the mouse hover color */
$cell-odd-background-color: lightyellow;
$row-mouse-hover-color: lightgreen;

/* make sure to add the @import the SlickGrid Bootstrap Theme AFTER the variables changes */
@import '../node_modules/aurelia-slickgrid/dist/styles/sass/slickgrid-theme-bootstrap.scss';
```

<a name="step4"></a>
### 4. Include it in your App
#### Aurelia `main.js` or `main.ts`
Make the plugin available globally in your `main.js` file.

##### Aurelia-CLI
```javascript
export function configure(aurelia) {
  aurelia.use.plugin('aurelia-slickgrid');
  aurelia.start().then(() => aurelia.setRoot());
}
```
##### WebPack (add the `PLATFORM.moduleName`)
```javascript
export function configure(aurelia) {
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-slickgrid'));
  aurelia.start().then(() => aurelia.setRoot());
}
```
<a name="step5"></a>
### 5. Create a basic grid
#### View
```html
<aurelia-slickgrid 
    grid-id="grid1" 
    column-definitions.bind="columnDefinitions" 
    grid-options.bind="gridOptions" 
    dataset.bind="dataset"
    grid-height="400" 
    grid-width="800">
</aurelia-slickgrid>
```
#### ViewModel
```javascript
export class Example1 {
  gridOptions;
  columnDefinitions;
  dataset = [];

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100 },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100 },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', minWidth: 100 },
      { id: 'finish', name: 'Finish', field: 'finish', minWidth: 100 },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100 }
    ];
    this.gridOptions = {
      enableAutoResize: false
    };
  }

  getData() {
    // mock a dataset
    this.dataset = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      this.dataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        start: `${randomMonth}/${randomDay}/${randomYear}`,
        finish: `${randomMonth}/${randomDay}/${randomYear}`,
        effortDriven: (i % 5 === 0)
      };
    }
  }
}
```

<a name="step6"></a>
### 6. Explore the Wiki page content
The last step is really to explore all the pages that are available in this Wiki, all the documentation will be place in here and so you should visit it often. For example a good starter is to look at the following

- for all the `Grid Options`, take a look at [Wiki - Grid Options](/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/models/gridOption.interface.ts)
- [Formatters](/ghiscoding/aurelia-slickgrid/wiki/Formatters)
- [Editors](/ghiscoding/aurelia-slickgrid/wiki/Editors)
- [Filters](/ghiscoding/aurelia-slickgrid/wiki/Select-Filter)
- [Grid Menu](/ghiscoding/aurelia-slickgrid/wiki/Grid-Menu)
... and much more, just explorer the Wikis through the sidebar index (on your right)

### 8. Missing Features? (fear not)
What if `Aurelia-Slickgrid` is missing feature(s) versus the original `SlickGrid`? Fear not and directly use the `SlickGrid` and `DataView` objects that are expose from the start through Event Emitters. For more info continue reading on [Wiki - SlickGrid & DataView objects](/ghiscoding/aurelia-Slickgrid/wiki/SlickGrid-&-DataView-Objects) and [Wiki - Grid & DataView Events](https://github.com/ghiscoding/aurelia-Slickgrid/wiki/Grid-&-DataView-Events)