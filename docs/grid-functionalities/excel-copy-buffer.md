### Description
Just like Excel you can select multiple cell and copy (`Ctrl+C`) and paste to Excel (`Ctrl+V`). However what you must know is that this plugin evaluate every single cell by their values (the raw value unless you specify otherwise, continue reading for more info).

### Demo
#### with Inline Editor
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example3) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example3.ts)

#### with Localization
[Demo Page](https://ghiscoding.github.io/aurelia-slickgrid/#/slickgrid/example12) / [Demo Component](https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example12.ts)

### Usage
All you need to do is enable the Grid Option `enableExcelCopyBuffer: true` and give it a try. From your grid, start selecting multiple cells with the mouse then copy (with `Ctrl+C`) and paste to Excel (with `Ctrl+V`)

##### Component
```typescript
this.columnDefinitions = [
  { id: 'title', name: 'Title', field: 'id' },
  { id: 'description', name: 'Description', field: 'description' },
  { id: 'duration', name: 'Duration (days)', field: 'duration', type: FieldType.number },
];
this.gridOptions = {
  enableExcelCopyBuffer: true,
};
```

### Copy & Paste with Cell Formatter
What if you have a date in UTC format in your dataset but your grid shows it as a Date ISO format? In that case, you are using a Formatter (e.g. `formatter: Formatters.dateIso`) and you wish to use that formatter. Good news, that is supported with and to make is simpler for the implementation, we will use a flag that already exist which is `exportWithFormatter` and is used by the `Export to File` service (for more info, read [Wiki - Export to File](Export-to-Text-File.md)

The `exportWithFormatter` can be used in 2 ways, on each column definition independently or for the entire grid through it's grid option.
##### `exportWithFormatter` through each Column Definition
```typescript
this.columnDefinitions = [
  {
    id: 'start', name: 'Start', field: 'start',
    formatter: Formatters.dateIso,
    exportWithFormatter: true
  },
  {
    id: 'finish', name: 'Finish', field: 'finish',
    formatter: Formatters.dateIso,
    exportWithFormatter: true
  },
];

this.gridOptions = {
  enableExcelCopyBuffer: true,
};
```

##### `exportWithFormatter` through Grid Options
```typescript
this.columnDefinitions = [
  { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso },
  { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso },
];

this.gridOptions = {
  enableExcelCopyBuffer: true,
  exportOptions: {
    // set at the grid option level, meaning all column will evaluate the Formatter (when it has a Formatter defined)
    exportWithFormatter: true
  },
};
```
#### Sanitize Formatter Ouput
In some cases a Formatter can be formed of HTML and that will end up showing in your Copy+Paste. You can simply use the `sanitizeDataExport` flag which will remove any HTML tags from the output. For an example below, let say that our first Title column are all displayed in bold in the grid (e.g. `<b>Title 1</b>`), we want to sanitize that output a regular text output (e.g. `Title 1`)

##### `exportWithFormatter` through each Column Definition
```typescript
this.columnDefinitions = [
  {
    id: 'title', name: 'Title', field: 'id',
    formatter: Formatters.bold,
    exportWithFormatter: true,
    sanitizeDataExport: true
  }
];

this.gridOptions = {
  enableExcelCopyBuffer: true
};
```

##### `exportWithFormatter` through Grid Options
```typescript
this.columnDefinitions = [
  { id: 'title', name: 'Title', field: 'id', formatter: Formatters.bold }
];

this.gridOptions = {
  enableExcelCopyBuffer: true,
  exportOptions: {
    exportWithFormatter: true,
    sanitizeDataExport: true
  },
};
```
