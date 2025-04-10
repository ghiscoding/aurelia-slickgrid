import{C as H,E as Q,a as p,F as g,b as y,v as U,w as X,c as Z,g as G}from"./index-CATZt-GI.js";import{E as F}from"./editors.index-BChC4Eh8.js";const N="example19",R=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px" target="_blank"
      href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example19.ts">
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

<div class="subtitle" innerhtml.bind="subTitle"></div>

<div class="row">
  <div class="col-sm-6">
    <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="changeEditableGrid()" data-test="editable-grid-btn">
      Make Grid Editable
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="closeAllRowDetail()" data-test="collapse-all-btn">
      Close all Row Details
    </button>
    &nbsp;&nbsp;

    <span class="d-inline-flex gap-4px">
      <label for="detailViewRowCount">Detail View Rows Shown: </label>
      <input id="detailViewRowCount" type="number" value.bind="detailViewRowCount" style="height: 26px; width: 40px">
      <button class="btn btn-outline-secondary btn-xs btn-icon" style="height: 26px;" click.trigger="changeDetailViewRowCount()"
        data-test="set-count-btn">
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
    </span>
  </div>
  <div class="alert alert-\${flashAlertType} col-sm-6" if.bind="message" data-test="flash-msg">
    \${message}
  </div>
</div>

<hr />

<aurelia-slickgrid grid-id="grid19" column-definitions.bind="columnDefinitions" grid-options.bind="gridOptions"
  dataset.bind="dataset" extensions.bind="extensions" instances.bind="aureliaGrid">
</aurelia-slickgrid>
`,z=[],q={};let C;function ee(i){C||(C=H.define({name:N,template:R,dependencies:z,bindables:q})),i.register(C)}const te=Object.freeze(Object.defineProperty({__proto__:null,bindables:q,default:R,dependencies:z,name:N,register:ee,template:R},Symbol.toStringTag,{value:"Module"}));var ie=Object.create,E=Object.defineProperty,ae=Object.getOwnPropertyDescriptor,ne=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),_=i=>{throw TypeError(i)},L=(i,e,t)=>e in i?E(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,P=(i,e)=>E(i,"name",{value:e,configurable:!0}),oe=i=>[,,,ie(null)],J=["class","method","getter","setter","accessor","field","value","get","set"],f=i=>i!==void 0&&typeof i!="function"?_("Function expected"):i,re=(i,e,t,r,n)=>({kind:J[i],name:e,metadata:r,addInitializer:o=>t._?_("Already initialized"):n.push(f(o||null))}),le=(i,e)=>L(e,ne("metadata"),i[3]),w=(i,e,t,r)=>{for(var n=0,o=i[e>>1],s=o&&o.length;n<s;n++)e&1?o[n].call(t):r=o[n].call(t,r);return r},T=(i,e,t,r,n,o)=>{var s,d,V,b,D,a=e&7,k=!!(e&8),m=!!(e&16),M=a>3?i.length+1:a?k?1:2:0,I=J[a+5],A=a>3&&(i[M-1]=[]),K=i[M]||(i[M]=[]),u=a&&(!m&&!k&&(n=n.prototype),a<5&&(a>3||!m)&&ae(a<4?n:{get[t](){return W(this,o)},set[t](l){return B(this,o,l)}},t));a?m&&a<4&&P(o,(a>2?"set ":a>1?"get ":"")+t):P(n,t);for(var S=r.length-1;S>=0;S--)b=re(a,t,V={},i[3],K),a&&(b.static=k,b.private=m,D=b.access={has:m?l=>se(n,l):l=>t in l},a^3&&(D.get=m?l=>(a^1?W:de)(l,n,a^4?o:u.get):l=>l[t]),a>2&&(D.set=m?(l,x)=>B(l,n,x,a^4?o:u.set):(l,x)=>l[t]=x)),d=(0,r[S])(a?a<4?m?o:u[I]:a>4?void 0:{get:u.get,set:u.set}:n,b),V._=1,a^4||d===void 0?f(d)&&(a>4?A.unshift(d):a?m?o=d:u[I]=d:n=d):typeof d!="object"||d===null?_("Object expected"):(f(s=d.get)&&(u.get=s),f(s=d.set)&&(u.set=s),f(s=d.init)&&A.unshift(s));return a||le(i,n),u&&E(n,t,u),m?a^4?o:u:n},c=(i,e,t)=>L(i,typeof e!="symbol"?e+"":e,t),O=(i,e,t)=>e.has(i)||_("Cannot "+t),se=(i,e)=>Object(e)!==e?_('Cannot use the "in" operator on this value'):i.has(e),W=(i,e,t)=>(O(i,e,"read from private field"),t?t.call(i):e.get(i)),B=(i,e,t,r)=>(O(i,e,"write to private field"),r?r.call(i,t):e.set(i,t),t),de=(i,e,t)=>(O(i,e,"access private method"),t),Y,$,j,h;const ce=250,ue=1e3;j=[Z(te)],$=[G],Y=[G];class v{constructor(){c(this,"_darkMode",!1),c(this,"detailViewRowCount",w(h,8,this,9)),w(h,11,this),c(this,"serverWaitDelay",w(h,12,this,ce)),w(h,15,this),c(this,"title","Example 19: Row Detail View"),c(this,"subTitle",`
    Add functionality to show extra information with a Row Detail View, (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/row-detail" target="_blank">Wiki docs</a>)
    <ul>
      <li>Click on the row "+" icon or anywhere on the row to open it (the latter can be changed via property "useRowClick: false")</li>
      <li>Pass a View/Model as a Template to the Row Detail</li>
      <li>You can use "expandableOverride()" callback to override logic to display expand icon on every row (for example only show it every 2nd row)</li>
    </ul>
  `),c(this,"aureliaGrid"),c(this,"gridOptions"),c(this,"columnDefinitions",[]),c(this,"dataset",[]),c(this,"flashAlertType","info"),c(this,"hideSubTitle",!1),c(this,"message",""),this.defineGrid()}get rowDetailInstance(){var e;return(e=this.aureliaGrid)==null?void 0:e.extensionService.getExtensionInstanceByName(Q.rowDetailView)}attached(){this.getData()}detaching(){document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light"}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",sortable:!0,type:p.string,width:70,filterable:!0,editor:{model:F.text}},{id:"duration",name:"Duration (days)",field:"duration",formatter:g.decimal,params:{minDecimal:1,maxDecimal:2},sortable:!0,type:p.number,minWidth:90,filterable:!0},{id:"percent2",name:"% Complete",field:"percentComplete2",editor:{model:F.slider},formatter:g.progressBar,type:p.number,sortable:!0,minWidth:100,filterable:!0,filter:{model:y.slider,operator:">"}},{id:"start",name:"Start",field:"start",formatter:g.dateIso,sortable:!0,type:p.date,minWidth:90,exportWithFormatter:!0,filterable:!0,filter:{model:y.compoundDate}},{id:"finish",name:"Finish",field:"finish",formatter:g.dateIso,sortable:!0,type:p.date,minWidth:90,exportWithFormatter:!0,filterable:!0,filter:{model:y.compoundDate}},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",minWidth:100,formatter:g.checkmarkMaterial,type:p.boolean,filterable:!0,sortable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:y.singleSelect}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableFiltering:!0,enableRowDetailView:!0,darkMode:this._darkMode,datasetIdPropertyName:"rowId",rowDetailView:{process:e=>this.simulateServerAsyncCall(e),loadOnce:!0,singleRowExpand:!1,useRowClick:!0,panelRows:this.detailViewRowCount,preloadViewModel:X,viewModel:U,parent:this,onBeforeRowDetailToggle:(e,t)=>(console.log("before toggling row detail",t.item),!0)},rowSelectionOptions:{selectActiveRow:!0}}}getData(){const e=[];for(let t=0;t<ue;t++){const r=2e3+Math.floor(Math.random()*10),n=Math.floor(Math.random()*11),o=Math.floor(Math.random()*29),s=Math.round(Math.random()*100);e[t]={rowId:t,title:"Task "+t,duration:t%33===0?null:Math.random()*100+"",percentComplete:s,percentComplete2:s,percentCompleteNumber:s,start:new Date(r,n,o),finish:new Date(r,n+1,o),effortDriven:t%5===0}}this.dataset=e}changeDetailViewRowCount(){const e=this.rowDetailInstance.getOptions();e&&e.panelRows&&(e.panelRows=this.detailViewRowCount,this.rowDetailInstance.setOptions(e))}changeEditableGrid(){var e;return this.rowDetailInstance.collapseAll(),this.rowDetailInstance.addonOptions.useRowClick=!1,this.gridOptions.autoCommitEdit=!this.gridOptions.autoCommitEdit,(e=this.aureliaGrid)==null||e.slickGrid.setOptions({editable:!0,autoEdit:!0,enableCellNavigation:!0}),!0}closeAllRowDetail(){this.rowDetailInstance.collapseAll()}showFlashMessage(e,t="info"){this.message=e,this.flashAlertType=t}simulateServerAsyncCall(e){const t=["John Doe","Jane Doe","Chuck Norris","Bumblebee","Jackie Chan","Elvis Presley","Bob Marley","Mohammed Ali","Bruce Lee","Rocky Balboa"];return new Promise(r=>{window.setTimeout(()=>{const n=e;n.assignee=t[this.randomNumber(0,9)]||"",n.reporter=t[this.randomNumber(0,9)]||"",r(n)},this.serverWaitDelay)})}toggleDarkMode(){var e;this._darkMode=!this._darkMode,this.toggleBodyBackground(),(e=this.aureliaGrid.slickGrid)==null||e.setOptions({darkMode:this._darkMode}),this.closeAllRowDetail()}toggleBodyBackground(){this._darkMode?(document.querySelector(".panel-wm-content").classList.add("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="dark"):(document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light")}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}randomNumber(e,t){return Math.floor(Math.random()*(t-e+1)+e)}}h=oe();T(h,5,"detailViewRowCount",$,v);T(h,5,"serverWaitDelay",Y,v);v=T(h,0,"Example19",j,v);w(h,1,v);export{v as Example19};
//# sourceMappingURL=example19-Cnj6T4TO.js.map
