import{C as D,a as l,F as d,c as E}from"./index-BEnHDSQL.js";const C="example2",h=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px" target="_blank"
      href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example2.ts">
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

<button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="togglePauseResizer()">
  Pause auto-resize: <b>\${resizerPaused}</b>
</button>

<aurelia-slickgrid
  grid-id="grid2"
  column-definitions.bind="columnDefinitions"
  grid-options.bind="gridOptions"
  dataset.bind="dataset"
  instances.bind="aureliaGrid">
</aurelia-slickgrid>
`,k=[],w={};let p;function M(i){p||(p=D.define({name:C,template:h,dependencies:k,bindables:w})),i.register(p)}const O=Object.freeze(Object.defineProperty({__proto__:null,bindables:w,default:h,dependencies:k,name:C,register:M,template:h},Symbol.toStringTag,{value:"Module"}));var W=Object.create,f=Object.defineProperty,G=Object.getOwnPropertyDescriptor,I=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),T=i=>{throw TypeError(i)},z=(i,e,t)=>e in i?f(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,B=(i,e)=>f(i,"name",{value:e,configurable:!0}),N=i=>[,,,W(null)],j=["class","method","getter","setter","accessor","field","value","get","set"],P=i=>i!==void 0&&typeof i!="function"?T("Function expected"):i,R=(i,e,t,o,r)=>({kind:j[i],name:e,metadata:o,addInitializer:a=>t._?T("Already initialized"):r.push(P(a||null))}),$=(i,e)=>z(e,I("metadata"),i[3]),L=(i,e,t,o)=>{for(var r=0,a=i[e>>1],n=a&&a.length;r<n;r++)a[r].call(t);return o},q=(i,e,t,o,r,a)=>{var n,_,y,m=e&7,v=!1,x=0,F=i[x]||(i[x]=[]),u=m&&(r=r.prototype,m<5&&(m>3||!v)&&G(r,t));B(r,t);for(var c=o.length-1;c>=0;c--)y=R(m,t,_={},i[3],F),n=(0,o[c])(r,y),_._=1,P(n)&&(r=n);return $(i,r),u&&f(r,t,u),v?m^4?a:u:r},s=(i,e,t)=>z(i,typeof e!="symbol"?e+"":e,t),S,g;const A=(i,e,t)=>t?'<i class="mdi mdi-fire red" aria-hidden="true"></i>':{text:'<i class="mdi mdi-snowflake" aria-hidden="true"></i>',addClasses:"lightblue",toolTip:"Freezing"},U=(i,e,t)=>`<span style="margin-left: 5px">
      <button class="btn btn-xs btn-default btn-icon">
        <i class="mdi ${t?"mdi-check-circle":"mdi-circle"}" style="color: ${t?"black":"lavender"}"></i>
      </button>
    </span>`;S=[E(O)];class b{constructor(){s(this,"title","Example 2: Grid with Formatters"),s(this,"subTitle",`
    Grid with Custom and/or included Slickgrid Formatters (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/column-functionalities/formatters" target="_blank">Wiki docs</a>).
    <ul>
      <li>The 2 last columns are using Custom Formatters</li>
      <ul><li>The "Completed" column uses a the "onCellClick" event and a formatter to simulate a toggle action</li></ul>
      <li>
        Support Excel Copy Buffer (SlickGrid Copy Manager Plugin), you can use it by simply enabling "enableExcelCopyBuffer" flag.
        Note that it will only evaluate Formatter when the "exportWithFormatter" flag is enabled (through "ExcelExportOptions" or "TextExportOptions" or the column definition)
      </li>
      <li>This example also has auto-resize enabled, and we also demo how you can pause the resizer if you wish to</li>
    </ul>
  `),s(this,"aureliaGrid"),s(this,"gridOptions"),s(this,"columnDefinitions",[]),s(this,"dataset",[]),s(this,"hideSubTitle",!1),s(this,"resizerPaused",!1),this.defineGrid()}attached(){this.getData()}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",sortable:!0,type:l.string,width:70},{id:"phone",name:"Phone Number using mask",field:"phone",sortable:!0,type:l.number,minWidth:100,formatter:d.mask,params:{mask:"(000) 000-0000"}},{id:"duration",name:"Duration (days)",field:"duration",formatter:d.decimal,params:{minDecimal:1,maxDecimal:2},sortable:!0,type:l.number,minWidth:90,exportWithFormatter:!0},{id:"complete",name:"% Complete",field:"percentComplete",formatter:d.percentCompleteBar,type:l.number,sortable:!0,minWidth:100},{id:"percent2",name:"% Complete",field:"percentComplete2",formatter:d.progressBar,type:l.number,sortable:!0,minWidth:100},{id:"start",name:"Start",field:"start",formatter:d.dateIso,sortable:!0,type:l.date,minWidth:90,exportWithFormatter:!0},{id:"finish",name:"Finish",field:"finish",formatter:d.dateIso,sortable:!0,type:l.date,minWidth:90,exportWithFormatter:!0},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",formatter:A,type:l.number,sortable:!0,minWidth:100},{id:"completed",name:"Completed",field:"completed",type:l.number,sortable:!0,minWidth:100,formatter:U,onCellClick:(e,t)=>{this.toggleCompletedProperty(t&&t.dataContext)}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableCellNavigation:!0,showCustomFooter:!0,customFooterOptions:{leftFooterText:"custom footer text",hideTotalItemCount:!0,hideLastUpdateTimestamp:!0},enableExcelCopyBuffer:!0}}getData(){const e=[];for(let t=0;t<500;t++){const o=2e3+Math.floor(Math.random()*10),r=Math.floor(Math.random()*11),a=Math.floor(Math.random()*29),n=Math.round(Math.random()*100);e[t]={id:t,title:"Task "+t,phone:this.generatePhoneNumber(),duration:t%33===0?null:Math.random()*100+"",percentComplete:n,percentComplete2:n,percentCompleteNumber:n,start:new Date(o,r,a),finish:new Date(o,r+1,a),effortDriven:t%5===0}}this.dataset=e}generatePhoneNumber(){let e="";for(let t=0;t<10;t++)e+=Math.round(Math.random()*9)+"";return e}togglePauseResizer(){this.resizerPaused=!this.resizerPaused,this.aureliaGrid.resizerService.pauseResizer(this.resizerPaused)}toggleCompletedProperty(e){typeof e=="object"&&(e.completed=!e.completed,window.setTimeout(()=>{this.aureliaGrid.gridService.updateItemById(e.id,e,{highlightRow:!1})},250))}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}g=N();b=q(g,0,"Example2",S,b);L(g,1,b);export{b as Example2};
//# sourceMappingURL=example2-tc_lXhRz.js.map
