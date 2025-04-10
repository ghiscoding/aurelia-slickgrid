import{C as V,r as T,n as q,I as U,F as h,a as d,b as f,O as A,S as z,d as H,c as K}from"./index-CATZt-GI.js";import{I as J}from"./index.dev-C_UIuEgO.js";import{E as u}from"./editors.index-BChC4Eh8.js";import{C as Y}from"./custom-inputFilter-GCZ0DNgI.js";import{C as D}from"./countries-DVECuSGk.js";const N="example3",w=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example3.ts">
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

<div class="row">
  <div class="col-sm-6">
    <label>autoEdit setting</label>
    <br />
    <span id="radioAutoEdit">
      <div class="row">

        <label class="radio-inline control-label"
                for="radioTrue">
          <input type="radio"
                  name="inlineRadioOptions"
                  id="radioTrue"
                  checked
                  value.bind="isAutoEdit"
                  click.trigger="setAutoEdit(true)"> ON
          (single-click)
        </label>
        <label class="radio-inline control-label"
                for="radioFalse">
          <input type="radio"
                  name="inlineRadioOptions"
                  id="radioFalse"
                  value.bind="isAutoEdit"
                  click.trigger="setAutoEdit(false)"> OFF
          (double-click)
        </label>
      </div>
      <div class="row col-sm-12">
        <span>
          <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="undo()" data-test="undo-btn">
            <i class="mdi mdi-undo"></i>
            Undo last edit(s)
          </button>
          <label class="checkbox-inline control-label"
                  for="autoCommitEdit">
            <input type="checkbox"
                    id="autoCommitEdit"
                    data-test="auto-commit"
                    value.bind="gridOptions.autoCommitEdit"
                    click.trigger="changeAutoCommit()">
            Auto Commit Edit
          </label>
        </span>
      </div>
    </span>
    <div class="row" style="margin-top: 5px">
      <div class="col-sm-12">
        <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="aureliaGrid.filterService.clearFilters()">Clear
          Filters</button>
        <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="aureliaGrid.sortService.clearSorting()">Clear
          Sorting</button>
        <button class="btn btn-outline-primary btn-sm" data-test="add-item-btn" click.trigger="addItem()"
                title="Clear Filters &amp; Sorting to see it better">
          Add item
        </button>
        <button class="btn btn-outline-danger btn-sm" data-test="delete-item-btn" click.trigger="deleteItem()">Delete
          item</button>
      </div>
    </div>
    <div class="row" style="margin-top: 5px">
      <div class="col-sm-12">
        <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="add-title-column"
                click.trigger="dynamicallyAddTitleHeader()">
          <i class="mdi mdi-shape-square-plus"></i>
          Dynamically Duplicate Title Column
        </button>
        <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="remove-title-column"
                click.trigger="dynamicallyRemoveLastColumn()">
          <i class="mdi mdi-minus"></i>
          Dynamically Remove Last Column
        </button>
      </div>
    </div>
  </div>

  <div class="col-sm-6">
    <div class="alert alert-info"
          show.bind="updatedObject">
      <strong>Updated Item:</strong> \${updatedObject | stringify}
    </div>
    <div class="alert alert-warning"
          show.bind="alertWarning">
      \${alertWarning}
    </div>
  </div>
</div>

<div id="grid-container" class="col-sm-12">
  <aurelia-slickgrid grid-id="grid3"
                      column-definitions.bind="columnDefinitions"
                      grid-options.bind="gridOptions"
                      dataset.bind="dataset"
                      instances.bind="aureliaGrid"
                      on-cell-change.trigger="onCellChanged($event.detail.eventData, $event.detail.args)"
                      on-click.trigger="onCellClicked($event.detail.eventData, $event.detail.args)"
                      on-validation-error.trigger="onCellValidationError($event.detail.eventData, $event.detail.args)">
  </aurelia-slickgrid>
</div>
`,M=[],W={};let C;function Q(i){C||(C=V.define({name:N,template:w,dependencies:M,bindables:W})),i.register(C)}const X=Object.freeze(Object.defineProperty({__proto__:null,bindables:W,default:w,dependencies:M,name:N,register:Q,template:w},Symbol.toStringTag,{value:"Module"}));var Z=Object.defineProperty,ee=(i,e,t)=>e in i?Z(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,E=(i,e,t)=>ee(i,typeof e!="symbol"?e+"":e,t);class te{constructor(e){this.args=e,E(this,"_lastInputEvent"),E(this,"inputElm"),E(this,"defaultValue"),this.init()}get columnDef(){var e;return((e=this.args)==null?void 0:e.column)??{}}get columnEditor(){var e;return((e=this.columnDef)==null?void 0:e.editor)??{}}get validator(){var e,t;return((e=this.columnEditor)==null?void 0:e.validator)||((t=this.columnDef)==null?void 0:t.validator)}init(){var t;const e=((t=this.columnEditor)==null?void 0:t.placeholder)||"";this.inputElm=document.createElement("input"),this.inputElm.className="editor-text",this.inputElm.placeholder=e,this.args.container.appendChild(this.inputElm),this.inputElm.addEventListener("keydown",this.handleKeydown.bind(this)),window.setTimeout(()=>{this.inputElm.focus(),this.inputElm.select()},50)}handleKeydown(e){this._lastInputEvent=e,(e.key==="ArrowLeft"||e.key==="ArrowRight")&&e.stopImmediatePropagation()}destroy(){this.inputElm.removeEventListener("keydown",this.handleKeydown.bind(this)),this.inputElm.remove()}focus(){this.inputElm.focus()}getValue(){return this.inputElm.value}setValue(e){this.inputElm.value=e}loadValue(e){this.defaultValue=e[this.args.column.field]||"",this.inputElm.value=this.defaultValue,this.inputElm.defaultValue=this.defaultValue,this.inputElm.select()}serializeValue(){return this.inputElm.value}applyValue(e,t){const n=this.validate(t);e[this.args.column.field]=n&&n.valid?t:""}isValueChanged(){var t,n;const e=(t=this._lastInputEvent)==null?void 0:t.key;return(n=this.columnEditor)!=null&&n.alwaysSaveOnEnterKey&&e==="Enter"?!0:!(this.inputElm.value===""&&this.defaultValue===null)&&this.inputElm.value!==this.defaultValue}validate(e){var t;if(this.validator){const n=e!==void 0?e:(t=this.inputElm)==null?void 0:t.value;return this.validator(n,this.args)}return{valid:!0,msg:null}}}const F=""+new URL("collection_100_numbers-DqRiakum.json",import.meta.url).href,I=""+new URL("country_names-BQhs2ynd.json",import.meta.url).href,$={timeout:5e3,jsonpCallback:"callback"},ie=()=>`jsonp_${Date.now()}_${Math.ceil(Math.random()*1e5)}`,g=i=>delete window[i],_=i=>{const e=document.getElementById(i);e&&document.getElementsByTagName("head")[0].removeChild(e)};function P(i,e={}){let t=i;const n=e.timeout||$.timeout,l=e.jsonpCallback||$.jsonpCallback;let r;return new Promise((m,p)=>{const o=e.jsonpCallbackFunction||ie(),s=`${l}_${o}`;window[o]=b=>{m({ok:!0,json:()=>Promise.resolve(b)}),r&&clearTimeout(r),_(s),g(o)},t+=t.indexOf("?")===-1?"?":"&";const a=document.createElement("script");a.setAttribute("src",`${t}${l}=${o}`),e.charset&&a.setAttribute("charset",e.charset),e.nonce&&a.setAttribute("nonce",e.nonce),e.referrerPolicy&&a.setAttribute("referrerPolicy",e.referrerPolicy),e.crossorigin&&a.setAttribute("crossorigin","true"),a.id=s,document.getElementsByTagName("head")[0].appendChild(a),r=setTimeout(()=>{p(new Error(`JSONP request to ${i} timed out`)),g(o),_(s),window[o]=()=>{g(o)}},n),a.onerror=()=>{p(new Error(`JSONP request to ${i} failed`)),g(o),_(s),r&&clearTimeout(r)}})}var ne=Object.create,S=Object.defineProperty,le=Object.getOwnPropertyDescriptor,re=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),G=i=>{throw TypeError(i)},R=(i,e,t)=>e in i?S(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,oe=(i,e)=>S(i,"name",{value:e,configurable:!0}),ae=i=>[,,,ne(null)],se=["class","method","getter","setter","accessor","field","value","get","set"],j=i=>i!==void 0&&typeof i!="function"?G("Function expected"):i,de=(i,e,t,n,l)=>({kind:se[i],name:e,metadata:n,addInitializer:r=>t._?G("Already initialized"):l.push(j(r||null))}),ce=(i,e)=>R(e,re("metadata"),i[3]),ue=(i,e,t,n)=>{for(var l=0,r=i[e>>1],m=r&&r.length;l<m;l++)r[l].call(t);return n},me=(i,e,t,n,l,r)=>{var m,p,o,s=e&7,a=!1,b=0,B=i[b]||(i[b]=[]),v=s&&(l=l.prototype,s<5&&(s>3||!a)&&le(l,t));oe(l,t);for(var y=n.length-1;y>=0;y--)o=de(s,t,p={},i[3],B),m=(0,n[y])(l,o),p._=1,j(m)&&(l=m);return ce(i,l),v&&S(l,t,v),a?s^4?r:v:l},c=(i,e,t)=>R(i,typeof e!="symbol"?e+"":e,t),L,x;const he=100,O=i=>i==null||!i.length?{valid:!1,msg:"This is a required field"}:/^Task\s\d+$/.test(i)?{valid:!0,msg:""}:{valid:!1,msg:'Your title is invalid, it must start with "Task" followed by a number'},pe=(i,e,t)=>{if(t&&Array.isArray(t)){const l=t.map(r=>`Task ${r}`).join(", ");return`<span title="${l}">${l}</span>`}return""};L=[K(X)];class k{constructor(e=T(q(J)),t=T(U)){this.http=e,this.i18n=t,c(this,"title","Example 3: Editors / Delete"),c(this,"subTitle",`
  Grid with Inline Editors and onCellClick actions (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/column-functionalities/editors" target="_blank">Wiki docs</a>).
  <ul>
    <li>When using "enableCellNavigation: true", clicking on a cell will automatically make it active &amp; selected.</li>
    <ul><li>If you don't want this behavior, then you should disable "enableCellNavigation"</li></ul>
    <li>Inline Editors requires "enableCellNavigation: true" (not sure why though)</li>
    <li>
        Support Excel Copy Buffer (SlickGrid Copy Manager Plugin), you can use it by simply enabling "enableExcelCopyBuffer" flag.
        Note that it will only evaluate Formatter when the "exportWithFormatter" flag is enabled (through "ExcelExportOptions" or "TextExportOptions" or the column definition)
    </li>
    <li>Support of "collectionAsync" is possible, click on "Clear Filters/Sorting" then add/delete item(s) and look at "Prerequisites" Select Filter</li>
  </ul>
  `),c(this,"_commandQueue",[]),c(this,"aureliaGrid"),c(this,"gridOptions"),c(this,"columnDefinitions",[]),c(this,"dataset",[]),c(this,"updatedObject"),c(this,"hideSubTitle",!1),c(this,"isAutoEdit",!0),c(this,"alertWarning"),c(this,"duplicateTitleHeaderCount",1),this.defineGrid()}attached(){this.dataset=this.mockData(he)}defineGrid(){this.columnDefinitions=[{id:"edit",field:"id",excludeFromColumnPicker:!0,excludeFromGridMenu:!0,excludeFromHeaderMenu:!0,formatter:h.icon,params:{iconCssClass:"mdi mdi-pencil pointer"},minWidth:30,maxWidth:30,onCellClick:(e,t)=>{console.log(t),this.alertWarning=`Editing: ${t.dataContext.title}`,this.aureliaGrid.gridService.highlightRow(t.row,1500),this.aureliaGrid.gridService.setSelectedRow(t.row)}},{id:"delete",field:"id",excludeFromColumnPicker:!0,excludeFromGridMenu:!0,excludeFromHeaderMenu:!0,formatter:h.icon,params:{iconCssClass:"mdi mdi-trash-can pointer"},minWidth:30,maxWidth:30},{id:"title",name:"Title",field:"title",filterable:!0,sortable:!0,type:d.string,editor:{model:u.longText,placeholder:"something",title:"some title",validator:O},minWidth:100,onCellChange:(e,t)=>{console.log(t),this.alertWarning=`Updated Title: ${t.dataContext.title}`}},{id:"title2",name:"Title, Custom Editor",field:"title",filterable:!0,sortable:!0,type:d.string,editor:{model:te,placeholder:"custom",validator:O},filter:{model:Y,placeholder:"🔎︎ custom"},minWidth:70},{id:"duration",name:"Duration (days)",field:"duration",filterable:!0,minWidth:100,sortable:!0,type:d.number,filter:{model:f.slider,filterOptions:{hideSliderNumber:!1}},editor:{model:u.slider,minValue:0,maxValue:100}},{id:"complete",name:"% Complete",field:"percentComplete",filterable:!0,formatter:h.multiple,type:d.number,editor:{enableRenderHtml:!0,collection:Array.from(Array(101).keys()).map(e=>({value:e,label:e,symbol:'<i class="mdi mdi-percent-outline" style="color:cadetblue"></i>'})),customStructure:{value:"value",label:"label",labelSuffix:"symbol"},collectionSortBy:{property:"label",sortDesc:!0},collectionFilterBy:{property:"value",value:0,operator:A.notEqual},model:u.singleSelect},minWidth:100,params:{formatters:[h.collectionEditor,h.percentCompleteBar]}},{id:"start",name:"Start",field:"start",filterable:!0,filter:{model:f.compoundDate},formatter:h.dateIso,sortable:!0,minWidth:100,type:d.date,editor:{model:u.date}},{id:"finish",name:"Finish",field:"finish",filterable:!0,filter:{model:f.compoundDate},formatter:h.dateIso,sortable:!0,minWidth:100,type:d.date,saveOutputType:d.dateUtc,editor:{model:u.date,editorOptions:{range:{min:"today"}}}},{id:"cityOfOrigin",name:"City of Origin",field:"cityOfOrigin",filterable:!0,sortable:!0,minWidth:100,editor:{model:u.autocompleter,placeholder:"🔎︎ search city",editorOptions:{minLength:3,forceUserInput:!0,fetch:(e,t)=>{P(`http://gd.geobytes.com/AutoCompleteCity?q=${e}`).then(n=>n.json()).then(n=>t(n)).catch(n=>console.log("invalid JSONP response",n))}}},filter:{model:f.autocompleter,filterOptions:{minLength:3,fetch:(e,t)=>{P(`http://gd.geobytes.com/AutoCompleteCity?q=${e}`).then(n=>n.json()).then(n=>t(n)).catch(n=>console.log("invalid JSONP response",n))}}}},{id:"countryOfOrigin",name:"Country of Origin",field:"countryOfOrigin",formatter:h.complexObject,dataKey:"code",labelKey:"name",type:d.object,sortComparer:z.objectString,filterable:!0,sortable:!0,minWidth:100,editor:{model:u.autocompleter,customStructure:{label:"name",value:"code"},collectionAsync:this.http.fetch(D)},filter:{model:f.autocompleter,customStructure:{label:"name",value:"code"},collectionAsync:this.http.fetch(D)}},{id:"countryOfOriginName",name:"Country of Origin Name",field:"countryOfOriginName",filterable:!0,sortable:!0,minWidth:100,editor:{model:u.autocompleter,collectionAsync:this.http.fetch(I)},filter:{model:f.autocompleter,collectionAsync:this.http.fetch(I)}},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",filterable:!0,type:d.boolean,filter:{model:f.singleSelect,collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}]},formatter:h.checkmarkMaterial,editor:{model:u.checkbox},minWidth:70},{id:"prerequisites",name:"Prerequisites",field:"prerequisites",filterable:!0,formatter:pe,exportWithFormatter:!0,sanitizeDataExport:!0,minWidth:100,sortable:!0,type:d.string,editor:{collectionAsync:this.http.fetch(F),collectionSortBy:{property:"value",sortDesc:!0,fieldType:d.number},customStructure:{label:"label",value:"value",labelPrefix:"prefix"},collectionOptions:{separatorBetweenTextLabels:" "},model:u.multipleSelect},filter:{collectionAsync:this.http.fetch(F),collectionSortBy:{property:"value",sortDesc:!0,fieldType:d.number},customStructure:{label:"label",value:"value",labelPrefix:"prefix"},collectionOptions:{separatorBetweenTextLabels:" "},model:f.multipleSelect,operator:A.inContains}}],this.gridOptions={autoEdit:this.isAutoEdit,autoCommitEdit:!1,autoResize:{container:"#demo-container",rightPadding:10},editable:!0,enableCellNavigation:!0,enableExcelCopyBuffer:!0,enableFiltering:!0,editCommandHandler:(e,t,n)=>{this._commandQueue.push(n),n.execute()},i18n:this.i18n}}addItem(){const e=this.dataset.length,t=this.mockData(1,e);window.setTimeout(()=>{const n=this.columnDefinitions.find(l=>l.id==="prerequisites");if(n){const l=n.editor.collection,r=n.filter.collection;Array.isArray(l)&&Array.isArray(r)&&(this.aureliaGrid.gridService.addItem(t[0],{highlightRow:!1}),l.push({value:e,label:e,prefix:"Task",suffix:"days"}),r.push({value:e,label:e,prefix:"Task",suffix:"days"}))}},250)}deleteItem(){const e=this.columnDefinitions.find(t=>t.id==="prerequisites");if(e){const t=e.editor.collection,n=e.filter.collection;if(Array.isArray(t)&&Array.isArray(n)){const l=this.sortCollectionDescending(t).pop();this.sortCollectionDescending(n).pop(),this.aureliaGrid.gridService.deleteItemById(l.value)}}}sortCollectionDescending(e){return e.sort((t,n)=>t.value-n.value)}mockData(e,t=0){const n=[];for(let l=t;l<t+e;l++){const r=2e3+this.randomBetween(4,15),m=new Date().getFullYear()-3+Math.floor(Math.random()*10),p=Math.floor(Math.random()*11),o=Math.floor(Math.random()*29),s=Math.round(Math.random()*100),a=new Date(m,p+1,o);n.push({id:l,title:"Task "+l,duration:Math.round(Math.random()*100)+"",percentComplete:s,percentCompleteNumber:s,start:new Date(r,p,o),finish:a<new Date?"":a,effortDriven:l%5===0,prerequisites:l%2===0&&l!==0&&l<12?[l,l-1]:[],countryOfOrigin:l%2?{code:"CA",name:"Canada"}:{code:"US",name:"United States"},countryOfOriginName:l%2?"Canada":"United States",cityOfOrigin:l%2?"Vancouver, BC, Canada":"Boston, MA, United States"})}return n}randomBetween(e,t){return Math.floor(Math.random()*(t-e+1)+e)}onCellChanged(e,t){console.log("onCellChange",t),this.updatedObject={...t.item}}onCellClicked(e,t){const n=this.aureliaGrid.gridService.getColumnFromEventArguments(t);console.log(n),n.columnDef.id==="edit"?(this.alertWarning=`open a modal window to edit: ${n.dataContext.title}`,this.aureliaGrid.gridService.highlightRow(t.row,1500)):n.columnDef.id==="delete"&&confirm("Are you sure?")&&(this.aureliaGrid.gridService.deleteItemById(n.dataContext.id),this.alertWarning=`Deleted: ${n.dataContext.title}`)}onCellValidationError(e,t){t.validationResults&&alert(t.validationResults.msg)}changeAutoCommit(){return this.gridOptions.autoCommitEdit=!this.gridOptions.autoCommitEdit,this.aureliaGrid.slickGrid.setOptions({autoCommitEdit:this.gridOptions.autoCommitEdit}),!0}dynamicallyAddTitleHeader(){const e={id:`title${this.duplicateTitleHeaderCount++}`,name:"Title",field:"title",editor:{model:u.text,required:!0,validator:O},sortable:!0,minWidth:100,filterable:!0};this.columnDefinitions.push(e)}dynamicallyRemoveLastColumn(){this.columnDefinitions.pop()}setAutoEdit(e){return this.isAutoEdit=e,this.aureliaGrid.slickGrid.setOptions({autoEdit:e}),!0}undo(){const e=this._commandQueue.pop();e&&H.cancelCurrentEdit()&&(e.undo(),this.aureliaGrid.slickGrid.gotoCell(e.row,e.cell,!1))}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}x=ae();k=me(x,0,"Example3",L,k);ue(x,1,k);export{k as Example3};
//# sourceMappingURL=example3-_g_HdMg3.js.map
