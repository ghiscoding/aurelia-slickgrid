import { GridOption } from './models/index';
import { GlobalGridOptions } from './global-grid-options';

export class SlickgridConfig {
  options: Partial<GridOption>;

  constructor() {
    this.options = GlobalGridOptions;
  }
}
