import { CustomGridMenu } from './customGridMenu.interface';

export interface GridMenu {
  customItems?: CustomGridMenu[];
  customTitle?: string;
  columnTitle?: string;
  forceFitTitle?: string;
  iconImage?: string;
  iconCssClass?: string;
  leaveOpen?: boolean;
  syncResizeTitle?: string;
  menuWidth?: number;
  resizeOnShowHeaderRow?: boolean;

  onBeforeMenuShow?: (e: Event, args: any) => void;
  onMenuClose?: (e: Event, args: any) => void;
  onCommand?: (e: Event, args: any) => void;
}
