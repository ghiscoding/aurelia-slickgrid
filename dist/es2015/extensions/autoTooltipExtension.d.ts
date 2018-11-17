import { SharedService } from '../services/shared.service';
import { Extension } from '../models/index';
import { ExtensionUtility } from './extensionUtility';
export declare class AutoTooltipExtension implements Extension {
    private extensionUtility;
    private sharedService;
    private _extension;
    constructor(extensionUtility: ExtensionUtility, sharedService: SharedService);
    dispose(): void;
    register(): any;
}
