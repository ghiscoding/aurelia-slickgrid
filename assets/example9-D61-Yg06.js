import{C as I,r as L,I as P,a as o,b as c,F as x,E as D,c as F}from"./index-BEnHDSQL.js";const S="example9",p=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example9.ts">
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

<button class="btn btn-outline-secondary btn-sm btn-icon" data-test="external-gridmenu"
        click.trigger="toggleGridMenu($event)">
  <i class="mdi mdi-menu"></i>
  Grid Menu
</button>
<button class="btn btn-outline-secondary btn-sm btn-icon" data-test="language" click.trigger="switchLanguage()">
  <i class="mdi mdi-translate"></i>
  Switch Language
</button>
<b>Locale:</b> <span style="font-style: italic" data-test="selected-locale">\${selectedLanguage + '.json'}</span>

<aurelia-slickgrid grid-id="grid9"
                    column-definitions.bind="columnDefinitions"
                    dataset.bind="dataset"
                    grid-options.bind="gridOptions"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
`,M=[],w={};let h;function z(i){h||(h=I.define({name:S,template:p,dependencies:M,bindables:w})),i.register(h)}const N=Object.freeze(Object.defineProperty({__proto__:null,bindables:w,default:p,dependencies:M,name:S,register:z,template:p},Symbol.toStringTag,{value:"Module"}));var R=Object.create,g=Object.defineProperty,A=Object.getOwnPropertyDescriptor,B=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),O=i=>{throw TypeError(i)},T=(i,e,t)=>e in i?g(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,K=(i,e)=>g(i,"name",{value:e,configurable:!0}),j=i=>[,,,R(null)],U=["class","method","getter","setter","accessor","field","value","get","set"],k=i=>i!==void 0&&typeof i!="function"?O("Function expected"):i,V=(i,e,t,a,n)=>({kind:U[i],name:e,metadata:a,addInitializer:l=>t._?O("Already initialized"):n.push(k(l||null))}),W=(i,e)=>T(e,B("metadata"),i[3]),Y=(i,e,t,a)=>{for(var n=0,l=i[e>>1],r=l&&l.length;n<r;n++)l[n].call(t);return a},$=(i,e,t,a,n,l)=>{var r,C,v,d=e&7,y=!1,_=0,G=i[_]||(i[_]=[]),m=d&&(n=n.prototype,d<5&&(d>3||!y)&&A(n,t));K(n,t);for(var u=a.length-1;u>=0;u--)v=V(d,t,C={},i[3],G),r=(0,a[u])(n,v),C._=1,k(r)&&(n=r);return W(i,n),m&&g(n,t,m),y?d^4?l:m:n},s=(i,e,t)=>T(i,typeof e!="symbol"?e+"":e,t),E,f;E=[F(N)];class b{constructor(e=L(P)){this.i18n=e,s(this,"title","Example 9: Grid Menu Control"),s(this,"subTitle",`
    This example demonstrates using the <b>Slick.Controls.GridMenu</b> plugin to easily add a Grid Menu (aka hamburger menu) on the top right corner of the grid.<br/>
    (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/grid-menu" target="_blank">Wiki docs</a>)
    <ul>
      <li>You can change the Grid Menu icon, for example "mdi-dots-vertical"&nbsp;&nbsp;<span class="mdi mdi-dots-vertical"></span>&nbsp;&nbsp;(which is shown in this example)</li>
      <li>By default the Grid Menu shows all columns which you can show/hide them</li>
      <li>You can configure multiple custom "commands" to show up in the Grid Menu and use the "onGridMenuCommand()" callback</li>
      <li>Doing a "right + click" over any column header will also provide a way to show/hide a column (via the Column Picker Plugin)</li>
      <li>You can change the icons of both picker via SASS variables as shown in this demo (check all SASS variables)</li>
      <li><i class="mdi mdi-arrow-down icon"></i> You can also show the Grid Menu anywhere on your page</li>
    </ul>
  `),s(this,"aureliaGrid"),s(this,"columnDefinitions",[]),s(this,"gridOptions"),s(this,"dataset",[]),s(this,"dataView"),s(this,"gridObj"),s(this,"hideSubTitle",!1),s(this,"selectedLanguage"),this.defineGrid();const t="en";this.i18n.setLocale(t),this.selectedLanguage=t}attached(){this.getData()}aureliaGridReady(e){this.aureliaGrid=e,this.gridObj=e&&e.slickGrid,this.dataView=e&&e.dataView}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",nameKey:"TITLE",filterable:!0,type:o.string},{id:"duration",name:"Duration",field:"duration",nameKey:"DURATION",sortable:!0,filterable:!0,type:o.string},{id:"percentComplete",name:"% Complete",field:"percentComplete",nameKey:"PERCENT_COMPLETE",sortable:!0,filterable:!0,type:o.number,formatter:x.percentCompleteBar,filter:{model:c.compoundSlider,filterOptions:{hideSliderNumber:!1}}},{id:"start",name:"Start",field:"start",nameKey:"START",filterable:!0,type:o.dateUs,filter:{model:c.compoundDate}},{id:"finish",name:"Finish",field:"finish",nameKey:"FINISH",filterable:!0,type:o.dateUs,filter:{model:c.compoundDate}},{id:"completed",name:"Completed",field:"completed",nameKey:"COMPLETED",maxWidth:80,formatter:x.checkmarkMaterial,type:o.boolean,minWidth:100,sortable:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"true"},{value:!1,label:"false"}],model:c.singleSelect}}],this.gridOptions={columnPicker:{hideForceFitButton:!0,hideSyncResizeButton:!0,onColumnsChanged:(e,t)=>{console.log("Column selection changed from Column Picker, visible columns: ",t.visibleColumns)}},enableAutoResize:!0,enableGridMenu:!0,autoResize:{container:"#demo-container",rightPadding:10},enableFiltering:!0,enableCellNavigation:!0,gridMenu:{menuUsabilityOverride:()=>!0,commandTitleKey:"CUSTOM_COMMANDS",iconCssClass:"mdi mdi-dots-vertical",hideForceFitButton:!0,hideSyncResizeButton:!0,hideToggleFilterCommand:!1,menuWidth:17,resizeOnShowHeaderRow:!0,subItemChevronClass:"mdi mdi-chevron-down mdi-rotate-270",commandItems:[{iconCssClass:"mdi mdi-help-circle",titleKey:"HELP",disabled:!1,command:"help",positionOrder:90,cssClass:"bold",textCssClass:"blue"},{divider:!0,command:"",positionOrder:89},{title:"Command 1",command:"command1",positionOrder:91,cssClass:"orange",iconCssClass:"mdi mdi-alert",action:(e,t)=>alert(t.command),itemUsabilityOverride:e=>e&&Array.isArray(e.columns)?e.columns.length===e.visibleColumns.length:!0},{title:"Command 2",command:"command2",positionOrder:92,cssClass:"red",textCssClass:"italic",action:(e,t)=>alert(t.command),itemVisibilityOverride:()=>this.aureliaGrid?this.isObjectEmpty(this.aureliaGrid.filterService.getColumnFilters()):!0},{title:"Disabled command",disabled:!0,command:"disabled-command",positionOrder:98},{command:"",divider:!0,positionOrder:98},{command:"export",title:"Exports",positionOrder:99,commandItems:[{command:"exports-txt",title:"Text (tab delimited)"},{command:"sub-menu",title:"Excel",cssClass:"green",subMenuTitle:"available formats",subMenuTitleCssClass:"text-italic orange",commandItems:[{command:"exports-csv",title:"Excel (csv)"},{command:"exports-xlsx",title:"Excel (xlsx)"}]}]},{command:"feedback",title:"Feedback",positionOrder:100,commandItems:[{command:"request-update",title:"Request update from supplier",iconCssClass:"mdi mdi-star",tooltip:"this will automatically send an alert to the shipping team to contact the user for an update"},"divider",{command:"sub-menu",title:"Contact Us",iconCssClass:"mdi mdi-account",subMenuTitle:"contact us...",subMenuTitleCssClass:"italic",commandItems:[{command:"contact-email",title:"Email us",iconCssClass:"mdi mdi-pencil-outline"},{command:"contact-chat",title:"Chat with us",iconCssClass:"mdi mdi-message-text-outline"},{command:"contact-meeting",title:"Book an appointment",iconCssClass:"mdi mdi-coffee"}]}]}],onCommand:(e,t)=>{var n;const a=(n=t.item)==null?void 0:n.command;a.includes("exports-")?alert("Exporting as "+(t==null?void 0:t.item.title)):a.includes("contact-")||a==="help"?alert("Command: "+t.command):console.log("onGridMenuCommand",t.command)},onColumnsChanged:(e,t)=>{console.log("Column selection changed from Grid Menu, visible columns: ",t.visibleColumns)}},enableTranslate:!0,i18n:this.i18n}}getData(){const e=[];for(let t=0;t<500;t++)e[t]={id:t,title:"Task "+t,phone:this.generatePhoneNumber(),duration:Math.round(Math.random()*25)+" days",percentComplete:Math.round(Math.random()*100),start:"01/01/2009",finish:"01/05/2009",completed:t%5===0};this.dataset=e}generatePhoneNumber(){let e="";for(let t=0;t<10;t++)e+=Math.round(Math.random()*9)+"";return e}async switchLanguage(){const e=this.selectedLanguage==="en"?"fr":"en";await this.i18n.setLocale(e),this.selectedLanguage=e}toggleGridMenu(e){var t;(t=this.aureliaGrid)!=null&&t.extensionService&&this.aureliaGrid.extensionService.getExtensionInstanceByName(D.gridMenu).showGridMenu(e,{dropSide:"right"})}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}isObjectEmpty(e){for(const t in e)if(e.hasOwnProperty(t)&&e[t]!=="")return!1;return!0}}f=j();b=$(f,0,"Example9",E,b);Y(f,1,b);export{b as Example9};
//# sourceMappingURL=example9-D61-Yg06.js.map
