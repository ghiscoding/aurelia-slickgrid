import { MenuItemCallbackArgs } from './menuItemCallbackArgs.interface';

export interface MenuItemCommandCallbackArgs extends MenuItemCallbackArgs {
  /** Menu command identifier. */
  command: string;
}
