import{C as L,r as k,n as I,O as m,b as p,F as u,c as q}from"./index-Bz3uuwsZ.js";import{I as A,j as h}from"./index.dev-DuhuQGSj.js";import{G as D}from"./graphql.service-B0y6nIZw.js";const O="example25",y=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example25.ts">
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
  <div class="col-xs-6 col-sm-3">
    <div class.bind="status.class" role="alert" data-test="status">
      <strong>Status: </strong> \${status.text}
      <span hidden.bind="!processing">
        <i class="mdi mdi-sync mdi-spin"></i>
      </span>
    </div>
  </div>
</div>

<aurelia-slickgrid grid-id="grid25"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset">
</aurelia-slickgrid>
`,P=[],G={};let g;function Q(t){g||(g=L.define({name:O,template:y,dependencies:P,bindables:G})),t.register(g)}const z=Object.freeze(Object.defineProperty({__proto__:null,bindables:G,default:y,dependencies:P,name:O,register:Q,template:y},Symbol.toStringTag,{value:"Module"}));var B=Object.create,v=Object.defineProperty,W=Object.getOwnPropertyDescriptor,H=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),T=t=>{throw TypeError(t)},N=(t,e,r)=>e in t?v(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,M=(t,e)=>v(t,"name",{value:e,configurable:!0}),R=t=>[,,,B(null)],U=["class","method","getter","setter","accessor","field","value","get","set"],E=t=>t!==void 0&&typeof t!="function"?T("Function expected"):t,V=(t,e,r,a,i)=>({kind:U[t],name:e,metadata:a,addInitializer:o=>r._?T("Already initialized"):i.push(E(o||null))}),$=(t,e)=>N(e,H("metadata"),t[3]),Y=(t,e,r,a)=>{for(var i=0,o=t[e>>1],l=o&&o.length;i<l;i++)o[i].call(r);return a},Z=(t,e,r,a,i,o)=>{var l,S,w,s=e&7,C=!1,x=0,j=t[x]||(t[x]=[]),c=s&&(i=i.prototype,s<5&&(s>3||!C)&&W(i,r));M(i,r);for(var d=a.length-1;d>=0;d--)w=V(s,r,S={},t[3],j),l=(0,a[d])(i,w),S._=1,E(l)&&(i=l);return $(t,i),c&&v(i,r,c),C?s^4?o:c:i},n=(t,e,r)=>N(t,typeof e!="symbol"?e+"":e,r),F,_;const b="https://countries.trevorblades.com/";F=[q(z)];class f{constructor(e=k(I(A))){this.http=e,n(this,"title","Example 25: GraphQL Basic API without Pagination"),n(this,"subTitle",`
  Use basic GraphQL query with any external public APIs (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/backend-services/graphql" target="_blank">Wiki docs</a>).
  <ul>
    <li>This Examples uses a Public GraphQL API that you can find at this link <a href="https://countries.trevorblades.com/" target="_blank">https://countries.trevorblades.com/</a></li>
    <li>Compare to the regular and default GraphQL implementation, you will find the following differences</li>
    <ul>
      <li>There are no Pagination and we only use GraphQL <b>once</b> to load the data, then we use the grid as a regular local in-memory grid</li>
      <li>We enabled the following 2 flags "useLocalFiltering" and "useLocalSorting" to use regular (in memory) DataView filtering/sorting</li>
    </ul>
    <li>NOTE - This Example calls multiple GraphQL queries, this is <b>ONLY</b> for demo purposes, you would typically only call 1 query (which is what GraphQL is good at)</li>
    <li>This example is mainly to demo the use of GraphqlService to build the query and retrieve the data but also to demo how to mix that with local (in-memory) Filtering/Sorting strategies</li>
  </ul>
  `),n(this,"aureliaGrid"),n(this,"columnDefinitions",[]),n(this,"gridOptions"),n(this,"dataset",[]),n(this,"metrics"),n(this,"graphqlQuery",""),n(this,"hideSubTitle",!1),n(this,"processing",!1),n(this,"status",{text:"",class:""}),this.defineGrid()}defineGrid(){this.columnDefinitions=[{id:"countryCode",field:"code",name:"Code",maxWidth:90,sortable:!0,filterable:!0,columnGroup:"Country"},{id:"countryName",field:"name",name:"Name",width:60,sortable:!0,filterable:!0,columnGroup:"Country"},{id:"countryNative",field:"native",name:"Native",width:60,sortable:!0,filterable:!0,columnGroup:"Country"},{id:"countryPhone",field:"phone",name:"Phone Area Code",maxWidth:110,sortable:!0,filterable:!0,columnGroup:"Country"},{id:"countryCurrency",field:"currency",name:"Currency",maxWidth:90,sortable:!0,filterable:!0,columnGroup:"Country"},{id:"countryEmoji",field:"emoji",name:"Emoji",maxWidth:90,sortable:!0,columnGroup:"Country"},{id:"languageName",field:"languages.name",name:"Names",width:60,formatter:u.arrayObjectToCsv,columnGroup:"Language",params:{propertyNames:["name"],useFormatterOuputToFilter:!0},filterable:!0,filter:{model:p.multipleSelect,collectionAsync:this.getLanguages(),operator:m.inContains,collectionOptions:{addBlankEntry:!0,collectionInsideObjectProperty:"data.languages"},collectionFilterBy:[{property:"name",value:"",operator:"NE"},{property:"name",value:null,operator:"NE"}],collectionSortBy:{property:"name"},customStructure:{value:"name",label:"name"},filterOptions:{filter:!0}}},{id:"languageNative",field:"languages.native",name:"Native",width:60,formatter:u.arrayObjectToCsv,params:{propertyNames:["native"],useFormatterOuputToFilter:!0},columnGroup:"Language",filterable:!0,filter:{model:p.multipleSelect,collectionAsync:this.getLanguages(),operator:m.inContains,collectionOptions:{addBlankEntry:!0,collectionInsideObjectProperty:"data.languages"},collectionFilterBy:[{property:"native",value:"",operator:"NE"},{property:"native",value:null,operator:"NE"}],collectionSortBy:{property:"native"},customStructure:{value:"native",label:"native"},filterOptions:{filter:!0}}},{id:"languageCode",field:"languages.code",name:"Codes",maxWidth:100,formatter:u.arrayObjectToCsv,params:{propertyNames:["code"],useFormatterOuputToFilter:!0},columnGroup:"Language",filterable:!0},{id:"continentName",field:"continent.name",name:"Name",width:60,sortable:!0,filterable:!0,formatter:u.complexObject,columnGroup:"Continent"},{id:"continentCode",field:"continent.code",name:"Code",maxWidth:90,sortable:!0,filterable:!0,filter:{model:p.singleSelect,collectionAsync:this.getContinents(),collectionOptions:{collectionInsideObjectProperty:"data.continents",addBlankEntry:!0,separatorBetweenTextLabels:": "},customStructure:{value:"code",label:"code",labelSuffix:"name"}},formatter:u.complexObject,columnGroup:"Continent"}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableFiltering:!0,enableCellNavigation:!0,enablePagination:!1,enableTranslate:!0,createPreHeaderPanel:!0,showPreHeaderPanel:!0,preHeaderPanelHeight:28,datasetIdPropertyName:"code",showCustomFooter:!0,backendServiceApi:{service:new D,useLocalFiltering:!0,useLocalSorting:!0,options:{datasetName:"countries"},preProcess:()=>this.displaySpinner(!0),process:e=>this.getCountries(e),postProcess:e=>{this.metrics=e.metrics,this.displaySpinner(!1)}}}}displaySpinner(e){this.processing=e,this.status=e?{text:"processing...",class:"alert alert-danger"}:{text:"finished",class:"alert alert-success"}}getCountries(e){return new Promise(async r=>{const a=await this.http.fetch(b,{method:"post",body:h({query:e})});r(a.json())})}getContinents(){const e="query { continents { code, name  }}";return new Promise(async r=>{const a=await this.http.fetch(b,{method:"post",body:h({query:e})});r(a.json())})}getLanguages(){const e="query { languages { code, name, native  }}";return new Promise(async r=>{const a=await this.http.fetch(b,{method:"post",body:h({query:e})});r(a.json())})}setFiltersDynamically(){this.aureliaGrid.filterService.updateFilters([{columnId:"countryName",searchTerms:["G"],operator:m.startsWith}])}setSortingDynamically(){this.aureliaGrid.sortService.updateSorting([{columnId:"billingAddressZip",direction:"DESC"},{columnId:"company",direction:"ASC"}])}toggleSubTitle(){var r;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(r=document.querySelector(".subtitle"))==null||r.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}_=R();f=Z(_,0,"Example25",F,f);Y(_,1,f);export{f as Example25};
//# sourceMappingURL=example25-C1XAQN0a.js.map
