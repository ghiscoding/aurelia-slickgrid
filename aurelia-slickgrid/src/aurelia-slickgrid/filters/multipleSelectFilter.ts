import { I18N } from 'aurelia-i18n';
import { inject, BindingEngine } from 'aurelia-framework';
import {
  Column,
  Filter,
  FilterArguments,
  FilterCallback,
  GridOption,
  HtmlElementPosition,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm,
  SelectOption
} from './../models/index';
import { CollectionService } from '../services/collection.service';
import * as $ from 'jquery';
import { Subscription } from 'aurelia-event-aggregator';

@inject(BindingEngine, CollectionService, I18N)
export class MultipleSelectFilter implements Filter {
  $filterElm: any;
  grid: any;
  searchTerms: SearchTerm[];
  columnDef: Column;
  callback: FilterCallback;
  defaultOptions: MultipleSelectOption;
  isFilled = false;
  labelName: string;
  valueName: string;
  enableTranslateLabel = false;
  subscriptions: Subscription[] = [];

  /**
   * Initialize the Filter
   */
  constructor(private bindingEngine: BindingEngine, private collectionService: CollectionService, private i18n: I18N) {
    // default options used by this Filter, user can overwrite any of these by passing "otions"
    this.defaultOptions = {
      container: 'body',
      filter: false,  // input search term on top of the select option list
      maxHeight: 200,
      okButton: true,
      addTitle: true, // show tooltip of all selected items while hovering the filter
      countSelected: this.i18n.tr('X_OF_Y_SELECTED'),
      allSelected: this.i18n.tr('ALL_SELECTED'),
      selectAllText: this.i18n.tr('SELECT_ALL'),
      selectAllDelimiter: ['', ''], // remove default square brackets of default text "[Select All]" => "Select All"

      // we will subscribe to the onClose event for triggering our callback
      // also add/remove "filled" class for styling purposes
      onClose: () => {
        const selectedItems = this.$filterElm.multipleSelect('getSelects');
        if (Array.isArray(selectedItems) && selectedItems.length > 0) {
          this.isFilled = true;
          this.$filterElm.addClass('filled').siblings('div .search-filter').addClass('filled');
        } else {
          this.isFilled = false;
          this.$filterElm.removeClass('filled').siblings('div .search-filter').removeClass('filled');
        }
        this.callback(undefined, { columnDef: this.columnDef, operator: this.operator, searchTerms: selectedItems });
      }
    };
  }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get gridOptions(): GridOption {
    return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
  }

  get operator(): OperatorType | OperatorString {
    return (this.columnDef && this.columnDef.filter && this.columnDef.filter.operator) || OperatorType.in;
  }

  /**
   * Initialize the filter template
   */
  init(args: FilterArguments) {
    if (!args) {
      throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
    }
    this.grid = args.grid;
    this.callback = args.callback;
    this.columnDef = args.columnDef;
    this.searchTerms = args.searchTerms || [];

    if (!this.grid || !this.columnDef || !this.columnDef.filter || (!this.columnDef.filter.collection && !this.columnDef.filter.asyncCollection)) {
      throw new Error(`[Angular-SlickGrid] You need to pass a "collection" (or "asyncCollection") for the MultipleSelect Filter to work correctly. Also each option should include a value/label pair (or value/labelKey when using Locale). For example:: { filter: model: Filters.multipleSelect, collection: [{ value: true, label: 'True' }, { value: false, label: 'False'}] }`);
    }

    this.enableTranslateLabel = this.columnDef.filter.enableTranslateLabel || false;
    this.labelName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.label : 'label';
    this.valueName = (this.columnDef.filter.customStructure) ? this.columnDef.filter.customStructure.value : 'value';

    let newCollection = this.columnDef.filter.collection || [];
    const asyncCollection = this.columnDef.filter.asyncCollection;

    if (asyncCollection) {
      this.renderOptionsAsync(asyncCollection);
    }

    // user might want to filter or sort certain items of the collection
    newCollection = this.filterAndSortCollection(newCollection);

    // step 1, create HTML string template
    const filterTemplate = this.buildTemplateHtmlString(newCollection, this.searchTerms);

    // step 2, create the DOM Element of the filter & pre-load search terms
    // also subscribe to the onClose event
    this.createDomElement(filterTemplate);
  }

  /**
   * Clear the filter values
   */
  clear() {
    if (this.$filterElm && this.$filterElm.multipleSelect) {
      // reload the filter element by it's id, to make sure it's still a valid element (because of some issue in the GraphQL example)
      this.$filterElm.multipleSelect('setSelects', []);
      this.$filterElm.removeClass('filled');
      this.searchTerms = [];
      this.callback(undefined, { columnDef: this.columnDef, clearFilterTriggered: true });
    }
  }

  /**
   * destroy the filter
   */
  destroy() {
    if (this.$filterElm) {
      this.$filterElm.off().remove();
    }
  }

  /**
   * Set value(s) on the DOM element
   */
  setValues(values: SearchTerm[]) {
    if (values) {
      this.$filterElm.multipleSelect('setSelects', values);
    }
  }

  //
  // private functions
  // ------------------

  /**
   * user might want to filter and/or sort certain items of the collection
   * @param inputCollection
   * @return outputCollection filtered and/or sorted collection
   */
  private filterAndSortCollection(inputCollection) {
    let outputCollection = [];

    // user might want to filter certain items of the collection
    if (this.columnDef && this.columnDef.filter && this.columnDef.filter.collectionFilterBy) {
      const filterBy = this.columnDef.filter.collectionFilterBy;
      outputCollection = this.collectionService.filterCollection(inputCollection, filterBy);
    }

    // user might want to sort the collection
    if (this.columnDef && this.columnDef.filter && this.columnDef.filter.collectionSortBy) {
      const sortBy = this.columnDef.filter.collectionSortBy;
      outputCollection = this.collectionService.sortCollection(inputCollection, sortBy, this.enableTranslateLabel);
    }

    return outputCollection;
  }

  private async renderOptionsAsync(asyncCollection: Promise<any>) {
    if (asyncCollection) {
      // wait for the "asyncCollection", once resolved we will save it into the "collection" for later reference
      const awaitedCollection: any[] = await asyncCollection;
      this.columnDef.filter.collection = awaitedCollection;

      // recreate Multiple Select after getting async collection
      this.renderDomElement(awaitedCollection);

      // subscribe to the "collection" property changes with BindingEngine
      this.subscriptions.push(
        this.bindingEngine
          .collectionObserver(this.columnDef.filter.collection)
          .subscribe((changes: { index: number, addedCount: number, removed: any[] }[]) => {
            const updatedCollection = this.columnDef && this.columnDef.filter && this.columnDef.filter.collection || [];
            if (Array.isArray(changes)) {
              changes.forEach((change) => {
                const option = updatedCollection[change.index];
                if (change.addedCount) {
                  // add the new item to the Multiple Select
                  const $opt = $('<option />', { value: option.value, text: option.label });
                  this.$filterElm.prepend($opt).multipleSelect('refresh');
                  // this.renderDomElement(updatedCollection);
                  // this.$filterElm.multipleSelect('refresh');
                } else if (Array.isArray(change.removed) && change.removed.length > 0) {
                  // instead of trying to find the deleted item in the Multiple Select
                  // it's easier to just recreate the Select DOM Element
                  this.renderDomElement(updatedCollection);
                }
              });
            }
          })
      );
    }
  }

  private renderDomElement(collection) {
    let newCollection = collection;

    // user might want to filter and/or sort certain items of the collection
    newCollection = this.filterAndSortCollection(newCollection);

    // step 1, create HTML string template
    const filterTemplate = this.buildTemplateHtmlString(newCollection, this.searchTerms);

    // step 2, create the DOM Element of the filter & pre-load search terms
    // also subscribe to the onClose event
    this.createDomElement(filterTemplate);
  }

  /**
   * Create the HTML template as a string
   */
  private buildTemplateHtmlString(optionCollection: any[], searchTerms: SearchTerm[]) {
    let options = '';
    optionCollection.forEach((option: SelectOption) => {
      if (!option || (option[this.labelName] === undefined && option.labelKey === undefined)) {
        throw new Error(`A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list, for example:: { filter: model: Filters.multipleSelect, collection: [ { value: '1', label: 'One' } ]')`);
      }
      const labelKey = (option.labelKey || option[this.labelName]) as string;
      const selected = (searchTerms.findIndex((term) => term === option[this.valueName]) >= 0) ? 'selected' : '';
      const textLabel = ((option.labelKey || this.enableTranslateLabel) && this.i18n && typeof this.i18n.tr === 'function') ? this.i18n.tr(labelKey || ' ') : labelKey;

      // html text of each select option
      options += `<option value="${option[this.valueName]}" ${selected}>${textLabel}</option>`;

      // if there's a search term, we will add the "filled" class for styling purposes
      if (selected) {
        this.isFilled = true;
      }
    });

    return `<select class="ms-filter search-filter" multiple="multiple">${options}</select>`;
  }

  /**
   * From the html template string, create a DOM element
   * Subscribe to the onClose event and run the callback when that happens
   * @param filterTemplate
   */
  private createDomElement(filterTemplate: string) {
    const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
    $($headerElm).empty();

    // create the DOM element & add an ID and filter class
    this.$filterElm = $(filterTemplate);
    if (typeof this.$filterElm.multipleSelect !== 'function') {
      throw new Error(`multiple-select.js was not found, make sure to read the HOWTO Wiki on how to install it`);
    }
    this.$filterElm.attr('id', `filter-${this.columnDef.id}`);
    this.$filterElm.data('columnId', this.columnDef.id);

    // if there's a search term, we will add the "filled" class for styling purposes
    if (this.isFilled) {
      this.$filterElm.addClass('filled');
    }

    // append the new DOM element to the header row
    if (this.$filterElm && typeof this.$filterElm.appendTo === 'function') {
      this.$filterElm.appendTo($headerElm);
    }

    // merge options & attach multiSelect
    const filterOptions = (this.columnDef.filter) ? this.columnDef.filter.filterOptions : {};
    const options: MultipleSelectOption = { ...this.defaultOptions, ...filterOptions };
    this.$filterElm = this.$filterElm.multipleSelect(options);
  }

  private subscribeOnClose() {
    this.$filterElm.multipleSelect({
      onClose: () => {
        const selectedItems = this.$filterElm.multipleSelect('getSelects');
        this.callback(undefined, { columnDef: this.columnDef, operator: this.operator, searchTerms: selectedItems });
      }
    });
  }
}
