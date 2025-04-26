import{c as M,C as G,F as D}from"./index-xBMUucNl.js";var W=Object.create,S=Object.defineProperty,A=Object.getOwnPropertyDescriptor,N=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),T=e=>{throw TypeError(e)},$=(e,t,i)=>t in e?S(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,H=(e,t)=>S(e,"name",{value:t,configurable:!0}),Y=e=>[,,,W(null)],B=["class","method","getter","setter","accessor","field","value","get","set"],O=e=>e!==void 0&&typeof e!="function"?T("Function expected"):e,R=(e,t,i,o,r)=>({kind:B[e],name:t,metadata:o,addInitializer:n=>i._?T("Already initialized"):r.push(O(n||null))}),V=(e,t)=>$(t,N("metadata"),e[3]),q=(e,t,i,o)=>{for(var r=0,n=e[t>>1],a=n&&n.length;r<a;r++)n[r].call(i);return o},J=(e,t,i,o,r,n)=>{var a,s,u,l=t&7,_=!1,f=0,h=e[f]||(e[f]=[]),d=l&&(r=r.prototype,l<5&&(l>3||!_)&&A(r,i));H(r,i);for(var c=o.length-1;c>=0;c--)u=R(l,i,s={},e[3],h),a=(0,o[c])(r,u),s._=1,O(a)&&(r=a);return V(e,r),d&&S(r,i,d),_?l^4?n:d:r},K=(e,t,i)=>$(e,t+"",i),w,k;w=[M({name:"custom-footer",template:`<button click.trigger="clickMe()">I'm a button from an Aurelia custom element (click me)</button>
  <div if.bind="clickedTimes">You've clicked me \${clickedTimes} time(s)</div>`})];class p{constructor(){K(this,"clickedTimes",0)}clickMe(){this.clickedTimes++}}k=Y();p=J(k,0,"CustomFooter",w,p);q(k,1,p);const L=Object.freeze(Object.defineProperty({__proto__:null,get CustomFooter(){return p}},Symbol.toStringTag,{value:"Module"})),E="example29",v=`
<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example29.ts">
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

<div class="subtitle" innerhtml.bind="subTitle" hidden.bind="hideSubTitle"></div>


<aurelia-slickgrid grid-id="grid"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset">
  <div au-slot="slickgrid-header" class="custom-header-slot">
    <h3>Grid with header and footer slot</h3>
  </div>
  <custom-footer class="custom-footer-slot"
                  au-slot="slickgrid-footer">
  </custom-footer>
</aurelia-slickgrid>
`,F=[L],P={};let b;function Q(e){b||(b=G.define({name:E,template:v,dependencies:F,bindables:P})),e.register(b)}const U=Object.freeze(Object.defineProperty({__proto__:null,bindables:P,default:v,dependencies:F,name:E,register:Q,template:v},Symbol.toStringTag,{value:"Module"}));var X=Object.create,x=Object.defineProperty,Z=Object.getOwnPropertyDescriptor,ee=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),z=e=>{throw TypeError(e)},C=(e,t,i)=>t in e?x(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,te=(e,t)=>x(e,"name",{value:t,configurable:!0}),re=e=>[,,,X(null)],ie=["class","method","getter","setter","accessor","field","value","get","set"],I=e=>e!==void 0&&typeof e!="function"?z("Function expected"):e,oe=(e,t,i,o,r)=>({kind:ie[e],name:t,metadata:o,addInitializer:n=>i._?z("Already initialized"):r.push(I(n||null))}),ne=(e,t)=>C(t,ee("metadata"),e[3]),ae=(e,t,i,o)=>{for(var r=0,n=e[t>>1],a=n&&n.length;r<a;r++)n[r].call(i);return o},le=(e,t,i,o,r,n)=>{var a,s,u,l=t&7,_=!1,f=0,h=e[f]||(e[f]=[]),d=l&&(r=r.prototype,l<5&&(l>3||!_)&&Z(r,i));te(r,i);for(var c=o.length-1;c>=0;c--)u=oe(l,i,s={},e[3],h),a=(0,o[c])(r,u),s._=1,I(a)&&(r=a);return ne(e,r),d&&x(r,i,d),_?l^4?n:d:r},m=(e,t,i)=>C(e,typeof t!="symbol"?t+"":t,i),j,y;const se=995;j=[M(U)];class g{constructor(){m(this,"title","Example 29: Grid with Header and Footer slot"),m(this,"subTitle","Simple Grids with a custom header and footer via named slots"),m(this,"gridOptions"),m(this,"columnDefinitions",[]),m(this,"dataset",[]),m(this,"hideSubTitle",!1),this.defineGrids()}attached(){this.dataset=this.mockData(se)}defineGrids(){this.columnDefinitions=[{id:"title",name:"Title",field:"title",sortable:!0,minWidth:100},{id:"duration",name:"Duration (days)",field:"duration",sortable:!0,minWidth:100},{id:"%",name:"% Complete",field:"percentComplete",sortable:!0,minWidth:100},{id:"start",name:"Start",field:"start",formatter:D.dateIso},{id:"finish",name:"Finish",field:"finish",formatter:D.dateIso},{id:"effort-driven",name:"Effort Driven",field:"effortDriven",sortable:!0,minWidth:100}],this.gridOptions={enableAutoResize:!1,enableSorting:!0,gridHeight:225,gridWidth:800}}mockData(t){const i=[];for(let o=0;o<t;o++){const r=2e3+Math.floor(Math.random()*10),n=Math.floor(Math.random()*11),a=Math.floor(Math.random()*29),s=Math.round(Math.random()*100);i[o]={id:o,title:"Task "+o,duration:Math.round(Math.random()*100)+"",percentComplete:s,start:new Date(r,n+1,a),finish:new Date(r+1,n+1,a),effortDriven:o%5===0}}return i}}y=re();g=le(y,0,"Example29",j,g);ae(y,1,g);export{g as Example29};
//# sourceMappingURL=example29-Bvlz3c5l.js.map
