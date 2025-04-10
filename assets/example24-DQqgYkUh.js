import{C as L,r as A,I as K,E as M,a as m,F as u,b as p,c as G}from"./index-CATZt-GI.js";import{E as F}from"./excelExport.service-CSmXGqy6.js";import"./groupingFormatters.index-CHREWoSu.js";const _="example24",g=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example24.ts">
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
    <i class="mdi mdi-theme-light-dark"></i>
    <span>Toggle Dark Mode</span>
  </button>
</h2>

<div class="subtitle" innerhtml.bind="subTitle"></div>

<div class="row">
  <span class="context-menu">
    <strong>Context Menu:</strong>
    <button class="btn btn-outline-secondary btn-xs btn-icon" click.trigger="showContextCommandsAndOptions(false)"
            data-test="context-menu-priority-only-button">
      Show Priority Options Only
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" click.trigger="showContextCommandsAndOptions(true)"
            data-test="context-menu-commands-and-priority-button">
      Show Commands & Priority Options
    </button>
  </span>

  <span class="cell-menu">
    <strong>Cell Menu:</strong>
    <button class="btn btn-outline-secondary btn-xs btn-icon" click.trigger="showCellMenuCommandsAndOptions(false)"
            data-test="cell-menu-commands-and-options-false-button">
      Show Action Commands Only
    </button>
    <button class="btn btn-outline-secondary btn-xs btn-icon" click.trigger="showCellMenuCommandsAndOptions(true)"
            data-test="cell-menu-commands-and-options-true-button">
      Show Actions Commands & Completed Options
    </button>
  </span>
</div>

<div class="row locale">
  <div class="col-12">
    <button class="btn btn-outline-secondary btn-xs btn-icon" click.trigger="switchLanguage()" data-test="language-button">
      <i class="mdi mdi-translate"></i>
      Switch Language
    </button>
    <label>Locale:</label>
    <span style="font-style: italic" data-test="selected-locale">
      \${selectedLanguage + '.json'}
    </span>
  </div>
</div>

<aurelia-slickgrid grid-id="grid24"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    instances.bind="aureliaGrid">
</aurelia-slickgrid>
`,w=[],k={};let C;function P(n){C||(C=L.define({name:_,template:g,dependencies:w,bindables:k})),n.register(C)}const U=Object.freeze(Object.defineProperty({__proto__:null,bindables:k,default:g,dependencies:w,name:_,register:P,template:g},Symbol.toStringTag,{value:"Module"}));var B=Object.create,f=Object.defineProperty,W=Object.getOwnPropertyDescriptor,H=(n,e)=>(e=Symbol[n])?e:Symbol.for("Symbol."+n),E=n=>{throw TypeError(n)},S=(n,e,t)=>e in n?f(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,R=(n,e)=>f(n,"name",{value:e,configurable:!0}),N=n=>[,,,B(null)],q=["class","method","getter","setter","accessor","field","value","get","set"],T=n=>n!==void 0&&typeof n!="function"?E("Function expected"):n,z=(n,e,t,i,o)=>({kind:q[n],name:e,metadata:i,addInitializer:a=>t._?E("Already initialized"):o.push(T(a||null))}),V=(n,e)=>S(e,H("metadata"),n[3]),j=(n,e,t,i)=>{for(var o=0,a=n[e>>1],l=a&&a.length;o<l;o++)a[o].call(t);return i},$=(n,e,t,i,o,a)=>{var l,s,c,d=e&7,v=!1,O=0,D=n[O]||(n[O]=[]),b=d&&(o=o.prototype,d<5&&(d>3||!v)&&W(o,t));R(o,t);for(var h=i.length-1;h>=0;h--)c=z(d,t,s={},n[3],D),l=(0,i[h])(o,c),s._=1,T(l)&&(o=l);return V(n,o),b&&f(o,t,b),v?d^4?a:b:o},r=(n,e,t)=>S(n,typeof e!="symbol"?e+"":e,t),I,y;const Y=(n,e,t,i,o)=>o.priority===3?'<div class="cell-menu-dropdown-outline">Action<i class="mdi mdi-chevron-down"></i></div>':'<div class="cell-menu-dropdown-outline disabled">Action <i class="mdi mdi-chevron-down"></i></div>',X=(n,e,t)=>{if(!t)return"";let i="";const o=+(t>=3?3:t),l=`<i class="mdi mdi-star ${o===3?"red":o===2?"orange":"yellow"}" aria-hidden="true"></i>`;for(let s=1;s<=o;s++)i+=l;return i},J=(n,e,t,i,o,a)=>{if(!t)return"";const s=a.getOptions().i18n,c=+(t>=3?3:t),d=c===3?"HIGH":c===2?"MEDIUM":"LOW";return(s==null?void 0:s.tr(d))??""},Q=(n,e,t,i,o,a)=>{const s=a.getOptions().i18n;return(s==null?void 0:s.tr("TASK_X",{x:t}))??""};I=[G(U)];class x{constructor(e=A(K)){this.i18n=e,r(this,"_darkModeGrid",!1),r(this,"title","Example 24: Cell Menu & Context Menu Plugins"),r(this,"subTitle",`Add Cell Menu and Context Menu
    <ul>
      <li>This example demonstrates 2 SlickGrid plugins</li>
      <ol>
        <li>Using the <b>Slick.Plugins.CellMenu</b> plugin, often used for an Action Menu(s), 1 or more per grid
          (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/cell-menu" target="_blank">Wiki docs</a>).
        </li>
        <li>Using the <b>Slick.Plugins.ContextMenu</b> plugin, shown after a mouse right+click, only 1 per grid.
        (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/context-menu" target="_blank">Wiki docs</a>).
        </li>
      </ol>
      <li>It will also "autoAdjustDrop" (bottom/top) and "autoAlignSide" (left/right) by default but could be turned off</li>
      <li>Both plugins have 2 sections, 1st section can have an array of Options (to change value of a field) and 2nd section an array of Commands (execute a command)</li>
      <li>There are 2 ways to execute a Command/Option</li>
      <ol>
        <li>via onCommand/onOptionSelected (use a switch/case to parse command/option and do something with it)</li>
        <li>via action callback (that can be defined on each command/option)</li>
      </ol>
      <li>Use override callback functions to change the properties of show/hide, enable/disable the menu or certain item(s) from the list</li>
      <ol>
        <li>These callbacks are: "menuUsabilityOverride", "itemVisibilityOverride", "itemUsabilityOverride"</li>
        <li>... e.g. in the demo, the "Action" Cell Menu is only available when Priority is set to "High" via "menuUsabilityOverride"</li>
        <li>... e.g. in the demo, the Context Menu is only available on the first 20 Tasks via "menuUsabilityOverride"</li>
      </ol>
    </ul>`),r(this,"aureliaGrid"),r(this,"gridOptions"),r(this,"columnDefinitions",[]),r(this,"dataset",[]),r(this,"hideSubTitle",!1),r(this,"selectedLanguage"),this.defineGrid();const t="en";this.i18n.setLocale(t),this.selectedLanguage=t}get cellMenuInstance(){var e;return(e=this.aureliaGrid)==null?void 0:e.extensionService.getExtensionInstanceByName(M.cellMenu)}get contextMenuInstance(){var e;return(e=this.aureliaGrid)==null?void 0:e.extensionService.getExtensionInstanceByName(M.contextMenu)}attached(){this.dataset=this.getData(1e3)}detaching(){document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light"}defineGrid(){this.columnDefinitions=[{id:"id",name:"#",field:"id",maxWidth:45,sortable:!0,filterable:!0},{id:"title",name:"Title",field:"id",nameKey:"TITLE",minWidth:100,formatter:Q,sortable:!0,filterable:!0,params:{useFormatterOuputToFilter:!0}},{id:"percentComplete",nameKey:"PERCENT_COMPLETE",field:"percentComplete",minWidth:100,exportWithFormatter:!1,sortable:!0,filterable:!0,filter:{model:p.slider,operator:">="},formatter:u.percentCompleteBar,type:m.number},{id:"start",name:"Start",field:"start",nameKey:"START",minWidth:100,formatter:u.dateIso,outputType:m.dateIso,type:m.date,filterable:!0,filter:{model:p.compoundDate}},{id:"finish",name:"Finish",field:"finish",nameKey:"FINISH",formatter:u.dateIso,outputType:m.dateIso,type:m.date,minWidth:100,filterable:!0,filter:{model:p.compoundDate}},{id:"priority",nameKey:"PRIORITY",field:"priority",exportCustomFormatter:J,formatter:X,sortable:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:1,labelKey:"LOW"},{value:2,labelKey:"MEDIUM"},{value:3,labelKey:"HIGH"}],model:p.singleSelect,enableTranslateLabel:!0}},{id:"completed",nameKey:"COMPLETED",field:"completed",exportCustomFormatter:u.translateBoolean,formatter:u.checkmarkMaterial,sortable:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,labelKey:"TRUE"},{value:!1,labelKey:"FALSE"}],model:p.singleSelect,enableTranslateLabel:!0}},{id:"action",name:"Action",field:"action",width:100,maxWidth:110,excludeFromExport:!0,formatter:Y,cellMenu:{hideCloseButton:!1,menuUsabilityOverride:e=>e.dataContext.priority===3,commandTitleKey:"COMMANDS",commandItems:[{command:"command2",title:"Command 2",positionOrder:62,action:(e,t)=>{console.log(t.dataContext,t.column)},itemUsabilityOverride:e=>!e.dataContext.completed},{command:"command1",title:"Command 1",cssClass:"orange",positionOrder:61},{command:"delete-row",titleKey:"DELETE_ROW",positionOrder:64,iconCssClass:"mdi mdi-close",cssClass:"red",textCssClass:"bold",itemVisibilityOverride:e=>!e.dataContext.completed},{divider:!0,command:"",positionOrder:63},{command:"help",titleKey:"HELP",iconCssClass:"mdi mdi-help-circle",positionOrder:66},{command:"something",titleKey:"DISABLED_COMMAND",disabled:!0,positionOrder:67},{command:"",divider:!0,positionOrder:98},{command:"export",title:"Exports",positionOrder:99,commandItems:[{command:"exports-txt",title:"Text (tab delimited)"},{command:"sub-menu",title:"Excel",cssClass:"green",subMenuTitle:"available formats",subMenuTitleCssClass:"text-italic orange",commandItems:[{command:"exports-csv",title:"Excel (csv)"},{command:"exports-xlsx",title:"Excel (xlsx)"}]}]},{command:"feedback",title:"Feedback",positionOrder:100,commandItems:[{command:"request-update",title:"Request update from supplier",iconCssClass:"mdi mdi-star",tooltip:"this will automatically send an alert to the shipping team to contact the user for an update"},"divider",{command:"sub-menu",title:"Contact Us",iconCssClass:"mdi mdi-account",subMenuTitle:"contact us...",subMenuTitleCssClass:"italic",commandItems:[{command:"contact-email",title:"Email us",iconCssClass:"mdi mdi-pencil-outline"},{command:"contact-chat",title:"Chat with us",iconCssClass:"mdi mdi-message-text-outline"},{command:"contact-meeting",title:"Book an appointment",iconCssClass:"mdi mdi-coffee"}]}]}],optionTitleKey:"CHANGE_COMPLETED_FLAG",optionItems:[{option:!0,titleKey:"TRUE",iconCssClass:"mdi mdi-check-box-outline"},{option:!1,titleKey:"FALSE",iconCssClass:"mdi mdi-checkbox-blank-outline"},{option:null,title:"null",cssClass:"italic",action:()=>{},itemUsabilityOverride:e=>e.dataContext.priority===3,itemVisibilityOverride:e=>!e.dataContext.completed}]}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},darkMode:this._darkModeGrid,enableCellNavigation:!0,enableFiltering:!0,enableSorting:!0,enableTranslate:!0,enableExcelExport:!0,excelExportOptions:{exportWithFormatter:!0,customColumnWidth:15,columnHeaderStyle:{font:{bold:!0,italic:!0}}},externalResources:[new F],i18n:this.i18n,enableContextMenu:!0,enableCellMenu:!0,cellMenu:{onCommand:(e,t)=>this.executeCommand(e,t),onOptionSelected:(e,t)=>{const i=t==null?void 0:t.dataContext;i!=null&&i.hasOwnProperty("completed")&&(i.completed=t.item.option,this.aureliaGrid.gridService.updateItem(i))},onBeforeMenuShow:(e,t)=>{console.log("Before the Cell Menu is shown",t)},onBeforeMenuClose:(e,t)=>console.log("Cell Menu is closing",t)},contextMenu:this.getContextMenuOptions()}}executeCommand(e,t){const i=t.command,o=t.dataContext;switch(i){case"contact-email":case"contact-chat":case"contact-meeting":alert("Command: "+(t==null?void 0:t.command));break;case"exports-csv":case"exports-txt":case"exports-xlsx":alert(`Exporting as ${t.item.title}`);break;case"command1":alert("Command 1");break;case"command2":alert("Command 2");break;case"help":alert("Please help!");break;case"delete-row":confirm(`Do you really want to delete row ${t.row+1} with ${this.i18n.tr("TASK_X",{x:o.id})}`)&&this.aureliaGrid.dataView.deleteItem(o.id);break}}getData(e){const t=[];for(let i=0;i<e;i++){const o=2e3+Math.floor(Math.random()*30),a=Math.floor(Math.random()*11),l=Math.floor(Math.random()*29);t[i]={id:i,duration:Math.floor(Math.random()*25)+" days",percentComplete:Math.floor(Math.random()*100),start:new Date(o,a,l),finish:new Date(o,a+1,l),priority:i%3?2:i%5?3:1,completed:i%4===0}}return t}getContextMenuOptions(){return{hideCloseButton:!1,menuUsabilityOverride:e=>(e&&e.dataContext).id<21,commandShownOverColumnIds:["id","title","percentComplete","start","finish","completed"],commandTitleKey:"COMMANDS",commandItems:[{divider:!0,command:"",positionOrder:61},{command:"delete-row",titleKey:"DELETE_ROW",iconCssClass:"mdi mdi-close",cssClass:"red",textCssClass:"bold",positionOrder:62},{divider:!0,command:"",positionOrder:63},{command:"help",titleKey:"HELP",iconCssClass:"mdi mdi-help-circle",positionOrder:64,action:()=>{},itemVisibilityOverride:e=>!(e&&e.dataContext).completed},{command:"something",titleKey:"DISABLED_COMMAND",disabled:!0,positionOrder:65},{command:"",divider:!0,positionOrder:98},{command:"export",title:"Exports",positionOrder:99,commandItems:[{command:"exports-txt",title:"Text (tab delimited)"},{command:"sub-menu",title:"Excel",cssClass:"green",subMenuTitle:"available formats",subMenuTitleCssClass:"text-italic orange",commandItems:[{command:"exports-csv",title:"Excel (csv)"},{command:"exports-xlsx",title:"Excel (xlsx)"}]}]},{command:"feedback",title:"Feedback",positionOrder:100,commandItems:[{command:"request-update",title:"Request update from supplier",iconCssClass:"mdi mdi-star",tooltip:"this will automatically send an alert to the shipping team to contact the user for an update"},"divider",{command:"sub-menu",title:"Contact Us",iconCssClass:"mdi mdi-account",subMenuTitle:"contact us...",subMenuTitleCssClass:"italic",commandItems:[{command:"contact-email",title:"Email us",iconCssClass:"mdi mdi-pencil-outline"},{command:"contact-chat",title:"Chat with us",iconCssClass:"mdi mdi-message-text-outline"},{command:"contact-meeting",title:"Book an appointment",iconCssClass:"mdi mdi-coffee"}]}]}],optionTitleKey:"CHANGE_PRIORITY",optionShownOverColumnIds:["priority"],optionItems:[{option:0,title:"n/a",textCssClass:"italic",itemUsabilityOverride:e=>!(e&&e.dataContext).completed,action:()=>{}},{option:1,iconCssClass:"mdi mdi-star-outline yellow",titleKey:"LOW"},{option:2,iconCssClass:"mdi mdi-star orange",titleKey:"MEDIUM"},{option:3,iconCssClass:"mdi mdi-star red",titleKey:"HIGH"},"divider",{option:4,title:"Extreme",iconCssClass:"mdi mdi-fire",disabled:!0,itemVisibilityOverride:e=>!(e&&e.dataContext).completed},{option:null,title:"Sub-Options (demo)",subMenuTitleKey:"CHANGE_PRIORITY",optionItems:[{option:1,iconCssClass:"mdi mdi-star-outline yellow",titleKey:"LOW"},{option:2,iconCssClass:"mdi mdi-star orange",titleKey:"MEDIUM"},{option:3,iconCssClass:"mdi mdi-star red",titleKey:"HIGH"}]}],onBeforeMenuShow:(e,t)=>{this.aureliaGrid.slickGrid.setActiveCell(t.row,t.cell,!1),console.log("Before the global Context Menu is shown",t)},onBeforeMenuClose:(e,t)=>console.log("Global Context Menu is closing",t),onCommand:(e,t)=>this.executeCommand(e,t),onOptionSelected:(e,t)=>{const i=t&&t.dataContext;i!=null&&i.hasOwnProperty("priority")&&(i.priority=t.item.option,this.aureliaGrid.gridService.updateItem(i))}}}showContextCommandsAndOptions(e){var i;const t=e?[]:["id","title","complete","start","finish","completed","action"];(i=this.contextMenuInstance)==null||i.setOptions({commandShownOverColumnIds:t})}showCellMenuCommandsAndOptions(e){var t;(t=this.cellMenuInstance)==null||t.setOptions({hideOptionSection:!e})}async switchLanguage(){const e=this.selectedLanguage==="en"?"fr":"en";await this.i18n.setLocale(e),this.selectedLanguage=e}toggleDarkMode(){var e;this._darkModeGrid=!this._darkModeGrid,this._darkModeGrid?(document.querySelector(".panel-wm-content").classList.add("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="dark"):(document.querySelector(".panel-wm-content").classList.remove("dark-mode"),document.querySelector("#demo-container").dataset.bsTheme="light"),(e=this.aureliaGrid.slickGrid)==null||e.setOptions({darkMode:this._darkModeGrid})}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}y=N();x=$(y,0,"Example24",I,x);j(y,1,x);export{x as Example24};
//# sourceMappingURL=example24-DQqgYkUh.js.map
