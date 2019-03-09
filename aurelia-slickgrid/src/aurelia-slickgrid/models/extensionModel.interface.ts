import { Extension } from './extension.interface';
import { ExtensionName } from './extensionName.enum';

export interface ExtensionModel {
  /** Name of the Aurelia-Slickgrid Extension */
  name: ExtensionName;

  /** Addon is the object instance of the 3rd party SlickGrid Control or Plugin */
  addon: any;

  /** Extension Service (in Aurelia-Slickgrid) */
  class: Extension | null;
}
