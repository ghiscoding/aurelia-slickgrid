import{C as T,E,b as v,F as p,c as B}from"./index-xBMUucNl.js";const C="example16",y=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example16.ts">
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
  <div class="col-sm-12">
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="hide-duration-btn"
            click.trigger="hideDurationColumnDynamically()">
      <i class="mdi mdi-eye-off-outline"></i>
      Dynamically Hide "Duration"
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="disable-filters-btn"
            click.trigger="disableFilters()">
      <i class="mdi mdi-close"></i>
      Disable Filters
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="disable-sorting-btn"
            click.trigger="disableSorting()">
      <i class="mdi mdi-close"></i>
      Disable Sorting
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="toggle-filtering-btn" click.trigger="toggleFilter()">
      <i class="mdi mdi-swap-vertical"></i>
      Toggle Filtering
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="toggle-sorting-btn" click.trigger="toggleSorting()">
      <i class="mdi mdi-swap-vertical"></i>
      Toggle Sorting
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="add-crud-columns-btn" click.trigger="addEditDeleteColumns()">
      <i class="mdi mdi-shape-square-plus"></i>
      Add Edit/Delete Columns
    </button>
  </div>
</div>

<br />

<aurelia-slickgrid grid-id="grid16"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
`,R=[],D={};let w;function O(i){w||(w=T.define({name:C,template:y,dependencies:R,bindables:D})),i.register(w)}const P=Object.freeze(Object.defineProperty({__proto__:null,bindables:D,default:y,dependencies:R,name:C,register:O,template:y},Symbol.toStringTag,{value:"Module"}));var V=Object.create,_=Object.defineProperty,z=Object.getOwnPropertyDescriptor,A=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),M=i=>{throw TypeError(i)},k=(i,e,t)=>e in i?_(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,j=(i,e)=>_(i,"name",{value:e,configurable:!0}),H=i=>[,,,V(null)],W=["class","method","getter","setter","accessor","field","value","get","set"],F=i=>i!==void 0&&typeof i!="function"?M("Function expected"):i,N=(i,e,t,o,n)=>({kind:W[i],name:e,metadata:o,addInitializer:a=>t._?M("Already initialized"):n.push(F(a||null))}),$=(i,e)=>k(e,A("metadata"),i[3]),q=(i,e,t,o)=>{for(var n=0,a=i[e>>1],s=a&&a.length;n<s;n++)a[n].call(t);return o},Y=(i,e,t,o,n,a)=>{var s,h,m,r=e&7,b=!1,c=0,f=i[c]||(i[c]=[]),u=r&&(n=n.prototype,r<5&&(r>3||!b)&&z(n,t));j(n,t);for(var g=o.length-1;g>=0;g--)m=N(r,t,h={},i[3],f),s=(0,o[g])(n,m),h._=1,F(s)&&(n=s);return $(i,n),u&&_(n,t,u),b?r^4?a:u:n},d=(i,e,t)=>k(i,typeof e!="symbol"?e+"":e,t),I,x;I=[B(P)];class S{constructor(){d(this,"title","Example 16: Row Move & Checkbox Selector"),d(this,"subTitle",`
    This example demonstrates using the <b>Slick.Plugins.RowMoveManager</b> plugin to easily move a row in the grid.<br/>
    <ul>
      <li>Click to select, Ctrl+Click to toggle selection, Shift+Click to select a range.</li>
      <li>Drag one or more rows by the handle (icon) to reorder</li>
      <li>If you plan to use Row Selection + Row Move, then use "singleRowMove: true" and "disableRowSelection: true"</li>
      <li>You can change "columnIndexPosition" to move the icon position of any extension (RowMove, RowDetail or RowSelector icon)</li>
      <ul>
        <li>You will also want to enable the DataView "syncGridSelection: true" to keep row selection even after a row move</li>
      </ul>
      <li>If you plan to use only Row Move, then you could keep default values (or omit them completely) of "singleRowMove: false" and "disableRowSelection: false"</li>
      <ul>
        <li>SingleRowMove has the name suggest will only move 1 row at a time, by default it will move any row(s) that are selected unless you disable the flag</li>
      </ul>
    </ul>
  `),d(this,"aureliaGrid"),d(this,"columnDefinitions",[]),d(this,"gridOptions"),d(this,"dataset",[]),d(this,"hideSubTitle",!1),this.defineGrid()}aureliaGridReady(e){this.aureliaGrid=e}get rowMoveInstance(){var e;return(e=this.aureliaGrid)==null?void 0:e.extensionService.getExtensionInstanceByName(E.rowMoveManager)}attached(){this.getData()}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",filterable:!0},{id:"duration",name:"Duration",field:"duration",filterable:!0,sortable:!0},{id:"%",name:"% Complete",field:"percentComplete",filterable:!0,sortable:!0},{id:"start",name:"Start",field:"start",filterable:!0,sortable:!0,filter:{model:v.compoundDate}},{id:"finish",name:"Finish",field:"finish",filterable:!0,sortable:!0,filter:{model:v.compoundDate}},{id:"effort-driven",name:"Completed",field:"effortDriven",formatter:p.checkmarkMaterial,filterable:!0,sortable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:v.singleSelect}}],this.gridOptions={enableAutoResize:!0,autoResize:{container:"#demo-container",rightPadding:10},enableFiltering:!0,enableCheckboxSelector:!0,checkboxSelector:{hideSelectAllCheckbox:!1,columnIndexPosition:1,hideInFilterHeaderRow:!1,hideInColumnTitleRow:!0},enableRowSelection:!0,rowSelectionOptions:{selectActiveRow:!1},dataView:{syncGridSelection:!0},enableRowMoveManager:!0,rowMoveManager:{columnIndexPosition:0,singleRowMove:!0,disableRowSelection:!0,cancelEditOnDrag:!0,hideRowMoveShadow:!1,width:30,onBeforeMoveRows:this.onBeforeMoveRow.bind(this),onMoveRows:this.onMoveRows.bind(this)},showCustomFooter:!0,presets:{rowSelection:{dataContextIds:[1,2,6,7]}}}}getData(){const e=[];for(let t=0;t<500;t++)e[t]={id:t,title:"Task "+t,duration:Math.round(Math.random()*25)+" days",percentComplete:Math.round(Math.random()*100),start:"01/01/2009",finish:"01/05/2009",effortDriven:t%5===0};this.dataset=e}onBeforeMoveRow(e,t){for(const o of t.rows)if(o===t.insertBefore||o===t.insertBefore-1&&t.insertBefore-1!==this.aureliaGrid.dataView.getItemCount())return e.preventDefault(),!1;return!0}onMoveRows(e,t){const o=t.rows,n=t.insertBefore,a=[];this.aureliaGrid.dataView.sort(void 0,!0);const s=this.aureliaGrid.dataView.getItems(),h=this.aureliaGrid.dataView.getFilteredItems(),m=this.aureliaGrid.dataView.getItem(n),r=m?this.aureliaGrid.dataView.getIdxById(m.id):this.aureliaGrid.dataView.getItemCount(),b=[];o.forEach(l=>b.push(h[l]));const c=b.map(l=>this.aureliaGrid.dataView.getIdxById(l.id)),f=s.slice(0,r),u=s.slice(r,s.length);o.sort((l,G)=>l-G);for(const l of c)l&&a.push(s[l]);c.reverse();for(const l of c)l!==void 0&&r!==void 0&&(l<r?f.splice(l,1):u.splice(l-r,1));const g=f.concat(a.concat(u));this.dataset=g}hideDurationColumnDynamically(){this.aureliaGrid.gridService.hideColumnById("duration")}disableFilters(){this.aureliaGrid.filterService.disableFilterFunctionality(!0)}disableSorting(){this.aureliaGrid.sortService.disableSortFunctionality(!0)}addEditDeleteColumns(){if(this.columnDefinitions[0].id!=="change-symbol"){const e=[{id:"change-symbol",field:"id",excludeFromColumnPicker:!0,excludeFromGridMenu:!0,excludeFromHeaderMenu:!0,formatter:p.icon,params:{iconCssClass:"mdi mdi-pencil pointer"},minWidth:30,maxWidth:30,onCellClick:(o,n)=>{alert(`Technically we should Edit "Task ${n.dataContext.id}"`)}},{id:"delete-symbol",field:"id",excludeFromColumnPicker:!0,excludeFromGridMenu:!0,excludeFromHeaderMenu:!0,formatter:p.icon,params:{iconCssClass:"mdi mdi-trash-can pointer"},minWidth:30,maxWidth:30,onCellClick:(o,n)=>{confirm("Are you sure?")&&this.aureliaGrid.gridService.deleteItemById(n.dataContext.id)}}],t=this.aureliaGrid.gridService.getAllColumnDefinitions();t.unshift(e[0],e[1]),this.columnDefinitions=[...t]}}toggleFilter(){this.aureliaGrid.filterService.toggleFilterFunctionality()}toggleSorting(){this.aureliaGrid.sortService.toggleSortFunctionality()}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}x=H();S=Y(x,0,"Example16",I,S);q(x,1,S);export{S as Example16};
//# sourceMappingURL=example16-BbB8iv9Z.js.map
