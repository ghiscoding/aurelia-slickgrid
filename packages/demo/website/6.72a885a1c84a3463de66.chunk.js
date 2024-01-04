"use strict";(self.webpackChunkaurelia_slickgrid_demo=self.webpackChunkaurelia_slickgrid_demo||[]).push([[6],{74336:(t,e,i)=>{i.d(e,{R:()=>n});var r=i(77596),s=i(43038);class o{set columnDefinitions(t){this._columnDefinitions=t}set datasetIdPropName(t){this._datasetIdPropName=t}constructor(){this._filterCount=0,this._columnDefinitions=[],this._datasetIdPropName="id",this._odataOptions={filterQueue:[],orderBy:""},this._defaultSortBy="",this._columnFilters={}}buildQuery(){if(!this._odataOptions)throw new Error('Odata Service requires certain options like "top" for it to work');this._odataOptions.filterQueue=[];const t=[];if(this._odataOptions&&!0===this._odataOptions.enableCount){const e=this._odataOptions.version&&this._odataOptions.version>=4?"$count=true":"$inlinecount=allpages";t.push(e)}if(this._odataOptions.top&&t.push(`$top=${this._odataOptions.top}`),this._odataOptions.skip&&t.push(`$skip=${this._odataOptions.skip}`),this._odataOptions.orderBy){let e="";e=Array.isArray(this._odataOptions.orderBy)?this._odataOptions.orderBy.join(","):this._odataOptions.orderBy,t.push(`$orderby=${e}`)}if(this._odataOptions.filterBy||this._odataOptions.filter){const t=this._odataOptions.filter||this._odataOptions.filterBy;if(t){this._filterCount=1,this._odataOptions.filterQueue=[];let e=t;Array.isArray(t)&&(this._filterCount=t.length,e=t.join(` ${this._odataOptions.filterBySeparator||"and"} `)),"string"==typeof e&&("("!==e[0]||")"!==e.slice(-1)?this.addToFilterQueueWhenNotExists(`(${e})`):this.addToFilterQueueWhenNotExists(e))}}if(this._odataOptions.filterQueue.length>0){const e=this._odataOptions.filterQueue.join(` ${this._odataOptions.filterBySeparator||"and"} `);this._odataOptions.filter=e,t.push(`$filter=${e}`)}if(this._odataOptions.enableSelect||this._odataOptions.enableExpand){const e=this._columnDefinitions.flatMap((t=>t.fields??[t.field]));e.unshift(this._datasetIdPropName);const i=this.buildSelectExpand([...new Set(e)]);if(this._odataOptions.enableSelect){const e=i.selectParts.join(",");t.push(`$select=${e}`)}if(this._odataOptions.enableExpand){const e=i.expandParts.join(",");t.push(`$expand=${e}`)}}return t.join("&")}getFilterCount(){return this._filterCount}get columnFilters(){return this._columnFilters}get options(){return this._odataOptions}set options(t){this._odataOptions=t}removeColumnFilter(t){this._columnFilters&&this._columnFilters.hasOwnProperty(t)&&delete this._columnFilters[t]}saveColumnFilter(t,e,i){this._columnFilters[t]={search:i,value:e}}updateOptions(t){for(const e of Object.keys(t))if(t.hasOwnProperty(e)&&(this._odataOptions[e]=t[e]),"orderBy"===e||"sortBy"===e){let i=t[e];this._odataOptions.caseType===r.blG.pascalCase&&(Array.isArray(i)?i.forEach(((t,e,i)=>{i[e]=(0,s.titleCase)(t)})):i=(0,s.titleCase)(t[e])),this._odataOptions.orderBy=i,this._defaultSortBy=i}}addToFilterQueueWhenNotExists(t){this._odataOptions.filterQueue&&-1===this._odataOptions.filterQueue.indexOf(t)&&this._odataOptions.filterQueue.push(t)}buildSelectExpand(t){const e={},i=new Set;for(const r of t){const t=r.split("/");if(1===t.length)i.add(r);else{const r=t[0],s=t.splice(1).join("/");e[r]||(e[r]=[]),e[r].push(s),!this._odataOptions.enableExpand||this._odataOptions.version&&this._odataOptions.version>=4||i.add(r)}}return{selectParts:[...i],expandParts:this._odataOptions.enableExpand?this.buildExpand(e):[]}}buildExpand(t){const e=[];for(const i of Object.keys(t))if(this._odataOptions.enableSelect&&this._odataOptions.version&&this._odataOptions.version>=4){const r=this.buildSelectExpand(t[i]);let s=r.selectParts.join(",");s.length>0&&(s="$select="+s),this._odataOptions.enableExpand&&r.expandParts.length>0&&(s+=(s.length>0?";":"")+"$expand="+r.expandParts.join(",")),s.length>0&&(s="("+s+")"),e.push(i+s)}else e.push(i);return e}}class n{get columnDefinitions(){return this._columnDefinitions}get odataService(){return this._odataService}get _gridOptions(){return this._grid?.getOptions()??{}}constructor(){this._currentFilters=[],this._currentPagination=null,this._currentSorters=[],this._columnDefinitions=[],this.defaultOptions={top:25,orderBy:"",caseType:r.blG.pascalCase},this._odataService=new o}init(t,e,i,r){this._grid=i;const s={...this.defaultOptions,...t};if(this._gridOptions&&!this._gridOptions.enablePagination)this._odataService.options={...s,top:void 0},this._currentPagination=null;else{const t=e&&e.pageSize?e.pageSize:this.defaultOptions.top;this._odataService.options={...s,top:t},this._currentPagination={pageNumber:1,pageSize:this._odataService.options.top||this.defaultOptions.top||20}}if(this.options=this._odataService.options,this.pagination=e,i?.getColumns){const t=r?.allColumns??i.getColumns()??[];this._columnDefinitions=t.filter((t=>!t.excludeFromQuery))}this._odataService.columnDefinitions=this._columnDefinitions,this._odataService.datasetIdPropName=this._gridOptions.datasetIdPropertyName||"id"}buildQuery(){return this._odataService.buildQuery()}postProcess(t){const e=this._odataService?.options?.version??2;if(this.pagination&&this._odataService?.options?.enableCount){const i=(this._odataService?.options?.countExtractor??e>=4?t=>t?.["@odata.count"]:3===e?t=>t?.__count:t=>t?.d?.__count)(t);"number"==typeof i&&(this.pagination.totalItems=i)}if(this._odataService?.options?.enableExpand){const i=(this._odataService?.options?.datasetExtractor??e>=4?t=>t?.value:3===e?t=>t?.results:t=>t?.d?.results)(t);if(Array.isArray(i)){const t=new Set(this._columnDefinitions.flatMap((t=>t.fields??[t.field])).filter((t=>t.includes("/"))));if(t.size>0){const e=new Set;for(const r of i){for(const i of t){const t=i.split("/"),s=t[0];e.add(s);let o=r[s];for(let e=1;e<t.length;e++){const i=t[e];o&&"object"==typeof o&&i in o&&(o=o[i])}r[i]=o}for(const t of e)"object"==typeof r[t]&&delete r[t]}}}}}clearFilters(){this._currentFilters=[],this.updateFilters([])}clearSorters(){this._currentSorters=[],this.updateSorters([])}updateOptions(t){this.options={...this.options,...t},this._odataService.options=this.options}removeColumnFilter(t){this._odataService.removeColumnFilter(t)}getCurrentFilters(){return this._currentFilters}getCurrentPagination(){return this._currentPagination}getCurrentSorters(){return this._currentSorters}mapOdataOperator(t){let e="";switch(t){case"<":e="lt";break;case"<=":e="le";break;case">":e="gt";break;case">=":e="ge";break;case"<>":case"!=":e="ne";break;default:e="eq"}return e}resetPaginationOptions(){this._odataService.updateOptions({skip:0})}saveColumnFilter(t,e,i){this._odataService.saveColumnFilter(t,e,i)}processOnFilterChanged(t,e){if(void 0===this._gridOptions.backendServiceApi)throw new Error('Something went wrong in the GridOdataService, "backendServiceApi" is not initialized');if(this._currentFilters=this.castFilterToColumnFilters(e.columnFilters),!e||!e.grid)throw new Error('Something went wrong when trying create the GridOdataService, it seems that "args" is not populated correctly');return this.updateFilters(e.columnFilters),this.resetPaginationOptions(),this._odataService.buildQuery()}processOnPaginationChanged(t,e){const i=+(e.pageSize||(this.pagination?this.pagination.pageSize:20));return this.updatePagination(e.newPage,i),this._odataService.buildQuery()}processOnSortChanged(t,e){const i=e.multiColumnSort?e.sortCols:new Array({columnId:e.sortCol?.id??"",sortCol:e.sortCol,sortAsc:e.sortAsc});return this.updateSorters(i),this._odataService.buildQuery()}updateFilters(t,e){let i="";const o=[],n=this._odataService?.options?.version??2;e&&(this._currentFilters=this.castFilterToColumnFilters(t));for(const a in t)if(t.hasOwnProperty(a)){const l=t[a];let c;if(c=e&&Array.isArray(this._columnDefinitions)?this._columnDefinitions.find((t=>t.id===l.columnId)):l.columnDef,!c)throw new Error("[GridOData Service]: Something went wrong in trying to get the column definition of the specified filter (or preset filters). Did you make a typo on the filter columnId?");let u=c.filter?.queryField||c.queryFieldFilter||c.queryField||c.field||c.name||"";u instanceof HTMLElement&&(u=(0,s.stripTags)(u.innerHTML));const h=c.type||r.fSu.string;let p=(l&&l.searchTerms?[...l.searchTerms]:null)||[],d=Array.isArray(p)&&1===p.length?p[0]:"";if(void 0===d&&(d=""),!u)throw new Error('GridOData filter could not find the field name to query the search, your column definition must include a valid "field" or "name" (optionally you can also use the "queryfield").');if(this._odataService.options.useVerbatimSearchTerms||l.verbatimSearchTerms){o.push(`${u} ${l.operator} ${JSON.stringify(l.searchTerms)}`.trim());continue}d=null==d?"":`${d}`;const f=!1!==(c.autoParseInputFilterOperator??this._gridOptions.autoParseInputFilterOperator)?d.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/):[d,"",d,""];let y=l.operator||f?.[1],g=f?.[2]||"";const _=f?.[3]||"*z"===y||y===r.$MC.endsWith?"*":"",m=l.bypassBackendQuery||!1;if(u&&""===g&&p.length<=1){this.removeColumnFilter(u);continue}if(Array.isArray(p)&&1===p.length&&"string"==typeof p[0]&&p[0].indexOf("..")>=0&&(y!==r.$MC.rangeInclusive&&y!==r.$MC.rangeExclusive&&(y=this._gridOptions.defaultFilterRangeOperator??r.$MC.rangeInclusive),p=p[0].split("..",2),""===p[0]?(y=y===r.$MC.rangeInclusive?"<=":y===r.$MC.rangeExclusive?"<":y,p=p.slice(1),g=p[0]):""===p[1]&&(y=y===r.$MC.rangeInclusive?">=":y===r.$MC.rangeExclusive?">":y,p=p.slice(0,1),g=p[0])),!y&&c.filter&&(y=c.filter.operator),!y&&Array.isArray(p)&&2===p.length&&p[0]&&p[1]&&(y=this._gridOptions.defaultFilterRangeOperator),(y===r.$MC.rangeInclusive||r.$MC.rangeExclusive)&&Array.isArray(p)&&1===p.length&&h===r.fSu.date&&(y=r.$MC.equal),y||(y=(0,r.xaq)(h)),m)u&&this.saveColumnFilter(u,d,p);else{if(g=this.normalizeSearchValue(h,g,n),Array.isArray(p)&&p.forEach(((t,e)=>{p[e]=this.normalizeSearchValue(h,p[e],n)})),i="",this._odataService.options.caseType===r.blG.pascalCase&&(u=(0,s.titleCase)(u||"")),p&&p.length>1&&("IN"===y||"NIN"===y||"NOTIN"===y||"NOT IN"===y||"NOT_IN"===y)){const t=[];if("IN"===y){for(let e=0,i=p.length;e<i;e++)t.push(`${u} eq ${p[e]}`);i=t.join(" or ")}else{for(let e=0,i=p.length;e<i;e++)t.push(`${u} ne ${p[e]}`);i=t.join(" and ")}"string"==typeof i&&"("===i[0]&&")"===i.slice(-1)||(i=`(${i})`)}else"*"===y||"a*"===y||"*z"===y||"*"===_||y===r.$MC.startsWith||y===r.$MC.endsWith?i="*"===y||"*z"===y||y===r.$MC.endsWith?`endswith(${u}, ${g})`:`startswith(${u}, ${g})`:y===r.$MC.rangeExclusive||y===r.$MC.rangeInclusive?i=this.filterBySearchTermRange(u,y,p):""!==y&&y!==r.$MC.contains&&y!==r.$MC.notContains||h!==r.fSu.string&&h!==r.fSu.text&&h!==r.fSu.readonly?i=`${u} ${this.mapOdataOperator(y)} ${g}`:(i=n>=4?`contains(${u}, ${g})`:`substringof(${g}, ${u})`,y===r.$MC.notContains&&(i=`not ${i}`));""!==i&&(o.push(i.trim()),this.saveColumnFilter(u||"",d,g))}}this._odataService.updateOptions({filter:o.length>0?o.join(" and "):"",skip:void 0})}updatePagination(t,e){this._currentPagination={pageNumber:t,pageSize:e},!this._gridOptions||!this._gridOptions.enablePagination&&this._gridOptions.hasOwnProperty("enablePagination")||this._odataService.updateOptions({top:e,skip:(t-1)*e})}updateSorters(t,e){let i=[];const o=[];if(!t&&e){i=e,i.forEach((t=>t.direction=t.direction.toLowerCase()));const t=i.map((t=>{const e=this._columnDefinitions.find((e=>e.id===t.columnId));return o.push({field:e?(e.queryFieldSorter||e.queryField||e.field)+"":t.columnId+"",direction:t.direction}),e?{columnId:t.columnId,sortAsc:t.direction.toUpperCase()===r.SrV.ASC}:null}));Array.isArray(t)&&this._grid&&this._grid.setSortColumns(t)}else if(t&&!e)if(0===t?.length);else if(t)for(const e of t)if(e.sortCol){let t=(e.sortCol.queryFieldSorter||e.sortCol.queryField||e.sortCol.field)+"",n=(e.sortCol.field||e.sortCol.id)+"",a=(e.sortCol.queryFieldSorter||e.sortCol.queryField||e.sortCol.field||"")+"";this._odataService.options.caseType===r.blG.pascalCase&&(t=(0,s.titleCase)(t),n=(0,s.titleCase)(n),a=(0,s.titleCase)(a)),""!==n&&i.push({columnId:n,direction:e.sortAsc?"asc":"desc"}),""!==a&&o.push({field:a,direction:e.sortAsc?r.SrV.ASC:r.SrV.DESC})}i=i||[];const n=o.map((t=>{let e="";return t&&t.field&&(e=`${this._odataService.options.caseType===r.blG.pascalCase?(0,s.titleCase)(t.field):t.field} ${t&&t.direction&&t.direction.toLowerCase()||""}`),e})).join(",");return this._odataService.updateOptions({orderBy:n}),this._currentSorters=i,this._odataService.buildQuery()}castFilterToColumnFilters(t){const e="object"==typeof t?Object.keys(t).map((e=>t[e])):t;return Array.isArray(e)?e.map((t=>{const e={columnId:t.columnId||""};return t.operator&&(e.operator=t.operator),t.targetSelector&&(e.targetSelector=t.targetSelector),Array.isArray(t.searchTerms)&&(e.searchTerms=t.searchTerms),e})):[]}filterBySearchTermRange(t,e,i){let s="";return Array.isArray(i)&&2===i.length&&(e===r.$MC.rangeInclusive?(s=`(${t} ge ${i[0]}`,""!==i[1]&&(s+=` and ${t} le ${i[1]}`),s+=")"):e===r.$MC.rangeExclusive&&(s=`(${t} gt ${i[0]}`,""!==i[1]&&(s+=` and ${t} lt ${i[1]}`),s+=")")),s}normalizeSearchValue(t,e,i){switch(t){case r.fSu.date:e=(0,r.jCn)(e,!0),e=i>=4?e:`DateTime'${e}'`;break;case r.fSu.string:case r.fSu.text:case r.fSu.readonly:"string"==typeof e&&(e=e.replace(/'/g,"''"),e=`'${e=encodeURIComponent(e)}'`);break;case r.fSu.integer:case r.fSu.number:case r.fSu.float:"string"==typeof e&&(""!==(e=(e=(e=(e=(e=e.replace(/\.\./g,".")).replace(/\.+$/g,"")).replace(/^\.+/g,"0.")).replace(/^\-+\.+/g,"-0.")).replace(/(?!^\-)[^\d\.]/g,""))&&"-"!==e||(e="0"))}return e}}},42957:(t,e,i)=>{i.d(e,{AV:()=>s,tL:()=>p});var r=i(37819);function s(t,e){return JSON.stringify(void 0!==t?t:{},e)}const o={maxRetries:3,interval:1e3,strategy:0};class n{constructor(t){if(this.retryConfig={...o,...void 0!==t?t:{}},2===this.retryConfig.strategy&&this.retryConfig.interval<=1e3)throw new Error("An interval less than or equal to 1 second is not allowed when using the exponential retry strategy")}request(t){return t.retryConfig||(t.retryConfig={...this.retryConfig},t.retryConfig.counter=0),t.retryConfig.requestClone=t.clone(),t}response(t,e){return Reflect.deleteProperty(e,"retryConfig"),t}responseError(t,e,i){const{retryConfig:r}=e,{requestClone:s}=r;return Promise.resolve().then((()=>{if(r.counter<r.maxRetries){const o=void 0===r.doRetry||r.doRetry(t,e);return Promise.resolve(o).then((o=>{if(o){r.counter++;const t=a(r);return new Promise((e=>setTimeout(e,isNaN(t)?0:t))).then((()=>{const t=s.clone();return"function"==typeof r.beforeRetry?r.beforeRetry(t,i):t})).then((t=>{const e={...t,retryConfig:r};return i.fetch(e)}))}throw Reflect.deleteProperty(e,"retryConfig"),t}))}throw Reflect.deleteProperty(e,"retryConfig"),t}))}}function a(t){const{interval:e,strategy:i,minRandomInterval:r,maxRandomInterval:s,counter:o}=t;if("function"==typeof i)return t.strategy(o);switch(i){case 0:return l[0](e);case 1:return l[1](o,e);case 2:return l[2](o,e);case 3:return l[3](o,e,r,s);default:throw new Error("Unrecognized retry strategy")}}const l=[t=>t,(t,e)=>e*t,(t,e)=>1===t?e:e**t/1e3,(t,e,i=0,r=6e4)=>Math.random()*(r-i)+i];class c{constructor(){this.baseUrl="",this.defaults={},this.interceptors=[],this.dispatcher=null}withBaseUrl(t){return this.baseUrl=t,this}withDefaults(t){return this.defaults=t,this}withInterceptor(t){return this.interceptors.push(t),this}useStandardConfiguration(){return Object.assign(this.defaults,{credentials:"same-origin"},this.defaults),this.rejectErrorResponses()}rejectErrorResponses(){return this.withInterceptor({response:u})}withRetry(t){const e=new n(t);return this.withInterceptor(e)}withDispatcher(t){return this.dispatcher=t,this}}function u(t){if(!t.ok)throw t;return t}const h=/^([a-z][a-z0-9+\-.]*:)?\/\//i,p=r.DI.createInterface("IHttpClient",(t=>t.singleton(d)));class d{constructor(){this.dispatcher=null,this.activeRequestCount=0,this.isRequesting=!1,this.isConfigured=!1,this.baseUrl="",this.defaults=null,this.interceptors=[]}configure(t){let e;if("object"==typeof t)e={defaults:t};else{if("function"!=typeof t)throw new Error("invalid config");{e=new c,e.baseUrl=this.baseUrl,e.defaults={...this.defaults},e.interceptors=this.interceptors,e.dispatcher=this.dispatcher;const i=t(e);Object.prototype.isPrototypeOf.call(c.prototype,i)&&(e=i)}}const i=e.defaults;if(void 0!==i&&Object.prototype.isPrototypeOf.call(Headers.prototype,i.headers))throw new Error("Default headers must be a plain object.");const r=e.interceptors;if(void 0!==r&&r.length){if(r.filter((t=>Object.prototype.isPrototypeOf.call(n.prototype,t))).length>1)throw new Error("Only one RetryInterceptor is allowed.");const t=r.findIndex((t=>Object.prototype.isPrototypeOf.call(n.prototype,t)));if(t>=0&&t!==r.length-1)throw new Error("The retry interceptor must be the last interceptor defined.")}return this.baseUrl=e.baseUrl,this.defaults=i,this.interceptors=void 0!==e.interceptors?e.interceptors:[],this.dispatcher=e.dispatcher,this.isConfigured=!0,this}fetch(t,e){this.trackRequestStart();let i=this.buildRequest(t,e);return this.processRequest(i,this.interceptors).then((t=>{let e;if(Object.prototype.isPrototypeOf.call(Response.prototype,t))e=Promise.resolve(t);else{if(!Object.prototype.isPrototypeOf.call(Request.prototype,t))throw new Error(`An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [${t}]`);i=t,e=fetch(i)}return this.processResponse(e,this.interceptors,i)})).then((t=>Object.prototype.isPrototypeOf.call(Request.prototype,t)?this.fetch(t):t)).then((t=>(this.trackRequestEnd(),t)),(t=>{throw this.trackRequestEnd(),t}))}buildRequest(t,e){const i=null!==this.defaults?this.defaults:{};let r,s,o;const n=function(t){const e={},i=void 0!==t?t:{};for(const t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]="function"==typeof i[t]?i[t]():i[t]);return e}(i.headers);if(Object.prototype.isPrototypeOf.call(Request.prototype,t))r=t,o=new Headers(r.headers).get("Content-Type");else{e||(e={}),s=e.body;const n=void 0!==s?{body:s}:null,a={...i,headers:{},...e,...n};o=new Headers(a.headers).get("Content-Type"),r=new Request(f(this.baseUrl,t),a)}return o||(new Headers(n).has("content-type")?r.headers.set("Content-Type",new Headers(n).get("content-type")):void 0!==s&&function(t){try{JSON.parse(t)}catch(t){return!1}return!0}(s)&&r.headers.set("Content-Type","application/json")),function(t,e){const i=void 0!==e?e:{};for(const e in i)Object.prototype.hasOwnProperty.call(i,e)&&!t.has(e)&&t.set(e,i[e])}(r.headers,n),void 0!==s&&Object.prototype.isPrototypeOf.call(Blob.prototype,s)&&s.type&&r.headers.set("Content-Type",s.type),r}get(t,e){return this.fetch(t,e)}post(t,e,i){return this.callFetch(t,e,i,"POST")}put(t,e,i){return this.callFetch(t,e,i,"PUT")}patch(t,e,i){return this.callFetch(t,e,i,"PATCH")}delete(t,e,i){return this.callFetch(t,e,i,"DELETE")}trackRequestStart(){if(this.isRequesting=!!++this.activeRequestCount,this.isRequesting&&null!==this.dispatcher){const t=new this.dispatcher.ownerDocument.defaultView.CustomEvent("aurelia-fetch-client-request-started",{bubbles:!0,cancelable:!0});setTimeout((()=>{this.dispatcher.dispatchEvent(t)}),1)}}trackRequestEnd(){if(this.isRequesting=!! --this.activeRequestCount,!this.isRequesting&&null!==this.dispatcher){const t=new this.dispatcher.ownerDocument.defaultView.CustomEvent("aurelia-fetch-client-requests-drained",{bubbles:!0,cancelable:!0});setTimeout((()=>{this.dispatcher.dispatchEvent(t)}),1)}}processRequest(t,e){return this.applyInterceptors(t,e,"request","requestError",this)}processResponse(t,e,i){return this.applyInterceptors(t,e,"response","responseError",i,this)}applyInterceptors(t,e,i,r,...s){return(void 0!==e?e:[]).reduce(((t,e)=>{const o=e[i],n=e[r];return t.then(o?t=>o.call(e,t,...s):y,n?t=>n.call(e,t,...s):g)}),Promise.resolve(t))}callFetch(t,e,i,r){return i||(i={}),i.method=r,e&&(i.body=e),this.fetch(t,i)}}function f(t,e){return h.test(e)?e:(void 0!==t?t:"")+e}function y(t){return t}function g(t){throw t}}}]);