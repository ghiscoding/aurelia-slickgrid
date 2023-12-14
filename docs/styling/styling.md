#### index
- [Using Built-in Themes (CSS or SASS)](#csssass-styles)
- [Using CSS Variables](#using-css-variables-instead-of-sass)
- [Bootstrap & Other Frameworks](#bootstrap-support)
- [SVG Icons](#svg-icons)

### CSS/SASS Styles
Load the default Bootstrap theme style or scroll down for SASS customization.

#### CSS
Default compiled `css` (if you use the plain Bootstrap Theme CSS, you could simply add it to your `index.html` file and be done with it).

##### Aurelia-CLI
```html
<link rel="stylesheet" type="text/css" href="scripts/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="../node_modules/flatpickr/dist/flatpickr.min.css">

<!-- Slickgrid Bootstrap theme, unless you use SASS import -->
<link rel="stylesheet" type="text/css" href="../node_modules/@slickgrid-universal/common/dist/styles/css/slickgrid-theme-bootstrap.css">
```
##### WebPack
```typescript
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'flatpickr/dist/flatpickr.min.css';

// if you use CSS instead of SASS
import '@slickgrid-universal/common/dist/styles/css/slickgrid-theme-bootstrap.css';
```

#### SASS (scss)
You could also compile the SASS files with your own customization, for that simply take any of the [_variables.scss](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/styles/_variables.scss) (without the `!default` flag) variable from the file and make sure to import the Bootstrap Theme afterward. For example, you could modify your `style.scss` with the following changes:

```scss
/* for example, let's change the mouse hover color */
$slick-cell-odd-background-color: lightyellow;
$slick-row-mouse-hover-color: lightgreen;

/* make sure to add the @import the SlickGrid Bootstrap Theme AFTER the variables changes */
@import '../node_modules/@slickgrid-universal/common/dist/styles/sass/slickgrid-theme-bootstrap.scss';

/* or with */
@import '@slickgrid-universal/common/dist/styles/sass/slickgrid-theme-bootstrap.scss';
```

### Using CSS Variables _(instead of SASS)_
You could change the SlickGrid styling with your own customization using [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). The variables that you can use (over 800 of them) are all predefined as SASS variables in the [_variables.scss](/ghiscoding/slickgrid-universal/blob/master/packages/common/src/styles/_variables.scss) file, you will simply have to rename the `$slick-` prefix with a `--slick-` prefix to the variable name to use them as CSS Variables. To be clear, you don't need SASS but the variables names were all declared as SASS and that is what the lib will use internally but you can optionally use them all as plain CSS Variables.

For example, if we take the following 3 SASS variables (`$slick-header-menu-display`, `$slick-primary-color-dark` and `$slick-header-filter-row-border-bottom`) we can use the CSS Variables equivalent as the following

```css
/* use :host (local) or :root (global) */
:root {
    --slick-header-menu-display: inline-block;
    --slick-primary-color-dark: pink;
    --slick-header-filter-row-border-bottom: 2px solid pink;
}
```

**NOTE:** you could use `:host` to only change current grid styling, **however** there are many DOM elements that are appended to the Document `body` (Grid Menu, Column Picker, Select Filter/Editor, Context Menu, ...) and the style **will not** be applied with `:host` and so in most cases you would want to use `:root` to make a global change which will also work with elements appended to the `body`.

### Bootstrap support
The creation of `Aurelia-Slickgrid` works with `Bootstrap 4` and event the last `Bootstrap 5` version.
- [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-bs4-demo) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-bs4-demo/tree/master/src/examples/slickgrid)
- [Bootstrap 5 demo](https://ghiscoding.github.io/aurelia-slickgrid) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs5-demo)

### Other UI frameworks
Note that Bootstrap is totally optional, you could use any other UI framework, also 2 new themes were added in version `2.18.x`, first is a Material Design Theme and also a Salesforce Theme.
- Material Theme - [demo](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example27)
- Salesforce Theme - [demo](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example28)

For more demo, you can also take a look at my other repo (Slickgrid-Universal) [demos](https://ghiscoding.github.io/slickgrid-universal).  Also, note that Bootstrap is completely optional (and has been for some time), the other demo that I mentioned was created using only the [Bulma](https://bulma.io/documentation) CSS framework, you will also notice that only the Material & Salesforce Themes were used across these multiple examples.

Each of these Styling Themes are compiled in CSS and created from a SASS file, so you can use either or. Both Themes are shown in each Tree Data demo
- **Note:** you might need to refresh the page to see the theme correctly since the styling is global and if you change page, the style will follow on the next page (unless you refresh).

### SVG Icons
The 2 new Themes were created with only SVG icons, most of the icons were pulled from the [Material Design Icons](https://materialdesignicons.com/) set. If you wish to create your own set of SVG Icons, you can refer to the new [docs - SVG Icons](../styling/SVG-Icons.md)
-  [docs - SVG Icons](../styling/SVG-Icons.md).

**Note:** Just to point out that both the Fonts and SVG icons are supported, the default Bootstrap theme will keep Font-Awesome 4 so that it still works for everyone. You could however use SASS to override the Font and use SVG, again see the [docs - SVG Icons](../styling/SVG-Icons.md) for more details.
