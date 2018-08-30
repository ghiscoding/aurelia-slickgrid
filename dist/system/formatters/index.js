System.register(["./arrayObjectToCsvFormatter", "./arrayToCsvFormatter", "./boldFormatter", "./checkboxFormatter", "./checkmarkFormatter", "./collectionFormatter", "./collectionEditorFormatter", "./complexObjectFormatter", "./dateIsoFormatter", "./dateTimeIsoAmPmFormatter", "./dateTimeIsoFormatter", "./dateTimeUsAmPmFormatter", "./dateTimeUsFormatter", "./dateTimeShortIsoFormatter", "./dateTimeShortUsFormatter", "./dateUsFormatter", "./decimalFormatter", "./deleteIconFormatter", "./dollarColoredBoldFormatter", "./dollarColoredFormatter", "./dollarFormatter", "./editIconFormatter", "./hyperlinkFormatter", "./hyperlinkUriPrefixFormatter", "./infoIconFormatter", "./lowercaseFormatter", "./maskFormatter", "./multipleFormatter", "./percentFormatter", "./percentCompleteBarFormatter", "./percentCompleteFormatter", "./percentSymbolFormatter", "./progressBarFormatter", "./translateFormatter", "./translateBooleanFormatter", "./uppercaseFormatter", "./yesNoFormatter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var arrayObjectToCsvFormatter_1, arrayToCsvFormatter_1, boldFormatter_1, checkboxFormatter_1, checkmarkFormatter_1, collectionFormatter_1, collectionEditorFormatter_1, complexObjectFormatter_1, dateIsoFormatter_1, dateTimeIsoAmPmFormatter_1, dateTimeIsoFormatter_1, dateTimeUsAmPmFormatter_1, dateTimeUsFormatter_1, dateTimeShortIsoFormatter_1, dateTimeShortUsFormatter_1, dateUsFormatter_1, decimalFormatter_1, deleteIconFormatter_1, dollarColoredBoldFormatter_1, dollarColoredFormatter_1, dollarFormatter_1, editIconFormatter_1, hyperlinkFormatter_1, hyperlinkUriPrefixFormatter_1, infoIconFormatter_1, lowercaseFormatter_1, maskFormatter_1, multipleFormatter_1, percentFormatter_1, percentCompleteBarFormatter_1, percentCompleteFormatter_1, percentSymbolFormatter_1, progressBarFormatter_1, translateFormatter_1, translateBooleanFormatter_1, uppercaseFormatter_1, yesNoFormatter_1, Formatters;
    return {
        setters: [
            function (arrayObjectToCsvFormatter_1_1) {
                arrayObjectToCsvFormatter_1 = arrayObjectToCsvFormatter_1_1;
            },
            function (arrayToCsvFormatter_1_1) {
                arrayToCsvFormatter_1 = arrayToCsvFormatter_1_1;
            },
            function (boldFormatter_1_1) {
                boldFormatter_1 = boldFormatter_1_1;
            },
            function (checkboxFormatter_1_1) {
                checkboxFormatter_1 = checkboxFormatter_1_1;
            },
            function (checkmarkFormatter_1_1) {
                checkmarkFormatter_1 = checkmarkFormatter_1_1;
            },
            function (collectionFormatter_1_1) {
                collectionFormatter_1 = collectionFormatter_1_1;
            },
            function (collectionEditorFormatter_1_1) {
                collectionEditorFormatter_1 = collectionEditorFormatter_1_1;
            },
            function (complexObjectFormatter_1_1) {
                complexObjectFormatter_1 = complexObjectFormatter_1_1;
            },
            function (dateIsoFormatter_1_1) {
                dateIsoFormatter_1 = dateIsoFormatter_1_1;
            },
            function (dateTimeIsoAmPmFormatter_1_1) {
                dateTimeIsoAmPmFormatter_1 = dateTimeIsoAmPmFormatter_1_1;
            },
            function (dateTimeIsoFormatter_1_1) {
                dateTimeIsoFormatter_1 = dateTimeIsoFormatter_1_1;
            },
            function (dateTimeUsAmPmFormatter_1_1) {
                dateTimeUsAmPmFormatter_1 = dateTimeUsAmPmFormatter_1_1;
            },
            function (dateTimeUsFormatter_1_1) {
                dateTimeUsFormatter_1 = dateTimeUsFormatter_1_1;
            },
            function (dateTimeShortIsoFormatter_1_1) {
                dateTimeShortIsoFormatter_1 = dateTimeShortIsoFormatter_1_1;
            },
            function (dateTimeShortUsFormatter_1_1) {
                dateTimeShortUsFormatter_1 = dateTimeShortUsFormatter_1_1;
            },
            function (dateUsFormatter_1_1) {
                dateUsFormatter_1 = dateUsFormatter_1_1;
            },
            function (decimalFormatter_1_1) {
                decimalFormatter_1 = decimalFormatter_1_1;
            },
            function (deleteIconFormatter_1_1) {
                deleteIconFormatter_1 = deleteIconFormatter_1_1;
            },
            function (dollarColoredBoldFormatter_1_1) {
                dollarColoredBoldFormatter_1 = dollarColoredBoldFormatter_1_1;
            },
            function (dollarColoredFormatter_1_1) {
                dollarColoredFormatter_1 = dollarColoredFormatter_1_1;
            },
            function (dollarFormatter_1_1) {
                dollarFormatter_1 = dollarFormatter_1_1;
            },
            function (editIconFormatter_1_1) {
                editIconFormatter_1 = editIconFormatter_1_1;
            },
            function (hyperlinkFormatter_1_1) {
                hyperlinkFormatter_1 = hyperlinkFormatter_1_1;
            },
            function (hyperlinkUriPrefixFormatter_1_1) {
                hyperlinkUriPrefixFormatter_1 = hyperlinkUriPrefixFormatter_1_1;
            },
            function (infoIconFormatter_1_1) {
                infoIconFormatter_1 = infoIconFormatter_1_1;
            },
            function (lowercaseFormatter_1_1) {
                lowercaseFormatter_1 = lowercaseFormatter_1_1;
            },
            function (maskFormatter_1_1) {
                maskFormatter_1 = maskFormatter_1_1;
            },
            function (multipleFormatter_1_1) {
                multipleFormatter_1 = multipleFormatter_1_1;
            },
            function (percentFormatter_1_1) {
                percentFormatter_1 = percentFormatter_1_1;
            },
            function (percentCompleteBarFormatter_1_1) {
                percentCompleteBarFormatter_1 = percentCompleteBarFormatter_1_1;
            },
            function (percentCompleteFormatter_1_1) {
                percentCompleteFormatter_1 = percentCompleteFormatter_1_1;
            },
            function (percentSymbolFormatter_1_1) {
                percentSymbolFormatter_1 = percentSymbolFormatter_1_1;
            },
            function (progressBarFormatter_1_1) {
                progressBarFormatter_1 = progressBarFormatter_1_1;
            },
            function (translateFormatter_1_1) {
                translateFormatter_1 = translateFormatter_1_1;
            },
            function (translateBooleanFormatter_1_1) {
                translateBooleanFormatter_1 = translateBooleanFormatter_1_1;
            },
            function (uppercaseFormatter_1_1) {
                uppercaseFormatter_1 = uppercaseFormatter_1_1;
            },
            function (yesNoFormatter_1_1) {
                yesNoFormatter_1 = yesNoFormatter_1_1;
            }
        ],
        execute: function () {
            /** Provides a list of different Formatters that will change the cell value displayed in the UI */
            exports_1("Formatters", Formatters = {
                /**
                 * Takes an array of complex objects converts it to a comma delimited string.
                 * Requires to pass an array of "propertyNames" in the column definition the generic "params" property
                 * For example, if we have an array of user objects that have the property of firstName & lastName then we need to pass in your column definition::
                 * { params: { propertyNames: ['firtName'] }}
                 */
                arrayObjectToCsv: arrayObjectToCsvFormatter_1.arrayObjectToCsvFormatter,
                /** Takes an array of string and converts it to a comma delimited string */
                arrayToCsv: arrayToCsvFormatter_1.arrayToCsvFormatter,
                /** show value in bold font weight as well */
                bold: boldFormatter_1.boldFormatter,
                /** When value is filled (true), it will display a checkbox Unicode icon */
                checkbox: checkboxFormatter_1.checkboxFormatter,
                /** When value is filled (true), it will display a Font-Awesome icon (fa-check) */
                checkmark: checkmarkFormatter_1.checkmarkFormatter,
                /** Takes a complex data object and return the data under that property (for example: "user.firstName" will return the first name "John") */
                complexObject: complexObjectFormatter_1.complexObjectFormatter,
                /**
                 * Looks up values from the columnDefinition.params.collection property and displays the label in CSV or string format
                 * @example
                 * // the grid will display 'foo' and 'bar' and not 1 and 2 from your dataset
                 * { params: { collection: [{ value: 1, label: 'foo'}, {value: 2, label: 'bar' }] }}
                 * const dataset = [{ value: 1 },{ value: 2 }];
                 */
                collection: collectionFormatter_1.collectionFormatter,
                /**
                 * Looks up values from the columnDefinition.editor.collection property and displays the label in CSV or string format
                 * @example
                 * // the grid will display 'foo' and 'bar' and not 1 and 2 from your dataset
                 * { params: { collection: [{ value: 1, label: 'foo'}, {value: 2, label: 'bar' }] }}
                 * const dataset = [{ value: 1 },{ value: 2 }];
                 */
                collectionEditor: collectionEditorFormatter_1.collectionEditorFormatter,
                /** Takes a Date object and displays it as an ISO Date format */
                dateIso: dateIsoFormatter_1.dateIsoFormatter,
                /** Takes a Date object and displays it as an ISO Date+Time format */
                dateTimeIso: dateTimeIsoFormatter_1.dateTimeIsoFormatter,
                /** Takes a Date object and displays it as an ISO Date+Time (without seconds) format */
                dateTimeShortIso: dateTimeShortIsoFormatter_1.dateTimeShortIsoFormatter,
                /** Takes a Date object and displays it as an ISO Date+Time+(am/pm) format */
                dateTimeIsoAmPm: dateTimeIsoAmPmFormatter_1.dateTimeIsoAmPmFormatter,
                /** Takes a Date object and displays it as an US Date format */
                dateUs: dateUsFormatter_1.dateUsFormatter,
                /** Takes a Date object and displays it as an US Date+Time format */
                dateTimeUs: dateTimeUsFormatter_1.dateTimeUsFormatter,
                /** Takes a Date object and displays it as an US Date+Time (without seconds) format */
                dateTimeShortUs: dateTimeShortUsFormatter_1.dateTimeShortUsFormatter,
                /** Takes a Date object and displays it as an US Date+Time+(am/pm) format */
                dateTimeUsAmPm: dateTimeUsAmPmFormatter_1.dateTimeUsAmPmFormatter,
                /** Displays a Font-Awesome delete icon (fa-trash) */
                deleteIcon: deleteIconFormatter_1.deleteIconFormatter,
                /**
                 * Display the value as x decimals formatted, defaults to 2 decimals.
                 * You can pass "decimalPlaces" or "minDecimalPlaces" and/or "maxDecimalPlaces" to the "params" property.
                 * For example:: `{ formatter: Formatters.decimal, params: { decimalPlaces: 3 }}`
                 * The property "decimalPlaces" is an alias of "minDecimalPlaces"
                 */
                decimal: decimalFormatter_1.decimalFormatter,
                /** Display the value as 2 decimals formatted with dollar sign '$' at the end of of the value */
                dollar: dollarFormatter_1.dollarFormatter,
                /** Display the value as 2 decimals formatted with dollar sign '$' at the end of of the value, change color of text to red/green on negative/positive value */
                dollarColored: dollarColoredFormatter_1.dollarColoredFormatter,
                /** Display the value as 2 decimals formatted with dollar sign '$' at the end of of the value, change color of text to red/green on negative/positive value, show it in bold font weight as well */
                dollarColoredBold: dollarColoredBoldFormatter_1.dollarColoredBoldFormatter,
                /** Displays a Font-Awesome edit icon (fa-pencil) */
                editIcon: editIconFormatter_1.editIconFormatter,
                /** Takes an hyperlink cell value and transforms it into a real hyperlink, given that the value starts with 1 of these (http|ftp|https). The structure will be "<a href="hyperlink">hyperlink</a>" */
                hyperlink: hyperlinkFormatter_1.hyperlinkFormatter,
                /** Takes an hyperlink URI prefix (passed in column definition "params.uriPrefix") and adds the cell value. The structure will be "<a href="uriPrefix">value</a>" */
                hyperlinkUriPrefix: hyperlinkUriPrefixFormatter_1.hyperlinkUriPrefixFormatter,
                /** Displays a Font-Awesome edit icon (fa-info-circle) */
                infoIcon: infoIconFormatter_1.infoIconFormatter,
                /** Takes a value and displays it all lowercase */
                lowercase: lowercaseFormatter_1.lowercaseFormatter,
                /**
                 * Takes a value display it according to a mask provided
                 * e.: 1234567890 with mask "(000) 000-0000" will display "(123) 456-7890"
                 */
                mask: maskFormatter_1.maskFormatter,
                /**
                 * You can pipe multiple formatters (executed in sequence), use params to pass the list of formatters.
                 * Requires to pass an array of "formatters" in the column definition the generic "params" property
                 * For example::
                 * { field: 'title', formatter: Formatters.multiple, params: { formatters: [ Formatters.lowercase, Formatters.uppercase ] }
                 */
                multiple: multipleFormatter_1.multipleFormatter,
                /** Takes a cell value number (between 0.0-1.0) and displays a red (<50) or green (>=50) bar */
                percent: percentFormatter_1.percentFormatter,
                /** Takes a cell value number (between 0-100) and displays a red (<50) or green (>=50) bar */
                percentComplete: percentCompleteFormatter_1.percentCompleteFormatter,
                /** Takes a cell value number (between 0-100) and displays Bootstrap "percent-complete-bar" a red (<30), silver (>30 & <70) or green (>=70) bar */
                percentCompleteBar: percentCompleteBarFormatter_1.percentCompleteBarFormatter,
                /** Takes a cell value number (between 0-100) and add the "%" after the number */
                percentSymbol: percentSymbolFormatter_1.percentSymbolFormatter,
                /** Takes a cell value number (between 0-100) and displays Bootstrap "progress-bar" a red (<30), silver (>30 & <70) or green (>=70) bar */
                progressBar: progressBarFormatter_1.progressBarFormatter,
                /** Takes a cell value and translates it (i18n). Requires an instance of the Translate Service:: `i18n: this.translate */
                translate: translateFormatter_1.translateFormatter,
                /** Takes a boolean value, cast it to upperCase string and finally translates it (i18n). */
                translateBoolean: translateBooleanFormatter_1.translateBooleanFormatter,
                /** Takes a value and displays it all uppercase */
                uppercase: uppercaseFormatter_1.uppercaseFormatter,
                /** Takes a boolean value and display a string 'Yes' or 'No' */
                yesNo: yesNoFormatter_1.yesNoFormatter
            });
        }
    };
});
//# sourceMappingURL=index.js.map