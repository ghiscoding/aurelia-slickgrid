import{C as E,r as F,I as W,b as u,a as b,F as p,f as O,e as w,O as o,c as M}from"./index-xBMUucNl.js";import{a as R}from"./addDay-3P9a66Vz.js";import{G as q}from"./graphql.service-rumqdWKs.js";const G="example6",v=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example6.ts">
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
  <div class="col-sm-5">
    <div class.bind="status.class" role="alert" data-test="status">
      <strong>Status: </strong> \${status.text}
      <span hidden.bind="!processing">
        <i class="mdi mdi-sync mdi-spin"></i>
      </span>
    </div>

    <div class="row">
      <div class="col-md-12">
        <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters-sorting"
                click.trigger="clearAllFiltersAndSorts()" title="Clear all Filters & Sorts">
          <i class="mdi mdi-filter-remove-outline"></i>
          Clear all Filter & Sorts
        </button>
        <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-filter"
                click.trigger="setFiltersDynamically()">
          Set Filters Dynamically
        </button>
        <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-sorting"
                click.trigger="setSortingDynamically()">
          Set Sorting Dynamically
        </button>
        <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="reset-presets"
                click.trigger="resetToOriginalPresets()">
          Reset Original Presets
        </button>
        <label for="serverdelay" class="ml-4">Server Delay: </label>
        <input id="serverdelay" type="number" data-test="server-delay" style="width: 55px"
              value.bind="serverWaitDelay"
              title="input a fake timer delay to simulate slow server response" />
      </div>
    </div>

    <hr>

    <div class="row">
      <div class="col-md-12">
        <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="switchLanguage()"
                data-test="language-button">
          <i class="mdi mdi-translate"></i>
          Switch Language
        </button>
        <b>Locale:</b>
        <span style="font-style: italic" data-test="selected-locale">
          \${selectedLanguage + '.json'}
        </span>
      </div>

      <span style="margin-left: 10px">
        <label>Pagination strategy: </label>
        <span data-test="radioStrategy">
          <label class="radio-inline control-label" for="radioOffset">
            <input type="radio" name="inlineRadioOptions" data-test="offset" id="radioOffset" checked value.bind="false"
            click.trigger="setIsWithCursor(false)"> Offset
          </label>
          <label class="radio-inline control-label" for="radioCursor">
            <input type="radio" name="inlineRadioOptions" data-test="cursor" id="radioCursor" value.bind="true"
            click.trigger="setIsWithCursor(true)"> Cursor
          </label>
        </span>
      </span>
    </div>
    <br />
    <div if.bind="metrics" style="margin: 10px 0px">
      <b>Metrics:</b> \${metrics.endTime | dateFormat: 'DD MMM, h:mm:ss a'} | \${metrics.executionTime}ms |
      \${metrics.totalItemCount}
      items
    </div>
    <div class="row" style="margin-bottom: 5px">
      <div class="col-md-12">
        <label>Programmatically go to first/last page:</label>
        <div class="btn-group" role="group">
          <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-first-page" click.trigger="goToFirstPage()">
            <i class="mdi mdi-page-first"></i>
          </button>
          <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-last-page" click.trigger="goToLastPage()">
            <i class="mdi mdi-page-last icon"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-sm-7">
    <div class="alert alert-info" data-test="alert-graphql-query">
      <strong>GraphQL Query:</strong> <span data-test="graphql-query-result">\${graphqlQuery}</span>
    </div>
  </div>
</div>

<hr />

<aurelia-slickgrid grid-id="grid6"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
                    on-grid-state-changed.trigger="gridStateChanged($event.detail)">
</aurelia-slickgrid>
`,A=[],L={};let y;function Q(t){y||(y=E.define({name:G,template:v,dependencies:A,bindables:L})),t.register(y)}const z=Object.freeze(Object.defineProperty({__proto__:null,bindables:L,default:v,dependencies:A,name:G,register:Q,template:v},Symbol.toStringTag,{value:"Module"}));var Y=Object.create,I=Object.defineProperty,K=Object.getOwnPropertyDescriptor,$=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),x=t=>{throw TypeError(t)},D=(t,e,r)=>e in t?I(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,H=(t,e)=>I(t,"name",{value:e,configurable:!0}),B=t=>[,,,Y(null)],j=["class","method","getter","setter","accessor","field","value","get","set"],P=t=>t!==void 0&&typeof t!="function"?x("Function expected"):t,Z=(t,e,r,s,i)=>({kind:j[t],name:e,metadata:s,addInitializer:a=>r._?x("Already initialized"):i.push(P(a||null))}),J=(t,e)=>D(e,$("metadata"),t[3]),U=(t,e,r,s)=>{for(var i=0,a=t[e>>1],l=a&&a.length;i<l;i++)a[i].call(r);return s},V=(t,e,r,s,i,a)=>{var l,d,g,c=e&7,T=!1,_=0,k=t[_]||(t[_]=[]),m=c&&(i=i.prototype,c<5&&(c>3||!T)&&K(i,r));H(i,r);for(var h=s.length-1;h>=0;h--)g=Z(c,r,d={},t[3],k),l=(0,s[h])(i,g),d._=1,P(l)&&(i=l);return J(t,i),m&&I(i,r,m),T?c^4?a:m:i},n=(t,e,r)=>D(t,typeof e!="symbol"?e+"":e,r),N,C;const X=20,f="users",ee=250;N=[M(z)];class S{constructor(e=F(W)){this.i18n=e,n(this,"title","Example 6: Grid with Backend GraphQL Service"),n(this,"subTitle",`
  Use it when you need to support Pagination with a GraphQL endpoint (for simple JSON, use a regular grid).
  <br/>Take a look at the (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/backend-services/graphql" target="_blank">Wiki docs</a>)
    <ul class="small">
      <li><span class="red bold">(*) NO DATA SHOWN</span> - just change filters &amp; page and look at the "GraphQL Query" changing</li>
      <li>Only "Name" field is sortable for the demo (because we use JSON files), however "multiColumnSort: true" is also supported</li>
      <li>String column also support operator (>, >=, <, <=, <>, !=, =, ==, *)</li>
      <ul>
        <li>The (*) can be used as startsWith (ex.: "abc*" => startsWith "abc") / endsWith (ex.: "*xyz" => endsWith "xyz")</li>
        <li>The other operators can be used on column type number for example: ">=100" (greater or equal than 100)</li>
      </ul>
      <li>You can also preload a grid with certain "presets" like Filters / Sorters / Pagination <a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/grid-state-preset" target="_blank">Wiki - Grid Preset</a></li>
      <li>Also note that the column Name has a filter with a custom %% operator that behaves like an SQL LIKE operator supporting % wildcards.</li>
      <li>Depending on your configuration, your GraphQL Server might already support regex querying (e.g. Hasura <a href="https://hasura.io/docs/latest/queries/postgres/filters/text-search-operators/#_regex" target="_blank">_regex</a>)
      or you could add your own implementation (e.g. see this SO <a href="https://stackoverflow.com/a/37981802/1212166">Question</a>).</li>
    </ul>
  `),n(this,"isWithCursor",!1),n(this,"aureliaGrid"),n(this,"columnDefinitions",[]),n(this,"gridOptions"),n(this,"dataset",[]),n(this,"metrics"),n(this,"graphqlService",new q),n(this,"graphqlQuery",""),n(this,"hideSubTitle",!1),n(this,"processing",!1),n(this,"selectedLanguage"),n(this,"status",{text:"",class:""}),n(this,"serverWaitDelay",ee),this.defineGrid();const r="en";this.i18n.setLocale(r),this.selectedLanguage=r}detaching(){this.saveCurrentGridState()}aureliaGridReady(e){this.aureliaGrid=e}defineGrid(){this.columnDefinitions=[{id:"name",field:"name",nameKey:"NAME",width:60,columnGroupKey:"CUSTOMER_INFORMATION",type:b.string,sortable:!0,filterable:!0,filter:{model:u.compoundInput,compoundOperatorList:[{operator:"",desc:"Contains"},{operator:"<>",desc:"Not Contains"},{operator:"=",desc:"Equals"},{operator:"!=",desc:"Not equal to"},{operator:"a*",desc:"Starts With"},{operator:"Custom",desc:"SQL Like"}]}},{id:"gender",field:"gender",nameKey:"GENDER",filterable:!0,sortable:!0,width:60,columnGroupKey:"CUSTOMER_INFORMATION",filter:{model:u.singleSelect,collection:[{value:"",label:""},{value:"male",label:"male",labelKey:"MALE"},{value:"female",label:"female",labelKey:"FEMALE"}]}},{id:"company",field:"company",nameKey:"COMPANY",width:60,columnGroupKey:"CUSTOMER_INFORMATION",sortable:!0,filterable:!0,filter:{model:u.multipleSelect,collection:[{value:"acme",label:"Acme"},{value:"abc",label:"Company ABC"},{value:"xyz",label:"Company XYZ"}],filterOptions:{filter:!0}}},{id:"billingAddressStreet",field:"billing.address.street",nameKey:"BILLING.ADDRESS.STREET",width:60,filterable:!0,sortable:!0,columnGroupKey:"BILLING.INFORMATION"},{id:"billingAddressZip",field:"billing.address.zip",nameKey:"BILLING.ADDRESS.ZIP",width:60,type:b.number,columnGroupKey:"BILLING.INFORMATION",filterable:!0,sortable:!0,filter:{model:u.compoundInput},formatter:p.multiple,params:{formatters:[p.complexObject,p.translate]}},{id:"finish",field:"finish",name:"Date",formatter:p.dateIso,sortable:!0,minWidth:90,width:120,exportWithFormatter:!0,columnGroupKey:"BILLING.INFORMATION",type:b.date,filterable:!0,filter:{model:u.dateRange,filterShortcuts:[{titleKey:"NEXT_20_DAYS",iconCssClass:"mdi mdi-calendar",searchTerms:[O(new Date,"YYYY-MM-DD"),O(R(new Date,20),"YYYY-MM-DD")]}]}}];const e=new Date().getFullYear(),r=`${e}-01-01`,s=`${e}-02-15`;this.gridOptions={enableFiltering:!0,enableCellNavigation:!0,enableTranslate:!0,createPreHeaderPanel:!0,showPreHeaderPanel:!0,preHeaderPanelHeight:28,i18n:this.i18n,gridHeight:200,gridWidth:900,compoundOperatorAltTexts:{text:{Custom:{operatorAlt:"%%",descAlt:"SQL Like"}}},gridMenu:{resizeOnShowHeaderRow:!0},enablePagination:!0,pagination:{pageSizes:[10,15,20,25,30,40,50,75,100],pageSize:X,totalItems:0},presets:{columns:[{columnId:"name",width:100},{columnId:"gender",width:55},{columnId:"company"},{columnId:"billingAddressZip"},{columnId:"billingAddressStreet",width:120},{columnId:"finish",width:130}],filters:[{columnId:"gender",searchTerms:["male"],operator:o.equal},{columnId:"name",searchTerms:["Joh*oe"],operator:o.startsWithEndsWith},{columnId:"company",searchTerms:["xyz"],operator:"IN"},{columnId:"finish",searchTerms:[r,s],operator:o.rangeInclusive}],sorters:[{columnId:"name",direction:"asc"},{columnId:"company",direction:w.DESC}],pagination:{pageNumber:this.isWithCursor?1:2,pageSize:20}},backendServiceApi:{service:this.graphqlService,options:{datasetName:f,addLocaleIntoQuery:!0,extraQueryArguments:[{field:"userId",value:123}],filterQueryOverride:({fieldName:i,columnDef:a,columnFilterOperator:l,searchValues:d})=>{if(l===o.custom&&(a==null?void 0:a.id)==="name")return{field:i,operator:"Like",value:d[0]}},useCursor:this.isWithCursor,keepArgumentFieldDoubleQuotes:!0},preProcess:()=>this.displaySpinner(!0),process:i=>this.getCustomerApiCall(i),postProcess:i=>{this.metrics=i.metrics,this.displaySpinner(!1)}}}}clearAllFiltersAndSorts(){this.aureliaGrid&&this.aureliaGrid.gridService&&this.aureliaGrid.gridService.clearAllFiltersAndSorts()}displaySpinner(e){this.processing=e,this.status=e?{text:"processing...",class:"alert alert-danger"}:{text:"finished",class:"alert alert-success"}}getCustomerApiCall(e){var i;let r;if((i=this.aureliaGrid)!=null&&i.paginationService){const{paginationService:a}=this.aureliaGrid,l=a._initialized?a.getCurrentPageNumber():1,d=String.fromCharCode(65+l-1),g=String.fromCharCode(d.charCodeAt(0)+1);r={hasPreviousPage:a.dataFrom===0,hasNextPage:a.dataTo===100,startCursor:d,endCursor:g}}else r={hasPreviousPage:!1,hasNextPage:!0,startCursor:"A",endCursor:"B"};const s={data:{[f]:{nodes:[],totalCount:100,pageInfo:r}}};return new Promise(a=>{window.setTimeout(()=>{var l,d;this.graphqlQuery=this.graphqlService.buildQuery(),this.isWithCursor&&((d=(l=this.aureliaGrid)==null?void 0:l.paginationService)==null||d.setCursorPageInfo(s.data[f].pageInfo)),a(s)},this.serverWaitDelay)})}goToFirstPage(){this.aureliaGrid.paginationService.goToFirstPage()}goToLastPage(){this.aureliaGrid.paginationService.goToLastPage()}gridStateChanged(e){console.log("GraphQL sample, Grid State changed:: ",e)}saveCurrentGridState(){console.log("GraphQL current grid state",this.aureliaGrid.gridStateService.getCurrentGridState())}setFiltersDynamically(){const e=new Date().getFullYear(),r=`${e}-01-01`,s=`${e}-02-15`;this.aureliaGrid.filterService.updateFilters([{columnId:"gender",searchTerms:["female"],operator:o.equal},{columnId:"name",searchTerms:["Jane"],operator:o.startsWith},{columnId:"company",searchTerms:["acme"],operator:"IN"},{columnId:"billingAddressZip",searchTerms:["11"],operator:o.greaterThanOrEqual},{columnId:"finish",searchTerms:[r,s],operator:o.rangeInclusive}])}setSortingDynamically(){this.aureliaGrid.sortService.updateSorting([{columnId:"billingAddressZip",direction:"DESC"},{columnId:"company",direction:"ASC"}])}resetToOriginalPresets(){const e=new Date().getFullYear(),r=`${e}-01-01`,s=`${e}-02-15`;this.aureliaGrid.filterService.updateFilters([{columnId:"gender",searchTerms:["male"],operator:o.equal},{columnId:"name",searchTerms:["Joh*oe"],operator:o.startsWithEndsWith},{columnId:"company",searchTerms:["xyz"],operator:"IN"},{columnId:"finish",searchTerms:[r,s],operator:o.rangeInclusive}]),this.aureliaGrid.sortService.updateSorting([{columnId:"name",direction:"asc"},{columnId:"company",direction:w.DESC}]),window.setTimeout(()=>{var i,a;(i=this.aureliaGrid.paginationService)==null||i.changeItemPerPage(20),(a=this.aureliaGrid.paginationService)==null||a.goToPageNumber(2)})}setIsWithCursor(e){return this.isWithCursor=e,this.resetOptions({useCursor:this.isWithCursor}),!0}async switchLanguage(){const e=this.selectedLanguage==="en"?"fr":"en";await this.i18n.setLocale(e),this.selectedLanguage=e}resetOptions(e){var s;this.displaySpinner(!0);const r=this.gridOptions.backendServiceApi.service;this.aureliaGrid.paginationService.setCursorBased(e.useCursor),r.updateOptions(e),this.gridOptions={...this.gridOptions},(s=this.aureliaGrid.paginationService)==null||s.goToFirstPage()}toggleSubTitle(){var r;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(r=document.querySelector(".subtitle"))==null||r.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}C=B();S=V(C,0,"Example6",N,S);U(C,1,S);export{S as Example6};
//# sourceMappingURL=example6-BrN3d--p.js.map
