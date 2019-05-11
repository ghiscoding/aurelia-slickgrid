# Aurelia-Slickgrid
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![npm version](https://badge.fury.io/js/aurelia-slickgrid.svg)](https://badge.fury.io/js/aurelia-slickgrid)
[![NPM downloads](https://img.shields.io/npm/dt/aurelia-slickgrid.svg)](https://npmjs.org/package/aurelia-slickgrid)
[![CircleCI](https://circleci.com/gh/ghiscoding/aurelia-slickgrid/tree/master.svg?style=shield)](https://circleci.com/gh/ghiscoding/workflows/aurelia-slickgrid/tree/master)
[![codecov](https://codecov.io/gh/ghiscoding/aurelia-slickgrid/branch/master/graph/badge.svg)](https://codecov.io/gh/ghiscoding/aurelia-slickgrid)

One of the best javascript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid) which was originally developed by @mleibman is now available to Aurelia. I have tried and used a few datagrids and SlickGrid beats most of them in terms of functionalities and performance (it can easily deal with even a million row). We will be using [6pac SlickGrid fork](https://github.com/6pac/SlickGrid/), this the most active fork since the original @mleibman fork was closed some time ago by his author personal reasons. Also worth to know, I also contributed a lot to that fork to benefit Aurelia-Slickgrid.

### NPM Package
[Aurelia-Slickgrid on NPM](https://www.npmjs.com/package/aurelia-slickgrid)

## License
[MIT License](LICENSE)

### Demo page
`Aurelia-Slickgrid` supports both `Bootstrap 3` and `Bootstrap 4`, you can see a demo of each one below.
- [Bootstrap 3 demo](https://ghiscoding.github.io/aurelia-slickgrid) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid/tree/master/aurelia-slickgrid/src/examples/slickgrid)
- [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-bs4-demo) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-bs4-demo/tree/master/src/examples/slickgrid)

#### Working Demos
For complete working local demos, you can clone the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository (instruction are provided in that repository). The 2 WebPacks demos are updated frequently and they are the actual [Bootstrap 3 demo](https://ghiscoding.github.io/aurelia-slickgrid) / [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-bs4-demo/#/slickgrid).

## Installation
Refer to the [Wiki - HOWTO Step by Step](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO--Step-by-Step)

## Wiki / Documentation
The Wiki is where all the documentation and instructions will go, so please consult the [Aurelia-Slickgrid - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki) before opening any issues. The [Wiki - HOWTO](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO--Step-by-Step) is a great place to start with.

## Main features
You can see some screenshots below and the instructions down below and if that is not enough for you to decide, head over to the [Wiki - Main Features](https://github.com/ghiscoding/aurelia-slickgrid/wiki).

## Contributions/Comments
Contributions are welcome, this is what the community is for. If you wish to suggest something and/or want to make a PR (Pull Request), please feel free to do so.

## Use it, like it?
You like and use this great library `Aurelia-Slickgrid`? You can always upvote :star: and/or contribute :)

## Like my work?
If you like my work, you can also support me with caffeine :smile:
[Buy Me a Coffee](https://ko-fi.com/N4N679OT)

## Screenshots

Screenshots from the demo app with the `Bootstrap` theme (that is the only available theme, but there is a lot of SASS variables to make it look like Material, or other theme if you wish to. If you create a new theme, please submit a PR).

### Slickgrid example with Formatters (last column shown is a custom Formatter)

#### You can also see the Grid Menu opened (aka hambuger menu)

![Default Slickgrid Example](/screenshots/formatters.png)

### Filter and Sort (clientside with DataView)

![Slickgrid Server Side](/screenshots/filter_and_sort.png)

### Editors and/or onCellClick

![Editors](/screenshots/editors.png)

### Pinned (aka frozen) Columns/Rows

![Slickgrid Server Side](/screenshots/frozen.png)

### Slickgrid Example with Server Side (Filter/Sort/Pagination)
#### Comes with OData & GraphQL support (you can implement custom too)

![Slickgrid Server Side](/screenshots/pagination.png)
