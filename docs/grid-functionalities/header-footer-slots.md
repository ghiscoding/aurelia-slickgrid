### Description
You can add Header and/or Footer to your grid by using the `#header` and `#footer` Slots, it's as simple as that. Using these slots also has the advantage of being contained in the same container making them the same width as the grid container.

### Demo

[Demo](https://ghiscoding.github.io/aurelia-slickgrid/#/example29) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example29.ts)

### Basic Usage

##### Component

```vue
<template>
  <slickgrid-vue v-model:options="gridOptions" v-model:columns="columnDefinitions" v-model:data="dataset" grid-id="grid2">
    <template #header>
      <div class="custom-header-slot">
        <h3>Grid with header and footer slot</h3>
      </div>
    </template>
    <template #footer>
      <div class="custom-footer-slot">
        <CustomFooter />
      </div>
    </template>
  </slickgrid-vue>
</template>
```

###### ViewModel

```html
<aurelia-slickgrid grid-id="grid"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset">
  <div au-slot="slickgrid-header" class="custom-header-slot">
    <h3>Grid Header</h3>
  </div>
  <div au-slot="slickgrid-footer" class="custom-footer-slot">
    <h3>Grid Footer</h3>
  </div>
</aurelia-slickgrid>
````
