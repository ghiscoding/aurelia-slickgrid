import{C as $,r as L,n as O,b as G,a as R,S as N,c as B}from"./index-Bz3uuwsZ.js";import{I as Z}from"./index.dev-DuhuQGSj.js";import{G as j}from"./grid-odata.service-BpQYoHTV.js";import{A as H}from"./aggregators.index-6uBa5zAH.js";import{S as q}from"./customers_100-D4oCOlSv.js";const T="example38",A=`<div class="demo38">
  <h2>
    Example 38: OData (v4) Backend Service with Infinite Scroll
    <span class="float-end">
      <a style="font-size: 18px" target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example38.ts">
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
        If we reached the end of the dataset and there is no more data to load, then we'll assume to have the entire dataset loaded in memory.
        This contrast with the regular Pagination approach which will only hold a single page data at a time.
      </li>
      <li>NOTES</li>
      <ol>
        <li>
          <code>presets.pagination</code> is not supported with Infinite Scroll and will revert to the first page,
          simply because since we keep appending data, we always have to start from index zero (no offset).
        </li>
        <li>
          Pagination is not shown BUT in fact, that is what is being used behind the scene whenever reaching the scroll end (fetching next batch).
        </li>
        <li>
          Also note that whenever the user changes the Sort(s)/Filter(s) it will always reset and go back to zero index (first page).
        </li>
      </ol>
    </ul>
  </div>

  <div class="row">
    <div class="col-sm-3">
      <div class="alert alert-danger" show.bind="errorStatus" data-test="error-status">
        <em><strong>Backend Error:</strong> <span innerhtml.bind="errorStatus"></span></em>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-sm-2">
      <div class.bind="status.class" role="alert" data-test="status">
        <strong>Status: </strong> \${status.text}
        <span hidden.bind="!processing">
          <i class="mdi mdi-sync mdi-spin"></i>
        </span>
      </div>
    </div>
    <div class="col-sm-10">
      <div class="alert alert-info" data-test="alert-odata-query">
        <strong>OData Query:</strong> <span data-test="odata-query-result">\${odataQuery}</span>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-sm-12">
      <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters-sorting"
              click.trigger="clearAllFiltersAndSorts()" title="Clear all Filters & Sorts">
        <i class="mdi mdi-filter-remove-outline"></i>
        Clear all Filter & Sorts
      </button>
      <button class="btn btn-outline-secondary btn-sm" data-test="set-dynamic-filter"
              click.trigger="setFiltersDynamically()">
        Set Filters Dynamically
      </button>
      <button class="btn btn-outline-secondary btn-sm" data-test="set-dynamic-sorting"
              click.trigger="setSortingDynamically()">
        Set Sorting Dynamically
      </button>
      <button class="btn btn-outline-secondary btn-sm" data-test="group-by-gender"
              click.trigger="groupByGender()">
        Group by Gender
      </button>

      <div show.bind="metrics" class="mt-2" style="margin: 10px 0px">
        <b>Metrics:</b>
        <span>
          <span>\${metrics.endTime | dateFormat: 'DD MMM, h:mm:ss a'}</span> —
            <span data-test="itemCount">\${metrics.itemCount}</span>
            of
            <span data-test="totalItemCount">\${metrics.totalItemCount}</span>
            items
        </span>
        <span class="badge rounded-pill text-bg-primary" class.bind="tagDataClass" data-test="data-loaded-tag">All Data Loaded!!!</span>
      </div>
    </div>
  </div>

  <aurelia-slickgrid
    grid-id="grid38"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset"
    instances.bind="aureliaGrid"
    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
    on-row-count-changed.trigger="refreshMetrics($event.detail.args)">
  </aurelia-slickgrid>
</div>
`,D=[],z={};let _;function Q(t){_||(_=$.define({name:T,template:A,dependencies:D,bindables:z})),t.register(_)}const V=Object.freeze(Object.defineProperty({__proto__:null,bindables:z,default:A,dependencies:D,name:T,register:Q,template:A},Symbol.toStringTag,{value:"Module"}));var W=Object.create,x=Object.defineProperty,U=Object.getOwnPropertyDescriptor,J=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),I=t=>{throw TypeError(t)},F=(t,e,r)=>e in t?x(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,K=(t,e)=>x(t,"name",{value:e,configurable:!0}),X=t=>[,,,W(null)],Y=["class","method","getter","setter","accessor","field","value","get","set"],M=t=>t!==void 0&&typeof t!="function"?I("Function expected"):t,ee=(t,e,r,h,i)=>({kind:Y[t],name:e,metadata:h,addInitializer:c=>r._?I("Already initialized"):i.push(M(c||null))}),te=(t,e)=>F(e,J("metadata"),t[3]),re=(t,e,r,h)=>{for(var i=0,c=t[e>>1],d=c&&c.length;i<d;i++)c[i].call(r);return h},se=(t,e,r,h,i,c)=>{var d,y,p,l=e&7,a=!1,s=0,u=t[s]||(t[s]=[]),n=l&&(i=i.prototype,l<5&&(l>3||!a)&&U(i,r));K(i,r);for(var b=h.length-1;b>=0;b--)p=ee(l,r,y={},t[3],u),d=(0,h[b])(i,p),y._=1,M(d)&&(i=d);return te(t,i),n&&x(i,r,n),a?l^4?c:n:i},g=(t,e,r)=>F(t,typeof e!="symbol"?e+"":e,r),P,E;const ie="%5E",ae="%25";P=[B(V)];class k{constructor(e=L(O(Z))){this.http=e,g(this,"aureliaGrid"),g(this,"backendService"),g(this,"columnDefinitions"),g(this,"gridOptions"),g(this,"dataset",[]),g(this,"isPageErrorTest",!1),g(this,"metrics"),g(this,"tagDataClass",""),g(this,"odataQuery",""),g(this,"hideSubTitle",!1),g(this,"processing",!1),g(this,"errorStatus",""),g(this,"errorStatusClass","hidden"),g(this,"status",{text:"processing...",class:"alert alert-danger"}),this.backendService=new j,this.initializeGrid()}aureliaGridReady(e){this.aureliaGrid=e}initializeGrid(){this.columnDefinitions=[{id:"name",name:"Name",field:"name",sortable:!0,type:R.string,filterable:!0,filter:{model:G.compoundInput}},{id:"gender",name:"Gender",field:"gender",filterable:!0,sortable:!0,filter:{model:G.singleSelect,collection:[{value:"",label:""},{value:"male",label:"male"},{value:"female",label:"female"}]}},{id:"company",name:"Company",field:"company",filterable:!0,sortable:!0},{id:"category_name",name:"Category",field:"category/name",filterable:!0,sortable:!0,formatter:(e,r,h,i,c)=>{var d;return((d=c.category)==null?void 0:d.name)||""}}],this.gridOptions={enableAutoResize:!0,autoResize:{container:"#demo-container",rightPadding:10},checkboxSelector:{hideInFilterHeaderRow:!1,hideInColumnTitleRow:!0},enableCellNavigation:!0,enableFiltering:!0,enableCheckboxSelector:!0,enableRowSelection:!0,enableGrouping:!0,headerMenu:{hideFreezeColumnsCommand:!1},presets:{},backendServiceApi:{service:this.backendService,options:{infiniteScroll:{fetchSize:30},enableCount:!0,version:4},onError:e=>{this.errorStatus=e.message,this.errorStatusClass="visible notification is-light is-danger is-small is-narrow",this.displaySpinner(!1,!0)},preProcess:()=>{this.errorStatus="",this.errorStatusClass="hidden",this.displaySpinner(!0)},process:e=>this.getCustomerApiCall(e),postProcess:e=>{this.metrics=e.metrics,this.displaySpinner(!1),this.getCustomerCallback(e)}}}}displaySpinner(e,r){this.processing=e,r?this.status={text:"ERROR!!!",class:"alert alert-danger"}:this.status=e?{text:"loading",class:"alert alert-warning"}:{text:"finished",class:"alert alert-success"}}getCustomerCallback(e){var h,i;const r=e["@odata.count"];this.metrics.totalItemCount=r,e.infiniteScrollBottomHit?(i=this.aureliaGrid.dataView)==null||i.addItems(e.value):((h=this.aureliaGrid.slickGrid)==null||h.scrollTo(0),this.dataset=e.value,this.metrics.itemCount=e.value.length),this.odataQuery=e.query}getCustomerApiCall(e){return this.getCustomerDataApiMock(e)}getCustomerDataApiMock(e){return this.errorStatusClass="hidden",new Promise(r=>{const h=e.toLowerCase().split("&");let i=0,c=0,d="",y=100;const p={};if(this.isPageErrorTest)throw this.isPageErrorTest=!1,new Error("Server timed out trying to retrieve data for the last page");for(const l of h){if(l.includes("$top=")&&(i=+l.substring(5),i===5e4))throw new Error("Server timed out retrieving 50,000 rows");if(l.includes("$skip=")&&(c=+l.substring(6)),l.includes("$orderby=")&&(d=l.substring(9)),l.includes("$filter=")){const a=l.substring(8).replace("%20"," ");if(a.includes("matchespattern")){const s=new RegExp(`matchespattern\\(([a-zA-Z]+),\\s'${ie}(.*?)'\\)`,"i"),u=a.match(s)||[],n=u[1].trim();p[n]={type:"matchespattern",term:"^"+u[2].trim()}}if(a.includes("contains")){const s=a.match(/contains\(([a-zA-Z/]+),\s?'(.*?)'/)||[],u=s[1].trim();p[u]={type:"substring",term:s[2].trim()}}if(a.includes("substringof")){const s=a.match(/substringof\('(.*?)',\s([a-zA-Z/]+)/)||[],u=s[2].trim();p[u]={type:"substring",term:s[1].trim()}}for(const s of["eq","ne","le","lt","gt","ge"])if(a.includes(s)){const n=new RegExp(`([a-zA-Z ]*) ${s} '(.*?)'`).exec(a);if(Array.isArray(n)){const b=n[1].trim();p[b]={type:s,term:n[2].trim()}}}if(a.includes("startswith")&&a.includes("endswith")){const s=a.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/)||[],u=a.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/)||[],n=s[1].trim();p[n]={type:"starts+ends",term:[s[2].trim(),u[2].trim()]}}else if(a.includes("startswith")){const s=a.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/)||[],u=s[1].trim();p[u]={type:"starts",term:s[2].trim()}}else if(a.includes("endswith")){const s=a.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/)||[],u=s[1].trim();p[u]={type:"ends",term:s[2].trim()}}if(a.includes("company"))throw new Error('Server could not filter using the field "Company"')}}if(d.includes("company"))throw new Error('Server could not sort using the field "Company"');this.http.fetch(q).then(l=>l.json()).then(l=>{if((d==null?void 0:d.length)>0){const n=d.split(",");for(const b of n){const S=b.split(" "),w=S[0];let v=f=>f;for(const f of w.split("/")){const o=v;v=C=>o(C)[f]}switch((S[1]??"asc").toLocaleLowerCase()){case"asc":l=l.sort((f,o)=>v(f).localeCompare(v(o)));break;case"desc":l=l.sort((f,o)=>v(o).localeCompare(v(f)));break}}}let a=c,s=l;if(p){for(const n in p)p.hasOwnProperty(n)&&(s=s.filter(b=>{const S=p[n].type,w=p[n].term;let v=n;if((n==null?void 0:n.indexOf(" "))!==-1){const o=n.split(" ");v=o[o.length-1]}let m,f=b;for(const o of v.split("/"))m=f[o],f=m;if(m){const[o,C]=Array.isArray(w)?w:[w];switch(S){case"eq":return m.toLowerCase()===o;case"ne":return m.toLowerCase()!==o;case"le":return m.toLowerCase()<=o;case"lt":return m.toLowerCase()<o;case"gt":return m.toLowerCase()>o;case"ge":return m.toLowerCase()>=o;case"ends":return m.toLowerCase().endsWith(o);case"starts":return m.toLowerCase().startsWith(o);case"starts+ends":return m.toLowerCase().startsWith(o)&&m.toLowerCase().endsWith(C);case"substring":return m.toLowerCase().includes(o);case"matchespattern":return new RegExp(o.replaceAll(ae,".*"),"i").test(m)}}}));y=s.length}a>s.length&&(e=e.replace(`$skip=${a}`,""),a=0);const u=s.slice(a,a+i);window.setTimeout(()=>{const n={query:e};n.value=u,n["@odata.count"]=y,r(n)},100)})})}groupByGender(){var e,r,h,i;(r=(e=this.aureliaGrid)==null?void 0:e.dataView)==null||r.setGrouping({getter:"gender",formatter:c=>`Gender: ${c.value} <span class="text-green">(${c.count} items)</span>`,comparer:(c,d)=>N.string(c.value,d.value),aggregators:[new H.Sum("gemder")],aggregateCollapsed:!1,lazyTotalsCalculation:!0}),(h=this.aureliaGrid)==null||h.slickGrid.setSortColumns([{columnId:"duration",sortAsc:!0}]),(i=this.aureliaGrid)==null||i.slickGrid.invalidate()}clearAllFiltersAndSorts(){var e;(e=this.aureliaGrid)!=null&&e.gridService&&this.aureliaGrid.gridService.clearAllFiltersAndSorts()}setFiltersDynamically(){var e;(e=this.aureliaGrid)==null||e.filterService.updateFilters([{columnId:"gender",searchTerms:["female"]}])}refreshMetrics(e){var r;(e==null?void 0:e.current)>=0&&(this.metrics.itemCount=((r=this.aureliaGrid.dataView)==null?void 0:r.getFilteredItemCount())||0,this.tagDataClass=this.metrics.itemCount===this.metrics.totalItemCount?"fully-loaded":"partial-load")}setSortingDynamically(){var e;(e=this.aureliaGrid)==null||e.sortService.updateSorting([{columnId:"name",direction:"DESC"}])}toggleSubTitle(){var r;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(r=document.querySelector(".subtitle"))==null||r.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}E=X();k=se(E,0,"Example38",P,k);re(E,1,k);export{k as Example38};
//# sourceMappingURL=example38-DmshXpKW.js.map
