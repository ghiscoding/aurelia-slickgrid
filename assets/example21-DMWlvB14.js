import{C as J,a as f,F as w,g as T,c as K}from"./index-xBMUucNl.js";const R="example21",F=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example21.ts">
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

<div class="row row-cols-lg-auto g-1 align-items-center">
  <div class="col">
    <label for="columnSelect">Single Search:</label>
  </div>
  <div class="col">
    <select class="form-select" data-test="search-column-list" name="selectedColumn"
            value.bind="selectedColumn" id="columnSelect">
      <option repeat.for="column of columnDefinitions"
              model.bind="column">
        \${column.name}
      </option>
    </select>
  </div>
  <div class="col">
    <select value.bind="selectedOperator"
            class="form-select"
            data-test="search-operator-list">
      <option repeat.for="operator of operatorList"
              model.bind="operator">
        \${operator}
      </option>
    </select>
  </div>

  <div class="col">
    <div class="input-group">
      <input type="text"
              class="form-control"
              placeholder="search value"
              data-test="search-value-input"
              value.bind="searchValue" />
      <button class="btn btn-outline-secondary d-flex align-items-center pl-2 pr-2" data-test="clear-search-value"
              click.trigger="clearGridSearchInput()">
        <span class="mdi mdi-close"></span>
      </button>
    </div>
  </div>
</div>

<hr />

<aurelia-slickgrid grid-id="grid21"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    instances.bind="aureliaGrid">
</aurelia-slickgrid>
`,$=[],L={};let M;function Q(e){M||(M=J.define({name:R,template:F,dependencies:$,bindables:L})),e.register(M)}const U=Object.freeze(Object.defineProperty({__proto__:null,bindables:L,default:F,dependencies:$,name:R,register:Q,template:F},Symbol.toStringTag,{value:"Module"}));var X=Object.create,x=Object.defineProperty,Z=Object.getOwnPropertyDescriptor,ee=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),_=e=>{throw TypeError(e)},N=(e,t,i)=>t in e?x(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,I=(e,t)=>x(e,"name",{value:t,configurable:!0}),te=e=>[,,,X(null)],W=["class","method","getter","setter","accessor","field","value","get","set"],v=e=>e!==void 0&&typeof e!="function"?_("Function expected"):e,ie=(e,t,i,s,a)=>({kind:W[e],name:t,metadata:s,addInitializer:r=>i._?_("Already initialized"):a.push(v(r||null))}),ne=(e,t)=>N(t,ee("metadata"),e[3]),m=(e,t,i,s)=>{for(var a=0,r=e[t>>1],c=r&&r.length;a<c;a++)t&1?r[a].call(i):s=r[a].call(i,s);return s},S=(e,t,i,s,a,r)=>{var c,o,G,g,y,n=t&7,C=!!(t&8),p=!!(t&16),O=n>3?e.length+1:n?C?1:2:0,E=W[n+5],V=n>3&&(e[O-1]=[]),B=e[O]||(e[O]=[]),h=n&&(!p&&!C&&(a=a.prototype),n<5&&(n>3||!p)&&Z(n<4?a:{get[i](){return P(this,r)},set[i](l){return H(this,r,l)}},i));n?p&&n<4&&I(r,(n>2?"set ":n>1?"get ":"")+i):I(a,i);for(var k=s.length-1;k>=0;k--)g=ie(n,i,G={},e[3],B),n&&(g.static=C,g.private=p,y=g.access={has:p?l=>ae(a,l):l=>i in l},n^3&&(y.get=p?l=>(n^1?P:re)(l,a,n^4?r:h.get):l=>l[i]),n>2&&(y.set=p?(l,D)=>H(l,a,D,n^4?r:h.set):(l,D)=>l[i]=D)),o=(0,s[k])(n?n<4?p?r:h[E]:n>4?void 0:{get:h.get,set:h.set}:a,g),G._=1,n^4||o===void 0?v(o)&&(n>4?V.unshift(o):n?p?r=o:h[E]=o:a=o):typeof o!="object"||o===null?_("Object expected"):(v(c=o.get)&&(h.get=c),v(c=o.set)&&(h.set=c),v(c=o.init)&&V.unshift(c));return n||ne(e,a),h&&x(a,i,h),p?n^4?r:h:a},u=(e,t,i)=>N(e,typeof t!="symbol"?t+"":t,i),z=(e,t,i)=>t.has(e)||_("Cannot "+i),ae=(e,t)=>Object(t)!==t?_('Cannot use the "in" operator on this value'):e.has(t),P=(e,t,i)=>(z(e,t,"read from private field"),i?i.call(e):t.get(e)),H=(e,t,i,s)=>(z(e,t,"write to private field"),s?s.call(e,i):t.set(e,i),i),re=(e,t,i)=>(z(e,t,"access private method"),i),Y,A,j,q,d;q=[K(U)],j=[T()],A=[T()],Y=[T()];class b{constructor(){u(this,"selectedColumn",m(d,8,this)),m(d,11,this),u(this,"selectedOperator",m(d,12,this)),m(d,15,this),u(this,"searchValue",m(d,16,this,"")),m(d,19,this),u(this,"title","Example 21: Grid AutoHeight"),u(this,"subTitle",`
  The SlickGrid option "autoHeight" can be used if you wish to keep the full height of the grid without any scrolling
  <ul>
    <li>You define a fixed grid width via "gridWidth" in the View</li>
    <li>You can still use the "autoResize" for the width to be resized automatically (the height will never change in this case)</li>
    <li>This dataset has 25 rows, if you scroll down the page you can see the entire set is shown without any grid scrolling (though you might have browser scrolling)</li>
  </ul>
  `),u(this,"aureliaGrid"),u(this,"columnDefinitions",[]),u(this,"gridOptions"),u(this,"dataset",[]),u(this,"hideSubTitle",!1),u(this,"operatorList",["=","<","<=",">",">=","<>","StartsWith","EndsWith"]),this.defineGrid()}attached(){this.getData()}defineGrid(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",width:100,sortable:!0,type:f.string},{id:"duration",name:"Duration (days)",field:"duration",width:100,sortable:!0,type:f.number},{id:"complete",name:"% Complete",field:"percentComplete",width:100,sortable:!0,formatter:w.percentCompleteBar,type:f.number},{id:"start",name:"Start",field:"start",width:100,sortable:!0,formatter:w.dateIso,type:f.date},{id:"finish",name:"Finish",field:"finish",width:100,sortable:!0,formatter:w.dateIso,type:f.date},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",width:100,sortable:!0,formatter:w.checkmarkMaterial,type:f.number}],this.gridOptions={autoHeight:!0,autoResize:{container:"#demo-container",rightPadding:10},enableFiltering:!0,showHeaderRow:!1,alwaysShowVerticalScroll:!1,enableColumnPicker:!0,enableCellNavigation:!0,enableRowSelection:!0}}getData(){const t=[];for(let i=0;i<25;i++){const s=2e3+Math.floor(Math.random()*10),a=Math.floor(Math.random()*11),r=Math.floor(Math.random()*29),c=Math.round(Math.random()*100);t[i]={id:i,title:"Task "+i,duration:Math.round(Math.random()*100)+"",percentComplete:c,percentCompleteNumber:c,start:new Date(s,a,r),finish:new Date(s,a+1,r),effortDriven:i%5===0}}this.dataset=t}clearGridSearchInput(){this.searchValue="",this.updateFilter()}selectedOperatorChanged(){this.updateFilter()}selectedColumnChanged(){this.updateFilter()}searchValueChanged(){this.updateFilter()}updateFilter(){var t;(t=this.aureliaGrid)==null||t.filterService.updateSingleFilter({columnId:`${this.selectedColumn.id||""}`,operator:this.selectedOperator,searchTerms:[this.searchValue||""]})}toggleSubTitle(){var i;this.hideSubTitle=!this.hideSubTitle;const t=this.hideSubTitle?"add":"remove";(i=document.querySelector(".subtitle"))==null||i.classList[t]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}}d=te();S(d,5,"selectedColumn",j,b);S(d,5,"selectedOperator",A,b);S(d,5,"searchValue",Y,b);b=S(d,0,"Example21",q,b);m(d,1,b);export{b as Example21};
//# sourceMappingURL=example21-DMWlvB14.js.map
