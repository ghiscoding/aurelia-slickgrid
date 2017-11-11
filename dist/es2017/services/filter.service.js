import { FilterConditions } from '../filter-conditions/index';
import { FilterTemplates } from './../filter-templates/index';
import { FieldType, FormElementType } from '../models/index';
import * as $ from 'jquery';
export class FilterService {
    constructor() {
        this._columnFilters = {};
    }
    init(grid, gridOptions, columnDefinitions) {
        this._columnDefinitions = columnDefinitions;
        this._gridOptions = gridOptions;
        this._grid = grid;
    }
    /**
     * Attach a backend filter hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     */
    attachBackendOnFilter(grid, options) {
        this.subscriber = new Slick.Event();
        this.subscriber.subscribe(this.attachBackendOnFilterSubscribe);
        grid.onHeaderRowCellRendered.subscribe((e, args) => {
            this.addFilterTemplateToHeaderRow(args);
        });
    }
    async attachBackendOnFilterSubscribe(event, args) {
        if (!args || !args.grid) {
            throw new Error('Something went wrong when trying to attach the "attachBackendOnFilterSubscribe(event, args)" function, it seems that "args" is not populated correctly');
        }
        const serviceOptions = args.grid.getOptions();
        if (!serviceOptions || !serviceOptions.onBackendEventApi || !serviceOptions.onBackendEventApi.process || !serviceOptions.onBackendEventApi.service) {
            throw new Error(`onBackendEventApi requires at least a "process" function and a "service" defined`);
        }
        const backendApi = serviceOptions.onBackendEventApi;
        // run a preProcess callback if defined
        if (backendApi.preProcess !== undefined) {
            backendApi.preProcess();
        }
        // call the service to get a query back
        const query = await backendApi.service.onFilterChanged(event, args);
        // await for the Promise to resolve the data
        const responseProcess = await backendApi.process(query);
        // send the response process to the postProcess callback
        if (backendApi.postProcess !== undefined) {
            backendApi.postProcess(responseProcess);
        }
    }
    testFilterCondition(operator, value1, value2) {
        switch (operator) {
            case '<': return (value1 < value2) ? true : false;
            case '<=': return (value1 <= value2) ? true : false;
            case '>': return (value1 > value2) ? true : false;
            case '>=': return (value1 >= value2) ? true : false;
            case '!=':
            case '<>': return (value1 !== value2) ? true : false;
            case '=':
            case '==': return (value1 === value2) ? true : false;
        }
        return true;
    }
    /**
     * Attach a local filter hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     * @param dataView
     */
    attachLocalOnFilter(grid, options, dataView) {
        this._dataView = dataView;
        this.subscriber = new Slick.Event();
        dataView.setFilterArgs({ columnFilters: this._columnFilters, grid: this._grid });
        dataView.setFilter(this.customFilter);
        this.subscriber.subscribe((e, args) => {
            const columnId = args.columnId;
            if (columnId != null) {
                dataView.refresh();
            }
        });
        grid.onHeaderRowCellRendered.subscribe((e, args) => {
            this.addFilterTemplateToHeaderRow(args);
        });
    }
    customFilter(item, args) {
        for (const columnId of Object.keys(args.columnFilters)) {
            const columnFilter = args.columnFilters[columnId];
            const columnIndex = args.grid.getColumnIndex(columnId);
            const columnDef = args.grid.getColumns()[columnIndex];
            const fieldType = columnDef.type || FieldType.string;
            const conditionalFilterFn = (columnDef.filter && columnDef.filter.conditionalFilter) ? columnDef.filter.conditionalFilter : null;
            const filterSearchType = (columnDef.filterSearchType) ? columnDef.filterSearchType : null;
            let cellValue = item[columnDef.field];
            let fieldSearchValue = columnFilter.searchTerm;
            if (typeof fieldSearchValue === 'undefined') {
                fieldSearchValue = '';
            }
            fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
            const matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
            const operator = columnFilter.operator || ((matches) ? matches[1] : '');
            const searchTerm = (!!matches) ? matches[2] : '';
            const lastValueChar = (!!matches) ? matches[3] : '';
            // no need to query if search value is empty
            if (searchTerm === '') {
                return true;
            }
            if (typeof cellValue === 'number') {
                cellValue = cellValue.toString();
            }
            const conditionOptions = {
                fieldType,
                searchTerm,
                cellValue,
                operator,
                cellValueLastChar: lastValueChar,
                filterSearchType
            };
            if (conditionalFilterFn && typeof conditionalFilterFn === 'function') {
                conditionalFilterFn(conditionOptions);
            }
            if (!FilterConditions.executeMappedCondition(conditionOptions)) {
                return false;
            }
        }
        return true;
    }
    destroy() {
        this.subscriber.unsubscribe();
    }
    callbackSearchEvent(e, args) {
        if (e.target.value === '' || e.target.value === null) {
            // delete the property from the columnFilters when it becomes empty
            // without doing this, it would leave an incorrect state of the previous column filters when filtering on another column
            delete this._columnFilters[args.columnDef.id];
        }
        else {
            this._columnFilters[args.columnDef.id] = {
                columnId: args.columnDef.id,
                columnDef: args.columnDef,
                searchTerm: e.target.value
            };
        }
        this.triggerEvent(this.subscriber, {
            columnId: args.columnDef.id,
            columnDef: args.columnDef,
            columnFilters: this._columnFilters,
            searchTerm: e.target.value,
            serviceOptions: this._onFilterChangedOptions,
            grid: this._grid
        }, e);
    }
    addFilterTemplateToHeaderRow(args) {
        for (let i = 0; i < this._columnDefinitions.length; i++) {
            if (this._columnDefinitions[i].id !== 'selector' && this._columnDefinitions[i].filterable) {
                let filterTemplate = '';
                let elm = null;
                let header;
                const columnDef = this._columnDefinitions[i];
                const columnId = columnDef.id;
                const listTerm = (columnDef.filter && columnDef.filter.listTerm) ? columnDef.filter.listTerm : null;
                let searchTerm = (columnDef.filter && columnDef.filter.searchTerm) ? columnDef.filter.searchTerm : '';
                // keep the filter in a columnFilters for later reference
                this.keepColumnFilters(searchTerm, listTerm, columnDef);
                if (!columnDef.filter) {
                    searchTerm = (columnDef.filter && columnDef.filter.searchTerm) ? columnDef.filter.searchTerm : null;
                    filterTemplate = FilterTemplates.input(searchTerm, columnDef);
                }
                else {
                    // custom Select template
                    if (columnDef.filter.type === FormElementType.select) {
                        filterTemplate = FilterTemplates.select(searchTerm, columnDef);
                    }
                }
                // when hiding/showing (Column Picker or Grid Menu), it will come re-create yet again the filters
                // because of that we need to first get searchTerm from the columnFilters (that is what the user input last)
                // if nothing is found, we can then use the optional searchTerm passed to the Grid Option (that is couple lines before)
                const inputSearchTerm = (this._columnFilters[columnDef.id]) ? this._columnFilters[columnDef.id].searchTerm : searchTerm || null;
                // create the DOM Element
                header = this._grid.getHeaderRowColumn(columnDef.id);
                $(header).empty();
                elm = $(filterTemplate);
                elm.attr('id', `filter-${columnDef.id}`);
                elm.data('columnId', columnDef.id);
                elm.val(inputSearchTerm);
                if (elm && typeof elm.appendTo === 'function') {
                    elm.appendTo(header);
                }
                // depending on the DOM Element type, we will watch the correct event
                const filterType = (columnDef.filter && columnDef.filter.type) ? columnDef.filter.type : FormElementType.input;
                switch (filterType) {
                    case FormElementType.select:
                    case FormElementType.multiSelect:
                        elm.change((e) => this.callbackSearchEvent(e, { columnDef }));
                        break;
                    case FormElementType.input:
                    default:
                        elm.keyup((e) => this.callbackSearchEvent(e, { columnDef }));
                        break;
                }
            }
        }
    }
    /** Clear the search filters (below the column titles) */
    clearFilters(dataview) {
        // remove the text inside each search input fields
        $('.slick-headerrow-column .search-filter').val('');
        // we need to loop through all columnFilters and delete them 1 by 1
        // only trying to make columnFilter an empty (without looping) would not trigger a dataset change
        for (const columnId in this._columnFilters) {
            if (columnId && this._columnFilters[columnId]) {
                delete this._columnFilters[columnId];
            }
        }
        // we also need to refresh the dataView and optionally the grid (it's optional since we use DataView)
        if (this._dataView) {
            this._dataView.refresh();
            this._grid.invalidate();
            this._grid.render();
        }
    }
    keepColumnFilters(searchTerm, listTerm, columnDef) {
        if (searchTerm) {
            this._columnFilters[columnDef.id] = {
                columnId: columnDef.id,
                columnDef,
                searchTerm
            };
            if (listTerm) {
                this._columnFilters.listTerm = listTerm;
            }
        }
    }
    triggerEvent(evt, args, e) {
        e = e || new Slick.EventData();
        return evt.notify(args, e, args.grid);
    }
}
//# sourceMappingURL=filter.service.js.map