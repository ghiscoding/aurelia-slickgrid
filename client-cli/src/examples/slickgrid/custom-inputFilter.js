import $ from 'jquery';

export class CustomInputFilter {
  $filterElm;
  grid;
  searchTerm;
  columnDef;
  callback;

  /**
   * Initialize the Filter
   */
  init(args) {
    this.grid = args.grid;
    this.callback = args.callback;
    this.columnDef = args.columnDef;
    this.searchTerm = args.searchTerm;

    // step 1, create HTML string template
    const filterTemplate = this.buildTemplateHtmlString();

    // step 2, create the DOM Element of the filter & initialize it if searchTerm is filled
    this.$filterElm = this.createDomElement(filterTemplate);

    // step 3, subscribe to the keyup event and run the callback when that happens
    this.$filterElm.keyup((e) => this.callback(e, { columnDef: this.columnDef }));
  }

  /**
   * Clear the filter value
   */
  clear() {
    if (this.$filterElm) {
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

  //
  // private functions
  // ------------------

  /**
   * Create the HTML template as a string
   */
  buildTemplateHtmlString() {
    return '<input type="text" class="form-control search-filter" placeholder="Custom Filter">';
  }

  /**
   * From the html template string, create a DOM element
   * @param filterTemplate
   */
  createDomElement(filterTemplate) {
    const $headerElm = this.grid.getHeaderRowColumn(this.columnDef.id);
    $($headerElm).empty();

    // create the DOM element & add an ID and filter class
    const $filterElm = $(filterTemplate);
    const searchTerm = (typeof this.searchTerm === 'boolean') ? `${this.searchTerm}` : this.searchTerm;
    $filterElm.val(searchTerm);
    $filterElm.attr('id', `filter-${this.columnDef.id}`);
    $filterElm.data('columnId', this.columnDef.id);

    // append the new DOM element to the header row
    if ($filterElm && typeof $filterElm.appendTo === 'function') {
      $filterElm.appendTo($headerElm);
    }

    return $filterElm;
  }
}
