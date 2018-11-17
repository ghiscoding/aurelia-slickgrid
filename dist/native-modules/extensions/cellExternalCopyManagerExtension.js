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
var CellExternalCopyManagerExtension = /** @class */ (function () {
    function CellExternalCopyManagerExtension(extensionUtility, sharedService) {
        this.extensionUtility = extensionUtility;
        this.sharedService = sharedService;
    }
    CellExternalCopyManagerExtension.prototype.dispose = function () {
        if (this._extension && this._extension.destroy) {
            this._extension.destroy();
        }
    };
    CellExternalCopyManagerExtension.prototype.register = function () {
        var _this = this;
        if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
            // dynamically import the SlickGrid plugin with requireJS
            this.extensionUtility.loadExtensionDynamically(ExtensionName.cellExternalCopyManager);
            this.createUndoRedoBuffer();
            this.hookUndoShortcutKey();
            var newRowIds_1 = 0;
            var pluginOptions = {
                clipboardCommandHandler: function (editCommand) {
                    _this.undoRedoBuffer.queueAndExecuteCommand.call(_this.undoRedoBuffer, editCommand);
                },
                dataItemColumnValueExtractor: function (item, columnDef) {
                    // when grid or cell is not editable, we will possibly evaluate the Formatter if it was passed
                    // to decide if we evaluate the Formatter, we will use the same flag from Export which is "exportWithFormatter"
                    if (!_this.sharedService.gridOptions.editable || !columnDef.editor) {
                        var isEvaluatingFormatter = (columnDef.exportWithFormatter !== undefined) ? columnDef.exportWithFormatter : (_this.sharedService.gridOptions.exportOptions && _this.sharedService.gridOptions.exportOptions.exportWithFormatter);
                        if (columnDef.formatter && isEvaluatingFormatter) {
                            var formattedOutput = columnDef.formatter(0, 0, item[columnDef.field], columnDef, item, _this.sharedService.grid);
                            if (columnDef.sanitizeDataExport || (_this.sharedService.gridOptions.exportOptions && _this.sharedService.gridOptions.exportOptions.sanitizeDataExport)) {
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
                newRowCreator: function (count) {
                    for (var i = 0; i < count; i++) {
                        var item = {
                            id: 'newRow_' + newRowIds_1++
                        };
                        _this.sharedService.grid.getData().addItem(item);
                    }
                }
            };
            this.sharedService.grid.setSelectionModel(new Slick.CellSelectionModel());
            this._extension = new Slick.CellExternalCopyManager(pluginOptions);
            this.sharedService.grid.registerPlugin(this._extension);
            return this._extension;
        }
        return null;
    };
    /** Create an undo redo buffer used by the Excel like copy */
    CellExternalCopyManagerExtension.prototype.createUndoRedoBuffer = function () {
        var commandQueue = [];
        var commandCtr = 0;
        this.undoRedoBuffer = {
            queueAndExecuteCommand: function (editCommand) {
                commandQueue[commandCtr] = editCommand;
                commandCtr++;
                editCommand.execute();
            },
            undo: function () {
                if (commandCtr === 0) {
                    return;
                }
                commandCtr--;
                var command = commandQueue[commandCtr];
                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.undo();
                }
            },
            redo: function () {
                if (commandCtr >= commandQueue.length) {
                    return;
                }
                var command = commandQueue[commandCtr];
                commandCtr++;
                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.execute();
                }
            }
        };
    };
    /** Attach an undo shortcut key hook that will redo/undo the copy buffer */
    CellExternalCopyManagerExtension.prototype.hookUndoShortcutKey = function () {
        var _this = this;
        // undo shortcut
        $(document).keydown(function (e) {
            if (e.which === 90 && (e.ctrlKey || e.metaKey)) {
                if (e.shiftKey) {
                    _this.undoRedoBuffer.redo();
                }
                else {
                    _this.undoRedoBuffer.undo();
                }
            }
        });
    };
    CellExternalCopyManagerExtension = __decorate([
        singleton(true),
        inject(ExtensionUtility, SharedService)
    ], CellExternalCopyManagerExtension);
    return CellExternalCopyManagerExtension;
}());
export { CellExternalCopyManagerExtension };
//# sourceMappingURL=cellExternalCopyManagerExtension.js.map