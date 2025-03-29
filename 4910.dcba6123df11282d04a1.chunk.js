"use strict";(self.webpackChunkau_slickgrid_demo=self.webpackChunkau_slickgrid_demo||[]).push([[4910],{2281:(t,e)=>{function i(t,e,i){return e<=t&&t<=i}function r(t){if(void 0===t)return{};if(t===Object(t))return t;throw TypeError("Could not convert argument to dictionary")}function s(t){this.tokens=[].slice.call(t)}s.prototype={endOfStream:function(){return!this.tokens.length},read:function(){return this.tokens.length?this.tokens.shift():-1},prepend:function(t){if(Array.isArray(t))for(var e=t;e.length;)this.tokens.unshift(e.pop());else this.tokens.unshift(t)},push:function(t){if(Array.isArray(t))for(var e=t;e.length;)this.tokens.push(e.shift());else this.tokens.push(t)}};var o=-1;var a="utf-8";function n(t,e){if(!(this instanceof n))return new n(t,e);if((t=void 0!==t?String(t).toLowerCase():a)!==a)throw new Error("Encoding not supported. Only utf-8 is supported");e=r(e),this._streaming=!1,this._encoder=null,this._options={fatal:Boolean(e.fatal)},Object.defineProperty(this,"encoding",{value:"utf-8"})}function l(t){t.fatal,this.handler=function(t,e){if(-1===e)return o;if(i(e,0,127))return e;var r,s;i(e,128,2047)?(r=1,s=192):i(e,2048,65535)?(r=2,s=224):i(e,65536,1114111)&&(r=3,s=240);for(var a=[(e>>6*r)+s];r>0;){var n=e>>6*(r-1);a.push(128|63&n),r-=1}return a}}n.prototype={encode:function(t,e){t=t?String(t):"",e=r(e),this._streaming||(this._encoder=new l(this._options)),this._streaming=Boolean(e.stream);for(var i,a=[],n=new s(function(t){for(var e=String(t),i=e.length,r=0,s=[];r<i;){var o=e.charCodeAt(r);if(o<55296||o>57343)s.push(o);else if(56320<=o&&o<=57343)s.push(65533);else if(55296<=o&&o<=56319)if(r===i-1)s.push(65533);else{var a=t.charCodeAt(r+1);if(56320<=a&&a<=57343){var n=1023&o,l=1023&a;s.push(65536+(n<<10)+l),r+=1}else s.push(65533)}r+=1}return s}(t));!n.endOfStream()&&(i=this._encoder.handler(n,n.read()))!==o;)Array.isArray(i)?a.push.apply(a,i):a.push(i);if(!this._streaming){for(;(i=this._encoder.handler(n,n.read()))!==o;)Array.isArray(i)?a.push.apply(a,i):a.push(i);this._encoder=null}return new Uint8Array(a)}},e._=n},4910:(t,e,i)=>{i.d(e,{f:()=>n});var r=i(2281),s=i(7097),o=i(6084);const a={delimiter:s.IQ1.comma,filename:"export",format:s.ptE.csv,useUtf8WithBom:!0};class n{constructor(){this._delimiter=",",this._exportQuoteWrapper="",this._fileFormat=s.ptE.csv,this._lineCarriageReturn="\n",this._columnHeaders=[],this._hasGroupedItems=!1,this.className="TextExportService"}get _datasetIdPropName(){return this._gridOptions&&this._gridOptions.datasetIdPropertyName||"id"}get _dataView(){return this._grid?.getData()}get _gridOptions(){return this._grid?.getOptions()??{}}dispose(){this._pubSubService?.unsubscribeAll()}init(t,e){if(this._grid=t,this._pubSubService=e.get("PubSubService"),this._locales=this._gridOptions&&this._gridOptions.locales||s.YMJ.locales,this._translaterService=this._gridOptions?.translater,this._gridOptions.enableTranslate&&(!this._translaterService||!this._translaterService.translate))throw new Error('[Slickgrid-Universal] requires a Translate Service to be passed in the "translater" Grid Options when "enableTranslate" is enabled. (example: this.gridOptions = { enableTranslate: true, translater: this.translaterService })')}exportToFile(t){if(!this._grid||!this._dataView||!this._pubSubService)throw new Error('[Slickgrid-Universal] it seems that the SlickGrid & DataView objects and/or PubSubService are not initialized did you forget to enable the grid option flag "enableTextExport"?');return new Promise((e=>{this._pubSubService?.publish("onBeforeExportToTextFile",!0),this._exportOptions=(0,o.extend)(!0,{},{...a,...this._gridOptions.textExportOptions,...t}),this._delimiter=this._exportOptions.delimiterOverride||this._exportOptions.delimiter||"",this._fileFormat=this._exportOptions.format||s.ptE.csv;const i=this.getDataOutput();window.setTimeout((()=>{const t={filename:`${this._exportOptions.filename}.${this._fileFormat}`,format:this._fileFormat||s.ptE.csv,mimeType:this._exportOptions.mimeType||"text/plain",useUtf8WithBom:!this._exportOptions||!this._exportOptions.hasOwnProperty("useUtf8WithBom")||this._exportOptions.useUtf8WithBom};this.startDownloadFile({...t,content:i}),this._pubSubService?.publish("onAfterExportToTextFile",t),e(!0)}),0)}))}startDownloadFile(t){const e=(0,s.lkA)(t.content);let i;i=t.format===s.ptE.csv?new r._("utf-8").encode(e):e;const o=new Blob([t.useUtf8WithBom?"\ufeff":"",i],{type:t.mimeType});if("function"==typeof navigator.msSaveOrOpenBlob)navigator.msSaveOrOpenBlob(o,t.filename);else{const e=document.createElement("a"),i=URL.createObjectURL(o);e.textContent="download",e.href=i,e.setAttribute("download",t.filename),e.style.visibility="hidden",document.body.appendChild(e),e.click(),document.body.removeChild(e)}}getDataOutput(){const t=this._grid.getColumns()||[];let e=this._exportOptions.groupingColumnHeaderTitle;!e&&this._gridOptions.enableTranslate&&this._translaterService?.translate&&this._translaterService?.getCurrentLanguage?.()?e=this._translaterService.translate(`${(0,s.mVi)(this._gridOptions)}GROUP_BY`):e||(e=this._locales&&this._locales.TEXT_GROUP_BY),this._exportQuoteWrapper=this._fileFormat===s.ptE.csv?'"':"";let i="";const r=this._dataView.getGrouping();return r&&Array.isArray(r)&&r.length>0?(this._hasGroupedItems=!0,i+=this._fileFormat===s.ptE.csv?`"${e}"${this._delimiter}`:`${e}${this._delimiter}`):this._hasGroupedItems=!1,this._gridOptions.createPreHeaderPanel&&this._gridOptions.showPreHeaderPanel&&!this._gridOptions.enableDraggableGrouping&&(this._groupedColumnHeaders=this.getColumnGroupedHeaderTitles(t)||[],this._groupedColumnHeaders&&Array.isArray(this._groupedColumnHeaders)&&this._groupedColumnHeaders.length>0)&&(i+=this._groupedColumnHeaders.map((t=>`${this._exportQuoteWrapper}${t.title}${this._exportQuoteWrapper}`)).join(this._delimiter)+this._lineCarriageReturn),this._columnHeaders=this.getColumnHeaders(t)||[],this._columnHeaders&&Array.isArray(this._columnHeaders)&&this._columnHeaders.length>0&&(i+=this._columnHeaders.map((t=>(0,o.stripTags)(`${this._exportQuoteWrapper}${t.title}${this._exportQuoteWrapper}`))).join(this._delimiter)+this._lineCarriageReturn),i+=this.getAllGridRowData(t,this._lineCarriageReturn),i}getAllGridRowData(t,e){const i=[],r=this._dataView.getLength();for(let e=0;e<r;e++){const r=this._dataView.getItem(e);r&&!r.hasOwnProperty("getItem")&&(null!==r[this._datasetIdPropName]&&void 0!==r[this._datasetIdPropName]?i.push(this.readRegularRowData(t,e,r)):this._hasGroupedItems&&void 0===r.__groupTotals?i.push(this.readGroupedTitleRow(r)):r.__groupTotals&&i.push(this.readGroupedTotalRow(t,r)))}return i.join(e)}getColumnGroupedHeaderTitles(t){const e=[];return t&&Array.isArray(t)&&t.forEach((t=>{let i="";i=t.columnGroupKey&&this._gridOptions.enableTranslate&&this._translaterService?.translate&&this._translaterService?.getCurrentLanguage?.()?this._translaterService.translate(t.columnGroupKey):t.columnGroup||"";const r=t.excludeFromExport||!1;(void 0===t.width||t.width>0)&&!r&&e.push({key:t.field||t.id,title:i||""})})),e}getColumnHeaders(t){const e=[];return t&&Array.isArray(t)&&t.forEach((t=>{let i="";i=(t.nameKey||t.nameKey)&&this._gridOptions.enableTranslate&&this._translaterService?.translate&&this._translaterService?.getCurrentLanguage?.()?this._translaterService.translate(t.nameKey||t.nameKey):(0,o.getHtmlStringOutput)(t.name||"","innerHTML")||(0,o.titleCase)(t.field);const r=t.excludeFromExport||!1;(void 0===t.width||t.width>0)&&!r&&e.push({key:t.field||t.id,title:i||""})})),e}readRegularRowData(t,e,i){let r=0;const a=[],n=this._exportQuoteWrapper;let l=1;const h=this._dataView.getItemMetadata(e);for(let p=0,u=t.length;p<u;p++){const u=t[p];if(u.excludeFromExport)continue;if(this._hasGroupedItems&&0===r){const t=this._fileFormat===s.ptE.csv?'""':"";a.push(t)}if(this._gridOptions.enableCellRowSpan){const t=this._grid.getParentRowSpanByCell(e,p,!1);if(t&&t.start!==e){a.push("");continue}}let d;if(h?.columns){const t=h?.columns,e=t[u.id]||t[p];!isNaN(l)&&+l>1||"*"===l&&p>0||(l=e?.colspan??1),"*"!==l&&(u.id in t||p in t)&&(d=u.id)}if("*"===l&&p>0||!isNaN(l)&&+l>1&&u.id!==d)a.push(""),!isNaN(l)&&+l>1&&l--;else{let t=(0,s.qgn)(e,p,u,i,this._grid,this._exportOptions);(u.sanitizeDataExport||this._exportOptions.sanitizeDataExport)&&(t=(0,o.stripTags)(t)),this._fileFormat===s.ptE.csv&&t&&(t=t.toString().replace(/"/gi,'""'));const r=u?.exportCsvForceToKeepAsString?"=":"";a.push(r+n+t+n)}r++}return a.join(this._delimiter)}readGroupedTitleRow(t){let e=(0,o.stripTags)(t.title);const i=this._exportQuoteWrapper;return e=(0,o.addWhiteSpaces)(5*t.level)+e,this._fileFormat===s.ptE.csv&&(e=e.toString().replace(/"/gi,'""')),i+e+i}readGroupedTotalRow(t,e){const i=this._exportOptions.delimiter,r=this._exportOptions.format,a=this._exportOptions.groupingAggregatorRowText||"",n=this._exportQuoteWrapper,l=[`${n}${a}${n}`];return t.forEach((t=>{let i="";const a=t.excludeFromExport||!1;if(t.groupTotalsFormatter){const r=t.groupTotalsFormatter(e,t,this._grid);i=r instanceof HTMLElement?r.textContent||"":r}(t.sanitizeDataExport||this._exportOptions.sanitizeDataExport)&&(i=(0,o.stripTags)(i)),r===s.ptE.csv&&(i=i.toString().replace(/"/gi,'""')),(void 0===t.width||t.width>0)&&!a&&l.push(n+i+n)})),l.join(i)}}}}]);