import{C as L,r as $,n as D,b as y,a as m,F as f,S as z,d as E,y as M,c as U}from"./index-BEnHDSQL.js";import{I as A}from"./index.dev-DVxY69-b.js";import{E as V}from"./excelExport.service-hWlujhtm.js";import{E as C}from"./editors.index-mXwEHkpi.js";import{C as j}from"./countries-DVECuSGk.js";import"./groupingFormatters.index-pL073kVK.js";const R="example32",x=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example32.ts">
      <span class="mdi mdi-link-variant"></span> code
    </a>
  </span>
  <button
      class="ms-2 btn btn-outline-secondary btn-sm btn-icon"
      type="button"
      data-test="toggle-subtitle"
      click.trigger="toggleSubTitle()"
    >
      <span class="mdi mdi-information-outline" title="Toggle example sub-title details"></span>
    </button>
</h2>

<div class="subtitle" innerhtml.bind="subTitle"></div>

<h4 class="ml-3">Container Width (950px)</h4>

<div class="row">
  <div class="ml-2 mb-2 mr-2">
    <div class="btn-group btn-group-toggle" data-bs-toggle="buttons">
      <label class="btn btn-sm btn-outline-secondary btn-icon" class.bind="isUsingDefaultResize ? 'active' : ''"
              data-test="autosize-columns-btn">
        <input type="radio" class="btn-check" name="options"
                checked.bind="isUsingDefaultResize"
                click.trigger="handleDefaultResizeColumns()">
        <i class="mdi mdi-arrow-expand"></i> (default resize) by "autosizeColumns"
      </label>
      <label class="btn btn-sm btn-outline-secondary btn-icon" class.bind="isUsingDefaultResize ? '' : 'active'"
              data-test="resize-by-content-btn">
        <input type="radio" class="btn-check" name="options"
                checked.bind="!isUsingDefaultResize"
                click.trigger="handleNewResizeColumns()">
        <i class="mdi mdi-arrow-expand"></i> Resize by Cell Content
      </label>
    </div>
  </div>

  <div class="mb-2">
    <div class="btn-group btn-group-sm" role="group" aria-label="Basic Editing Commands">
      <button type="button" class="btn btn-outline-secondary btn-icon" click.trigger="setSelectedRowIds()"
              data-test="set-dynamic-rows-btn"
              title="Change Row Selection across multiple pages">
        <span>Change Row Selection</span>
      </button>
      <button type="button" class="btn btn-outline-secondary btn-icon" data-test="toggle-readonly-btn"
              click.trigger="toggleGridEditReadonly()">
        <i class="mdi mdi-table-edit"></i> Toggle Readonly
      </button>
      <button type="button" class="btn btn-outline-secondary btn-icon" data-test="undo-last-edit-btn"
              click.trigger="undoLastEdit()">
        <i class="mdi mdi-undo"></i> Undo Last Edit
      </button>
      <button type="button" class="btn btn-outline-secondary btn-icon" data-test="save-all-btn"
              click.trigger="saveAll()">
          <span>Save All</span>
      </button>
    </div>
  </div>
</div>

<div id="smaller-container" style="width: 950px">
  <aurelia-slickgrid grid-id="grid32"
                      column-definitions.bind="columnDefinitions"
                      grid-options.bind="gridOptions"
                      dataset.bind="dataset"
                      on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
                      on-selected-row-ids-changed.trigger="handleOnSelectedRowIdsChanged($event.detail.args)">
  </aurelia-slickgrid>
</div>
`,G=[],N={};let w;function H(o){w||(w=L.define({name:R,template:x,dependencies:G,bindables:N})),o.register(w)}const B=Object.freeze(Object.defineProperty({__proto__:null,bindables:N,default:x,dependencies:G,name:R,register:H,template:x},Symbol.toStringTag,{value:"Module"}));var Q=Object.create,T=Object.defineProperty,q=Object.getOwnPropertyDescriptor,K=(o,e)=>(e=Symbol[o])?e:Symbol.for("Symbol."+o),F=o=>{throw TypeError(o)},P=(o,e,t)=>e in o?T(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,Y=(o,e)=>T(o,"name",{value:e,configurable:!0}),J=o=>[,,,Q(null)],X=["class","method","getter","setter","accessor","field","value","get","set"],O=o=>o!==void 0&&typeof o!="function"?F("Function expected"):o,Z=(o,e,t,i,a)=>({kind:X[o],name:e,metadata:i,addInitializer:l=>t._?F("Already initialized"):a.push(O(l||null))}),ee=(o,e)=>P(e,K("metadata"),o[3]),te=(o,e,t,i)=>{for(var a=0,l=o[e>>1],r=l&&l.length;a<r;a++)l[a].call(t);return i},ie=(o,e,t,i,a,l)=>{var r,u,b,s=e&7,g=!1,n=0,p=o[n]||(o[n]=[]),d=s&&(a=a.prototype,s<5&&(s>3||!g)&&q(a,t));Y(a,t);for(var h=i.length-1;h>=0;h--)b=Z(s,t,u={},o[3],p),r=(0,i[h])(a,b),u._=1,O(r)&&(a=r);return ee(o,a),d&&T(a,t,d),g?s^4?l:d:a},c=(o,e,t)=>P(o,typeof e!="symbol"?e+"":e,t),W,k;const ae=400,oe=(o,e,t,i,a,l)=>{const u=l.getOptions().editable&&i.editor;return t=t??"",u?{text:t,addClasses:"editable-field",toolTip:"Click to Edit"}:t},le=o=>o==null||!o.length?{valid:!1,msg:"This is a required field."}:/^(task\s\d+)*$/i.test(o)?{valid:!0,msg:""}:{valid:!1,msg:'Your title is invalid, it must start with "Task" followed by a number.'};W=[U(B)];class S{constructor(e=$(D(A))){this.http=e,c(this,"title","Example 32: Columns Resize by Content"),c(this,"subTitle",'The grid below uses the optional resize by cell content (with a fixed 950px for demo purposes), you can click on the 2 buttons to see the difference. The "autosizeColumns" is really the default option used by SlickGrid-Universal, the resize by cell content is optional because it requires to read the first thousand rows and do extra width calculation.'),c(this,"aureliaGrid"),c(this,"gridOptions"),c(this,"columnDefinitions",[]),c(this,"dataset",[]),c(this,"editQueue",[]),c(this,"editedItems",{}),c(this,"hideSubTitle",!1),c(this,"isUsingDefaultResize",!1),c(this,"isGridEditable",!0),c(this,"isMassSelectionDisabled",!0),c(this,"complexityLevelList",[{value:0,label:"Very Simple"},{value:1,label:"Simple"},{value:2,label:"Straightforward"},{value:3,label:"Complex"},{value:4,label:"Very Complex"}]),this.initializeGrid()}attached(){this.dataset=this.loadData(ae)}aureliaGridReady(e){this.aureliaGrid=e}initializeGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",sortable:!0,type:m.string,minWidth:65,resizeExtraWidthPadding:4,resizeCharWidthInPx:7.6,resizeCalcWidthRatio:1,resizeMaxWidthThreshold:200,columnGroup:"Common Factor",cssClass:"text-uppercase fw-bold",filterable:!0,filter:{model:y.inputText,filterPredicate:(e,t)=>{const i=t.parsedSearchTerms||[];if(i!=null&&i.length){const a=t.columnId,l=i[0],r=e[a].toLowerCase(),u=l.matchAll(/^%([^%\r\n]+)[^%\r\n]*$|(.*)%(.+)%(.*)|(.+)%(.+)|([^%\r\n]+)%$/gi),b=Array.from(u),s=b.length?b[0]:[],[g,n,p,d,h,v,I,_]=s;return n?r.endsWith(n.toLowerCase()):p&&d?r.startsWith(p.toLowerCase())&&r.includes(d.toLowerCase()):d&&h?r.includes(d)&&r.endsWith(h.toLowerCase()):d&&!h?r.includes(d.toLowerCase()):v&&I?r.startsWith(v.toLowerCase())&&r.endsWith(I.toLowerCase()):_?r.startsWith(_.toLowerCase()):r.includes(l.toLowerCase())}return!0}},editor:{model:C.longText,required:!0,alwaysSaveOnEnterKey:!0,maxLength:12,editorOptions:{cols:45,rows:6,buttonTexts:{cancel:"Close",save:"Done"}},validator:le}},{id:"duration",name:"Duration",field:"duration",sortable:!0,filterable:!0,minWidth:65,type:m.number,columnGroup:"Common Factor",formatter:(e,t,i)=>i==null||i===""?"":i>1?`${i} days`:`${i} day`,editor:{model:C.float,decimal:2,valueStep:1,minValue:0,maxValue:1e4,alwaysSaveOnEnterKey:!0,required:!0}},{id:"cost",name:"Cost",field:"cost",minWidth:65,sortable:!0,filterable:!0,type:m.number,columnGroup:"Analysis",filter:{model:y.compoundInputNumber},formatter:f.dollar},{id:"percentComplete",name:"% Complete",field:"percentComplete",minWidth:100,type:m.number,sortable:!0,filterable:!0,columnGroup:"Analysis",filter:{model:y.compoundSlider,operator:">="},editor:{model:C.slider,minValue:0,maxValue:100}},{id:"complexity",name:"Complexity",field:"complexity",resizeCalcWidthRatio:.9,sortable:!0,filterable:!0,columnGroup:"Analysis",formatter:(e,t,i)=>{var a;return(a=this.complexityLevelList[i])==null?void 0:a.label},exportCustomFormatter:(e,t,i)=>{var a;return(a=this.complexityLevelList[i])==null?void 0:a.label},filter:{model:y.multipleSelect,collection:this.complexityLevelList},editor:{model:C.singleSelect,collection:this.complexityLevelList}},{id:"start",name:"Start",field:"start",sortable:!0,formatter:f.dateUs,columnGroup:"Period",exportCustomFormatter:f.dateUs,type:m.date,outputType:m.dateUs,saveOutputType:m.dateUtc,filterable:!0,filter:{model:y.compoundDate},editor:{model:C.date,params:{hideClearButton:!1}}},{id:"completed",name:"Completed",field:"completed",width:80,minWidth:75,maxWidth:100,cssClass:"text-center",columnGroup:"Period",formatter:f.checkmarkMaterial,exportWithFormatter:!1,filterable:!0,sortable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:y.singleSelect},editor:{model:C.checkbox}},{id:"finish",name:"Finish",field:"finish",sortable:!0,formatter:f.dateUs,columnGroup:"Period",type:m.date,outputType:m.dateUs,saveOutputType:m.dateUtc,filterable:!0,filter:{model:y.compoundDate},exportCustomFormatter:f.dateUs,editor:{model:C.date,editorOptions:{range:{min:"today"}},validator:(e,t)=>{const i=t&&t.item;return i&&i.completed&&!e?{valid:!1,msg:'You must provide a "Finish" date when "Completed" is checked.'}:{valid:!0,msg:""}}}},{id:"product",name:"Product",field:"product",filterable:!0,columnGroup:"Item",minWidth:100,resizeCharWidthInPx:8,exportWithFormatter:!0,dataKey:"id",labelKey:"itemName",formatter:f.complexObject,exportCustomFormatter:f.complex,type:m.object,sortComparer:z.objectString,editor:{model:C.autocompleter,alwaysSaveOnEnterKey:!0,massUpdate:!0,editorOptions:{minLength:1,fetch:(e,t)=>{const i=this.mockProducts();t(i.filter(a=>a.itemName.toLowerCase().includes(e.toLowerCase())))},renderItem:{layout:"fourCorners",templateCallback:e=>this.renderItemCallbackWith4Corners(e)}}},filter:{model:y.inputText,type:m.string,queryField:"product.itemName"}},{id:"origin",name:"Country of Origin",field:"origin",formatter:f.complexObject,columnGroup:"Item",exportCustomFormatter:f.complex,dataKey:"code",labelKey:"name",type:m.object,sortComparer:z.objectString,filterable:!0,sortable:!0,minWidth:100,editor:{model:C.autocompleter,massUpdate:!0,customStructure:{label:"name",value:"code"},collectionAsync:this.http.fetch(j)},filter:{model:y.inputText,type:"string",queryField:"origin.name"}},{id:"action",name:"Action",field:"action",width:70,minWidth:70,maxWidth:70,excludeFromExport:!0,formatter:()=>'<div class="button-style margin-auto" style="width: 35px;"><span class="mdi mdi-chevron-down text-primary"></span></div>',cellMenu:{hideCloseButton:!1,commandTitle:"Commands",commandItems:[{command:"help",title:"Help!",iconCssClass:"mdi mdi-help-circle",positionOrder:66,action:()=>alert("Please Help!")},"divider",{command:"delete-row",title:"Delete Row",positionOrder:64,iconCssClass:"mdi mdi-close color-danger",cssClass:"red",textCssClass:"text-italic color-danger-light",itemVisibilityOverride:e=>{var t;return!((t=e.dataContext)!=null&&t.completed)},action:(e,t)=>{const i=t.dataContext,a=(t==null?void 0:t.row)??0;confirm(`Do you really want to delete row (${a+1}) with "${i.title}"`)&&this.aureliaGrid.gridService.deleteItemById(i.id)}}]}}],this.gridOptions={editable:!0,autoAddCustomEditorFormatter:oe,enableCellNavigation:!0,autoEdit:!0,autoCommitEdit:!0,autoResize:{container:"#smaller-container",rightPadding:10},gridWidth:"100%",enableAutoResize:!0,enablePagination:!0,pagination:{pageSize:10,pageSizes:[10,200,500,5e3]},autoFitColumnsOnFirstLoad:!1,enableAutoSizeColumns:!1,autosizeColumnsByCellContentOnFirstLoad:!0,enableAutoResizeColumnsByCellContent:!0,resizeByContentOptions:{defaultRatioForStringType:.92,formatterPaddingWidthInPx:8},enableExcelExport:!0,excelExportOptions:{exportWithFormatter:!1},externalResources:[new V],enableFiltering:!0,enableRowSelection:!0,enableCheckboxSelector:!0,checkboxSelector:{hideInFilterHeaderRow:!1,hideInColumnTitleRow:!0},rowSelectionOptions:{selectActiveRow:!1},createPreHeaderPanel:!0,showPreHeaderPanel:!0,preHeaderPanelHeight:28,rowHeight:33,headerRowHeight:35,editCommandHandler:(e,t,i)=>{const a=Array.isArray(i.prevSerializedValue)?i.prevSerializedValue:[i.prevSerializedValue],l=Array.isArray(i.serializedValue)?i.serializedValue:[i.serializedValue],r=this.columnDefinitions.filter(b=>b.editor!==void 0),u=[];a.forEach((b,s)=>{const g=a[s],n=l[s];if(g!==n){const p=Array.isArray(i.prevSerializedValue)?r[s]:t;this.editedItems[this.gridOptions.datasetIdPropertyName||"id"]=e,this.aureliaGrid.slickGrid.invalidate(),i.execute(),this.renderUnsavedCellStyling(e,p,i),u.push(p)}}),this.editQueue.push({item:e,columns:u,editCommand:i})},enableCellMenu:!0}}loadData(e){var i,a;const t=[];for(let l=0;l<e;l++){const r=Math.floor(Math.random()*this.mockProducts().length),u=2e3+Math.floor(Math.random()*10),b=new Date().getFullYear()+Math.floor(Math.random()*10),s=Math.floor(Math.random()*11),g=Math.floor(Math.random()*29),n=Math.floor(Math.random()*59),p=new Date(b,s+1,g,n,n,n),d=Math.floor(Math.random()*100)+15,h=d>100?l>5?100:88:d,v=h===100;t[l]={id:l,title:"Task "+l,duration:Math.floor(Math.random()*100)+10,percentComplete:h,analysis:{percentComplete:h},complexity:l%3?0:2,start:new Date(u,s,g,g,n,n,n),finish:v||l%3===0&&p>new Date&&l>3?v?new Date:p:"",cost:l%33===0?null:Math.round(Math.random()*1e4)/100,completed:v||l%3===0&&p>new Date&&l>3,product:{id:(i=this.mockProducts()[r])==null?void 0:i.id,itemName:(a=this.mockProducts()[r])==null?void 0:a.itemName},origin:l%2?{code:"CA",name:"Canada"}:{code:"US",name:"United States"}},l%8||(delete t[l].finish,delete t[l].percentComplete)}return t}handleDefaultResizeColumns(){const e=this.aureliaGrid.slickGrid.getColumns();e.forEach(t=>t.width=t.originalWidth),this.aureliaGrid.slickGrid.setColumns(e),this.aureliaGrid.slickGrid.autosizeColumns(),this.isUsingDefaultResize=!0}handleNewResizeColumns(){this.aureliaGrid.resizerService.resizeColumnsByCellContent(!0),this.isUsingDefaultResize=!1}handleOnSelectedRowIdsChanged(e){console.log("Selected Ids:",e.selectedRowIds)}toggleGridEditReadonly(){this.undoAllEdits(),this.isGridEditable=!this.isGridEditable,this.isGridEditable||(this.isMassSelectionDisabled=!0),this.aureliaGrid.slickGrid.setOptions({editable:this.isGridEditable})}removeUnsavedStylingFromCell(e,t,i){this.aureliaGrid.slickGrid.removeCellCssStyles(`unsaved_highlight_${[t.id]}${i}`)}removeAllUnsavedStylingFromCell(){for(const e of this.editQueue){const t=e==null?void 0:e.editCommand;if(t)for(const i of e.columns)this.removeUnsavedStylingFromCell(e.item,i,t.row)}}renderUnsavedStylingOnAllVisibleCells(){for(const e of this.editQueue)if(e){const{item:t,columns:i,editCommand:a}=e;Array.isArray(i)&&i.forEach(l=>{this.renderUnsavedCellStyling(t,l,a)})}}renderUnsavedCellStyling(e,t,i){if(i&&e&&t){const a=this.aureliaGrid.dataView.getRowByItem(e);if(a>=0){const l={[a]:{[t.id]:"unsaved-editable-field"}};this.aureliaGrid.slickGrid.setCellCssStyles(`unsaved_highlight_${[t.id]}${a}`,l)}}}setSelectedRowIds(){var e;(e=this.aureliaGrid.dataView)==null||e.setSelectedIds([3,4,11])}saveAll(){console.log(this.editQueue),console.log(this.editedItems),this.removeAllUnsavedStylingFromCell(),this.editQueue=[],this.editedItems={}}undoLastEdit(e=!1){var a;const t=this.editQueue.pop(),i=t==null?void 0:t.editCommand;if(t&&i&&E.cancelCurrentEdit()){i.undo();for(const l of t.columns)this.removeUnsavedStylingFromCell(t.item,l,i.row);this.aureliaGrid.slickGrid.invalidate(),e&&((a=this.aureliaGrid)==null||a.slickGrid.gotoCell(i.row,i.cell,!1))}}undoAllEdits(){for(const e of this.editQueue){const t=e==null?void 0:e.editCommand;if(t&&E.cancelCurrentEdit()){t.undo();for(const i of e.columns)this.removeUnsavedStylingFromCell(e.item,i,t.row)}}this.aureliaGrid.slickGrid.invalidate(),this.editQueue=[]}mockProducts(){return[{id:0,itemName:"Sleek Metal Computer",itemNameTranslated:"some fantastic sleek metal computer description",listPrice:2100.23,itemTypeName:"I",image:"http://i.stack.imgur.com/pC1Tv.jpg",icon:`mdi ${this.getRandomIcon(0)}`},{id:1,itemName:"Tasty Granite Table",itemNameTranslated:"an extremely huge and heavy table",listPrice:3200.12,itemTypeName:"I",image:"https://i.imgur.com/Fnm7j6h.jpg",icon:`mdi ${this.getRandomIcon(1)}`},{id:2,itemName:"Awesome Wooden Mouse",itemNameTranslated:"super old mouse",listPrice:15,itemTypeName:"I",image:"https://i.imgur.com/RaVJuLr.jpg",icon:`mdi ${this.getRandomIcon(2)}`},{id:3,itemName:"Gorgeous Fresh Shirt",itemNameTranslated:"what a gorgeous shirt seriously",listPrice:25.76,itemTypeName:"I",image:"http://i.stack.imgur.com/pC1Tv.jpg",icon:`mdi ${this.getRandomIcon(3)}`},{id:4,itemName:"Refined Cotton Table",itemNameTranslated:"super light table that will fall apart amazingly fast",listPrice:13.35,itemTypeName:"I",image:"https://i.imgur.com/Fnm7j6h.jpg",icon:`mdi ${this.getRandomIcon(4)}`},{id:5,itemName:"Intelligent Wooden Pizza",itemNameTranslated:"wood not included",listPrice:23.33,itemTypeName:"I",image:"https://i.imgur.com/RaVJuLr.jpg",icon:`mdi ${this.getRandomIcon(5)}`},{id:6,itemName:"Licensed Cotton Chips",itemNameTranslated:"not sure what that is",listPrice:71.21,itemTypeName:"I",image:"http://i.stack.imgur.com/pC1Tv.jpg",icon:`mdi ${this.getRandomIcon(6)}`},{id:7,itemName:"Ergonomic Rubber Soap",itemNameTranslated:"so good you'll want to use it every night",listPrice:2.43,itemTypeName:"I",image:"https://i.imgur.com/Fnm7j6h.jpg",icon:`mdi ${this.getRandomIcon(7)}`},{id:8,itemName:"Handcrafted Steel Car",itemNameTranslated:"aka tesla truck",listPrice:31288.39,itemTypeName:"I",image:"https://i.imgur.com/RaVJuLr.jpg",icon:`mdi ${this.getRandomIcon(8)}`}]}getRandomIcon(e){const t=["mdi-arrow-collapse","mdi-arrow-expand","mdi-cancel","mdi-check","mdi-checkbox-blank-outline","mdi-check-box-outline","mdi-checkbox-marked","mdi-close","mdi-close-circle","mdi-close-circle-outline","mdi-close-thick","mdi-content-copy","mdi-database-refresh","mdi-download","mdi-file-document-outline","mdi-file-excel-outline","mdi-file-music-outline","mdi-file-pdf-outline","mdi-filter-remove-outline","mdi-flip-vertical","mdi-folder","mdi-folder-open","mdi-help-circle","mdi-help-circle-outline","mdi-history","mdi-information","mdi-information-outline","mdi-link","mdi-link-variant","mdi-menu","mdi-microsoft-excel","mdi-minus","mdi-page-first","mdi-page-last","mdi-paperclip","mdi-pin-off-outline","mdi-pin-outline","mdi-playlist-plus","mdi-playlist-remove","mdi-plus","mdi-redo","mdi-refresh","mdi-shape-square-plus","mdi-sort-ascending","mdi-sort-descending","mdi-swap-horizontal","mdi-swap-vertical","mdi-sync","mdi-table-edit","mdi-table-refresh","mdi-undo"],i=Math.floor(Math.random()*t.length-1);return t[e??i]}renderItemCallbackWith2Rows(e){return`<div class="autocomplete-container-list">
      <div class="autocomplete-left">
        <!--<img src="http://i.stack.imgur.com/pC1Tv.jpg" width="50" />-->
        <span class="mdi ${e.icon}"></span>
      </div>
      <div>
        <span class="autocomplete-top-left">
          <span class="mdi ${e.itemTypeName==="I"?"mdi-information-outline":"mdi-content-copy"}"></span>
          ${e.itemName}
        </span>
      <div>
    </div>
    <div>
      <div class="autocomplete-bottom-left">${e.itemNameTranslated}</div>
    </div>`}renderItemCallbackWith4Corners(e){return`<div class="autocomplete-container-list">
          <div class="autocomplete-left">
            <!--<img src="http://i.stack.imgur.com/pC1Tv.jpg" width="50" />-->
            <span class="mdi ${e.icon}"></span>
          </div>
          <div>
            <span class="autocomplete-top-left">
              <span class="mdi ${e.itemTypeName==="I"?"mdi-information-outline":"mdi-content-copy"}"></span>
              ${e.itemName}
            </span>
            <span class="autocomplete-top-right">${M(e.listPrice,2,2,!1,"$")}</span>
          <div>
        </div>
        <div>
          <div class="autocomplete-bottom-left">${e.itemNameTranslated}</div>
          <span class="autocomplete-bottom-right">Type: <b>${e.itemTypeName==="I"?"Item":e.itemTypeName==="C"?"PdCat":"Cat"}</b></span>
        </div>`}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}k=J();S=ie(k,0,"Example32",W,S);te(k,1,S);export{S as Example32};
//# sourceMappingURL=example32-BE52oTZK.js.map
