"use strict";(self.webpackChunkaurelia_slickgrid_demo=self.webpackChunkaurelia_slickgrid_demo||[]).push([[587],{55587:(e,t,i)=>{i.r(t),i.d(t,{Example2:()=>f});var a={};i.r(a),i.d(a,{default:()=>s,dependencies:()=>d,name:()=>o,register:()=>u,template:()=>l});var n=i(22970),r=i(26207);const o="example2",l='<template>\n  <h2>\n    ${title}\n    <span class="float-end">\n      <a style="font-size: 18px" target="_blank"\n        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/src/examples/slickgrid/example2.ts">\n        <span class="fa fa-link"></span> code\n      </a>\n    </span>\n  </h2>\n  <div class="subtitle" innerhtml.bind="subTitle"></div>\n\n  <button class="btn btn-outline-secondary btn-sm" click.trigger="togglePauseResizer()">\n    Pause auto-resize: <b>${resizerPaused}</b>\n  </button>\n\n  <aurelia-slickgrid\n    grid-id="grid2"\n    column-definitions.bind="columnDefinitions"\n    grid-options.bind="gridOptions"\n    dataset.bind="dataset"\n    instances.bind="aureliaGrid">\n  </aurelia-slickgrid>\n</template>\n',s=l,d=[];let m;function u(e){m||(m=r.b_N.define({name:o,template:l,dependencies:d})),e.register(m)}var p=i(23490);i(41414);const c=(e,t,i)=>i?'<i class="fa fa-fire red" aria-hidden="true"></i>':{text:'<i class="fa fa-snowflake-o" aria-hidden="true"></i>',addClasses:"lightblue",toolTip:"Freezing"},h=(e,t,i)=>`<span style="margin-left: 5px">\n      <button class="btn btn-xs btn-default">\n        <i class="fa ${i?"fa-check-circle":"fa-circle-thin"} fa-lg" style="color: ${i?"black":"lavender"}"></i>\n      </button>\n    </span>`;let f=class{title="Example 2: Grid with Formatters";subTitle='\n    Grid with Custom and/or included Slickgrid Formatters (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/column-functionalities/formatters" target="_blank">Wiki docs</a>).\n    <ul>\n      <li>The 2 last columns are using Custom Formatters</li>\n      <ul><li>The "Completed" column uses a the "onCellClick" event and a formatter to simulate a toggle action</li></ul>\n      <li>\n        Support Excel Copy Buffer (SlickGrid Copy Manager Plugin), you can use it by simply enabling "enableExcelCopyBuffer" flag.\n        Note that it will only evaluate Formatter when the "exportWithFormatter" flag is enabled (through "ExcelExportOptions" or "TextExportOptions" or the column definition)\n      </li>\n      <li>This example also has auto-resize enabled, and we also demo how you can pause the resizer if you wish to</li>\n    </ul>\n  ';aureliaGrid;gridOptions;columnDefinitions=[];dataset=[];resizerPaused=!1;constructor(){this.defineGrid()}attached(){this.getData()}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",sortable:!0,type:p.fSu.string,width:70},{id:"phone",name:"Phone Number using mask",field:"phone",sortable:!0,type:p.fSu.number,minWidth:100,formatter:p.UgU.mask,params:{mask:"(000) 000-0000"}},{id:"duration",name:"Duration (days)",field:"duration",formatter:p.UgU.decimal,params:{minDecimal:1,maxDecimal:2},sortable:!0,type:p.fSu.number,minWidth:90,exportWithFormatter:!0},{id:"complete",name:"% Complete",field:"percentComplete",formatter:p.UgU.percentCompleteBar,type:p.fSu.number,sortable:!0,minWidth:100},{id:"percent2",name:"% Complete",field:"percentComplete2",formatter:p.UgU.progressBar,type:p.fSu.number,sortable:!0,minWidth:100},{id:"start",name:"Start",field:"start",formatter:p.UgU.dateIso,sortable:!0,type:p.fSu.date,minWidth:90,exportWithFormatter:!0},{id:"finish",name:"Finish",field:"finish",formatter:p.UgU.dateIso,sortable:!0,type:p.fSu.date,minWidth:90,exportWithFormatter:!0},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",formatter:c,type:p.fSu.number,sortable:!0,minWidth:100},{id:"completed",name:"Completed",field:"completed",type:p.fSu.number,sortable:!0,minWidth:100,formatter:h,onCellClick:(e,t)=>{this.toggleCompletedProperty(t&&t.dataContext)}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableCellNavigation:!0,showCustomFooter:!0,customFooterOptions:{leftFooterText:"custom footer text",hideTotalItemCount:!0,hideLastUpdateTimestamp:!0},enableExcelCopyBuffer:!0}}getData(){const e=[];for(let t=0;t<500;t++){const i=2e3+Math.floor(10*Math.random()),a=Math.floor(11*Math.random()),n=Math.floor(29*Math.random()),r=Math.round(100*Math.random());e[t]={id:t,title:"Task "+t,phone:this.generatePhoneNumber(),duration:t%33==0?null:100*Math.random()+"",percentComplete:r,percentComplete2:r,percentCompleteNumber:r,start:new Date(i,a,n),finish:new Date(i,a+1,n),effortDriven:t%5==0}}this.dataset=e}generatePhoneNumber(){let e="";for(let t=0;t<10;t++)e+=Math.round(9*Math.random())+"";return e}togglePauseResizer(){this.resizerPaused=!this.resizerPaused,this.aureliaGrid.resizerService.pauseResizer(this.resizerPaused)}toggleCompletedProperty(e){"object"==typeof e&&(e.completed=!e.completed,setTimeout((()=>{this.aureliaGrid.gridService.updateItemById(e.id,e,{highlightRow:!1})}),250))}};f=(0,n.gn)([(0,r.MoW)(a),(0,n.w6)("design:paramtypes",[])],f)}}]);