import{C as x,x as D,b,a as R,F as u,y as M,c as j}from"./index-BEnHDSQL.js";import{E as $}from"./editors.index-mXwEHkpi.js";const C="example20",f=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example20.ts">
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

<br>

<div class="row">
  <div class="col-sm-12">
    <span>
      <label for="">Pinned Rows: </label>
      <input type="number"
              value.bind="frozenRowCount">
      <button class="btn btn-outline-secondary btn-xs btn-icon"
              click.trigger="changeFrozenRowCount()">
        Set
      </button>
    </span>
    <span style="margin-left: 10px">
      <label for="">Pinned Columns: </label>
      <input type="number"
              value.bind="frozenColumnCount">
      <button class="btn btn-outline-secondary btn-xs btn-icon"
              click.trigger="changeFrozenColumnCount()">
        Set
      </button>
    </span>
  </div>
</div>

<div class="row mt-2">
  <div class="col-sm-12">
    <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="setFrozenColumns(-1)"
            data-test="remove-frozen-column-button">
      <i class="mdi mdi-close"></i> Remove Frozen Columns
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="setFrozenColumns(2)"
            data-test="set-3frozen-columns">
      <i class="mdi mdi-pin-outline"></i> Set 3 Frozen Columns
    </button>
    <span style="margin-left: 15px">
      <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="toggleFrozenBottomRows()">
        <i class="mdi mdi-flip-vertical"></i> Toggle Pinned Rows
      </button>
      <span style="font-weight: bold;">: \${ isFrozenBottom ? 'Bottom' : 'Top' }</span>
    </span>
  </div>
</div>

<div class="col-sm-12">
  <hr>
</div>

<aurelia-slickgrid grid-id="grid20"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-validation-error.trigger="onCellValidationError($event.detail.eventData, $event.detail.args)"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
`,O=[],y={};let h;function W(i){h||(h=x.define({name:C,template:f,dependencies:O,bindables:y})),i.register(h)}const P=Object.freeze(Object.defineProperty({__proto__:null,bindables:y,default:f,dependencies:O,name:C,register:W,template:f},Symbol.toStringTag,{value:"Module"}));var B=Object.create,p=Object.defineProperty,H=Object.getOwnPropertyDescriptor,I=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),k=i=>{throw TypeError(i)},F=(i,e,t)=>e in i?p(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,G=(i,e)=>p(i,"name",{value:e,configurable:!0}),V=i=>[,,,B(null)],N=["class","method","getter","setter","accessor","field","value","get","set"],S=i=>i!==void 0&&typeof i!="function"?k("Function expected"):i,U=(i,e,t,l,o)=>({kind:N[i],name:e,metadata:l,addInitializer:n=>t._?k("Already initialized"):o.push(S(n||null))}),A=(i,e)=>F(e,I("metadata"),i[3]),K=(i,e,t,l)=>{for(var o=0,n=i[e>>1],s=n&&n.length;o<s;o++)n[o].call(t);return l},L=(i,e,t,l,o,n)=>{var s,a,w,d=e&7,z=!1,_=0,E=i[_]||(i[_]=[]),m=d&&(o=o.prototype,d<5&&(d>3||!z)&&H(o,t));G(o,t);for(var c=l.length-1;c>=0;c--)w=U(d,t,a={},i[3],E),s=(0,l[c])(o,w),a._=1,S(s)&&(o=s);return A(i,o),m&&p(o,t,m),z?d^4?n:m:o},r=(i,e,t)=>F(i,typeof e!="symbol"?e+"":e,t),T,v;T=[j(P)];class g{constructor(){r(this,"title","Example 20: Pinned (frozen) Columns/Rows"),r(this,"subTitle",`
    This example demonstrates the use of Pinned (aka frozen) Columns and/or Rows (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/frozen-columns-rows" target="_blank">Wiki docs</a>)
    <ul>
      <li>Option to pin any number of columns (left only) or rows</li>
      <li>Option to pin the rows at the bottom instead of the top (default)</li>
      <li>You can also dynamically any of these options, through SlickGrid "setOptions()"</li>
      <li>Possibility to change the styling of the line border between pinned columns/rows</li>
    </ul>
  `),r(this,"aureliaGrid"),r(this,"columnDefinitions",[]),r(this,"gridObj"),r(this,"gridOptions"),r(this,"frozenColumnCount",2),r(this,"frozenRowCount",3),r(this,"hideSubTitle",!1),r(this,"isFrozenBottom",!1),r(this,"dataset",[]),r(this,"slickEventHandler"),this.defineGrid(),this.slickEventHandler=new D}aureliaGridReady(e){this.aureliaGrid=e,this.gridObj=e&&e.slickGrid,this.slickEventHandler.subscribe(this.gridObj.onMouseEnter,t=>this.colorizeHoveringRow(t,!0)),this.slickEventHandler.subscribe(this.gridObj.onMouseLeave,t=>this.colorizeHoveringRow(t,!1))}colorizeHoveringRow(e,t){const l=this.gridObj.getCellFromEvent(e),o=t?[(l==null?void 0:l.row)??0]:[];this.gridObj.setSelectedRows(o),e.preventDefault()}attached(){this.getData()}detaching(){this.slickEventHandler.unsubscribeAll()}defineGrid(){this.columnDefinitions=[{id:"sel",name:"#",field:"id",minWidth:40,width:40,maxWidth:40,cannotTriggerInsert:!0,resizable:!1,unselectable:!0},{id:"title",name:"Title",field:"title",minWidth:100,width:120,filterable:!0,sortable:!0},{id:"percentComplete",name:"% Complete",field:"percentComplete",resizable:!1,minWidth:130,width:140,formatter:u.percentCompleteBar,type:R.number,filterable:!0,filter:{model:b.slider,operator:">="},sortable:!0},{id:"start",name:"Start",field:"start",minWidth:100,width:120,filterable:!0,sortable:!0,formatter:u.dateIso},{id:"finish",name:"Finish",field:"finish",minWidth:100,width:120,filterable:!0,sortable:!0,formatter:u.dateIso},{id:"cost",name:"Cost | Duration",field:"cost",formatter:this.costDurationFormatter.bind(this),minWidth:150,width:170,sortable:!0,filter:{model:b.compoundSlider},editor:{model:$.dualInput,params:{leftInput:{field:"cost",type:"float",decimal:2,minValue:0,maxValue:5e4,placeholder:"< 50K",errorMessage:"Cost must be positive and below $50K."},rightInput:{field:"duration",type:"float",minValue:0,maxValue:100,title:"make sure Duration is withing its range of 0 to 100",errorMessage:"Duration must be between 0 and 100."}}}},{id:"effortDriven",name:"Effort Driven",field:"effortDriven",minWidth:100,width:120,formatter:u.checkmarkMaterial,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:b.singleSelect},sortable:!0},{id:"title1",name:"Title 1",field:"title1",minWidth:100,width:120,filterable:!0,sortable:!0},{id:"title2",name:"Title 2",field:"title2",minWidth:100,width:120,filterable:!0,sortable:!0},{id:"title3",name:"Title 3",field:"title3",minWidth:100,width:120,filterable:!0,sortable:!0},{id:"title4",name:"Title 4",field:"title4",minWidth:100,width:120,filterable:!0,sortable:!0}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},gridWidth:920,enableCellNavigation:!0,editable:!0,autoEdit:!0,enableExcelCopyBuffer:!0,frozenColumn:this.frozenColumnCount,frozenRow:this.frozenRowCount,gridMenu:{hideClearFrozenColumnsCommand:!1},headerMenu:{hideFreezeColumnsCommand:!1}}}getData(){const e=[];for(let t=0;t<500;t++)e[t]={id:t,title:"Task "+t,cost:t%33===0?null:Math.random()*1e4,duration:t%8?Math.round(Math.random()*100)+"":null,percentComplete:Math.round(Math.random()*100),start:new Date(2009,0,1),finish:new Date(2009,4,5),effortDriven:t%5===0,title1:`Some Text ${Math.round(Math.random()*25)}`,title2:`Some Text ${Math.round(Math.random()*25)}`,title3:`Some Text ${Math.round(Math.random()*25)}`,title4:`Some Text ${Math.round(Math.random()*25)}`};this.dataset=e}changeFrozenColumnCount(){this.gridObj&&this.gridObj.setOptions&&this.gridObj.setOptions({frozenColumn:this.frozenColumnCount})}changeFrozenRowCount(){this.gridObj&&this.gridObj.setOptions&&this.gridObj.setOptions({frozenRow:this.frozenRowCount})}costDurationFormatter(e,t,l,o,n){const s=this.isNullUndefinedOrEmpty(n.cost)?"n/a":M(n.cost,0,2,!1,"$","",".",",");let a="n/a";return!this.isNullUndefinedOrEmpty(n.duration)&&n.duration>=0&&(a=`${n.duration} ${n.duration>1?"days":"day"}`),`<b>${s}</b> | ${a}`}isNullUndefinedOrEmpty(e){return e===""||e===null||e===void 0}onCellValidationError(e,t){alert(t.validationResults.msg)}setFrozenColumns(e){this.gridObj.setOptions({frozenColumn:e}),this.gridOptions=this.gridObj.getOptions()}toggleFrozenBottomRows(){this.gridObj&&this.gridObj.setOptions&&(this.gridObj.setOptions({frozenBottom:!this.isFrozenBottom}),this.isFrozenBottom=!this.isFrozenBottom)}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}v=V();g=L(v,0,"Example20",T,g);K(v,1,g);export{g as Example20};
//# sourceMappingURL=example20-Clpnbi4s.js.map
