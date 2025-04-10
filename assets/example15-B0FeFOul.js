import{C as A,r as z,I as $,b as g,a as h,F as v,f as w,c as K}from"./index-CATZt-GI.js";const F="example15",T=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example15.ts">
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

<button class="btn btn-outline-secondary btn-sm btn-icon" data-test="reset-button"
        click.trigger="clearGridStateFromLocalStorage()">
  <i class="mdi mdi-close"></i>
  Clear Grid State from Local Storage &amp; Reset Grid
</button>

<button class="btn btn-outline-secondary btn-sm btn-icon" data-test="language-button" click.trigger="switchLanguage()">
  <i class="mdi mdi-translate"></i>
  Switch Language
</button>
<strong>Locale:</strong>
<span style="font-style: italic" data-test="selected-locale">
  \${selectedLanguage + '.json'}
</span>

<aurelia-slickgrid grid-id="grid15"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
                    on-grid-state-changed.trigger="gridStateChanged($event.detail)"
                    >
</aurelia-slickgrid>
`,I=[],O={};let y;function N(t){y||(y=A.define({name:F,template:T,dependencies:I,bindables:O})),t.register(y)}const Y=Object.freeze(Object.defineProperty({__proto__:null,bindables:O,default:T,dependencies:I,name:F,register:N,template:T},Symbol.toStringTag,{value:"Module"}));var R=Object.create,D=Object.defineProperty,W=Object.getOwnPropertyDescriptor,B=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),x=t=>{throw TypeError(t)},k=(t,e,i)=>e in t?D(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,U=(t,e)=>D(t,"name",{value:e,configurable:!0}),j=t=>[,,,R(null)],J=["class","method","getter","setter","accessor","field","value","get","set"],P=t=>t!==void 0&&typeof t!="function"?x("Function expected"):t,V=(t,e,i,a,r)=>({kind:J[t],name:e,metadata:a,addInitializer:n=>i._?x("Already initialized"):r.push(P(n||null))}),H=(t,e)=>k(e,B("metadata"),t[3]),Z=(t,e,i,a)=>{for(var r=0,n=t[e>>1],o=n&&n.length;r<o;r++)n[r].call(i);return a},q=(t,e,i,a,r,n)=>{var o,b,l,d=e&7,u=!1,p=0,S=t[p]||(t[p]=[]),m=d&&(r=r.prototype,d<5&&(d>3||!u)&&W(r,i));U(r,i);for(var _=a.length-1;_>=0;_--)l=V(d,i,b={},t[3],S),o=(0,a[_])(r,l),b._=1,P(o)&&(r=o);return H(t,r),m&&D(r,i,m),u?d^4?n:m:r},s=(t,e,i)=>k(t,typeof e!="symbol"?e+"":e,i),M,L;function c(t,e){return Math.floor(Math.random()*(e-t+1)+t)}const G=25,f="gridState",E=500;M=[K(Y)];class C{constructor(e=z($)){this.i18n=e,s(this,"title","Example 15: Grid State & Presets using Local Storage"),s(this,"subTitle",`
  Grid State & Preset (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/grid-state-preset" target="_blank">Wiki docs</a>)
  <br/>
  <ul class="small">
    <li>Uses Local Storage to persist the Grid State and uses Grid Options "presets" to put the grid back to it's previous state</li>
    <ul>
       <li>to demo this, simply change any columns (position reorder, visibility, size, filter, sort), then refresh your browser with (F5)</li>
    </ul>
    <li>Local Storage is just one option, you can use whichever is more convenient for you (Local Storage, Session Storage, DB, ...)</li>
  </ul>
`),s(this,"aureliaGrid"),s(this,"columnDefinitions",[]),s(this,"gridOptions"),s(this,"dataset",[]),s(this,"hideSubTitle",!1),s(this,"selectedLanguage");const i=JSON.parse(localStorage[f]||null);this.defineGrid(i);const a="en";this.i18n.setLocale(a),this.selectedLanguage=a}attached(){this.dataset=this.getData(E)}detaching(){this.saveCurrentGridState()}aureliaGridReady(e){this.aureliaGrid=e}clearGridStateFromLocalStorage(){this.aureliaGrid.gridService.resetGrid(this.columnDefinitions),this.aureliaGrid.paginationService.changeItemPerPage(G),window.setTimeout(()=>localStorage[f]=null)}defineGrid(e){const i=[];for(let a=0;a<E;a++)i.push({value:a,label:a});this.columnDefinitions=[{id:"title",name:"Title",field:"title",nameKey:"TITLE",filterable:!0,sortable:!0,type:h.string,minWidth:45,width:100,filter:{model:g.compoundInput}},{id:"description",name:"Description",field:"description",filterable:!0,sortable:!0,minWidth:80,width:100,type:h.string,filter:{model:g.input,filterShortcuts:[{titleKey:"BLANK_VALUES",searchTerms:["< A"],iconCssClass:"mdi mdi-filter-minus-outline"},{titleKey:"NON_BLANK_VALUES",searchTerms:["> A"],iconCssClass:"mdi mdi-filter-plus-outline"}]}},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,type:h.number,exportCsvForceToKeepAsString:!0,minWidth:55,width:100,nameKey:"DURATION",filterable:!0,filter:{collection:i,model:g.multipleSelect,filterOptions:{maxHeight:250,width:175}}},{id:"complete",name:"% Complete",field:"percentComplete",nameKey:"PERCENT_COMPLETE",minWidth:70,type:h.number,sortable:!0,width:100,formatter:v.percentCompleteBar,filterable:!0,filter:{model:g.slider,operator:">"}},{id:"start",name:"Start",field:"start",nameKey:"START",formatter:v.dateIso,sortable:!0,minWidth:75,exportWithFormatter:!0,width:100,type:h.date,filterable:!0,filter:{model:g.compoundDate,filterShortcuts:[{titleKey:"PAST",searchTerms:[w(new Date,"YYYY-MM-DD")],operator:"<",iconCssClass:"mdi mdi-calendar"},{titleKey:"FUTURE",searchTerms:[w(new Date,"YYYY-MM-DD")],operator:">",iconCssClass:"mdi mdi-calendar-clock"}]}},{id:"completed",field:"completed",nameKey:"COMPLETED",minWidth:85,maxWidth:85,formatter:v.checkmarkMaterial,width:100,type:h.boolean,sortable:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:g.singleSelect}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableCheckboxSelector:!0,enableFiltering:!0,enableTranslate:!0,i18n:this.i18n,columnPicker:{hideForceFitButton:!0},gridMenu:{hideForceFitButton:!0,hideClearFrozenColumnsCommand:!1},headerMenu:{hideFreezeColumnsCommand:!1},enablePagination:!0,pagination:{pageSizes:[5,10,15,20,25,30,40,50,75,100],pageSize:G}},e&&(this.gridOptions.presets=e)}getData(e){const i=new Date().getFullYear(),a=[];for(let r=0;r<e;r++){const n=Math.round(Math.random()*100),o=c(i-15,i+8),b=c(10,25),l=c(1,12),d=l<10?`0${l}`:l,u=c(10,28),p=c(0,100),S=c(10,23),m=c(10,59);a[r]={id:r,title:"Task "+r,description:r%5?"desc "+r:null,duration:n,percentComplete:p,percentCompleteNumber:p,start:new Date(o,l,u),usDateShort:`${l}/${u}/${b}`,utcDate:`${o}-${d}-${u}T${S}:${m}:${m}Z`,completed:r%3===0}}return a}gridStateChanged(e){console.log("Client sample, Grid State changed:: ",e),localStorage[f]=JSON.stringify(e.gridState)}saveCurrentGridState(){const e=this.aureliaGrid.gridStateService.getCurrentGridState();console.log("Client sample, current Grid State:: ",e),localStorage[f]=JSON.stringify(e)}async switchLanguage(){const e=this.selectedLanguage==="en"?"fr":"en";await this.i18n.setLocale(e),this.selectedLanguage=e}useDefaultPresets(){return{columns:[{columnId:"description",width:170},{columnId:"title",width:55},{columnId:"duration"},{columnId:"complete"},{columnId:"start"},{columnId:"usDateShort"},{columnId:"utcDate"}],filters:[{columnId:"duration",searchTerms:[2,22,44]},{columnId:"usDateShort",operator:"<",searchTerms:["4/20/25"]}],sorters:[{columnId:"duration",direction:"DESC"},{columnId:"complete",direction:"ASC"}]}}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}L=j();C=q(L,0,"Example15",M,C);Z(L,1,C);export{C as Example15};
//# sourceMappingURL=example15-B0FeFOul.js.map
