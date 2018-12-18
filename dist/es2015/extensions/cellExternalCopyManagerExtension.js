var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { singleton, inject } from 'aurelia-framework';
import { ExtensionName } from '../models/index';
import { sanitizeHtmlToText } from '../services/utilities';
import { SharedService } from '../services/shared.service';
import { ExtensionUtility } from './extensionUtility';
import * as $ from 'jquery';
let CellExternalCopyManagerExtension = class CellExternalCopyManagerExtension {
    constructor(extensionUtility, sharedService) {
        this.extensionUtility = extensionUtility;
        this.sharedService = sharedService;
    }
    dispose() {
        if (this._extension && this._extension.destroy) {
            this._extension.destroy();
        }
    }
    register() {
        if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
            // dynamically import the SlickGrid plugin with requireJS
            this.extensionUtility.loadExtensionDynamically(ExtensionName.cellExternalCopyManager);
            this.createUndoRedoBuffer();
            this.hookUndoShortcutKey();
            let newRowIds = 0;
            const pluginOptions = {
                clipboardCommandHandler: (editCommand) => {
                    this.undoRedoBuffer.queueAndExecuteCommand.call(this.undoRedoBuffer, editCommand);
                },
                dataItemColumnValueExtractor: (item, columnDef) => {
                    // when grid or cell is not editable, we will possibly evaluate the Formatter if it was passed
                    // to decide if we evaluate the Formatter, we will use the same flag from Export which is "exportWithFormatter"
                    if (!this.sharedService.gridOptions.editable || !columnDef.editor) {
                        const isEvaluatingFormatter = (columnDef.exportWithFormatter !== undefined) ? columnDef.exportWithFormatter : (this.sharedService.gridOptions.exportOptions && this.sharedService.gridOptions.exportOptions.exportWithFormatter);
                        if (columnDef.formatter && isEvaluatingFormatter) {
                            const formattedOutput = columnDef.formatter(0, 0, item[columnDef.field], columnDef, item, this.sharedService.grid);
                            if (columnDef.sanitizeDataExport || (this.sharedService.gridOptions.exportOptions && this.sharedService.gridOptions.exportOptions.sanitizeDataExport)) {
                                return sanitizeHtmlToText(formattedOutput);
                            }
                            return formattedOutput;
                        }
                    }
                    // else use the default "dataItemColumnValueExtractor" from the plugin itself
                    // we can do that by setting back the getter with null
                    return null;
                },
                readOnlyMode: false,
                includeHeaderWhenCopying: false,
                newRowCreator: (count) => {
                    for (let i = 0; i < count; i++) {
                        const item = {
                            id: 'newRow_' + newRowIds++
                        };
                        this.sharedService.grid.getData().addItem(item);
                    }
                }
            };
            this.sharedService.grid.setSelectionModel(new Slick.CellSelectionModel());
            this._extension = new Slick.CellExternalCopyManager(pluginOptions);
            this.sharedService.grid.registerPlugin(this._extension);
            return this._extension;
        }
        return null;
    }
    /** Create an undo redo buffer used by the Excel like copy */
    createUndoRedoBuffer() {
        const commandQueue = [];
        let commandCtr = 0;
        this.undoRedoBuffer = {
            queueAndExecuteCommand: (editCommand) => {
                commandQueue[commandCtr] = editCommand;
                commandCtr++;
                editCommand.execute();
            },
            undo: () => {
                if (commandCtr === 0) {
                    return;
                }
                commandCtr--;
                const command = commandQueue[commandCtr];
                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.undo();
                }
            },
            redo: () => {
                if (commandCtr >= commandQueue.length) {
                    return;
                }
                const command = commandQueue[commandCtr];
                commandCtr++;
                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.execute();
                }
            }
        };
    }
    /** Attach an undo shortcut key hook that will redo/undo the copy buffer */
    hookUndoShortcutKey() {
        // undo shortcut
        $(document).keydown((e) => {
            if (e.which === 90 && (e.ctrlKey || e.metaKey)) { // CTRL + (shift) + Z
                if (e.shiftKey) {
                    this.undoRedoBuffer.redo();
                }
                else {
                    this.undoRedoBuffer.undo();
                }
            }
        });
    }
};
CellExternalCopyManagerExtension = __decorate([
    singleton(true),
    inject(ExtensionUtility, SharedService)
], CellExternalCopyManagerExtension);
export { CellExternalCopyManagerExtension };
//# sourceMappingURL=cellExternalCopyManagerExtension.js.map