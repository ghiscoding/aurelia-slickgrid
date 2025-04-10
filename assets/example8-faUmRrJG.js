import{C as E,r as L,I as M,F as P,c as H}from"./index-CATZt-GI.js";const _="example8",u=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example8.ts">
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

<button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="switchLanguage()">
  <i class="mdi mdi-translate"></i>
  Switch Language
</button>
<b>Locale:</b> <span style="font-style: italic" data-test="selected-locale">\${selectedLanguage + '.json'}</span>

<aurelia-slickgrid grid-id="grid8"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
`,y=[],T={};let m;function I(i){m||(m=E.define({name:_,template:u,dependencies:y,bindables:T})),i.register(m)}const D=Object.freeze(Object.defineProperty({__proto__:null,bindables:T,default:u,dependencies:y,name:_,register:I,template:u},Symbol.toStringTag,{value:"Module"}));var F=Object.create,p=Object.defineProperty,N=Object.getOwnPropertyDescriptor,z=(i,t)=>(t=Symbol[i])?t:Symbol.for("Symbol."+i),k=i=>{throw TypeError(i)},S=(i,t,e)=>t in i?p(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,R=(i,t)=>p(i,"name",{value:t,configurable:!0}),K=i=>[,,,F(null)],q=["class","method","getter","setter","accessor","field","value","get","set"],w=i=>i!==void 0&&typeof i!="function"?k("Function expected"):i,A=(i,t,e,a,n)=>({kind:q[i],name:t,metadata:a,addInitializer:l=>e._?k("Already initialized"):n.push(w(l||null))}),G=(i,t)=>S(t,z("metadata"),i[3]),j=(i,t,e,a)=>{for(var n=0,l=i[t>>1],o=l&&l.length;n<o;n++)l[n].call(e);return a},U=(i,t,e,a,n,l)=>{var o,f,g,d=t&7,v=!1,C=0,O=i[C]||(i[C]=[]),r=d&&(n=n.prototype,d<5&&(d>3||!v)&&N(n,e));R(n,e);for(var c=a.length-1;c>=0;c--)g=A(d,e,f={},i[3],O),o=(0,a[c])(n,g),f._=1,w(o)&&(n=o);return G(i,n),r&&p(n,e,r),v?d^4?l:r:n},s=(i,t,e)=>S(i,typeof t!="symbol"?t+"":t,e),x,b;x=[H(D)];class h{constructor(t=L(M)){this.i18n=t,s(this,"title","Example 8: Header Menu Plugin"),s(this,"subTitle",`
    This example demonstrates using the <b>Slick.Plugins.HeaderMenu</b> plugin to easily add menus to colum headers.<br/>
    These menus can be specified directly in the column definition, and are very easy to configure and use.
    (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/header-menu-header-buttonss" target="_blank">Wiki docs</a>)
    <ul>
      <li>Now enabled by default in the Global Grid Options, it will add the default commands of (hide column, sort asc/desc)</li>
      <li>Hover over any column header to see an arrow showing up on the right</li>
      <li>Try Sorting (multi-sort) the 2 columns "Duration" and "% Complete" (the other ones are disabled)</li>
      <li>Try hiding any columns (you use the "Column Picker" plugin by doing a right+click on the header to show the column back)</li>
      <li>Note: The "Header Button" & "Header Menu" Plugins cannot be used at the same time</li>
      <li>You can change the menu icon via SASS variables as shown in this demo (check all SASS variables)</li>
      <li>Use override callback functions to change the properties of show/hide, enable/disable the menu or certain item(s) from the list</li>
      <ol>
        <li>These callbacks are: "itemVisibilityOverride", "itemUsabilityOverride"</li>
        <li>for example if we want to disable the "Help" command over the "Title" and "Completed" column</li>
        <li>for example don't show Help on column "% Complete"</li>
      </ol>
    </ul>
  `),s(this,"columnDefinitions",[]),s(this,"gridOptions"),s(this,"dataset",[]),s(this,"hideSubTitle",!1),s(this,"selectedLanguage"),s(this,"visibleColumns",[]),this.defineGrid();const e="en";this.i18n.setLocale(e),this.selectedLanguage=e}attached(){this.getData()}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",nameKey:"TITLE"},{id:"duration",name:"Duration",field:"duration",nameKey:"DURATION",sortable:!0},{id:"percentComplete",name:"% Complete",field:"percentComplete",nameKey:"PERCENT_COMPLETE",sortable:!0},{id:"start",name:"Start",field:"start",nameKey:"START"},{id:"finish",name:"Finish",field:"finish",nameKey:"FINISH"},{id:"completed",name:"Completed",field:"completed",nameKey:"COMPLETED",formatter:P.checkmarkMaterial}],this.columnDefinitions.forEach(t=>{t.header={menu:{commandItems:[{iconCssClass:"mdi mdi-help-circle",titleKey:"HELP",command:"help",tooltip:"Need assistance?",cssClass:"bold",textCssClass:t.id==="title"||t.id==="completed"?"":"blue",positionOrder:99,itemUsabilityOverride:e=>!(e.column.id==="title"||e.column.id==="completed"),itemVisibilityOverride:e=>e.column.id!=="percentComplete",action:(e,a)=>{console.log("execute an action on Help",a)}},{divider:!0,command:"",positionOrder:98},{command:"custom-actions",title:"Hello",positionOrder:99,commandItems:[{command:"hello-world",title:"Hello World"},{command:"hello-slickgrid",title:"Hello SlickGrid"},{command:"sub-menu",title:"Let's play",cssClass:"green",subMenuTitle:"choose your game",subMenuTitleCssClass:"text-italic salmon",commandItems:[{command:"sport-badminton",title:"Badminton"},{command:"sport-tennis",title:"Tennis"},{command:"sport-racquetball",title:"Racquetball"},{command:"sport-squash",title:"Squash"}]}]},{command:"feedback",title:"Feedback",positionOrder:100,commandItems:[{command:"request-update",title:"Request update from supplier",iconCssClass:"mdi mdi-star",tooltip:"this will automatically send an alert to the shipping team to contact the user for an update"},"divider",{command:"sub-menu",title:"Contact Us",iconCssClass:"mdi mdi-account",subMenuTitle:"contact us...",subMenuTitleCssClass:"italic",commandItems:[{command:"contact-email",title:"Email us",iconCssClass:"mdi mdi-pencil-outline"},{command:"contact-chat",title:"Chat with us",iconCssClass:"mdi mdi-message-text-outline"},{command:"contact-meeting",title:"Book an appointment",iconCssClass:"mdi mdi-coffee"}]}]}]}}}),this.gridOptions={enableAutoResize:!0,enableHeaderMenu:!0,autoResize:{container:"#demo-container",rightPadding:10},enableFiltering:!1,enableCellNavigation:!0,headerMenu:{hideSortCommands:!1,hideColumnHideCommand:!1,subItemChevronClass:"mdi mdi-chevron-down mdi-rotate-270",onCommand:(t,e)=>{var n,l,o;const a=(n=e.item)==null?void 0:n.command;a.includes("hello-")?alert(e==null?void 0:e.item.title):a.includes("sport-")?alert("Just do it, play "+((l=e==null?void 0:e.item)==null?void 0:l.title)):a.includes("contact-")?alert("Command: "+((o=e==null?void 0:e.item)==null?void 0:o.command)):e.command==="help"&&alert("Please help!!!")}},enableTranslate:!0,i18n:this.i18n}}getData(){const t=[];for(let e=0;e<1e3;e++)t[e]={id:e,title:"Task "+e,duration:Math.round(Math.random()*25)+" days",percentComplete:Math.round(Math.random()*100),start:"01/01/2009",finish:"01/05/2009",completed:e%5===0};this.dataset=t}async switchLanguage(){const t=this.selectedLanguage==="en"?"fr":"en";await this.i18n.setLocale(t),this.selectedLanguage=t}}b=K();h=U(b,0,"Example8",x,h);j(b,1,h);export{h as Example8};
//# sourceMappingURL=example8-faUmRrJG.js.map
