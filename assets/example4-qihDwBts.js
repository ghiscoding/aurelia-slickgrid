import{C as M,r as W,n as P,b as m,a as n,O as w,F as f,c as A}from"./index-xBMUucNl.js";import{I as B}from"./index.dev-DffSqcDr.js";import{E as z}from"./excelExport.service-JbJncGy1.js";import{C as L}from"./custom-inputFilter-CFZ9IOG5.js";import"./groupingFormatters.index-BW-M0DUZ.js";const x="example4",_=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example4.ts">
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

<br />
<span if.bind="metrics">
  <b>Metrics:</b> \${metrics.endTime | dateFormat: 'DD MMM, h:mm:ss a'} | \${metrics.itemCount} of
  \${metrics.totalItemCount}
  items
</span>

<div class="btn-group" role="group" aria-label="...">
  <button class="btn btn-sm btn-outline-secondary btn-icon" data-test="scroll-top-btn" click.trigger="scrollGridTop()">
    <i class="mdi mdi-arrow-down mdi-rotate-180 icon"></i>
  </button>
  <button class="btn btn-sm btn-outline-secondary btn-icon" data-test="scroll-bottom-btn" click.trigger="scrollGridBottom()">
    <i class="mdi mdi-arrow-down icon"></i>
  </button>
</div>

<button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters"
        click.trigger="aureliaGrid.filterService.clearFilters()">
  Clear Filters
</button>
<button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-sorting"
        click.trigger="aureliaGrid.sortService.clearSorting()">
  Clear Sorting
</button>
<button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-filter"
        click.trigger="setFiltersDynamically()">
  Set Filters Dynamically
</button>
<button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-sorting"
        click.trigger="setSortingDynamically()">
  Set Sorting Dynamically
</button>
<button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="logItems()">
  <span title="console.log all dataset items">Log Items</span>
</button>

<aurelia-slickgrid grid-id="grid4"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
                    on-grid-state-changed.trigger="gridStateChanged($event.detail)"
                    on-row-count-changed.trigger="refreshMetrics($event.detail.eventData, $event.detail.args)">
</aurelia-slickgrid>
`,F=[],I={};let v;function U(e){v||(v=M.define({name:x,template:_,dependencies:F,bindables:I})),e.register(v)}const H=Object.freeze(Object.defineProperty({__proto__:null,bindables:I,default:_,dependencies:F,name:x,register:U,template:_},Symbol.toStringTag,{value:"Module"})),N=""+new URL("collection_500_numbers-TrP4BMO1.json",import.meta.url).href;var R=Object.create,T=Object.defineProperty,j=Object.getOwnPropertyDescriptor,q=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),E=e=>{throw TypeError(e)},G=(e,t,i)=>t in e?T(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,V=(e,t)=>T(e,"name",{value:t,configurable:!0}),Y=e=>[,,,R(null)],J=["class","method","getter","setter","accessor","field","value","get","set"],O=e=>e!==void 0&&typeof e!="function"?E("Function expected"):e,K=(e,t,i,o,r)=>({kind:J[e],name:t,metadata:o,addInitializer:a=>i._?E("Already initialized"):r.push(O(a||null))}),Z=(e,t)=>G(t,q("metadata"),e[3]),Q=(e,t,i,o)=>{for(var r=0,a=e[t>>1],s=a&&a.length;r<s;r++)a[r].call(i);return o},X=(e,t,i,o,r,a)=>{var s,S,c,u=t&7,p=!1,h=0,y=e[h]||(e[h]=[]),b=u&&(r=r.prototype,u<5&&(u>3||!p)&&j(r,i));V(r,i);for(var g=o.length-1;g>=0;g--)c=K(u,i,S={},e[3],y),s=(0,o[g])(r,c),S._=1,O(s)&&(r=s);return Z(e,r),b&&T(r,i,b),p?u^4?a:b:r},d=(e,t,i)=>G(e,typeof t!="symbol"?t+"":t,i),$,C;function l(e,t){return Math.floor(Math.random()*(t-e+1)+e)}const tt=10500;$=[A(H)];class D{constructor(t=W(P(B))){this.http=t,d(this,"title","Example 4: Client Side Sort/Filter"),d(this,"subTitle",`
  Sort/Filter on client side only using SlickGrid DataView (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/column-functionalities/sorting" target="_blank">Wiki docs</a>)
  <br/>
  <ul class="small">
    <li>Support multi-sort (by default), hold "Shift" key and click on the next column to sort.</li>
    <li>All column types support the following operators: (>, >=, <, <=, <>, !=, =, ==, *)</li>
    <ul>
      <li>Example: >100 ... >=2001-01-01 ... >02/28/17</li>
      <li><b>Note:</b> For filters to work properly (default is string), make sure to provide a FieldType (type is against the dataset, not the Formatter)</li>
    </ul>
    <li>Date Filters</li>
    <ul>
      <li>
        FieldType of dateUtc/date (from dataset) can use an extra option of "filterSearchType" to let user filter more easily.
        For example, in the "UTC Date" field below, you can type "&gt;02/28/2017", also when dealing with UTC you have to take the time difference in consideration.
      </li>
    </ul>
    <li>On String filters, (*) can be used as startsWith (Hello* => matches "Hello Word") ... endsWith (*Doe => matches: "John Doe")</li>
    <li>Custom Filter are now possible, "Description" column below, is a customized InputFilter with different placeholder. See <a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/column-functionalities/filters/custom-filter" target="_blank">Wiki - Custom Filter</a></li>
  </ul>
`),d(this,"aureliaGrid"),d(this,"columnDefinitions",[]),d(this,"gridOptions"),d(this,"dataset",[]),d(this,"hideSubTitle",!1),d(this,"metrics"),this.defineGrid()}attached(){this.dataset=this.mockData(tt)}detaching(){this.saveCurrentGridState()}aureliaGridReady(t){this.aureliaGrid=t}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",filterable:!0,sortable:!0,type:n.string,minWidth:45,filter:{model:m.compoundInputText}},{id:"description",name:"Description",field:"description",filterable:!0,sortable:!0,minWidth:80,type:n.string,filter:{model:L,enableTrimWhiteSpace:!0}},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,type:n.number,exportCsvForceToKeepAsString:!0,minWidth:55,filterable:!0,filter:{model:m.multipleSelect,collectionAsync:this.http.fetch(N),collectionFilterBy:[{property:"value",operator:w.notEqual,value:360},{property:"value",operator:w.notEqual,value:365}],collectionSortBy:{property:"value",sortDesc:!0,fieldType:n.number},customStructure:{value:"value",label:"label",optionLabel:"value",labelSuffix:"text"},collectionOptions:{separatorBetweenTextLabels:" ",filterResultAfterEachPass:"chain"},filterOptions:{maxHeight:250,width:175,useSelectOptionLabelToHtml:!0}}},{id:"complete",name:"% Complete",field:"percentComplete",formatter:f.percentCompleteBar,minWidth:70,type:n.number,sortable:!0,filterable:!0,filter:{model:m.compoundInputNumber}},{id:"start",name:"Start",field:"start",formatter:f.dateIso,sortable:!0,minWidth:75,type:n.date,filterable:!0,filter:{model:m.compoundDate}},{id:"usDateShort",name:"US Date Short",field:"usDateShort",sortable:!0,minWidth:70,width:70,type:n.dateUsShort,filterable:!0,filter:{model:m.compoundDate}},{id:"utcDate",name:"UTC Date",field:"utcDate",formatter:f.dateTimeIsoAmPm,sortable:!0,minWidth:115,type:n.dateUtc,outputType:n.dateTimeIsoAmPm,filterable:!0,filter:{model:m.compoundDate,filterOptions:{range:{min:"today"}}}},{id:"effort-driven",name:"Effort Driven",field:"effortDriven.isEffort",minWidth:85,maxWidth:95,type:n.boolean,sortable:!0,formatter:f.multiple,params:{formatters:[f.complexObject,f.checkmarkMaterial]},filterable:!0,filter:{collection:["","True","False"],model:m.singleSelect,filterOptions:{maxHeight:250}}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableExcelExport:!0,enableExcelCopyBuffer:!0,enableFiltering:!0,showCustomFooter:!0,presets:{filters:[{columnId:"duration",searchTerms:[10,98]},{columnId:"usDateShort",operator:"<",searchTerms:["4/20/25"]}],sorters:[{columnId:"duration",direction:"DESC"},{columnId:"complete",direction:"ASC"}]},externalResources:[new z],preParseDateColumns:"__"}}logItems(){var t;console.log((t=this.aureliaGrid.dataView)==null?void 0:t.getItems())}mockData(t,i=0){const o=[];for(let r=i;r<i+t;r++){const a=Math.round(Math.random()*100),s=l(2e3,2035),S=l(10,35),c=l(1,12),u=c<10?`0${c}`:c,p=l(10,28),h=l(0,100),y=l(10,23),b=l(10,59),g=`${l(1,9)}${l(10,99)}`,k=r%3===0;o.push({id:r,title:"Task "+r,description:r%5?"desc "+r:null,duration:a,percentComplete:h,percentCompleteNumber:h,start:r%4?null:new Date(s,c,p),usDateShort:`${c}/${p}/${S}`,utcDate:`${s}-${u}-${p}T${y}:${b}:${b}.${g}Z`,effortDriven:{isEffort:k,label:k?"Effort":"NoEffort"}})}return o}gridStateChanged(t){console.log("Client sample, Grid State changed:: ",t.change)}saveCurrentGridState(){console.log("Client sample, current Grid State:: ",this.aureliaGrid.gridStateService.getCurrentGridState())}setFiltersDynamically(){this.aureliaGrid.filterService.updateFilters([{columnId:"duration",searchTerms:[2,25,48,50]},{columnId:"complete",searchTerms:[95],operator:"<"},{columnId:"effort-driven",searchTerms:[!0]},{columnId:"start",operator:">=",searchTerms:["2001-02-28"]}])}setSortingDynamically(){this.aureliaGrid.sortService.updateSorting([{columnId:"duration",direction:"ASC"},{columnId:"start",direction:"DESC"}])}refreshMetrics(t,i){i&&i.current>=0&&window.setTimeout(()=>{this.metrics={startTime:new Date,endTime:new Date,itemCount:i&&i.current||0,totalItemCount:this.dataset.length||0}})}scrollGridBottom(){this.aureliaGrid.slickGrid.navigateBottom()}scrollGridTop(){this.aureliaGrid.slickGrid.navigateTop()}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const t=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[t]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}C=Y();D=X(C,0,"Example4",$,D);Q(C,1,D);export{D as Example4};
//# sourceMappingURL=example4-qihDwBts.js.map
