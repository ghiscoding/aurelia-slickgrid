import{C as K,r as z,I as W,b as u,a as m,F as d,h as b,D as _,c as R}from"./index-xBMUucNl.js";import{E as A}from"./excelExport.service-JbJncGy1.js";import{T as G}from"./textExport.service-BBMEu9h8.js";import"./groupingFormatters.index-BW-M0DUZ.js";const w="example12",g=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example12.ts">
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

<hr />

<div class="row">
  <div class="col-sm-12">
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="language-button" click.trigger="switchLanguage()">
      <i class="mdi mdi-translate"></i>
      Switch Language
    </button>
    <label>Locale:</label>
    <span style="font-style: italic; width: 70px;" data-test="selected-locale">
      \${selectedLanguage + '.json'}
    </span>

    <span style="margin-left: 20px">
      <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="exportToFile('csv')">
        <i class="mdi mdi-download"></i>
        Download to CSV
      </button>
      <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="exportToFile('txt')">
        <i class="mdi mdi-download"></i>
        Download to Text
      </button>
      <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="exportToExcel()">
        <i class="mdi mdi-file-excel-outline text-success"></i>
        Download to Excel
      </button>
    </span>
    <span style="margin-left: 10px">
      <button class="btn btn-outline-secondary btn-sm btn-icon" click.trigger="dynamicallyAddTitleHeader()">
        <i class="mdi mdi-shape-square-plus"></i>
        Dynamically Duplicate Title Column
      </button>
    </span>
  </div>
</div>

<aurelia-slickgrid grid-id="grid12"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    on-grid-state-changed.trigger="gridStateChanged($event.detail)"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)">
</aurelia-slickgrid>
`,D=[],k={};let f;function P(t){f||(f=K.define({name:w,template:g,dependencies:D,bindables:k})),t.register(f)}const B=Object.freeze(Object.defineProperty({__proto__:null,bindables:k,default:g,dependencies:D,name:w,register:P,template:g},Symbol.toStringTag,{value:"Module"}));var U=Object.create,y=Object.defineProperty,j=Object.getOwnPropertyDescriptor,H=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),L=t=>{throw TypeError(t)},C=(t,e,i)=>e in t?y(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,N=(t,e)=>y(t,"name",{value:e,configurable:!0}),Y=t=>[,,,U(null)],$=["class","method","getter","setter","accessor","field","value","get","set"],O=t=>t!==void 0&&typeof t!="function"?L("Function expected"):t,q=(t,e,i,l,a)=>({kind:$[t],name:e,metadata:l,addInitializer:o=>i._?L("Already initialized"):a.push(O(o||null))}),V=(t,e)=>C(e,H("metadata"),t[3]),X=(t,e,i,l)=>{for(var a=0,o=t[e>>1],n=o&&o.length;a<n;a++)o[a].call(i);return l},J=(t,e,i,l,a,o)=>{var n,s,v,c=e&7,S=!1,E=0,M=t[E]||(t[E]=[]),p=c&&(a=a.prototype,c<5&&(c>3||!S)&&j(a,i));N(a,i);for(var h=l.length-1;h>=0;h--)v=q(c,i,s={},t[3],M),n=(0,l[h])(a,v),s._=1,O(n)&&(a=n);return V(t,a),p&&y(a,i,p),S?c^4?o:p:a},r=(t,e,i)=>C(t,typeof e!="symbol"?e+"":e,i),I,T;const Q=1500,F=(t,e,i,l,a,o)=>{const s=o.getOptions().i18n;return(s==null?void 0:s.tr("TASK_X",{x:i}))??""};I=[R(B)];class x{constructor(e=z(W)){this.i18n=e,r(this,"title","Example 12: Localization (i18n)"),r(this,"subTitle",`Support multiple locales with the i18next plugin, following these steps.
    Take a look at the (<a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/localization/localization" target="_blank">Wiki documentation</a>)
    <ol class="small">
      <li>You first need to "enableTranslate" in the Grid Options</li>
      <li>In the Column Definitions, you have following options</li>
      <ul>
        <li>To translate a header title, use "nameKey" with a translate key (nameKey: 'TITLE')</li>
        <li>For the cell values, you need to use a Formatter, there's 2 ways of doing it</li>
        <ul>
          <li>formatter: myCustomTranslateFormatter <b>&lt;= "Title" column uses it</b></li>
          <li>formatter: Formatters.translate <b>&lt;= "Completed" column uses it</b></li>
        </ul>
      </ul>
      <li>For date localization, you need to create your own custom formatter. </li>
      <ul>
        <li>You can easily implement logic to switch between Formatters "dateIso" or "dateUs", depending on current locale.</li>
      </ul>
      <li>For the Select (dropdown) filter, you can fill in the "labelKey" property, if found it will use it, else it will use "label"</li>
        <ul>
          <li>What if your select options have totally different value/label pair? In this case, you can use the <b>customStructure: { label: 'customLabel', value: 'customValue'}</b> to change the property name(s) to use.'</li>
          <li>What if you want to use "customStructure" and translation? Simply pass this flag <b>enableTranslateLabel: true</b></li>
          <li>More info on the Select Filter <a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/column-functionalities/filters/select-filter" target="_blank">Wiki page</a></li>
        </ul>
        <li>For more info about "Download to File", read the <a href="https://ghiscoding.gitbook.io/aurelia-slickgrid/grid-functionalities/export-to-excel" target="_blank">Wiki page</a></li>
      </ol>`),r(this,"aureliaGrid"),r(this,"gridOptions"),r(this,"columnDefinitions",[]),r(this,"dataset",[]),r(this,"selectedLanguage"),r(this,"duplicateTitleHeaderCount",1),r(this,"gridObj"),r(this,"hideSubTitle",!1),r(this,"excelExportService",new A),r(this,"textExportService",new G),this.defineGrid();const i="en";this.i18n.setLocale(i),this.selectedLanguage=i}attached(){this.getData(Q)}aureliaGridReady(e){this.aureliaGrid=e,this.gridObj=e.slickGrid}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"id",nameKey:"TITLE",minWidth:100,formatter:F,sortable:!0,filterable:!0,params:{useFormatterOuputToFilter:!0}},{id:"description",name:"Description",field:"description",filterable:!0,sortable:!0,minWidth:80},{id:"duration",name:"Duration (days)",field:"duration",nameKey:"DURATION",sortable:!0,formatter:d.percentCompleteBar,minWidth:100,exportWithFormatter:!1,filterable:!0,type:m.number,filter:{model:u.slider,filterOptions:{hideSliderNumber:!0}}},{id:"start",name:"Start",field:"start",nameKey:"START",formatter:d.dateIso,outputType:m.dateIso,type:m.date,minWidth:100,filterable:!0,filter:{model:u.compoundDate}},{id:"finish",name:"Finish",field:"finish",nameKey:"FINISH",formatter:d.dateIso,outputType:m.dateIso,type:m.date,minWidth:100,filterable:!0,filter:{model:u.compoundDate}},{id:"completedBool",name:"Completed",field:"completedBool",nameKey:"COMPLETED",minWidth:100,sortable:!0,formatter:d.checkmarkMaterial,exportCustomFormatter:d.translateBoolean,filterable:!0,filter:{collection:[{value:"",label:""},{value:!0,labelKey:"TRUE"},{value:!1,labelKey:"FALSE"}],model:u.singleSelect,enableTranslateLabel:!0}},{id:"completed",name:"Completed",field:"completed",nameKey:"COMPLETED",formatter:d.translate,sortable:!0,minWidth:100,exportWithFormatter:!0,filterable:!0,filter:{collection:[{value:"",label:""},{value:"TRUE",labelKey:"TRUE"},{value:"FALSE",labelKey:"FALSE"}],collectionSortBy:{property:"labelKey",sortDesc:!0},model:u.singleSelect,enableTranslateLabel:!0}}],this.gridOptions={autoResize:{container:"#demo-container",rightPadding:10},enableAutoResize:!0,enableExcelCopyBuffer:!0,enableFiltering:!0,enableTranslate:!0,i18n:this.i18n,checkboxSelector:{hideInFilterHeaderRow:!1,hideInColumnTitleRow:!0},enableCheckboxSelector:!0,enableRowSelection:!0,showCustomFooter:!0,customFooterOptions:{metricTexts:{itemsKey:"ITEMS",ofKey:"OF",lastUpdateKey:"LAST_UPDATE"},dateFormat:"YYYY-MM-DD hh:mm a",hideTotalItemCount:!1,hideLastUpdateTimestamp:!1},gridMenu:{hideExportCsvCommand:!1,hideExportTextDelimitedCommand:!1},enableExcelExport:!0,enableTextExport:!0,textExportOptions:{exportWithFormatter:!0,sanitizeDataExport:!0},excelExportOptions:{customExcelHeader:(e,i)=>{const l=this.i18n.getLocale()==="fr"?"Titre qui est suffisament long pour être coupé":"My header that is long enough to wrap",a=e.getStyleSheet(),o={font:{size:12,fontName:"Calibri",bold:!0,color:"FF0000FF"},alignment:{wrapText:!0}},n=a.createFormat(o);i.setRowInstructions(0,{height:30}),i.mergeCells("B1","D1");const s=[];s.push({value:""}),s.push({value:l,metadata:{style:n.id}}),i.data.push(s)},exportWithFormatter:!0,sanitizeDataExport:!0},externalResources:[this.excelExportService,this.textExportService]}}getData(e){const i=[];for(let l=0;l<e;l++){const a=2e3+Math.floor(Math.random()*10),o=Math.floor(Math.random()*11),n=Math.floor(Math.random()*29);i[l]={id:l,description:l%5?"desc "+l:"🚀🦄 español",duration:Math.round(Math.random()*100)+"",start:new Date(a,o,n),finish:new Date(a,o+1,n),completedBool:l%5===0,completed:l%5===0?"TRUE":"FALSE"}}this.dataset=i}dynamicallyAddTitleHeader(){const e={id:`title${this.duplicateTitleHeaderCount++}`,field:"id",nameKey:"TITLE",formatter:F,sortable:!0,minWidth:100,filterable:!0,params:{useFormatterOuputToFilter:!0}};this.columnDefinitions.push(e),this.columnDefinitions=this.columnDefinitions.slice()}exportToExcel(){this.excelExportService.exportToExcel({filename:"Export",format:b.xlsx})}exportToFile(e="csv"){this.textExportService.exportToFile({delimiter:e==="csv"?_.comma:_.tab,filename:"myExport",format:e==="csv"?b.csv:b.txt})}gridStateChanged(e){console.log("Grid State changed:: ",e),console.log("Grid State changed:: ",e.change)}async switchLanguage(){const e=this.selectedLanguage==="en"?"fr":"en";await this.i18n.setLocale(e),this.selectedLanguage=e}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}T=Y();x=J(T,0,"Example12",I,x);X(T,1,x);export{x as Example12};
//# sourceMappingURL=example12-CE7QSynM.js.map
