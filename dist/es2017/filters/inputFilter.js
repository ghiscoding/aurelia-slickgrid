import * as $ from 'jquery';
export class InputFilter {
    constructor() {
        this._clearFilterTriggered = false;
    }
    /** Getter for the Grid Options pulled through the Grid Object */
    get gridOptions() {
        return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
    }
    get operator() {
        return this.columnDef && this.columnDef.filter && this.columnDef.filter.operator || '';
    }
    /**
     * Initialize the Filter
     */
    init(args) {
        if (!args) {
            throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
        }
        this.grid = args.grid;
        this.callback = args.callback;
        this.columnDef = args.columnDef;
        this.searchTerms = args.searchTerms || [];
        // filter input can only have 1 search term, so we will use the 1st array index if it exist
        const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';
        // step 1, create HTML string template
        const filterTemplate = this.buildTemplateHtmlString();
        // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
        this.$filterElm = this.createDomElement(filterTemplate, searchTerm);
        // step 3, subscribe to the keyup event and run the callback when that happens
        // also add/remove "filled" class for styling purposes
        this.$filterElm.keyup((e) => {
            const value = e && e.target && e.target.value || '';
            if (this._clearFilterTriggered) {
                this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered });
                this._clearFilterTriggered = false; // reset flag for next use
                this.$filterElm.removeClass('filled');
            }
            else {
                this.$filterElm.addClass('filled');
                this.callback(e, { columnDef: this.columnDef, operator: this.operator, searchTerms: [value] });
            }
        });
    }
    /**
     * Clear the filter value
     */
    clear() {
        if (this.$filterElm) {
            this._clearFilterTriggered = true;
            this.searchTerms = [];
            this.$filterElm.val('');
            this.$filterElm.trigger('keyup');
        }
    }
    /**
     * destroy the filter
     */
    destroy() {
        if (this.$filterElm) {
            this.$filterElm.off('keyup').remove();
        }
    }
    /**
     * Set value(s) on the DOM element
     */
    setValues(values) {
        if (values) {
            this.$filterElm.val(values);
        }
    }
    //
    // private functions
    // ------------------
    /**
     * Create the HTML template as a string
     */
    buildTemplateHtmlString() {
        const columnId = this.columnDef && this.columnDef.id;
        const placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
        return `<input type="text" class="form-control search-filter filter-${columnId}" placeholder="${placeholder}">`;
    }
    /**
     * From the html template string, create a DOM element
     * @param filterTemplate
     */
    createDomElement(filterTemplate, searchTerm) {
        const columnId = this.columnDef && this.columnDef.id;
        const $headerElm = this.grid.getHeaderRowColumn(columnId);
        $($headerElm).empty();
        // create the DOM element & add an ID and filter class
        const $filterElm = $(filterTemplate);
        const searchTermInput = searchTerm;
        $filterElm.val(searchTermInput);
        $filterElm.attr('id', `filter-${columnId}`);
        $filterElm.data('columnId', columnId);
        // if there's a search term, we will add the "filled" class for styling purposes
        if (searchTerm) {
            $filterElm.addClass('filled');
        }
        // append the new DOM element to the header row
        if ($filterElm && typeof $filterElm.appendTo === 'function') {
            $filterElm.appendTo($headerElm);
        }
        return $filterElm;
    }
}
//# sourceMappingURL=inputFilter.js.map