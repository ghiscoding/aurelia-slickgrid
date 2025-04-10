import{C as I,r as M,n as N,b as T,a as B,O as P,c as V}from"./index-CATZt-GI.js";import{I as q}from"./index.dev-C_UIuEgO.js";import{G as W}from"./grid-odata.service-SiNmYXMY.js";import{S as Q}from"./customers_100-D4oCOlSv.js";const L="example5",x=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example5.ts">
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

<div class="row">
  <div class="col-sm-9">
    <div class="subtitle" innerhtml.bind="subTitle"></div>
  </div>
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
  <div class="col-sm-4">
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-filter"
            click.trigger="setFiltersDynamically()">
      Set Filters Dynamically
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-sorting"
            click.trigger="setSortingDynamically()">
      Set Sorting Dynamically
    </button>
    <br>
    <span if.bind="metrics">
      <b>Metrics:</b> \${metrics.endTime | dateFormat: 'DD MMM, h:mm:ss a'} | \${metrics.executionTime}ms |
      \${metrics.totalItemCount}
      items
    </span>
  </div>

  <div class="col-sm-8">
    <label>OData Version: </label>
    <span data-test="radioVersion">
      <label class="radio-inline control-label" for="radio2">
        <input type="radio" name="inlineRadioOptions" data-test="version2" id="radio2" checked value.bind="2"
                click.trigger="setOdataVersion(2)"> 2
      </label>
      <label class="radio-inline control-label" for="radio4">
        <input type="radio" name="inlineRadioOptions" data-test="version4" id="radio4" value.bind="4"
                click.trigger="setOdataVersion(4)"> 4
      </label>
    </span>
    <label class="checkbox-inline control-label" for="enableCount" style="margin-left: 20px">
      <input type="checkbox" id="enableCount" data-test="enable-count" checked.bind="isCountEnabled"
              click.trigger="changeCountEnableFlag()">
      <span style="font-weight: bold">Enable Count</span> (add to OData query)
    </label>
    <label class="checkbox-inline control-label" for="enableSelect" style="margin-left: 20px">
      <input type="checkbox" id="enableSelect" data-test="enable-select" checked.bind="isSelectEnabled"
              click.trigger="changeEnableSelectFlag()">
      <span style="font-weight: bold">Enable Select</span> (add to OData query)
    </label>
    <label class="checkbox-inline control-label" for="enableExpand" style="margin-left: 20px">
      <input type="checkbox" id="enableExpand" data-test="enable-expand" checked.bind="isExpandEnabled"
              click.trigger="changeEnableExpandFlag()">
      <span style="font-weight: bold">Enable Expand</span> (add to OData query)
    </label>
  </div>
</div>
<div class="row mt-2 mb-1">
  <div class="col-md-12">
    <button class="btn btn-outline-danger btn-sm btn-icon" data-test="throw-page-error-btn"
            click.trigger="throwPageChangeError()">
      <span>Throw Error Going to Last Page... </span>
      <i class="mdi mdi-page-last"></i>
    </button>

    <span class="ms-2">
      <label>Programmatically go to first/last page:</label>
      <div class="btn-group" role="group">
        <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-first-page" click.trigger="goToFirstPage()">
          <i class="mdi mdi-page-first"></i>
        </button>
        <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-last-page" click.trigger="goToLastPage()">
          <i class="mdi mdi-page-last"></i>
        </button>
      </div>
    </span>
  </div>
</div>

<aurelia-slickgrid grid-id="grid5"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    pagination-options.bind="paginationOptions"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
                    on-grid-state-changed.trigger="gridStateChanged($event.detail)"
                    on-before-sort.trigger="handleOnBeforeSort($event)"
                    on-before-search-change.trigger="handleOnBeforeSearchChange($event)"
                    on-before-pagination-change.trigger="handleOnBeforePaginationChange($event)">
</aurelia-slickgrid>
`,F=[],D={};let C;function Z(a){C||(C=I.define({name:L,template:x,dependencies:F,bindables:D})),a.register(C)}const j=Object.freeze(Object.defineProperty({__proto__:null,bindables:D,default:x,dependencies:F,name:L,register:Z,template:x},Symbol.toStringTag,{value:"Module"}));var H=Object.create,_=Object.defineProperty,U=Object.getOwnPropertyDescriptor,J=(a,e)=>(e=Symbol[a])?e:Symbol.for("Symbol."+a),$=a=>{throw TypeError(a)},z=(a,e,t)=>e in a?_(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t,Y=(a,e)=>_(a,"name",{value:e,configurable:!0}),K=a=>[,,,H(null)],X=["class","method","getter","setter","accessor","field","value","get","set"],R=a=>a!==void 0&&typeof a!="function"?$("Function expected"):a,ee=(a,e,t,g,l)=>({kind:X[a],name:e,metadata:g,addInitializer:u=>t._?$("Already initialized"):l.push(R(u||null))}),te=(a,e)=>z(e,J("metadata"),a[3]),ae=(a,e,t,g)=>{for(var l=0,u=a[e>>1],m=u&&u.length;l<m;l++)u[l].call(t);return g},ie=(a,e,t,g,l,u)=>{var m,y,h,r=e&7,s=!1,i=0,c=a[i]||(a[i]=[]),n=r&&(l=l.prototype,r<5&&(r>3||!s)&&U(l,t));Y(l,t);for(var f=g.length-1;f>=0;f--)h=ee(r,t,y={},a[3],c),m=(0,g[f])(l,h),y._=1,R(m)&&(l=m);return te(a,l),n&&_(l,t,n),s?r^4?u:n:l},d=(a,e,t)=>z(a,typeof e!="symbol"?e+"":e,t),G,O;const ne=20,A="%5E",se="%25";G=[V(j)];class k{constructor(e=M(N(q))){this.http=e,d(this,"title","Example 5: Grid with Backend OData Service"),d(this,"subTitle",`
    Use it when you need to support Pagination with a OData endpoint (for simple JSON, use a regular grid)<br/>
    Take a look at the (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/backend-services/odata" target="_blank">Wiki documentation</a>)
    <br/>
    <ul class="small">
      <li>Only "Name" field is sortable for the demo (because we use JSON files), however "multiColumnSort: true" is also supported</li>
      <li>This example also demos the Grid State feature, open the console log to see the changes</li>
      <li>String column also support operator (>, >=, <, <=, <>, !=, =, ==, *)</li>
      <ul>
        <li>The (*) can be used as startsWith (ex.: "abc*" => startsWith "abc") / endsWith (ex.: "*xyz" => endsWith "xyz")</li>
        <li>The other operators can be used on column type number for example: ">=100" (greater than or equal to 100)</li>
      </ul>
      <li>OData Service could be replaced by other Service type in the future (GraphQL or whichever you provide)</li>
      <li>You can also preload a grid with certain "presets" like Filters / Sorters / Pagination <a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/grid-state-preset" target="_blank">Wiki - Grid Preset</a>
      <li><span class="text-danger">NOTE:</span> For demo purposes, the last column (filter & sort) will always throw an
        error and its only purpose is to demo what would happen when you encounter a backend server error
        (the UI should rollback to previous state before you did the action).
        Also changing Page Size to 50,000 will also throw which again is for demo purposes.
      </li>
    </ul>
  `),d(this,"aureliaGrid"),d(this,"columnDefinitions",[]),d(this,"gridOptions"),d(this,"dataset",[]),d(this,"hideSubTitle",!1),d(this,"metrics"),d(this,"paginationOptions"),d(this,"isCountEnabled",!0),d(this,"isSelectEnabled",!1),d(this,"isExpandEnabled",!1),d(this,"odataVersion",2),d(this,"odataQuery",""),d(this,"processing",!1),d(this,"errorStatus",""),d(this,"isPageErrorTest",!1),d(this,"status",{text:"",class:""}),this.defineGrid()}aureliaGridReady(e){this.aureliaGrid=e}defineGrid(){this.columnDefinitions=[{id:"name",name:"Name",field:"name",sortable:!0,type:B.string,filterable:!0,filter:{model:T.compoundInput,compoundOperatorList:[{operator:"",desc:"Contains"},{operator:"<>",desc:"Not Contains"},{operator:"=",desc:"Equals"},{operator:"!=",desc:"Not equal to"},{operator:"a*",desc:"Starts With"},{operator:"Custom",desc:"SQL Like"}]}},{id:"gender",name:"Gender",field:"gender",filterable:!0,sortable:!0,filter:{model:T.singleSelect,collection:[{value:"",label:""},{value:"male",label:"male"},{value:"female",label:"female"}]}},{id:"company",name:"Company",field:"company",filterable:!0,sortable:!0},{id:"category_name",name:"Category",field:"category/name",filterable:!0,sortable:!0}],this.gridOptions={enableAutoResize:!0,autoResize:{container:"#demo-container",rightPadding:10},checkboxSelector:{hideInFilterHeaderRow:!1,hideInColumnTitleRow:!0},compoundOperatorAltTexts:{text:{Custom:{operatorAlt:"%%",descAlt:"SQL Like"}}},enableCellNavigation:!0,enableFiltering:!0,enableCheckboxSelector:!0,enableRowSelection:!0,enablePagination:!0,pagination:{pageSizes:[10,20,50,100,500,5e4],pageSize:ne,totalItems:0},presets:{filters:[{columnId:"gender",searchTerms:["male"],operator:P.equal}],sorters:[{columnId:"name",direction:"asc"}],pagination:{pageNumber:2,pageSize:20}},backendServiceApi:{service:new W,options:{enableCount:this.isCountEnabled,enableSelect:this.isSelectEnabled,enableExpand:this.isExpandEnabled,filterQueryOverride:({fieldName:e,columnDef:t,columnFilterOperator:g,searchValues:l})=>{if(g===P.custom&&(t==null?void 0:t.id)==="name"){let u=l[0].replace(/\*/g,".*");return u=u.slice(0,1)+A+u.slice(1),u=u.slice(0,-1)+"$'",`matchesPattern(${e}, ${u})`}},version:this.odataVersion},onError:e=>{console.log("ERROR",e),this.errorStatus=e.message,this.displaySpinner(!1,!0)},preProcess:()=>{this.errorStatus="",this.displaySpinner(!0)},process:e=>this.getCustomerApiCall(e),postProcess:e=>{this.metrics=e.metrics,this.displaySpinner(!1),this.getCustomerCallback(e)}}}}displaySpinner(e,t){this.processing=e,t?this.status={text:"ERROR!!!",class:"alert alert-danger"}:this.status=e?{text:"loading",class:"alert alert-warning"}:{text:"finished",class:"alert alert-success"}}getCustomerCallback(e){let t=e.totalRecordCount;this.isCountEnabled&&(t=this.odataVersion===4?e["@odata.count"]:e.d.__count),this.metrics&&(this.metrics.totalItemCount=t),this.paginationOptions={...this.gridOptions.pagination,totalItems:t},this.dataset=this.odataVersion===4?e.value:e.d.results,this.odataQuery=e.query}getCustomerApiCall(e){return this.getCustomerDataApiMock(e)}getCustomerDataApiMock(e){return new Promise(t=>{const g=e.toLowerCase().split("&");let l,u=0,m="",y=100;const h={};if(this.isPageErrorTest)throw this.isPageErrorTest=!1,new Error("Server timed out trying to retrieve data for the last page");for(const r of g){if(r.includes("$top=")&&(l=+r.substring(5),l===5e4))throw new Error("Server timed out retrieving 50,000 rows");if(r.includes("$skip=")&&(u=+r.substring(6)),r.includes("$orderby=")&&(m=r.substring(9)),r.includes("$filter=")){const s=r.substring(8).replace("%20"," ");if(s.includes("matchespattern")){const i=new RegExp(`matchespattern\\(([a-zA-Z]+),\\s'${A}(.*?)'\\)`,"i"),c=s.match(i),n=c[1].trim();h[n]={type:"matchespattern",term:"^"+c[2].trim()}}if(s.includes("contains")){const i=s.match(/contains\(([a-zA-Z/]+),\s?'(.*?)'/),c=i[1].trim();h[c]={type:"substring",term:i[2].trim()}}if(s.includes("substringof")){const i=s.match(/substringof\('(.*?)',\s([a-zA-Z/]+)/),c=i[2].trim();h[c]={type:"substring",term:i[1].trim()}}for(const i of["eq","ne","le","lt","gt","ge"])if(s.includes(i)){const n=new RegExp(`([a-zA-Z ]*) ${i} '(.*?)'`).exec(s);if(Array.isArray(n)){const f=n[1].trim();h[f]={type:i,term:n[2].trim()}}}if(s.includes("startswith")&&s.includes("endswith")){const i=s.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/)||[],c=s.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/)||[],n=i[1].trim();h[n]={type:"starts+ends",term:[i[2].trim(),c[2].trim()]}}else if(s.includes("startswith")){const i=s.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/),c=i[1].trim();h[c]={type:"starts",term:i[2].trim()}}else if(s.includes("endswith")){const i=s.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/),c=i[1].trim();h[c]={type:"ends",term:i[2].trim()}}if(s.includes("company"))throw new Error('Server could not filter using the field "Company"')}}if(m.includes("company"))throw new Error('Server could not sort using the field "Company"');this.http.fetch(Q).then(r=>r.json()).then(r=>{if((m==null?void 0:m.length)>0){const n=m.split(",");for(const f of n){const E=f.split(" "),S=E[0];let v=b=>b;for(const b of S.split("/")){const o=v;v=w=>o(w)[b]}switch((E[1]??"asc").toLocaleLowerCase()){case"asc":r=r.sort((b,o)=>v(b).localeCompare(v(o)));break;case"desc":r=r.sort((b,o)=>v(o).localeCompare(v(b)));break}}}let s=u,i=r;if(h){for(const n in h)h.hasOwnProperty(n)&&(i=i.filter(f=>{const E=h[n].type,S=h[n].term;let v=n;if((n==null?void 0:n.indexOf(" "))!==-1){const o=n.split(" ");v=o[o.length-1]}let p,b=f;for(const o of v.split("/"))p=b[o],b=p;if(p){const[o,w]=Array.isArray(S)?S:[S];switch(E){case"eq":return p.toLowerCase()===o;case"ne":return p.toLowerCase()!==o;case"le":return p.toLowerCase()<=o;case"lt":return p.toLowerCase()<o;case"gt":return p.toLowerCase()>o;case"ge":return p.toLowerCase()>=o;case"ends":return p.toLowerCase().endsWith(o);case"starts":return p.toLowerCase().startsWith(o);case"starts+ends":return p.toLowerCase().startsWith(o)&&p.toLowerCase().endsWith(w);case"substring":return p.toLowerCase().includes(o);case"matchespattern":return new RegExp(o.replaceAll(se,".*"),"i").test(p)}}}));y=i.length}s>i.length&&(e=e.replace(`$skip=${s}`,""),s=0);const c=i.slice(s,s+l);window.setTimeout(()=>{const n={query:e};this.isCountEnabled||(n.totalRecordCount=y),this.odataVersion===4?(n.value=c,this.isCountEnabled&&(n["@odata.count"]=y)):(n.d={results:c},this.isCountEnabled&&(n.d.__count=y)),t(n)},150)})})}goToFirstPage(){this.aureliaGrid.paginationService.goToFirstPage()}goToLastPage(){this.aureliaGrid.paginationService.goToLastPage()}gridStateChanged(e){console.log("Client sample, Grid State changed:: ",e.change)}setFiltersDynamically(){this.aureliaGrid.filterService.updateFilters([{columnId:"name",searchTerms:["A"],operator:"a*"}])}setSortingDynamically(){this.aureliaGrid.sortService.updateSorting([{columnId:"name",direction:"DESC"}])}throwPageChangeError(){var e,t;this.isPageErrorTest=!0,(t=(e=this.aureliaGrid)==null?void 0:e.paginationService)==null||t.goToLastPage()}handleOnBeforeSort(){return!0}handleOnBeforeSearchChange(){return!0}handleOnBeforePaginationChange(){return!0}changeCountEnableFlag(){return this.isCountEnabled=!this.isCountEnabled,this.resetOptions({enableCount:this.isCountEnabled}),!0}changeEnableSelectFlag(){return this.isSelectEnabled=!this.isSelectEnabled,this.resetOptions({enableSelect:this.isSelectEnabled}),!0}changeEnableExpandFlag(){return this.isExpandEnabled=!this.isExpandEnabled,this.resetOptions({enableExpand:this.isExpandEnabled}),!0}setOdataVersion(e){return this.odataVersion=e,this.resetOptions({version:this.odataVersion}),!0}resetOptions(e){var g;this.displaySpinner(!0);const t=this.gridOptions.backendServiceApi.service;t.updateOptions(e),t.clearFilters(),(g=this.aureliaGrid)==null||g.filterService.clearFilters()}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}O=K();k=ie(O,0,"Example5",G,k);ae(O,1,k);export{k as Example5};
//# sourceMappingURL=example5-B5-KcVjU.js.map
