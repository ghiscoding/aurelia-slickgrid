import{C as D,r as R,I as N,a as v,F as x,c as P}from"./index-xBMUucNl.js";import{E as c}from"./editors.index-CQ9Y46Rw.js";import{S as L}from"./slickCustomTooltip-BwjRI8RF.js";const B="example35",g=`<h2>
  Example 35: Row Based Editing
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example35.ts">
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
    <li>
      The Row Based Edit plugin allows you to edit either a single or multiple
      specific rows at a time, while disabling the rest of the grid rows.
    </li>
    <li>
      Editedable rows, as well as modified cells are highlighted with a
      different color, which you can customize using css variables (see
      <a
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example35.scss"
      >
        example35.scss </a
      >)
    </li>
    <li>
      Modifications are kept track of and if the cancel button is pressed, all
      modifications are rolled back.
    </li>
    <li>
      If the save button is pressed, a custom "onBeforeRowUpdated" callback is called, which you can use to save the data with your backend.<br />
      The callback needs to return a Promise&lt;boolean&gt; and if the promise resolves to true, then the row will be updated, otherwise it will be cancelled and stays in edit mode.
      You can try out the later by defining a Duration value <b>larger than 40</b>.
      <br />
      <small><span class="has-text-danger">NOTE:</span> You can also combine this with e.g. Batch Editing like shown <a href="#/example30">in Example 30</a></small>
    </li>
    <li>
      This example additionally uses the ExcelCopyBuffer Plugin, which you can see also in Slickgrid-Universal
       <a href="https://ghiscoding.github.io/slickgrid-universal/#/example19">example 19</a>.
      The example defines a rule that pastes in the first column are prohibited. In combination with the Row Based Editing Plugin though, this rule gets enhanced with the fact
      that only the edited rows are allowed to be pasted into, while still respecting the original rule.
    </li>
  </ul>
</div>

<section>
  <div class="row mb-4">
      <div class="col-sm-8">
        <button
          class="btn btn-outline-secondary btn-sm btn-icon"
          data-test="single-multi-toggle"
          click.trigger="toggleSingleMultiRowEdit()"
        >
          Toggle Single/Multi Row Edit
        </button>
        <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="toggle-language" click.trigger="switchLanguage()">
          <i class="mdi mdi-translate"></i>
          Switch Language for Action column buttons
        </button>
        <label>Locale:</label>
        <span style="font-style: italic; width: 70px;" data-test="selected-locale">
          \${selectedLanguage + '.json'}
        </span>
      </div>

      <div class="col-sm-4" class.bind="statusClass">
        <strong>Status: </strong>
        <span data-test="fetch-result" textcontent.bind="fetchResult"></span>
      </div>
  </div>
</section>

<aurelia-slickgrid grid-id="grid35" column-definitions.bind="columnDefinitions" grid-options.bind="gridOptions"
    dataset.bind="dataset" instances.bind="aureliaGrid">
</aurelia-slickgrid>
`,E=[],S={};let p;function F(t){p||(p=D.define({name:B,template:g,dependencies:E,bindables:S})),t.register(p)}const z=Object.freeze(Object.defineProperty({__proto__:null,bindables:S,default:g,dependencies:E,name:B,register:F,template:g},Symbol.toStringTag,{value:"Module"}));var G=Object.create,f=Object.defineProperty,I=Object.getOwnPropertyDescriptor,W=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),C=t=>{throw TypeError(t)},k=(t,e,i)=>e in t?f(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,j=(t,e)=>f(t,"name",{value:e,configurable:!0}),A=t=>[,,,G(null)],U=["class","method","getter","setter","accessor","field","value","get","set"],T=t=>t!==void 0&&typeof t!="function"?C("Function expected"):t,Y=(t,e,i,s,a)=>({kind:U[t],name:e,metadata:s,addInitializer:o=>i._?C("Already initialized"):a.push(T(o||null))}),H=(t,e)=>k(e,W("metadata"),t[3]),J=(t,e,i,s)=>{for(var a=0,o=t[e>>1],l=o&&o.length;a<l;a++)o[a].call(i);return s},K=(t,e,i,s,a,o)=>{var l,d,n,u=e&7,y=!1,_=0,M=t[_]||(t[_]=[]),h=u&&(a=a.prototype,u<5&&(u>3||!y)&&I(a,i));j(a,i);for(var m=s.length-1;m>=0;m--)n=Y(u,i,d={},t[3],M),l=(0,s[m])(a,n),d._=1,T(l)&&(a=l);return H(t,a),h&&f(a,i,h),y?u^4?o:h:a},r=(t,e,i)=>k(t,typeof e!="symbol"?e+"":e,i),O,w;const q=20;O=[P(z)];class b{constructor(e=R(N)){this.i18n=e,r(this,"aureliaGrid"),r(this,"gridOptions"),r(this,"columnDefinitions"),r(this,"dataset"),r(this,"fetchResult",""),r(this,"hideSubTitle",!1),r(this,"selectedLanguage"),r(this,"selectedLanguageFile"),r(this,"statusClass","alert alert-light"),r(this,"statusStyle","display: none"),this.defineGrid();const i="en";this.i18n.setLocale(i),this.selectedLanguage=i}attached(){this.dataset=this.getData(q)}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",sortable:!0,minWidth:100,filterable:!0,editor:{model:c.text}},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,minWidth:100,filterable:!0,type:v.number,editor:{model:c.text}},{id:"%",name:"% Complete",field:"percentComplete",sortable:!0,minWidth:100,filterable:!0,type:v.number,editor:{model:c.text}},{id:"start",name:"Start",field:"start",formatter:x.dateIso,exportWithFormatter:!0,filterable:!0,editor:{model:c.date}},{id:"finish",name:"Finish",field:"finish",formatter:x.dateIso,exportWithFormatter:!0,filterable:!0,editor:{model:c.date}},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",sortable:!0,minWidth:100,filterable:!0,type:"boolean",editor:{model:c.checkbox}}],this.gridOptions={enableAutoResize:!1,gridHeight:350,gridWidth:800,rowHeight:33,enableExcelCopyBuffer:!0,excelCopyBufferOptions:{onBeforePasteCell:(e,i)=>i.cell>0},autoEdit:!1,editable:!0,enableCellNavigation:!0,enableRowBasedEdit:!0,enableTranslate:!0,i18n:this.i18n,rowBasedEditOptions:{allowMultipleRows:!1,onBeforeEditMode:()=>this.clearStatus(),onBeforeRowUpdated:e=>{const{effortDriven:i,percentComplete:s,finish:a,start:o,duration:l,title:d}=e.dataContext;return l>40?(alert("Sorry, 40 is the maximum allowed duration."),Promise.resolve(!1)):V("your-backend-api/endpoint",{body:JSON.stringify({effortDriven:i,percentComplete:s,finish:a,start:o,duration:l,title:d})}).catch(n=>(console.error(n),!1)).then(n=>{if(n===!1)return this.statusClass="alert alert-danger",!1;if(typeof n=="object")return n.json()}).then(n=>(this.statusStyle="display: block",this.statusClass="alert alert-success",this.fetchResult=n.message,!0))},actionColumnConfig:{width:100,minWidth:100,maxWidth:100},actionButtons:{editButtonClassName:"button-style margin-auto btn-icon px-2 me-1",iconEditButtonClassName:"mdi mdi-pencil",cancelButtonClassName:"button-style btn-icon px-2",cancelButtonTitle:"Cancel row",cancelButtonTitleKey:"RBE_BTN_CANCEL",iconCancelButtonClassName:"mdi mdi-undo text-danger",cancelButtonPrompt:"Are you sure you want to cancel your changes?",updateButtonClassName:"button-style btn-icon px-2 me-1",updateButtonTitle:"Update row",updateButtonTitleKey:"RBE_BTN_UPDATE",iconUpdateButtonClassName:"mdi mdi-check text-success",updateButtonPrompt:"Save changes?",deleteButtonClassName:"button-style btn-icon px-2",deleteButtonTitle:"Delete row",iconDeleteButtonClassName:"mdi mdi-trash-can text-danger",deleteButtonPrompt:"Are you sure you want to delete this row?"}},externalResources:[new L]}}getData(e){const i=[];for(let s=0;s<e;s++){const a=2e3+Math.floor(Math.random()*10),o=Math.floor(Math.random()*11),l=Math.floor(Math.random()*29),d=Math.round(Math.random()*100);i[s]={id:s,title:"Task "+s,duration:Math.round(Math.random()*40)+"",percentComplete:d,start:new Date(a,o+1,l),finish:new Date(a+1,o+1,l),effortDriven:s%5===0}}return i}clearStatus(){this.statusClass="alert alert-light",this.statusStyle="display: none",this.fetchResult=""}toggleSingleMultiRowEdit(){var i;const e={...this.gridOptions,rowBasedEditOptions:{...this.gridOptions.rowBasedEditOptions,allowMultipleRows:!((i=this.gridOptions.rowBasedEditOptions)!=null&&i.allowMultipleRows)}};this.aureliaGrid.slickGrid.setOptions(e),this.gridOptions=this.aureliaGrid.slickGrid.getOptions()}async switchLanguage(){const e=this.selectedLanguage==="en"?"fr":"en";await this.i18n.setLocale(e),this.selectedLanguage=e}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}w=A();b=K(w,0,"Example35",O,b);J(w,1,b);function V(t,e){return new Promise(i=>{window.setTimeout(()=>{i(new Response(JSON.stringify({status:200,message:"success"})))},window.Cypress?10:500)})}export{b as Example35};
//# sourceMappingURL=example35-M73rHVwK.js.map
