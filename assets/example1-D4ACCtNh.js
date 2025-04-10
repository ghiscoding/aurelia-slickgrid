import{C as z,F as M,c as P}from"./index-CATZt-GI.js";const S="example1",p=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px" target="_blank"
      href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example1.ts">
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

<h3>
  <div class="column">
    <span class="mr-3">Grid 1</span>
    <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="toggleDarkModeGrid1()" data-test="toggle-dark-mode">
      <i class="mdi mdi-theme-light-dark"></i>
      <span>Toggle Dark Mode</span>
    </button>
  </div>
</h3>

<div class="grid-container1">
  <aurelia-slickgrid grid-id="grid1-1" column-definitions.bind="columnDefinitions1" grid-options.bind="gridOptions1"
    dataset.bind="dataset1"
    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
  </aurelia-slickgrid>
</div>

<hr />

<h3>Grid 2 <small>(with local Pagination)</small></h3>
<aurelia-slickgrid grid-id="grid1-2"
  column-definitions.bind="columnDefinitions2"
  grid-options.bind="gridOptions2"
  dataset.bind="dataset2">
</aurelia-slickgrid>
`,G=[],y={};let h;function $(t){h||(h=z.define({name:S,template:p,dependencies:G,bindables:y})),t.register(h)}const F=Object.freeze(Object.defineProperty({__proto__:null,bindables:y,default:p,dependencies:G,name:S,register:$,template:p},Symbol.toStringTag,{value:"Module"}));function s(t){const e=parseInt(t,10);return e<10?`0${e}`:e}var I=Object.create,f=Object.defineProperty,C=Object.getOwnPropertyDescriptor,W=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),x=t=>{throw TypeError(t)},O=(t,e,i)=>e in t?f(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,j=(t,e)=>f(t,"name",{value:e,configurable:!0}),q=t=>[,,,I(null)],B=["class","method","getter","setter","accessor","field","value","get","set"],T=t=>t!==void 0&&typeof t!="function"?x("Function expected"):t,L=(t,e,i,r,n)=>({kind:B[t],name:e,metadata:r,addInitializer:d=>i._?x("Already initialized"):n.push(T(d||null))}),R=(t,e)=>O(e,W("metadata"),t[3]),A=(t,e,i,r)=>{for(var n=0,d=t[e>>1],o=d&&d.length;n<o;n++)d[n].call(i);return r},N=(t,e,i,r,n,d)=>{var o,c,_,l=e&7,v=!1,k=0,E=t[k]||(t[k]=[]),m=l&&(n=n.prototype,l<5&&(l>3||!v)&&C(n,i));j(n,i);for(var u=r.length-1;u>=0;u--)_=L(l,i,c={},t[3],E),o=(0,r[u])(n,_),c._=1,T(o)&&(n=o);return R(t,n),m&&f(n,i,m),v?l^4?d:m:n},a=(t,e,i)=>O(t,typeof e!="symbol"?e+"":e,i),w,b;const D=995;w=[P(F)];class g{constructor(){a(this,"_darkModeGrid1",!1),a(this,"title","Example 1: Basic Grids"),a(this,"subTitle","Simple Grids with Fixed Sizes (800 x 225)"),a(this,"aureliaGrid1"),a(this,"gridOptions1"),a(this,"gridOptions2"),a(this,"columnDefinitions1",[]),a(this,"columnDefinitions2",[]),a(this,"dataset1",[]),a(this,"dataset2",[]),a(this,"hideSubTitle",!1),this.defineGrids()}attached(){this.dataset1=this.mockData(D),this.dataset2=this.mockData(D)}aureliaGridReady(e){this.aureliaGrid1=e}isBrowserDarkModeEnabled(){var e;return((e=window.matchMedia)==null?void 0:e.call(window,"(prefers-color-scheme: dark)").matches)??!1}detaching(){document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light"}defineGrids(){this.columnDefinitions1=[{id:"title",name:"Title",field:"title",sortable:!0,minWidth:100},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,minWidth:100},{id:"%",name:"% Complete",field:"percentComplete",sortable:!0,minWidth:100},{id:"start",name:"Start",field:"start",formatter:M.dateIso},{id:"finish",name:"Finish",field:"finish",formatter:M.dateIso},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",sortable:!0,minWidth:100}],this._darkModeGrid1=this.isBrowserDarkModeEnabled(),this.gridOptions1={darkMode:this._darkModeGrid1,gridHeight:225,gridWidth:800,enableAutoResize:!1,enableSorting:!0},this.columnDefinitions2=this.columnDefinitions1,this.gridOptions2={...this.gridOptions1,darkMode:!1,enablePagination:!0,pagination:{pageSizes:[5,10,20,25,50],pageSize:5}}}mockData(e){const i=[];for(let r=0;r<e;r++){const n=2e3+Math.floor(Math.random()*10),d=Math.floor(Math.random()*11),o=Math.floor(Math.random()*29),c=Math.round(Math.random()*100);i[r]={id:r,title:"Task "+r,duration:Math.round(Math.random()*100)+"",percentComplete:c,start:`${s(n)}-${s(d+1)}-${s(o)}`,finish:`${s(n+1)}-${s(d+1)}-${s(o)}`,effortDriven:r%5===0}}return i}toggleDarkModeGrid1(){var e,i,r;this._darkModeGrid1=!this._darkModeGrid1,this._darkModeGrid1?(e=document.querySelector(".grid-container1"))==null||e.classList.add("dark-mode"):(i=document.querySelector(".grid-container1"))==null||i.classList.remove("dark-mode"),(r=this.aureliaGrid1.slickGrid)==null||r.setOptions({darkMode:this._darkModeGrid1})}}b=q();g=N(b,0,"Example1",w,g);A(b,1,g);export{g as Example1};
//# sourceMappingURL=example1-D4ACCtNh.js.map
