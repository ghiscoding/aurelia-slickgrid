import{C as O,t as T,c as V}from"./index-xBMUucNl.js";import{E as k}from"./excelExport.service-JbJncGy1.js";import"./groupingFormatters.index-BW-M0DUZ.js";const y="example17",h=`<div class="container-fluid">
  <h2>
    Example 17: Dynamically Create Grid from CSV / Excel import
    <span class="float-end">
      <a style="font-size: 18px" target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example17.ts">
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
    Allow creating a grid dynamically by importing an external CSV or Excel file. This script demo will read the CSV file and will
    consider the first row as the column header and create the column definitions accordingly, while the next few rows will be
    considered the dataset. Note that this example is demoing a CSV file import but in your application you could easily implemnt
    an Excel file uploading.
  </div>

  <div>A default CSV file can be download <a id="template-dl" href.bind="templateUrl">here</a>.</div>

  <div class="d-flex mt-5 align-items-end">
    <div class="file-upload">
      <label for="formFile" class="form-label">Choose a CSV file…</label>
      <input class="form-control" type="file" data-test="file-upload-input" value.bind="uploadFileRef" change.trigger="handleFileImport($event)" />
    </div>
    <span class="mx-3">or</span>
    <div>
      <button id="uploadBtn" data-test="static-data-btn" class="btn btn-outline-secondary" click.trigger="handleDefaultCsv">
        Use default CSV data
      </button>
      &nbsp;/
      <button class="btn btn-outline-danger btn-sm ms-2" click.trigger="destroyGrid()">Destroy Grid</button>
    </div>
  </div>

  <hr />

  <aurelia-slickgrid
    if="value.bind: gridCreated; cache: false"
    grid-id="grid17"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset">
  </aurelia-slickgrid>
</div>
`,x=[],S={};let f;function R(e){f||(f=O.define({name:y,template:h,dependencies:x,bindables:S})),e.register(f)}const G=Object.freeze(Object.defineProperty({__proto__:null,bindables:S,default:h,dependencies:x,name:y,register:R,template:h},Symbol.toStringTag,{value:"Module"}));var P=Object.create,g=Object.defineProperty,z=Object.getOwnPropertyDescriptor,j=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),C=e=>{throw TypeError(e)},E=(e,t,a)=>t in e?g(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,A=(e,t)=>g(e,"name",{value:t,configurable:!0}),N=e=>[,,,P(null)],I=["class","method","getter","setter","accessor","field","value","get","set"],w=e=>e!==void 0&&typeof e!="function"?C("Function expected"):e,H=(e,t,a,n,i)=>({kind:I[e],name:t,metadata:n,addInitializer:l=>a._?C("Already initialized"):i.push(w(l||null))}),U=(e,t)=>E(t,j("metadata"),e[3]),B=(e,t,a,n)=>{for(var i=0,l=e[t>>1],s=l&&l.length;i<s;i++)l[i].call(a);return n},J=(e,t,a,n,i,l)=>{var s,u,d,r=t&7,c=!1,_=0,F=e[_]||(e[_]=[]),p=r&&(i=i.prototype,r<5&&(r>3||!c)&&z(i,a));A(i,a);for(var m=n.length-1;m>=0;m--)d=H(r,a,u={},e[3],F),s=(0,n[m])(i,d),u._=1,w(s)&&(i=s);return U(e,i),p&&g(i,a,p),c?r^4?l:p:i},o=(e,t,a)=>E(e,typeof t!="symbol"?t+"":t,a),D,v;const M="assets/data";D=[V(G)];class b{constructor(){o(this,"columnDefinitions",[]),o(this,"gridOptions"),o(this,"gridCreated",!1),o(this,"hideSubTitle",!1),o(this,"dataset",[]),o(this,"paginationPosition","top"),o(this,"templateUrl",`${M}/users.csv`),o(this,"uploadFileRef","")}destroyGrid(){this.gridCreated=!1}handleFileImport(t){const a=t.target.files[0];if(a.name.endsWith(".csv")){const n=new FileReader;n.onload=i=>{const l=i.target.result;this.dynamicallyCreateGrid(l)},n.readAsText(a)}else alert("File must be a CSV file")}handleDefaultCsv(){this.dynamicallyCreateGrid(`First Name,Last Name,Age,Type
Bob,Smith,33,Teacher
John,Doe,20,Student
Jane,Doe,21,Student`),this.uploadFileRef=""}dynamicallyCreateGrid(t){this.gridCreated=!1;const a=t==null?void 0:t.split(`
`),n=[],i=[];a.forEach((l,s)=>{const u=l.split(","),d={};if(s===0)for(const r of u){const c=T(r);n.push({id:c,name:r,field:c,filterable:!0,sortable:!0})}else u.forEach((r,c)=>{d[n[c].id]=r}),"id"in d?i.push(d):i.push({...d,id:s})}),this.gridOptions={gridHeight:300,gridWidth:800,enableFiltering:!0,enableExcelExport:!0,externalResources:[new k],headerRowHeight:35,rowHeight:33},this.dataset=i,this.columnDefinitions=n,console.log(this.columnDefinitions,this.dataset),this.gridCreated=!0}}v=N();b=J(v,0,"Example17",D,b);B(v,1,b);export{b as Example17};
//# sourceMappingURL=example17-Cd0QUvlc.js.map
