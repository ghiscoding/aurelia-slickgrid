(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{"7OnR":function(t,e,i){"use strict";i.d(e,"a",(function(){return o}));var s=i("fj9p");class o{constructor(){this.isPreviouslyShown=!1}get gridOptions(){return this.grid&&this.grid.getOptions?this.grid.getOptions():{}}init(t,e){this.grid=t,this.translaterService=e.get("TranslaterService")}dispose(){var t,e;null===(t=this._warningLeftElement)||void 0===t||t.remove(),null===(e=this._warningRightElement)||void 0===e||e.remove(),this._warningLeftElement=null,this._warningRightElement=null}showEmptyDataMessage(t=!0,e){var i,o,n,l,a,d,r,c,h,u,m,v;if(!this.grid||!this.gridOptions||this.isPreviouslyShown===t)return!1;this.isPreviouslyShown=t;const g=this.grid.getUID(),p=Object.assign(Object.assign({message:"No data to display."},this.gridOptions.emptyDataWarning),e),E=null!==(i=null==p?void 0:p.className)&&void 0!==i?i:"slick-empty-data-warning";this._warningLeftElement=document.querySelector(`.${g} .${E}`);const b=document.querySelector(`.${g} .grid-canvas.grid-canvas-left`),C=document.querySelector(`.${g} .grid-canvas.grid-canvas-right`),_=null!==(o=p.leftViewportMarginLeft)&&void 0!==o?o:0,y=null!==(n=p.rightViewportMarginLeft)&&void 0!==n?n:0,f=null!==(l=p.frozenLeftViewportMarginLeft)&&void 0!==l?l:0,w=null!==(a=p.frozenRightViewportMarginLeft)&&void 0!==a?a:0,S=void 0!==(null===(d=this.gridOptions)||void 0===d?void 0:d.frozenColumn)&&this.gridOptions.frozenColumn>=0,O="string"==typeof _?_:_+"px",L="string"==typeof y?y:y+"px";if(this.gridOptions.autoHeight){const e=document.querySelector(".slick-pane.slick-pane-top.slick-pane-left");if(e&&e.style&&b&&b.style){const i=parseInt(e.style.height,10)||0,s=null!==(c=null===(r=this.gridOptions)||void 0===r?void 0:r.rowHeight)&&void 0!==c?c:0,o=this.gridOptions.enableFiltering&&null!==(u=null===(h=this.gridOptions)||void 0===h?void 0:h.headerRowHeight)&&void 0!==u?u:0,n=this.gridOptions.createPreHeaderPanel&&null!==(v=null===(m=this.gridOptions)||void 0===m?void 0:m.preHeaderPanelHeight)&&void 0!==v?v:0;if(t){let t=null!==i&&i<100?i:100;t+=o+n,e.style.minHeight=t+"px",b.style.minHeight=s+"px"}}}let T=p.message;if(this.gridOptions.enableTranslate&&this.translaterService&&(null==p?void 0:p.messageKey)&&(T=this.translaterService.translate(p.messageKey)),!this._warningLeftElement&&b&&C){const t=this.gridOptions&&this.gridOptions.sanitizeHtmlOptions||{},e=Object(s.sd)(this.gridOptions,T,t);this._warningLeftElement=document.createElement("div"),this._warningLeftElement.classList.add(E),this._warningLeftElement.classList.add("left"),this._warningLeftElement.innerHTML=e,this._warningRightElement=this._warningLeftElement.cloneNode(!0),this._warningRightElement.classList.add("right"),C.appendChild(this._warningRightElement),b.appendChild(this._warningLeftElement)}if(this._warningLeftElement){let e=t?"block":"none";S&&t&&(e=p.hideFrozenLeftWarning?"none":"block"),this._warningLeftElement.style.display=e;const i="string"==typeof f?f:f+"px";this._warningLeftElement.style.marginLeft=S?i:O}if(this._warningRightElement){let e=t?"block":"none";S&&t&&(e=p.hideFrozenRightWarning?"none":"block"),this._warningRightElement.style.display=e;const i="string"==typeof w?w:w+"px";this._warningRightElement.style.marginLeft=S?i:L}return t}}},eVkZ:function(t,e,i){"use strict";i.d(e,"a",(function(){return n}));i("5aBb");var s=i("fj9p");const o=t=>console.log(t.message);class n{constructor(){this._eventHandler=new Slick.EventHandler,this._bindEventService=new s.f}get eventHandler(){return this._eventHandler}get dataView(){return this.grid.getData()}get dataViewLength(){return this.dataView.getLength()}get formValues(){return this._formValues}get editors(){return this._editors}set editors(t){this._editors=t}get gridOptions(){var t;return null===(t=this.grid)||void 0===t?void 0:t.getOptions()}init(t,e){var i,o;if(this.grid=t,this.gridService=e.get("GridService"),this.gridStateService=e.get("GridStateService"),this.translaterService=e.get("TranslaterService"),!this.gridService||!this.gridStateService)throw new Error("[Slickgrid-Universal] it seems that the GridService and/or GridStateService are not being loaded properly, make sure the Container Service is properly implemented.");if(this.gridOptions.enableTranslate&&(!this.translaterService||!this.translaterService.translate))throw new Error('[Slickgrid-Universal] requires a Translate Service to be installed and configured when the grid option "enableTranslate" is enabled.');this._locales=null!==(o=null===(i=this.gridOptions)||void 0===i?void 0:i.locales)&&void 0!==o?o:s.t.locales}dispose(){this._eventHandler.unsubscribeAll(),this._bindEventService.unbindAll(),this._formValues=null,this.disposeComponent()}disposeComponent(){var t;"function"==typeof(null===(t=this._modalElm)||void 0===t?void 0:t.remove)&&(this._modalElm.remove(),document.body.classList.remove("slick-modal-open"))}changeFormInputValue(t,e,i=!1){var s,o,n,l,a,d;const r=null===(s=this._editors)||void 0===s?void 0:s[t];let c=e;if(!r&&!i)throw new Error(`Composite Editor with column id "${t}" not found.`);if(r&&r.setValue&&Array.isArray(this._editorContainers)){r.setValue(e,!0);const i=this._editorContainers.find(e=>e.dataset.editorid===t),s=null!==(l=null===(n=null===(o=this.gridOptions)||void 0===o?void 0:o.compositeEditorOptions)||void 0===n?void 0:n.excludeDisabledFieldFormValues)&&void 0!==l&&l;!r.disabled||r.disabled&&!s?null===(a=null==i?void 0:i.classList)||void 0===a||a.add("modified"):(c="",null===(d=null==i?void 0:i.classList)||void 0===d||d.remove("modified")),!r.disabled||""===c&&null===c&&void 0===c&&0===c||(c="")}this._formValues=Object.assign(Object.assign({},this._formValues),{[t]:c})}changeFormEditorOption(t,e,i){var s;const o=null===(s=this._editors)||void 0===s?void 0:s[t];if(!(null==o?void 0:o.changeEditorOption))throw new Error(`Editor with column id "${t}" not found OR the Editor does not support "changeEditorOption" (current only available with AutoComplete, Date, MultipleSelect & SingleSelect Editors).`);o.changeEditorOption(e,i)}disableFormInput(t,e=!0){var i;const s=null===(i=this._editors)||void 0===i?void 0:i[t];(null==s?void 0:s.disable)&&Array.isArray(this._editorContainers)&&s.disable(e)}openDetails(t){var e,i,n,l,a,d,r,c,h,u,m,v,g,p,E;const b=null!==(e=t.onError)&&void 0!==e?e:o,C={backdrop:"static",showCloseButtonOutside:!0,viewColumnLayout:"auto",modalType:"edit"};try{if(!this.grid||this.grid.getEditorLock().isActive()&&!this.grid.getEditorLock().commitCurrentEdit())return null;this._options=Object.assign(Object.assign(Object.assign(Object.assign({},C),this.gridOptions.compositeEditorOptions),t),{labels:Object.assign(Object.assign({},null===(i=this.gridOptions.compositeEditorOptions)||void 0===i?void 0:i.labels),null==t?void 0:t.labels)}),this._options.backdrop=void 0!==t.backdrop?t.backdrop:"static";const e=this._options.viewColumnLayout||1,o=this.grid.getActiveCell(),u=null!==(n=null==o?void 0:o.cell)&&void 0!==n?n:0,m=null!==(l=null==o?void 0:o.row)&&void 0!==l?l:0,v=this.grid.getUID()||"";let g=t.headerTitle||"";if(this.hasRowSelectionEnabled()&&"auto-mass"===this._options.modalType&&this.grid.getSelectedRows){(this.grid.getSelectedRows()||[]).length>0?(this._options.modalType="mass-selection",(null==t?void 0:t.headerTitleMassSelection)&&(g=null==t?void 0:t.headerTitleMassSelection)):(this._options.modalType="mass-update",(null==t?void 0:t.headerTitleMassUpdate)&&(g=null==t?void 0:t.headerTitleMassUpdate))}const p=this._options.modalType||"edit";if(!this.gridOptions.editable)return b({type:"error",code:"EDITABLE_GRID_REQUIRED",message:"Your grid must be editable in order to use the Composite Editor Modal."}),null;if(!this.gridOptions.enableCellNavigation)return b({type:"error",code:"ENABLE_CELL_NAVIGATION_REQUIRED",message:'Composite Editor requires the flag "enableCellNavigation" to be set to True in your Grid Options.'}),null;if(!(this.gridOptions.enableAddRow||"clone"!==p&&"create"!==p))return b({type:"error",code:"ENABLE_ADD_ROW_REQUIRED",message:'Composite Editor requires the flag "enableAddRow" to be set to True in your Grid Options when cloning/creating a new item.'}),null;if(!(o||"clone"!==p&&"edit"!==p))return b({type:"warning",code:"NO_RECORD_FOUND",message:"No records selected for edit or clone operation."}),null;{const t="mass-update"===p||"mass-selection"===p,i=t?{}:this.grid.getDataItem(m);this._originalDataContext=Object(s.rc)(i);const o=this.grid.getColumns(),n=this.hasRowSelectionEnabled()?this.grid.getSelectedRows():[],l=null!==(d=null===(a=this.dataView)||void 0===a?void 0:a.getItems())&&void 0!==d?d:[],E=Array.isArray(l)?l.length:0;this._lastActiveRowNumber=m;const C=null===(r=this.gridStateService)||void 0===r?void 0:r.getCurrentRowSelections(),_=(null==C?void 0:C.dataContextIds)||[],y="create"===p?this.dataViewLength:m;if(!this.focusOnFirstColumnCellWithEditor(o,i,u,y,t))return null;if("edit"===p&&!i)return b({type:"warning",code:"ROW_NOT_EDITABLE",message:"Current row is not editable."}),null;if("mass-selection"===p&&n.length<1)return b({type:"warning",code:"ROW_SELECTION_REQUIRED",message:"You must select some rows before trying to apply new value(s)."}),null;let f=[];f=t?o.filter(t=>{var e;return t.editor&&!0===(null===(e=t.internalColumnEditor)||void 0===e?void 0:e.massUpdate)}):o.filter(t=>t.editor);const w=g.replace(/\{\{(.*?)\}\}/g,(t,e)=>Object(s.Ic)(i,e)),S=Object(s.sd)(this.gridOptions,w),O="auto"===e?this.autoCalculateLayoutColumnCount(f.length):e;this._modalElm=document.createElement("div"),this._modalElm.className="slick-editor-modal "+v;const L=document.createElement("div");if(L.className="slick-editor-modal-content",e>1||"auto"===e&&O>1){const t=2===O?"split-view":"triple-split-view";L.classList.add(t)}const T=document.createElement("div");T.className="slick-editor-modal-title",T.innerHTML=S;const x=document.createElement("button");x.type="button",x.textContent="×",x.className="close",x.dataset.action="close",x.dataset.ariaLabel="Close",this._options.showCloseButtonOutside&&(null===(c=null==T?void 0:T.classList)||void 0===c||c.add("outside"),null===(h=null==x?void 0:x.classList)||void 0===h||h.add("outside"));const R=document.createElement("div");R.className="slick-editor-modal-header",R.appendChild(T),R.appendChild(x);const V=document.createElement("div");V.className="slick-editor-modal-body",this._modalBodyTopValidationElm=document.createElement("div"),this._modalBodyTopValidationElm.className="validation-summary",this._modalBodyTopValidationElm.style.display="none",V.appendChild(this._modalBodyTopValidationElm);const k=document.createElement("div");k.className="slick-editor-modal-footer";const A=document.createElement("button");A.type="button",A.className="btn btn-cancel btn-default btn-sm",A.dataset.action="cancel",A.dataset.ariaLabel=this.getLabelText("cancelButton","TEXT_CANCEL","Cancel"),A.textContent=this.getLabelText("cancelButton","TEXT_CANCEL","Cancel");let N="",I="";switch(p){case"clone":I=this.getLabelText("cloneButton","TEXT_CLONE","Clone");break;case"mass-update":const t=this.getLabelText("massUpdateStatus","TEXT_ALL_X_RECORDS_SELECTED","All {{x}} records selected");N=this.parseText(t,{x:E}),I=this.getLabelText("massUpdateButton","TEXT_APPLY_MASS_UPDATE","Mass Update");break;case"mass-selection":const e=this.getLabelText("massSelectionStatus","TEXT_X_OF_Y_MASS_SELECTED","{{x}} of {{y}} selected");N=this.parseText(e,{x:_.length,y:E}),I=this.getLabelText("massSelectionButton","TEXT_APPLY_TO_SELECTION","Update Selection");break;default:I=this.getLabelText("saveButton","TEXT_SAVE","Save")}const D=document.createElement("div");D.className="footer-status-text",D.textContent=N,this._modalSaveButtonElm=document.createElement("button"),this._modalSaveButtonElm.type="button",this._modalSaveButtonElm.className="btn btn-save btn-primary btn-sm",this._modalSaveButtonElm.dataset.action="create"===p||"edit"===p?"save":p,this._modalSaveButtonElm.dataset.ariaLabel=I,this._modalSaveButtonElm.textContent=I;const B=document.createElement("div");B.className="footer-buttons","mass-update"!==p&&"mass-selection"!==p||k.appendChild(D),B.appendChild(A),B.appendChild(this._modalSaveButtonElm),k.appendChild(B),L.appendChild(R),L.appendChild(V),L.appendChild(k),this._modalElm.appendChild(L);for(const t of f)if(t.editor){const e=document.createElement("div");e.className="item-details-container editor-"+t.id,1===O?e.classList.add("slick-col-medium-12"):e.classList.add("slick-col-medium-6","slick-col-xlarge-"+12/O);const i=document.createElement("div");i.className="item-details-label editor-"+t.id,i.textContent=this.getColumnLabel(t)||"n/a";const s=document.createElement("div");s.className="item-details-editor-container slick-cell",s.dataset.editorid=""+t.id;const o=document.createElement("div");o.className="item-details-validation editor-"+t.id,e.appendChild(i),e.appendChild(s),e.appendChild(o),V.appendChild(e)}document.body.appendChild(this._modalElm),document.body.classList.add("slick-modal-open"),this._bindEventService.bind(document.body,"click",this.handleBodyClicked.bind(this)),this._editors={},this._editorContainers=f.map(t=>V.querySelector(`[data-editorid=${t.id}]`))||[];const M={destroy:this.disposeComponent.bind(this),modalType:p,validationMsgPrefix:"* ",formValues:{},editors:this._editors},j=new Slick.CompositeEditor(f,this._editorContainers,M);this.grid.editActiveCell(j),this._bindEventService.bind(x,"click",this.cancelEditing.bind(this)),this._bindEventService.bind(A,"click",this.cancelEditing.bind(this)),this._bindEventService.bind(this._modalSaveButtonElm,"click",this.handleSaveClicked.bind(this)),this._bindEventService.bind(this._modalElm,"keydown",this.handleKeyDown.bind(this)),this._bindEventService.bind(this._modalElm,"focusout",this.validateCurrentEditor.bind(this)),this._bindEventService.bind(this._modalElm,"blur",this.validateCurrentEditor.bind(this));const U=this.grid.onCompositeEditorChange;this._eventHandler.subscribe(U,this.handleOnCompositeEditorChange.bind(this));const H=this.grid.onAddNewRow;this._eventHandler.subscribe(H,(t,e)=>{this.insertNewItemInDataView(e.item),this._originalDataContext=e.item,this.dispose()})}return this}catch(t){this.dispose();const e="string"==typeof t?t:null!==(v=null!==(u=null==t?void 0:t.message)&&void 0!==u?u:null===(m=null==t?void 0:t.body)||void 0===m?void 0:m.message)&&void 0!==v?v:"";return b({type:"error",code:"string"==typeof t?t:null!==(E=null!==(g=null==t?void 0:t.status)&&void 0!==g?g:null===(p=null==t?void 0:t.body)||void 0===p?void 0:p.status)&&void 0!==E?E:e,message:e}),null}}async cancelEditing(){var t,e;let i=!0;this.formValues&&Object.keys(this.formValues).length>0&&"function"==typeof this._options.onClose&&(i=await this._options.onClose()),i&&(this.grid.getEditController().cancelCurrentEdit(),"edit"!==(null===(t=this._options)||void 0===t?void 0:t.modalType)&&"clone"!==(null===(e=this._options)||void 0===e?void 0:e.modalType)||this.resetCurrentRowDataContext(),this.grid.setActiveRow(this._lastActiveRowNumber),this.dispose())}showValidationSummaryText(t,e=""){var i,s;t?(this._modalBodyTopValidationElm.textContent=e,this._modalBodyTopValidationElm.style.display="block",null===(s=(i=this._modalBodyTopValidationElm).scrollIntoView)||void 0===s||s.call(i),this._modalSaveButtonElm.disabled=!1,this._modalSaveButtonElm.classList.remove("saving")):(this._modalBodyTopValidationElm.style.display="none",this._modalBodyTopValidationElm.textContent=e)}applySaveMassUpdateChanges(t){const e=this.dataView.getItems();for(const i in t)i in t&&e.forEach(e=>{i in t&&(e[i]=t[i])});this.dataView.setItems(e,this.gridOptions.datasetIdPropertyName),this.grid.invalidate()}applySaveMassSelectionChanges(t,e){var i,s;const o=(null!==(i=null==e?void 0:e.dataContextIds)&&void 0!==i?i:[]).map(t=>this.dataView.getItemById(t));for(const e in t)e in t&&o.forEach(i=>{e in t&&(i[e]=t[e])});null===(s=this.gridService)||void 0===s||s.updateItems(o)}autoCalculateLayoutColumnCount(t){return t>=15?3:t>=8?2:1}executeOnError(t){var e,i;(null!==(i=null===(e=this._options)||void 0===e?void 0:e.onError)&&void 0!==i?i:o)(t)}async executeOnSave(t,e,i,s){var o,n,l,a,d;try{this.showValidationSummaryText(!1,"");if(this.validateCompositeEditors().valid){if(this._modalSaveButtonElm.classList.add("saving"),this._modalSaveButtonElm.disabled=!0,"function"==typeof(null===(o=this._options)||void 0===o?void 0:o.onSave)){await(null===(n=this._options)||void 0===n?void 0:n.onSave(this.formValues,this.getCurrentRowSelections(),s))&&(t(this.formValues,this.getCurrentRowSelections()),e())}else t(this.formValues,this.getCurrentRowSelections()),e();"function"==typeof i&&i(),this.dispose()}}catch(t){const e="string"==typeof t?t:null!==(d=null!==(l=null==t?void 0:t.message)&&void 0!==l?l:null===(a=null==t?void 0:t.body)||void 0===a?void 0:a.message)&&void 0!==d?d:"";this.showValidationSummaryText(!0,e)}}focusOnFirstColumnCellWithEditor(t,e,i,s,o){const n=o&&!this.gridOptions.enableAddRow&&s>=this.dataViewLength?this.dataViewLength-1:s;let l=i;const a=t[i].editor;let d=this.grid.getCellNode(n,i);if(!a||!d||!this.getActiveCellEditor(n,i)){if(l=this.findNextAvailableEditorColumnIndex(t,e,s,o),-1===l)return this.executeOnError({type:"error",code:"NO_EDITOR_FOUND",message:"We could not find any Editor in your Column Definition"}),!1;this.grid.setActiveCell(n,l,!1),o&&this.grid.setActiveRow(this.dataViewLength,l,!0)}return d=this.grid.getCellNode(n,l),!!d}findNextAvailableEditorColumnIndex(t,e,i,s){var o;let n=-1;for(let l=0;l<t.length;l++){const a=t[l];if(a.editor&&(!s||s&&(null===(o=a.internalColumnEditor)||void 0===o?void 0:o.massUpdate))){const t=this.grid.onBeforeEditCell.notify({row:i,cell:l,item:e,column:a,grid:this.grid});if(this.grid.setActiveCell(i,l,!1),!1!==t){n=l;break}}}return n}getActiveCellEditor(t,e){return this.grid.setActiveCell(t,e,!1),this.grid.getCellEditor()}getColumnLabel(t){var e;const i=this.gridOptions.columnGroupSeparator||" - ";let s=t.nameCompositeEditor||t.name||"",o=t.columnGroup||"";if(this.gridOptions.enableTranslate&&this.translaterService){const i=t.nameCompositeEditorKey||t.nameKey;i&&(s=this.translaterService.translate(i)),t.columnGroupKey&&(null===(e=this.translaterService)||void 0===e?void 0:e.translate)&&(o=this.translaterService.translate(t.columnGroupKey))}return(o?`${o}${i}${s}`:s)||""}getLabelText(t,e,i){var s,o,n,l,a,d,r;const c=Object.assign(Object.assign({},null===(s=this.gridOptions.compositeEditorOptions)||void 0===s?void 0:s.labels),null===(o=this._options)||void 0===o?void 0:o.labels);if((null===(n=this.gridOptions)||void 0===n?void 0:n.enableTranslate)&&(null===(l=this.translaterService)||void 0===l?void 0:l.translate)&&c.hasOwnProperty(t+"Key")){const e=c[t+"Key"];return this.translaterService.translate(e)}return null!==(r=null!==(a=null==c?void 0:c[t])&&void 0!==a?a:null===(d=this._locales)||void 0===d?void 0:d[e])&&void 0!==r?r:i}getCurrentRowSelections(){var t;const e=null===(t=this.gridStateService)||void 0===t?void 0:t.getCurrentRowSelections();return{gridRowIndexes:(null==e?void 0:e.gridRowIndexes)||[],dataContextIds:(null==e?void 0:e.dataContextIds)||[]}}handleBodyClicked(t){var e,i,s;(null===(i=null===(e=t.target)||void 0===e?void 0:e.classList)||void 0===i?void 0:i.contains("slick-editor-modal"))&&"static"!==(null===(s=this._options)||void 0===s?void 0:s.backdrop)&&this.dispose()}handleKeyDown(t){"Escape"===t.code?(this.cancelEditing(),t.stopPropagation(),t.preventDefault()):"Tab"===t.code&&this.validateCurrentEditor()}async handleMassSaving(t,e){if(this.formValues&&0!==Object.keys(this.formValues).length){const i="mass-update"===t?"applySaveMassUpdateChanges":"applySaveMassSelectionChanges";this.executeOnSave(this[i].bind(this),e.bind(this))}else this.executeOnError({type:"warning",code:"NO_CHANGES_DETECTED",message:"Sorry we could not detect any changes."})}handleOnCompositeEditorChange(t,e){var i,s,o,n,l;const a=null!==(s=null===(i=e.column)||void 0===i?void 0:i.id)&&void 0!==s?s:"";this._formValues=Object.assign(Object.assign({},this._formValues),e.formValues);const d=null===(o=this._editors)||void 0===o?void 0:o[a],r=null!==(l=null===(n=null==d?void 0:d.isValueChanged)||void 0===n?void 0:n.call(d))&&void 0!==l&&l,c=document.querySelector(`[data-editorid=${a}]`);(null==c?void 0:c.classList)&&(r?c.classList.add("modified"):c.classList.remove("modified")),this.validateCompositeEditors()}hasRowSelectionEnabled(){const t=this.grid.getSelectionModel();return(this.gridOptions.enableRowSelection||this.gridOptions.enableCheckboxSelector)&&t}handleSaveClicked(){var t,e,i;const s=null===(t=this._options)||void 0===t?void 0:t.modalType;switch(s){case"mass-update":this.handleMassSaving(s,()=>{this.grid.getEditController().cancelCurrentEdit(),this.grid.setActiveCell(0,0,!1)});break;case"mass-selection":this.handleMassSaving(s,()=>{this.grid.getEditController().cancelCurrentEdit(),this.grid.setActiveRow(this._lastActiveRowNumber)});break;case"clone":const t=Object.assign(Object.assign({},this._originalDataContext),this.formValues),o=()=>{this.grid.getEditController().cancelCurrentEdit(),this.grid.setActiveCell(0,0,!1)};this.executeOnSave(this.insertNewItemInDataView.bind(this,t),o,this.resetCurrentRowDataContext.bind(this),t);break;case"create":case"edit":default:if(this.grid.getEditController().commitCurrentEdit(),"function"==typeof(null===(e=this._options)||void 0===e?void 0:e.onSave)){const t=this.grid.getDataItem(this._lastActiveRowNumber);null===(i=this._options)||void 0===i||i.onSave(this.formValues,this.getCurrentRowSelections(),t)}}}insertNewItemInDataView(t){var e,i,s,o;const n=null!==(i=null===(e=this.dataView)||void 0===e?void 0:e.getItems())&&void 0!==i?i:[],l=Array.isArray(n)?n.length:0,a=null!==(s=this._options.insertNewId)&&void 0!==s?s:l+1;t[this.gridOptions.datasetIdPropertyName||"id"]=a,this.dataView.getItemById(a)?this.executeOnError({type:"error",code:"ITEM_ALREADY_EXIST",message:"The item object which you are trying to add already exist with the same Id:: "+a}):null===(o=this.gridService)||void 0===o||o.addItem(t,this._options.insertOptions)}parseText(t,e){return t.replace(/\{\{(.*?)\}\}/g,(t,i)=>void 0!==e[i]?e[i]:t)}resetCurrentRowDataContext(){const t=this.gridOptions.datasetIdPropertyName||"id";this.grid.getData().updateItem(this._originalDataContext[t],this._originalDataContext)}validateCompositeEditors(t){let e={valid:!0,msg:""};const i=this.grid.getCellEditor();return i&&(e=i.validate(t)),e}validateCurrentEditor(){const t=this.grid.getCellEditor();(null==t?void 0:t.validate)&&t.validate()}}}}]);
//# sourceMappingURL=vendors~c8763b32.5211b8bba1f41d29bb17.bundle.map