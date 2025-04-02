import{C as E,F as u,a as c,c as R}from"./index-Bz3uuwsZ.js";import{E as m}from"./editors.index-CmyHd4IA.js";const S="example11",f=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example11.ts">
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

<div class="col-sm-12">
  <span>
    <label>Scroll: </label>
    <div class="btn-group" role="group" aria-label="...">
      <button class="btn btn-sm btn-outline-secondary btn-icon" data-test="scroll-top-btn" click.trigger="scrollGridTop()">
        <i class="mdi mdi-arrow-down mdi-rotate-180 icon"></i>
      </button>
      <button class="btn btn-sm btn-outline-secondary btn-icon" data-test="scroll-bottom-btn"
              click.trigger="scrollGridBottom()">
        <i class="mdi mdi-arrow-down icon"></i>
      </button>
    </div>
    <button class="btn btn-sm btn-outline-secondary btn-icon" data-test="add-new-item-top-btn"
            click.trigger="addNewItem()">Add New Mocked Item (top)</button>
    <button class="btn btn-sm btn-outline-secondary btn-icon" data-test="add-new-item-bottom-btn"
            click.trigger="addNewItem('bottom')">Add New Mocked Item
      (bottom)</button>
    <button class="btn btn-sm btn-outline-secondary btn-icon" data-test="update-second-item-btn"
            click.trigger="updateSecondItem()">
      Update 2nd Row Item with Random Duration
    </button>
    <button class="btn btn-sm btn-outline-secondary btn-icon" data-test="highlight-row5-btn"
            click.trigger="highlighFifthRow()">Highlight 5th Row</button>
    <button class="btn btn-sm btn-outline-secondary btn-icon" data-test="highlight-duration40-btn"
            click.trigger="changeDurationBackgroundColor()">
      Highlight Rows with Duration over 50
    </button>
  </span>
  <hr />
</div>

<aurelia-slickgrid grid-id="grid11"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
`,M=[],C={};let p;function F(e){p||(p=E.define({name:S,template:f,dependencies:M,bindables:C})),e.register(p)}const N=Object.freeze(Object.defineProperty({__proto__:null,bindables:C,default:f,dependencies:M,name:S,register:F,template:f},Symbol.toStringTag,{value:"Module"}));var O=Object.create,w=Object.defineProperty,P=Object.getOwnPropertyDescriptor,z=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),I=e=>{throw TypeError(e)},D=(e,t,i)=>t in e?w(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,A=(e,t)=>w(e,"name",{value:t,configurable:!0}),V=e=>[,,,O(null)],B=["class","method","getter","setter","accessor","field","value","get","set"],x=e=>e!==void 0&&typeof e!="function"?I("Function expected"):e,H=(e,t,i,o,a)=>({kind:B[e],name:t,metadata:o,addInitializer:r=>i._?I("Already initialized"):a.push(x(r||null))}),j=(e,t)=>D(t,z("metadata"),e[3]),Y=(e,t,i,o)=>{for(var a=0,r=e[t>>1],n=r&&r.length;a<n;a++)r[a].call(i);return o},U=(e,t,i,o,a,r)=>{var n,d,h,s=t&7,_=!1,y=0,T=e[y]||(e[y]=[]),g=s&&(a=a.prototype,s<5&&(s>3||!_)&&P(a,i));A(a,i);for(var b=o.length-1;b>=0;b--)h=H(s,i,d={},e[3],T),n=(0,o[b])(a,h),d._=1,x(n)&&(a=n);return j(e,a),g&&w(a,i,g),_?s^4?r:g:a},l=(e,t,i)=>D(e,typeof t!="symbol"?t+"":t,i),G,k;G=[R(N)];class v{constructor(){l(this,"title","Example 11: Add / Update / Highlight a Datagrid Item"),l(this,"subTitle",`
  Add / Update / Hightlight an Item from the Datagrid (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/add-update-highlight" target="_blank">Wiki docs</a>).
  <ul>
    <li><b>Note:</b> this demo is <b>only</b> on the datagrid (client) side, you still need to deal with the backend yourself</li>
    <li>Adding an item, will always be showing as the 1st item in the grid because that is the best visual place to add it</li>
    <li>Add/Update an item requires a valid Slickgrid Selection Model, you have 2 choices to deal with this:</li>
    <ul><li>You can enable "enableCheckboxSelector" or "enableRowSelection" to True</li></ul>
    <li>Click on any of the buttons below to test this out</li>
    <li>You can change the highlighted color &amp; animation by changing the <a href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/styles/_variables.scss" target="_blank">SASS Variables</a></li>
    <ul>
      <li>"$row-highlight-background-color" or "$row-highlight-fade-animation"</li>
    </ul>
    <li>You can also add CSS class(es) on the fly (or on page load) on rows with certain criteria, (e.g. click on last button)<li>
    <ul>
      <li>Example, click on button "Highlight Rows with Duration over 50" to see row styling changing. <a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/dynamic-item-metadata" target="_blank">Wiki doc</a></li>
    </ul>
  </ul>
  `),l(this,"aureliaGrid"),l(this,"dataView"),l(this,"grid"),l(this,"gridService"),l(this,"columnDefinitions",[]),l(this,"gridOptions"),l(this,"dataset",[]),l(this,"hideSubTitle",!1),this.defineGrid(),this.mockData(1e3)}aureliaGridReady(t){this.aureliaGrid=t,this.dataView=t.dataView,this.grid=t.slickGrid,this.gridService=t.gridService}defineGrid(){this.columnDefinitions=[{id:"delete",field:"id",excludeFromHeaderMenu:!0,formatter:u.icon,params:{iconCssClass:"mdi mdi-trash-can pointer"},minWidth:30,maxWidth:30,onCellClick:(t,i)=>{console.log(i),confirm("Are you sure?")&&this.aureliaGrid.gridService.deleteItemById(i.dataContext.id)}},{id:"title",name:"Title",field:"title",sortable:!0,type:c.string,editor:{model:m.longText}},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,type:c.number,editor:{model:m.text},onCellChange:(t,i)=>{alert("onCellChange directly attached to the column definition"),console.log(i)}},{id:"complete",name:"% Complete",field:"percentComplete",formatter:u.percentCompleteBar,type:c.number,editor:{model:m.integer}},{id:"start",name:"Start",field:"start",formatter:u.dateIso,sortable:!0,type:c.date},{id:"finish",name:"Finish",field:"finish",formatter:u.dateIso,sortable:!0,type:c.date},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",formatter:u.checkmarkMaterial,type:c.number,editor:{model:m.checkbox}}],this.gridOptions={asyncEditorLoading:!1,autoResize:{container:"#demo-container",rightPadding:10},editable:!0,enableColumnPicker:!0,enableCellNavigation:!0,enableRowSelection:!0}}mockData(t){const i=[];for(let o=0;o<t;o++){const a=2e3+Math.floor(Math.random()*10),r=Math.floor(Math.random()*11),n=Math.floor(Math.random()*29),d=Math.round(Math.random()*100);i[o]={id:o,title:"Task "+o,duration:Math.round(Math.random()*100)+"",percentComplete:d,percentCompleteNumber:d,start:new Date(a,r,n),finish:new Date(a,r+1,n),effortDriven:o%5===0}}this.dataset=i}addNewItem(t){const i=this.createNewItem(1);this.aureliaGrid.gridService.addItem(i,{position:t})}createNewItem(t=1){const i=this.aureliaGrid.dataView.getItems();let o=0;i.forEach(s=>{s.id>o&&(o=s.id)});const a=o+t,r=2e3+Math.floor(Math.random()*10),n=Math.floor(Math.random()*11),d=Math.floor(Math.random()*29),h=Math.round(Math.random()*100);return{id:a,title:"Task "+a,duration:Math.round(Math.random()*100)+"",percentComplete:h,percentCompleteNumber:h,start:new Date(r,n,d),finish:new Date(r,n+2,d),effortDriven:!0}}changeDurationBackgroundColor(){this.dataView.getItemMetadata=this.updateItemMetadataForDurationOver40(this.dataView.getItemMetadata),this.grid.invalidate(),this.grid.render()}highlighFifthRow(){this.scrollGridTop(),this.aureliaGrid.gridService.highlightRow(4,1500)}updateItemMetadataForDurationOver40(t){const i="duration-bg";return o=>{const a=this.dataView.getItem(o);let r={cssClasses:""};return typeof t=="object"&&(r=t(o)),r&&a&&a.duration&&+a.duration>40&&(r.cssClasses=(r.cssClasses||"")+" "+i),r}}updateSecondItem(){this.scrollGridTop();const t=this.aureliaGrid.gridService.getDataItemByRowNumber(1);t.duration=Math.round(Math.random()*100),this.aureliaGrid.gridService.updateItem(t)}scrollGridBottom(){this.aureliaGrid.slickGrid.navigateBottom()}scrollGridTop(){this.aureliaGrid.slickGrid.navigateTop()}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const t=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[t]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}k=V();v=U(k,0,"Example11",G,v);Y(k,1,v);export{v as Example11};
//# sourceMappingURL=example11-GDX8aTm3.js.map
