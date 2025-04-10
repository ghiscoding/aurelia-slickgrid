import{C as G,F as c,a as u,b as g,K as A,c as P}from"./index-CATZt-GI.js";import{E as M}from"./excelExport.service-CSmXGqy6.js";import"./groupingFormatters.index-CHREWoSu.js";const T="example27",v=`<h2>
  <span innerhtml.bind="title"></span>
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example27.ts">
      <span class="mdi mdi-link mdi-v-align-sub"></span> code
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

<div class="row" style="margin-bottom: 4px;">
  <div class="col-md-12">
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="add-500-rows-btn" click.trigger="loadData(500)">
      500 rows
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="add-50k-rows-btn" click.trigger="loadData(25000)">
      25k rows
    </button>
    <button click.trigger="dynamicallyChangeFilter()" class="btn btn-outline-secondary btn-xs btn-icon"
            data-test="change-filter-dynamically">
      <span class="mdi mdi-filter-outline"></span>
      <span>Dynamically Change Filter (% complete &lt; 40)</span>
    </button>
    <button click.trigger="collapseAllWithoutEvent()" class="btn btn-outline-secondary btn-xs btn-icon"
            data-test="collapse-all-noevent-btn">
      <span class="mdi mdi-arrow-collapse"></span>
      <span>Collapse All (without triggering event)</span>
    </button>
    <button click.trigger="dynamicallyToggledFirstParent()" class="btn btn-outline-secondary btn-xs btn-icon"
            data-test="dynamically-toggle-first-parent-btn">
      <span>Dynamically Toggle First Parent</span>
    </button>
    <button click.trigger="reapplyToggledItems()" data-test="reapply-toggled-items-btn"
            class="btn btn-outline-secondary btn-xs btn-icon"
            disabled.bind="hasNoExpandCollapseChanged">
      <span class="mdi mdi-history"></span>
      <span>Reapply Previous Toggled Items</span>
    </button>
    <div class.bind="loadingClass"></div>
  </div>
</div>

<div class="row">
  <div class="col-md-12">
    <button click.trigger="addNewRow()" data-test="add-item-btn" class="btn btn-primary btn-xs btn-icon">
      <span class="mdi mdi-plus color-white"></span>
      <span>Add New Item to "Task 1" group</span>
    </button>
    <button click.trigger="updateFirstRow()" data-test="update-item-btn" class="btn btn-outline-secondary btn-xs btn-icon">
      <span class="icon mdi mdi-pencil"></span>
      <span>Update 1st Row Item</span>
    </button>
    <button click.trigger="collapseAll()" data-test="collapse-all-btn" class="btn btn-outline-secondary btn-xs btn-icon">
      <span class="mdi mdi-arrow-collapse"></span>
      <span>Collapse All</span>
    </button>
    <button click.trigger="expandAll()" data-test="expand-all-btn" class="btn btn-outline-secondary btn-xs btn-icon">
      <span class="mdi mdi-arrow-expand"></span>
      <span>Expand All</span>
    </button>
    <button click.trigger="logFlatStructure()" class="btn btn-outline-secondary btn-xs btn-icon"
            title="console.log of the Flat dataset">
      <span>Log Flat Structure</span>
    </button>
    <button click.trigger="logHierarchicalStructure()" class="btn btn-outline-secondary btn-xs btn-icon"
            title="console.log of the Hierarchical Tree dataset">
      <span>Log Hierarchical Structure</span>
    </button>
  </div>
</div>

<br />

<div id="grid-container" class="col-sm-12">
  <aurelia-slickgrid grid-id="grid27"
                      column-definitions.bind="columnDefinitions"
                      grid-options.bind="gridOptions"
                      dataset.bind="dataset"
                      instances.bind="aureliaGrid"
                      on-before-filter-change.trigger="showSpinner()"
                      on-filter-changed.trigger="hideSpinner()"
                      on-before-filter-clear.trigger="showSpinner()"
                      on-filter-cleared.trigger="hideSpinner()"
                      on-before-sort-change.trigger="showSpinner()"
                      on-sort-changed.trigger="hideSpinner()"
                      on-before-toggle-tree-collapse.trigger="showSpinner()"
                      on-toggle-tree-collapsed.trigger="hideSpinner()"
                      on-tree-full-toggle-start.trigger="showSpinner()"
                      on-tree-full-toggle-end.trigger="handleOnTreeFullToggleEnd($event.detail)"
                      on-tree-item-toggled.trigger="handleOnTreeItemToggled($event.detail)">
  </aurelia-slickgrid>
</div>
`,D=[],I={};let f;function O(n){f||(f=G.define({name:T,template:v,dependencies:D,bindables:I})),n.register(f)}const L=Object.freeze(Object.defineProperty({__proto__:null,bindables:I,default:v,dependencies:D,name:T,register:O,template:v},Symbol.toStringTag,{value:"Module"}));var W=Object.create,x=Object.defineProperty,H=Object.getOwnPropertyDescriptor,N=(n,e)=>(e=Symbol[n])?e:Symbol.for("Symbol."+n),_=n=>{throw TypeError(n)},S=(n,e,t)=>e in n?x(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,z=(n,e)=>x(n,"name",{value:e,configurable:!0}),R=n=>[,,,W(null)],V=["class","method","getter","setter","accessor","field","value","get","set"],E=n=>n!==void 0&&typeof n!="function"?_("Function expected"):n,$=(n,e,t,r,i)=>({kind:V[n],name:e,metadata:r,addInitializer:a=>t._?_("Already initialized"):i.push(E(a||null))}),B=(n,e)=>S(e,N("metadata"),n[3]),j=(n,e,t,r)=>{for(var i=0,a=n[e>>1],o=a&&a.length;i<o;i++)a[i].call(t);return r},q=(n,e,t,r,i,a)=>{var o,m,p,l=e&7,d=!1,C=0,k=n[C]||(n[C]=[]),h=l&&(i=i.prototype,l<5&&(l>3||!d)&&H(i,t));z(i,t);for(var b=r.length-1;b>=0;b--)p=$(l,t,m={},n[3],k),o=(0,r[b])(i,p),m._=1,E(o)&&(i=o);return B(n,i),h&&x(i,t,h),d?l^4?a:h:i},s=(n,e,t)=>S(n,typeof e!="symbol"?e+"":e,t),F,w;const Y=500;F=[P(L)];class y{constructor(){s(this,"title",'Example 27: Tree Data <small> <span class="mdi mdi-file-tree mdi-27px"></span> (from a flat dataset with <code>parentId</code> references - <a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/tree-data-grid" target="_blank">Wiki</a>)</small>'),s(this,"subTitle",`<ul>
    <li>It is assumed that your dataset will have Parent/Child references AND also Tree Level (indent) property.</li>
    <ul>
      <li>If you do not have the Tree Level (indent), you could call "convertParentChildArrayToHierarchicalView()" then call "convertHierarchicalViewToParentChildArray()"</li>
      <li>You could also pass the result of "convertParentChildArrayToHierarchicalView()" to "dataset-hierarchical.bind" as defined in the next Hierarchical Example</li>
    </ul>
  </ul>`),s(this,"aureliaGrid"),s(this,"gridOptions"),s(this,"columnDefinitions",[]),s(this,"dataset",[]),s(this,"datasetHierarchical",[]),s(this,"loadingClass",""),s(this,"hideSubTitle",!1),s(this,"isLargeDataset",!1),s(this,"hasNoExpandCollapseChanged",!0),s(this,"treeToggleItems",[]),this.defineGrid()}attached(){this.dataset=this.loadData(Y)}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",width:220,cssClass:"cell-title",filterable:!0,sortable:!0,exportWithFormatter:!1,queryFieldSorter:"id",type:u.string,formatter:c.tree,exportCustomFormatter:c.treeExport},{id:"duration",name:"Duration",field:"duration",minWidth:90,filterable:!0},{id:"percentComplete",name:"% Complete",field:"percentComplete",minWidth:120,maxWidth:200,exportWithFormatter:!1,sortable:!0,filterable:!0,filter:{model:g.compoundSlider,operator:">="},formatter:c.percentCompleteBarWithText,type:u.number},{id:"start",name:"Start",field:"start",minWidth:60,type:u.dateIso,filterable:!0,sortable:!0,filter:{model:g.compoundDate},formatter:c.dateIso},{id:"finish",name:"Finish",field:"finish",minWidth:60,type:u.dateIso,filterable:!0,sortable:!0,filter:{model:g.compoundDate},formatter:c.dateIso},{id:"effortDriven",name:"Effort Driven",width:80,minWidth:20,maxWidth:80,cssClass:"cell-effort-driven",field:"effortDriven",exportWithFormatter:!1,formatter:c.checkmarkMaterial,cannotTriggerInsert:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:g.singleSelect}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableAutoSizeColumns:!0,enableAutoResize:!0,enableFiltering:!0,enableTreeData:!0,treeDataOptions:{columnId:"title",parentPropName:"parentId",levelPropName:"treeLevel",indentMarginLeft:15,initiallyCollapsed:!0,titleFormatter:(e,t,r,i,a)=>{let o="";return a.treeLevel>0&&(o='<span class="mdi mdi-subdirectory-arrow-right mdi-v-align-sub color-se-secondary"></span>'),`${o}<span class="bold">${r}</span> <span style="font-size:11px; margin-left: 15px;">(parentId: ${a.parentId})</span>`}},multiColumnSort:!1,showCustomFooter:!0,headerRowHeight:45,rowHeight:40,presets:{filters:[{columnId:"percentComplete",searchTerms:[25],operator:">="}]},enableExcelExport:!0,excelExportOptions:{exportWithFormatter:!0,sanitizeDataExport:!0},externalResources:[new M],contextMenu:{iconCollapseAllGroupsCommand:"mdi mdi-arrow-collapse",iconExpandAllGroupsCommand:"mdi mdi-arrow-expand",iconClearGroupingCommand:"mdi mdi-close",iconCopyCellValueCommand:"mdi mdi-content-copy",iconExportCsvCommand:"mdi mdi-download",iconExportExcelCommand:"mdi mdi-file-excel-outline",iconExportTextDelimitedCommand:"mdi mdi-download"},gridMenu:{iconCssClass:"mdi mdi-menu",iconClearAllFiltersCommand:"mdi mdi-filter-remove-outline",iconClearAllSortingCommand:"mdi mdi-swap-vertical",iconExportCsvCommand:"mdi mdi-download",iconExportExcelCommand:"mdi mdi-file-excel-outline",iconExportTextDelimitedCommand:"mdi mdi-download",iconRefreshDatasetCommand:"mdi mdi-sync",iconToggleFilterCommand:"mdi mdi-flip-vertical",iconTogglePreHeaderCommand:"mdi mdi-flip-vertical"},headerMenu:{iconClearFilterCommand:"mdi mdi mdi-filter-remove-outline",iconClearSortCommand:"mdi mdi-swap-vertical",iconSortAscCommand:"mdi mdi-sort-ascending",iconSortDescCommand:"mdi mdi-flip-v mdi-sort-descending",iconColumnHideCommand:"mdi mdi-close"}}}addNewRow(){var r;const e=this.aureliaGrid.dataView.getItemCount(),t=(r=this.aureliaGrid.dataView)==null?void 0:r.getItemById(1);if(t!=null&&t.__hasChildren){const i={id:e,parentId:t.id,title:`Task ${e}`,duration:"1 day",percentComplete:99,start:new Date,finish:new Date,effortDriven:!1};this.aureliaGrid.gridService.addItem(i)}}updateFirstRow(){const e=this.aureliaGrid.dataView.getItemById(0);this.aureliaGrid.gridService.updateItem({...e,duration:"11 days",percentComplete:77,start:new Date,finish:new Date,effortDriven:!1})}collapseAll(){this.aureliaGrid.treeDataService.toggleTreeDataCollapse(!0)}collapseAllWithoutEvent(){this.aureliaGrid.treeDataService.toggleTreeDataCollapse(!0,!1)}expandAll(){this.aureliaGrid.treeDataService.toggleTreeDataCollapse(!1)}dynamicallyChangeFilter(){this.aureliaGrid.filterService.updateFilters([{columnId:"percentComplete",operator:"<",searchTerms:[40]}])}logHierarchicalStructure(){console.log("exploded array",this.aureliaGrid.treeDataService.datasetHierarchical)}logFlatStructure(){console.log("flat array",this.aureliaGrid.treeDataService.dataset)}hideSpinner(){window.setTimeout(()=>this.loadingClass="",200)}showSpinner(){this.isLargeDataset&&(this.loadingClass="mdi mdi-load mdi-spin-1s mdi-24px color-alt-success")}loadData(e){this.isLargeDataset=e>5e3;let t=0;const r=[],i=[];for(let a=0;a<e;a++){const o=2e3+Math.floor(Math.random()*10),m=Math.floor(Math.random()*11),p=Math.floor(Math.random()*29),l=i[a]={};let d;(a===1||a===0)&&(t=0,r.pop()),a===3?t=1:a===2||a===4||Math.random()>.8&&a>0&&t<3&&a-1!==0&&a-1!==2?(t++,r.push(a-1)):Math.random()<.3&&t>0&&(t--,r.pop()),r.length>0?d=r[r.length-1]:d=null,l.id=a,l.parentId=d,l.title=`Task ${a}`,l.duration="5 days",l.percentComplete=Math.round(Math.random()*100),l.start=new Date(o,m,p),l.finish=new Date(o,m+1,p),l.effortDriven=a%5===0}return this.dataset=i,i}handleOnTreeFullToggleEnd(e){console.log("Tree Data changes",e),this.hideSpinner()}handleOnTreeItemToggled(e){this.hasNoExpandCollapseChanged=!1,this.treeToggleItems=e.toggledItems,console.log("Tree Data changes",e)}handleOnGridStateChanged(e){var t,r,i,a;this.hasNoExpandCollapseChanged=!1,((t=e==null?void 0:e.change)==null?void 0:t.type)===A.treeData&&(console.log("Tree Data gridStateChange",(r=e==null?void 0:e.gridState)==null?void 0:r.treeData),this.treeToggleItems=(a=(i=e==null?void 0:e.gridState)==null?void 0:i.treeData)==null?void 0:a.toggledItems)}logTreeDataToggledItems(){console.log(this.aureliaGrid.treeDataService.getToggledItems())}dynamicallyToggledFirstParent(){const e="parentId",t="treeLevel",i=this.dataset.find(o=>o[t]===1),a=this.aureliaGrid.dataView.getItemByIdx(i[e]);i&&a&&this.aureliaGrid.treeDataService.dynamicallyToggleItemState([{itemId:a.id,isCollapsed:!a.__collapsed}])}reapplyToggledItems(){this.aureliaGrid.treeDataService.applyToggledItemStateChanges(this.treeToggleItems)}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}w=R();y=q(w,0,"Example27",F,y);j(w,1,y);export{y as Example27};
//# sourceMappingURL=example27-ioK6eG7B.js.map
