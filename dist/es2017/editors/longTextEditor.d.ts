import { I18N } from 'aurelia-i18n';
import { Column, Editor, EditorValidator, EditorValidatorOutput, HtmlElementPosition } from './../models/index';
export declare class LongTextEditor implements Editor {
    private i18n;
    private args;
    $input: any;
    $wrapper: any;
    defaultValue: any;
    constructor(i18n: I18N, args: any);
    /** Get Column Definition object */
    readonly columnDef: Column;
    /** Get Column Editor object */
    readonly columnEditor: any;
    /** Get the Validator function, can be passed in Editor property or Column Definition */
    readonly validator: EditorValidator;
    init(): void;
    handleKeyDown(e: any): void;
    save(): void;
    cancel(): void;
    hide(): void;
    show(): void;
    position(position: HtmlElementPosition): void;
    destroy(): void;
    focus(): void;
    loadValue(item: any): void;
    serializeValue(): any;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): EditorValidatorOutput;
}
