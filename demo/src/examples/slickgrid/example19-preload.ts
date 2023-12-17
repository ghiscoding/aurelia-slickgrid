import { customElement } from 'aurelia';

@customElement({
  name: 'example19-preload',
  template: `<div class="container" style="margin-top: 10px">
    <h4>
      <i class="fa fa-refresh fa-spin fa-2x fa-fw"></i>
      Loading...
    </h4>
  </div>`
})
export class Example19Preload {
}
