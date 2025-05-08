import{C as Y,a as c,F as h,b,g as q,c as J}from"./index-BEnHDSQL.js";const E="example10",x=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example10.ts">
      <span class="mdi mdi-link-variant"></span> code
    </a>
  </span>
  <button
      class="ms-2 btn btn-outline-secondary btn-sm btn-icon"
      type="button"
      data-test="toggle-subtitle"
      click.trigger="hideSubTitle = !hideSubTitle"
    >
      <span class="mdi mdi-information-outline" title="Toggle example sub-title details"></span>
    </button>
</h2>

<div class="subtitle" innerhtml.bind="subTitle" hidden.bind="hideSubTitle"></div>

<div class="row">
  <div class="col-sm-4" style="max-width: 205px;">
    Pagination
    <div class="btn-group" role="group">
      <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-first-page"
              click.trigger="goToGrid1FirstPage()">
        <i class="mdi mdi-page-first"></i>
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-last-page" click.trigger="goToGrid1LastPage()">
        <i class="mdi mdi-page-last icon"></i>
      </button>
    </div>
  </div>
  <div class="col-sm-8">
    <div class="alert alert-success">
      <strong>(single select) Selected Row:</strong>
      <span innerhtml.bind="selectedTitle"
            data-test="grid1-selections"></span>
    </div>
  </div>
</div>

<div class="overflow-hidden">
  <aurelia-slickgrid grid-id="grid1"
                      column-definitions.bind="columnDefinitions1"
                      grid-options.bind="gridOptions1"
                      dataset.bind="dataset1"
                      on-aurelia-grid-created.trigger="aureliaGrid1Ready($event.detail)"
                      on-grid-state-changed.trigger="grid1StateChanged($event.detail)"
                      on-selected-rows-changed.trigger="onGrid1SelectedRowsChanged($event.detail.eventData, $event.detail.args)">
  </aurelia-slickgrid>
</div>

<hr class="col-md-6 offset-md-1">

<div class="row">
  <div class="col-sm-4 col-md-3" style="max-width: 215px;">
    <label for="enableGrid2Pagination">
      Pagination:
      <input type="checkbox" id="enableGrid2Pagination"
              checked.bind="isGrid2WithPagination"
              data-test="toggle-pagination-grid2" />
    </label>
    <span style="margin-left: 5px" if.bind="isGrid2WithPagination">
      <div class="btn-group" role="group">
        <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-first-page"
                click.trigger="goToGrid2FirstPage()">
          <i class="mdi mdi-page-first"></i>
        </button>
        <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-last-page"
                click.trigger="goToGrid2LastPage()">
          <i class="mdi mdi-page-last icon"></i>
        </button>
      </div>
    </span>
  </div>
  <div class="col-sm-8">
    <div class="alert alert-success">
      <strong>(multi-select) Selected Row(s):</strong>
      <span innerhtml.bind="selectedTitles"
            data-test="grid2-selections"></span>
    </div>
  </div>
</div>

<div class="overflow-hidden">
  <aurelia-slickgrid grid-id="grid2"
                      column-definitions.bind="columnDefinitions2"
                      grid-options.bind="gridOptions2"
                      dataset.bind="dataset2"
                      on-aurelia-grid-created.trigger="aureliaGrid2Ready($event.detail)"
                      on-grid-state-changed.trigger="grid2StateChanged($event.detail)">
  </aurelia-slickgrid>
</div>
`,A=[],$={};let T;function K(t){T||(T=Y.define({name:E,template:x,dependencies:A,bindables:$})),t.register(T)}const Q=Object.freeze(Object.defineProperty({__proto__:null,bindables:$,default:x,dependencies:A,name:E,register:K,template:x},Symbol.toStringTag,{value:"Module"}));var U=Object.create,F=Object.defineProperty,X=Object.getOwnPropertyDescriptor,Z=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),_=t=>{throw TypeError(t)},L=(t,e,i)=>e in t?F(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,I=(t,e)=>F(t,"name",{value:e,configurable:!0}),ee=t=>[,,,U(null)],N=["class","method","getter","setter","accessor","field","value","get","set"],v=t=>t!==void 0&&typeof t!="function"?_("Function expected"):t,te=(t,e,i,r,n)=>({kind:N[t],name:e,metadata:r,addInitializer:l=>i._?_("Already initialized"):n.push(v(l||null))}),ie=(t,e)=>L(e,Z("metadata"),t[3]),D=(t,e,i,r)=>{for(var n=0,l=t[e>>1],g=l&&l.length;n<g;n++)e&1?l[n].call(i):r=l[n].call(i,r);return r},B=(t,e,i,r,n,l)=>{var g,o,M,f,y,a=e&7,G=!!(e&8),p=!!(e&16),w=a>3?t.length+1:a?G?1:2:0,O=N[a+5],R=a>3&&(t[w-1]=[]),V=t[w]||(t[w]=[]),u=a&&(!p&&!G&&(n=n.prototype),a<5&&(a>3||!p)&&X(a<4?n:{get[i](){return z(this,l)},set[i](d){return W(this,l,d)}},i));a?p&&a<4&&I(l,(a>2?"set ":a>1?"get ":"")+i):I(n,i);for(var k=r.length-1;k>=0;k--)f=te(a,i,M={},t[3],V),a&&(f.static=G,f.private=p,y=f.access={has:p?d=>ae(n,d):d=>i in d},a^3&&(y.get=p?d=>(a^1?z:ne)(d,n,a^4?l:u.get):d=>d[i]),a>2&&(y.set=p?(d,P)=>W(d,n,P,a^4?l:u.set):(d,P)=>d[i]=P)),o=(0,r[k])(a?a<4?p?l:u[O]:a>4?void 0:{get:u.get,set:u.set}:n,f),M._=1,a^4||o===void 0?v(o)&&(a>4?R.unshift(o):a?p?l=o:u[O]=o:n=o):typeof o!="object"||o===null?_("Object expected"):(v(g=o.get)&&(u.get=g),v(g=o.set)&&(u.set=g),v(g=o.init)&&R.unshift(g));return a||ie(t,n),u&&F(n,i,u),p?a^4?l:u:n},s=(t,e,i)=>L(t,typeof e!="symbol"?e+"":e,i),C=(t,e,i)=>e.has(t)||_("Cannot "+i),ae=(t,e)=>Object(e)!==e?_('Cannot use the "in" operator on this value'):t.has(e),z=(t,e,i)=>(C(t,e,"read from private field"),i?i.call(t):e.get(t)),W=(t,e,i,r)=>(C(t,e,"write to private field"),r?r.call(t,i):e.set(t,i),i),ne=(t,e,i)=>(C(t,e,"access private method"),i),H,j,m;j=[J(Q)],H=[q()];class S{constructor(){s(this,"title","Example 10: Multiple Grids with Row Selection"),s(this,"subTitle",`
    Row selection, single or multi-select (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/row-selection" target="_blank">Wiki docs</a>).
    <ul>
      <li>Single Select, you can click on any cell to make the row active</li>
      <li>Multiple Selections, you need to specifically click on the checkbox to make 1 or more selections</li>
      <li>NOTE: Any Row Selection(s) will be reset when using Pagination and changing Page (you will need to set it back manually if you want it back)</li>
    </ul>
  `),s(this,"isGrid2WithPagination",D(m,8,this,!0)),D(m,11,this),s(this,"aureliaGrid1"),s(this,"aureliaGrid2"),s(this,"columnDefinitions1",[]),s(this,"columnDefinitions2",[]),s(this,"gridOptions1"),s(this,"gridOptions2"),s(this,"dataset1",[]),s(this,"dataset2",[]),s(this,"hideSubTitle",!1),s(this,"selectedTitles",""),s(this,"selectedTitle",""),s(this,"selectedGrid2IDs",[]),this.defineGrids()}attached(){this.dataset1=this.prepareData(495),this.dataset2=this.prepareData(525)}aureliaGrid1Ready(e){this.aureliaGrid1=e}aureliaGrid2Ready(e){this.aureliaGrid2=e}defineGrids(){this.columnDefinitions1=[{id:"title",name:"Title",field:"title",sortable:!0,type:c.string,filterable:!0},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,type:c.number,filterable:!0},{id:"complete",name:"% Complete",field:"percentComplete",formatter:h.percentCompleteBar,type:c.number,filterable:!0,sortable:!0},{id:"start",name:"Start",field:"start",formatter:h.dateIso,exportWithFormatter:!0,type:c.date,filterable:!0,sortable:!0,filter:{model:b.compoundDate}},{id:"finish",name:"Finish",field:"finish",formatter:h.dateIso,exportWithFormatter:!0,type:c.date,filterable:!0,sortable:!0,filter:{model:b.compoundDate}},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",formatter:h.checkmarkMaterial,type:c.boolean,sortable:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"true"},{value:!1,label:"false"}],model:b.singleSelect}}],this.columnDefinitions2=[{id:"title",name:"Title",field:"title",sortable:!0,type:c.string,filterable:!0},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,type:c.number,filterable:!0},{id:"complete",name:"% Complete",field:"percentComplete",formatter:h.percentCompleteBar,type:c.number,filterable:!0,sortable:!0},{id:"start",name:"Start",field:"start",formatter:h.dateIso,exportWithFormatter:!0,type:c.date,filterable:!0,sortable:!0,filter:{model:b.compoundDate}},{id:"finish",name:"Finish",field:"finish",formatter:h.dateIso,exportWithFormatter:!0,type:c.date,filterable:!0,sortable:!0,filter:{model:b.compoundDate}},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",formatter:h.checkmarkMaterial,type:c.boolean,sortable:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"true"},{value:!1,label:"false"}],model:b.singleSelect}}],this.gridOptions1={enableAutoResize:!1,enableCellNavigation:!0,enableRowSelection:!0,enableCheckboxSelector:!0,enableFiltering:!0,checkboxSelector:{hideSelectAllCheckbox:!0},multiSelect:!1,rowSelectionOptions:{selectActiveRow:!0},columnPicker:{hideForceFitButton:!0},gridMenu:{hideForceFitButton:!0},gridHeight:225,gridWidth:800,enablePagination:!0,pagination:{pageSizes:[5,10,15,20,25,50,75,100],pageSize:5},presets:{pagination:{pageNumber:2,pageSize:5}}},this.gridOptions2={enableAutoResize:!1,enableCellNavigation:!0,enableFiltering:!0,checkboxSelector:{hideInFilterHeaderRow:!1,hideInColumnTitleRow:!0,applySelectOnAllPages:!0},rowSelectionOptions:{selectActiveRow:!1},enableCheckboxSelector:!0,enableRowSelection:!0,gridHeight:255,gridWidth:800,enablePagination:!0,pagination:{pageSizes:[5,10,15,20,25,50,75,100],pageSize:5},presets:{rowSelection:{dataContextIds:[3,12,13,522]}}}}prepareData(e){const i=[];for(let r=0;r<e;r++){const n=2e3+Math.floor(Math.random()*10),l=Math.floor(Math.random()*11),g=Math.floor(Math.random()*29),o=Math.round(Math.random()*100);i[r]={id:r,title:"Task "+r,duration:Math.round(Math.random()*100)+"",percentComplete:o,percentCompleteNumber:o,start:new Date(n,l,g),finish:new Date(n,l+1,g),effortDriven:r%5===0}}return i}goToGrid1FirstPage(){this.aureliaGrid1.paginationService.goToFirstPage()}goToGrid1LastPage(){this.aureliaGrid1.paginationService.goToLastPage()}goToGrid2FirstPage(){this.aureliaGrid2.paginationService.goToFirstPage()}goToGrid2LastPage(){this.aureliaGrid2.paginationService.goToLastPage()}grid1StateChanged(e){console.log("Grid State changed:: ",e),console.log("Grid State changed:: ",e.change)}grid2StateChanged(e){console.log("Grid State changed:: ",e),console.log("Grid State changed:: ",e.change),e.gridState.rowSelection&&(this.selectedGrid2IDs=e.gridState.rowSelection.filteredDataContextIds||[],this.selectedGrid2IDs=this.selectedGrid2IDs.sort((i,r)=>i-r),this.selectedTitles=this.selectedGrid2IDs.map(i=>`Task ${i}`).join(","),this.selectedTitles.length>293&&(this.selectedTitles=this.selectedTitles.substring(0,293)+"..."))}isGrid2WithPaginationChanged(){this.aureliaGrid2.paginationService.togglePaginationVisibility(this.isGrid2WithPagination)}onGrid1SelectedRowsChanged(e,i){const r=i&&i.grid;Array.isArray(i.rows)&&(this.selectedTitle=i.rows.map(n=>{const l=r.getDataItem(n);return l&&l.title||""}))}}m=ee();B(m,5,"isGrid2WithPagination",H,S);S=B(m,0,"Example10",j,S);D(m,1,S);export{S as Example10};
//# sourceMappingURL=example10-B3nQqGjQ.js.map
