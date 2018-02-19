### CSS/SASS Styles
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