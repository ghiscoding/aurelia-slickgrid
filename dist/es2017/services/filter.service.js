var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FilterConditions } from '../filter-conditions/index';
import { FilterTemplates } from './../filter-templates/index';
import { FieldType, FormElementType } from '../models/index';
import { I18N } from 'aurelia-i18n';
import * as $ from 'jquery';
let FilterService = class FilterService {
    constructor(i18n) {
        this.i18n = i18n;
        this._columnFilters = {};
        this.onFilterChanged = new EventAggregator();
        this.i18n = i18n;
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
        this.emitFilterChangedBy('remote');
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
        // run a preProcess callback if defined
        if (serviceOptions.onBackendEventApi.preProcess !== undefined) {
            serviceOptions.onBackendEventApi.preProcess();
        }
        // call the service to get a query back
        const query = await serviceOptions.onBackendEventApi.service.onFilterChanged(event, args);
        // await for the Promise to resolve the data
        const responseProcess = await serviceOptions.onBackendEventApi.process(query);
        // send the response process to the postProcess callback
        if (serviceOptions.onBackendEventApi.postProcess !== undefined) {
            serviceOptions.onBackendEventApi.postProcess(responseProcess);
        }
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
        this.emitFilterChangedBy('local');
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
        this.destroyFilters();
        if (this.subscriber && typeof this.subscriber.unsubscribe === 'function') {
            this.subscriber.unsubscribe();
        }
    }
    /**
     * Destroy the filters, since it's a singleton, we don't want to affect other grids with same columns
     */
    destroyFilters() {
        // we need to loop through all columnFilters and delete them 1 by 1
        // only trying to make columnFilter an empty (without looping) would not trigger a dataset change
        for (const columnId in this._columnFilters) {
            if (columnId && this._columnFilters[columnId]) {
                delete this._columnFilters[columnId];
            }
        }
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
                searchTerm: e.target.value,
                operator: args.operator || null
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
                        filterTemplate = FilterTemplates.select(searchTerm, columnDef, this.i18n);
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
                        elm.change((e) => this.callbackSearchEvent(e, { columnDef, operator: 'EQ' }));
                        break;
                    case FormElementType.multiSelect:
                        elm.change((e) => this.callbackSearchEvent(e, { columnDef, operator: 'IN' }));
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
        // remove the text inside each search filter fields
        $('.slick-headerrow-column .search-filter').each((index, elm) => {
            // clear the value and trigger an event
            // the event is for GraphQL & OData Services to detect the changes and call a new query
            switch (elm.tagName) {
                case 'SELECT':
                    $(elm).val('').trigger('change');
                    break;
                case 'INPUT':
                default:
                    $(elm).val('').trigger('keyup');
                    break;
            }
        });
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
    /**
     * A simple function that is attached to the subscriber and emit a change when the sort is called.
     * Other services, like Pagination, can then subscribe to it.
     * @param {string} sender
     */
    emitFilterChangedBy(sender) {
        this.subscriber.subscribe(() => this.onFilterChanged.publish('filterService:changed', `onFilterChanged by ${sender}`));
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
};
FilterService = __decorate([
    inject(I18N)
], FilterService);
export { FilterService };
//# sourceMappingURL=filter.service.js.map