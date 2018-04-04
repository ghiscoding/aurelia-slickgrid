import { Editor } from './../models/index';
import { I18N } from 'aurelia-i18n';
export declare class DateEditor implements Editor {
    private i18n;
    private args;
    $input: any;
    flatInstance: any;
    defaultDate: string;
    constructor(i18n: I18N, args: any);
    init(): void;
    loadFlatpickrLocale(locale: string): any;
    destroy(): void;
    show(): void;
    hide(): void;
    focus(): void;
    save(): void;
    loadValue(item: any): void;
    serializeValue(): any;
    applyValue(item: any, state: any): void;
    isValueChanged(): boolean;
    validate(): any;
}
