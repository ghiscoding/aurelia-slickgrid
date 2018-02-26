var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "./../models/index", "text-encoding-utf-8", "./../services/utilities", "jquery"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, index_1, text_encoding_utf_8_1, utilities_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExportService = /** @class */ (function () {
        function ExportService(i18n) {
            this.i18n = i18n;
            this._lineCarriageReturn = '\n';
            this._existingSlickAggregators = [];
            this._hasGroupedItems = false;
            this.defaultExportOptions = {
                delimiter: index_1.DelimiterType.comma,
                filename: 'export',
                format: index_1.FileType.csv,
                useUtf8WithBom: true
            };
        }
        /**
         * Initialize the Export Service
         * @param grid
         * @param gridOptions
         * @param dataView
         */
        ExportService.prototype.init = function (grid, gridOptions, dataView) {
            this._grid = grid;
            this._gridOptions = gridOptions;
            this._dataView = dataView;
        };
        /**
         * Function to export the Grid result to an Excel CSV format using javascript for it to produce the CSV file.
         * This is a WYSIWYG export to file output (What You See is What You Get)
         *
         * NOTES: The column position needs to match perfectly the JSON Object position because of the way we are pulling the data,
         * which means that if any column(s) got moved in the UI, it has to be reflected in the JSON array output as well
         *
         * Example: exportToFile({ format: FileType.csv, delimiter: DelimiterType.comma })
         */
        ExportService.prototype.exportToFile = function (options) {
            this._exportOptions = $.extend(true, {}, this.defaultExportOptions, options);
            // get the CSV output from the grid data
            var dataOutput = this.getDataOutput();
            // trigger a download file
            this.startDownloadFile({
                filename: this._exportOptions.filename + "." + this._exportOptions.format,
                csvContent: dataOutput,
                format: this._exportOptions.format || index_1.FileType.csv,
                useUtf8WithBom: this._exportOptions.useUtf8WithBom || true
            });
        };
        // -----------------------
        // Private functions
        // -----------------------
        ExportService.prototype.getDataOutput = function () {
            var _this = this;
            var columns = this._grid.getColumns() || [];
            var delimiter = this._exportOptions.delimiter || '';
            var format = this._exportOptions.format || '';
            // find all the Aggregators that exist inside SlickGrid
            this._existingSlickAggregators = this.getAllSlickGridAggregators() || [];
            // a CSV needs double quotes wrapper, the other types do not need any wrapper
            this._exportQuoteWrapper = (format === index_1.FileType.csv) ? '"' : '';
            // data variable which will hold all the fields data of a row
            var outputDataString = '';
            // get grouped column titles and if found, we will add a "Group by" column at the first column index
            this._groupedHeaders = this.getGroupedColumnTitles(columns) || [];
            if (this._groupedHeaders && Array.isArray(this._groupedHeaders)) {
                this._hasGroupedItems = (this._groupedHeaders.length > 0);
                outputDataString += this._groupedHeaders
                    .map(function (header) { return _this.i18n.tr('GROUP_BY') + " [" + header.title + "]"; })
                    .join(delimiter);
            }
            // get all column headers
            this._columnHeaders = this.getColumnHeaders(columns) || [];
            if (this._columnHeaders && Array.isArray(this._columnHeaders)) {
                // add the header row + add a new line at the end of the row
                var outputHeaderTitles = this._columnHeaders
                    .map(function (header) { return _this._exportQuoteWrapper + header.title + _this._exportQuoteWrapper; });
                outputDataString += (outputHeaderTitles.join(delimiter) + this._lineCarriageReturn);
            }
            // Populate the rest of the Grid Data
            outputDataString += this.getAllGridRowData(columns, this._lineCarriageReturn);
            return outputDataString;
        };
        /**
         * Get all the grid row data and return that as an output string
         */
        ExportService.prototype.getAllGridRowData = function (columns, lineCarriageReturn) {
            var outputDataString = '';
            var lineCount = this._dataView.getLength();
            // loop through all the grid rows of data
            for (var rowNumber = 0; rowNumber < lineCount; rowNumber++) {
                var itemObj = this._dataView.getItem(rowNumber);
                if (itemObj != null) {
                    // Normal row (not grouped by anything) would have an ID which was predefined in the Grid Columns definition
                    if (itemObj.id != null) {
                        // get regular row item data
                        outputDataString += this.readRegularRowData(columns, rowNumber, itemObj);
                    }
                    else if (this._hasGroupedItems && itemObj.__groupTotals === undefined) {
                        // get the group row
                        outputDataString += this.readGroupedTitleRow(itemObj);
                    }
                    else if (itemObj.__groupTotals) {
                        // else if the row is a Group By and we have agreggators, then a property of '__groupTotals' would exist under that object
                        outputDataString += this.readGroupedTotalRow(itemObj);
                    }
                    outputDataString += lineCarriageReturn;
                }
            }
            return outputDataString;
        };
        /**
         * Get all the Slick Aggregators that are defined in SlickGrid
         */
        ExportService.prototype.getAllSlickGridAggregators = function () {
            var slickAggregatorCount = 0;
            var existingSlickAggregators = [];
            for (var key in Slick.Data.Aggregators) {
                if (Slick.Data.Aggregators.hasOwnProperty(key)) {
                    slickAggregatorCount++;
                    existingSlickAggregators.push(key.toLowerCase());
                }
            }
            return existingSlickAggregators;
        };
        /**
         * Get all header titles and their keys, translate the title when required.
         * @param columns of the grid
         */
        ExportService.prototype.getColumnHeaders = function (columns) {
            var _this = this;
            if (!columns || !Array.isArray(columns) || columns.length === 0) {
                return [];
            }
            var columnHeaders = [];
            // Populate the Column Header, pull the name defined
            columns.forEach(function (columnDef) {
                var fieldName = (columnDef.headerKey) ? _this.i18n.tr(columnDef.headerKey) : columnDef.name;
                var skippedField = columnDef.excludeFromExport || false;
                // if column width is 0 then it's not evaluated since that field is considered hidden should not be part of the export
                if ((columnDef.width === undefined || columnDef.width > 0) && !skippedField) {
                    columnHeaders.push({
                        key: columnDef.field || columnDef.id,
                        title: fieldName || ''
                    });
                }
            });
            return columnHeaders;
        };
        /**
         * Get the data of a regular row (a row without grouping)
         * @param row
         * @param itemObj
         */
        ExportService.prototype.readRegularRowData = function (columns, row, itemObj) {
            var idx = 0;
            var rowOutputString = '';
            var delimiter = this._exportOptions.delimiter;
            var format = this._exportOptions.format;
            var exportQuoteWrapper = this._exportQuoteWrapper || '';
            for (var col = 0, ln = columns.length; col < ln; col++) {
                var columnDef = columns[col];
                var fieldId = columnDef.field || columnDef.id || '';
                // skip excluded column
                if (columnDef.excludeFromExport) {
                    continue;
                }
                // if we are grouping and are on 1st column index, we need to skip this column since it will be used later by the grouping text:: Group by [columnX]
                if (this._hasGroupedItems && idx === 0) {
                    rowOutputString += "\"\"" + delimiter;
                }
                // does the user want to evaluate current column Formatter?
                var isEvaluatingFormatter = (columnDef.exportWithFormatter !== undefined) ? columnDef.exportWithFormatter : this._gridOptions.exportWithFormatter;
                var itemData = '';
                // did the user provide a Custom Formatter for the export
                if (columnDef.exportCustomFormatter) {
                    itemData = columnDef.exportCustomFormatter(row, col, itemObj[fieldId], columnDef, itemObj, this._grid);
                }
                else if (isEvaluatingFormatter && !!columnDef.formatter) {
                    itemData = columnDef.formatter(row, col, itemObj[fieldId], columnDef, itemObj, this._grid);
                }
                else {
                    itemData = (itemObj[fieldId] === null || itemObj[fieldId] === undefined) ? '' : itemObj[fieldId];
                }
                // when CSV we also need to escape double quotes twice, so " becomes ""
                if (format === index_1.FileType.csv) {
                    itemData = itemData.toString().replace(/"/gi, "\"\"");
                }
                // do we have a wrapper to keep as a string? in certain cases like "1E06", we don't want excel to transform it into exponential (1.0E06)
                // to cancel that effect we can had = in front, ex: ="1E06"
                var keepAsStringWrapper = (columnDef && columnDef.exportCsvForceToKeepAsString) ? '=' : '';
                rowOutputString += keepAsStringWrapper + exportQuoteWrapper + itemData + exportQuoteWrapper + delimiter;
                idx++;
            }
            return rowOutputString;
        };
        /**
         * Get the grouped title(s), for example if we grouped by salesRep, the returned result would be:: 'Sales Rep'
         * @param itemObj
         */
        ExportService.prototype.readGroupedTitleRow = function (itemObj) {
            var groupName = itemObj.value;
            var exportQuoteWrapper = this._exportQuoteWrapper || '';
            var delimiter = this._exportOptions.delimiter;
            var format = this._exportOptions.format;
            groupName = utilities_1.addWhiteSpaces(5 * itemObj.level) + groupName;
            if (format === index_1.FileType.csv) {
                // when CSV we also need to escape double quotes twice, so " becomes ""
                groupName = groupName.toString().replace(/"/gi, "\"\"");
            }
            // do we have a wrapper to keep as a string? in certain cases like "1E06", we don't want excel to transform it into exponential (1.0E06)
            // to cancel that effect we can had = in front, ex: ="1E06"
            // const keepAsStringWrapper = (columnDef && columnDef.exportCsvForceToKeepAsString) ? '=' : '';
            return /*keepAsStringWrapper +*/ exportQuoteWrapper + ' ' + groupName + exportQuoteWrapper + delimiter;
        };
        /**
         * Get the grouped totals, these are set by Slick Aggregators.
         * For example if we grouped by "salesRep" and we have a Sum Aggregator on "sales", then the returned output would be:: ["Sum 123$"]
         * @param itemObj
         */
        ExportService.prototype.readGroupedTotalRow = function (itemObj) {
            var exportExponentialWrapper = '';
            var delimiter = this._exportOptions.delimiter;
            var format = this._exportOptions.format;
            var exportQuoteWrapper = this._exportQuoteWrapper || '';
            var existingSlickAggregators = this._existingSlickAggregators || [];
            var columnCount = this._grid.getColumns().length;
            var output = exportQuoteWrapper + ".." + exportQuoteWrapper + delimiter;
            for (var j = 0; j < columnCount; j++) {
                var fieldId = this._grid.getColumns()[j].id;
                var itemData = '';
                // cycle through all possible SlickGrid Aggregators and get their values
                for (var k = 0; k < existingSlickAggregators.length; k++) {
                    if (itemObj[existingSlickAggregators[k]] !== undefined) {
                        if (fieldId in itemObj[existingSlickAggregators[k]]) {
                            var aggregatorName = existingSlickAggregators[k];
                            var val = itemObj[existingSlickAggregators[k]][fieldId];
                            if (aggregatorName.toLowerCase() === 'avg') {
                                itemData = aggregatorName + ': ' + Math.round(val);
                            }
                            else if (aggregatorName.toLowerCase() === 'min' || aggregatorName.toLowerCase() === 'max' || aggregatorName.toLowerCase() === 'sum') {
                                itemData = aggregatorName + ': ' + Math.round(parseFloat(val) * 1000000) / 1000000;
                            }
                            else {
                                itemData = val;
                            }
                        }
                    }
                }
                if (format === index_1.FileType.csv) {
                    // when CSV we also need to escape double quotes twice, so a double quote " becomes 2x double quotes ""
                    // and if we have a text of (number)E(number),
                    // we don't want excel to transform it into exponential (1.0E06) to cancel that effect we can had = in front, ex: ="1E06"
                    itemData = itemData.toString().replace(/"/gi, "\"\"");
                    exportExponentialWrapper = (itemData.match(/^\s*\d+E\d+\s*$/i)) ? '=' : '';
                }
                output += exportQuoteWrapper + itemData + exportQuoteWrapper + delimiter;
            }
            return output;
        };
        /**
         * Get all grouped column titles, translate them when required.
         * For example if the grid is grouped by salesRep and then customerName, we will return their title, something like:: ['Sales Rep', 'Customer Name']
         * @param columns of the grid
         */
        ExportService.prototype.getGroupedColumnTitles = function (columns) {
            var _this = this;
            if (!columns || !Array.isArray(columns) || columns.length === 0) {
                return [];
            }
            var groupItemId = '';
            var groupedHeaders = [];
            var hasGroupedItems = false;
            if ($.isEmptyObject(this._groupingDefinition)) {
                hasGroupedItems = false;
            }
            else {
                hasGroupedItems = true;
                groupItemId = $("#" + this._groupingDefinition.dropdownOptionsIds[0]).val();
            }
            // If we are Grouping, then pull the name of the grouped item and display it as 1st column
            columns.forEach(function (columnDef) {
                // the column might be a complex object and have a '.' (ex.: person.name)
                // if so we want just the object (ex.: person.name => we want 'person')
                if (groupItemId.indexOf('.') >= 0) {
                    groupItemId = groupItemId.split('.')[0];
                }
                if (hasGroupedItems && columnDef && columnDef.id === groupItemId) {
                    var fieldName = (columnDef.headerKey) ? _this.i18n.tr(columnDef.headerKey) : columnDef.name;
                    groupedHeaders.push({
                        key: columnDef.field || columnDef.id,
                        title: fieldName || ''
                    });
                }
            });
            return groupedHeaders;
        };
        /**
         * Triggers download file with file format.
         * IE(6-10) are not supported
         * All other browsers will use plain javascript on client side to produce a file download.
         * @param options
         */
        ExportService.prototype.startDownloadFile = function (options) {
            // IE(6-10) don't support javascript download and our service doesn't support either so throw an error, we have to make a round trip to the Web Server for exporting
            if (navigator.appName === 'Microsoft Internet Explorer') {
                throw new Error('Microsoft Internet Explorer 6 to 10 do not support javascript export to CSV. Please upgrade your browser.');
            }
            // set the correct MIME type
            var mimeType = (options.format === index_1.FileType.csv) ? 'text/csv' : 'text/plain';
            // make sure no html entities exist in the data
            var csvContent = utilities_1.htmlEntityDecode(options.csvContent);
            // dealing with Excel CSV export and UTF-8 is a little tricky.. We will use Option #2 to cover older Excel versions
            // Option #1: we need to make Excel knowing that it's dealing with an UTF-8, A correctly formatted UTF8 file can have a Byte Order Mark as its first three octets
            // reference: http://stackoverflow.com/questions/155097/microsoft-excel-mangles-diacritics-in-csv-files
            // Option#2: use a 3rd party extension to javascript encode into UTF-16
            var outputData;
            if (options.format === index_1.FileType.csv) {
                outputData = new text_encoding_utf_8_1.TextEncoder('utf-8').encode(csvContent);
            }
            else {
                outputData = csvContent;
            }
            // create a Blob object for the download
            var blob = new Blob([options.useUtf8WithBom ? '\uFEFF' : '', outputData], {
                type: mimeType + ";charset=utf-8;"
            });
            // when using IE/Edge, then use different download call
            if (typeof navigator.msSaveOrOpenBlob === 'function') {
                navigator.msSaveOrOpenBlob(blob, options.filename);
            }
            else {
                // this trick will generate a temp <a /> tag
                // the code will then trigger a hidden click for it to start downloading
                var link = document.createElement('a');
                var csvUrl = URL.createObjectURL(blob);
                link.textContent = 'download';
                link.href = csvUrl;
                link.setAttribute('download', options.filename);
                // set the visibility to hidden so there is no effect on your web-layout
                link.style.visibility = 'hidden';
                // this part will append the anchor tag, trigger a click (for download to start) and finally remove the tag once completed
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
        ExportService = __decorate([
            aurelia_framework_1.inject(aurelia_i18n_1.I18N)
        ], ExportService);
        return ExportService;
    }());
    exports.ExportService = ExportService;
});
//# sourceMappingURL=export.service.js.map