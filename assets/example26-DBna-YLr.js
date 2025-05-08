import{C as $,B as E,O,z as F,r as R,a as g,G as W,F as m,H as D,J as z,b as v,d as j,c as q}from"./index-BEnHDSQL.js";import{E as p}from"./editors.index-mXwEHkpi.js";const T="example26",y=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example26.ts">
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
        <div class="col">
          <label class="radio-inline control-label" for="radioTrue">
            <input type="radio" name="inlineRadioOptions" id="radioTrue" checked value.bind="isAutoEdit"
                    click.trigger="setAutoEdit(true)"> ON
            (single-click)
          </label>
          <label class="radio-inline control-label" for="radioFalse">
            <input type="radio" name="inlineRadioOptions" id="radioFalse" value.bind="isAutoEdit"
                    click.trigger="setAutoEdit(false)"> OFF
            (double-click)
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="undo()">
            <i class="mdi mdi-undo"></i>
            Undo last edit(s)
          </button>
          <label class="checkbox-inline control-label" for="autoCommitEdit">
            <input type="checkbox" id="autoCommitEdit" data-test="auto-edit-checkbox" value.bind="gridOptions.autoCommitEdit"
                    click.trigger="changeAutoCommit()">
            Auto Commit Edit
          </label>
        </div>
      </div>
    </span>
    <div class="row" style="margin-top: 5px">
      <div class="col">
        <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters" click.trigger="aureliaGrid.filterService.clearFilters()">Clear
          Filters</button>
        <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-sorting" click.trigger="aureliaGrid.sortService.clearSorting()">Clear
          Sorting</button>
      </div>
    </div>
  </div>

  <div class="col-sm-6">
    <div class="alert alert-info" show.bind="updatedObject">
      <strong>Updated Item:</strong> \${updatedObject | stringify}
    </div>
    <div class="alert alert-warning" show.bind="alertWarning">
      \${alertWarning}
    </div>
  </div>
</div>

<div id="grid-container" class="col-sm-12">
  <aurelia-slickgrid grid-id="grid26"
                      column-definitions.bind="columnDefinitions"
                      grid-options.bind="gridOptions"
                      dataset.bind="dataset"
                      instances.bind="aureliaGrid"
                      on-cell-change.trigger="onCellChanged($event.detail.eventData, $event.detail.args)"
                      on-click.trigger="onCellClicked($event.detail.eventData, $event.detail.args)">
  </aurelia-slickgrid>
</div>
`,k=[],I={};let C;function H(i){C||(C=$.define({name:T,template:y,dependencies:k,bindables:I})),i.register(C)}const L=Object.freeze(Object.defineProperty({__proto__:null,bindables:I,default:y,dependencies:k,name:T,register:H,template:y},Symbol.toStringTag,{value:"Module"}));var Q=Object.defineProperty,N=(i,e,t)=>e in i?Q(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,h=(i,e,t)=>N(i,typeof e!="symbol"?e+"":e,t);class J{constructor(e){this.args=e,h(this,"aureliaViewModel"),h(this,"defaultId"),h(this,"defaultItem"),h(this,"selectedItem"),h(this,"grid"),h(this,"vm"),h(this,"elmBindingContext"),this.grid=e&&e.grid,this.init()}get aureliaUtilService(){var t,r,l,n;let e=(r=(t=this.gridOptions)==null?void 0:t.params)==null?void 0:r.aureliaUtilService;return(!e||!(e instanceof E))&&(e=(n=(l=this.columnEditor)==null?void 0:l.params)==null?void 0:n.aureliaUtilService),e}get collection(){var e,t;return((t=(e=this.columnDef)==null?void 0:e.editor)==null?void 0:t.collection)??[]}get columnDef(){var e;return((e=this.args)==null?void 0:e.column)??{}}get columnEditor(){var e;return((e=this.columnDef)==null?void 0:e.editor)??{}}get gridOptions(){var e;return((e=this.grid)==null?void 0:e.getOptions())??{}}get hasAutoCommitEdit(){return this.args.grid.getOptions().autoCommitEdit}get validator(){return this.columnEditor.validator||this.columnDef.validator}async init(){var e,t,r,l,n,a,s;if(!((t=(e=this.columnEditor)==null?void 0:e.params)!=null&&t.viewModel))throw new Error(`[Aurelia-Slickgrid] For the Editors.aureliaComponent to work properly, you need to fill in the "templateUrl" property of your Custom Element Editor.
      Example: this.columnDefs = [{ id: 'title', field: 'title', editor: { model: CustomEditor, collection: [...], param: { viewModel: MyVM } },`);if((l=(r=this.columnEditor)==null?void 0:r.params)!=null&&l.viewModel){const d={grid:this.grid,model:{collection:this.collection}},c=this.columnEditor.params.viewModel;this.vm=await this.aureliaUtilService.createAureliaViewModelAddToSlot(c,d,this.args.container),this.elmBindingContext=(s=(a=(n=this.vm)==null?void 0:n.controller)==null?void 0:a.children)==null?void 0:s[0].scope.bindingContext}}save(){const e=this.validate();e&&e.valid&&(this.hasAutoCommitEdit?this.args.grid.getEditorLock().commitCurrentEdit():this.args.commitChanges())}cancel(){var e;this.elmBindingContext&&(this.elmBindingContext.selectedItem=this.defaultItem),(e=this.args)!=null&&e.cancelChanges&&this.args.cancelChanges()}destroy(){var e,t;(t=(e=this.vm)==null?void 0:e.controller)==null||t.deactivate(this.vm.controller,null)}hide(){var e;(e=this.elmBindingContext)==null||e.hide()}show(){var e;(e=this.elmBindingContext)==null||e.focus()}focus(){var e;(e=this.elmBindingContext)==null||e.focus()}applyValue(e,t){e[this.columnDef.field]=t}getValue(){var e;return(e=this.elmBindingContext)==null?void 0:e.selectedItem.id}loadValue(e){const t=e==null?void 0:e[this.columnDef.field];this.selectedItem=t,this.defaultItem=t,window.setTimeout(()=>{this.focus(),this.elmBindingContext&&(this.elmBindingContext.selectedItem=t,this.elmBindingContext.selectedItemChanged=r=>{this.selectedItem=r,r!==t&&this.save()})},0)}serializeValue(){return this.selectedItem}isValueChanged(){return!(this.selectedItem.id===""&&(this.defaultId===null||this.defaultId===void 0))&&this.selectedItem.id!==this.defaultId}validate(){if(this.validator){const e=this.selectedItem.id;return this.validator(e,this.args)}return{valid:!0,msg:null}}}var Y=Object.defineProperty,K=(i,e,t)=>e in i?Y(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,u=(i,e,t)=>K(i,typeof e!="symbol"?e+"":e,t);class M{constructor(){u(this,"_shouldTriggerQuery",!0),u(this,"container"),u(this,"grid"),u(this,"searchTerms",[]),u(this,"columnDef"),u(this,"callback"),u(this,"operator",O.equal),u(this,"vm"),u(this,"elmBindingContext")}get aureliaUtilService(){var t,r,l,n;let e=(r=(t=this.gridOptions)==null?void 0:t.params)==null?void 0:r.aureliaUtilService;return(!e||!(e instanceof E))&&(e=(n=(l=this.columnFilter)==null?void 0:l.params)==null?void 0:n.aureliaUtilService),e}get collection(){var e;return((e=this.columnFilter)==null?void 0:e.collection)??[]}get columnFilter(){var e;return((e=this.columnDef)==null?void 0:e.filter)??{}}get gridOptions(){var e;return((e=this.grid)==null?void 0:e.getOptions())??{}}async init(e){var t,r,l,n,a;if(this.grid=e.grid,this.callback=e.callback,this.columnDef=e.columnDef,this.searchTerms=(e.hasOwnProperty("searchTerms")?e.searchTerms:[])||[],!((r=(t=this.columnFilter)==null?void 0:t.params)!=null&&r.viewModel))throw new Error(`[Aurelia-Slickgrid] For the Filters.aureliaComponent to work properly, you need to fill in the "viewModel" property of your Custom Element Filter.
      Example: this.columnDefs = [{ id: 'title', field: 'title', filter: { model: CustomFilter, collection: [...], param: { viewModel: MyVM } },`);if(this.columnFilter.params.viewModel){this.container=this.grid.getHeaderRowColumn(this.columnDef.id),F(this.container);const s={grid:this.grid,model:{collection:this.collection}},d=this.columnFilter.params.viewModel;this.vm=await this.aureliaUtilService.createAureliaViewModelAddToSlot(d,s,this.container),this.elmBindingContext=(a=(n=(l=this.vm)==null?void 0:l.controller)==null?void 0:n.children)==null?void 0:a[0].scope.bindingContext,this.elmBindingContext&&(this.elmBindingContext.selectedItemChanged=c=>{this.callback(void 0,{columnDef:this.columnDef,operator:this.operator,searchTerms:[c.id],shouldTriggerQuery:this._shouldTriggerQuery}),this._shouldTriggerQuery=!0})}}clear(e=!0){var t;this._shouldTriggerQuery=e,(t=this.elmBindingContext)!=null&&t.selectedItem&&(this.elmBindingContext.selectedItem={id:"",name:""})}destroy(){var e,t;(t=(e=this.vm)==null?void 0:e.controller)==null||t.deactivate(this.vm.controller,null),this.container=this.grid.getHeaderRowColumn(this.columnDef.id),F(this.container)}setValues(e){var t;(t=this.elmBindingContext)!=null&&t.selectedItem&&(this.elmBindingContext.selectedItem=e)}}var X=Object.create,_=Object.defineProperty,Z=Object.getOwnPropertyDescriptor,ee=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),B=i=>{throw TypeError(i)},G=(i,e,t)=>e in i?_(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,te=(i,e)=>_(i,"name",{value:e,configurable:!0}),ie=i=>[,,,X(null)],le=["class","method","getter","setter","accessor","field","value","get","set"],P=i=>i!==void 0&&typeof i!="function"?B("Function expected"):i,re=(i,e,t,r,l)=>({kind:le[i],name:e,metadata:r,addInitializer:n=>t._?B("Already initialized"):l.push(P(n||null))}),ne=(i,e)=>G(e,ee("metadata"),i[3]),ae=(i,e,t,r)=>{for(var l=0,n=i[e>>1],a=n&&n.length;l<a;l++)n[l].call(t);return r},oe=(i,e,t,r,l,n)=>{var a,s,d,c=e&7,S=!1,A=0,V=i[A]||(i[A]=[]),f=c&&(l=l.prototype,c<5&&(c>3||!S)&&Z(l,t));te(l,t);for(var b=r.length-1;b>=0;b--)d=re(c,t,s={},i[3],V),a=(0,r[b])(l,d),s._=1,P(a)&&(l=a);return ne(i,l),f&&_(l,t,f),S?c^4?n:f:l},o=(i,e,t)=>G(i,typeof e!="symbol"?e+"":e,t),U,x;const se=100;U=[q(L)];class w{constructor(e=R(E)){this.aureliaUtilService=e,o(this,"title","Example 26: Use of Aurelia Custom Elements"),o(this,"subTitle",`
  <h5>Filters, Editors, AsyncPostRender with Aurelia Custom Elements</h5>
  Grid with usage of Aurelia Custom Elements as Editor &amp; AsyncPostRender (similar to Formatter).
  <ul>
    <li>Support of Aurelia Custom Element as Custom Editor (click on any "Assignee" name cell)</li>
    <ul>
      <li>That column uses a simple select drodown wrapped in an Aurelia Custom Element</li>
      <li>Increased Grid Options "rowHeight" &amp; "headerRowHeight" to 45 so that the Custom Element fits in the cell.</li>
    </ul>
    <li>Support of Aurelia Custom Element as Custom Filter ("Assignee" columns), which also uses Custom Element</li>
    <li>The 2nd "Assignee" column (showing in bold text) uses "asyncPostRender" with an Aurelia Custom Element</li>
    <ul>
      <li>Why can't we use Aurelia Custom Element as Customer Formatter and why do I see a slight delay in loading the data?</li>
      <li>It's totally normal since SlickGrid Formatters only accept strings (synchronously),
      so we cannot use that (Aurelia requires at least 1 full cycle to render the element), so we are left with SlickGrid "asyncPostRender" and
      it works but as the name suggest it's async users might see noticeable delay in loading the data
      </li>
    </ul>
  </ul>
  `),o(this,"_commandQueue",[]),o(this,"aureliaGrid"),o(this,"gridOptions"),o(this,"columnDefinitions",[]),o(this,"dataset",[]),o(this,"updatedObject"),o(this,"hideSubTitle",!1),o(this,"isAutoEdit",!0),o(this,"alertWarning"),o(this,"assignees",[{id:"",name:""},{id:"1",name:"John"},{id:"2",name:"Pierre"},{id:"3",name:"Paul"}]),this.defineGrid()}attached(){this.dataset=this.mockData(se)}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",filterable:!0,sortable:!0,type:g.string,editor:{model:p.longText,minLength:5,maxLength:255},minWidth:100,onCellChange:(e,t)=>{console.log(t),this.alertWarning=`Updated Title: ${t.dataContext.title}`}},{id:"assignee",name:"Assignee",field:"assignee",minWidth:100,filterable:!0,sortable:!0,filter:{model:M,collection:this.assignees,params:{viewModel:D}},queryFieldFilter:"assignee.id",queryFieldSorter:"assignee.name",formatter:m.complexObject,params:{complexFieldLabel:"assignee.name"},exportWithFormatter:!0,editor:{model:J,collection:this.assignees,params:{viewModel:W}},onCellChange:(e,t)=>{console.log(t),this.alertWarning=`Updated Title: ${t.dataContext.title}`}},{id:"assignee2",name:"Assignee with Aurelia Component",field:"assignee",minWidth:125,filterable:!0,sortable:!0,filter:{model:M,collection:this.assignees,params:{viewModel:D}},queryFieldFilter:"assignee.id",queryFieldSorter:"assignee.name",formatter:()=>"...",asyncPostRender:this.renderAureliaComponent.bind(this),params:{viewModel:z,complexFieldLabel:"assignee.name"},exportCustomFormatter:m.complexObject},{id:"duration",name:"Duration (days)",field:"duration",filterable:!0,minWidth:100,sortable:!0,type:g.number,filter:{model:v.slider,filterOptions:{hideSliderNumber:!1}},editor:{model:p.slider,minValue:0,maxValue:100}},{id:"complete",name:"% Complete",field:"percentComplete",filterable:!0,formatter:m.multiple,type:g.number,editor:{enableRenderHtml:!0,collection:Array.from(Array(101).keys()).map(e=>({value:e,label:e,symbol:'<i class="mdi mdi-percent-outline" style="color:cadetblue"></i>'})),customStructure:{value:"value",label:"label",labelSuffix:"symbol"},collectionSortBy:{property:"label",sortDesc:!0},collectionFilterBy:{property:"value",value:0,operator:O.notEqual},model:p.singleSelect},minWidth:100,params:{formatters:[m.collectionEditor,m.percentCompleteBar]}},{id:"start",name:"Start",field:"start",filterable:!0,filter:{model:v.compoundDate},formatter:m.dateIso,sortable:!0,minWidth:100,type:g.date,editor:{model:p.date}},{id:"finish",name:"Finish",field:"finish",filterable:!0,filter:{model:v.compoundDate},formatter:m.dateIso,sortable:!0,minWidth:100,type:g.date,editor:{model:p.date}}],this.gridOptions={asyncEditorLoading:!1,autoEdit:this.isAutoEdit,autoCommitEdit:!1,autoResize:{container:"#demo-container",rightPadding:10},rowHeight:45,editable:!0,enableCellNavigation:!0,enableColumnPicker:!0,enableExcelCopyBuffer:!0,enableFiltering:!0,enableAsyncPostRender:!0,asyncPostRenderDelay:0,editCommandHandler:(e,t,r)=>{this._commandQueue.push(r),r.execute()},params:{aureliaUtilService:this.aureliaUtilService}}}mockData(e,t=0){const r=[];for(let l=t;l<t+e;l++){const n=2e3+Math.floor(Math.random()*10),a=Math.floor(Math.random()*11),s=Math.floor(Math.random()*29),d=Math.round(Math.random()*100);r.push({id:l,title:"Task "+l,assignee:l%3?this.assignees[2]:l%2?this.assignees[1]:this.assignees[0],duration:Math.round(Math.random()*100)+"",percentComplete:d,percentCompleteNumber:d,start:new Date(n,a,s),finish:new Date(n,a+1,s),effortDriven:l%5===0})}return r}onCellChanged(e,t){console.log("onCellChange",t),this.updatedObject={...t.item}}onCellClicked(e,t){const r=this.aureliaGrid.gridService.getColumnFromEventArguments(t);console.log(r),r.columnDef.id==="edit"?(this.alertWarning=`open a modal window to edit: ${r.dataContext.title}`,this.aureliaGrid.gridService.highlightRow(t.row,1500)):r.columnDef.id==="delete"&&confirm("Are you sure?")&&(this.aureliaGrid.gridService.deleteItemById(r.dataContext.id),this.alertWarning=`Deleted: ${r.dataContext.title}`)}onCellValidation(e,t){alert(t.validationResults.msg)}changeAutoCommit(){return this.gridOptions.autoCommitEdit=!this.gridOptions.autoCommitEdit,this.aureliaGrid.slickGrid.setOptions({autoCommitEdit:this.gridOptions.autoCommitEdit}),!0}renderAureliaComponent(e,t,r,l){if(l.params.viewModel&&e){const n={model:r,grid:this.aureliaGrid.slickGrid};this.aureliaUtilService.createAureliaViewModelAddToSlot(l.params.viewModel,n,e)}}setAutoEdit(e){return this.isAutoEdit=e,this.aureliaGrid.slickGrid.setOptions({autoEdit:e}),!0}undo(){const e=this._commandQueue.pop();e&&j.cancelCurrentEdit()&&(e.undo(),this.aureliaGrid.slickGrid.gotoCell(e.row,e.cell,!1))}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}x=ie();w=oe(x,0,"Example26",U,w);ae(x,1,w);export{w as Example26};
//# sourceMappingURL=example26-DBna-YLr.js.map
