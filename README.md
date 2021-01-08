# Aurelia-Slickgrid
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![npm version](https://badge.fury.io/js/aurelia-slickgrid.svg)](https://badge.fury.io/js/aurelia-slickgrid)
[![NPM downloads](https://img.shields.io/npm/dy/aurelia-slickgrid.svg)](https://npmjs.org/package/aurelia-slickgrid)

[![Actions Status](https://github.com/ghiscoding/aurelia-slickgrid/workflows/GitHub%20Actions/badge.svg)](https://github.com/ghiscoding/aurelia-slickgrid/actions)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![codecov](https://codecov.io/gh/ghiscoding/aurelia-slickgrid/branch/master/graph/badge.svg)](https://codecov.io/gh/ghiscoding/aurelia-slickgrid)

One of the best javascript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid) which was originally developed by @mleibman is now available to Aurelia. I have used a few datagrids and SlickGrid beats most of them in terms of functionalities and performance (it can easily deal with even a million row). We will be using the [6pac/SlickGrid](https://github.com/6pac/SlickGrid/) fork, this is the most active fork since the original @mleibman fork was closed some time ago by his author for personal reasons. Also worth to know, I also contributed a lot to the 6pac/SlickGrid fork for the benefit of Aurelia-Slickgrid.

### NPM Package
[Aurelia-Slickgrid on NPM](https://www.npmjs.com/package/aurelia-slickgrid)

### License
[MIT License](LICENSE)

### Like it? :star: it
You like and use this great library `Aurelia-Slickgrid`? Be sure to upvote :star: and feel free to contribute :construction_worker:

### Like my work?
If you like my work, you can also support me with caffeine
[Buy Me a Coffee](https://ko-fi.com/N4N679OT) :coffee:

I certainly drank many coffees to build and keep adding features for this great library.

### Latest News & Releases
Check out the [Releases](https://github.com/ghiscoding/aurelia-slickgrid/releases) section for all latest News & Releases.

## Fully Tested with [Jest](https://jestjs.io/) (Unit Tests) - [Cypress](https://www.cypress.io/) (E2E tests)
Aurelia-Slickgrid reached **100%** Test Coverage, we are talking about +10,000 lines of code (+2,700 unit tests) that are now fully tested with [Jest](https://jestjs.io/). There are also over +400 Cypress E2E tests to cover most UI functionalities on nearly all Examples of Aurelia-Slickgrid.

## Installation
Refer to the **[Wiki - HOWTO Step by Step](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO--Step-by-Step)** and/or the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository. Please don't open any issue unless you have followed these steps (from the Wiki), and if any of the steps are incorrect or confusing, then please let me know.

**NOTE:** if you have any question, please consider asking installation and/or general questions on [Stack Overflow](https://stackoverflow.com/search?tab=newest&q=slickgrid)

### Demo page

`Aurelia-Slickgrid` supports both `Bootstrap 3`, `Bootstrap 4` and even `Bootstrap 5`, you can see a demo of each one below.
- [Bootstrap 3 demo](https://ghiscoding.github.io/aurelia-slickgrid) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs3-demo)
- [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-demos) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs4-demo)
- [Bootstrap 5 repo (no live demo)](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs5-demo)

There are also 2 new Themes, Material & Salesforce that are available as well and if you wish to use SVG then take a look at the [Wiki - SVG Icons](https://github.com/ghiscoding/aurelia-slickgrid/wiki/SVG--Icons).

#### Working Demos
For complete working local demos, you can clone the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository (instruction are provided in the repo). This repo provides multiple samples (RequireJS, WebPack, CLI, ...) and also worth to know that the 2 WebPacks demos are updated frequently since they are the actual [Bootstrap 3 demo](https://ghiscoding.github.io/aurelia-slickgrid) / [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-demos/#/slickgrid).

## Wiki / Documentation
The Wiki is where all the documentation and instructions will go, so please consult the [Aurelia-Slickgrid - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki) before opening any issues. The [Wiki - HOWTO](https://github.com/ghiscoding/aurelia-slickgrid/wiki/HOWTO--Step-by-Step) is a great place to start with.

## Usage

#### How to load data with `Fetch-Client` or `Http-Client`?
You might notice that all demos are made with mocked dataset that are embedded in each examples, that is mainly for demo purposes, but you might be wondering how to connect this with an `FetchClient`? Easy... just replace the mocked data, assigned to the `dataset` property, by your `FetchClient` call and that's it. The `dataset` property can be changed at any time, which is why you can use local data and/or connect it to a `Promise` or an async call with `FetchClient` (internally it's just a SETTER that refreshes the grid). See [Example 22](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example22) for a demo showing how to load a JSON file with `FetchClient`.

## Main features
You can see some screenshots below as well as instructions underneat them and if that is not enough for you to decide, head over to the [Wiki - Main Features](https://github.com/ghiscoding/aurelia-slickgrid/wiki).

## Screenshots

Screenshots from the demo app with the `Bootstrap` theme.

### Slickgrid example with Formatters (last column shown is a custom Formatter)

#### You can also see the Grid Menu opened (aka hambuger menu)

![Default Slickgrid Example](/screenshots/formatters.png)

### Filter and Sort (clientside with DataView)

![Filter and Sort](/screenshots/filter_and_sort.png)

### Editors and/or onCellClick

![Editors](/screenshots/editors.png)

### Pinned (aka frozen) Columns/Rows

![Pinned Columns/Rows](/screenshots/frozen.png)

### Draggable Grouping & Aggregators

![Draggable Grouping](/screenshots/draggable-grouping.png)

### Slickgrid Example with Server Side (Filter/Sort/Pagination)
#### Comes with OData & GraphQL support (you can implement custom too)

![Slickgrid Server Side](/screenshots/pagination.png)
