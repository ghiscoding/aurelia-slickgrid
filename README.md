# Aurelia-Slickgrid
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![NPM downloads](https://img.shields.io/npm/dy/aurelia-slickgrid)](https://npmjs.org/package/aurelia-slickgrid)
[![npm version](https://img.shields.io/npm/v/aurelia-slickgrid.svg?logo=npm&logoColor=fff&label=npm)](https://www.npmjs.com/package/aurelia-slickgrid)

[![Actions Status](https://github.com/ghiscoding/aurelia-slickgrid/workflows/CI%20Build/badge.svg)](https://github.com/ghiscoding/aurelia-slickgrid/actions)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg?logo=cypress)](https://www.cypress.io/)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
<!-- [![codecov](https://codecov.io/gh/ghiscoding/aurelia-slickgrid/branch/master/graph/badge.svg)](https://codecov.io/gh/ghiscoding/aurelia-slickgrid) -->

### Brief introduction
One of the best JavasSript datagrid [SlickGrid](https://github.com/mleibman/SlickGrid), which was originally developed by @mleibman, is now available to the Aurelia world. SlickGrid beats most other datagrids in terms of features, customizability and performance (running smoothly with even a million rows). Aurelia-Slickgrid is a wrapper on top of [Slickgrid-Universal](https://github.com/ghiscoding/slickgrid-universal/) (which is required), in the early beginning we used the `6pac/SlickGrid` fork but that was dropped in >=[v7.0](https://github.com/ghiscoding/aurelia-slickgrid/releases/tag/v7.0.3) since Slickgrid-Universal is now a standalone project. SlickGrid was also recently rewritten to be browser native (no more ~jQuery~ 🎉).

## Documentation
📕 [Documentation](https://ghiscoding.gitbook.io/aurelia-slickgrid/getting-started/quick-start) website powered by GitBook.

## Installation

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https:///pr.new/ghiscoding/aurelia-slickgrid)

Refer to the **[Docs - Quick Start](https://ghiscoding.gitbook.io/aurelia-slickgrid/getting-started/quick-start)** and/or clone the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository. Please review the [Documentation](https://ghiscoding.gitbook.io/aurelia-slickgrid/) website before opening any new issue, also consider asking installation and/or general questions on [Stack Overflow](https://stackoverflow.com/search?tab=newest&q=slickgrid) unless you think there's a bug with the library.

```sh
npm install aurelia-slickgrid
```
Install any optional Slickgrid-Universal dependencies, for example Excel Export
```sh
npm install @slickgrid-universal/excel-export
```

### Versions Compatibility

> **Note** please be aware that only the latest version of Aurelia-Slickgrid is supported and will receive bug fixes. The reason older versions are not supported is simply because it's already a lot of work to maintain for a single developer.

| Aurelia-Slickgrid | Aurelia version | Migration Guide | Notes |
|-------------------|-----------------|-----------------|------|
| 7.x               | Aurelia 2       | [Migration 7.x](https://ghiscoding.gitbook.io/aurelia-slickgrid/migrations/migration-to-7.x)     | merge SlickGrid into Slickgrid-Universal, requires Slickgrid-Universal [4.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v4.0.2) version |
| 6.x               | 1.x             | [Migration 6.x](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Migration-to-6.x)     | removal of jQuery (now uses browser native code), requires Slickgrid-Universal [3.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v3.0.0) version |
| 5.x               | 1.x             | [Migration 5.x](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Migration-to-5.x)     | removal of jQueryUI, requires Slickgrid-Universal [2.x](https://github.com/ghiscoding/slickgrid-universal/releases/tag/v2.0.0) version |

For a full compatibility table of Aurelia-Slickgrid with Slickgrid-Universal, you can consult the [Versions Compatibility Table - Wiki](https://github.com/ghiscoding/aurelia-slickgrid/wiki/Versions-Compatibility-Table)

### Demo page

`Aurelia-Slickgrid` works with all `Bootstrap` versions, you can see a demo of each one below. It also with any other framework like Material or Bulma and there are also extra styling themes for not just Bootstrap but also Material & Salesforce which are also available. You can also use different SVG icons, you may want to look at the [Docs - SVG Icons](https://ghiscoding.gitbook.io/aurelia-slickgrid/styling/svg-icons)
- [Bootstrap 5 demo](https://ghiscoding.github.io/aurelia-slickgrid) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs5-demo)
- [Bootstrap 5 demo with Single Locale](https://ghiscoding.github.io/aurelia-slickgrid-demos) / [examples repo](https://github.com/ghiscoding/aurelia-slickgrid-demos/tree/master/webpack-bs5-demo-with-locales)

There are also 2 new Themes, Material & Salesforce that are available as well and if you wish to use SVG then take a look at the [Docs - SVG Icons](https://ghiscoding.gitbook.io/aurelia-slickgrid/styling/svg-icons).

#### Working Demos
For a complete set of working demos (over 30 examples), we strongly suggest you to clone the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository (instructions are provided in the demo repo). The repo provides multiple demos and they are updated every time a new version is out, so it is updated frequently and is also used as the GitHub live demo page for both the [Bootstrap 5 demo](https://ghiscoding.github.io/aurelia-slickgrid) and [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-demos).

For a complete working set of demos, you can clone the [Aurelia-Slickgrid Demos](https://github.com/ghiscoding/aurelia-slickgrid-demos) repository (instructions are provided in the demo repo). This repo provides multiple samples (RequireJS, WebPack, CLI, ...) and it is also worth to know that the 2 WebPacks demos are updated frequently since they are the actual live GitHub [Bootstrap 4 demo](https://ghiscoding.github.io/aurelia-slickgrid-demos/#/slickgrid) / [Bootstrap 5 demo](https://ghiscoding.github.io/aurelia-slickgrid).

## License
[MIT License](LICENSE)

### Like it? ⭐ it
You like and use **Aurelia-Slickgrid**? Be sure to upvote ⭐ and feel free to contribute. 👷👷‍♀️

#### Like my work?
You could ⭐ the lib and maybe support me with cafeine [☕](https://ko-fi.com/ghiscoding). Thanks.

<a href='https://ko-fi.com/ghiscoding' target='_blank'><img height='32' style='border:0px;height:32px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />

### Latest News & Releases
Check out the [Releases](https://github.com/ghiscoding/aurelia-slickgrid/releases) section for all latest News & Releases.

### Tested with [Jest](https://jestjs.io/) (Unit Tests) - [Cypress](https://www.cypress.io/) (E2E Tests)
Slickgrid-Universal has **100%** Unit Test Coverage and all Slickgrid-React Examples are tested with [Cypress](https://www.cypress.io/) as E2E tests.
