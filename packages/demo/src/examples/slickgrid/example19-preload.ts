import { customElement } from 'aurelia';

@customElement({
  name: 'example19-preload',
  template: `<div class="container" style="margin-top: 10px">
    <h4>
      <i class="mdi mdi-sync mdi-spin mdi-50px"></i>
      Loading...
    </h4>
  </div>`
})
export class Example19Preload {
}
