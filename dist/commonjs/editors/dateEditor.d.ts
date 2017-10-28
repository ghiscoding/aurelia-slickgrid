import 'flatpickr/dist/flatpickr.min.css';
import { Editor } from './../models';
export declare class DateEditor implements Editor {
    private args;
    $input: any;
    flatInstance: any;
    defaultDate: string;
    constructor(args: any);
    init(): void;
    destroy(): void;
    show(): void;
    hide(): void;
    focus(): void;
    loadValue(item: any): void;
    serializeValue(): any;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): any;
}
