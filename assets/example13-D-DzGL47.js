import{C as z,a as c,b as d,F as g,h as I,S as j,i as P,c as M}from"./index-xBMUucNl.js";import{E as W}from"./excelExport.service-JbJncGy1.js";import{T as $}from"./textExport.service-BBMEu9h8.js";import{A as a}from"./aggregators.index-Dr5ttK2D.js";import{G as h}from"./groupingFormatters.index-BW-M0DUZ.js";const T="example13",x=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example13.ts">
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
  <div class="col-sm-12">
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="add-500-rows-btn" click.trigger="loadData(500)">
      500 rows
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="add-50k-rows-btn" click.trigger="loadData(50000)">
      50k rows
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="clear-grouping-btn" click.trigger="clearGrouping()">
      <i class="mdi mdi-close"></i> Clear grouping
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="collapse-all-btn"
            click.trigger="collapseAllGroups()">
      <i class="mdi mdi-arrow-collapse"></i> Collapse all groups
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="expand-all-btn" click.trigger="expandAllGroups()">
      <i class="mdi mdi-arrow-expand"></i> Expand all groups
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="export-excel-btn" click.trigger="exportToExcel()">
      <i class="mdi mdi-file-excel-outline text-success"></i> Export to Excel
    </button>
  </div>
</div>

<hr />

<div class="row">
  <div class="col-sm-12">
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="group-duration-sort-value-btn"
            click.trigger="groupByDuration()">
      Group by Duration &amp; sort groups by value
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="group-duration-sort-count-btn"
            click.trigger="groupByDurationOrderByCount(false)">
      Group by Duration &amp; sort groups by count
    </button>
  </div>
  <div class="row">
    <div class="col-sm-12">
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="group-duration-sort-count-collapse-btn"
              click.trigger="groupByDurationOrderByCount(true)">
        Group by Duration &amp; sort groups by count, aggregate collapsed
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="group-duration-effort-btn"
              click.trigger="groupByDurationEffortDriven()">
        Group by Duration then Effort-Driven
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="group-duration-effort-percent-btn"
              click.trigger="groupByDurationEffortDrivenPercent()">
        Group by Duration then Effort-Driven then Percent.
      </button>
      <span hidden.bind="!processing">
        <i class="mdi mdi-sync mdi-spin"></i>
      </span>
    </div>
  </div>
</div>

<aurelia-slickgrid grid-id="grid13"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-before-export-to-excel.trigger="processing = true"
                    on-after-export-to-excel.trigger="processing = false"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
`,S=[],_={};let v;function B(r){v||(v=z.define({name:T,template:x,dependencies:S,bindables:_})),r.register(v)}const N=Object.freeze(Object.defineProperty({__proto__:null,bindables:_,default:x,dependencies:S,name:T,register:B,template:x},Symbol.toStringTag,{value:"Module"}));var L=Object.create,C=Object.defineProperty,R=Object.getOwnPropertyDescriptor,U=(r,e)=>(e=Symbol[r])?e:Symbol.for("Symbol."+r),F=r=>{throw TypeError(r)},k=(r,e,t)=>e in r?C(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,V=(r,e)=>C(r,"name",{value:e,configurable:!0}),q=r=>[,,,L(null)],H=["class","method","getter","setter","accessor","field","value","get","set"],G=r=>r!==void 0&&typeof r!="function"?F("Function expected"):r,Y=(r,e,t,o,n)=>({kind:H[r],name:e,metadata:o,addInitializer:l=>t._?F("Already initialized"):n.push(G(l||null))}),J=(r,e)=>k(e,U("metadata"),r[3]),K=(r,e,t,o)=>{for(var n=0,l=r[e>>1],s=l&&l.length;n<s;n++)l[n].call(t);return o},Q=(r,e,t,o,n,l)=>{var s,p,u,m=e&7,w=!1,E=0,A=r[E]||(r[E]=[]),b=m&&(n=n.prototype,m<5&&(m>3||!w)&&R(n,t));V(n,t);for(var f=o.length-1;f>=0;f--)u=Y(m,t,p={},r[3],A),s=(0,o[f])(n,u),p._=1,G(s)&&(n=s);return J(r,n),b&&C(n,t,b),w?m^4?l:b:n},i=(r,e,t)=>k(r,typeof e!="symbol"?e+"":e,t),O,D;O=[M(N)];class y{constructor(){i(this,"title","Example 13: Grouping & Aggregators"),i(this,"subTitle",`
    <ul>
      <li><a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/grouping-aggregators" target="_blank">Wiki docs</a></li>
      <li>Fully dynamic and interactive multi-level grouping with filtering and aggregates over 50'000 items</li>
      <li>Each grouping level can have its own aggregates (over child rows, child groups, or all descendant rows)..</li>
      <li>Use "Aggregators" and "GroupTotalFormatters" directly from Aurelia-Slickgrid</li>
    </ul>
  `),i(this,"aureliaGrid"),i(this,"columnDefinitions",[]),i(this,"gridOptions"),i(this,"dataset",[]),i(this,"dataviewObj"),i(this,"gridObj"),i(this,"hideSubTitle",!1),i(this,"processing",!1),i(this,"excelExportService",new W),i(this,"textExportService",new $),this.defineGrid()}attached(){this.loadData(500)}aureliaGridReady(e){this.aureliaGrid=e,this.dataviewObj=e.dataView,this.gridObj=e.slickGrid}defineGrid(){const e=document.createElement("div"),t=document.createElement("button"),o=document.createElement("span");o.className="mdi mdi-help-circle no-padding",t.dataset.test="col1-hello-btn",t.className="btn btn-outline-secondary btn-xs btn-icon ms-1",t.textContent="Click me",t.title="simple column header test with a button click listener",t.addEventListener("click",()=>alert("Hello World")),t.appendChild(o),e.appendChild(document.createTextNode("Id ")),e.appendChild(t),this.columnDefinitions=[{id:"sel",name:e,field:"num",type:c.number,columnPickerLabel:"Custom Label",width:140,maxWidth:150,excludeFromExport:!0,resizable:!0,filterable:!0,selectable:!1,focusable:!1},{id:"title",name:"Title",field:"title",width:50,minWidth:50,cssClass:"cell-title",filterable:!0,sortable:!0},{id:"duration",name:"Duration",field:"duration",minWidth:50,width:60,filterable:!0,filter:{model:d.slider,operator:">="},sortable:!0,type:c.number,groupTotalsFormatter:h.sumTotals,params:{groupFormatterPrefix:"Total: "}},{id:"percentComplete",name:"% Complete",field:"percentComplete",minWidth:70,width:90,formatter:g.percentCompleteBar,filterable:!0,filter:{model:d.compoundSlider},sortable:!0,type:c.number,groupTotalsFormatter:h.avgTotalsPercentage,params:{groupFormatterPrefix:"<i>Avg</i>: "}},{id:"start",name:"Start",field:"start",minWidth:60,maxWidth:130,filterable:!0,filter:{model:d.compoundDate},sortable:!0,type:c.dateIso,formatter:g.dateIso,exportWithFormatter:!0},{id:"finish",name:"Finish",field:"finish",minWidth:60,maxWidth:130,filterable:!0,filter:{model:d.compoundDate},sortable:!0,type:c.dateIso,formatter:g.dateIso,exportWithFormatter:!0},{id:"cost",name:"Cost",field:"cost",minWidth:70,width:80,sortable:!0,filterable:!0,filter:{model:d.compoundInputNumber},type:c.number,formatter:g.currency,groupTotalsFormatter:h.sumTotalsCurrency,params:{displayNegativeNumberWithParentheses:!0,currencyPrefix:"€",groupFormatterCurrencyPrefix:"€",minDecimal:2,maxDecimal:4,groupFormatterPrefix:"<b>Total</b>: "},excelExportOptions:{style:{font:{outline:!0,italic:!0},format:"€0.00##;[Red](€0.00##)"},width:18},groupTotalsExcelExportOptions:{style:{alignment:{horizontal:"center"},font:{bold:!0,color:"FF005289",underline:"single",fontName:"Consolas",size:10},fill:{type:"pattern",patternType:"solid",fgColor:"FFE6F2F6"},border:{top:{color:"FFa500ff",style:"thick"},left:{color:"FFa500ff",style:"medium"},right:{color:"FFa500ff",style:"dotted"},bottom:{color:"FFa500ff",style:"double"}},format:'"Total: "€0.00##;[Red]"Total: "(€0.00##)'}}},{id:"effortDriven",name:"Effort Driven",minWidth:30,width:80,maxWidth:90,cssClass:"cell-effort-driven",field:"effortDriven",formatter:g.checkmarkMaterial,sortable:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:d.singleSelect}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableFiltering:!0,enableGrouping:!0,enableExcelExport:!0,enableTextExport:!0,excelExportOptions:{sanitizeDataExport:!0},textExportOptions:{sanitizeDataExport:!0},externalResources:[this.excelExportService,this.textExportService],showCustomFooter:!0,customFooterOptions:{hideMetrics:!1,hideTotalItemCount:!1,hideLastUpdateTimestamp:!1}}}loadData(e){const t=[];for(let o=0;o<e;o++){const n=2e3+Math.floor(Math.random()*10),l=Math.floor(Math.random()*11),s=Math.floor(Math.random()*29),p=Math.round(Math.random()*100),u=o%33===0?null:Math.round(Math.random()*1e4)/100;t[o]={id:"id_"+o,num:o,title:"Task "+o,duration:Math.round(Math.random()*100)+"",percentComplete:p,percentCompleteNumber:p,start:new Date(n,l,s),finish:new Date(n,l+1,s),cost:o%3?u:u!==null?-u:null,effortDriven:o%5===0}}this.dataset=t}clearGrouping(){this.dataviewObj.setGrouping([])}collapseAllGroups(){this.dataviewObj.collapseAllGroups()}expandAllGroups(){this.dataviewObj.expandAllGroups()}exportToExcel(){this.excelExportService.exportToExcel({filename:"Export",format:I.xlsx})}groupByDuration(){this.aureliaGrid.filterService.setSortColumnIcons([{columnId:"duration",sortAsc:!0}]),this.dataviewObj.setGrouping({getter:"duration",formatter:e=>`Duration: ${e.value} <span style="color:green">(${e.count} items)</span>`,comparer:(e,t)=>j.numeric(e.value,t.value,P.asc),aggregators:[new a.Avg("percentComplete"),new a.Sum("cost")],aggregateCollapsed:!1,lazyTotalsCalculation:!0}),this.gridObj.invalidate()}groupByDurationOrderByCount(e){this.aureliaGrid.filterService.setSortColumnIcons([]),this.dataviewObj.setGrouping({getter:"duration",formatter:t=>`Duration: ${t.value} <span style="color:green">(${t.count} items)</span>`,comparer:(t,o)=>t.count-o.count,aggregators:[new a.Avg("percentComplete"),new a.Sum("cost")],aggregateCollapsed:e,lazyTotalsCalculation:!0}),this.gridObj.invalidate()}groupByDurationEffortDriven(){const e=[{columnId:"duration",sortAsc:!0},{columnId:"effortDriven",sortAsc:!0}];this.aureliaGrid.filterService.setSortColumnIcons(e),this.dataviewObj.setGrouping([{getter:"duration",formatter:t=>`Duration: ${t.value}  <span style="color:green">(${t.count} items)</span>`,aggregators:[new a.Sum("duration"),new a.Sum("cost")],aggregateCollapsed:!0,lazyTotalsCalculation:!0},{getter:"effortDriven",formatter:t=>`Effort-Driven: ${t.value?"True":"False"} <span style="color:green">(${t.count} items)</span>`,aggregators:[new a.Avg("percentComplete"),new a.Sum("cost")],collapsed:!0,lazyTotalsCalculation:!0}]),this.gridObj.invalidate()}groupByDurationEffortDrivenPercent(){const e=[{columnId:"duration",sortAsc:!0},{columnId:"effortDriven",sortAsc:!0},{columnId:"percentComplete",sortAsc:!0}];this.aureliaGrid.filterService.setSortColumnIcons(e),this.dataviewObj.setGrouping([{getter:"duration",formatter:t=>`Duration: ${t.value}  <span style="color:green">(${t.count} items)</span>`,aggregators:[new a.Sum("duration"),new a.Sum("cost")],aggregateCollapsed:!0,lazyTotalsCalculation:!0},{getter:"effortDriven",formatter:t=>`Effort-Driven: ${t.value?"True":"False"}  <span style="color:green">(${t.count} items)</span>`,aggregators:[new a.Sum("duration"),new a.Sum("cost")],lazyTotalsCalculation:!0},{getter:"percentComplete",formatter:t=>`% Complete: ${t.value}  <span style="color:green">(${t.count} items)</span>`,aggregators:[new a.Avg("percentComplete")],aggregateCollapsed:!0,collapsed:!0,lazyTotalsCalculation:!0}]),this.gridObj.invalidate()}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}D=q();y=Q(D,0,"Example13",O,y);K(D,1,y);export{y as Example13};
//# sourceMappingURL=example13-D-DzGL47.js.map
