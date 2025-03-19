"use strict";(self.webpackChunkau_slickgrid_demo=self.webpackChunkau_slickgrid_demo||[]).push([[7490],{615:(e,i,n)=>{n.d(i,{A:()=>r});var t=n(5921),l=n.n(t),a=n(330),o=n.n(a)()(l());o.push([e.id,".slick-row .slick-cell.frozen:last-child,.slick-headerrow-column.frozen:last-child,.slick-footerrow-column.frozen:last-child{border-right:1px solid #969696 !important}.slick-pane-bottom{border-top:1px solid #969696 !important}",""]);const r=o},7309:(e,i,n)=>{var t=n(5921),l=n.n(t),a=n(330);n.n(a)()(l()).push([e.id,".slick-row .slick-cell.frozen:last-child,.slick-headerrow-column.frozen:last-child,.slick-footerrow-column.frozen:last-child{border-right:1px solid #969696 !important}.slick-pane-bottom{border-top:1px solid #969696 !important}",""])},7490:(e,i,n)=>{n.r(i),n.d(i,{Example14:()=>F});var t={};n.r(t),n.d(t,{bindables:()=>c,default:()=>s,dependencies:()=>d,name:()=>o,register:()=>m,template:()=>r});var l=n(5959),a=n(8391);n(7309);const o="example14",r='<h2>\n  ${title}\n  <span class="float-end">\n    <a style="font-size: 18px"\n        target="_blank"\n        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example14.ts">\n      <span class="mdi mdi-link-variant"></span> code\n    </a>\n  </span>\n  <button\n      class="ms-2 btn btn-outline-secondary btn-sm btn-icon"\n      type="button"\n      data-test="toggle-subtitle"\n      click.trigger="hideSubTitle = !hideSubTitle"\n    >\n      <span class="mdi mdi-information-outline" title="Toggle example sub-title details"></span>\n    </button>\n</h2>\n\n<div class="subtitle" innerhtml.bind="subTitle" hidden.bind="hideSubTitle"></div>\n\n<h3>Grid 1 <small>(with Header Grouping &amp; Colspan)</small></h3>\n<aurelia-slickgrid grid-id="grid1"\n                    column-definitions.bind="columnDefinitions1"\n                    grid-options.bind="gridOptions1"\n                    dataset.bind="dataset1">\n</aurelia-slickgrid>\n\n<hr />\n\n<h3>Grid 2 <small>(with Header Grouping &amp; Frozen/Pinned Columns)</small></h3>\n\n<div class="col-sm 12">\n  <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="setFrozenColumns2(-1)"\n          data-test="remove-frozen-column-button">\n    <i class="mdi mdi-close"></i> Remove Frozen Columns\n  </button>\n  <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="setFrozenColumns2(2)"\n          data-test="set-3frozen-columns">\n    <i class="mdi mdi-pin-outline"></i> Set 3 Frozen Columns\n  </button>\n</div>\n\n<aurelia-slickgrid grid-id="grid2"\n                    column-definitions.bind="columnDefinitions2"\n                    grid-options.bind="gridOptions2"\n                    dataset.bind="dataset2"\n                    on-aurelia-grid-created.trigger="aureliaGridReady2($event.detail)">\n</aurelia-slickgrid>\n',s=r,d=[],c={};let u;function m(e){u||(u=a.K9.define({name:o,template:r,dependencies:d,bindables:c})),e.register(u)}var p=n(3393),h=n(6264),b=n(6230),f=n.n(b),g=n(9519),C=n.n(g),k=n(7397),v=n.n(k),G=n(9494),x=n.n(G),y=n(7250),w=n.n(y),z=n(1159),P=n.n(z),O=n(615),D={};D.styleTagTransform=P(),D.setAttributes=x(),D.insert=v().bind(null,"head"),D.domAPI=C(),D.insertStyleElement=w(),f()(O.A,D),O.A&&O.A.locals&&O.A.locals,n(1829);let F=(()=>{let e,i,n=[(0,a.EM)(t)],o=[];return class{static{i=this}static{const t="function"==typeof Symbol&&Symbol.metadata?Object.create(null):void 0;(0,l.G4)(null,e={value:i},n,{kind:"class",name:i.name,metadata:t},null,o),i=e.value,t&&Object.defineProperty(i,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:t}),(0,l.zF)(i,o)}title="Example 14: Column Span & Header Grouping";subTitle="\n  This example demonstrates how to easily span a row over multiple columns & how to group header titles.\n  <ul>\n    <li>Note that you can add Sort but remember that it will sort by the data which the row contains, even if the data is visually hidden by colspan it will still sort it</li>\n  </ul>\n  ";aureliaGrid2;gridObj2;columnDefinitions1=[];columnDefinitions2=[];gridOptions1;gridOptions2;dataset1=[];dataset2=[];hideSubTitle=!1;constructor(){this.definedGrid1(),this.definedGrid2()}attached(){this.dataset1=this.getData(500),this.dataset2=this.getData(500)}aureliaGridReady2(e){this.aureliaGrid2=e,this.gridObj2=e.slickGrid}definedGrid1(){this.columnDefinitions1=[{id:"title",name:"Title",field:"title",sortable:!0,columnGroup:"Common Factor"},{id:"duration",name:"Duration",field:"duration",columnGroup:"Common Factor"},{id:"start",name:"Start",field:"start",columnGroup:"Period"},{id:"finish",name:"Finish",field:"finish",columnGroup:"Period"},{id:"%",name:"% Complete",field:"percentComplete",selectable:!1,columnGroup:"Analysis"},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",type:h.PUO.boolean,columnGroup:"Analysis"}],this.gridOptions1={enableAutoResize:!1,enableCellNavigation:!0,enableColumnReorder:!1,enableSorting:!0,createPreHeaderPanel:!0,showPreHeaderPanel:!0,preHeaderPanelHeight:28,gridHeight:275,gridWidth:800,enableExcelExport:!0,excelExportOptions:{exportWithFormatter:!1},externalResources:[new p.N],explicitInitialization:!0,dataView:{globalItemMetadataProvider:{getRowMetadata:(e,i)=>this.renderDifferentColspan(e,i)}},gridMenu:{iconButtonContainer:"preheader"}}}definedGrid2(){this.columnDefinitions2=[{id:"sel",name:"#",field:"num",behavior:"select",cssClass:"cell-selection",width:40,resizable:!1,selectable:!1},{id:"title",name:"Title",field:"title",sortable:!0,columnGroup:"Common Factor"},{id:"duration",name:"Duration",field:"duration",columnGroup:"Common Factor"},{id:"start",name:"Start",field:"start",columnGroup:"Period"},{id:"finish",name:"Finish",field:"finish",columnGroup:"Period"},{id:"%",name:"% Complete",field:"percentComplete",selectable:!1,columnGroup:"Analysis"},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",type:h.PUO.boolean,columnGroup:"Analysis"}],this.gridOptions2={enableCellNavigation:!0,enableColumnReorder:!1,createPreHeaderPanel:!0,showPreHeaderPanel:!0,preHeaderPanelHeight:25,explicitInitialization:!0,gridHeight:275,gridWidth:800,frozenColumn:2,enableExcelExport:!0,excelExportOptions:{exportWithFormatter:!1},externalResources:[new p.N],gridMenu:{hideClearFrozenColumnsCommand:!1},headerMenu:{hideFreezeColumnsCommand:!1}}}getData(e){const i=[];for(let n=0;n<e;n++)i[n]={id:n,num:n,title:"Task "+n,duration:"5 days",percentComplete:Math.round(100*Math.random()),start:"01/01/2009",finish:"01/05/2009",effortDriven:n%5==0};return i}setFrozenColumns2(e){this.gridObj2.setOptions({frozenColumn:e}),this.gridOptions2=this.gridObj2.getOptions()}renderDifferentColspan(e,i){return e.id%2==1||i%2==1?{columns:{duration:{colspan:3}}}:{columns:{0:{colspan:"*"}}}}},i})()}}]);