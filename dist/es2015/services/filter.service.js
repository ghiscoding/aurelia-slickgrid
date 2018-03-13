var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FilterConditions } from './../filter-conditions/index';
import { FilterFactory } from './../filters/index';
import { FieldType, FilterType, OperatorType } from './../models/index';
let FilterService = class FilterService {
    constructor(ea, filterFactory) {
        this.ea = ea;
        this.filterFactory = filterFactory;
        this._eventHandler = new Slick.EventHandler();
        this._filters = [];
        this._columnFilters = {};
    }
    init(grid, gridOptions, columnDefinitions) {
        this._grid = grid;
        this._gridOptions = gridOptions;
    }
    /**
     * Attach a backend filter hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     */
    attachBackendOnFilter(grid, options) {
        this._filters = [];
        this._slickSubscriber = new Slick.Event();
        // subscribe to the SlickGrid event and call the backend execution
        this._slickSubscriber.subscribe(this.attachBackendOnFilterSubscribe.bind(this));
        // subscribe to SlickGrid onHeaderRowCellRendered event to create filter template
        this._eventHandler.subscribe(grid.onHeaderRowCellRendered, (e, args) => {
            this.addFilterTemplateToHeaderRow(args);
        });
    }
    attachBackendOnFilterSubscribe(event, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args || !args.grid) {
                throw new Error('Something went wrong when trying to attach the "attachBackendOnFilterSubscribe(event, args)" function, it seems that "args" is not populated correctly');
            }
            const gridOptions = args.grid.getOptions() || {};
            const backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
            if (!backendApi || !backendApi.process || !backendApi.service) {
                throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
            }
            // run a preProcess callback if defined
            if (backendApi.preProcess) {
                backendApi.preProcess();
            }
            // call the service to get a query back
            const query = yield backendApi.service.onFilterChanged(event, args);
            // emit an onFilterChanged event
            this.emitFilterChanged('remote');
            // await for the Promise to resolve the data
            const processResult = yield backendApi.process(query);
            // from the result, call our internal post process to update the Dataset and Pagination info
            if (processResult && backendApi.internalPostProcess) {
                backendApi.internalPostProcess(processResult);
            }
            // send the response process to the postProcess callback
            if (backendApi.postProcess !== undefined) {
                backendApi.postProcess(processResult);
            }
        });
    }
    /**
     * Attach a local filter hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     * @param dataView
     */
    attachLocalOnFilter(grid, options, dataView) {
        this._filters = [];
        this._dataView = dataView;
        this._slickSubscriber = new Slick.Event();
        dataView.setFilterArgs({ columnFilters: this._columnFilters, grid: this._grid });
        dataView.setFilter(this.customLocalFilter.bind(this, dataView));
        this._slickSubscriber.subscribe((e, args) => {
            const columnId = args.columnId;
            if (columnId != null) {
                dataView.refresh();
            }
            this.emitFilterChanged('local');
        });
        // subscribe to SlickGrid onHeaderRowCellRendered event to create filter template
        this._eventHandler.subscribe(grid.onHeaderRowCellRendered, (e, args) => {
            this.addFilterTemplateToHeaderRow(args);
        });
    }
    /** Clear the search filters (below the column titles) */
    clearFilters() {
        this._filters.forEach((filter, index) => {
            if (filter && filter.clear) {
                // clear element and trigger a change
                filter.clear(true);
            }
        });
        // we need to loop through all columnFilters and delete them 1 by 1
        // only trying to clear columnFilter (without looping through) would not trigger a dataset change
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
    customLocalFilter(dataView, item, args) {
        for (const columnId of Object.keys(args.columnFilters)) {
            const columnFilter = args.columnFilters[columnId];
            const columnIndex = args.grid.getColumnIndex(columnId);
            const columnDef = args.grid.getColumns()[columnIndex];
            if (!columnDef) {
                return false;
            }
            const fieldType = columnDef.type || FieldType.string;
            const filterSearchType = (columnDef.filterSearchType) ? columnDef.filterSearchType : null;
            let cellValue = item[columnDef.queryField || columnDef.queryFieldFilter || columnDef.field];
            const searchTerms = (columnFilter && columnFilter.searchTerms) ? columnFilter.searchTerms : null;
            let fieldSearchValue = (columnFilter && (columnFilter.searchTerm !== undefined || columnFilter.searchTerm !== null)) ? columnFilter.searchTerm : undefined;
            if (typeof fieldSearchValue === 'undefined') {
                fieldSearchValue = '';
            }
            fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
            const matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
            let operator = columnFilter.operator || ((matches) ? matches[1] : '');
            const searchTerm = (!!matches) ? matches[2] : '';
            const lastValueChar = (!!matches) ? matches[3] : '';
            // when using a Filter that is not a custom type, we want to make sure that we have a default operator type
            // for example a multiple-select should always be using IN, while a single select will use an EQ
            const filterType = (columnDef.filter && columnDef.filter.type) ? columnDef.filter.type : FilterType.input;
            if (!operator && filterType !== FilterType.custom) {
                switch (filterType) {
                    case FilterType.select:
                    case FilterType.multipleSelect:
                        operator = 'IN';
                        break;
                    case FilterType.singleSelect:
                        operator = 'EQ';
                        break;
                    default:
                        operator = operator;
                        break;
                }
            }
            // no need to query if search value is empty
            if (searchTerm === '' && !searchTerms) {
                return true;
            }
            // filter search terms should always be string type (even though we permit the end user to input numbers)
            // so make sure each term are strings, if user has some default search terms, we will cast them to string
            if (searchTerms && Array.isArray(searchTerms)) {
                for (let k = 0, ln = searchTerms.length; k < ln; k++) {
                    // make sure all search terms are strings
                    searchTerms[k] = ((searchTerms[k] === undefined || searchTerms[k] === null) ? '' : searchTerms[k]) + '';
                }
            }
            // when using localization (i18n), we should use the formatter output to search as the new cell value
            if (columnDef && columnDef.params && columnDef.params.useFormatterOuputToFilter) {
                const rowIndex = (dataView && typeof dataView.getIdxById === 'function') ? dataView.getIdxById(item.id) : 0;
                cellValue = columnDef.formatter(rowIndex, columnIndex, cellValue, columnDef, item, this._grid);
            }
            // make sure cell value is always a string
            if (typeof cellValue === 'number') {
                cellValue = cellValue.toString();
            }
            const conditionOptions = {
                fieldType,
                searchTerms,
                searchTerm,
                cellValue,
                operator,
                cellValueLastChar: lastValueChar,
                filterSearchType
            };
            if (!FilterConditions.executeMappedCondition(conditionOptions)) {
                return false;
            }
        }
        return true;
    }
    dispose() {
        this.disposeColumnFilters();
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
        // unsubscribe local event
        if (this._slickSubscriber && typeof this._slickSubscriber.unsubscribe === 'function') {
            this._slickSubscriber.unsubscribe();
        }
    }
    /**
     * Dispose of the filters, since it's a singleton, we don't want to affect other grids with same columns
     */
    disposeColumnFilters() {
        // we need to loop through all columnFilters and delete them 1 by 1
        // only trying to make columnFilter an empty (without looping) would not trigger a dataset change
        for (const columnId in this._columnFilters) {
            if (columnId && this._columnFilters[columnId]) {
                delete this._columnFilters[columnId];
            }
        }
        // also destroy each Filter instances
        this._filters.forEach((filter, index) => {
            if (filter && filter.destroy) {
                filter.destroy(true);
            }
        });
    }
    getColumnFilters() {
        return this._columnFilters;
    }
    getCurrentLocalFilters() {
        const currentFilters = [];
        if (this._columnFilters) {
            for (const colId of Object.keys(this._columnFilters)) {
                const columnFilter = this._columnFilters[colId];
                const filter = { columnId: colId || '' };
                if (columnFilter && columnFilter.searchTerms) {
                    filter.searchTerms = columnFilter.searchTerms;
                }
                else {
                    filter.searchTerm = (columnFilter && (columnFilter.searchTerm !== undefined || columnFilter.searchTerm !== null)) ? columnFilter.searchTerm : undefined;
                }
                currentFilters.push(filter);
            }
        }
        return currentFilters;
    }
    callbackSearchEvent(e, args) {
        const targetValue = (e && e.target) ? e.target.value : undefined;
        const searchTerms = (args && args.searchTerms && Array.isArray(args.searchTerms)) ? args.searchTerms : [];
        const columnId = (args && args.columnDef) ? args.columnDef.id || '' : '';
        if (!targetValue && searchTerms.length === 0) {
            // delete the property from the columnFilters when it becomes empty
            // without doing this, it would leave an incorrect state of the previous column filters when filtering on another column
            delete this._columnFilters[columnId];
        }
        else {
            const colId = '' + columnId;
            this._columnFilters[colId] = {
                columnId: colId,
                columnDef: args.columnDef || null,
                operator: args.operator || undefined,
                searchTerms: args.searchTerms || undefined,
                searchTerm: ((e && e.target) ? e.target.value : undefined),
            };
        }
        this.triggerEvent(this._slickSubscriber, {
            columnId,
            columnDef: args.columnDef || null,
            columnFilters: this._columnFilters,
            searchTerms: args.searchTerms || undefined,
            searchTerm: ((e && e.target) ? e.target.value : null),
            serviceOptions: this._onFilterChangedOptions,
            grid: this._grid
        }, e);
    }
    addFilterTemplateToHeaderRow(args) {
        const columnDef = args.column;
        const columnId = columnDef.id || '';
        if (columnDef && columnId !== 'selector' && columnDef.filterable) {
            let searchTerms;
            let searchTerm;
            if (this._columnFilters[columnDef.id]) {
                searchTerm = this._columnFilters[columnDef.id].searchTerm || undefined;
                searchTerms = this._columnFilters[columnDef.id].searchTerms || undefined;
            }
            else if (columnDef.filter) {
                // when hiding/showing (with Column Picker or Grid Menu), it will try to re-create yet again the filters (since SlickGrid does a re-render)
                // because of that we need to first get searchTerm(s) from the columnFilters (that is what the user last entered)
                searchTerms = columnDef.filter.searchTerms || undefined;
                searchTerm = columnDef.filter.searchTerm || undefined;
                this.updateColumnFilters(searchTerm, searchTerms, columnDef);
            }
            const filterArguments = {
                grid: this._grid,
                searchTerm,
                searchTerms,
                columnDef,
                callback: this.callbackSearchEvent.bind(this)
            };
            // depending on the Filter type, we will watch the correct event
            const filterType = (columnDef.filter && columnDef.filter.type) ? columnDef.filter.type : this._gridOptions.defaultFilterType;
            let filter;
            switch (filterType) {
                case FilterType.custom:
                    if (columnDef && columnDef.filter && columnDef.filter.customFilter) {
                        filter = columnDef.filter.customFilter;
                    }
                    else {
                        throw new Error('[Aurelia-Slickgrid] A Filter type of "custom" must include a Filter class that is defined and instantiated.');
                    }
                    break;
                default:
                    filter = this.filterFactory.createFilter(filterType);
                    break;
            }
            if (filter) {
                filter.init(filterArguments);
                const filterExistIndex = this._filters.findIndex((filt) => filter.columnDef.name === filt.columnDef.name);
                // add to the filters arrays or replace it when found
                if (filterExistIndex === -1) {
                    this._filters.push(filter);
                }
                else {
                    this._filters[filterExistIndex] = filter;
                }
                // when hiding/showing (with Column Picker or Grid Menu), it will try to re-create yet again the filters (since SlickGrid does a re-render)
                // we need to also set again the values in the DOM elements if the values were set by a searchTerm(s)
                if ((searchTerm || searchTerms) && filter.setValues) {
                    filter.setValues(searchTerm || searchTerms);
                }
            }
        }
    }
    /**
     * A simple function that will be called to emit a change when a filter changes.
     * Other services, like Pagination, can then subscribe to it.
     * @param sender
     */
    emitFilterChanged(sender) {
        if (sender === 'remote' && this._gridOptions && this._gridOptions.backendServiceApi) {
            let currentFilters = [];
            const backendService = this._gridOptions.backendServiceApi.service;
            if (backendService && backendService.getCurrentFilters) {
                currentFilters = backendService.getCurrentFilters();
            }
            this.ea.publish('filterService:filterChanged', currentFilters);
        }
        else if (sender === 'local') {
            this.ea.publish('filterService:filterChanged', this.getCurrentLocalFilters());
        }
    }
    /**
     * When user passes an array of preset filters, we need to pre-polulate each column filter searchTerm(s)
     * The process is to loop through the preset filters array, find the associated column from columnDefinitions and fill in the filter object searchTerm(s)
     * This is basically the same as if we would manually add searchTerm(s) to a column filter object in the column definition, but we do it programmatically.
     * At the end of the day, when creating the Filter (DOM Element), it will use these searchTerm(s) so we can take advantage of that without recoding each Filter type (DOM element)
     * @param gridOptions
     * @param columnDefinitions
     */
    populateColumnFilterSearchTerms(gridOptions, columnDefinitions) {
        if (gridOptions.presets && gridOptions.presets.filters) {
            const filters = gridOptions.presets.filters;
            columnDefinitions.forEach((columnDef) => {
                const columnPreset = filters.find((presetFilter) => {
                    return presetFilter.columnId === columnDef.id;
                });
                if (columnPreset && columnPreset.searchTerm) {
                    columnDef.filter = columnDef.filter || {};
                    columnDef.filter.searchTerm = columnPreset.searchTerm;
                }
                if (columnPreset && columnPreset.searchTerms) {
                    columnDef.filter = columnDef.filter || {};
                    columnDef.filter.operator = columnDef.filter.operator || OperatorType.in;
                    columnDef.filter.searchTerms = columnPreset.searchTerms;
                }
            });
        }
        return columnDefinitions;
    }
    updateColumnFilters(searchTerm, searchTerms, columnDef) {
        if (searchTerm !== undefined && searchTerm !== null && searchTerm !== '') {
            this._columnFilters[columnDef.id] = {
                columnId: columnDef.id,
                columnDef,
                searchTerm,
                operator: (columnDef && columnDef.filter && columnDef.filter.operator) ? columnDef.filter.operator : null,
                type: (columnDef && columnDef.filter && columnDef.filter.type) ? columnDef.filter.type : FilterType.input
            };
        }
        if (searchTerms) {
            // this._columnFilters.searchTerms = searchTerms;
            this._columnFilters[columnDef.id] = {
                columnId: columnDef.id,
                columnDef,
                searchTerms,
                operator: (columnDef && columnDef.filter && columnDef.filter.operator) ? columnDef.filter.operator : null,
                type: (columnDef && columnDef.filter && columnDef.filter.type) ? columnDef.filter.type : FilterType.input
            };
        }
    }
    triggerEvent(evt, args, e) {
        e = e || new Slick.EventData();
        return evt.notify(args, e, args.grid);
    }
};
FilterService = __decorate([
    inject(EventAggregator, FilterFactory)
], FilterService);
export { FilterService };
//# sourceMappingURL=filter.service.js.map