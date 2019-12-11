import { MenuItem } from './menuItem.interface';

export interface MenuOptionItem extends MenuItem {
  /** An option to be passed to the onOptionSelected event callback handler (when using "optionItems"). */
  option: any;
}
