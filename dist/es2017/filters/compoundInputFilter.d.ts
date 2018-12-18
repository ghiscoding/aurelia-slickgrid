import { I18N } from 'aurelia-i18n';
import { Column, Filter, FilterArguments, FilterCallback, OperatorString, OperatorType, SearchTerm } from './../models/index';
export declare class CompoundInputFilter implements Filter {
    protected i18n: I18N;
    private _clearFilterTriggered;
    private _inputType;
    private $filterElm;
    private $filterInputElm;
    private $selectOperatorElm;
    private _operator;
    grid: any;
    searchTerms: SearchTerm[];
    columnDef: Column;
    callback: FilterCallback;
    constructor(i18n: I18N);
    /** Getter for the Grid Options pulled through the Grid Object */
    private readonly gridOptions;
    /** Getter of input type (text, number, password) */
    /** Setter of input type (text, number, password) */
    inputType: string;
    /** Getter of the Operator to use when doing the filter comparing */
    /** Getter of the Operator to use when doing the filter comparing */
    operator: OperatorType | OperatorString;
    /**
     * Initialize the Filter
     */
    init(args: FilterArguments): void;
    /**
     * Clear the filter value
     */
    clear(): void;
    /**
     * destroy the filter
     */
    destroy(): void;
    /**
     * Set value(s) on the DOM element
     */
    setValues(values: SearchTerm[]): void;
    private buildInputHtmlString;
    private buildSelectOperatorHtmlString;
    private getOptionValues;
    /**
     * Create the DOM element
     */
    private createDomElement;
    /** Event trigger, could be called by the Operator dropdown or the input itself */
    private onTriggerEvent;
}
