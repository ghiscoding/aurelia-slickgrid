import{C as R,a as d,b as G,F as g,S as z,i as A,c as V}from"./index-xBMUucNl.js";import{E as Y}from"./excelExport.service-JbJncGy1.js";import{A as C}from"./aggregators.index-Dr5ttK2D.js";import{r as u}from"./utilities-EkMJhzsL.js";import"./groupingFormatters.index-BW-M0DUZ.js";const F="example40",v=`<div class="demo40">
  <h2>
    Example 40: Infinite Scroll from JSON data
    <span class="float-end">
      <a style="font-size: 18px" target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example40.ts">
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

  <div class="subtitle">
    <ul>
      <li>
        Infinite scrolling allows the grid to lazy-load rows from the server when reaching the scroll bottom (end) position.
        In its simplest form, the more the user scrolls down, the more rows get loaded.
      </li>
      <li>NOTES: <code>presets.pagination</code> is not supported with Infinite Scroll and will revert to the first page,
          simply because since we keep appending data, we always have to start from index zero (no offset).
      </li>
    </ul>
  </div>

  <div class="row">
    <div class="col-sm-12">
      <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters-sorting"
              click.trigger="clearAllFiltersAndSorts()" title="Clear all Filters & Sorts">
        <span class="mdi mdi-close"></span>
        <span>Clear all Filter & Sorts</span>
      </button>
      <button class="btn btn-outline-secondary btn-sm" data-test="set-dynamic-filter" click.trigger="setFiltersDynamically()">
        Set Filters Dynamically
      </button>
      <button class="btn btn-outline-secondary btn-sm" data-test="set-dynamic-sorting" click.trigger="setSortingDynamically()">
        Set Sorting Dynamically
      </button>
      <button class="btn btn-outline-secondary btn-sm" data-test="group-by-duration" click.trigger="groupByDuration()">
        Group by Duration
      </button>

      <label class="ml-4">Reset Dataset <code>onSort</code>:</label>
      <button class="btn btn-outline-secondary btn-sm" data-test="onsort-on" click.trigger="onSortReset(true)">
        ON
      </button>
      <button class="btn btn-outline-secondary btn-sm" data-test="onsort-off" click.trigger="onSortReset(false)">
        OFF
      </button>
    </div>
  </div>

  <div show.bind="metrics" class="mt-2" style="margin: 10px 0px">
    <b>Metrics:</b>
    <span>
    <span>\${metrics.endTime | dateFormat: 'DD MMM, h:mm:ss a'}</span> —
      <span data-test="totalItemCount">\${metrics.totalItemCount}</span>
      items
    </span>
  </div>

  <aurelia-slickgrid
    grid-id="grid40"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset"
    instances.bind="aureliaGrid"
    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
    on-row-count-changed.trigger="handleOnRowCountChanged($event.detail.args)"
    on-sort.trigger="handleOnSort()"
    on-scroll.trigger="handleOnScroll($event.detail.args)">
  </aurelia-slickgrid>
</div>
`,x=[],I={};let f;function N(e){f||(f=R.define({name:F,template:v,dependencies:x,bindables:I})),e.register(f)}const P=Object.freeze(Object.defineProperty({__proto__:null,bindables:I,default:v,dependencies:x,name:F,register:N,template:v},Symbol.toStringTag,{value:"Module"}));var $=Object.create,y=Object.defineProperty,W=Object.getOwnPropertyDescriptor,j=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),O=e=>{throw TypeError(e)},T=(e,t,i)=>t in e?y(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,H=(e,t)=>y(e,"name",{value:t,configurable:!0}),B=e=>[,,,$(null)],q=["class","method","getter","setter","accessor","field","value","get","set"],k=e=>e!==void 0&&typeof e!="function"?O("Function expected"):e,J=(e,t,i,n,r)=>({kind:q[e],name:t,metadata:n,addInitializer:a=>i._?O("Already initialized"):r.push(k(a||null))}),L=(e,t)=>T(t,j("metadata"),e[3]),Z=(e,t,i,n)=>{for(var r=0,a=e[t>>1],o=a&&a.length;r<o;r++)a[r].call(i);return n},K=(e,t,i,n,r,a)=>{var o,s,p,c=t&7,w=!1,D=0,M=e[D]||(e[D]=[]),b=c&&(r=r.prototype,c<5&&(c>3||!w)&&W(r,i));H(r,i);for(var h=n.length-1;h>=0;h--)p=J(c,i,s={},e[3],M),o=(0,n[h])(r,p),s._=1,k(o)&&(r=o);return L(e,r),b&&y(r,i,b),w?c^4?a:b:r},l=(e,t,i)=>T(e,typeof t!="symbol"?t+"":t,i),E,_;const m=50;E=[V(P)];class S{constructor(){l(this,"aureliaGrid"),l(this,"columnDefinitions"),l(this,"dataset",[]),l(this,"gridOptions"),l(this,"metrics"),l(this,"hideSubTitle",!1),l(this,"shouldResetOnSort",!1),this.defineGrid(),this.dataset=this.loadData(0,m),this.metrics={itemCount:m,totalItemCount:m}}aureliaGridReady(t){this.aureliaGrid=t}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",sortable:!0,minWidth:100,filterable:!0},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,minWidth:100,filterable:!0,type:d.number},{id:"percentComplete",name:"% Complete",field:"percentComplete",sortable:!0,minWidth:100,filterable:!0,type:d.number},{id:"start",name:"Start",field:"start",type:d.date,outputType:d.dateIso,formatter:g.date,exportWithFormatter:!0,params:{dateFormat:"MMM DD, YYYY"},sortable:!0,filterable:!0,filter:{model:G.compoundDate}},{id:"finish",name:"Finish",field:"finish",type:d.date,outputType:d.dateIso,formatter:g.date,exportWithFormatter:!0,params:{dateFormat:"MMM DD, YYYY"},sortable:!0,filterable:!0,filter:{model:G.compoundDate}},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",sortable:!0,minWidth:100,filterable:!0,formatter:g.checkmarkMaterial}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableAutoResize:!0,enableFiltering:!0,enableGrouping:!0,editable:!1,rowHeight:33,enableExcelExport:!0,externalResources:[new Y]}}handleOnScroll(t){var n,r;const i=t.grid.getViewportNode();if(["mousewheel","scroll"].includes(t.triggeredBy||"")&&i.scrollTop>0&&Math.ceil(i.offsetHeight+t.scrollTop)>=t.scrollHeight){console.log("onScroll end reached, add more items");const a=((n=this.aureliaGrid.dataView)==null?void 0:n.getItemCount())||0,o=this.loadData(a,m);(r=this.aureliaGrid.dataView)==null||r.addItems(o)}}handleOnSort(){var t,i,n;if(this.shouldResetOnSort){const r=this.loadData(0,m);(t=this.aureliaGrid.slickGrid)==null||t.scrollTo(0),(i=this.aureliaGrid.dataView)==null||i.setItems(r),(n=this.aureliaGrid.dataView)==null||n.reSort()}}groupByDuration(){var t,i,n,r,a,o;(i=(t=this.aureliaGrid)==null?void 0:t.dataView)==null||i.setGrouping({getter:"duration",formatter:s=>`Duration: ${s.value} <span class="text-green">(${s.count} items)</span>`,comparer:(s,p)=>z.numeric(s.value,p.value,A.asc),aggregators:[new C.Avg("percentComplete"),new C.Sum("cost")],aggregateCollapsed:!1,lazyTotalsCalculation:!0}),(r=(n=this.aureliaGrid)==null?void 0:n.slickGrid)==null||r.setSortColumns([{columnId:"duration",sortAsc:!0}]),(o=(a=this.aureliaGrid)==null?void 0:a.slickGrid)==null||o.invalidate()}loadData(t,i){const n=[];for(let r=t;r<t+i;r++)n.push(this.newItem(r));return n}newItem(t){return{id:t,title:"Task "+t,duration:Math.round(Math.random()*100)+"",percentComplete:u(1,12),start:new Date(2020,u(1,11),u(1,28)),finish:new Date(2022,u(1,11),u(1,28)),effortDriven:t%5===0}}onSortReset(t){this.shouldResetOnSort=t}clearAllFiltersAndSorts(){var t;(t=this.aureliaGrid)!=null&&t.gridService&&this.aureliaGrid.gridService.clearAllFiltersAndSorts()}setFiltersDynamically(){var t;(t=this.aureliaGrid)==null||t.filterService.updateFilters([{columnId:"start",searchTerms:["2020-08-25"],operator:"<="}])}handleOnRowCountChanged(t){var i,n;this.aureliaGrid&&(t==null?void 0:t.current)>=0&&((i=this.aureliaGrid.dataView)==null||i.reSort(),this.metrics.itemCount=((n=this.aureliaGrid.dataView)==null?void 0:n.getFilteredItemCount())||0,this.metrics.totalItemCount=t.itemCount||0)}setSortingDynamically(){var t;(t=this.aureliaGrid)==null||t.sortService.updateSorting([{columnId:"title",direction:"DESC"}])}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const t=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[t]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}_=B();S=K(_,0,"Example40",E,S);Z(_,1,S);export{S as Example40};
//# sourceMappingURL=example40-BWYZrwza.js.map
