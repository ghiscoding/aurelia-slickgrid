(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{"7OnR":function(t,e,i){"use strict";i.d(e,"a",(function(){return s}));var o=i("fj9p");class s{constructor(){this._warningLeftElement=null,this._warningRightElement=null,this.isPreviouslyShown=!1}get gridOptions(){return this.grid&&this.grid.getOptions?this.grid.getOptions():{}}init(t,e){this.grid=t,this.translaterService=e.get("TranslaterService")}dispose(){var t,e;null===(t=this._warningLeftElement)||void 0===t||t.remove(),null===(e=this._warningRightElement)||void 0===e||e.remove(),this._warningLeftElement=null,this._warningRightElement=null}showEmptyDataMessage(t=!0,e){var i,s,n,l,a,d,r,c,h,u,m,v;if(!this.grid||!this.gridOptions||this.isPreviouslyShown===t)return!1;this.isPreviouslyShown=t;const g=this.grid.getUID(),p={message:"No data to display.",...this.gridOptions.emptyDataWarning,...e},E=null!==(i=null==p?void 0:p.className)&&void 0!==i?i:"slick-empty-data-warning";this._warningLeftElement=document.querySelector(`.${g} .${E}`);const _=document.querySelector(`.${g} .grid-canvas.grid-canvas-left`),C=document.querySelector(`.${g} .grid-canvas.grid-canvas-right`),b=null!==(s=p.leftViewportMarginLeft)&&void 0!==s?s:0,f=null!==(n=p.rightViewportMarginLeft)&&void 0!==n?n:0,y=null!==(l=p.frozenLeftViewportMarginLeft)&&void 0!==l?l:0,w=null!==(a=p.frozenRightViewportMarginLeft)&&void 0!==a?a:0,S=void 0!==(null===(d=this.gridOptions)||void 0===d?void 0:d.frozenColumn)&&this.gridOptions.frozenColumn>=0,O="string"==typeof b?b:b+"px",L="string"==typeof f?f:f+"px";if(this.gridOptions.autoHeight){const e=document.querySelector(".slick-pane.slick-pane-top.slick-pane-left");if(e&&e.style&&_&&_.style){const i=parseInt(e.style.height,10)||0,o=null!==(c=null===(r=this.gridOptions)||void 0===r?void 0:r.rowHeight)&&void 0!==c?c:0,s=this.gridOptions.enableFiltering&&null!==(u=null===(h=this.gridOptions)||void 0===h?void 0:h.headerRowHeight)&&void 0!==u?u:0,n=this.gridOptions.createPreHeaderPanel&&null!==(v=null===(m=this.gridOptions)||void 0===m?void 0:m.preHeaderPanelHeight)&&void 0!==v?v:0;if(t){let t=null!==i&&i<100?i:100;t+=s+n,e.style.minHeight=t+"px",_.style.minHeight=o+"px"}}}let T=p.message;if(this.gridOptions.enableTranslate&&this.translaterService&&(null==p?void 0:p.messageKey)&&(T=this.translaterService.translate(p.messageKey)),!this._warningLeftElement&&_&&C){const t=this.gridOptions&&this.gridOptions.sanitizeHtmlOptions||{},e=Object(o.Ad)(this.gridOptions,T,t);this._warningLeftElement=document.createElement("div"),this._warningLeftElement.classList.add(E),this._warningLeftElement.classList.add("left"),this._warningLeftElement.innerHTML=e,this._warningRightElement=this._warningLeftElement.cloneNode(!0),this._warningRightElement.classList.add("right"),C.appendChild(this._warningRightElement),_.appendChild(this._warningLeftElement)}if(this._warningLeftElement){let e=t?"block":"none";S&&t&&(e=p.hideFrozenLeftWarning?"none":"block"),this._warningLeftElement.style.display=e;const i="string"==typeof y?y:y+"px";this._warningLeftElement.style.marginLeft=S?i:O}if(this._warningRightElement){let e=t?"block":"none";S&&t&&(e=p.hideFrozenRightWarning?"none":"block"),this._warningRightElement.style.display=e;const i="string"==typeof w?w:w+"px";this._warningRightElement.style.marginLeft=S?i:L}return t}}},eVkZ:function(t,e,i){"use strict";i.d(e,"a",(function(){return n}));i("5aBb");var o=i("fj9p");const s=t=>console.log(t.message);class n{constructor(){this._lastActiveRowNumber=-1,this._formValues=null,this.gridService=null,this.gridStateService=null,this._eventHandler=new Slick.EventHandler,this._bindEventService=new o.f}get eventHandler(){return this._eventHandler}get dataView(){return this.grid.getData()}get dataViewLength(){return this.dataView.getLength()}get formValues(){return this._formValues}get editors(){return this._editors}set editors(t){this._editors=t}get gridOptions(){var t;return null===(t=this.grid)||void 0===t?void 0:t.getOptions()}init(t,e){var i,s;if(this.grid=t,this.gridService=e.get("GridService"),this.gridStateService=e.get("GridStateService"),this.translaterService=e.get("TranslaterService"),!this.gridService||!this.gridStateService)throw new Error("[Slickgrid-Universal] it seems that the GridService and/or GridStateService are not being loaded properly, make sure the Container Service is properly implemented.");if(this.gridOptions.enableTranslate&&(!this.translaterService||!this.translaterService.translate))throw new Error('[Slickgrid-Universal] requires a Translate Service to be installed and configured when the grid option "enableTranslate" is enabled.');this._locales=null!==(s=null===(i=this.gridOptions)||void 0===i?void 0:i.locales)&&void 0!==s?s:o.t.locales}dispose(){this._eventHandler.unsubscribeAll(),this._bindEventService.unbindAll(),this._formValues=null,this.disposeComponent()}disposeComponent(){var t;"function"==typeof(null===(t=this._modalElm)||void 0===t?void 0:t.remove)&&(this._modalElm.remove(),document.body.classList.remove("slick-modal-open"))}changeFormInputValue(t,e,i=!1){var o,s,n,l,a,d;const r=null===(o=this._editors)||void 0===o?void 0:o[t];let c=e;if(!r&&!i)throw new Error(`Composite Editor with column id "${t}" not found.`);if(r&&r.setValue&&Array.isArray(this._editorContainers)){r.setValue(e,!0);const i=this._editorContainers.find(e=>e.dataset.editorid===t),o=null!==(l=null===(n=null===(s=this.gridOptions)||void 0===s?void 0:s.compositeEditorOptions)||void 0===n?void 0:n.excludeDisabledFieldFormValues)&&void 0!==l&&l;!r.disabled||r.disabled&&!o?null===(a=null==i?void 0:i.classList)||void 0===a||a.add("modified"):(c="",null===(d=null==i?void 0:i.classList)||void 0===d||d.remove("modified")),!r.disabled||""===c&&null===c&&void 0===c&&0===c||(c="")}this._formValues={...this._formValues,[t]:c}}changeFormEditorOption(t,e,i){var o;const s=null===(o=this._editors)||void 0===o?void 0:o[t];if(!(null==s?void 0:s.changeEditorOption))throw new Error(`Editor with column id "${t}" not found OR the Editor does not support "changeEditorOption" (current only available with AutoComplete, Date, MultipleSelect & SingleSelect Editors).`);s.changeEditorOption(e,i)}disableFormInput(t,e=!0){var i;const o=null===(i=this._editors)||void 0===i?void 0:i[t];(null==o?void 0:o.disable)&&Array.isArray(this._editorContainers)&&o.disable(e)}openDetails(t){var e,i,n,l,a,d,r,c,h,u,m,v,g,p,E,_,C;const b=null!==(e=t.onError)&&void 0!==e?e:s,f={backdrop:"static",showCloseButtonOutside:!0,shouldClearRowSelectionAfterMassAction:!0,viewColumnLayout:"auto",modalType:"edit"};try{if(!this.grid||this.grid.getEditorLock().isActive()&&!this.grid.getEditorLock().commitCurrentEdit())return null;this._options={...f,...this.gridOptions.compositeEditorOptions,...t,labels:{...null===(i=this.gridOptions.compositeEditorOptions)||void 0===i?void 0:i.labels,...null==t?void 0:t.labels}},this._options.backdrop=void 0!==t.backdrop?t.backdrop:"static";const e=this._options.viewColumnLayout||1,s=this.grid.getActiveCell(),v=null!==(n=null==s?void 0:s.cell)&&void 0!==n?n:0,g=null!==(l=null==s?void 0:s.row)&&void 0!==l?l:0,p=this.grid.getUID()||"";let E=t.headerTitle||"";if(this.hasRowSelectionEnabled()&&"auto-mass"===this._options.modalType&&this.grid.getSelectedRows){(this.grid.getSelectedRows()||[]).length>0?(this._options.modalType="mass-selection",(null==t?void 0:t.headerTitleMassSelection)&&(E=null==t?void 0:t.headerTitleMassSelection)):(this._options.modalType="mass-update",(null==t?void 0:t.headerTitleMassUpdate)&&(E=null==t?void 0:t.headerTitleMassUpdate))}const _=this._options.modalType||"edit";if(!this.gridOptions.editable)return b({type:"error",code:"EDITABLE_GRID_REQUIRED",message:"Your grid must be editable in order to use the Composite Editor Modal."}),null;if(!this.gridOptions.enableCellNavigation)return b({type:"error",code:"ENABLE_CELL_NAVIGATION_REQUIRED",message:'Composite Editor requires the flag "enableCellNavigation" to be set to True in your Grid Options.'}),null;if(!(this.gridOptions.enableAddRow||"clone"!==_&&"create"!==_))return b({type:"error",code:"ENABLE_ADD_ROW_REQUIRED",message:'Composite Editor requires the flag "enableAddRow" to be set to True in your Grid Options when cloning/creating a new item.'}),null;if(!(s||"clone"!==_&&"edit"!==_))return b({type:"warning",code:"NO_RECORD_FOUND",message:"No records selected for edit or clone operation."}),null;{const t="mass-update"===_||"mass-selection"===_,i=t?{}:this.grid.getDataItem(g);this._originalDataContext=Object(o.oc)(i);const s=this.grid.getColumns(),n=this.hasRowSelectionEnabled()?this.grid.getSelectedRows():[],l=null!==(d=null===(a=this.dataView)||void 0===a?void 0:a.getItems())&&void 0!==d?d:[],C=Array.isArray(l)?l.length:0;this._lastActiveRowNumber=g;const f=null===(r=this.gridStateService)||void 0===r?void 0:r.getCurrentRowSelections(),y=(null==f?void 0:f.dataContextIds)||[],w="create"===_?this.dataViewLength:g;if(!this.focusOnFirstColumnCellWithEditor(s,i,v,w,t))return null;if("edit"===_&&!i)return b({type:"warning",code:"ROW_NOT_EDITABLE",message:"Current row is not editable."}),null;if("mass-selection"===_&&n.length<1)return b({type:"warning",code:"ROW_SELECTION_REQUIRED",message:"You must select some rows before trying to apply new value(s)."}),null;let S=[];S=t?s.filter(t=>{var e;return t.editor&&!0===(null===(e=t.internalColumnEditor)||void 0===e?void 0:e.massUpdate)}):s.filter(t=>t.editor);const O=E.replace(/\{\{(.*?)\}\}/g,(t,e)=>Object(o.Lc)(i,e)),L=Object(o.Ad)(this.gridOptions,O),T="auto"===e?this.autoCalculateLayoutColumnCount(S.length):e;this._modalElm=document.createElement("div"),this._modalElm.className="slick-editor-modal "+p;const R=document.createElement("div");if(R.className="slick-editor-modal-content",e>1||"auto"===e&&T>1){const t=2===T?"split-view":"triple-split-view";R.classList.add(t)}const V=document.createElement("div");V.className="slick-editor-modal-title",V.innerHTML=L;const x=document.createElement("button");x.type="button",x.textContent="×",x.className="close",x.dataset.action="close",x.dataset.ariaLabel="Close",this._options.showCloseButtonOutside&&(null===(c=null==V?void 0:V.classList)||void 0===c||c.add("outside"),null===(h=null==x?void 0:x.classList)||void 0===h||h.add("outside"));const A=document.createElement("div");A.className="slick-editor-modal-header",A.appendChild(V),A.appendChild(x);const k=document.createElement("div");k.className="slick-editor-modal-body",this._modalBodyTopValidationElm=document.createElement("div"),this._modalBodyTopValidationElm.className="validation-summary",this._modalBodyTopValidationElm.style.display="none",k.appendChild(this._modalBodyTopValidationElm);const N=document.createElement("div");N.className="slick-editor-modal-footer";const I=document.createElement("button");I.type="button",I.className="btn btn-cancel btn-default btn-sm",I.dataset.action="cancel",I.dataset.ariaLabel=this.getLabelText("cancelButton","TEXT_CANCEL","Cancel"),I.textContent=this.getLabelText("cancelButton","TEXT_CANCEL","Cancel");let B="",D="";switch(_){case"clone":D=this.getLabelText("cloneButton","TEXT_CLONE","Clone");break;case"mass-update":const t=this.getLabelText("massUpdateStatus","TEXT_ALL_X_RECORDS_SELECTED","All {{x}} records selected");B=this.parseText(t,{x:C}),D=this.getLabelText("massUpdateButton","TEXT_APPLY_MASS_UPDATE","Mass Update");break;case"mass-selection":const e=this.getLabelText("massSelectionStatus","TEXT_X_OF_Y_MASS_SELECTED","{{x}} of {{y}} selected");B=this.parseText(e,{x:y.length,y:C}),D=this.getLabelText("massSelectionButton","TEXT_APPLY_TO_SELECTION","Update Selection");break;default:D=this.getLabelText("saveButton","TEXT_SAVE","Save")}const M=document.createElement("div");M.className="footer-status-text",M.textContent=B,this._modalSaveButtonElm=document.createElement("button"),this._modalSaveButtonElm.type="button",this._modalSaveButtonElm.className="btn btn-save btn-primary btn-sm",this._modalSaveButtonElm.dataset.action="create"===_||"edit"===_?"save":_,this._modalSaveButtonElm.dataset.ariaLabel=D,this._modalSaveButtonElm.textContent=D;const F=document.createElement("div");F.className="footer-buttons","mass-update"!==_&&"mass-selection"!==_||N.appendChild(M),F.appendChild(I),F.appendChild(this._modalSaveButtonElm),N.appendChild(F),R.appendChild(A),R.appendChild(k),R.appendChild(N),this._modalElm.appendChild(R);for(const t of S)if(t.editor){const e=document.createElement("div");e.className="item-details-container editor-"+t.id,1===T?e.classList.add("slick-col-medium-12"):e.classList.add("slick-col-medium-6","slick-col-xlarge-"+12/T);const i=document.createElement("div");i.className="item-details-label editor-"+t.id,i.textContent=this.getColumnLabel(t)||"n/a";const o=document.createElement("div");o.className="item-details-editor-container slick-cell",o.dataset.editorid=""+t.id;const s=document.createElement("div");if(s.className="item-details-validation editor-"+t.id,null===(u=this._options)||void 0===u?void 0:u.showResetButtonOnEachEditor){const e=this.createEditorResetButtonElement(""+t.id);this._bindEventService.bind(e,"click",this.handleResetInputValue.bind(this)),i.appendChild(e)}e.appendChild(i),e.appendChild(o),e.appendChild(s),k.appendChild(e)}if(null===(m=this._options)||void 0===m?void 0:m.showFormResetButton){const t=this.createFormResetButtonElement();this._bindEventService.bind(t,"click",this.handleResetFormClicked.bind(this)),k.appendChild(t)}document.body.appendChild(this._modalElm),document.body.classList.add("slick-modal-open"),this._bindEventService.bind(document.body,"click",this.handleBodyClicked.bind(this)),this._editors={},this._editorContainers=S.map(t=>k.querySelector(`[data-editorid=${t.id}]`))||[];const U={destroy:this.disposeComponent.bind(this),modalType:_,validationMsgPrefix:"* ",formValues:{},editors:this._editors},H=new Slick.CompositeEditor(S,this._editorContainers,U);this.grid.editActiveCell(H),this._bindEventService.bind(x,"click",this.cancelEditing.bind(this)),this._bindEventService.bind(I,"click",this.cancelEditing.bind(this)),this._bindEventService.bind(this._modalSaveButtonElm,"click",this.handleSaveClicked.bind(this)),this._bindEventService.bind(this._modalElm,"keydown",this.handleKeyDown.bind(this)),this._bindEventService.bind(this._modalElm,"focusout",this.validateCurrentEditor.bind(this)),this._bindEventService.bind(this._modalElm,"blur",this.validateCurrentEditor.bind(this));const P=this.grid.onCompositeEditorChange;this._eventHandler.subscribe(P,this.handleOnCompositeEditorChange.bind(this));const G=this.grid.onAddNewRow;this._eventHandler.subscribe(G,(t,e)=>{this.insertNewItemInDataView(e.item),this._originalDataContext=e.item,this.dispose()})}return this}catch(t){this.dispose();const e="string"==typeof t?t:null!==(p=null!==(v=null==t?void 0:t.message)&&void 0!==v?v:null===(g=null==t?void 0:t.body)||void 0===g?void 0:g.message)&&void 0!==p?p:"";return b({type:"error",code:"string"==typeof t?t:null!==(C=null!==(E=null==t?void 0:t.status)&&void 0!==E?E:null===(_=null==t?void 0:t.body)||void 0===_?void 0:_.status)&&void 0!==C?C:e,message:e}),null}}async cancelEditing(){var t,e;let i=!0;this.formValues&&Object.keys(this.formValues).length>0&&"function"==typeof this._options.onClose&&(i=await this._options.onClose()),i&&(this.grid.getEditController().cancelCurrentEdit(),"edit"!==(null===(t=this._options)||void 0===t?void 0:t.modalType)&&"clone"!==(null===(e=this._options)||void 0===e?void 0:e.modalType)||this.resetCurrentRowDataContext(),this.grid.setActiveRow(this._lastActiveRowNumber),this.dispose())}showValidationSummaryText(t,e=""){var i,o;t?(this._modalBodyTopValidationElm.textContent=e,this._modalBodyTopValidationElm.style.display="block",null===(o=(i=this._modalBodyTopValidationElm).scrollIntoView)||void 0===o||o.call(i),this._modalSaveButtonElm.disabled=!1,this._modalSaveButtonElm.classList.remove("saving")):(this._modalBodyTopValidationElm.style.display="none",this._modalBodyTopValidationElm.textContent=e)}applySaveMassUpdateChanges(t){const e=this.dataView.getItems();for(const i in t)i in t&&e.forEach(e=>{i in t&&(e[i]=t[i])});this.dataView.setItems(e,this.gridOptions.datasetIdPropertyName),this.grid.invalidate()}applySaveMassSelectionChanges(t,e){var i,o;const s=(null!==(i=null==e?void 0:e.dataContextIds)&&void 0!==i?i:[]).map(t=>this.dataView.getItemById(t));for(const e in t)e in t&&s.forEach(i=>{e in t&&(i[e]=t[e])});null===(o=this.gridService)||void 0===o||o.updateItems(s)}autoCalculateLayoutColumnCount(t){return t>=15?3:t>=8?2:1}createEditorResetButtonElement(t){var e,i,o,s,n;const l=document.createElement("button");if(l.type="button",l.name=t,l.title=null!==(o=null===(i=null===(e=this._options)||void 0===e?void 0:e.labels)||void 0===i?void 0:i.resetFormButton)&&void 0!==o?o:"Reset Form Input",l.className="btn btn-xs btn-editor-reset",null===(s=this._options)||void 0===s?void 0:s.resetEditorButtonCssClass){const t=null===(n=this._options)||void 0===n?void 0:n.resetEditorButtonCssClass.split(" ");for(const e of t)l.classList.add(e)}return l}createFormResetButtonElement(){var t,e;const i=document.createElement("div");i.className="reset-container";const o=document.createElement("button");o.type="button",o.textContent=" Reset Form",o.className="btn btn-sm reset-form";const s=document.createElement("span");return s.className=null!==(e=null===(t=this._options)||void 0===t?void 0:t.resetFormButtonIconCssClass)&&void 0!==e?e:"",o.prepend(s),i.appendChild(o),i}executeOnError(t){var e,i;(null!==(i=null===(e=this._options)||void 0===e?void 0:e.onError)&&void 0!==i?i:s)(t)}async executeOnSave(t,e,i,o){var s,n,l,a,d;try{this.showValidationSummaryText(!1,"");if(this.validateCompositeEditors().valid){if(this._modalSaveButtonElm.classList.add("saving"),this._modalSaveButtonElm.disabled=!0,"function"==typeof(null===(s=this._options)||void 0===s?void 0:s.onSave)){await(null===(n=this._options)||void 0===n?void 0:n.onSave(this.formValues,this.getCurrentRowSelections(),o))&&(t(this.formValues,this.getCurrentRowSelections()),e())}else t(this.formValues,this.getCurrentRowSelections()),e();"function"==typeof i&&i(),this.dispose()}}catch(t){const e="string"==typeof t?t:null!==(d=null!==(l=null==t?void 0:t.message)&&void 0!==l?l:null===(a=null==t?void 0:t.body)||void 0===a?void 0:a.message)&&void 0!==d?d:"";this.showValidationSummaryText(!0,e)}}focusOnFirstColumnCellWithEditor(t,e,i,o,s){const n=s&&!this.gridOptions.enableAddRow&&o>=this.dataViewLength?this.dataViewLength-1:o;let l=i;const a=t[i].editor;let d=this.grid.getCellNode(n,i);if(!a||!d||!this.getActiveCellEditor(n,i)){if(l=this.findNextAvailableEditorColumnIndex(t,e,o,s),-1===l)return this.executeOnError({type:"error",code:"NO_EDITOR_FOUND",message:"We could not find any Editor in your Column Definition"}),!1;this.grid.setActiveCell(n,l,!1),s&&this.grid.setActiveRow(this.dataViewLength,l,!0)}return d=this.grid.getCellNode(n,l),!!d}findNextAvailableEditorColumnIndex(t,e,i,o){var s;let n=-1;for(let l=0;l<t.length;l++){const a=t[l];if(a.editor&&(!o||o&&(null===(s=a.internalColumnEditor)||void 0===s?void 0:s.massUpdate))){const t=this.grid.onBeforeEditCell.notify({row:i,cell:l,item:e,column:a,grid:this.grid});if(this.grid.setActiveCell(i,l,!1),!1!==t){n=l;break}}}return n}getActiveCellEditor(t,e){return this.grid.setActiveCell(t,e,!1),this.grid.getCellEditor()}getColumnLabel(t){var e;const i=this.gridOptions.columnGroupSeparator||" - ";let o=t.nameCompositeEditor||t.name||"",s=t.columnGroup||"";if(this.gridOptions.enableTranslate&&this.translaterService){const i=t.nameCompositeEditorKey||t.nameKey;i&&(o=this.translaterService.translate(i)),t.columnGroupKey&&(null===(e=this.translaterService)||void 0===e?void 0:e.translate)&&(s=this.translaterService.translate(t.columnGroupKey))}return(s?`${s}${i}${o}`:o)||""}getLabelText(t,e,i){var o,s,n,l,a,d,r;const c={...null===(o=this.gridOptions.compositeEditorOptions)||void 0===o?void 0:o.labels,...null===(s=this._options)||void 0===s?void 0:s.labels};if((null===(n=this.gridOptions)||void 0===n?void 0:n.enableTranslate)&&(null===(l=this.translaterService)||void 0===l?void 0:l.translate)&&c.hasOwnProperty(t+"Key")){const e=c[t+"Key"];return this.translaterService.translate(e||"")}return null!==(r=null!==(a=null==c?void 0:c[t])&&void 0!==a?a:null===(d=this._locales)||void 0===d?void 0:d[e])&&void 0!==r?r:i}getCurrentRowSelections(){var t;const e=null===(t=this.gridStateService)||void 0===t?void 0:t.getCurrentRowSelections();return{gridRowIndexes:(null==e?void 0:e.gridRowIndexes)||[],dataContextIds:(null==e?void 0:e.dataContextIds)||[]}}handleBodyClicked(t){var e,i,o;(null===(i=null===(e=t.target)||void 0===e?void 0:e.classList)||void 0===i?void 0:i.contains("slick-editor-modal"))&&"static"!==(null===(o=this._options)||void 0===o?void 0:o.backdrop)&&this.dispose()}handleKeyDown(t){"Escape"===t.code?(this.cancelEditing(),t.stopPropagation(),t.preventDefault()):"Tab"===t.code&&this.validateCurrentEditor()}handleResetInputValue(t){var e,i;const o=t.target.name,s=null===(e=this._editors)||void 0===e?void 0:e[o];(null==s?void 0:s.reset)&&s.reset(),null===(i=this._formValues)||void 0===i||delete i[o]}async handleMassSaving(t,e){if(this.formValues&&0!==Object.keys(this.formValues).length){const i="mass-update"===t?"applySaveMassUpdateChanges":"applySaveMassSelectionChanges";this.executeOnSave(this[i].bind(this),e.bind(this))}else this.executeOnError({type:"warning",code:"NO_CHANGES_DETECTED",message:"Sorry we could not detect any changes."})}handleOnCompositeEditorChange(t,e){var i,o,s,n,l,a,d;const r=null!==(o=null===(i=e.column)||void 0===i?void 0:i.id)&&void 0!==o?o:"";this._formValues={...this._formValues,...e.formValues};const c=null===(s=this._editors)||void 0===s?void 0:s[r],h=null!==(d=null!==(l=null===(n=null==c?void 0:c.isValueTouched)||void 0===n?void 0:n.call(c))&&void 0!==l?l:null===(a=null==c?void 0:c.isValueChanged)||void 0===a?void 0:a.call(c))&&void 0!==d&&d,u=document.querySelector(`[data-editorid=${r}]`);(null==u?void 0:u.classList)&&(h?u.classList.add("modified"):u.classList.remove("modified")),this.validateCompositeEditors()}hasRowSelectionEnabled(){const t=this.grid.getSelectionModel();return(this.gridOptions.enableRowSelection||this.gridOptions.enableCheckboxSelector)&&t}handleResetFormClicked(){for(const t of Object.keys(this._editors)){const e=this._editors[t];(null==e?void 0:e.reset)&&e.reset()}this._formValues=Object(o.wc)(this._formValues)}handleSaveClicked(){var t,e,i;const o=null===(t=this._options)||void 0===t?void 0:t.modalType;switch(o){case"mass-update":this.handleMassSaving(o,()=>{this.grid.getEditController().cancelCurrentEdit(),this.grid.setActiveCell(0,0,!1),this._options.shouldClearRowSelectionAfterMassAction&&this.grid.setSelectedRows([])});break;case"mass-selection":this.handleMassSaving(o,()=>{this.grid.getEditController().cancelCurrentEdit(),this.grid.setActiveRow(this._lastActiveRowNumber),this._options.shouldClearRowSelectionAfterMassAction&&this.grid.setSelectedRows([])});break;case"clone":const t={...this._originalDataContext,...this.formValues},s=()=>{this.grid.getEditController().cancelCurrentEdit(),this.grid.setActiveCell(0,0,!1)};this.executeOnSave(this.insertNewItemInDataView.bind(this,t),s,this.resetCurrentRowDataContext.bind(this),t);break;case"create":case"edit":default:if(this.grid.getEditController().commitCurrentEdit(),"function"==typeof(null===(e=this._options)||void 0===e?void 0:e.onSave)){const t=this.grid.getDataItem(this._lastActiveRowNumber);null===(i=this._options)||void 0===i||i.onSave(this.formValues,this.getCurrentRowSelections(),t)}}}insertNewItemInDataView(t){var e,i,o,s;const n=null!==(i=null===(e=this.dataView)||void 0===e?void 0:e.getItems())&&void 0!==i?i:[],l=Array.isArray(n)?n.length:0,a=null!==(o=this._options.insertNewId)&&void 0!==o?o:l+1;t[this.gridOptions.datasetIdPropertyName||"id"]=a,this.dataView.getItemById(a)?this.executeOnError({type:"error",code:"ITEM_ALREADY_EXIST",message:"The item object which you are trying to add already exist with the same Id:: "+a}):null===(s=this.gridService)||void 0===s||s.addItem(t,this._options.insertOptions)}parseText(t,e){return t.replace(/\{\{(.*?)\}\}/g,(t,i)=>void 0!==e[i]?e[i]:t)}resetCurrentRowDataContext(){const t=this.gridOptions.datasetIdPropertyName||"id";this.grid.getData().updateItem(this._originalDataContext[t],this._originalDataContext)}validateCompositeEditors(t){let e={valid:!0,msg:""};const i=this.grid.getCellEditor();return i&&(e=i.validate(t)),e}validateCurrentEditor(){const t=this.grid.getCellEditor();(null==t?void 0:t.validate)&&t.validate()}}}}]);
//# sourceMappingURL=vendors~c8763b32.27922bdfeed891db4508.bundle.map