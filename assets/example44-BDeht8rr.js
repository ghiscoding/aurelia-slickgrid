import{C as k,c as W}from"./index-CATZt-GI.js";import{E}from"./excelExport.service-CSmXGqy6.js";import"./groupingFormatters.index-CHREWoSu.js";const M="example44",w=`<h2>
  Example 44: colspan/rowspan with large dataset
  <span class="float-end">
    <a
      style="font-size: 18px"
      target="_blank"
      href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example44.ts"
    >
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

<div class="subtitle" >
  <p class="italic example-details">
    This page demonstrates <code>colspan</code> & <code>rowspan</code> using DataView with item metadata. <b>Note</b>:
    <code>colspan</code> & <code>rowspan</code> are rendered via row/cell indexes, any operations that could change these
    indexes (i.e. Filtering/Sorting/Paging/Column Reorder) will require you to implement proper logic to recalculate these
    indexes (it becomes your responsability). This demo does not show this because it is up to you to decide what to do when the
    span changes shape (i.e. you default to 3 rowspan but you filter a row in the middle, how do you want to proceed?).
  </p>
</div>

<section class="row mb-2">
  <div class="d-flex">
    <button class="ms-1 btn btn-outline-secondary btn-sm" data-test="add-500-rows-btn" click.trigger="loadData(500)">500 rows</button>
    <button class="ms-1 btn btn-outline-secondary btn-sm" data-test="add-5k-rows-btn" click.trigger="loadData(5000)">5k rows</button>
    <button class="ms-1 btn btn-outline-secondary btn-sm" data-test="add-50k-rows-btn" click.trigger="loadData(50000)">
      50k rows
    </button>
    <button class="mx-1 btn btn-outline-secondary btn-sm" data-test="add-50k-rows-btn" click.trigger="loadData(500000)">
      500k rows
    </button>
    <div class="mx-2"><label>data length: </label><span id="dataLn">\${dataLn}</span></div>
    <button
      id="toggleSpans"
      class="ms-1 btn btn-outline-secondary btn-sm btn-icon mx-1"
      click.trigger="handleToggleSpans()"
      data-test="toggleSpans"
    >
      <span class="mdi mdi-flip-vertical"></span>
      <span>Toggle blue cell colspan &amp; rowspan</span>
    </button>
    <button
      id="scrollTo"
      class="ms-1 btn btn-outline-secondary btn-sm btn-icon"
      click.trigger="handleScrollTo()"
      data-test="scrollToBtn"
    >
      <span class="mdi mdi-arrow-down"></span>
      <span>Scroll To Row</span>
    </button>
    <div class="input-group input-group-sm ms-1" style="width: 100px">
      <input
        value.bind="scrollToRow"
        id="nRow"
        type="text"
        data-test="nbrows"
        class="form-control search-string"
        placeholder="search value"
        autocomplete="off"
      />
      <button
        class="btn btn-sm btn-outline-secondary d-flex align-items-center"
        data-test="clearScrollTo"
        click.trigger="clearScrollTo()"
      >
        <span class="icon mdi mdi-close-thick"></span>
      </button>
    </div>
  </div>
</section>

<aurelia-slickgrid
  grid-id="grid44"
  column-definitions.bind="columnDefinitions"
  grid-options.bind="gridOptions"
  dataset.bind="dataset"
  instances.bind="aureliaGrid">
</aurelia-slickgrid>
`,v=[],_={};let b;function R(a){b||(b=k.define({name:M,template:w,dependencies:v,bindables:_})),a.register(b)}const I=Object.freeze(Object.defineProperty({__proto__:null,bindables:_,default:w,dependencies:v,name:M,register:R,template:w},Symbol.toStringTag,{value:"Module"}));var D=Object.create,g=Object.defineProperty,O=Object.getOwnPropertyDescriptor,V=(a,t)=>(t=Symbol[a])?t:Symbol.for("Symbol."+a),T=a=>{throw TypeError(a)},S=(a,t,e)=>t in a?g(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e,z=(a,t)=>g(a,"name",{value:t,configurable:!0}),L=a=>[,,,D(null)],N=["class","method","getter","setter","accessor","field","value","get","set"],F=a=>a!==void 0&&typeof a!="function"?T("Function expected"):a,j=(a,t,e,i,r)=>({kind:N[a],name:t,metadata:i,addInitializer:l=>e._?T("Already initialized"):r.push(F(l||null))}),$=(a,t)=>S(t,V("metadata"),a[3]),q=(a,t,e,i)=>{for(var r=0,l=a[t>>1],d=l&&l.length;r<d;r++)l[r].call(e);return i},H=(a,t,e,i,r,l)=>{var d,c,p,s=t&7,y=!1,C=0,P=a[C]||(a[C]=[]),h=s&&(r=r.prototype,s<5&&(s>3||!y)&&O(r,e));z(r,e);for(var u=i.length-1;u>=0;u--)p=j(s,e,c={},a[3],P),d=(0,i[u])(r,p),c._=1,F(d)&&(r=d);return $(a,r),h&&g(r,e,h),y?s^4?l:h:r},m=(a,t,e)=>S(a,typeof t!="symbol"?t+"":t,e),G,x;const n=(a,t,e)=>`<div class="cellValue">${e.toFixed(2)}</div><div class="valueComment">${a}.${t}</div>`,o=(a,t,e)=>e.toFixed(2);G=[W(I)];class f{constructor(){m(this,"aureliaGrid"),m(this,"gridOptions"),m(this,"columnDefinitions",[]),m(this,"dataLn","loading..."),m(this,"dataset",[]),m(this,"hideSubTitle",!1),m(this,"scrollToRow",100),m(this,"metadata",{0:{columns:{1:{rowspan:3}}},2:{columns:{0:{rowspan:3},3:{colspan:3}}},3:{columns:{1:{rowspan:5,colspan:1,cssClass:"cell-var-span"},3:{rowspan:3,colspan:5}}},8:{columns:{1:{rowspan:80},3:{rowspan:1999,colspan:2,cssClass:"cell-very-high"}}},12:{columns:{11:{rowspan:3}}},15:{columns:{18:{colspan:4,rowspan:3}}},85:{columns:{5:{rowspan:20}}}}),this.defineGrid()}attached(){this.loadData(500)}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",minWidth:80},{id:"revenueGrowth",name:"Revenue Growth",field:"revenueGrowth",exportCustomFormatter:o,formatter:n,type:"number",minWidth:120},{id:"pricingPolicy",name:"Pricing Policy",field:"pricingPolicy",minWidth:110,sortable:!0,exportCustomFormatter:o,formatter:n,type:"number"},{id:"policyIndex",name:"Policy Index",field:"policyIndex",minWidth:100,exportCustomFormatter:o,formatter:n,type:"number"},{id:"expenseControl",name:"Expense Control",field:"expenseControl",minWidth:110,exportCustomFormatter:o,formatter:n,type:"number"},{id:"excessCash",name:"Excess Cash",field:"excessCash",minWidth:100,exportCustomFormatter:o,formatter:n,type:"number"},{id:"netTradeCycle",name:"Net Trade Cycle",field:"netTradeCycle",minWidth:110,exportCustomFormatter:o,formatter:n,type:"number"},{id:"costCapital",name:"Cost of Capital",field:"costCapital",minWidth:100,exportCustomFormatter:o,formatter:n,type:"number"},{id:"revenueGrowth2",name:"Revenue Growth",field:"revenueGrowth2",exportCustomFormatter:o,formatter:n,type:"number",minWidth:120},{id:"pricingPolicy2",name:"Pricing Policy",field:"pricingPolicy2",minWidth:110,sortable:!0,exportCustomFormatter:o,formatter:n,type:"number"},{id:"policyIndex2",name:"Policy Index",field:"policyIndex2",minWidth:100,exportCustomFormatter:o,formatter:n,type:"number"},{id:"expenseControl2",name:"Expense Control",field:"expenseControl2",minWidth:110,exportCustomFormatter:o,formatter:n,type:"number"},{id:"excessCash2",name:"Excess Cash",field:"excessCash2",minWidth:100,exportCustomFormatter:o,formatter:n,type:"number"},{id:"netTradeCycle2",name:"Net Trade Cycle",field:"netTradeCycle2",minWidth:110,exportCustomFormatter:o,formatter:n,type:"number"},{id:"costCapital2",name:"Cost of Capital",field:"costCapital2",minWidth:100,exportCustomFormatter:o,formatter:n,type:"number"},{id:"revenueGrowth3",name:"Revenue Growth",field:"revenueGrowth3",exportCustomFormatter:o,formatter:n,type:"number",minWidth:120},{id:"pricingPolicy3",name:"Pricing Policy",field:"pricingPolicy3",minWidth:110,sortable:!0,exportCustomFormatter:o,formatter:n,type:"number"},{id:"policyIndex3",name:"Policy Index",field:"policyIndex3",minWidth:100,exportCustomFormatter:o,formatter:n,type:"number"},{id:"expenseControl3",name:"Expense Control",field:"expenseControl3",minWidth:110,exportCustomFormatter:o,formatter:n,type:"number"},{id:"excessCash3",name:"Excess Cash",field:"excessCash3",minWidth:100,exportCustomFormatter:o,formatter:n,type:"number"},{id:"netTradeCycle3",name:"Net Trade Cycle",field:"netTradeCycle3",minWidth:110,exportCustomFormatter:o,formatter:n,type:"number"},{id:"costCapital3",name:"Cost of Capital",field:"costCapital3",minWidth:100,exportCustomFormatter:o,formatter:n,type:"number"}],this.gridOptions={enableCellNavigation:!0,enableColumnReorder:!0,enableCellRowSpan:!0,enableHeaderMenu:!1,gridHeight:600,gridWidth:900,rowHeight:30,dataView:{globalItemMetadataProvider:{getRowMetadata:(t,e)=>this.renderDifferentColspan(t,e)}},enableExcelExport:!0,externalResources:[new E],rowTopOffsetRenderType:"top"}}clearScrollTo(){var t;this.scrollToRow=0,(t=document.querySelector("#nRow"))==null||t.focus()}loadData(t){this.dataLn="loading...",setTimeout(()=>{var i,r,l,d,c,p;const e=[];for(let s=0;s<t;s++)e[s]={id:s,title:"Task "+s,revenueGrowth:Math.random()*Math.pow(10,Math.random()*3),pricingPolicy:Math.random()*Math.pow(10,Math.random()*3),policyIndex:Math.random()*Math.pow(10,Math.random()*3),expenseControl:Math.random()*Math.pow(10,Math.random()*3),excessCash:Math.random()*Math.pow(10,Math.random()*3),netTradeCycle:Math.random()*Math.pow(10,Math.random()*3),costCapital:Math.random()*Math.pow(10,Math.random()*3),revenueGrowth2:Math.random()*Math.pow(10,Math.random()*3),pricingPolicy2:Math.random()*Math.pow(10,Math.random()*3),policyIndex2:Math.random()*Math.pow(10,Math.random()*3),expenseControl2:Math.random()*Math.pow(10,Math.random()*3),excessCash2:Math.random()*Math.pow(10,Math.random()*3),netTradeCycle2:Math.random()*Math.pow(10,Math.random()*3),costCapital2:Math.random()*Math.pow(10,Math.random()*3),revenueGrowth3:Math.random()*Math.pow(10,Math.random()*3),pricingPolicy3:Math.random()*Math.pow(10,Math.random()*3),policyIndex3:Math.random()*Math.pow(10,Math.random()*3),expenseControl3:Math.random()*Math.pow(10,Math.random()*3),excessCash3:Math.random()*Math.pow(10,Math.random()*3),netTradeCycle3:Math.random()*Math.pow(10,Math.random()*3),costCapital3:Math.random()*Math.pow(10,Math.random()*3)};this.metadata[8].columns[3].rowspan=e.length-8,(r=(i=this.aureliaGrid)==null?void 0:i.dataView)==null||r.beginUpdate(),(d=(l=this.aureliaGrid)==null?void 0:l.dataView)==null||d.setItems(e),(p=(c=this.aureliaGrid)==null?void 0:c.dataView)==null||p.endUpdate(),this.dataLn=t},20)}renderDifferentColspan(t,e){var i;return(i=this.metadata[e])!=null&&i.attributes?this.metadata[e]:this.metadata[e]={attributes:{"data-row":e},...this.metadata[e]}}handleToggleSpans(){var e,i;const t=this.metadata[3].columns[1];t.colspan===1?(t.rowspan=3,t.colspan=2):(t.rowspan=5,t.colspan=1),(e=this.aureliaGrid.slickGrid)==null||e.invalidateRows([3,4,5,6,7]),(i=this.aureliaGrid.slickGrid)==null||i.render()}handleScrollTo(){var t;return(t=this.aureliaGrid.slickGrid)==null||t.scrollRowToTop(this.scrollToRow),!1}toggleSubTitle(){var e;this.hideSubTitle=!this.hideSubTitle;const t=this.hideSubTitle?"add":"remove";(e=document.querySelector(".subtitle"))==null||e.classList[t]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}x=L();f=H(x,0,"Example44",G,f);q(x,1,f);export{f as Example44};
//# sourceMappingURL=example44-BDeht8rr.js.map
