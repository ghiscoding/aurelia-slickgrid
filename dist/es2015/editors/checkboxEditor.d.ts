import { Column, Editor, EditorValidator, EditorValidatorOutput } from './../models/index';
export declare class CheckboxEditor implements Editor {
    private args;
    $input: any;
    defaultValue: boolean;
    constructor(args: any);
    /** Get Column Definition object */
    readonly columnDef: Column;
    /** Get Column Editor object */
    readonly columnEditor: any;
    /** Get the Validator function, can be passed in Editor property or Column Definition */
    readonly validator: EditorValidator;
    init(): void;
    destroy(): void;
    focus(): void;
    hide(): void;
    show(): void;
    loadValue(item: any): void;
    preClick(): void;
    serializeValue(): boolean;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): EditorValidatorOutput;
}
