import{C as D,a as E,c as O}from"./index-Bz3uuwsZ.js";import{E as G}from"./editors.index-CmyHd4IA.js";const k="example37",m=`<h2>
  \${title}
  <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="toggleDarkMode()" data-test="toggle-dark-mode">
    <i class="mdi mdi-theme-light-dark"></i>
    <span>Toggle Dark Mode</span>
  </button>
  <span class="float-end">
    <a style="font-size: 18px" target="_blank"
      href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example37.ts">
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

<div class="subtitle"  hidden.bind="hideSubTitle"></div>

<aurelia-slickgrid
  grid-id="grid37"
  column-definitions.bind="columnDefinitions"
  grid-options.bind="gridOptions"
  dataset.bind="dataset"
  instances.bind="aureliaGrid"
  on-cell-change.trigger="handleOnCellChange($event.detail.eventData, $event.detail.args)"
  on-columns-reordered.trigger="handleOnColumnsReordered()">
</aurelia-slickgrid>
`,S=[],T={};let h;function z(i){h||(h=D.define({name:k,template:m,dependencies:S,bindables:T})),i.register(h)}const F=Object.freeze(Object.defineProperty({__proto__:null,bindables:T,default:m,dependencies:S,name:k,register:z,template:m},Symbol.toStringTag,{value:"Module"}));var q=Object.create,p=Object.defineProperty,A=Object.getOwnPropertyDescriptor,I=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),y=i=>{throw TypeError(i)},w=(i,e,t)=>e in i?p(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,P=(i,e)=>p(i,"name",{value:e,configurable:!0}),R=i=>[,,,q(null)],j=["class","method","getter","setter","accessor","field","value","get","set"],C=i=>i!==void 0&&typeof i!="function"?y("Function expected"):i,B=(i,e,t,o,a)=>({kind:j[i],name:e,metadata:o,addInitializer:n=>t._?y("Already initialized"):a.push(C(n||null))}),L=(i,e)=>w(e,I("metadata"),i[3]),$=(i,e,t,o)=>{for(var a=0,n=i[e>>1],l=n&&n.length;a<l;a++)n[a].call(t);return o},H=(i,e,t,o,a,n)=>{var l,d,_,s=e&7,f=!1,v=0,M=i[v]||(i[v]=[]),c=s&&(a=a.prototype,s<5&&(s>3||!f)&&A(a,t));P(a,t);for(var u=o.length-1;u>=0;u--)_=B(s,t,d={},i[3],M),l=(0,o[u])(a,_),d._=1,C(l)&&(a=l);return L(i,a),c&&p(a,t,c),f?s^4?n:c:a},r=(i,e,t)=>w(i,typeof e!="symbol"?e+"":e,t),x,b;const N=100;x=[O(F)];class g{constructor(){r(this,"_darkMode",!1),r(this,"title","Example 37: Footer Totals Row"),r(this,"subTitle","Display a totals row at the end of the grid."),r(this,"aureliaGrid"),r(this,"gridOptions"),r(this,"columnDefinitions",[]),r(this,"dataset",[]),r(this,"hideSubTitle",!1),r(this,"resizerPaused",!1),this.defineGrid()}attached(){this.dataset=this.loadData(N),this.updateAllTotals()}detaching(){document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light"}defineGrid(){const e=[];for(let t=0;t<10;t++)e.push({id:t,name:String.fromCharCode(65+t),field:String(t),type:E.number,width:58,editor:{model:G.integer}});this.columnDefinitions=e,this.gridOptions={autoEdit:!0,autoCommitEdit:!0,editable:!0,darkMode:this._darkMode,gridHeight:450,gridWidth:800,enableCellNavigation:!0,rowHeight:30,createFooterRow:!0,showFooterRow:!0,footerRowHeight:28}}loadData(e){const t=[];for(let o=0;o<e;o++){const a=t[o]={};a.id=o;for(let n=0;n<this.columnDefinitions.length;n++)a[n]=Math.round(Math.random()*10)}return t}handleOnCellChange(e,t){this.updateTotal(t.cell)}handleOnColumnsReordered(){this.updateAllTotals()}toggleDarkMode(){var e;this._darkMode=!this._darkMode,this.toggleBodyBackground(),(e=this.aureliaGrid.slickGrid)==null||e.setOptions({darkMode:this._darkMode}),this.updateAllTotals()}toggleBodyBackground(){this._darkMode?(document.querySelector(".panel-wm-content").classList.add("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="dark"):(document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light")}updateAllTotals(){var t;let e=((t=this.aureliaGrid.slickGrid)==null?void 0:t.getColumns().length)||0;for(;e--;)this.updateTotal(e)}updateTotal(e){var l,d;const t=(l=this.aureliaGrid.slickGrid)==null?void 0:l.getColumns()[e].id;let o=0,a=this.dataset.length;for(;a--;)o+=parseInt(this.dataset[a][t],10)||0;const n=(d=this.aureliaGrid.slickGrid)==null?void 0:d.getFooterRowColumn(t);n&&(n.textContent=`Sum: ${o}`)}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}b=R();g=H(b,0,"Example37",x,g);$(b,1,g);export{g as Example37};
//# sourceMappingURL=example37-PRrGuGnf.js.map
