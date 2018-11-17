import { Extension } from '../models/index';
import { SharedService } from '../services/shared.service';
import { ExtensionUtility } from './extensionUtility';
export declare class CellExternalCopyManagerExtension implements Extension {
    private extensionUtility;
    private sharedService;
    private _extension;
    undoRedoBuffer: any;
    constructor(extensionUtility: ExtensionUtility, sharedService: SharedService);
    dispose(): void;
    register(): any;
    /** Create an undo redo buffer used by the Excel like copy */
    private createUndoRedoBuffer();
    /** Attach an undo shortcut key hook that will redo/undo the copy buffer */
    private hookUndoShortcutKey();
}
