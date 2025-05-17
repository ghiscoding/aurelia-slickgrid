import type { IAppRoot, ICustomElementController } from '@aurelia/runtime-html';

export interface AureliaViewOutput {
  root?: IAppRoot<object>;
  controller?: ICustomElementController<any>;
}
