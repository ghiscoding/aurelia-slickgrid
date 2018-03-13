# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.9.1"></a>
## [1.9.1](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.9.0...v1.9.1) (2018-03-13)


### Bug Fixes

* **formatter:** translate formatter was causing issues in some occasion ([8acdc28](https://github.com/ghiscoding/aurelia-slickgrid/commit/8acdc28))



<a name="1.9.0"></a>
# [1.9.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.7.1...v1.9.0) (2018-03-13)


### Bug Fixes

* **build:** incorrect type any ([5ffc0a1](https://github.com/ghiscoding/aurelia-slickgrid/commit/5ffc0a1))
* **formatter:** add throw error with instruction if missing params ([cbb01d9](https://github.com/ghiscoding/aurelia-slickgrid/commit/cbb01d9))
* **formatter:** multipleFormatter should pass value to next formatter ([bf6b006](https://github.com/ghiscoding/aurelia-slickgrid/commit/bf6b006))
* **pagination:** Pagination with BackendServiceApi was incorrect ([fba8750](https://github.com/ghiscoding/aurelia-slickgrid/commit/fba8750))
* **requireJS:** import for RequireJS should have /index ([b796c26](https://github.com/ghiscoding/aurelia-slickgrid/commit/b796c26))
* **sample:** fix the client-CLI sample ([407ba66](https://github.com/ghiscoding/aurelia-slickgrid/commit/407ba66))
* **sass:** all sass properties should have an override capability ([6d03cd7](https://github.com/ghiscoding/aurelia-slickgrid/commit/6d03cd7))
* **utilities:** move findOrDefault to a function ([#29](https://github.com/ghiscoding/aurelia-slickgrid/issues/29)) ([3d21548](https://github.com/ghiscoding/aurelia-slickgrid/commit/3d21548)), closes [#27](https://github.com/ghiscoding/aurelia-slickgrid/issues/27)


### Features

* **demo:** update demo pages with latest features ([5d4587d](https://github.com/ghiscoding/aurelia-slickgrid/commit/5d4587d))
* **event:** [#24](https://github.com/ghiscoding/aurelia-slickgrid/issues/24) add onGridStateChanged and onPaginationChanged events ([#28](https://github.com/ghiscoding/aurelia-slickgrid/issues/28)) ([b657e75](https://github.com/ghiscoding/aurelia-slickgrid/commit/b657e75))
* **service:** expose refreshBackendDataset for backend ([68c8266](https://github.com/ghiscoding/aurelia-slickgrid/commit/68c8266))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/ghiscoding/aurelia-slickgrid/compare/v1.6.0...v1.7.0) (2018-03-07)


### Bug Fixes

* **backend:** backend filter on delay was broken since GridState feature ([a25147d](https://github.com/ghiscoding/aurelia-slickgrid/commit/a25147d))
* **build:** fox all build errors ([3d24212](https://github.com/ghiscoding/aurelia-slickgrid/commit/3d24212))
* **doc:** updated contributing as per comment in [#10](https://github.com/ghiscoding/aurelia-slickgrid/issues/10) ([f437e39](https://github.com/ghiscoding/aurelia-slickgrid/commit/f437e39))
* **events:** every subscribed event should have an unsubscribe ([5abc223](https://github.com/ghiscoding/aurelia-slickgrid/commit/5abc223))
* **events:** every subscribed event should have an unsubscribe ([31b4e24](https://github.com/ghiscoding/aurelia-slickgrid/commit/31b4e24))
* **filter:** remove unused function ([00b3654](https://github.com/ghiscoding/aurelia-slickgrid/commit/00b3654))
* **graphql:** a column type of number should use EQ in GraphQL query ([a7da882](https://github.com/ghiscoding/aurelia-slickgrid/commit/a7da882))
* **grid:** delete duplicate gridOptions it was causing issues ([fb131aa](https://github.com/ghiscoding/aurelia-slickgrid/commit/fb131aa))
* **grid:** update SlickGrid version and configure Header Menu autoAlign ([211ea96](https://github.com/ghiscoding/aurelia-slickgrid/commit/211ea96))
* **odata:** OData string filter should also support operators ([0bf8928](https://github.com/ghiscoding/aurelia-slickgrid/commit/0bf8928))


### Features

* **doc:** install and setup "prepare-release" for changelog and commit ([3925050](https://github.com/ghiscoding/aurelia-slickgrid/commit/3925050))
* **filter:** add new InputNoPlaceholderFilter and global default filter ([739ff3f](https://github.com/ghiscoding/aurelia-slickgrid/commit/739ff3f))
* **formatter:** add a new HyperlinkURI formatter, you need to uriPrefix ([52de978](https://github.com/ghiscoding/aurelia-slickgrid/commit/52de978))
* **grid:** add inline editor undo command ([72ef747](https://github.com/ghiscoding/aurelia-slickgrid/commit/72ef747))
* **grid:** add Pagination page number input ([8a89c58](https://github.com/ghiscoding/aurelia-slickgrid/commit/8a89c58))
* **query:** add `excludeFromQuery` prop and use it for Row Selection ([cda0e39](https://github.com/ghiscoding/aurelia-slickgrid/commit/cda0e39))
* **queryFilter:** add new "queryFieldFilter" and "queryFieldSorter" ([9d2aae1](https://github.com/ghiscoding/aurelia-slickgrid/commit/9d2aae1))
* **selectEditors:** add select grid editors ([#22](https://github.com/ghiscoding/aurelia-slickgrid/issues/22)) ([5bd7215](https://github.com/ghiscoding/aurelia-slickgrid/commit/5bd7215))
