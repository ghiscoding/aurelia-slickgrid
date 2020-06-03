import { Column } from './column.interface';
import { ElementPosition } from './elementPosition.interface';
import { SlickGrid } from './slickGrid.interface';

export interface EditorArgs {
  column: Column;
  container: HTMLDivElement;
  grid: SlickGrid;
  gridPosition: ElementPosition;
  item: any;
  position: ElementPosition;
  cancelChanges?: () => void;
  commitChanges?: () => void;
}
