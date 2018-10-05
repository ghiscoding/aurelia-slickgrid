import { Column } from './column.interface';
import { ElementPosition } from './elementPosition.interface';
export interface EditorArgs {
    column: Column;
    container: any;
    grid: any;
    gridPosition: ElementPosition;
    item: any;
    position: ElementPosition;
    cancelChanges?: () => void;
    commitChanges?: () => void;
}
