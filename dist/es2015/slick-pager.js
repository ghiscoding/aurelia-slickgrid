var _desc, _value, _class, _descriptor;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { bindable } from 'aurelia-framework';

export let SlickPager = (_class = class SlickPager {

  constructor() {
    _initDefineProp(this, 'gridoptions', _descriptor, this);

    this.totalItems = 0;
    this.itemsPerPage = 0;
    this.gridOptions = {};
    this.pageCount = 0;
    this.pageNumber = 1;
    this.dataFrom = 1;
    this.dataTo = 1;
    this.paginationCallback = null;
    this.paginationPageSizes = [25, 75, 100];
  }

  attached() {
    this.gridOptions = this.gridoptions;
    if (!this.gridOptions || this.gridOptions.totalItems !== this.totalItems) {
      this.refreshPager();
    }
  }

  gridoptionsChanged(newValue, oldValue) {
    this.gridOptions = newValue;
    if (!this.gridOptions || this.gridOptions.totalItems !== this.totalItems) {
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
    this.dataFrom = this.pageNumber * this.itemsPerPage - this.itemsPerPage + 1;
    this.dataTo = this.pageNumber * this.itemsPerPage;

    if (this.dataTo > this.totalItems) {
      this.dataTo = this.totalItems;
    }
    if (typeof this.paginationCallback === 'function') {
      this.paginationCallback(pageNumber, this.itemsPerPage);
    }
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'gridoptions', [bindable], {
  enumerable: true,
  initializer: null
})), _class);