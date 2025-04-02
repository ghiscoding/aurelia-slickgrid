import{C as M,a as l,b as u,F as m,S as A,i as j,h as B,c as H}from"./index-Bz3uuwsZ.js";import{E as $}from"./excelExport.service-BVEnwJlG.js";import{T as I}from"./textExport.service-CiLvcQgQ.js";import{A as d}from"./aggregators.index-6uBa5zAH.js";import{G as f}from"./groupingFormatters.index-B6oGpPhz.js";const _="example18",y=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example18.ts">
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
  <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="toggleDarkMode()" data-test="toggle-dark-mode">
    <span class="mdi mdi-theme-light-dark"></span>
    <span>Toggle Dark Mode</span>
  </button>
</h2>

<div class="subtitle" innerhtml.bind="subTitle"></div>

<div class="form-inline">
  <div class="row">
    <div class="col-sm-12">
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="add-500-rows-btn" click.trigger="loadData(500)">
        500 rows
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="add-50k-rows-btn" click.trigger="loadData(50000)">
        50k rows
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="clear-grouping-btn"
              click.trigger="clearGroupsAndSelects()">
        <i class="mdi mdi-close"></i> Clear grouping
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="collapse-all-btn"
              click.trigger="collapseAllGroups()">
        <i class="mdi mdi-arrow-collapse"></i> Collapse all groups
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="expand-all-btn" click.trigger="expandAllGroups()">
        <i class="mdi mdi-arrow-expand"></i> Expand all groups
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="toggle-draggable-grouping-row" click.trigger="toggleDraggableGroupingRow()">
        Toggle Draggable Grouping Row
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" click.trigger="exportToExcel()">
        <i class="mdi mdi-file-excel-outline text-success"></i> Export to Excel
      </button>
    </div>
  </div>

  <div class="row">
    <div class="col-sm-12">
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="group-duration-sort-value-btn"
              click.trigger="groupByDurationOrderByCount(false)">
        Group by duration &amp; sort groups by value
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="group-duration-sort-count-btn"
              click.trigger="groupByDurationOrderByCount(true)">
        Group by duration &amp; sort groups by count
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="group-duration-effort-btn"
              click.trigger="groupByDurationEffortDriven()">
        Group by Duration then Effort-Driven
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="set-dynamic-filter"
              click.trigger="setFiltersDynamically()">
        <span class="mdi mdi-filter-outline"></span>
        <span>
          Set Filters Dynamically
        </span>
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="set-dynamic-sorting"
              click.trigger="setSortingDynamically()">
        <span class="mdi mdi-sort-ascending"></span>
        <span>
          Set Sorting Dynamically
        </span>
      </button>
    </div>
  </div>

  <div class="row mt-2">
    <div class="col-sm-12">
      <div class="form-row">
        <div class="row form-group">
          <label for="field1" class="col-sm-3 mb-2">Group by field(s)</label>
          <div class="form-group col-md-3 grouping-selects" repeat.for="groupField of selectedGroupingFields">
            <select class="form-select" change.trigger="groupByFieldName()"
                    value.bind="groupField">
              <option model.bind="''">...</option>
              <option model.bind="column.id" repeat.for="column of columnDefinitions">\${column.name}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="row mt-1 mb-1">
  <hr />
</div>

<aurelia-slickgrid grid-id="grid18"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
`,k=[],C={};let v;function z(r){v||(v=M.define({name:_,template:y,dependencies:k,bindables:C})),r.register(v)}const W=Object.freeze(Object.defineProperty({__proto__:null,bindables:C,default:y,dependencies:k,name:_,register:z,template:y},Symbol.toStringTag,{value:"Module"}));var R=Object.create,G=Object.defineProperty,q=Object.getOwnPropertyDescriptor,N=(r,e)=>(e=Symbol[r])?e:Symbol.for("Symbol."+r),F=r=>{throw TypeError(r)},T=(r,e,t)=>e in r?G(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,U=(r,e)=>G(r,"name",{value:e,configurable:!0}),L=r=>[,,,R(null)],V=["class","method","getter","setter","accessor","field","value","get","set"],E=r=>r!==void 0&&typeof r!="function"?F("Function expected"):r,Y=(r,e,t,o,i)=>({kind:V[r],name:e,metadata:o,addInitializer:a=>t._?F("Already initialized"):i.push(E(a||null))}),J=(r,e)=>T(e,N("metadata"),r[3]),K=(r,e,t,o)=>{for(var i=0,a=r[e>>1],s=a&&a.length;i<s;i++)a[i].call(t);return o},Q=(r,e,t,o,i,a)=>{var s,c,p,g=e&7,D=!1,S=0,O=r[S]||(r[S]=[]),b=g&&(i=i.prototype,g<5&&(g>3||!D)&&q(i,t));U(i,t);for(var h=o.length-1;h>=0;h--)p=Y(g,t,c={},r[3],O),s=(0,o[h])(i,p),c._=1,E(s)&&(i=s);return J(r,i),b&&G(i,t,b),D?g^4?a:b:i},n=(r,e,t)=>T(r,typeof e!="symbol"?e+"":e,t),P,w;P=[H(W)];class x{constructor(){n(this,"_darkMode",!1),n(this,"title","Example 18: Draggable Grouping & Aggregators"),n(this,"subTitle",`
  <ul>
  <li><a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/grouping-aggregators" target="_blank">Wiki docs</a></li>
  <li>This example shows 3 ways of grouping</li>
  <ol>
  <li>Drag any Column Header on the top placeholder to group by that column (support moti-columns grouping by adding more columns to the drop area).</li>
  <li>Use buttons and defined functions to group by whichever field you want</li>
  <li>Use the Select dropdown to group, the position of the Selects represent the grouping level</li>
  </ol>
  <li>Fully dynamic and interactive multi-level grouping with filtering and aggregates ovor 50'000 items</li>
  <li>Each grouping level can have its own aggregates (over child rows, child groups, or all descendant rows)..</li>
  <li>Use "Aggregators" and "GroupTotalFormatters" directly from Aurelia-Slickgrid</li>
  </ul>
  `),n(this,"aureliaGrid"),n(this,"columnDefinitions",[]),n(this,"dataset",[]),n(this,"dataviewObj"),n(this,"draggableGroupingPlugin"),n(this,"durationOrderByCount",!1),n(this,"gridObj"),n(this,"gridOptions"),n(this,"hideSubTitle",!1),n(this,"processing",!1),n(this,"selectedGroupingFields",["","",""]),n(this,"excelExportService",new $),n(this,"textExportService",new I),this.loadData(500),this.defineGrid()}aureliaGridReady(e){this.aureliaGrid=e,this.gridObj=e.slickGrid,this.dataviewObj=e.dataView}detaching(){document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light"}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",columnGroup:"Common Factor",width:70,minWidth:50,cssClass:"cell-title",filterable:!0,sortable:!0,grouping:{getter:"title",formatter:e=>`Title: ${e.value}  <span class="text-primary">(${e.count} items)</span>`,aggregators:[new d.Sum("cost")],aggregateCollapsed:!1,collapsed:!1}},{id:"duration",name:"Duration",field:"duration",columnGroup:"Common Factor",width:70,sortable:!0,filterable:!0,filter:{model:u.slider,operator:">="},type:l.number,groupTotalsFormatter:f.sumTotals,grouping:{getter:"duration",formatter:e=>`Duration: ${e.value}  <span class="text-primary">(${e.count} items)</span>`,comparer:(e,t)=>this.durationOrderByCount?e.count-t.count:A.numeric(e.value,t.value,j.asc),aggregators:[new d.Sum("cost")],aggregateCollapsed:!1,collapsed:!1}},{id:"start",name:"Start",field:"start",columnGroup:"Period",minWidth:60,sortable:!0,filterable:!0,filter:{model:u.compoundDate},formatter:m.dateIso,type:l.dateUtc,outputType:l.dateIso,exportWithFormatter:!0,grouping:{getter:"start",formatter:e=>`Start: ${e.value}  <span class="text-primary">(${e.count} items)</span>`,aggregators:[new d.Sum("cost")],aggregateCollapsed:!1,collapsed:!1}},{id:"finish",name:"Finish",field:"finish",columnGroup:"Period",minWidth:60,sortable:!0,filterable:!0,filter:{model:u.compoundDate},formatter:m.dateIso,type:l.dateUtc,outputType:l.dateIso,exportWithFormatter:!0,grouping:{getter:"finish",formatter:e=>`Finish: ${e.value} <span class="text-primary">(${e.count} items)</span>`,aggregators:[new d.Sum("cost")],aggregateCollapsed:!1,collapsed:!1}},{id:"cost",name:"Cost",field:"cost",columnGroup:"Analysis",width:90,sortable:!0,filterable:!0,filter:{model:u.compoundInput},formatter:m.dollar,exportWithFormatter:!0,groupTotalsFormatter:f.sumTotalsDollar,type:l.number,grouping:{getter:"cost",formatter:e=>`Cost: ${e.value} <span class="text-primary">(${e.count} items)</span>`,aggregators:[new d.Sum("cost")],aggregateCollapsed:!0,collapsed:!0}},{id:"percentComplete",name:"% Complete",field:"percentComplete",columnGroup:"Analysis",minWidth:70,width:90,formatter:m.percentCompleteBar,type:l.number,filterable:!0,filter:{model:u.compoundSlider},sortable:!0,groupTotalsFormatter:f.avgTotalsPercentage,grouping:{getter:"percentComplete",formatter:e=>`% Complete: ${e.value}  <span class="text-primary">(${e.count} items)</span>`,aggregators:[new d.Sum("cost")],aggregateCollapsed:!1,collapsed:!1},params:{groupFormatterPrefix:"<i>Avg</i>: "}},{id:"effortDriven",name:"Effort-Driven",field:"effortDriven",columnGroup:"Analysis",width:80,minWidth:20,maxWidth:100,cssClass:"cell-effort-driven",sortable:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:u.singleSelect},formatter:m.checkmarkMaterial,grouping:{getter:"effortDriven",formatter:e=>`Effort-Driven: ${e.value?"True":"False"} <span class="text-primary">(${e.count} items)</span>`,aggregators:[new d.Sum("cost")],collapsed:!1}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableDraggableGrouping:!0,createPreHeaderPanel:!0,showPreHeaderPanel:!0,preHeaderPanelHeight:30,createTopHeaderPanel:!0,showTopHeaderPanel:!0,topHeaderPanelHeight:35,showCustomFooter:!0,enableFiltering:!0,enableSorting:!0,enableColumnReorder:!0,gridMenu:{onCommand:(e,t)=>{t.command==="toggle-preheader"&&this.clearGrouping()}},draggableGrouping:{dropPlaceHolderText:"Drop a column header here to group by the column",deleteIconCssClass:"mdi mdi-close text-color-danger",sortAscIconCssClass:"mdi mdi-arrow-up",sortDescIconCssClass:"mdi mdi-arrow-down",onGroupChanged:(e,t)=>this.onGroupChanged(t),onExtensionRegistered:e=>this.draggableGroupingPlugin=e},darkMode:this._darkMode,enableTextExport:!0,enableExcelExport:!0,excelExportOptions:{sanitizeDataExport:!0},textExportOptions:{sanitizeDataExport:!0},externalResources:[this.excelExportService,this.textExportService]}}loadData(e){const t=[];for(let o=0;o<e;o++){const i=2e3+Math.floor(Math.random()*10),a=Math.floor(Math.random()*11),s=Math.floor(Math.random()*29),c=Math.round(Math.random()*100),p=Math.round(Math.random()*1e4)/100;t[o]={id:"id_"+o,num:o,title:"Task "+o,duration:Math.round(Math.random()*100)+"",percentComplete:c,percentCompleteNumber:c,start:new Date(i,a,s),finish:new Date(i,a+1,s),cost:o%33===0?-p:p,effortDriven:o%5===0}}this.dataset=t}clearGroupsAndSelects(){this.clearGroupingSelects(),this.clearGrouping()}clearGroupingSelects(){this.selectedGroupingFields.forEach((e,t)=>this.selectedGroupingFields[t]=""),this.selectedGroupingFields=[...this.selectedGroupingFields]}clearGrouping(e=!0){var t,o;(t=this.draggableGroupingPlugin)==null||t.clearDroppedGroups(),e&&((o=this.gridObj)==null||o.invalidate())}collapseAllGroups(){this.dataviewObj.collapseAllGroups()}expandAllGroups(){this.dataviewObj.expandAllGroups()}exportToExcel(){this.excelExportService.exportToExcel({filename:"Export",format:B.xlsx})}groupByDurationOrderByCount(e=!1){var t,o,i;if(this.durationOrderByCount=e,this.clearGrouping(!1),(t=this.draggableGroupingPlugin)!=null&&t.setDroppedGroups){this.showPreHeader(),this.draggableGroupingPlugin.setDroppedGroups("duration");const a=e?[]:[{columnId:"duration",sortAsc:!0}];(o=this.gridObj)==null||o.setSortColumns(a),(i=this.gridObj)==null||i.invalidate()}}groupByDurationEffortDriven(){var e,t;this.clearGrouping(!1),(e=this.draggableGroupingPlugin)!=null&&e.setDroppedGroups&&(this.showPreHeader(),this.draggableGroupingPlugin.setDroppedGroups(["duration","effortDriven"]),(t=this.gridObj)==null||t.invalidate())}groupByFieldName(){if(this.clearGrouping(),this.draggableGroupingPlugin&&this.draggableGroupingPlugin.setDroppedGroups){this.showPreHeader();const e=this.selectedGroupingFields.filter(t=>t!=="");e.length===0?this.clearGrouping():this.draggableGroupingPlugin.setDroppedGroups(e),this.gridObj.invalidate()}}onGroupChanged(e){const t=(e==null?void 0:e.caller)??[],o=(e==null?void 0:e.groupColumns)??[];Array.isArray(this.selectedGroupingFields)&&Array.isArray(o)&&o.length>0?(this.selectedGroupingFields.forEach((i,a)=>{var s;return this.selectedGroupingFields[a]=((s=o[a])==null?void 0:s.getter)??""}),this.selectedGroupingFields=[...this.selectedGroupingFields]):o.length===0&&t==="remove-group"&&this.clearGroupingSelects()}showPreHeader(){this.gridObj.setPreHeaderPanelVisibility(!0)}setFiltersDynamically(){this.aureliaGrid.filterService.updateFilters([{columnId:"percentComplete",operator:">=",searchTerms:["55"]},{columnId:"cost",operator:"<",searchTerms:["80"]}])}setSortingDynamically(){this.aureliaGrid.sortService.updateSorting([{columnId:"percentComplete",direction:"ASC"}])}toggleDraggableGroupingRow(){this.clearGroupsAndSelects(),this.gridObj.setTopHeaderPanelVisibility(!this.gridObj.getOptions().showTopHeaderPanel)}toggleDarkMode(){var e;this._darkMode=!this._darkMode,this.toggleBodyBackground(),(e=this.aureliaGrid.slickGrid)==null||e.setOptions({darkMode:this._darkMode})}toggleBodyBackground(){this._darkMode?(document.querySelector(".panel-wm-content").classList.add("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="dark"):(document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light")}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}w=L();x=Q(w,0,"Example18",P,x);K(w,1,x);export{x as Example18};
//# sourceMappingURL=example18-g9RvbmJy.js.map
