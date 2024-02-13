"use strict";(self.webpackChunkaurelia_slickgrid_demo=self.webpackChunkaurelia_slickgrid_demo||[]).push([[468],{89848:(e,t,i)=>{i.r(t),i.d(t,{Example15:()=>b});var a={};i.r(a),i.d(a,{default:()=>o,dependencies:()=>d,name:()=>l,register:()=>u,template:()=>s});var n=i(50320),r=i(34732);const l="example15",s='<h2>\n  ${title}\n  <span class="float-end">\n    <a style="font-size: 18px"\n        target="_blank"\n        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example15.ts">\n      <span class="fa fa-link"></span> code\n    </a>\n  </span>\n</h2>\n<div class="subtitle" innerhtml.bind="subTitle"></div>\n\n<button class="btn btn-outline-secondary btn-sm" data-test="reset-button"\n        click.trigger="clearGridStateFromLocalStorage()">\n  <i class="fa fa-times"></i>\n  Clear Grid State from Local Storage &amp; Reset Grid\n</button>\n\n<button class="btn btn-outline-secondary btn-sm" data-test="language-button" click.trigger="switchLanguage()">\n  <i class="fa fa-language"></i>\n  Switch Language\n</button>\n<strong>Locale:</strong>\n<span style="font-style: italic" data-test="selected-locale">\n  ${selectedLanguage + \'.json\'}\n</span>\n\n<aurelia-slickgrid grid-id="grid15"\n                    column-definitions.bind="columnDefinitions"\n                    grid-options.bind="gridOptions"\n                    dataset.bind="dataset"\n                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"\n                    on-grid-state-changed.trigger="gridStateChanged($event.detail)"\n                    >\n</aurelia-slickgrid>\n',o=s,d=[];let c;function u(e){c||(c=r.eOR.define({name:l,template:s,dependencies:d})),e.register(c)}var g=i(33952),m=i(77106);function h(e,t){return Math.floor(Math.random()*(t-e+1)+e)}i(19144);const p="gridState";let b=class{i18n;title="Example 15: Grid State & Presets using Local Storage";subTitle='\n  Grid State & Preset (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/grid-state-preset" target="_blank">Wiki docs</a>)\n  <br/>\n  <ul class="small">\n    <li>Uses Local Storage to persist the Grid State and uses Grid Options "presets" to put the grid back to it\'s previous state</li>\n    <ul>\n       <li>to demo this, simply change any columns (position reorder, visibility, size, filter, sort), then refresh your browser with (F5)</li>\n    </ul>\n    <li>Local Storage is just one option, you can use whichever is more convenient for you (Local Storage, Session Storage, DB, ...)</li>\n  </ul>\n';aureliaGrid;columnDefinitions=[];gridOptions;dataset=[];selectedLanguage;constructor(e){this.i18n=e;const t=JSON.parse(localStorage[p]||null);this.defineGrid(t),this.i18n.setLocale("en"),this.selectedLanguage="en"}attached(){this.dataset=this.getData(500)}detaching(){this.saveCurrentGridState()}aureliaGridReady(e){this.aureliaGrid=e}clearGridStateFromLocalStorage(){this.aureliaGrid.gridService.resetGrid(this.columnDefinitions),this.aureliaGrid.paginationService.changeItemPerPage(25),setTimeout((()=>localStorage[p]=null))}defineGrid(e){const t=[];for(let e=0;e<500;e++)t.push({value:e,label:e});this.columnDefinitions=[{id:"title",name:"Title",field:"title",nameKey:"TITLE",filterable:!0,sortable:!0,type:m.sV2.string,minWidth:45,width:100,filter:{model:m.kvb.compoundInput}},{id:"description",name:"Description",field:"description",filterable:!0,sortable:!0,minWidth:80,width:100,type:m.sV2.string,filter:{model:m.kvb.input}},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,type:m.sV2.number,exportCsvForceToKeepAsString:!0,minWidth:55,width:100,nameKey:"DURATION",filterable:!0,filter:{collection:t,model:m.kvb.multipleSelect,filterOptions:{maxHeight:250,width:175}}},{id:"complete",name:"% Complete",field:"percentComplete",nameKey:"PERCENT_COMPLETE",minWidth:70,type:m.sV2.number,sortable:!0,width:100,formatter:m.cnr.percentCompleteBar,filterable:!0,filter:{model:m.kvb.slider,operator:">"}},{id:"start",name:"Start",field:"start",nameKey:"START",formatter:m.cnr.dateIso,sortable:!0,minWidth:75,exportWithFormatter:!0,width:100,type:m.sV2.date,filterable:!0,filter:{model:m.kvb.compoundDate}},{id:"completed",field:"completed",nameKey:"COMPLETED",minWidth:85,maxWidth:85,formatter:m.cnr.checkmark,width:100,type:m.sV2.boolean,sortable:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,label:"True"},{value:!1,label:"False"}],model:m.kvb.singleSelect}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableCheckboxSelector:!0,enableFiltering:!0,enableTranslate:!0,i18n:this.i18n,columnPicker:{hideForceFitButton:!0},gridMenu:{hideForceFitButton:!0,hideClearFrozenColumnsCommand:!1},headerMenu:{hideFreezeColumnsCommand:!1},enablePagination:!0,pagination:{pageSizes:[5,10,15,20,25,30,40,50,75,100],pageSize:25}},e&&(this.gridOptions.presets=e)}getData(e){const t=[];for(let i=0;i<e;i++){const e=Math.round(100*Math.random()),a=h(2e3,2025),n=h(10,25),r=h(1,12),l=r<10?`0${r}`:r,s=h(10,28),o=h(0,100),d=h(10,23),c=h(10,59);t[i]={id:i,title:"Task "+i,description:i%5?"desc "+i:null,duration:e,percentComplete:o,percentCompleteNumber:o,start:new Date(a,r,s),usDateShort:`${r}/${s}/${n}`,utcDate:`${a}-${l}-${s}T${d}:${c}:${c}Z`,completed:i%3==0}}return t}gridStateChanged(e){console.log("Client sample, Grid State changed:: ",e),localStorage[p]=JSON.stringify(e.gridState)}saveCurrentGridState(){const e=this.aureliaGrid.gridStateService.getCurrentGridState();console.log("Client sample, current Grid State:: ",e),localStorage[p]=JSON.stringify(e)}async switchLanguage(){const e="en"===this.selectedLanguage?"fr":"en";await this.i18n.setLocale(e),this.selectedLanguage=e}useDefaultPresets(){return{columns:[{columnId:"description",width:170},{columnId:"title",width:55},{columnId:"duration"},{columnId:"complete"},{columnId:"start"},{columnId:"usDateShort"},{columnId:"utcDate"}],filters:[{columnId:"duration",searchTerms:[2,22,44]},{columnId:"usDateShort",operator:"<",searchTerms:["4/20/25"]}],sorters:[{columnId:"duration",direction:"DESC"},{columnId:"complete",direction:"ASC"}]}}};b=(0,n.UN)([(0,r.Kx8)(a),(0,n.OU)(0,g.sj),(0,n.YR)("design:paramtypes",[Object])],b)}}]);