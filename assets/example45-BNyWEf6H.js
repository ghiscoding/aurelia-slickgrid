import{C as J,E as j,aI as K,aJ as Q,c as Y,g as V}from"./index-CATZt-GI.js";import{f as m}from"./chunk-LSEVNFON-G8OzWBoO.js";const O="example45",C=`<div id="demo-container" class="container-fluid">
  <h2>
    Example 45: Row Detail with inner Grid
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
    <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="toggleDarkMode()" data-test="toggle-dark-mode">
      <span class="mdi mdi-theme-light-dark"></span>
      <span>Toggle Dark Mode</span>
    </button>
  </h2>

  <div class="subtitle">
    Add functionality to show extra information with a Row Detail View, (<a
      href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/row-detail"
      target="_blank"
      >Wiki docs</a>), we'll use an inner grid inside our Row Detail Component. Note that because SlickGrid uses Virtual Scroll, the rows and row details
    are often be re-rendered (when row is out of viewport range) and this means unmounting Row Detail Component which indirectly mean that
    all component states (dynamic elements, forms, ...) will be disposed as well, however you can use Grid State/Presets to reapply
    previous state whenever the row detail gets re-rendered when back to viewport.
  </div>

  <div class="row">
    <div class="col-sm-10">
      <button class="btn btn-outline-secondary btn-sm btn-icon ms-1" data-test="collapse-all-btn" click.trigger="closeAllRowDetail()">
        Close all Row Details
      </button>
      <button class="btn btn-outline-secondary btn-sm btn-icon mx-1" data-test="redraw-all-btn" click.trigger="redrawAllRowDetail()">
        Force redraw all Row Details
      </button>

      <span class="d-inline-flex gap-4px">
        <label for="detailViewRowCount">Detail View Rows Shown: </label>
        <input
          id="detailViewRowCount"
          data-test="detail-view-row-count"
          type="number"
          style="height: 26px; width: 40px"
          value.bind="detailViewRowCount"
        />
        <button
          class="btn btn-outline-secondary btn-xs btn-icon"
          style="height: 26px"
          data-test="set-count-btn"
          click.trigger="changeDetailViewRowCount()"
        >
          Set
        </button>
        <label for="serverdelay" class="ms-2">Server Delay: </label>
        <input
          id="serverdelay"
          value.bind="serverWaitDelay"
          type="number"
          data-test="server-delay"
          style="height: 26px; width: 55px"
          title="input a fake timer delay to simulate slow server response"
        />
        <label class="checkbox-inline control-label ms-2" for="useInnerGridStatePresets">
          <input
            type="checkbox"
            id="useInnerGridStatePresets"
            data-test="use-inner-grid-state-presets"
            checked.bind="isUsingInnerGridStatePresets"
            click.trigger="changeUsingInnerGridStatePresets()"
          />
          <span
            title="should we use Grid State/Presets to keep the inner grid state whenever Row Details are out and back to viewport and re-rendered"
          >
            Use Inner Grid State/Presets
          </span>
        </label>

        <label class="checkbox-inline control-label ms-2" for="useResizeAutoHeight">
          <input
            type="checkbox"
            id="useResizeAutoHeight"
            data-test="use-auto-height"
            checked.bind="isUsingAutoHeight"
            click.trigger="changeUsingResizerAutoHeight()"
          />
            Use <code>autoResize.autoHeight</code>
        </label>
      </span>
    </div>
  </div>

  <aurelia-slickgrid
    grid-id="grid45"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset"
    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
  </aurelia-slickgrid>

</div>
`,U=[],H={};let R;function Z(i){R||(R=J.define({name:O,template:C,dependencies:U,bindables:H})),i.register(R)}const $=Object.freeze(Object.defineProperty({__proto__:null,bindables:H,default:C,dependencies:U,name:O,register:Z,template:C},Symbol.toStringTag,{value:"Module"}));var X=Object.create,I=Object.defineProperty,ee=Object.getOwnPropertyDescriptor,te=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),y=i=>{throw TypeError(i)},T=(i,e,t)=>e in i?I(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,N=(i,e)=>I(i,"name",{value:e,configurable:!0}),ie=i=>[,,,X(null)],W=["class","method","getter","setter","accessor","field","value","get","set"],b=i=>i!==void 0&&typeof i!="function"?y("Function expected"):i,se=(i,e,t,a,r)=>({kind:W[i],name:e,metadata:a,addInitializer:n=>t._?y("Already initialized"):r.push(b(n||null))}),re=(i,e)=>T(e,te("metadata"),i[3]),w=(i,e,t,a)=>{for(var r=0,n=i[e>>1],p=n&&n.length;r<p;r++)e&1?n[r].call(t):a=n[r].call(t,a);return a},G=(i,e,t,a,r,n)=>{var p,l,A,g,v,s=e&7,_=!!(e&8),c=!!(e&16),k=s>3?i.length+1:s?_?1:2:0,z=W[s+5],P=s>3&&(i[k-1]=[]),q=i[k]||(i[k]=[]),d=s&&(!c&&!_&&(r=r.prototype),s<5&&(s>3||!c)&&ee(s<4?r:{get[t](){return E(this,n)},set[t](o){return M(this,n,o)}},t));s?c&&s<4&&N(n,(s>2?"set ":s>1?"get ":"")+t):N(r,t);for(var S=a.length-1;S>=0;S--)g=se(s,t,A={},i[3],q),s&&(g.static=_,g.private=c,v=g.access={has:c?o=>ae(r,o):o=>t in o},s^3&&(v.get=c?o=>(s^1?E:ne)(o,r,s^4?n:d.get):o=>o[t]),s>2&&(v.set=c?(o,D)=>M(o,r,D,s^4?n:d.set):(o,D)=>o[t]=D)),l=(0,a[S])(s?s<4?c?n:d[z]:s>4?void 0:{get:d.get,set:d.set}:r,g),A._=1,s^4||l===void 0?b(l)&&(s>4?P.unshift(l):s?c?n=l:d[z]=l:r=l):typeof l!="object"||l===null?y("Object expected"):(b(p=l.get)&&(d.get=p),b(p=l.set)&&(d.set=p),b(p=l.init)&&P.unshift(p));return s||re(i,r),d&&I(r,t,d),c?s^4?n:d:r},h=(i,e,t)=>T(i,typeof e!="symbol"?e+"":e,t),x=(i,e,t)=>e.has(i)||y("Cannot "+t),ae=(i,e)=>Object(e)!==e?y('Cannot use the "in" operator on this value'):i.has(e),E=(i,e,t)=>(x(i,e,"read from private field"),t?t.call(i):e.get(i)),M=(i,e,t,a)=>(x(i,e,"write to private field"),a?a.call(i,t):e.set(i,t),t),ne=(i,e,t)=>(x(i,e,"access private method"),t),B,F,L,u;const oe=250,le=995;L=[Y($)],F=[V],B=[V];class f{constructor(){h(this,"_darkMode",!1),h(this,"detailViewRowCount",w(u,8,this,9)),w(u,11,this),h(this,"serverWaitDelay",w(u,12,this,oe)),w(u,15,this),h(this,"columnDefinitions",[]),h(this,"gridOptions"),h(this,"aureliaGrid"),h(this,"dataset",[]),h(this,"isUsingAutoHeight",!1),h(this,"isUsingInnerGridStatePresets",!1),h(this,"hideSubTitle",!1),this.defineGrid()}get rowDetailInstance(){var e;return(e=this.aureliaGrid)==null?void 0:e.extensionService.getExtensionInstanceByName(j.rowDetailView)}aureliaGridReady(e){this.aureliaGrid=e}attached(){this.dataset=this.getData(le)}defineGrid(){this.columnDefinitions=[{id:"companyId",name:"ID",field:"companyId",cssClass:"text-end",minWidth:50,maxWidth:50,filterable:!0,sortable:!0,type:"number"},{id:"companyName",name:"Company Name",field:"companyName",width:90,filterable:!0,sortable:!0},{id:"streetAddress",name:"Street Address",field:"streetAddress",minWidth:120,filterable:!0},{id:"city",name:"City",field:"city",minWidth:120,filterable:!0},{id:"zipCode",name:"Zip Code",field:"zipCode",minWidth:120,filterable:!0},{id:"country",name:"Country",field:"country",minWidth:120,filterable:!0}],this.gridOptions={autoResize:{container:"#demo-container",autoHeight:this.isUsingAutoHeight,rightPadding:20,bottomPadding:20},enableFiltering:!0,enableRowDetailView:!0,darkMode:this._darkMode,rowHeight:33,rowDetailView:{process:e=>this.simulateServerAsyncCall(e),loadOnce:!1,useRowClick:!1,panelRows:this.detailViewRowCount,parent:this,preloadViewModel:Q,viewModel:K}}}getData(e){const t=[];for(let a=0;a<e;a++)t[a]={id:a,companyId:a,companyName:m.company.name(),city:m.location.city(),streetAddress:m.location.streetAddress(),zipCode:m.location.zipCode("######"),country:m.location.country(),orderData:[],isUsingInnerGridStatePresets:!1};return t}changeDetailViewRowCount(){var e;if((e=this.aureliaGrid)!=null&&e.extensionService){const t=this.rowDetailInstance.getOptions();t!=null&&t.panelRows&&(t.panelRows=this.detailViewRowCount,this.rowDetailInstance.setOptions(t))}}changeUsingInnerGridStatePresets(){return this.isUsingInnerGridStatePresets=!this.isUsingInnerGridStatePresets,this.closeAllRowDetail(),!0}changeUsingResizerAutoHeight(){var e;return this.isUsingAutoHeight=!this.isUsingAutoHeight,(e=this.aureliaGrid.slickGrid)==null||e.setOptions({autoResize:{...this.gridOptions.autoResize,autoHeight:this.isUsingAutoHeight}}),this.aureliaGrid.resizerService.resizeGrid(),!0}closeAllRowDetail(){var e;(e=this.rowDetailInstance)==null||e.collapseAll()}redrawAllRowDetail(){var e;(e=this.rowDetailInstance)==null||e.redrawAllViewSlots(!0)}simulateServerAsyncCall(e){let t=[];return e.id%3?t=[{orderId:"10261",shipCity:"Rio de Janeiro",freight:3.05,shipName:"Que Delícia"},{orderId:"10267",shipCity:"München",freight:208.58,shipName:"Frankenversand"},{orderId:"10281",shipCity:"Madrid",freight:2.94,shipName:"Romero y tomillo"}]:e.id%4?t=[{orderId:"10251",shipCity:"Lyon",freight:41.34,shipName:"Victuailles en stock"},{orderId:"10253",shipCity:"Rio de Janeiro",freight:58.17,shipName:"Hanari Carnes"},{orderId:"10256",shipCity:"Resende",freight:13.97,shipName:"Wellington Importadora"}]:e.id%5?t=[{orderId:"10265",shipCity:"Strasbourg",freight:55.28,shipName:"Blondel père et fils"},{orderId:"10277",shipCity:"Leipzig",freight:125.77,shipName:"Morgenstern Gesundkost"},{orderId:"10280",shipCity:"Luleå",freight:8.98,shipName:"Berglunds snabbköp"},{orderId:"10295",shipCity:"Reims",freight:1.15,shipName:"Vins et alcools Chevalier"}]:e.id%2?t=[{orderId:"10258",shipCity:"Graz",freight:140.51,shipName:"Ernst Handel"},{orderId:"10270",shipCity:"Oulu",freight:136.54,shipName:"Wartian Herkku"}]:t=[{orderId:"10255",shipCity:"Genève",freight:148.33,shipName:"Richter Supermarkt"}],new Promise(a=>{window.setTimeout(()=>{const r=e;r.orderData=t,r.isUsingInnerGridStatePresets=this.isUsingInnerGridStatePresets,a(r)},this.serverWaitDelay)})}toggleDarkMode(){var e;this._darkMode=!this._darkMode,this.toggleBodyBackground(),(e=this.aureliaGrid.slickGrid)==null||e.setOptions({darkMode:this._darkMode}),this.closeAllRowDetail()}toggleBodyBackground(){this._darkMode?(document.querySelector(".panel-wm-content").classList.add("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="dark"):(document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light")}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}u=ie();G(u,5,"detailViewRowCount",F,f);G(u,5,"serverWaitDelay",B,f);f=G(u,0,"Example45",L,f);w(u,1,f);export{f as Example45};
//# sourceMappingURL=example45-BNyWEf6H.js.map
