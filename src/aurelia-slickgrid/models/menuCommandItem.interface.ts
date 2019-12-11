import { MenuItem } from './menuItem.interface';

export interface MenuCommandItem extends MenuItem {
  /** A command identifier to be passed to the onCommand event callback handler (when using "commandItems"). */
  command: string;
}
