import{C as D,c as E}from"./index-xBMUucNl.js";const x="example7",v=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example7.ts">
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

<h5>Grid 1</h5>
<aurelia-slickgrid
                    grid-id="grid7-1"
                    column-definitions.bind="columnDefinitions1"
                    grid-options.bind="gridOptions1"
                    dataset.bind="dataset1"
                    on-aurelia-grid-created.trigger="aureliaGrid1Ready($event.detail)">
</aurelia-slickgrid>
<br />
<h5>Grid 2 - <span class="subtitle">with both Header Buttons & Menus</span></h5>
<aurelia-slickgrid
                    grid-id="grid7-2"
                    column-definitions.bind="columnDefinitions2"
                    grid-options.bind="gridOptions2"
                    dataset.bind="dataset2"
                    on-aurelia-grid-created.trigger="aureliaGrid2Ready($event.detail)">
</aurelia-slickgrid>
`,O=[],k={};let f;function P(t){f||(f=D.define({name:x,template:v,dependencies:O,bindables:k})),t.register(f)}const z=Object.freeze(Object.defineProperty({__proto__:null,bindables:k,default:v,dependencies:O,name:x,register:P,template:v},Symbol.toStringTag,{value:"Module"}));var B=Object.create,C=Object.defineProperty,R=Object.getOwnPropertyDescriptor,$=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),w=t=>{throw TypeError(t)},H=(t,e,i)=>e in t?C(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,M=(t,e)=>C(t,"name",{value:e,configurable:!0}),F=t=>[,,,B(null)],I=["class","method","getter","setter","accessor","field","value","get","set"],G=t=>t!==void 0&&typeof t!="function"?w("Function expected"):t,j=(t,e,i,l,n)=>({kind:I[t],name:e,metadata:l,addInitializer:a=>i._?w("Already initialized"):n.push(G(a||null))}),A=(t,e)=>H(e,$("metadata"),t[3]),U=(t,e,i,l)=>{for(var n=0,a=t[e>>1],c=a&&a.length;n<c;n++)a[n].call(i);return l},V=(t,e,i,l,n,a)=>{var c,o,s,r=e&7,u=!1,m=0,T=t[m]||(t[m]=[]),g=r&&(n=n.prototype,r<5&&(r>3||!u)&&R(n,i));M(n,i);for(var p=l.length-1;p>=0;p--)s=j(r,i,o={},t[3],T),c=(0,l[p])(n,s),o._=1,G(c)&&(n=c);return A(t,n),g&&C(n,i,g),u?r^4?a:g:n},d=(t,e,i)=>H(t,typeof e!="symbol"?e+"":e,i),S,y;let h={},b={};S=[E(z)];class _{constructor(){d(this,"title","Example 7: Header Button Plugin"),d(this,"subTitle",`
    This example demonstrates using the <b>Slick.Plugins.HeaderButtons</b> plugin to easily add buttons to colum headers.
    These buttons can be specified directly in the column definition, and are very easy to configure and use.
    (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/header-menu-header-buttons" target="_blank">Wiki docs</a>)
    <ul>
      <li>Resize the 1st column to see all icon/command</li>
      <li>Mouse hover the 2nd column to see it's icon/command</li>
      <li>For all the other columns, click on top-right red circle icon to enable highlight of negative numbers.</li>
      <li>Use override callback functions to change the properties of show/hide, enable/disable the menu or certain item(s) from the list</li>
      <ol>
        <li>These callbacks are: "itemVisibilityOverride", "itemUsabilityOverride"</li>
        <li>for example the "Column E" does not show the header button via "itemVisibilityOverride"</li>
        <li>for example the "Column J" header button is displayed but it not usable via "itemUsabilityOverride"</li>
      </ol>
    </ul>
  `),d(this,"columnDefinitions1",[]),d(this,"columnDefinitions2",[]),d(this,"gridOptions1"),d(this,"gridOptions2"),d(this,"dataset1",[]),d(this,"dataset2",[]),d(this,"aureliaGrid1"),d(this,"aureliaGrid2"),d(this,"hideSubTitle",!1),this.defineGrid(),h={},b={}}attached(){this.dataset1=this.loadData(200,1),this.dataset2=this.loadData(200,2)}aureliaGrid1Ready(e){this.aureliaGrid1=e}aureliaGrid2Ready(e){this.aureliaGrid2=e}defineGrid(){this.columnDefinitions1=[],this.columnDefinitions2=[],this.gridOptions1={enableAutoResize:!0,enableHeaderButton:!0,enableHeaderMenu:!1,autoResize:{container:"#demo-container",rightPadding:10},enableFiltering:!1,enableExcelCopyBuffer:!0,excelCopyBufferOptions:{onCopyCells:(e,i)=>console.log("onCopyCells",e,i),onPasteCells:(e,i)=>console.log("onPasteCells",e,i),onCopyCancelled:(e,i)=>console.log("onCopyCancelled",e,i)},enableCellNavigation:!0,gridHeight:275,headerButton:{onCommand:(e,i)=>this.handleOnCommand(e,i,1)}},this.gridOptions2={...this.gridOptions1,enableHeaderMenu:!0,enableFiltering:!0,headerButton:{onCommand:(e,i)=>this.handleOnCommand(e,i,2)}}}handleOnCommand(e,i,l){const n=i.column,a=i.button;i.command==="toggle-highlight"&&(a.cssClass==="mdi mdi-lightbulb-on text-danger"?(l===1?delete h[n.id]:delete b[n.id],a.cssClass="mdi mdi-lightbulb-outline text-warning faded",a.tooltip="Highlight negative numbers."):(l===1?h[n.id]=!0:b[n.id]=!0,a.cssClass="mdi mdi-lightbulb-on text-danger",a.tooltip="Remove highlight."),this[`aureliaGrid${l}`].slickGrid.invalidate())}loadData(e,i){var a,c;const l=[];for(let o=0;o<10;o++)l.push({id:o,name:"Column "+String.fromCharCode(65+o),field:o+"",width:o===0?70:100,filterable:!0,sortable:!0,formatter:(s,r,u,m)=>i===1&&h[m.id]&&u<0?`<div style="color:red; font-weight:bold;">${u}</div>`:i===2&&b[m.id]&&u<0?`<div style="color:red; font-weight:bold;">${u}</div>`:u,header:{buttons:[{cssClass:"mdi mdi-lightbulb-outline text-warning faded",command:"toggle-highlight",tooltip:"Highlight negative numbers.",itemVisibilityOverride:s=>s.column.name!=="Column E",itemUsabilityOverride:s=>s.column.name!=="Column J",action:(s,r)=>{console.log(`execute a callback action to "${r.command}" on ${r.column.name}`)}}]}});l[0].name="Resize me!",l[0].header={buttons:[{cssClass:"mdi mdi-message-text",handler:()=>{alert("Tag")}},{cssClass:"mdi mdi-forum-outline",handler:()=>{alert("Comment")}},{cssClass:"mdi mdi-information",handler:()=>{alert("Info")}},{cssClass:"mdi mdi-help-circle",handler:()=>{alert("Help")}}]},i===2&&((c=(a=l[0].header)==null?void 0:a.buttons)==null||c.reverse()),l[1].name="Hover me!",l[1].header={buttons:[{cssClass:"mdi mdi-help-circle",showOnHover:!0,tooltip:"This button only appears on hover.",handler:()=>{alert("Help")}}]};const n=[];for(let o=0;o<e;o++){const s=n[o]={};s.id=o;for(let r=0;r<l.length;r++)s[r]=Math.round(Math.random()*10)-5}return this[`columnDefinitions${i}`]=l,n}}y=F();_=V(y,0,"Example7",S,_);U(y,1,_);export{_ as Example7};
//# sourceMappingURL=example7-BSQuyTkV.js.map
