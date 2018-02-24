import {
  Column,
  Filter,
  FilterType,
  FilterArguments,
  FilterCallback
} from './../models/index';
import * as $ from 'jquery';

export class InputFilter implements Filter {
  private $filterElm: any;
  grid: any;
  searchTerm: string | number | boolean;
  columnDef: Column;
  callback: FilterCallback;
  filterType = FilterType.input;

  /**
   * Initialize the Filter
   */
  init(args: FilterArguments) {
    if (!args) {
      throw new Error('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
    }
    this.grid = args.grid;
    this.callback = args.callback;
    this.columnDef = args.columnDef;
    this.searchTerm = args.searchTerm || '';

    // step 1, create HTML string template
    const filterTemplate = this.buildTemplateHtmlString();

    // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
    this.$filterElm = this.createDomElement(filterTemplate);

    // step 3, subscribe to the keyup event and run the callback when that happens
    // also add/remove "filled" class for styling purposes
    this.$filterElm.keyup((e: any) => {
      (e && e.target && e.target.value) ? this.$filterElm.addClass('filled') : this.$filterElm.removeClass('filled');
      this.callback(e, { columnDef: this.columnDef });
    });
  }

  /**
   * Clear the filter value
   */
  clear(triggerFilterKeyup = true) {
    if (this.$filterElm) {
      this.$filterElm.val('');
      if (triggerFilterKeyup) {
        this.$filterElm.trigger('keyup');
      }
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

  //
  // private functions
  // ------------------

  /**
   * Create the HTML template as a string
   */
  private buildTemplateHtmlString() {
    return `<input type="text" class="form-control search-filter" style="font-family: Segoe UI Symbol;" placeholder="&#128269;">`;
  }

  /**
   * From the html template string, create a DOM element
   * @param filterTemplate
   */
  private createDomElement(filterTemplate: string) {
    const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
    $($headerElm).empty();

    // create the DOM element & add an ID and filter class
    const $filterElm = $(filterTemplate);
    const searchTerm = (typeof this.searchTerm === 'boolean') ? `${this.searchTerm}` : this.searchTerm;
    $filterElm.val(searchTerm);
    $filterElm.attr('id', `filter-${this.columnDef.id}`);
    $filterElm.data('columnId', this.columnDef.id);

    // if there's a search term, we will add the "filled" class for styling purposes
    if (this.searchTerm) {
      $filterElm.addClass('filled');
    }

    // append the new DOM element to the header row
    if ($filterElm && typeof $filterElm.appendTo === 'function') {
      $filterElm.appendTo($headerElm);
    }

    return $filterElm;
  }
}
