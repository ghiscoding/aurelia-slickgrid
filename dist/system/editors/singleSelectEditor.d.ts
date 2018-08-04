import { I18N } from 'aurelia-i18n';
import { Column, Editor, EditorValidator, EditorValidatorOutput, GridOption, MultipleSelectOption, SelectOption } from '../models/index';
import { CollectionService } from '../services/index';
/**
 * Slickgrid editor class for single select lists
 */
export declare class SingleSelectEditor implements Editor {
    private collectionService;
    private i18n;
    private args;
    /** The JQuery DOM element */
    $editorElm: any;
    /** Editor Multiple-Select options */
    editorElmOptions: MultipleSelectOption;
    /** The multiple-select options for a single select */
    defaultOptions: any;
    /** The default item value that is set */
    defaultValue: any;
    /** The options label/value object to use in the select list */
    collection: SelectOption[];
    /** The property name for labels in the collection */
    labelName: string;
    /** The property name for a prefix that can be added to the labels in the collection */
    labelPrefixName: string;
    /** The property name for a suffix that can be added to the labels in the collection */
    labelSuffixName: string;
    /** The property name for values in the collection */
    valueName: string;
    /** Grid options */
    gridOptions: GridOption;
    /** Do we translate the label? */
    enableTranslateLabel: boolean;
    constructor(collectionService: CollectionService, i18n: I18N, args: any);
    /** Get Column Definition object */
    readonly columnDef: Column;
    /** Get Column Editor object */
    readonly columnEditor: any;
    /**
     * The current selected value from the collection
     */
    readonly currentValue: any;
    /** Get the Validator function, can be passed in Editor property or Column Definition */
    readonly validator: EditorValidator;
    init(): void;
    applyValue(item: any, state: any): void;
    destroy(): void;
    loadValue(item: any): void;
    serializeValue(): any;
    focus(): void;
    isValueChanged(): boolean;
    validate(): EditorValidatorOutput;
    /**
     * Automatically adjust the multiple-select dropup or dropdown by available space
     */
    private autoAdjustDropPosition(multipleSelectDomElement, multipleSelectOptions);
    /** Build the template HTML string */
    private buildTemplateHtmlString(collection);
    private createDomElement(editorTemplate);
    private refresh();
}
