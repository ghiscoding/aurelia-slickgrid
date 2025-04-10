import{C as G,r as P,I as R,a as u,O as g,b as m,F as h,f,c as W}from"./index-CATZt-GI.js";import{a as b}from"./addDay-iynWzXZK.js";import{S as $}from"./slickCustomTooltip-CgtbbxW0.js";import{E as A}from"./excelExport.service-CSmXGqy6.js";import{C as z}from"./custom-inputFilter-GCZ0DNgI.js";import"./groupingFormatters.index-CHREWoSu.js";const x="example23",_=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example23.ts">
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
  <b>Metrics:</b>
  \${metrics.endTime | dateFormat: 'DD MMM, h:mm:ss a'} | \${metrics.itemCount} of \${metrics.totalItemCount} items
</span>

<div class="row row-cols-lg-auto g-1 align-items-center">
  <div class="col">
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters"
            click.trigger="aureliaGrid.filterService.clearFilters()">
      Clear Filters
    </button>
  </div>
  <div class="col">
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-sorting"
            click.trigger="aureliaGrid.sortService.clearSorting()">
      Clear Sorting
    </button>
  </div>
  <div class="col">
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-filter"
            click.trigger="setFiltersDynamically()">
      Set Filters Dynamically
    </button>
  </div>
  <div class="col">
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-sorting"
            click.trigger="setSortingDynamically()">
      Set Sorting Dynamically
    </button>
  </div>
  <div class="col">
    <label for="selectedFilter" style="margin-left: 10px">Predefined Filters</label>
  </div>
  <div class="col">
    <select name="selectedFilter" class="form-select" data-test="select-dynamic-filter"
            value.bind="selectedPredefinedFilter" change.trigger="predefinedFilterChanged(selectedPredefinedFilter)">
      <option model.bind="filter.value" repeat.for="filter of filterList">\${filter.label}</option>
    </select>
  </div>
</div>

<div class="row mt-2">
  <div class="col">
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="language" click.trigger="switchLanguage()">
      <i class="mdi mdi-translate"></i>
      Switch Language
    </button>
    <b>Locale:</b> <span style="font-style: italic" data-test="selected-locale">\${selectedLanguage + '.json'}</span>
  </div>
</div>

<aurelia-slickgrid grid-id="grid23"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    instances.bind="aureliaGrid"
                    on-grid-state-changed.trigger="gridStateChanged($event.detail)"
                    on-row-count-changed.trigger="refreshMetrics($event.detail.eventData, $event.detail.args)">
</aurelia-slickgrid>
`,I=[],k={};let S;function N(i){S||(S=G.define({name:x,template:_,dependencies:I,bindables:k})),i.register(S)}const K=Object.freeze(Object.defineProperty({__proto__:null,bindables:k,default:_,dependencies:I,name:x,register:N,template:_},Symbol.toStringTag,{value:"Module"}));var j=Object.create,T=Object.defineProperty,B=Object.getOwnPropertyDescriptor,H=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),Y=i=>{throw TypeError(i)},E=(i,e,t)=>e in i?T(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,V=(i,e)=>T(i,"name",{value:e,configurable:!0}),q=i=>[,,,j(null)],U=["class","method","getter","setter","accessor","field","value","get","set"],M=i=>i!==void 0&&typeof i!="function"?Y("Function expected"):i,X=(i,e,t,n,r)=>({kind:U[i],name:e,metadata:n,addInitializer:a=>t._?Y("Already initialized"):r.push(M(a||null))}),J=(i,e)=>E(e,H("metadata"),i[3]),Q=(i,e,t,n)=>{for(var r=0,a=i[e>>1],s=a&&a.length;r<s;r++)a[r].call(t);return n},Z=(i,e,t,n,r,a)=>{var s,o,d,c=e&7,F=!1,C=0,O=i[C]||(i[C]=[]),v=c&&(r=r.prototype,c<5&&(c>3||!F)&&B(r,t));V(r,t);for(var y=n.length-1;y>=0;y--)d=X(c,t,o={},i[3],O),s=(0,n[y])(r,d),o._=1,M(s)&&(r=s);return J(i,r),v&&T(r,t,v),F?c^4?a:v:r},l=(i,e,t)=>E(i,typeof e!="symbol"?e+"":e,t),L,w;const ee=1500;function p(i,e){return Math.floor(Math.random()*(e-i+1)+i)}const te=(i,e,t,n,r,a)=>{const o=a.getOptions().i18n;return(o==null?void 0:o.tr("TASK_X",{x:t}))??""};L=[W(K)];class D{constructor(e=P(R)){this.i18n=e,l(this,"title","Example 23: Filtering from Range of Search Values"),l(this,"subTitle",`
    This demo shows how to use Filters with Range of Search Values (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/column-functionalities/filters/range-filters" target="_blank">Wiki docs</a>)
    <br/>
    <ul class="small">
      <li>All input filters support the following operators: (>, >=, <, <=, <>, !=, =, ==, *) and now also the (..) for an input range</li>
      <li>All filters (which support ranges) can be defined via the 2 dots (..) which represents a range, this also works for dates and slider in the "presets"</li>
      <ul>
        <li>For a numeric range defined in an input filter (must be of type text), you can use 2 dots (..) to represent a range</li>
        <li>example: typing "10..90" will filter values between 10 and 90 (but excluding the number 10 and 90)</li>
      </ul>
    </ul>
  `),l(this,"aureliaGrid"),l(this,"columnDefinitions",[]),l(this,"gridOptions"),l(this,"dataset",[]),l(this,"hideSubTitle",!1),l(this,"selectedLanguage"),l(this,"metrics"),l(this,"filterList",[{value:"",label:""},{value:"currentYearTasks",label:"Current Year Completed Tasks"},{value:"nextYearTasks",label:"Next Year Active Tasks"}]),l(this,"selectedPredefinedFilter",""),this.defineGrid();const t="en";this.i18n.setLocale(t),this.selectedLanguage=t}attached(){this.dataset=this.mockData(ee)}detaching(){this.saveCurrentGridState()}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"id",nameKey:"TITLE",minWidth:100,formatter:te,sortable:!0,filterable:!0,params:{useFormatterOuputToFilter:!0}},{id:"description",name:"Description",field:"description",filterable:!0,sortable:!0,minWidth:80,type:u.string,filter:{model:z,enableTrimWhiteSpace:!0}},{id:"percentComplete",name:"% Complete",field:"percentComplete",nameKey:"PERCENT_COMPLETE",minWidth:120,sortable:!0,customTooltip:{position:"center"},formatter:h.progressBar,type:u.number,filterable:!0,filter:{model:m.sliderRange,maxValue:100,operator:g.rangeInclusive,filterOptions:{hideSliderNumbers:!1,min:0,step:5}}},{id:"start",name:"Start",field:"start",nameKey:"START",formatter:h.dateIso,sortable:!0,minWidth:75,width:100,exportWithFormatter:!0,type:u.date,filterable:!0,filter:{model:m.compoundDate}},{id:"finish",name:"Finish",field:"finish",nameKey:"FINISH",formatter:h.dateIso,sortable:!0,minWidth:75,width:120,exportWithFormatter:!0,type:u.date,filterable:!0,filter:{model:m.dateRange}},{id:"duration",field:"duration",nameKey:"DURATION",maxWidth:90,type:u.number,sortable:!0,filterable:!0,filter:{model:m.input,operator:g.rangeExclusive}},{id:"completed",name:"Completed",field:"completed",nameKey:"COMPLETED",minWidth:85,maxWidth:90,formatter:h.checkmarkMaterial,exportWithFormatter:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:m.singleSelect,filterOptions:{autoAdjustDropHeight:!0}}}];const e=f(b(new Date,-2),"YYYY-MM-DD"),t=f(b(new Date,25),"YYYY-MM-DD");this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableExcelCopyBuffer:!0,enableFiltering:!0,enableTranslate:!0,i18n:this.i18n,presets:{filters:[{columnId:"duration",searchTerms:["4..88"]},{columnId:"percentComplete",operator:"RangeInclusive",searchTerms:[5,80]},{columnId:"finish",operator:"RangeInclusive",searchTerms:[e,t]}],sorters:[{columnId:"percentComplete",direction:"DESC"},{columnId:"duration",direction:"ASC"}]},externalResources:[new $,new A]}}mockData(e,t=0){const n=[];for(let r=t;r<t+e;r++){const a=p(0,365),s=p(new Date().getFullYear(),new Date().getFullYear()+1),o=p(0,12),d=p(10,28),c=p(0,100);n.push({id:r,title:"Task "+r,description:r%5?"desc "+r:null,duration:a,percentComplete:c,percentCompleteNumber:c,start:r%4?null:new Date(s,o,d),finish:new Date(s,o,d),completed:c===100})}return n}clearFilters(){this.selectedPredefinedFilter="",this.aureliaGrid.filterService.clearFilters()}gridStateChanged(e){console.log("Client sample, Grid State changed:: ",e)}saveCurrentGridState(){console.log("Client sample, current Grid State:: ",this.aureliaGrid.gridStateService.getCurrentGridState())}refreshMetrics(e,t){t&&t.current>=0&&window.setTimeout(()=>{this.metrics={startTime:new Date,itemCount:t&&t.current||0,totalItemCount:this.dataset.length||0}})}setFiltersDynamically(){const e=f(b(new Date,-5),"YYYY-MM-DD"),t=f(b(new Date,25),"YYYY-MM-DD");this.aureliaGrid.filterService.updateFilters([{columnId:"duration",searchTerms:["14..78"],operator:"RangeInclusive"},{columnId:"percentComplete",operator:"RangeExclusive",searchTerms:[15,85]},{columnId:"finish",operator:"RangeInclusive",searchTerms:[e,t]}])}setSortingDynamically(){this.aureliaGrid.sortService.updateSorting([{columnId:"finish",direction:"DESC"},{columnId:"percentComplete",direction:"ASC"}])}async switchLanguage(){const e=this.selectedLanguage==="en"?"fr":"en";await this.i18n.setLocale(e),this.selectedLanguage=e}predefinedFilterChanged(e){let t=[];const n=new Date().getFullYear();switch(e){case"currentYearTasks":t=[{columnId:"finish",operator:g.rangeInclusive,searchTerms:[`${n}-01-01`,`${n}-12-31`]},{columnId:"completed",operator:g.equal,searchTerms:[!0]}];break;case"nextYearTasks":t=[{columnId:"start",operator:">=",searchTerms:[`${n+1}-01-01`]}];break}this.aureliaGrid.filterService.updateFilters(t)}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}w=q();D=Z(w,0,"Example23",L,D);Q(w,1,D);export{D as Example23};
//# sourceMappingURL=example23-BVFrQ66x.js.map
