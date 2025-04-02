import{C as W,r as I,n as $,I as j,b as S,a as K,c as H}from"./index-Bz3uuwsZ.js";import{I as V}from"./index.dev-DuhuQGSj.js";import{G as U}from"./graphql.service-B0y6nIZw.js";import{S as T}from"./customers_100-D4oCOlSv.js";const G="example39",A=`<div class="demo39">
  <h2>
    Example 39: GraphQL Backend Service with Infinite Scroll
    <span class="float-end">
      <a style="font-size: 18px" target="_blank"
          href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example39.ts">
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
    <div class="col-sm-5">
      <div class.bind="status.class" role="alert" data-test="status">
        <strong>Status: </strong> \${status.text}
        <span hidden.bind="!processing">
          <i class="mdi mdi-sync mdi-spin-1s"></i>
        </span>
      </div>

      <div class="row">
        <div class="col-md-12">
          <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters-sorting"
                  click.trigger="clearAllFiltersAndSorts()" title="Clear all Filters & Sorts">
            <i class="mdi mdi-filter-remove-outline"></i>
            Clear all Filter & Sorts
          </button>
          <label for="serverdelay" class="ml-4">Server Delay: </label>
          <input id="serverdelay" type="number" data-test="server-delay" style="width: 55px"
                value.bind="serverWaitDelay"
                title="input a fake timer delay to simulate slow server response" />
        </div>
      </div>
      <div class="row mt-1">
        <div class="col-md-12">
          <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="language-button" click.trigger="switchLanguage()">
            <i class="mdi mdi-translate"></i>
            Switch Language
          </button>
          <strong>Locale:</strong>
          <span style="font-style: italic" data-test="selected-locale">
            \${selectedLanguage + '.json'}
          </span>
        </div>
      </div>
      <br />
      <div show.bind="metrics" style="margin: 10px 0px">
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

    <div class="col-sm-7">
      <div class="alert alert-info" data-test="alert-graphql-query">
        <strong>GraphQL Query:</strong>
        <div innerhtml.bind="graphqlQuery" data-test="graphql-query-result"></div>
      </div>
    </div>
  </div>

  <aurelia-slickgrid
    grid-id="grid39"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset"
    instances.bind="aureliaGrid"
    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
    on-row-count-changed.trigger="refreshMetrics($event.detail.args)">
  </aurelia-slickgrid>
</div>
`,M=[],z={};let _;function Y(t){_||(_=W.define({name:G,template:A,dependencies:M,bindables:z})),t.register(_)}const Z=Object.freeze(Object.defineProperty({__proto__:null,bindables:z,default:A,dependencies:M,name:G,register:Y,template:A},Symbol.toStringTag,{value:"Module"}));var J=Object.create,x=Object.defineProperty,X=Object.getOwnPropertyDescriptor,q=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),F=t=>{throw TypeError(t)},O=(t,e,i)=>e in t?x(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,ee=(t,e)=>x(t,"name",{value:e,configurable:!0}),te=t=>[,,,J(null)],ie=["class","method","getter","setter","accessor","field","value","get","set"],P=t=>t!==void 0&&typeof t!="function"?F("Function expected"):t,ae=(t,e,i,l,a)=>({kind:ie[t],name:e,metadata:l,addInitializer:r=>i._?F("Already initialized"):a.push(P(r||null))}),se=(t,e)=>O(e,q("metadata"),t[3]),ne=(t,e,i,l)=>{for(var a=0,r=t[e>>1],m=r&&r.length;a<m;a++)r[a].call(i);return l},re=(t,e,i,l,a,r)=>{var m,g,u,h=e&7,p=!1,b=0,w=t[b]||(t[b]=[]),s=h&&(a=a.prototype,h<5&&(h>3||!p)&&X(a,i));ee(a,i);for(var n=l.length-1;n>=0;n--)u=ae(h,i,g={},t[3],w),m=(0,l[n])(a,u),g._=1,P(m)&&(a=m);return se(t,a),s&&x(a,i,s),p?h^4?r:s:a},c=(t,e,i)=>O(t,typeof e!="symbol"?e+"":e,i),R,D;const v="users",le=250;function L(t){return t.replace(/^"/,"").replace(/"$/,"").toLowerCase()}R=[H(Z)];class E{constructor(e=I($(V)),i=I(j)){this.http=e,this.i18n=i,c(this,"aureliaGrid"),c(this,"backendService"),c(this,"columnDefinitions"),c(this,"gridOptions"),c(this,"dataset",[]),c(this,"metrics"),c(this,"tagDataClass",""),c(this,"graphqlQuery","..."),c(this,"hideSubTitle",!1),c(this,"processing",!1),c(this,"selectedLanguage"),c(this,"status",{text:"processing...",class:"alert alert-danger"}),c(this,"serverWaitDelay",le),this.backendService=new U;const l="en";this.i18n.setLocale(l),this.selectedLanguage=l,this.initializeGrid()}aureliaGridReady(e){this.aureliaGrid=e}initializeGrid(){this.columnDefinitions=[{id:"name",field:"name",nameKey:"NAME",width:60,type:K.string,sortable:!0,filterable:!0,filter:{model:S.compoundInput}},{id:"gender",field:"gender",nameKey:"GENDER",filterable:!0,sortable:!0,width:60,filter:{model:S.singleSelect,collection:[{value:"",label:""},{value:"male",labelKey:"MALE"},{value:"female",labelKey:"FEMALE"}]}},{id:"company",field:"company",nameKey:"COMPANY",width:60,sortable:!0,filterable:!0,filter:{model:S.multipleSelect,customStructure:{label:"company",value:"company"},collectionSortBy:{property:"company",sortDesc:!1},collectionAsync:this.http.fetch(T).then(e=>e.json()),filterOptions:{filter:!0}}}],this.gridOptions={enableAutoResize:!0,autoResize:{container:"#demo-container",rightPadding:10},enableAutoTooltip:!0,autoTooltipOptions:{enableForHeaderCells:!0},enableTranslate:!0,i18n:this.i18n,enableFiltering:!0,enableCellNavigation:!0,multiColumnSort:!1,gridMenu:{resizeOnShowHeaderRow:!0},backendServiceApi:{disableInternalPostProcess:!0,service:this.backendService,options:{datasetName:v,addLocaleIntoQuery:!0,extraQueryArguments:[{field:"userId",value:123}],infiniteScroll:{fetchSize:30}},preProcess:()=>this.displaySpinner(!0),process:e=>this.getCustomerApiCall(e),postProcess:e=>{this.metrics={endTime:new Date,totalItemCount:e.data[v].totalCount||0},this.displaySpinner(!1),this.getCustomerCallback(e)}}}}clearAllFiltersAndSorts(){var e;(e=this.aureliaGrid)!=null&&e.gridService&&this.aureliaGrid.gridService.clearAllFiltersAndSorts()}displaySpinner(e){this.processing=e,this.status=e?{text:"processing...",class:"alert alert-danger"}:{text:"finished",class:"alert alert-success"}}getCustomerCallback(e){var a,r;const{nodes:i,totalCount:l}=e.data[v];this.aureliaGrid&&(this.metrics.totalItemCount=l,e.infiniteScrollBottomHit?(r=this.aureliaGrid.dataView)==null||r.addItems(i):((a=this.aureliaGrid.slickGrid)==null||a.scrollTo(0),this.dataset=i,this.metrics.itemCount=i.length))}getCustomerApiCall(e){return this.getCustomerDataApiMock(e)}getCustomerDataApiMock(e){return new Promise(i=>{let l=0,a=0,r="",m="";this.http.fetch(T).then(g=>g.json()).then(g=>{let u=g;if(e.includes("first:")&&(l=+(e.match(/first:([0-9]+),/)||[])[1]),e.includes("offset:")&&(a=+(e.match(/offset:([0-9]+),/)||[])[1]),e.includes("orderBy:")){const[s,n,f]=/orderBy:\[{field:([a-zA-Z/]+),direction:(ASC|DESC)}\]/gi.exec(e)||[];r=n||"",m=f||""}if(e.includes("orderBy:")){const[s,n,f]=/orderBy:\[{field:([a-zA-Z/]+),direction:(ASC|DESC)}\]/gi.exec(e)||[];r=n||"",m=f||""}if(e.includes("filterBy:")){const s=/{field:(\w+),operator:(\w+),value:([0-9a-z',"\s]*)}/gi;let n;for(;(n=s.exec(e))!==null;){const f=n[1]||"",k=n[2]||"",C=n[3]||"";let[o,y]=C.split(",");f&&k&&C!==""&&(u=u.filter(N=>{const d=N[f];switch(o=L(o),y=L(y||""),k){case"EQ":return d.toLowerCase()===o;case"NE":return d.toLowerCase()!==o;case"LE":return d.toLowerCase()<=o;case"LT":return d.toLowerCase()<o;case"GT":return d.toLowerCase()>o;case"GE":return d.toLowerCase()>=o;case"EndsWith":return d.toLowerCase().endsWith(o);case"StartsWith":return d.toLowerCase().startsWith(o);case"Starts+Ends":return d.toLowerCase().startsWith(o)&&d.toLowerCase().endsWith(y);case"Contains":return d.toLowerCase().includes(o);case"Not_Contains":return!d.toLowerCase().includes(o);case"IN":const Q=C.toLocaleLowerCase().split(",");for(const B of Q)if(d.toLocaleLowerCase()===L(B))return!0;break}}))}}let h=a;h>u.length&&(e=e.replace(`offset:${h}`,""),h=0);const p=s=>r?s[r]:s;switch(m.toUpperCase()){case"ASC":u=u.sort((s,n)=>p(s).localeCompare(p(n)));break;case"DESC":u=u.sort((s,n)=>p(n).localeCompare(p(s)));break}const b=u.slice(h,h+l),w={data:{[v]:{nodes:b,totalCount:u.length}}};window.setTimeout(()=>{this.graphqlQuery=this.gridOptions.backendServiceApi.service.buildQuery(),i(w)},this.serverWaitDelay)})})}refreshMetrics(e){var i;(e==null?void 0:e.current)>=0&&(this.metrics.itemCount=((i=this.aureliaGrid.dataView)==null?void 0:i.getFilteredItemCount())||0,this.tagDataClass=this.metrics.itemCount===this.metrics.totalItemCount?"fully-loaded":"partial-load")}async switchLanguage(){const e=this.selectedLanguage==="en"?"fr":"en";await this.i18n.setLocale(e),this.selectedLanguage=e}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}D=te();E=re(D,0,"Example39",R,E);ne(D,1,E);export{E as Example39};
//# sourceMappingURL=example39-BWSVvqNd.js.map
