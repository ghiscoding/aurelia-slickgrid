import { Subscription } from 'aurelia-event-aggregator';
import { BindingEngine, inject } from 'aurelia-framework';
import {
  CollectionCustomStructure,
  CollectionOption,
  Column,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  GridOption,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm
} from './../models/index';
import { CollectionService } from '../services/collection.service';
import { getDescendantProperty } from '../services/utilities';
import * as $ from 'jquery';

@inject(BindingEngine, CollectionService)
export class AutoCompleteFilter implements Filter {
  private _clearFilterTriggered = false;
  private _currentValue: any;

  /** DOM Element Name, useful for auto-detecting positioning (dropup / dropdown) */
  elementName: string;

  /** Filter Multiple-Select options */
  filterElmOptions: MultipleSelectOption;

  /** The JQuery DOM element */
  $filterElm: any;

  grid: any;
  searchTerms: SearchTerm[];
  columnDef: Column;
  callback: FilterCallback;
  defaultOptions: MultipleSelectOption;
  isFilled = false;

  /** The property name for labels in the collection */
  labelName: string;

  /** The property name for values in the collection */
  optionLabel: string;

  /** The property name for values in the collection */
  valueName = 'label';

  enableTranslateLabel = false;
  subscriptions: Subscription[] = [];

  /**
   * Initialize the Filter
   */
  constructor(protected bindingEngine: BindingEngine, protected collectionService: CollectionService) {
    this.defaultOptions = {};
  }

  /** Getter for the Collection Options */
  protected get collectionOptions(): CollectionOption {
    return this.columnDef && this.columnDef.filter && this.columnDef.filter.collectionOptions || {};
  }

  /** Getter for the Filter Operator */
  get columnFilter(): ColumnFilter {
    return this.columnDef && this.columnDef.filter || {};
  }

  /** Getter for the Custom Structure if exist */
  get customStructure(): CollectionCustomStructure | undefined {
    return this.columnDef && this.columnDef.filter && this.columnDef.filter.customStructure;
  }

  /** Getter for the Grid Options pulled through the Grid Object */
  get gridOptions(): GridOption {
    return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
  }

  /** Getter of the Operator to use when doing the filter comparing */
  get operator(): OperatorType | OperatorString {
    return this.columnDef && this.columnDef.filter && this.columnDef.filter.operator || OperatorType.equal;
  }

  /**
   * Initialize the filter template
   */
  async init(args: FilterArguments) {
    if (!args) {
      throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
    }
    this.grid = args.grid;
    this.callback = args.callback;
    this.columnDef = args.columnDef;
    this.searchTerms = args.searchTerms || [];

    if (!this.grid || !this.columnDef || !this.columnFilter || (!this.columnFilter.collection && !this.columnFilter.collectionAsync && !this.columnFilter.filterOptions)) {
      throw new Error(`[Aurelia-SlickGrid] You need to pass a "collection" (or "collectionAsync") for the MultipleSelect Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example:: { filter: model: Filters.multipleSelect, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] }`);
    }

    this.enableTranslateLabel = this.columnFilter && this.columnFilter.enableTranslateLabel || false;
    this.labelName = this.customStructure && this.customStructure.label || 'label';
    this.valueName = this.customStructure && this.customStructure.value || 'value';

    // always render the Select (dropdown) DOM element, even if user passed a "collectionAsync",
    // if that is the case, the Select will simply be without any options but we still have to render it (else SlickGrid would throw an error)
    let newCollection = this.columnFilter.collection || [];
    this.renderDomElement(newCollection);

    const collectionAsync = this.columnFilter.collectionAsync;
    if (collectionAsync && !this.columnFilter.collection) {
      // only read the collectionAsync once (on the 1st load),
      // we do this because Http Fetch will throw an error saying body was already read and is streaming is locked
      newCollection = await this.renderOptionsAsync(collectionAsync);
    }

    // subscribe to both CollectionObserver and PropertyObserver
    // any collection changes will trigger a re-render of the DOM element filter
    if (collectionAsync || (this.columnFilter.enableCollectionWatch)) {
      this.watchCollectionChanges();
    }
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
      this.$filterElm.off('keyup input change').remove();
    }
  }

  /**
   * Set value(s) on the DOM element
   */
  setValues(values: SearchTerm | SearchTerm[]) {
    if (values) {
      values = Array.isArray(values) ? values : [values];
      this.$filterElm.multipleSelect('setSelects', values);
    }
  }

  //
  // protected functions
  // ------------------

  /**
   * user might want to filter certain items of the collection
   * @param inputCollection
   * @return outputCollection filtered and/or sorted collection
   */
  protected filterCollection(inputCollection: any[]): any[] {
    let outputCollection = inputCollection;

    // user might want to filter certain items of the collection
    if (this.columnFilter && this.columnFilter.collectionFilterBy) {
      const filterBy = this.columnFilter.collectionFilterBy;
      const filterCollectionBy = this.columnFilter.collectionOptions && this.columnFilter.collectionOptions.filterResultAfterEachPass || null;
      outputCollection = this.collectionService.filterCollection(outputCollection, filterBy, filterCollectionBy);
    }

    return outputCollection;
  }

  /**
   * user might want to sort the collection in a certain way
   * @param inputCollection
   * @return outputCollection filtered and/or sorted collection
   */
  protected sortCollection(inputCollection: any[]): any[] {
    let outputCollection = inputCollection;

    // user might want to sort the collection
    if (this.columnFilter && this.columnFilter.collectionSortBy) {
      const sortBy = this.columnFilter.collectionSortBy;
      outputCollection = this.collectionService.sortCollection(outputCollection, sortBy, this.enableTranslateLabel);
    }

    return outputCollection;
  }

  protected async renderOptionsAsync(collectionAsync: Promise<any | any[]>): Promise<any[]> {
    let awaitedCollection: any = [];

    if (collectionAsync) {
      // wait for the "collectionAsync", once resolved we will save it into the "collection"
      const response: any | any[] = await collectionAsync;

      if (Array.isArray(response)) {
        awaitedCollection = response; // from Promise
      } else if (response instanceof Response && typeof response['json'] === 'function') {
        awaitedCollection = await response['json'](); // from Fetch
      } else if (response && response['content']) {
        awaitedCollection = response['content']; // from aurelia-http-client
      }

      if (!Array.isArray(awaitedCollection)) {
        throw new Error('Something went wrong while trying to pull the collection from the "collectionAsync" call');
      }

      // copy over the array received from the async call to the "collection" as the new collection to use
      // this has to be BEFORE the `collectionObserver().subscribe` to avoid going into an infinite loop
      this.columnFilter.collection = awaitedCollection;

      // recreate Multiple Select after getting async collection
      this.renderDomElement(awaitedCollection);
    }

    return awaitedCollection;
  }

  /**
   * Subscribe to both CollectionObserver & PropertyObserver with BindingEngine.
   * They each have their own purpose, the "propertyObserver" will trigger once the collection is replaced entirely
   * while the "collectionObverser" will trigger on collection changes (`push`, `unshift`, `splice`, ...)
   */
  protected watchCollectionChanges(): void {
    // subscribe to the "collection" changes (array replace)
    this.subscriptions.push(
      this.bindingEngine
        .propertyObserver(this.columnFilter, 'collection')
        .subscribe((newVal) => {
          // simply recreate/re-render the Select (dropdown) DOM Element
          this.renderDomElement(newVal);
        })
    );

    // subscribe to the "collection" changes (array `push`, `unshift`, `splice`, ...)
    if (this.columnFilter && this.columnFilter.collection) {
      this.subscriptions.push(
        this.bindingEngine
          .collectionObserver(this.columnFilter.collection)
          .subscribe((changes: { index: number, addedCount: number, removed: any[] }[]) => {
            if (Array.isArray(changes) && changes.length > 0) {
              // simply recreate/re-render the Select (dropdown) DOM Element
              const updatedCollection = this.columnFilter.collection || [];
              this.renderDomElement(updatedCollection);
            }
          })
      );
    }
  }

  protected renderDomElement(collection: any[]) {
    if (!Array.isArray(collection) && this.collectionOptions && this.collectionOptions.collectionInObjectProperty) {
      collection = getDescendantProperty(collection, this.collectionOptions.collectionInObjectProperty);
    }
    if (!Array.isArray(collection)) {
      throw new Error('The "collection" passed to the Select Filter is not a valid array');
    }

    // assign the collection to a temp variable before filtering/sorting the collection
    let newCollection = collection;

    // user might want to filter and/or sort certain items of the collection
    newCollection = this.filterCollection(newCollection);
    newCollection = this.sortCollection(newCollection);

    // filter input can only have 1 search term, so we will use the 1st array index if it exist
    const searchTerm = (Array.isArray(this.searchTerms) && this.searchTerms[0]) || '';

    // step 1, create HTML string template
    const filterTemplate = this.buildTemplateHtmlString();

    // step 2, create the DOM Element of the filter & pre-load search term
    // also subscribe to the onClose event
    this.$filterElm = this.createDomElement(filterTemplate, newCollection, searchTerm);

    // step 3, subscribe to the keyup event and run the callback when that happens
    // also add/remove "filled" class for styling purposes
    this.$filterElm.on('keyup input change', (e: any) => {
      const value = e && e.target && e.target.value || '';
      if (this._clearFilterTriggered) {
        this.callback(e, { columnDef: this.columnDef, clearFilterTriggered: this._clearFilterTriggered });
        this._clearFilterTriggered = false; // reset flag for next use
        this.$filterElm.removeClass('filled');
      } else {
        this.$filterElm.addClass('filled');
        if (value === '') {
          this.callback(e, { columnDef: this.columnDef, operator: this.operator, searchTerms: [value] });
        }
      }
    });
  }

  /**
   * Create the HTML template as a string
   */
  private buildTemplateHtmlString() {
    const columnId = this.columnDef && this.columnDef.id;
    let placeholder = (this.gridOptions) ? (this.gridOptions.defaultFilterPlaceholder || '') : '';
    if (this.columnFilter && this.columnFilter.placeholder) {
      placeholder = this.columnDef.filter.placeholder;
    }
    return `<input type="text" class="form-control search-filter filter-${columnId}" placeholder="${placeholder}">`;
  }

  /**
   * From the html template string, create a DOM element
   * @param filterTemplate
   */
  private createDomElement(filterTemplate: string, collection: any[], searchTerm?: SearchTerm) {
    const columnId = this.columnDef && this.columnDef.id;
    const $headerElm = this.grid.getHeaderRowColumn(columnId);
    $($headerElm).empty();

    // create the DOM element & add an ID and filter class
    const $filterElm = $(filterTemplate) as any;
    const searchTermInput = searchTerm as string;

    // user might provide his own custom structure
    // jQuery UI autocomplete requires a label/value pair, so we must remap them when user provide different ones
    if (Array.isArray(collection) && this.customStructure) {
      collection = collection.map((item) => {
        return { label: item[this.labelName], value: item[this.valueName] };
      });
    }

    // user might pass his own autocomplete options
    const autoCompleteOptions = this.columnDef && this.columnDef.filter && this.columnDef.filter.filterOptions;

    // when user passes it's own autocomplete options
    // we still need to provide our own "select" callback implementation
    if (autoCompleteOptions) {
      autoCompleteOptions.select = (event: Event, ui: any) => this.onClose(event, ui);
      $filterElm.autocomplete(autoCompleteOptions);
    } else {
      if (!Array.isArray(collection)) {
        throw new Error('AutoComplete default implementation requires a "collection" or "collectionAsync" to be provided for the filter to work properly');
      }

      $filterElm.autocomplete({
        minLength: 0,
        source: collection,
        select: (event: Event, ui: any) => this.onClose(event, ui),
      });
    }

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

  //
  // private functions
  // ------------------

  private onClose(event: Event, ui: any) {
    if (ui && ui.item) {
      const itemLabel = typeof ui.item === 'string' ? ui.item : ui.item.label;
      const itemValue = typeof ui.item === 'string' ? ui.item : ui.item.value;
      this._currentValue = itemValue;
      this.$filterElm.val(itemLabel);
      this.callback(event, { columnDef: this.columnDef, operator: this.operator, searchTerms: [itemValue] });
    }
    return false;
  }
}
