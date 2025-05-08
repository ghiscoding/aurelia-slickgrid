import{C as J,a as f,O as W,b,F as S,aI as K,g as Q,c as U}from"./index-BEnHDSQL.js";const A="example42",T=`<div class="container-fluid">
  <h2>
    Example 42: Custom Pagination
    <span class="float-end">
      <a style="font-size: 18px" target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example42.ts">
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

  <div class="subtitle">
    You can create a Custom Pagination by passing an Aurelia Custom Element and it must <code>implements BasePaginationComponent</code>.
    Any of the pagination controls could be moved anywhere on the page (for example we purposely moved the page size away from the rest of the pagination elements).
  </div>

  <div>
    <button class="btn btn-outline-secondary btn-icon" click.trigger="togglePaginationPosition()" data-text="toggle-pagination-btn">
      <span class="mdi mdi-swap-vertical"></span>
      <span>Toggle Pagination Position</span>
    </button>

    <span class="margin-15px">
      Page Size
      <input type="text" class="input is-small is-narrow" data-test="page-size-input" value.bind="pageSize" style="width: 55px">
    </span>
  </div>

  <aurelia-slickgrid
    grid-id="grid42"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset"
    instances.bind="aureliaGrid"
    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
  </aurelia-slickgrid>
</div>
`,N=[],Y={};let O;function X(e){O||(O=J.define({name:A,template:T,dependencies:N,bindables:Y})),e.register(O)}const Z=Object.freeze(Object.defineProperty({__proto__:null,bindables:Y,default:T,dependencies:N,name:A,register:X,template:T},Symbol.toStringTag,{value:"Module"}));var ee=Object.create,E=Object.defineProperty,te=Object.getOwnPropertyDescriptor,ie=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),y=e=>{throw TypeError(e)},$=(e,t,i)=>t in e?E(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,M=(e,t)=>E(e,"name",{value:t,configurable:!0}),ne=e=>[,,,ee(null)],j=["class","method","getter","setter","accessor","field","value","get","set"],v=e=>e!==void 0&&typeof e!="function"?y("Function expected"):e,ae=(e,t,i,a,r)=>({kind:j[e],name:t,metadata:a,addInitializer:o=>i._?y("Already initialized"):r.push(v(o||null))}),re=(e,t)=>$(t,ie("metadata"),e[3]),F=(e,t,i,a)=>{for(var r=0,o=e[t>>1],d=o&&o.length;r<d;r++)t&1?o[r].call(i):a=o[r].call(i,a);return a},q=(e,t,i,a,r,o)=>{var d,s,h,u,C,n=t&7,w=!!(t&8),c=!!(t&16),x=n>3?e.length+1:n?w?1:2:0,G=j[n+5],I=n>3&&(e[x-1]=[]),L=e[x]||(e[x]=[]),p=n&&(!c&&!w&&(r=r.prototype),n<5&&(n>3||!c)&&te(n<4?r:{get[i](){return B(this,o)},set[i](l){return R(this,o,l)}},i));n?c&&n<4&&M(o,(n>2?"set ":n>1?"get ":"")+i):M(r,i);for(var z=a.length-1;z>=0;z--)u=ae(n,i,h={},e[3],L),n&&(u.static=w,u.private=c,C=u.access={has:c?l=>oe(r,l):l=>i in l},n^3&&(C.get=c?l=>(n^1?B:se)(l,r,n^4?o:p.get):l=>l[i]),n>2&&(C.set=c?(l,D)=>R(l,r,D,n^4?o:p.set):(l,D)=>l[i]=D)),s=(0,a[z])(n?n<4?c?o:p[G]:n>4?void 0:{get:p.get,set:p.set}:r,u),h._=1,n^4||s===void 0?v(s)&&(n>4?I.unshift(s):n?c?o=s:p[G]=s:r=s):typeof s!="object"||s===null?y("Object expected"):(v(d=s.get)&&(p.get=d),v(d=s.set)&&(p.set=d),v(d=s.init)&&I.unshift(d));return n||re(e,r),p&&E(r,i,p),c?n^4?o:p:r},m=(e,t,i)=>$(e,typeof t!="symbol"?t+"":t,i),k=(e,t,i)=>t.has(e)||y("Cannot "+i),oe=(e,t)=>Object(t)!==t?y('Cannot use the "in" operator on this value'):e.has(t),B=(e,t,i)=>(k(e,t,"read from private field"),i?i.call(e):t.get(e)),R=(e,t,i,a)=>(k(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),se=(e,t,i)=>(k(e,t,"access private method"),i),H,V,g;const le=5e3;function _(e,t){return Math.floor(Math.random()*(t-e+1)+e)}V=[U(Z)],H=[Q()];class P{constructor(){m(this,"pageSize",F(g,8,this,50)),F(g,11,this),m(this,"columnDefinitions",[]),m(this,"gridContainerElm"),m(this,"gridOptions"),m(this,"dataset",[]),m(this,"paginationPosition","top"),m(this,"aureliaGrid"),m(this,"hideSubTitle",!1),m(this,"paginationOptions"),this.defineGrid()}attached(){this.dataset=this.loadData(le)}aureliaGridReady(t){this.aureliaGrid=t}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"id",minWidth:100,sortable:!0,filterable:!0,formatter:(t,i,a)=>`Task ${a}`,params:{useFormatterOuputToFilter:!0}},{id:"description",name:"Description",field:"description",filterable:!0,sortable:!0,minWidth:80,type:f.string},{id:"percentComplete",name:"% Complete",field:"percentComplete",minWidth:120,sortable:!0,customTooltip:{position:"center"},formatter:S.progressBar,type:f.number,filterable:!0,filter:{model:b.sliderRange,maxValue:100,operator:W.rangeInclusive,filterOptions:{hideSliderNumbers:!1,min:0,step:5}}},{id:"start",name:"Start",field:"start",formatter:S.dateIso,sortable:!0,minWidth:75,width:100,exportWithFormatter:!0,type:f.date,filterable:!0,filter:{model:b.compoundDate}},{id:"finish",name:"Finish",field:"finish",formatter:S.dateIso,sortable:!0,minWidth:75,width:120,exportWithFormatter:!0,type:f.date,filterable:!0,filter:{model:b.dateRange}},{id:"duration",field:"duration",name:"Duration",maxWidth:90,type:f.number,sortable:!0,filterable:!0,filter:{model:b.input,operator:W.rangeExclusive}},{id:"completed",name:"Completed",field:"completed",minWidth:85,maxWidth:90,formatter:S.checkmarkMaterial,exportWithFormatter:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:b.singleSelect,filterOptions:{autoAdjustDropHeight:!0}}}],this.gridOptions={autoResize:{container:"#demo-container",bottomPadding:this.paginationPosition==="top"?-1:38},enableExcelCopyBuffer:!0,enableFiltering:!0,customPaginationComponent:K,enablePagination:!0,pagination:{pageSize:this.pageSize},rowHeight:40}}loadData(t){const i=[];for(let a=0,r=t;a<r;a++){const o=_(0,365),d=_(new Date().getFullYear(),new Date().getFullYear()+1),s=_(0,12),h=_(10,28),u=_(0,100);i.push({id:a,title:"Task "+a,description:a%5?"desc "+a:null,duration:o,percentComplete:u,percentCompleteNumber:u,start:a%4?null:new Date(d,s,h),finish:new Date(d,s,h),completed:u===100})}return i}pageSizeChanged(t){var i;(i=this.aureliaGrid.paginationService)==null||i.changeItemPerPage(t)}togglePaginationPosition(){var i,a;const t=document.querySelector(`#${this.aureliaGrid.slickGrid.getOptions().gridContainerId||""}`);this.paginationPosition=this.paginationPosition==="top"?"bottom":"top",(i=this.aureliaGrid.paginationComponent)==null||i.disposeElement(),(a=this.aureliaGrid.paginationComponent)==null||a.renderPagination(t,this.paginationPosition)}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const t=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[t]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}g=ne();q(g,5,"pageSize",H,P);P=q(g,0,"Example42",V,P);F(g,1,P);export{P as Example42};
//# sourceMappingURL=example42-kZujYMPL.js.map
