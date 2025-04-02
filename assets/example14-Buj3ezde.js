import{C as F,a as C,c as S}from"./index-Bz3uuwsZ.js";import{E as x}from"./excelExport.service-BVEnwJlG.js";import"./groupingFormatters.index-B6oGpPhz.js";const y="example14",m=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example14.ts">
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

<h3>Grid 1 <small>(with Header Grouping &amp; Colspan)</small></h3>
<aurelia-slickgrid grid-id="grid1"
                    column-definitions.bind="columnDefinitions1"
                    grid-options.bind="gridOptions1"
                    dataset.bind="dataset1">
</aurelia-slickgrid>

<hr />

<h3>Grid 2 <small>(with Header Grouping &amp; Frozen/Pinned Columns)</small></h3>

<div class="col-sm 12">
  <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="setFrozenColumns2(-1)"
          data-test="remove-frozen-column-button">
    <i class="mdi mdi-close"></i> Remove Frozen Columns
  </button>
  <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="setFrozenColumns2(2)"
          data-test="set-3frozen-columns">
    <i class="mdi mdi-pin-outline"></i> Set 3 Frozen Columns
  </button>
</div>

<aurelia-slickgrid grid-id="grid2"
                    column-definitions.bind="columnDefinitions2"
                    grid-options.bind="gridOptions2"
                    dataset.bind="dataset2"
                    on-aurelia-grid-created.trigger="aureliaGridReady2($event.detail)">
</aurelia-slickgrid>
`,G=[],w={};let c;function k(e){c||(c=F.define({name:y,template:m,dependencies:G,bindables:w})),e.register(c)}const T=Object.freeze(Object.defineProperty({__proto__:null,bindables:w,default:m,dependencies:G,name:y,register:k,template:m},Symbol.toStringTag,{value:"Module"}));var H=Object.create,f=Object.defineProperty,M=Object.getOwnPropertyDescriptor,R=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),z=e=>{throw TypeError(e)},D=(e,t,i)=>t in e?f(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,j=(e,t)=>f(e,"name",{value:t,configurable:!0}),A=e=>[,,,H(null)],I=["class","method","getter","setter","accessor","field","value","get","set"],O=e=>e!==void 0&&typeof e!="function"?z("Function expected"):e,N=(e,t,i,r,n)=>({kind:I[e],name:t,metadata:r,addInitializer:o=>i._?z("Already initialized"):n.push(O(o||null))}),W=(e,t)=>D(t,R("metadata"),e[3]),V=(e,t,i,r)=>{for(var n=0,o=e[t>>1],l=o&&o.length;n<l;n++)o[n].call(i);return r},$=(e,t,i,r,n,o)=>{var l,b,g,s=t&7,v=!1,_=0,E=e[_]||(e[_]=[]),d=s&&(n=n.prototype,s<5&&(s>3||!v)&&M(n,i));j(n,i);for(var u=r.length-1;u>=0;u--)g=N(s,i,b={},e[3],E),l=(0,r[u])(n,g),b._=1,O(l)&&(n=l);return W(e,n),d&&f(n,i,d),v?s^4?o:d:n},a=(e,t,i)=>D(e,typeof t!="symbol"?t+"":t,i),P,h;P=[S(T)];class p{constructor(){a(this,"title","Example 14: Column Span & Header Grouping"),a(this,"subTitle",`
  This example demonstrates how to easily span a row over multiple columns & how to group header titles.
  <ul>
    <li>Note that you can add Sort but remember that it will sort by the data which the row contains, even if the data is visually hidden by colspan it will still sort it</li>
  </ul>
  `),a(this,"aureliaGrid2"),a(this,"gridObj2"),a(this,"columnDefinitions1",[]),a(this,"columnDefinitions2",[]),a(this,"gridOptions1"),a(this,"gridOptions2"),a(this,"dataset1",[]),a(this,"dataset2",[]),a(this,"hideSubTitle",!1),this.definedGrid1(),this.definedGrid2()}attached(){this.dataset1=this.getData(500),this.dataset2=this.getData(500)}aureliaGridReady2(t){this.aureliaGrid2=t,this.gridObj2=t.slickGrid}definedGrid1(){this.columnDefinitions1=[{id:"title",name:"Title",field:"title",sortable:!0,columnGroup:"Common Factor"},{id:"duration",name:"Duration",field:"duration",columnGroup:"Common Factor"},{id:"start",name:"Start",field:"start",columnGroup:"Period"},{id:"finish",name:"Finish",field:"finish",columnGroup:"Period"},{id:"%",name:"% Complete",field:"percentComplete",selectable:!1,columnGroup:"Analysis"},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",type:C.boolean,columnGroup:"Analysis"}],this.gridOptions1={enableAutoResize:!1,enableCellNavigation:!0,enableColumnReorder:!1,enableSorting:!0,createPreHeaderPanel:!0,showPreHeaderPanel:!0,preHeaderPanelHeight:28,gridHeight:275,gridWidth:800,enableExcelExport:!0,excelExportOptions:{exportWithFormatter:!1},externalResources:[new x],explicitInitialization:!0,dataView:{globalItemMetadataProvider:{getRowMetadata:(t,i)=>this.renderDifferentColspan(t,i)}},gridMenu:{iconButtonContainer:"preheader"}}}definedGrid2(){this.columnDefinitions2=[{id:"sel",name:"#",field:"num",behavior:"select",cssClass:"cell-selection",width:40,resizable:!1,selectable:!1},{id:"title",name:"Title",field:"title",sortable:!0,columnGroup:"Common Factor"},{id:"duration",name:"Duration",field:"duration",columnGroup:"Common Factor"},{id:"start",name:"Start",field:"start",columnGroup:"Period"},{id:"finish",name:"Finish",field:"finish",columnGroup:"Period"},{id:"%",name:"% Complete",field:"percentComplete",selectable:!1,columnGroup:"Analysis"},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",type:C.boolean,columnGroup:"Analysis"}],this.gridOptions2={enableCellNavigation:!0,enableColumnReorder:!1,createPreHeaderPanel:!0,showPreHeaderPanel:!0,preHeaderPanelHeight:25,explicitInitialization:!0,gridHeight:275,gridWidth:800,frozenColumn:2,enableExcelExport:!0,excelExportOptions:{exportWithFormatter:!1},externalResources:[new x],gridMenu:{hideClearFrozenColumnsCommand:!1},headerMenu:{hideFreezeColumnsCommand:!1}}}getData(t){const i=[];for(let r=0;r<t;r++)i[r]={id:r,num:r,title:"Task "+r,duration:"5 days",percentComplete:Math.round(Math.random()*100),start:"01/01/2009",finish:"01/05/2009",effortDriven:r%5===0};return i}setFrozenColumns2(t){this.gridObj2.setOptions({frozenColumn:t}),this.gridOptions2=this.gridObj2.getOptions()}renderDifferentColspan(t,i){return t.id%2===1||i%2===1?{columns:{duration:{colspan:3}}}:{columns:{0:{colspan:"*"}}}}}h=A();p=$(h,0,"Example14",P,p);V(h,1,p);export{p as Example14};
//# sourceMappingURL=example14-Buj3ezde.js.map
