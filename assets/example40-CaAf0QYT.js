import{C as E,a as w,b as D,F as p,S as z,i as A,c as R}from"./index-CATZt-GI.js";import{A as G}from"./aggregators.index-oGMxsyHt.js";const C="example40",g=`<div class="demo40">
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
    on-row-count-changed.trigger="refreshMetrics($event.detail.args)"
    on-sort.trigger="handleOnSort()"
    on-scroll.trigger="handleOnScroll($event.detail.args)">
  </aurelia-slickgrid>
</div>
`,F=[],I={};let b;function P(i){b||(b=E.define({name:C,template:g,dependencies:F,bindables:I})),i.register(b)}const V=Object.freeze(Object.defineProperty({__proto__:null,bindables:I,default:g,dependencies:F,name:C,register:P,template:g},Symbol.toStringTag,{value:"Module"}));var $=Object.create,v=Object.defineProperty,N=Object.getOwnPropertyDescriptor,W=(i,t)=>(t=Symbol[i])?t:Symbol.for("Symbol."+i),M=i=>{throw TypeError(i)},O=(i,t,e)=>t in i?v(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,j=(i,t)=>v(i,"name",{value:t,configurable:!0}),H=i=>[,,,$(null)],B=["class","method","getter","setter","accessor","field","value","get","set"],k=i=>i!==void 0&&typeof i!="function"?M("Function expected"):i,q=(i,t,e,n,r)=>({kind:B[i],name:t,metadata:n,addInitializer:a=>e._?M("Already initialized"):r.push(k(a||null))}),J=(i,t)=>O(t,W("metadata"),i[3]),L=(i,t,e,n)=>{for(var r=0,a=i[t>>1],o=a&&a.length;r<o;r++)a[r].call(e);return n},Y=(i,t,e,n,r,a)=>{var o,s,u,d=t&7,y=!1,_=0,x=i[_]||(i[_]=[]),m=d&&(r=r.prototype,d<5&&(d>3||!y)&&N(r,e));j(r,e);for(var h=n.length-1;h>=0;h--)u=q(d,e,s={},i[3],x),o=(0,n[h])(r,u),s._=1,k(o)&&(r=o);return J(i,r),m&&v(r,e,m),y?d^4?a:m:r},l=(i,t,e)=>O(i,typeof t!="symbol"?t+"":t,e),T,S;const c=50;T=[R(V)];class f{constructor(){l(this,"aureliaGrid"),l(this,"columnDefinitions"),l(this,"dataset",[]),l(this,"gridOptions"),l(this,"metrics"),l(this,"hideSubTitle",!1),l(this,"shouldResetOnSort",!1),this.defineGrid(),this.dataset=this.loadData(0,c),this.metrics={itemCount:c,totalItemCount:c}}aureliaGridReady(t){this.aureliaGrid=t}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",sortable:!0,minWidth:100,filterable:!0},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,minWidth:100,filterable:!0,type:w.number},{id:"percentComplete",name:"% Complete",field:"percentComplete",sortable:!0,minWidth:100,filterable:!0,type:w.number},{id:"start",name:"Start",field:"start",formatter:p.dateIso,exportWithFormatter:!0,filterable:!0,filter:{model:D.compoundDate}},{id:"finish",name:"Finish",field:"finish",formatter:p.dateIso,exportWithFormatter:!0,filterable:!0,filter:{model:D.compoundDate}},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",sortable:!0,minWidth:100,filterable:!0,formatter:p.checkmarkMaterial}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableAutoResize:!0,enableFiltering:!0,enableGrouping:!0,editable:!1,rowHeight:33}}handleOnScroll(t){var n,r;const e=t.grid.getViewportNode();if(["mousewheel","scroll"].includes(t.triggeredBy||"")&&e.scrollTop>0&&Math.ceil(e.offsetHeight+t.scrollTop)>=t.scrollHeight){console.log("onScroll end reached, add more items");const a=((n=this.aureliaGrid.dataView)==null?void 0:n.getItemCount())||0,o=this.loadData(a,c);(r=this.aureliaGrid.dataView)==null||r.addItems(o)}}handleOnSort(){var t,e,n;if(this.shouldResetOnSort){const r=this.loadData(0,c);(t=this.aureliaGrid.slickGrid)==null||t.scrollTo(0),(e=this.aureliaGrid.dataView)==null||e.setItems(r),(n=this.aureliaGrid.dataView)==null||n.reSort()}}groupByDuration(){var t,e,n,r,a,o;(e=(t=this.aureliaGrid)==null?void 0:t.dataView)==null||e.setGrouping({getter:"duration",formatter:s=>`Duration: ${s.value} <span class="text-green">(${s.count} items)</span>`,comparer:(s,u)=>z.numeric(s.value,u.value,A.asc),aggregators:[new G.Avg("percentComplete"),new G.Sum("cost")],aggregateCollapsed:!1,lazyTotalsCalculation:!0}),(r=(n=this.aureliaGrid)==null?void 0:n.slickGrid)==null||r.setSortColumns([{columnId:"duration",sortAsc:!0}]),(o=(a=this.aureliaGrid)==null?void 0:a.slickGrid)==null||o.invalidate()}loadData(t,e){const n=[];for(let r=t;r<t+e;r++)n.push(this.newItem(r));return n}newItem(t){const e=2e3+Math.floor(Math.random()*10),n=Math.floor(Math.random()*11),r=Math.floor(Math.random()*29),a=Math.round(Math.random()*100);return{id:t,title:"Task "+t,duration:Math.round(Math.random()*100)+"",percentComplete:a,start:new Date(e,n+1,r),finish:new Date(e+1,n+1,r),effortDriven:t%5===0}}onSortReset(t){this.shouldResetOnSort=t}clearAllFiltersAndSorts(){var t;(t=this.aureliaGrid)!=null&&t.gridService&&this.aureliaGrid.gridService.clearAllFiltersAndSorts()}setFiltersDynamically(){var t;(t=this.aureliaGrid)==null||t.filterService.updateFilters([{columnId:"percentComplete",searchTerms:["50"],operator:">="}])}refreshMetrics(t){var e;this.aureliaGrid&&(t==null?void 0:t.current)>=0&&(this.metrics.itemCount=((e=this.aureliaGrid.dataView)==null?void 0:e.getFilteredItemCount())||0,this.metrics.totalItemCount=t.itemCount||0)}setSortingDynamically(){var t;(t=this.aureliaGrid)==null||t.sortService.updateSorting([{columnId:"title",direction:"DESC"}])}toggleSubTitle(){var e;this.hideSubTitle=!this.hideSubTitle;const t=this.hideSubTitle?"add":"remove";(e=document.querySelector(".subtitle"))==null||e.classList[t]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}S=H();f=Y(S,0,"Example40",T,f);L(S,1,f);export{f as Example40};
//# sourceMappingURL=example40-CaAf0QYT.js.map
