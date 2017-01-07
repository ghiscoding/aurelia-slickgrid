define(['exports', 'aurelia-framework', 'bootstrap'], function (exports, _aureliaFramework, _bootstrap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SlickPager = undefined;

  var _bootstrap2 = _interopRequireDefault(_bootstrap);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
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

  var _desc, _value, _class, _descriptor;

  var SlickPager = exports.SlickPager = (_class = function () {
    function SlickPager() {
      _classCallCheck(this, SlickPager);

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

    SlickPager.prototype.attached = function attached() {
      this.gridOptions = this.gridoptions;
      if (!this.gridOptions || this.gridOptions.totalItems !== this.totalItems) {
        this.refreshPager();
      }
    };

    SlickPager.prototype.gridoptionsChanged = function gridoptionsChanged(newValue, oldValue) {
      this.gridOptions = newValue;
      if (!this.gridOptions || this.gridOptions.totalItems !== this.totalItems) {
        this.refreshPager();
      }
    };

    SlickPager.prototype.ceil = function ceil(number) {
      return Math.ceil(number);
    };

    SlickPager.prototype.changePageCount = function changePageCount(itemsPerPage) {
      this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
      this.pageNumber = 1;
      this.onPageChanged(this.pageNumber);
    };

    SlickPager.prototype.changeToFirstPage = function changeToFirstPage() {
      this.pageNumber = 1;
      this.onPageChanged(this.pageNumber);
    };

    SlickPager.prototype.changeToLastPage = function changeToLastPage() {
      this.pageNumber = this.pageCount;
      this.onPageChanged(this.pageNumber);
    };

    SlickPager.prototype.changeToNextPage = function changeToNextPage() {
      if (this.pageNumber < this.pageCount) {
        this.pageNumber++;
        this.onPageChanged(this.pageNumber);
      }
    };

    SlickPager.prototype.changeToPreviousPage = function changeToPreviousPage() {
      if (this.pageNumber > 0) {
        this.pageNumber--;
        this.onPageChanged(this.pageNumber);
      }
    };

    SlickPager.prototype.refreshPager = function refreshPager() {
      if (this.gridOptions) {
        this.paginationPageSizes = this.gridOptions.paginationPageSizes;
        this.itemsPerPage = this.gridOptions.paginationPageSize;
        this.paginationCallback = this.gridOptions.onPaginationChanged;
        this.totalItems = this.gridOptions.totalItems;
        this.dataTo = this.itemsPerPage;
      }
      this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    };

    SlickPager.prototype.onPageChanged = function onPageChanged(pageNumber) {
      this.dataFrom = this.pageNumber * this.itemsPerPage - this.itemsPerPage + 1;
      this.dataTo = this.pageNumber * this.itemsPerPage;

      if (this.dataTo > this.totalItems) {
        this.dataTo = this.totalItems;
      }
      if (typeof this.paginationCallback === "function") {
        this.paginationCallback(pageNumber, this.itemsPerPage);
      }
    };

    return SlickPager;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'gridoptions', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});