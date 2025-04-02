import{C as M,r as T,n as w,b as C,c as j}from"./index-Bz3uuwsZ.js";import{I as E}from"./index.dev-DuhuQGSj.js";import{S as P}from"./customers_100-D4oCOlSv.js";const y="example22",b=`<h2>
  Example 22: Grids in Bootstrap Tabs
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example22.ts">
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

<div class="subtitle" hidden.bind="hideSubTitle">
  This example demonstrate the creation of multiple grids in Bootstrap Tabs
   <ol>
    <li>Regular mocked data with javascript</li>
    <li>Load dataset through Fetch-Client. Also note we need to call a "resizeGrid()" after focusing on this tab</li>
  </ol>
</div>

<div>
  <nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <button
          class="nav-link active"
          id="javascript-tab"
          data-bs-toggle="tab"
          data-bs-target="#javascript"
          type="button"
          role="tab"
          aria-controls="javascript"
          aria-selected="true">
        JavaScript
      </button>
      <button
          class="nav-link"
          id="fetch-tab"
          data-bs-toggle="tab"
          data-bs-target="#fetch"
          type="button"
          role="tab"
          aria-controls="fetch"
          aria-selected="false"
          click.trigger="resizeGrid2()">
        Fetch-Client
      </button>
    </div>
  </nav>
  <div class="tab-content" id="nav-tabContent">
    <div class="tab-pane fade show active" id="javascript" role="tabpanel" aria-labelledby="javascript-tab" tabindex="0">
      <h4>Grid 1 - Load Local Data</h4>
      <aurelia-slickgrid grid-id="grid1"
                          column-definitions.bind="columnDefinitions1"
                          grid-options.bind="gridOptions1"
                          dataset.bind="dataset1">
      </aurelia-slickgrid>
    </div>
    <div class="tab-pane fade" id="fetch" role="tabpanel" aria-labelledby="fetch-tab" tabindex="0">
      <h4>Grid 2 - Load a JSON dataset through Fetch-Client</h4>
      <aurelia-slickgrid grid-id="grid2"
                          column-definitions.bind="columnDefinitions2"
                          grid-options.bind="gridOptions2"
                          dataset.bind="dataset2"
                          on-aurelia-grid-created.trigger="aureliaGrid2Ready($event.detail)">
      </aurelia-slickgrid>
    </div>
  </div>
</div>
`,S=[],D={};let u;function F(e){u||(u=M.define({name:y,template:b,dependencies:S,bindables:D})),e.register(u)}const R=Object.freeze(Object.defineProperty({__proto__:null,bindables:D,default:b,dependencies:S,name:y,register:F,template:b},Symbol.toStringTag,{value:"Module"}));var A=Object.create,h=Object.defineProperty,$=Object.getOwnPropertyDescriptor,I=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),x=e=>{throw TypeError(e)},k=(e,t,i)=>t in e?h(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,L=(e,t)=>h(e,"name",{value:t,configurable:!0}),W=e=>[,,,A(null)],N=["class","method","getter","setter","accessor","field","value","get","set"],G=e=>e!==void 0&&typeof e!="function"?x("Function expected"):e,B=(e,t,i,r,a)=>({kind:N[e],name:t,metadata:r,addInitializer:n=>i._?x("Already initialized"):a.push(G(n||null))}),J=(e,t)=>k(t,I("metadata"),e[3]),H=(e,t,i,r)=>{for(var a=0,n=e[t>>1],l=n&&n.length;a<l;a++)n[a].call(i);return r},U=(e,t,i,r,a,n)=>{var l,p,v,s=t&7,g=!1,_=0,O=e[_]||(e[_]=[]),d=s&&(a=a.prototype,s<5&&(s>3||!g)&&$(a,i));L(a,i);for(var c=r.length-1;c>=0;c--)v=B(s,i,p={},e[3],O),l=(0,r[c])(a,v),p._=1,G(l)&&(a=l);return J(e,a),d&&h(a,i,d),g?s^4?n:d:a},o=(e,t,i)=>k(e,typeof t!="symbol"?t+"":t,i),z,f;z=[j(R)];class m{constructor(t=T(w(E))){this.http=t,o(this,"aureliaGrid2"),o(this,"gridOptions1"),o(this,"gridOptions2"),o(this,"columnDefinitions1",[]),o(this,"columnDefinitions2",[]),o(this,"dataset1",[]),o(this,"dataset2",[]),o(this,"hideSubTitle",!1),this.defineGrid1(),this.defineGrid2()}aureliaGrid2Ready(t){this.aureliaGrid2=t}async attached(){this.dataset1=this.mockData();const t=await fetch(P);this.dataset2=await t.json()}defineGrid1(){this.columnDefinitions1=[{id:"title",name:"Title",field:"title",sortable:!0,minWidth:100},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,minWidth:100},{id:"%",name:"% Complete",field:"percentComplete",sortable:!0,minWidth:100},{id:"start",name:"Start",field:"start",minWidth:100},{id:"finish",name:"Finish",field:"finish",minWidth:100},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",sortable:!0,minWidth:100}],this.gridOptions1={enableAutoResize:!0,autoResize:{container:"#demo-container",rightPadding:10},enableSorting:!0}}defineGrid2(){this.columnDefinitions2=[{id:"name",name:"Name",field:"name",filterable:!0,sortable:!0},{id:"gender",name:"Gender",field:"gender",filterable:!0,sortable:!0,filter:{model:C.singleSelect,collection:[{value:"",label:""},{value:"male",label:"male"},{value:"female",label:"female"}]}},{id:"company",name:"Company",field:"company",filterable:!0,sortable:!0}],this.gridOptions2={enableAutoResize:!0,autoResize:{container:"#demo-container",rightPadding:10},enableFiltering:!0,enableSorting:!0}}mockData(){const t=[];for(let i=0;i<1e3;i++){const r=2e3+Math.floor(Math.random()*10),a=Math.floor(Math.random()*11),n=Math.floor(Math.random()*29),l=Math.round(Math.random()*100);t[i]={id:i,title:"Task "+i,duration:Math.round(Math.random()*100)+"",percentComplete:l,start:`${a}/${n}/${r}`,finish:`${a}/${n}/${r}`,effortDriven:i%5===0}}return t}resizeGrid2(){this.aureliaGrid2.resizerService.resizeGrid(10)}}f=W();m=U(f,0,"Example22",z,m);H(f,1,m);export{m as Example22};
//# sourceMappingURL=example22-Dx691lyQ.js.map
