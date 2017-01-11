import {bindable} from 'aurelia-framework';

export class SlickPager {
  @bindable gridoptions;
  totalItems = 0;
  itemsPerPage = 0;
  gridOptions = {};
  pageCount = 0;
  pageNumber = 1;
  dataFrom = 1;
  dataTo = 1;
  paginationCallback = null;
  paginationPageSizes = [25, 75, 100];

  constructor() {
  }

  attached() {
    this.gridOptions = this.gridoptions;
    if (!this.gridOptions || (this.gridOptions.totalItems !== this.totalItems)) {
      this.refreshPager();
    }
  }

  gridoptionsChanged(newValue, oldValue) {
    this.gridOptions = newValue;
    if (!this.gridOptions || (this.gridOptions.totalItems !== this.totalItems)) {
      this.refreshPager();
    }
  }

  ceil(number) {
    return Math.ceil(number);
  }
  changePageCount(itemsPerPage) {
    this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
    this.pageNumber = 1;
    this.onPageChanged(this.pageNumber);
  }

  changeToFirstPage() {
    this.pageNumber = 1;
    this.onPageChanged(this.pageNumber);
  }
  changeToLastPage() {
    this.pageNumber = this.pageCount;
    this.onPageChanged(this.pageNumber);
  }
  changeToNextPage() {
    if (this.pageNumber < this.pageCount) {
      this.pageNumber++;
      this.onPageChanged(this.pageNumber);
    }
  }
  changeToPreviousPage() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.onPageChanged(this.pageNumber);
    }
  }

  refreshPager() {
    if (this.gridOptions) {
      this.paginationPageSizes = this.gridOptions.paginationPageSizes;
      this.itemsPerPage = this.gridOptions.paginationPageSize;
      this.paginationCallback = this.gridOptions.onPaginationChanged;
      this.totalItems = this.gridOptions.totalItems;
      this.dataTo = this.itemsPerPage;
    }
    this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChanged(pageNumber) {
    this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
    this.dataTo = (this.pageNumber * this.itemsPerPage);

    if (this.dataTo > this.totalItems) {
      this.dataTo = this.totalItems;
    }
    if (typeof this.paginationCallback === 'function') {
      this.paginationCallback(pageNumber, this.itemsPerPage);
    }
  }
}
