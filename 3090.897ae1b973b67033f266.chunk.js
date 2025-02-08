"use strict";(self.webpackChunkau_slickgrid_demo=self.webpackChunkau_slickgrid_demo||[]).push([[3090],{3090:(e,t,i)=>{i.r(t),i.d(t,{Example17:()=>p});var n={};i.r(n),i.d(n,{bindables:()=>c,default:()=>o,dependencies:()=>r,name:()=>s,register:()=>m,template:()=>d});var a=i(5959),l=i(8391);const s="example17",d='<div class="container-fluid">\n  <h2>\n    Example 17: Dynamically Create Grid from CSV / Excel import\n    <span class="float-end">\n      <a style="font-size: 18px" target="_blank"\n        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example17.ts">\n        <span class="mdi mdi-link-variant"></span> code\n      </a>\n    </span>\n    <button\n      class="ms-2 btn btn-outline-secondary btn-sm btn-icon"\n      type="button"\n      data-test="toggle-subtitle"\n      click.trigger="toggleSubTitle()"\n    >\n      <span class="mdi mdi-information-outline" title="Toggle example sub-title details"></span>\n    </button>\n  </h2>\n\n  <div if.bind="showSubTitle" class="subtitle">\n    Allow creating a grid dynamically by importing an external CSV or Excel file. This script demo will read the CSV file and will\n    consider the first row as the column header and create the column definitions accordingly, while the next few rows will be\n    considered the dataset. Note that this example is demoing a CSV file import but in your application you could easily implemnt\n    an Excel file uploading.\n  </div>\n\n  <div>A default CSV file can be download <a id="template-dl" href.bind="templateUrl">here</a>.</div>\n\n  <div class="d-flex mt-5 align-items-end">\n    <div class="file-upload">\n      <label for="formFile" class="form-label">Choose a CSV file…</label>\n      <input class="form-control" type="file" data-test="file-upload-input" value.bind="uploadFileRef" change.trigger="handleFileImport($event)" />\n    </div>\n    <span class="mx-3">or</span>\n    <div>\n      <button id="uploadBtn" data-test="static-data-btn" class="btn btn-outline-secondary" click.trigger="handleDefaultCsv">\n        Use default CSV data\n      </button>\n      &nbsp;/\n      <button class="btn btn-outline-danger btn-sm ms-2" click.trigger="destroyGrid()">Destroy Grid</button>\n    </div>\n  </div>\n\n  <hr />\n\n  <aurelia-slickgrid\n    if="value.bind: gridCreated; cache: false"\n    grid-id="grid17"\n    column-definitions.bind="columnDefinitions"\n    grid-options.bind="gridOptions"\n    dataset.bind="dataset">\n  </aurelia-slickgrid>\n</div>\n',o=d,r=[],c={};let u;function m(e){u||(u=l.K9.define({name:s,template:d,dependencies:r,bindables:c})),e.register(u)}var b=i(8906),h=i(5127);i(1829);let p=(()=>{let e,t,i=[(0,l.EM)(n)],s=[];return class{static{t=this}static{const n="function"==typeof Symbol&&Symbol.metadata?Object.create(null):void 0;(0,a.G4)(null,e={value:t},i,{kind:"class",name:t.name,metadata:n},null,s),t=e.value,n&&Object.defineProperty(t,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:n}),(0,a.zF)(t,s)}columnDefinitions=[];gridOptions;gridCreated=!1;showSubTitle=!0;dataset=[];paginationPosition="top";templateUrl="assets/data/users.csv";uploadFileRef="";destroyGrid(){this.gridCreated=!1}handleFileImport(e){const t=e.target.files[0];if(t.name.endsWith(".csv")){const e=new FileReader;e.onload=e=>{const t=e.target.result;this.dynamicallyCreateGrid(t)},e.readAsText(t)}else alert("File must be a CSV file")}handleDefaultCsv(){this.dynamicallyCreateGrid("First Name,Last Name,Age,Type\nBob,Smith,33,Teacher\nJohn,Doe,20,Student\nJane,Doe,21,Student"),this.uploadFileRef=""}dynamicallyCreateGrid(e){this.gridCreated=!1;const t=e?.split("\n"),i=[],n=[];t.forEach(((e,t)=>{const a=e.split(","),l={};if(0===t)for(const e of a){const t=(0,b.Cby)(e);i.push({id:t,name:e,field:t,filterable:!0,sortable:!0})}else a.forEach(((e,t)=>{l[i[t].id]=e})),"id"in l?n.push(l):n.push({...l,id:t})})),this.gridOptions={gridHeight:300,gridWidth:800,enableFiltering:!0,enableExcelExport:!0,externalResources:[new h.N],headerRowHeight:35,rowHeight:33},this.dataset=n,this.columnDefinitions=i,console.log(this.columnDefinitions,this.dataset),this.gridCreated=!0}toggleSubTitle(){this.showSubTitle=!this.showSubTitle;const e=this.showSubTitle?"remove":"add";document.querySelector(".subtitle")?.classList[e]("hidden")}},t})()}}]);