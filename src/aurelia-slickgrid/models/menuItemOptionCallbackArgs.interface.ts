import { MenuItemCallbackArgs } from './menuItemCallbackArgs.interface';

export interface MenuItemOptionCallbackArgs extends MenuItemCallbackArgs {
  /** An option to be passed to the onOptionSelected event handlers (when using "optionItems"). */
  option: any;
}
