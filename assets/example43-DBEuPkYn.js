import{C as B,c as C}from"./index-xBMUucNl.js";import{E as L}from"./excelExport.service-JbJncGy1.js";import{E as a}from"./editors.index-CQ9Y46Rw.js";import"./groupingFormatters.index-BW-M0DUZ.js";const T="example43",u=`<h2>
  Example 43: colspan/rowspan - Employees Timesheets
  <span class="float-end">
    <a
      style="font-size: 18px"
      target="_blank"
      href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example43.ts"
    >
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

<div class="subtitle" >
  <p class="italic example-details">
    <b>NOTES</b>: <code>rowspan</code> is an opt-in feature, because of its small perf hit (it needs to loop through all row
    metadatas to map all rowspan), and requires the <code>enableCellRowSpan</code> grid option to be enabled to work properly.
    The <code>colspan</code>/<code>rowspan</code> are both using DataView item metadata and are both based on row indexes and
    will <b>not</b> keep the row in sync with the data. It is really up to you the user to update the metadata logic of how and
    where the cells should span when a side effect kicks in. (i.e: Filtering/Sorting/Paging/Column Reorder... will
    <b>not</b> change/update the spanning in the grid by itself and that is why they these features are all disabled in this
    example). Also, column/row freezing (pinning) are also not supported, or at least not recommended unless you know exactly
    what you're doing (like in this demo here because we know our pinning doesn't intersect)! Any freezing column/row that could
    intersect with a <code>colspan</code>/<code>rowspan</code> <b>will cause problems</b>.
  </p>
</div>

<button
  class="ms-1 btn btn-outline-secondary btn-sm btn-icon"
  data-test="goto-up"
  click.trigger="navigateUp()"
  title="from an active cell, navigate to cell above"
>
  <span class="mdi mdi-chevron-down mdi-rotate-180"></span>
  Navigate Up Cell
</button>
<button
  class="ms-1 btn btn-outline-secondary btn-sm btn-icon"
  data-test="goto-down"
  click.trigger="navigateDown()"
  title="from an active cell, navigate to cell below"
>
  <span class="mdi mdi-chevron-down"></span>
  Navigate Down Cell
</button>
<button
  class="ms-1 btn btn-outline-secondary btn-sm btn-icon"
  data-test="goto-prev"
  click.trigger="navigatePrev()"
  title="from an active cell, navigate to previous left cell"
>
  <span class="mdi mdi-chevron-down mdi-rotate-90"></span>
  Navigate to Left Cell
</button>
<button
  class="ms-1 btn btn-outline-secondary btn-sm btn-icon"
  data-test="goto-next"
  click.trigger="navigateNext()"
  title="from an active cell, navigate to next right cell"
>
  <span class="mdi mdi-chevron-down mdi-rotate-270"></span>
  Navigate to Right Cell
</button>
<button class="ms-2 btn btn-outline-secondary btn-sm btn-icon mx-1" data-test="toggle-employee-id" click.trigger="toggleEmployeeIdVisibility()">
  Show/Hide EmployeeID
</button>
<button class="ms-1 btn btn-outline-secondary btn-sm btn-icon mx-1" click.trigger="toggleEditing()" data-test="toggle-editing">
  <span class="mdi mdi-pencil-outline"></span>
  <span
    >Toggle Editing: <span id="isEditable" class="text-italic">\${ isEditable }</span></span
  >
</button>
<button class="btn btn-outline-secondary btn-sm btn-icon mx-1" data-test="export-excel-btn" click.trigger="exportToExcel()">
  <i class="mdi mdi-file-excel-outline text-success"></i> Export to Excel
</button>

<aurelia-slickgrid
  grid-id="grid43"
  column-definitions.bind="columnDefinitions"
  grid-options.bind="gridOptions"
  dataset.bind="dataset"
  instances.bind="aureliaGrid">
</aurelia-slickgrid>
`,x=[],w={};let p;function I(i){p||(p=B.define({name:T,template:u,dependencies:x,bindables:w})),i.register(p)}const A=Object.freeze(Object.defineProperty({__proto__:null,bindables:w,default:u,dependencies:x,name:T,register:I,template:u},Symbol.toStringTag,{value:"Module"}));var P=Object.create,g=Object.defineProperty,N=Object.getOwnPropertyDescriptor,G=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),D=i=>{throw TypeError(i)},M=(i,e,t)=>e in i?g(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,W=(i,e)=>g(i,"name",{value:e,configurable:!0}),O=i=>[,,,P(null)],z=["class","method","getter","setter","accessor","field","value","get","set"],E=i=>i!==void 0&&typeof i!="function"?D("Function expected"):i,R=(i,e,t,o,n)=>({kind:z[i],name:e,metadata:o,addInitializer:s=>t._?D("Already initialized"):n.push(E(s||null))}),j=(i,e)=>M(e,G("metadata"),i[3]),F=(i,e,t,o)=>{for(var n=0,s=i[e>>1],r=s&&s.length;n<r;n++)s[n].call(t);return o},V=(i,e,t,o,n,s)=>{var r,v,k,d=e&7,f=!1,y=0,_=i[y]||(i[y]=[]),c=d&&(n=n.prototype,d<5&&(d>3||!f)&&N(n,t));W(n,t);for(var m=o.length-1;m>=0;m--)k=R(d,t,v={},i[3],_),r=(0,o[m])(n,k),v._=1,E(r)&&(n=r);return j(i,n),c&&g(n,t,c),f?d^4?s:c:n},l=(i,e,t)=>M(i,typeof e!="symbol"?e+"":e,t),S,b;S=[C(A)];class h{constructor(){l(this,"aureliaGrid"),l(this,"gridOptions"),l(this,"columnDefinitions",[]),l(this,"dataset",[]),l(this,"isEditable",!1),l(this,"hideSubTitle",!1),l(this,"showEmployeeId",!0),l(this,"excelExportService",new L),l(this,"metadata",{0:{columns:{1:{rowspan:2},2:{colspan:2},6:{colspan:3},10:{colspan:3,rowspan:10},13:{colspan:2},17:{colspan:2,rowspan:2}}},1:{columns:{3:{colspan:3},6:{colspan:4},13:{colspan:2,rowspan:5},15:{colspan:2}}},2:{columns:{2:{colspan:3,rowspan:2},5:{colspan:2},7:{colspan:3},15:{colspan:2},17:{colspan:2}}},3:{columns:{6:{colspan:4},16:{colspan:2}}},4:{columns:{2:{colspan:4},7:{colspan:3},15:{colspan:2,rowspan:2},17:{colspan:2}}},5:{columns:{2:{colspan:2},4:{colspan:3},7:{colspan:3},17:{colspan:2}}},6:{columns:{2:{colspan:2},5:{colspan:2},7:{colspan:3},14:{colspan:2},16:{colspan:3}}},7:{columns:{2:{colspan:3},5:{colspan:3},13:{colspan:3,rowspan:2},16:{colspan:2}}},8:{columns:{2:{colspan:3},7:{colspan:3,rowspan:2},17:{colspan:2}}},9:{columns:{2:{colspan:3},5:{colspan:2},13:{colspan:3},16:{colspan:3}}}}),this.defineGrid()}attached(){this.dataset=this.loadData()}defineGrid(){this.columnDefinitions=[{id:"employeeID",name:"Employee ID",field:"employeeID",minWidth:100},{id:"employeeName",name:"Employee Name",field:"employeeName",editor:{model:a.text},minWidth:120},{id:"9:00",name:"9:00 AM",field:"9:00",editor:{model:a.text},minWidth:120},{id:"9:30",name:"9:30 AM",field:"9:30",editor:{model:a.text},minWidth:120},{id:"10:00",name:"10:00 AM",field:"10:00",editor:{model:a.text},minWidth:120},{id:"10:30",name:"10:30 AM",field:"10:30",editor:{model:a.text},minWidth:120},{id:"11:00",name:"11:00 AM",field:"11:00",editor:{model:a.text},minWidth:120},{id:"11:30",name:"11:30 AM",field:"11:30",editor:{model:a.text},minWidth:120},{id:"12:00",name:"12:00 PM",field:"12:00",editor:{model:a.text},minWidth:120},{id:"12:30",name:"12:30 PM",field:"12:30",editor:{model:a.text},minWidth:120},{id:"1:00",name:"1:00 PM",field:"1:00",editor:{model:a.text},minWidth:120},{id:"1:30",name:"1:30 PM",field:"1:30",editor:{model:a.text},minWidth:120},{id:"2:00",name:"2:00 PM",field:"2:00",editor:{model:a.text},minWidth:120},{id:"2:30",name:"2:30 PM",field:"2:30",editor:{model:a.text},minWidth:120},{id:"3:00",name:"3:00 PM",field:"3:00",editor:{model:a.text},minWidth:120},{id:"3:30",name:"3:30 PM",field:"3:30",editor:{model:a.text},minWidth:120},{id:"4:00",name:"4:00 PM",field:"4:00",editor:{model:a.text},minWidth:120},{id:"4:30",name:"4:30 PM",field:"4:30",editor:{model:a.text},minWidth:120},{id:"5:00",name:"5:00 PM",field:"5:00",editor:{model:a.text},minWidth:120}],this.gridOptions={autoResize:{bottomPadding:30,rightPadding:50},enableCellNavigation:!0,enableColumnReorder:!0,enableCellRowSpan:!0,enableHeaderMenu:!1,enableExcelExport:!0,externalResources:[this.excelExportService],enableExcelCopyBuffer:!0,autoEdit:!0,editable:!1,datasetIdPropertyName:"employeeID",frozenColumn:0,gridHeight:348,rowHeight:30,dataView:{globalItemMetadataProvider:{getRowMetadata:(e,t)=>this.metadata[t]}},rowTopOffsetRenderType:"top"}}exportToExcel(){this.excelExportService.exportToExcel({filename:"export",format:"xlsx"})}navigateDown(){var e,t;(t=(e=this.aureliaGrid)==null?void 0:e.slickGrid)==null||t.navigateDown()}navigateUp(){var e,t;(t=(e=this.aureliaGrid)==null?void 0:e.slickGrid)==null||t.navigateUp()}navigateNext(){var e,t;(t=(e=this.aureliaGrid)==null?void 0:e.slickGrid)==null||t.navigateNext()}navigatePrev(){var e,t;(t=(e=this.aureliaGrid)==null?void 0:e.slickGrid)==null||t.navigatePrev()}toggleEditing(){this.isEditable=!this.isEditable,this.aureliaGrid.slickGrid.setOptions({editable:this.isEditable})}loadData(){return[{employeeID:10001,employeeName:"Davolio","9:00":"Analysis Tasks","9:30":"Analysis Tasks","10:00":"Team Meeting","10:30":"Testing","11:00":"Development","11:30":"Development","12:00":"Development","12:30":"Support","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Testing","3:00":"Testing","3:30":"Development","4:00":"Conference","4:30":"Team Meeting","5:00":"Team Meeting"},{employeeID:10002,employeeName:"Buchanan","9:00":"Task Assign","9:30":"Support","10:00":"Support","10:30":"Support","11:00":"Testing","11:30":"Testing","12:00":"Testing","12:30":"Testing","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Development","3:00":"Development","3:30":"Check Mail","4:00":"Check Mail","4:30":"Team Meeting","5:00":"Team Meeting"},{employeeID:10003,employeeName:"Fuller","9:00":"Check Mail","9:30":"Check Mail","10:00":"Check Mail","10:30":"Analysis Tasks","11:00":"Analysis Tasks","11:30":"Support","12:00":"Support","12:30":"Support","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Development","3:00":"Development","3:30":"Team Meeting","4:00":"Team Meeting","4:30":"Development","5:00":"Development"},{employeeID:10004,employeeName:"Leverling","9:00":"Testing","9:30":"Check Mail","10:00":"Check Mail","10:30":"Support","11:00":"Testing","11:30":"Testing","12:00":"Testing","12:30":"Testing","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Development","3:00":"Development","3:30":"Check Mail","4:00":"Conference","4:30":"Conference","5:00":"Team Meeting"},{employeeID:10005,employeeName:"Peacock","9:00":"Task Assign","9:30":"Task Assign","10:00":"Task Assign","10:30":"Task Assign","11:00":"Check Mail","11:30":"Support","12:00":"Support","12:30":"Support","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Development","3:00":"Development","3:30":"Team Meeting","4:00":"Team Meeting","4:30":"Testing","5:00":"Testing"},{employeeID:10006,employeeName:"Janet","9:00":"Testing","9:30":"Testing","10:00":"Support","10:30":"Support","11:00":"Support","11:30":"Team Meeting","12:00":"Team Meeting","12:30":"Team Meeting","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Development","3:00":"Development","3:30":"Team Meeting","4:00":"Team Meeting","4:30":"Development","5:00":"Development"},{employeeID:10007,employeeName:"Suyama","9:00":"Analysis Tasks","9:30":"Analysis Tasks","10:00":"Testing","10:30":"Development","11:00":"Development","11:30":"Testing","12:00":"Testing","12:30":"Testing","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Support","3:00":"Build","3:30":"Build","4:00":"Check Mail","4:30":"Check Mail","5:00":"Check Mail"},{employeeID:10008,employeeName:"Robert","9:00":"Task Assign","9:30":"Task Assign","10:00":"Task Assign","10:30":"Development","11:00":"Development","11:30":"Development","12:00":"Testing","12:30":"Support","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Check Mail","3:00":"Check Mail","3:30":"Check Mail","4:00":"Team Meeting","4:30":"Team Meeting","5:00":"Build"},{employeeID:10009,employeeName:"Andrew","9:00":"Check Mail","9:30":"Team Meeting","10:00":"Team Meeting","10:30":"Support","11:00":"Testing","11:30":"Development","12:00":"Development","12:30":"Development","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Check Mail","3:00":"Check Mail","3:30":"Check Mail","4:00":"Team Meeting","4:30":"Development","5:00":"Development"},{employeeID:10010,employeeName:"Michael","9:00":"Task Assign","9:30":"Task Assign","10:00":"Task Assign","10:30":"Analysis Tasks","11:00":"Analysis Tasks","11:30":"Development","12:00":"Development","12:30":"Development","1:00":"Lunch Break","1:30":"Lunch Break","2:00":"Lunch Break","2:30":"Testing","3:00":"Testing","3:30":"Testing","4:00":"Build","4:30":"Build","5:00":"Build"}]}toggleEmployeeIdVisibility(){const e={};this.showEmployeeId=!this.showEmployeeId;const t=this.showEmployeeId?1:-1;for(const o of Object.keys(this.metadata)){e[o]={columns:{}};for(const n of Object.keys(this.metadata[o].columns))e[o].columns[Number(n)+t]=this.metadata[o].columns[n]}this.showEmployeeId?this.columnDefinitions.unshift({id:"employeeID",name:"Employee ID",field:"employeeID",width:100}):this.columnDefinitions.splice(0,1),this.aureliaGrid.slickGrid.setColumns(this.columnDefinitions),this.metadata=e,this.aureliaGrid.slickGrid.remapAllColumnsRowSpan(),this.aureliaGrid.slickGrid.invalidate()}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}b=O();h=V(b,0,"Example43",S,h);F(b,1,h);export{h as Example43};
//# sourceMappingURL=example43-DBEuPkYn.js.map
