import{C as U,a as S,b as $,F as Y,L as A,M as J,N as O,g as K,u as Q,c as X}from"./index-CATZt-GI.js";import{E as ee}from"./excelExport.service-CSmXGqy6.js";import{A as E}from"./aggregators.index-oGMxsyHt.js";import"./groupingFormatters.index-CHREWoSu.js";const H="example28",P=`<h2>
  <span innerhtml.bind="title"></span>
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example28.ts">
      <span class="mdi mdi-link mdi-v-align-sub"></span> code
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
  <div class="col-md-7">
    <button click.trigger="addNewFile()" data-test="add-item-btn" class="btn btn-xs btn-icon btn-primary">
      <span class="mdi mdi-plus color-white"></span>
      <span>Add New Pop Song</span>
    </button>
    <button click.trigger="deleteFile()" data-test="remove-item-btn" class="btn btn-outline-secondary btn-xs btn-icon" disabled.bind="isRemoveLastInsertedPopSongDisabled">
      <span class="mdi mdi-minus"></span>
      <span>Remove Last Inserted Pop Song</span>
    </button>
    <button click.trigger="collapseAll()" data-test="collapse-all-btn" class="btn btn-outline-secondary btn-xs btn-icon">
      <span class="mdi mdi-arrow-collapse"></span>
      <span>Collapse All</span>
    </button>
    <button click.trigger="expandAll()" data-test="expand-all-btn" class="btn btn-outline-secondary btn-xs btn-icon">
      <span class="mdi mdi-arrow-expand"></span>
      <span>Expand All</span>
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" data-test="clear-filters-btn" click.trigger="clearFilters()">
      <span class="mdi mdi-close"></span>
      <span>Clear Filters</span>
    </button>
    <button click.trigger="logFlatStructure()" class="btn btn-outline-secondary btn-xs btn-icon"
            title="console.log of the Flat dataset">
      <span>Log Flat Structure</span>
    </button>
    <button click.trigger="logHierarchicalStructure()" class="btn btn-outline-secondary btn-xs btn-icon"
            title="console.log of the Hierarchical Tree dataset">
      <span>Log Hierarchical Structure</span>
    </button>
  </div>

  <div class="col-md-5">
    <div class="input-group input-group-sm">
      <input type="text" class="form-control search-string" placeholder="search value" autocomplete="off"
              data-test="search-string" value.bind="searchString">
      <button class="btn btn-sm btn-outline-secondary d-flex align-items-center" data-test="clear-search-string"
              click.trigger="clearSearch()">
        <span class="icon mdi mdi-close-thick"></span>
      </button>
    </div>
  </div>
</div>

<div>
  <label class="checkbox-inline control-label" for="excludeChildWhenFiltering" style="margin-left: 20px">
    <input type="checkbox" id="excludeChildWhenFiltering" data-test="exclude-child-when-filtering"
            checked.bind="isExcludingChildWhenFiltering"
            click.trigger="changeExcludeChildWhenFiltering()">
    <span
          title="for example if we filter the word 'pop' and we exclude children, then only the folder 'pop' will show up without any content unless we uncheck this flag">
      Exclude Children when Filtering Tree
    </span>
  </label>
  <label class="checkbox-inline control-label" for="autoApproveParentItem" style="margin-left: 20px">
    <input type="checkbox" id="autoApproveParentItem" data-test="auto-approve-parent-item"
            checked.bind="isAutoApproveParentItemWhenTreeColumnIsValid"
            click.trigger="changeAutoApproveParentItem()">
    <span
          title="for example in this demo if we filter with 'music' and size '> 70' nothing will show up unless we have this flag enabled
          because none of the files have both criteria at the same time, however the column with the tree 'file' does pass the filter criteria 'music'
          and with this flag we tell the lib to skip any other filter(s) as soon as the with the tree (file in this demo) passes its own filter criteria">
      Skip Other Filter Criteria when Parent with Tree is valid
    </span>
  </label>
  <label class="checkbox-inline control-label" for="autoRecalcTotalsOnFilterChange" style="margin-left: 20px">
    <input type="checkbox" id="autoRecalcTotalsOnFilterChange" data-test="auto-recalc-totals"
            checked.bind="isAutoRecalcTotalsOnFilterChange"
            click.trigger="changeAutoRecalcTotalsOnFilterChange()">
    <span
          title="Should we recalculate Tree Data Totals (when Aggregators are defined) while filtering? This feature is disabled by default.">
      auto-recalc Tree Data totals on filter changed
    </span>
  </label>
</div>

<br />

<div id="grid-container" class="col-sm-12">
  <aurelia-slickgrid grid-id="grid28"
                      column-definitions.bind="columnDefinitions"
                      grid-options.bind="gridOptions"
                      dataset-hierarchical.bind="datasetHierarchical"
                      instances.bind="aureliaGrid">
  </aurelia-slickgrid>
</div>
`,L=[],N={};let D;function ie(t){D||(D=U.define({name:H,template:P,dependencies:L,bindables:N})),t.register(D)}const te=Object.freeze(Object.defineProperty({__proto__:null,bindables:N,default:P,dependencies:L,name:H,register:ie,template:P},Symbol.toStringTag,{value:"Module"}));var se=Object.create,C=Object.defineProperty,ae=Object.getOwnPropertyDescriptor,le=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),I=t=>{throw TypeError(t)},V=(t,e,i)=>e in t?C(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,W=(t,e)=>C(t,"name",{value:e,configurable:!0}),re=t=>[,,,se(null)],Z=["class","method","getter","setter","accessor","field","value","get","set"],F=t=>t!==void 0&&typeof t!="function"?I("Function expected"):t,ne=(t,e,i,r,a)=>({kind:Z[t],name:e,metadata:r,addInitializer:s=>i._?I("Already initialized"):a.push(F(s||null))}),oe=(t,e)=>V(e,le("metadata"),t[3]),z=(t,e,i,r)=>{for(var a=0,s=t[e>>1],d=s&&s.length;a<d;a++)e&1?s[a].call(i):r=s[a].call(i,r);return r},B=(t,e,i,r,a,s)=>{var d,n,m,f,g,l=e&7,c=!!(e&8),o=!!(e&16),b=l>3?t.length+1:l?c?1:2:0,v=Z[l+5],T=l>3&&(t[b-1]=[]),w=t[b]||(t[b]=[]),p=l&&(!o&&!c&&(a=a.prototype),l<5&&(l>3||!o)&&ae(l<4?a:{get[i](){return G(this,s)},set[i](u){return R(this,s,u)}},i));l?o&&l<4&&W(s,(l>2?"set ":l>1?"get ":"")+i):W(a,i);for(var _=r.length-1;_>=0;_--)f=ne(l,i,m={},t[3],w),l&&(f.static=c,f.private=o,g=f.access={has:o?u=>de(a,u):u=>i in u},l^3&&(g.get=o?u=>(l^1?G:ce)(u,a,l^4?s:p.get):u=>u[i]),l>2&&(g.set=o?(u,k)=>R(u,a,k,l^4?s:p.set):(u,k)=>u[i]=k)),n=(0,r[_])(l?l<4?o?s:p[v]:l>4?void 0:{get:p.get,set:p.set}:a,f),m._=1,l^4||n===void 0?F(n)&&(l>4?T.unshift(n):l?o?s=n:p[v]=n:a=n):typeof n!="object"||n===null?I("Object expected"):(F(d=n.get)&&(p.get=d),F(d=n.set)&&(p.set=d),F(d=n.init)&&T.unshift(d));return l||oe(t,a),p&&C(a,i,p),o?l^4?s:p:a},h=(t,e,i)=>V(t,typeof e!="symbol"?e+"":e,i),M=(t,e,i)=>e.has(t)||I("Cannot "+i),de=(t,e)=>Object(e)!==e?I('Cannot use the "in" operator on this value'):t.has(e),G=(t,e,i)=>(M(t,e,"read from private field"),i?i.call(t):e.get(t)),R=(t,e,i,r)=>(M(t,e,"write to private field"),r?r.call(t,i):e.set(t,i),i),ce=(t,e,i)=>(M(t,e,"access private method"),i),j,q,x;q=[X(te)],j=[K()];class y{constructor(){h(this,"title",'Example 28: Tree Data with Aggregators <small> <span class="mdi mdi-file-tree mdi-27px"></span> (from a Hierarchical Dataset - <a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/tree-data-grid" target="_blank">Wiki</a>)</small>'),h(this,"subTitle",`<ul>
    <li>It is assumed that your dataset will have Parent/Child references AND also Tree Level (indent) property.</li>
    <ul>
      <li>If you do not have the Tree Level (indent), you could call "convertParentChildArrayToHierarchicalView()" then call "convertHierarchicalViewToParentChildArray()"</li>
      <li>You could also pass the result of "convertParentChildArrayToHierarchicalView()" to "dataset-hierarchical.bind" as defined in the next Hierarchical Example</li>
    </ul>
  </ul>`),h(this,"aureliaGrid"),h(this,"gridOptions"),h(this,"columnDefinitions",[]),h(this,"datasetHierarchical",[]),h(this,"hideSubTitle",!1),h(this,"isExcludingChildWhenFiltering",!1),h(this,"isAutoApproveParentItemWhenTreeColumnIsValid",!0),h(this,"isAutoRecalcTotalsOnFilterChange",!1),h(this,"isRemoveLastInsertedPopSongDisabled",!0),h(this,"lastInsertedPopSongId"),h(this,"searchString",z(x,8,this,"")),z(x,11,this),h(this,"treeFormatter",(e,i,r,a,s,d)=>{var p;const n=d.getOptions(),m=n.treeDataOptions&&n.treeDataOptions.levelPropName||"__treeLevel";if(r==null||s===void 0)return"";const f=d.getData(),g=f.getItems(),l=f.getIdPropertyName()||"id",c=f.getIdxById(s[l]),o=this.getFileIcon(r),b=s[m],v=".";r=r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");const T=`<span style="display:inline-block; width:${15*b}px;"></span>`,w=Q(5*b);if(((p=g[c+1])==null?void 0:p[m])>g[c][m]||g[c].__hasChildren){const _=`<span class="mdi icon ${s.__collapsed?"mdi-folder":"mdi-folder-open"}"></span>`;return s.__collapsed?`<span class="hidden">${v}</span>${T}${w} <span class="slick-group-toggle collapsed" level="${b}"></span>${_} ${o} ${r}`:`<span class="hidden">${v}</span>${T}${w} <span class="slick-group-toggle expanded" level="${b}"></span>${_} ${o} ${r}`}else return`<span class="hidden">${v}</span>${T}${w} <span class="slick-group-toggle" level="${b}"></span>${o} ${r}`}),this.defineGrid()}attached(){this.datasetHierarchical=this.mockDataset()}defineGrid(){this.columnDefinitions=[{id:"file",name:"Files",field:"file",type:S.string,width:150,formatter:this.treeFormatter.bind(this),filterable:!0,sortable:!0},{id:"dateModified",name:"Date Modified",field:"dateModified",formatter:Y.dateIso,type:S.dateUtc,outputType:S.dateIso,minWidth:90,exportWithFormatter:!0,filterable:!0,filter:{model:$.compoundDate}},{id:"description",name:"Description",field:"description",minWidth:90,filterable:!0,sortable:!0},{id:"size",name:"Size",field:"size",minWidth:90,type:S.number,exportWithFormatter:!0,excelExportOptions:{autoDetectCellFormat:!1},filterable:!0,filter:{model:$.compoundInputNumber},formatter:(e,i,r,a,s)=>{var n,m,f,g;const d=a.field;if((s==null?void 0:s.__treeTotals)!==void 0){const l=s[((m=(n=this.gridOptions)==null?void 0:n.treeDataOptions)==null?void 0:m.levelPropName)||"__treeLevel"],c=(f=s==null?void 0:s.__treeTotals)==null?void 0:f.sum[d],o=(g=s==null?void 0:s.__treeTotals)==null?void 0:g.avg[d];if(o!==void 0&&c!==void 0)return isNaN(c)?"":`<span class="text-primary bold">sum: ${A(c,0,2)} MB</span> / <span class="avg-total">avg: ${A(o,0,2)} MB</span> <span class="total-suffix">(${l===0?"total":"sub-total"})</span>`;if(c!==void 0)return isNaN(c)?"":`<span class="text-primary bold">sum: ${A(c,0,2)} MB</span> <span class="total-suffix">(${l===0?"total":"sub-total"})</span>`}return J(r)?`${r} MB`:""}}],this.gridOptions={autoResize:{autoHeight:!1,container:"#demo-container",rightPadding:10},enableAutoSizeColumns:!0,enableAutoResize:!0,enableExcelExport:!0,excelExportOptions:{exportWithFormatter:!0,sanitizeDataExport:!0},externalResources:[new ee],enableFiltering:!0,enableTreeData:!0,multiColumnSort:!1,treeDataOptions:{columnId:"file",childrenPropName:"files",excludeChildrenWhenFilteringTree:this.isExcludingChildWhenFiltering,autoApproveParentItemWhenTreeColumnIsValid:this.isAutoApproveParentItemWhenTreeColumnIsValid,aggregators:[new E.Avg("size"),new E.Sum("size")],autoRecalcTotalsOnFilterChange:this.isAutoRecalcTotalsOnFilterChange},headerRowHeight:35,rowHeight:33,showCustomFooter:!0,presets:{treeData:{toggledItems:[{itemId:4,isCollapsed:!0}]}}}}changeAutoApproveParentItem(){return this.isAutoApproveParentItemWhenTreeColumnIsValid=!this.isAutoApproveParentItemWhenTreeColumnIsValid,this.gridOptions.treeDataOptions.autoApproveParentItemWhenTreeColumnIsValid=this.isAutoApproveParentItemWhenTreeColumnIsValid,this.aureliaGrid.slickGrid.setOptions(this.gridOptions),this.aureliaGrid.filterService.refreshTreeDataFilters(),!0}changeAutoRecalcTotalsOnFilterChange(){var e;return this.isAutoRecalcTotalsOnFilterChange=!this.isAutoRecalcTotalsOnFilterChange,this.gridOptions.treeDataOptions.autoRecalcTotalsOnFilterChange=this.isAutoRecalcTotalsOnFilterChange,(e=this.aureliaGrid.slickGrid)==null||e.setOptions(this.gridOptions),this.aureliaGrid.filterService.clearFilters(),this.aureliaGrid.treeDataService.enableAutoRecalcTotalsFeature(),!0}changeExcludeChildWhenFiltering(){return this.isExcludingChildWhenFiltering=!this.isExcludingChildWhenFiltering,this.gridOptions.treeDataOptions.excludeChildrenWhenFilteringTree=this.isExcludingChildWhenFiltering,this.aureliaGrid.slickGrid.setOptions(this.gridOptions),this.aureliaGrid.filterService.refreshTreeDataFilters(),!0}clearSearch(){this.searchString=""}searchStringChanged(){this.updateFilter()}updateFilter(){this.aureliaGrid.filterService.updateFilters([{columnId:"file",searchTerms:[this.searchString]}],!0,!1,!0)}getFileIcon(e){let i="";return e.includes(".pdf")?i='<span class="mdi icon mdi-file-pdf-outline"></span>':e.includes(".txt")?i='<span class="mdi icon mdi-file-document-outline"></span>':e.includes(".xls")?i='<span class="mdi icon mdi-file-excel-outline"></span>':e.includes(".mp3")&&(i='<span class="mdi icon mdi-file-music-outline"></span>'),i}addNewFile(){const e=this.aureliaGrid.dataView.getLength()+50,i=[...this.datasetHierarchical],r=O(i,a=>a.file==="pop","files");r&&Array.isArray(r.files)&&(r.files.push({id:e,file:`pop-${e}.mp3`,dateModified:new Date,size:e+3}),this.lastInsertedPopSongId=e,this.isRemoveLastInsertedPopSongDisabled=!1,this.datasetHierarchical=i,window.setTimeout(()=>{const a=this.aureliaGrid.dataView.getRowById(r.id);this.aureliaGrid.slickGrid.scrollRowIntoView(a+3)},10))}deleteFile(){const e=[...this.datasetHierarchical],i=O(this.datasetHierarchical,a=>a.file==="pop","files"),r=O(this.datasetHierarchical,a=>a.id===this.lastInsertedPopSongId,"files");if(i&&r){const a=i.files.findIndex(s=>s.id===r.id);a>=0&&(i.files.splice(a,1),this.lastInsertedPopSongId=void 0,this.isRemoveLastInsertedPopSongDisabled=!0,this.datasetHierarchical=e)}}clearFilters(){this.aureliaGrid.filterService.clearFilters()}collapseAll(){this.aureliaGrid.treeDataService.toggleTreeDataCollapse(!0)}expandAll(){this.aureliaGrid.treeDataService.toggleTreeDataCollapse(!1)}logHierarchicalStructure(){console.log("exploded array",this.aureliaGrid.treeDataService.datasetHierarchical)}logFlatStructure(){console.log("flat array",this.aureliaGrid.treeDataService.dataset)}mockDataset(){return[{id:24,file:"bucket-list.txt",dateModified:"2012-03-05T12:44:00.123Z",size:.5},{id:18,file:"something.txt",dateModified:"2015-03-03T03:50:00.123Z",size:90},{id:21,file:"documents",files:[{id:2,file:"txt",files:[{id:3,file:"todo.txt",description:"things to do someday maybe",dateModified:"2015-05-12T14:50:00.123Z",size:.7}]},{id:4,file:"pdf",files:[{id:22,file:"map2.pdf",dateModified:"2015-07-21T08:22:00.123Z",size:2.9},{id:5,file:"map.pdf",dateModified:"2015-05-21T10:22:00.123Z",size:3.1},{id:6,file:"internet-bill.pdf",dateModified:"2015-05-12T14:50:00.123Z",size:1.3},{id:23,file:"phone-bill.pdf",dateModified:"2015-05-01T07:50:00.123Z",size:1.5}]},{id:9,file:"misc",files:[{id:10,file:"warranties.txt",dateModified:"2015-02-26T16:50:00.123Z",size:.4}]},{id:7,file:"xls",files:[{id:8,file:"compilation.xls",dateModified:"2014-10-02T14:50:00.123Z",size:2.3}]},{id:55,file:"unclassified.csv",dateModified:"2015-04-08T03:44:12.333Z",size:.25},{id:56,file:"unresolved.csv",dateModified:"2015-04-03T03:21:12.000Z",size:.79},{id:57,file:"zebra.dll",dateModified:"2016-12-08T13:22:12.432",size:1.22}]},{id:11,file:"music",files:[{id:12,file:"mp3",files:[{id:16,file:"rock",files:[{id:17,file:"soft.mp3",dateModified:"2015-05-13T13:50:00Z",size:98}]},{id:14,file:"pop",files:[{id:15,file:"theme.mp3",description:"Movie Theme Song",dateModified:"2015-03-01T17:05:00Z",size:47},{id:25,file:"song.mp3",description:"it is a song...",dateModified:"2016-10-04T06:33:44Z",size:6.3}]},{id:33,file:"other",files:[]}]}]},{id:26,file:"recipes",description:"Cake Recipes",dateModified:"2012-03-05T12:44:00.123Z",files:[{id:29,file:"cheesecake",description:"strawberry cheesecake",dateModified:"2012-04-04T13:52:00.123Z",size:.2},{id:30,file:"chocolate-cake",description:"tasty sweet chocolate cake",dateModified:"2012-05-05T09:22:00.123Z",size:.2},{id:31,file:"coffee-cake",description:"chocolate coffee cake",dateModified:"2012-01-01T08:08:48.123Z",size:.2}]}]}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}x=re();B(x,5,"searchString",j,y);y=B(x,0,"Example28",q,y);z(x,1,y);export{y as Example28};
//# sourceMappingURL=example28-Bp0Deasu.js.map
