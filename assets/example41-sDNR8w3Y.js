import{C as O,F as x,d as E,c as z}from"./index-xBMUucNl.js";const y="example41",f=`<div class="container-fluid">
  <h2>
    Example 41: Drag & Drop
    <span class="float-end">
      <a style="font-size: 18px" target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example41.ts">
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
    <ul>
      <li>Click to select, Ctrl-click to toggle selection(s).</li>
      <li>Drag one or more rows by the handle icon (1st column) to reorder.</li>
      <li>Drag one or more rows by selection (2nd or 3rd column) and drag to the recycle bin to delete.</li>
    </ul>
  </div>

  <div class="row">
    <div class="col">
      <aurelia-slickgrid grid-id="grid41"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
                    on-drag-init.trigger="handleOnDragInit($event.detail.eventData)"
                    on-drag-start.trigger="handleOnDragStart($event.detail.eventData)"
                    on-drag.trigger="handleOnDrag($event.detail.eventData, $event.detail.args)"
                    on-drag-end.trigger="handleOnDragEnd($event.detail.eventData, $event.detail.args)">
        <div au-slot="slickgrid-header" class="grid-header">
          <label>Santa's TODO list:</label>
        </div>
      </aurelia-slickgrid>
    </div>
    <div class="col">
      <div id="dropzone" class="recycle-bin mt-4">
        Recycle Bin
      </div>
    </div>
  </div>
</div>
`,S=[],D={};let v;function C(i){v||(v=O.define({name:y,template:f,dependencies:S,bindables:D})),i.register(v)}const T=Object.freeze(Object.defineProperty({__proto__:null,bindables:D,default:f,dependencies:S,name:y,register:C,template:f},Symbol.toStringTag,{value:"Module"}));var H=Object.create,w=Object.defineProperty,I=Object.getOwnPropertyDescriptor,P=(i,e)=>(e=Symbol[i])?e:Symbol.for("Symbol."+i),R=i=>{throw TypeError(i)},k=(i,e,t)=>e in i?w(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,$=(i,e)=>w(i,"name",{value:e,configurable:!0}),B=i=>[,,,H(null)],F=["class","method","getter","setter","accessor","field","value","get","set"],M=i=>i!==void 0&&typeof i!="function"?R("Function expected"):i,L=(i,e,t,a,r)=>({kind:F[i],name:e,metadata:a,addInitializer:s=>t._?R("Already initialized"):r.push(M(s||null))}),A=(i,e)=>k(e,P("metadata"),i[3]),j=(i,e,t,a)=>{for(var r=0,s=i[e>>1],o=s&&s.length;r<o;r++)s[r].call(t);return a},q=(i,e,t,a,r,s)=>{var o,n,c,d=e&7,g=!1,l=0,u=i[l]||(i[l]=[]),p=d&&(r=r.prototype,d<5&&(d>3||!g)&&I(r,t));$(r,t);for(var m=a.length-1;m>=0;m--)c=L(d,t,n={},i[3],u),o=(0,a[m])(r,c),n._=1,M(o)&&(r=o);return A(i,r),p&&w(r,t,p),g?d^4?s:p:r},h=(i,e,t)=>k(i,typeof e!="symbol"?e+"":e,t),G,_;G=[z(T)];class b{constructor(){h(this,"aureliaGrid"),h(this,"gridOptions"),h(this,"columnDefinitions"),h(this,"dataset",[]),h(this,"dragHelper"),h(this,"dragRows",[]),h(this,"dragMode",""),h(this,"hideSubTitle",!1),this.defineGrid(),this.dataset=this.mockData()}aureliaGridReady(e){this.aureliaGrid=e}defineGrid(){this.columnDefinitions=[{id:"name",name:"Name",field:"name",width:300,cssClass:"cell-title"},{id:"complete",name:"Complete",width:60,cssClass:"cell-effort-driven",field:"complete",cannotTriggerInsert:!0,formatter:x.checkmarkMaterial}],this.gridOptions={enableAutoResize:!1,gridHeight:225,gridWidth:800,rowHeight:33,enableCellNavigation:!0,enableRowSelection:!0,enableRowMoveManager:!0,rowSelectionOptions:{selectActiveRow:!1},rowMoveManager:{columnIndexPosition:0,cancelEditOnDrag:!0,disableRowSelection:!0,hideRowMoveShadow:!1,onBeforeMoveRows:this.onBeforeMoveRows.bind(this),onMoveRows:this.onMoveRows.bind(this)}}}mockData(){return[{id:0,name:"Make a list",complete:!0},{id:1,name:"Check it twice",complete:!1},{id:2,name:"Find out who's naughty",complete:!1},{id:3,name:"Find out who's nice",complete:!1}]}onBeforeMoveRows(e,t){for(const a of t.rows)if(a===t.insertBefore||a===t.insertBefore-1)return e.stopPropagation(),!1;return!0}onMoveRows(e,t){var d,g;const a=[],r=t.rows,s=t.insertBefore,o=this.dataset.slice(0,s),n=this.dataset.slice(s,this.dataset.length);r.sort((l,u)=>l-u);for(const l of r)a.push(this.dataset[l]);r.reverse();for(const l of r)l<s?o.splice(l,1):n.splice(l-s,1);this.dataset=o.concat(a.concat(n));const c=[];for(let l=0;l<r.length;l++)c.push(o.length+l);(d=this.aureliaGrid.slickGrid)==null||d.resetActiveCell(),(g=this.aureliaGrid.slickGrid)==null||g.invalidate()}handleOnDragInit(e){e.stopImmediatePropagation()}handleOnDragStart(e){var n,c,d,g;const t=(n=this.aureliaGrid.slickGrid)==null?void 0:n.getCellFromEvent(e);if(!t||t.cell===0){this.dragMode="";return}const a=t.row;if(!this.dataset[a]||E.isActive())return;e.stopImmediatePropagation(),this.dragMode="recycle";let r=((c=this.aureliaGrid.slickGrid)==null?void 0:c.getSelectedRows())||[];(!r.length||r.findIndex(l=>l===l)===-1)&&(r=[a],(d=this.aureliaGrid.slickGrid)==null||d.setSelectedRows(r)),this.dragRows=r;const s=r.length,o=document.createElement("span");return o.className="drag-message",o.textContent=`Drag to Recycle Bin to delete ${s} selected row(s)`,this.dragHelper=o,document.body.appendChild(o),(g=document.querySelector("#dropzone"))==null||g.classList.add("drag-dropzone"),o}handleOnDrag(e,t){if(this.dragMode!=="recycle")return;this.dragHelper instanceof HTMLElement&&(this.dragHelper.style.top=`${e.pageY+5}px`,this.dragHelper.style.left=`${e.pageX+5}px`);const a=document.querySelector("#dropzone");t.target instanceof HTMLElement&&(t.target.id==="dropzone"||t.target===a)?a.classList.add("drag-hover"):a.classList.remove("drag-hover")}handleOnDragEnd(e,t){var r,s,o,n;if(this.dragMode!="recycle"||((r=this.dragHelper)==null||r.remove(),(s=document.querySelector("#dropzone"))==null||s.classList.remove("drag-dropzone","drag-hover"),this.dragMode!="recycle"||t.target.id!=="dropzone"))return;const a=this.dragRows.sort().reverse();for(const c of a)this.dataset.splice(c,1);(o=this.aureliaGrid.slickGrid)==null||o.invalidate(),(n=this.aureliaGrid.slickGrid)==null||n.setSelectedRows([]),this.dataset=[...this.dataset]}toggleSubTitle(){var t;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(t=document.querySelector(".subtitle"))==null||t.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}_=B();b=q(_,0,"Example41",G,b);j(_,1,b);export{b as Example41};
//# sourceMappingURL=example41-sDNR8w3Y.js.map
