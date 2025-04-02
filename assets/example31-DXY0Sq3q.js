import{C as Oe,_ as I,Z as z,$ as M,a0 as C,a1 as Ce,a2 as X,a3 as G,a4 as ke,a5 as Ae,r as Ie,n as Pe,b as Q,a as Te,O as Fe,c as Re}from"./index-Bz3uuwsZ.js";import{G as Ge}from"./grid-odata.service-BpQYoHTV.js";import{E as De}from"./editors.index-CmyHd4IA.js";import{I as Le}from"./index.dev-DuhuQGSj.js";import{S as ze}from"./customers_100-D4oCOlSv.js";const ee="example31",$=`<h2>
  \${title}
  <span class="float-end">
    <a style="font-size: 18px"
        target="_blank"
        href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/packages/demo/src/examples/slickgrid/example31.ts">
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

<div class="row">
  <div class="col-md-12" aria-label="Basic Editing Commands">
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="clear-filters-sorting"
            click.trigger="clearAllFiltersAndSorts()" title="Clear all Filters & Sorts">
      <span class="mdi mdi-close"></span>
      <span>Clear all Filter & Sorts</span>
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-filter"
            click.trigger="setFiltersDynamically()">
      Set Filters Dynamically
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" data-test="set-dynamic-sorting"
            click.trigger="setSortingDynamically()">
      Set Sorting Dynamically
    </button>
    <button class="btn btn-outline-secondary btn-sm btn-icon" style="margin-left: 10px" data-test="add-gender-button"
            click.trigger="addOtherGender()" disabled.bind="isOtherGenderAdded">
      Add Other Gender via RxJS
    </button>
  </div>
</div>

<br />

<div>
  <span>
    <label>Programmatically go to first/last page:</label>
    <div class="btn-group" role="group">
      <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-first-page" click.trigger="goToFirstPage()">
        <i class="mdi mdi-page-first"></i>
      </button>
      <button class="btn btn-outline-secondary btn-xs btn-icon px-2" data-test="goto-last-page" click.trigger="goToLastPage()">
        <i class="mdi mdi-page-last icon"></i>
      </button>
    </div>
  </span>

  <span style="margin-left: 10px">
    <label>OData Version: </label>
    <span data-test="radioVersion">
      <label class="radio-inline control-label" for="radio2">
        <input type="radio" name="inlineRadioOptions" data-test="version2" id="radio2" checked value.bind="2"
                click.trigger="setOdataVersion(2)"> 2
      </label>
      <label class="radio-inline control-label" for="radio4">
        <input type="radio" name="inlineRadioOptions" data-test="version4" id="radio4" value.bind="4"
                click.trigger="setOdataVersion(4)"> 4
      </label>
    </span>
    <label class="checkbox-inline control-label" for="enableCount" style="margin-left: 20px">
      <input type="checkbox" id="enableCount" data-test="enable-count" checked.bind="isCountEnabled"
              click.trigger="changeCountEnableFlag()">
      <span style="font-weight: bold">Enable Count</span> (add to OData query)
    </label>
    <label class="checkbox-inline control-label" for="enableSelect" style="margin-left: 20px">
      <input type="checkbox" id="enableSelect" data-test="enable-select" checked.bind="isSelectEnabled"
              click.trigger="changeEnableSelectFlag()">
      <span style="font-weight: bold">Enable Select</span> (add to OData query)
    </label>
    <label class="checkbox-inline control-label" for="enableExpand" style="margin-left: 20px">
      <input type="checkbox" id="enableExpand" data-test="enable-expand" checked.bind="isExpandEnabled"
              click.trigger="changeEnableExpandFlag()">
      <span style="font-weight: bold">Enable Expand</span> (add to OData query)
    </label>
  </span>
</div>

<div class="row" style="margin-top: 5px">
  <div class="col-md-10">
    <div class="alert alert-info" data-test="alert-odata-query">
      <strong>OData Query:</strong> <span data-test="odata-query-result">\${odataQuery}</span>
    </div>
  </div>
  <div class.bind="status.class" role="alert" data-test="status">
    <strong>Status: </strong> \${status.text}
  </div>
</div>

<aurelia-slickgrid grid-id="grid31"
                    column-definitions.bind="columnDefinitions"
                    grid-options.bind="gridOptions"
                    dataset.bind="dataset"
                    pagination-options.bind="paginationOptions"
                    on-aurelia-grid-created.trigger="aureliaGridReady($event.detail)"
                    on-grid-state-changed.trigger="gridStateChanged($event.detail)">
</aurelia-slickgrid>
`,te=[],re={};let D;function Me(t){D||(D=Oe.define({name:ee,template:$,dependencies:te,bindables:re})),t.register(D)}const $e=Object.freeze(Object.defineProperty({__proto__:null,bindables:re,default:$,dependencies:te,name:ee,register:Me,template:$},Symbol.toStringTag,{value:"Module"}));function p(t){return typeof t=="function"}function q(t){var e=function(n){Error.call(n),n.stack=new Error().stack},r=t(e);return r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r}var L=q(function(t){return function(r){t(this),this.message=r?r.length+` errors occurred during unsubscription:
`+r.map(function(n,i){return i+1+") "+n.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=r}});function U(t,e){if(t){var r=t.indexOf(e);0<=r&&t.splice(r,1)}}var F=function(){function t(e){this.initialTeardown=e,this.closed=!1,this._parentage=null,this._finalizers=null}return t.prototype.unsubscribe=function(){var e,r,n,i,o;if(!this.closed){this.closed=!0;var s=this._parentage;if(s)if(this._parentage=null,Array.isArray(s))try{for(var l=I(s),a=l.next();!a.done;a=l.next()){var c=a.value;c.remove(this)}}catch(m){e={error:m}}finally{try{a&&!a.done&&(r=l.return)&&r.call(l)}finally{if(e)throw e.error}}else s.remove(this);var d=this.initialTeardown;if(p(d))try{d()}catch(m){o=m instanceof L?m.errors:[m]}var u=this._finalizers;if(u){this._finalizers=null;try{for(var b=I(u),f=b.next();!f.done;f=b.next()){var S=f.value;try{N(S)}catch(m){o=o??[],m instanceof L?o=z(z([],M(o)),M(m.errors)):o.push(m)}}}catch(m){n={error:m}}finally{try{f&&!f.done&&(i=b.return)&&i.call(b)}finally{if(n)throw n.error}}}if(o)throw new L(o)}},t.prototype.add=function(e){var r;if(e&&e!==this)if(this.closed)N(e);else{if(e instanceof t){if(e.closed||e._hasParent(this))return;e._addParent(this)}(this._finalizers=(r=this._finalizers)!==null&&r!==void 0?r:[]).push(e)}},t.prototype._hasParent=function(e){var r=this._parentage;return r===e||Array.isArray(r)&&r.includes(e)},t.prototype._addParent=function(e){var r=this._parentage;this._parentage=Array.isArray(r)?(r.push(e),r):r?[r,e]:e},t.prototype._removeParent=function(e){var r=this._parentage;r===e?this._parentage=null:Array.isArray(r)&&U(r,e)},t.prototype.remove=function(e){var r=this._finalizers;r&&U(r,e),e instanceof t&&e._removeParent(this)},t.EMPTY=function(){var e=new t;return e.closed=!0,e}(),t}(),ne=F.EMPTY;function ie(t){return t instanceof F||t&&"closed"in t&&p(t.remove)&&p(t.add)&&p(t.unsubscribe)}function N(t){p(t)?t():t.unsubscribe()}var Ue={Promise:void 0},Ve={setTimeout:function(t,e){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];return setTimeout.apply(void 0,z([t,e],M(r)))},clearTimeout:function(t){return clearTimeout(t)},delegate:void 0};function oe(t){Ve.setTimeout(function(){throw t})}function V(){}function A(t){t()}var Y=function(t){C(e,t);function e(r){var n=t.call(this)||this;return n.isStopped=!1,r?(n.destination=r,ie(r)&&r.add(n)):n.destination=qe,n}return e.create=function(r,n,i){return new P(r,n,i)},e.prototype.next=function(r){this.isStopped||this._next(r)},e.prototype.error=function(r){this.isStopped||(this.isStopped=!0,this._error(r))},e.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},e.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,t.prototype.unsubscribe.call(this),this.destination=null)},e.prototype._next=function(r){this.destination.next(r)},e.prototype._error=function(r){try{this.destination.error(r)}finally{this.unsubscribe()}},e.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},e}(F),Be=function(){function t(e){this.partialObserver=e}return t.prototype.next=function(e){var r=this.partialObserver;if(r.next)try{r.next(e)}catch(n){k(n)}},t.prototype.error=function(e){var r=this.partialObserver;if(r.error)try{r.error(e)}catch(n){k(n)}else k(e)},t.prototype.complete=function(){var e=this.partialObserver;if(e.complete)try{e.complete()}catch(r){k(r)}},t}(),P=function(t){C(e,t);function e(r,n,i){var o=t.call(this)||this,s;return p(r)||!r?s={next:r??void 0,error:n??void 0,complete:i??void 0}:s=r,o.destination=new Be(s),o}return e}(Y);function k(t){oe(t)}function je(t){throw t}var qe={closed:!0,next:V,error:je,complete:V},Z=function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"}();function Ye(t){return t}function Ze(t){return t.length===0?Ye:t.length===1?t[0]:function(r){return t.reduce(function(n,i){return i(n)},r)}}var v=function(){function t(e){e&&(this._subscribe=e)}return t.prototype.lift=function(e){var r=new t;return r.source=this,r.operator=e,r},t.prototype.subscribe=function(e,r,n){var i=this,o=Je(e)?e:new P(e,r,n);return A(function(){var s=i,l=s.operator,a=s.source;o.add(l?l.call(o,a):a?i._subscribe(o):i._trySubscribe(o))}),o},t.prototype._trySubscribe=function(e){try{return this._subscribe(e)}catch(r){e.error(r)}},t.prototype.forEach=function(e,r){var n=this;return r=W(r),new r(function(i,o){var s=new P({next:function(l){try{e(l)}catch(a){o(a),s.unsubscribe()}},error:o,complete:i});n.subscribe(s)})},t.prototype._subscribe=function(e){var r;return(r=this.source)===null||r===void 0?void 0:r.subscribe(e)},t.prototype[Z]=function(){return this},t.prototype.pipe=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return Ze(e)(this)},t.prototype.toPromise=function(e){var r=this;return e=W(e),new e(function(n,i){var o;r.subscribe(function(s){return o=s},function(s){return i(s)},function(){return n(o)})})},t.create=function(e){return new t(e)},t}();function W(t){var e;return(e=t??Ue.Promise)!==null&&e!==void 0?e:Promise}function He(t){return t&&p(t.next)&&p(t.error)&&p(t.complete)}function Je(t){return t&&t instanceof Y||He(t)&&ie(t)}function Qe(t){return p(t==null?void 0:t.lift)}function R(t){return function(e){if(Qe(e))return e.lift(function(r){try{return t(r,this)}catch(n){this.error(n)}});throw new TypeError("Unable to lift unknown Observable type")}}function T(t,e,r,n,i){return new Ne(t,e,r,n,i)}var Ne=function(t){C(e,t);function e(r,n,i,o,s,l){var a=t.call(this,r)||this;return a.onFinalize=s,a.shouldUnsubscribe=l,a._next=n?function(c){try{n(c)}catch(d){r.error(d)}}:t.prototype._next,a._error=o?function(c){try{o(c)}catch(d){r.error(d)}finally{this.unsubscribe()}}:t.prototype._error,a._complete=i?function(){try{i()}catch(c){r.error(c)}finally{this.unsubscribe()}}:t.prototype._complete,a}return e.prototype.unsubscribe=function(){var r;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var n=this.closed;t.prototype.unsubscribe.call(this),!n&&((r=this.onFinalize)===null||r===void 0||r.call(this))}},e}(Y),We=q(function(t){return function(){t(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}}),se=function(t){C(e,t);function e(){var r=t.call(this)||this;return r.closed=!1,r.currentObservers=null,r.observers=[],r.isStopped=!1,r.hasError=!1,r.thrownError=null,r}return e.prototype.lift=function(r){var n=new K(this,this);return n.operator=r,n},e.prototype._throwIfClosed=function(){if(this.closed)throw new We},e.prototype.next=function(r){var n=this;A(function(){var i,o;if(n._throwIfClosed(),!n.isStopped){n.currentObservers||(n.currentObservers=Array.from(n.observers));try{for(var s=I(n.currentObservers),l=s.next();!l.done;l=s.next()){var a=l.value;a.next(r)}}catch(c){i={error:c}}finally{try{l&&!l.done&&(o=s.return)&&o.call(s)}finally{if(i)throw i.error}}}})},e.prototype.error=function(r){var n=this;A(function(){if(n._throwIfClosed(),!n.isStopped){n.hasError=n.isStopped=!0,n.thrownError=r;for(var i=n.observers;i.length;)i.shift().error(r)}})},e.prototype.complete=function(){var r=this;A(function(){if(r._throwIfClosed(),!r.isStopped){r.isStopped=!0;for(var n=r.observers;n.length;)n.shift().complete()}})},e.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(e.prototype,"observed",{get:function(){var r;return((r=this.observers)===null||r===void 0?void 0:r.length)>0},enumerable:!1,configurable:!0}),e.prototype._trySubscribe=function(r){return this._throwIfClosed(),t.prototype._trySubscribe.call(this,r)},e.prototype._subscribe=function(r){return this._throwIfClosed(),this._checkFinalizedStatuses(r),this._innerSubscribe(r)},e.prototype._innerSubscribe=function(r){var n=this,i=this,o=i.hasError,s=i.isStopped,l=i.observers;return o||s?ne:(this.currentObservers=null,l.push(r),new F(function(){n.currentObservers=null,U(l,r)}))},e.prototype._checkFinalizedStatuses=function(r){var n=this,i=n.hasError,o=n.thrownError,s=n.isStopped;i?r.error(o):s&&r.complete()},e.prototype.asObservable=function(){var r=new v;return r.source=this,r},e.create=function(r,n){return new K(r,n)},e}(v),K=function(t){C(e,t);function e(r,n){var i=t.call(this)||this;return i.destination=r,i.source=n,i}return e.prototype.next=function(r){var n,i;(i=(n=this.destination)===null||n===void 0?void 0:n.next)===null||i===void 0||i.call(n,r)},e.prototype.error=function(r){var n,i;(i=(n=this.destination)===null||n===void 0?void 0:n.error)===null||i===void 0||i.call(n,r)},e.prototype.complete=function(){var r,n;(n=(r=this.destination)===null||r===void 0?void 0:r.complete)===null||n===void 0||n.call(r)},e.prototype._subscribe=function(r){var n,i;return(i=(n=this.source)===null||n===void 0?void 0:n.subscribe(r))!==null&&i!==void 0?i:ne},e}(se),Ke=new v(function(t){return t.complete()});function Xe(t){return t&&p(t.schedule)}function et(t){return t[t.length-1]}function tt(t){return Xe(et(t))?t.pop():void 0}var ae=function(t){return t&&typeof t.length=="number"&&typeof t!="function"};function le(t){return p(t==null?void 0:t.then)}function ce(t){return p(t[Z])}function ue(t){return Symbol.asyncIterator&&p(t==null?void 0:t[Symbol.asyncIterator])}function de(t){return new TypeError("You provided "+(t!==null&&typeof t=="object"?"an invalid object":"'"+t+"'")+" where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.")}function rt(){return typeof Symbol!="function"||!Symbol.iterator?"@@iterator":Symbol.iterator}var fe=rt();function he(t){return p(t==null?void 0:t[fe])}function pe(t){return Ce(this,arguments,function(){var r,n,i,o;return X(this,function(s){switch(s.label){case 0:r=t.getReader(),s.label=1;case 1:s.trys.push([1,,9,10]),s.label=2;case 2:return[4,G(r.read())];case 3:return n=s.sent(),i=n.value,o=n.done,o?[4,G(void 0)]:[3,5];case 4:return[2,s.sent()];case 5:return[4,G(i)];case 6:return[4,s.sent()];case 7:return s.sent(),[3,2];case 8:return[3,10];case 9:return r.releaseLock(),[7];case 10:return[2]}})})}function be(t){return p(t==null?void 0:t.getReader)}function O(t){if(t instanceof v)return t;if(t!=null){if(ce(t))return nt(t);if(ae(t))return it(t);if(le(t))return ot(t);if(ue(t))return me(t);if(he(t))return st(t);if(be(t))return at(t)}throw de(t)}function nt(t){return new v(function(e){var r=t[Z]();if(p(r.subscribe))return r.subscribe(e);throw new TypeError("Provided object does not correctly implement Symbol.observable")})}function it(t){return new v(function(e){for(var r=0;r<t.length&&!e.closed;r++)e.next(t[r]);e.complete()})}function ot(t){return new v(function(e){t.then(function(r){e.closed||(e.next(r),e.complete())},function(r){return e.error(r)}).then(null,oe)})}function st(t){return new v(function(e){var r,n;try{for(var i=I(t),o=i.next();!o.done;o=i.next()){var s=o.value;if(e.next(s),e.closed)return}}catch(l){r={error:l}}finally{try{o&&!o.done&&(n=i.return)&&n.call(i)}finally{if(r)throw r.error}}e.complete()})}function me(t){return new v(function(e){lt(t,e).catch(function(r){return e.error(r)})})}function at(t){return me(pe(t))}function lt(t,e){var r,n,i,o;return ke(this,void 0,void 0,function(){var s,l;return X(this,function(a){switch(a.label){case 0:a.trys.push([0,5,6,11]),r=Ae(t),a.label=1;case 1:return[4,r.next()];case 2:if(n=a.sent(),!!n.done)return[3,4];if(s=n.value,e.next(s),e.closed)return[2];a.label=3;case 3:return[3,1];case 4:return[3,11];case 5:return l=a.sent(),i={error:l},[3,11];case 6:return a.trys.push([6,,9,10]),n&&!n.done&&(o=r.return)?[4,o.call(r)]:[3,8];case 7:a.sent(),a.label=8;case 8:return[3,10];case 9:if(i)throw i.error;return[7];case 10:return[7];case 11:return e.complete(),[2]}})})}function x(t,e,r,n,i){n===void 0&&(n=0),i===void 0&&(i=!1);var o=e.schedule(function(){r(),i?t.add(this.schedule(null,n)):this.unsubscribe()},n);if(t.add(o),!i)return o}function ve(t,e){return e===void 0&&(e=0),R(function(r,n){r.subscribe(T(n,function(i){return x(n,t,function(){return n.next(i)},e)},function(){return x(n,t,function(){return n.complete()},e)},function(i){return x(n,t,function(){return n.error(i)},e)}))})}function ye(t,e){return e===void 0&&(e=0),R(function(r,n){n.add(t.schedule(function(){return r.subscribe(n)},e))})}function ct(t,e){return O(t).pipe(ye(e),ve(e))}function ut(t,e){return O(t).pipe(ye(e),ve(e))}function dt(t,e){return new v(function(r){var n=0;return e.schedule(function(){n===t.length?r.complete():(r.next(t[n++]),r.closed||this.schedule())})})}function ft(t,e){return new v(function(r){var n;return x(r,e,function(){n=t[fe](),x(r,e,function(){var i,o,s;try{i=n.next(),o=i.value,s=i.done}catch(l){r.error(l);return}s?r.complete():r.next(o)},0,!0)}),function(){return p(n==null?void 0:n.return)&&n.return()}})}function ge(t,e){if(!t)throw new Error("Iterable cannot be null");return new v(function(r){x(r,e,function(){var n=t[Symbol.asyncIterator]();x(r,e,function(){n.next().then(function(i){i.done?r.complete():r.next(i.value)})},0,!0)})})}function ht(t,e){return ge(pe(t),e)}function pt(t,e){if(t!=null){if(ce(t))return ct(t,e);if(ae(t))return dt(t,e);if(le(t))return ut(t,e);if(ue(t))return ge(t,e);if(he(t))return ft(t,e);if(be(t))return ht(t,e)}throw de(t)}function bt(t,e){return e?pt(t,e):O(t)}function B(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=tt(t);return bt(t,r)}function mt(t){return!!t&&(t instanceof v||p(t.lift)&&p(t.subscribe))}var vt=q(function(t){return function(){t(this),this.name="EmptyError",this.message="no elements in sequence"}});function yt(t,e){return new Promise(function(r,n){var i=new P({next:function(o){r(o),i.unsubscribe()},error:n,complete:function(){n(new vt)}});t.subscribe(i)})}function gt(t){return new v(function(e){O(t()).subscribe(e)})}function St(t,e,r){return gt(function(){return t()?e:r})}function wt(t,e){return R(function(r,n){var i=null,o=0,s=!1,l=function(){return s&&!i&&n.complete()};r.subscribe(T(n,function(a){i==null||i.unsubscribe();var c=0,d=o++;O(t(a,d)).subscribe(i=T(n,function(u){return n.next(e?e(a,u,d,c++):u)},function(){i=null,l()}))},function(){s=!0,l()}))})}function Et(t){return R(function(e,r){O(t).subscribe(T(r,function(){return r.complete()},V)),!r.closed&&e.subscribe(r)})}class xt{constructor(){this.className="RxJsResource"}get EMPTY(){return Ke}createObservable(){return new v}createSubject(){return new se}firstValueFrom(e){return yt(e)}iif(e,r,n){return St(e,r,n)}isObservable(e){return mt(e)}of(...e){return B(...e)}switchMap(e){return wt(e)}takeUntil(e){return Et(e)}}var _t=Object.create,H=Object.defineProperty,Ot=Object.getOwnPropertyDescriptor,Ct=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),Se=t=>{throw TypeError(t)},we=(t,e,r)=>e in t?H(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,kt=(t,e)=>H(t,"name",{value:e,configurable:!0}),At=t=>[,,,_t(null)],It=["class","method","getter","setter","accessor","field","value","get","set"],Ee=t=>t!==void 0&&typeof t!="function"?Se("Function expected"):t,Pt=(t,e,r,n,i)=>({kind:It[t],name:e,metadata:n,addInitializer:o=>r._?Se("Already initialized"):i.push(Ee(o||null))}),Tt=(t,e)=>we(e,Ct("metadata"),t[3]),Ft=(t,e,r,n)=>{for(var i=0,o=t[e>>1],s=o&&o.length;i<s;i++)o[i].call(r);return n},Rt=(t,e,r,n,i,o)=>{var s,l,a,c=e&7,d=!1,u=0,b=t[u]||(t[u]=[]),f=c&&(i=i.prototype,c<5&&(c>3||!d)&&Ot(i,r));kt(i,r);for(var S=n.length-1;S>=0;S--)a=Pt(c,r,l={},t[3],b),s=(0,n[S])(i,a),l._=1,Ee(s)&&(i=s);return Tt(t,i),f&&H(i,r,f),d?c^4?o:f:i},h=(t,e,r)=>we(t,typeof e!="symbol"?e+"":e,r),xe,J;const Gt=20;xe=[Re($e)];class j{constructor(e=Ie(Pe(Le))){this.http=e,h(this,"title","Example 31: Grid with OData Backend Service using RxJS Observables"),h(this,"subTitle","Optionally use RxJS instead of Promises, you would typically use this with a Backend Service API (OData/GraphQL)"),h(this,"aureliaGrid"),h(this,"columnDefinitions",[]),h(this,"gridOptions"),h(this,"dataset",[]),h(this,"metrics"),h(this,"paginationOptions"),h(this,"hideSubTitle",!1),h(this,"isCountEnabled",!0),h(this,"isSelectEnabled",!1),h(this,"isExpandEnabled",!1),h(this,"odataVersion",2),h(this,"odataQuery",""),h(this,"processing",!1),h(this,"errorStatus",""),h(this,"isPageErrorTest",!1),h(this,"status",{text:"",class:""}),h(this,"isOtherGenderAdded",!1),h(this,"genderCollection",[{value:"male",label:"male"},{value:"female",label:"female"}]),this.initializeGrid()}aureliaGridReady(e){this.aureliaGrid=e}initializeGrid(){this.columnDefinitions=[{id:"name",name:"Name",field:"name",sortable:!0,type:Te.string,filterable:!0,filter:{model:Q.compoundInput}},{id:"gender",name:"Gender",field:"gender",filterable:!0,editor:{model:De.singleSelect,collectionAsync:B(this.genderCollection)},filter:{model:Q.singleSelect,collectionAsync:B(this.genderCollection),collectionOptions:{addBlankEntry:!0}}},{id:"company",name:"Company",field:"company",filterable:!0,sortable:!0},{id:"category_name",name:"Category",field:"category/name",filterable:!0,sortable:!0}],this.gridOptions={enableAutoResize:!0,autoResize:{container:"#demo-container",rightPadding:10},checkboxSelector:{hideInFilterHeaderRow:!1,hideInColumnTitleRow:!0},editable:!0,autoEdit:!0,autoCommitEdit:!0,rowHeight:33,headerRowHeight:35,enableCellNavigation:!0,enableFiltering:!0,enableCheckboxSelector:!0,enableRowSelection:!0,enablePagination:!0,pagination:{pageSizes:[10,20,50,100,500],pageSize:Gt},presets:{filters:[{columnId:"gender",searchTerms:["male"],operator:Fe.equal}],sorters:[{columnId:"name",direction:"asc"}],pagination:{pageNumber:2,pageSize:20}},backendServiceApi:{service:new Ge,options:{enableCount:this.isCountEnabled,enableSelect:this.isSelectEnabled,enableExpand:this.isExpandEnabled,version:this.odataVersion},preProcess:()=>this.displaySpinner(!0),process:e=>this.getCustomerApiCall(e),postProcess:e=>{this.metrics=e.metrics,this.displaySpinner(!1),this.getCustomerCallback(e)}},externalResources:[new xt]}}addOtherGender(){const e={value:"other",label:"other"},r=this.columnDefinitions.find(n=>n.id==="gender");if(r){let n=r.editor.collection;const i=r.filter.collectionAsync;Array.isArray(n)&&(r.editor.collection=[...this.genderCollection,e],n=r.editor.collection,i!=null&&i.next&&(i.next(n),i.complete()))}this.isOtherGenderAdded=!0}displaySpinner(e){this.processing=e,this.status=e?{text:"loading...",class:"col-md-2 alert alert-warning"}:{text:"finished!!",class:"col-md-2 alert alert-success"}}getCustomerCallback(e){let r=e.totalRecordCount;this.isCountEnabled&&(r=this.odataVersion===4?e["@odata.count"]:e.d.__count),this.metrics&&(this.metrics.totalItemCount=r),this.paginationOptions={...this.gridOptions.pagination,totalItems:r},this.dataset=this.odataVersion===4?e.value:e.d.results,this.odataQuery=e.query}getCustomerApiCall(e){return this.getCustomerDataApiMock(e)}getCustomerDataApiMock(e){return new v(r=>{const n=e.toLowerCase().split("&");let i,o=0,s="",l=100;const a={};for(const c of n)if(c.includes("$top=")&&(i=+c.substring(5)),c.includes("$skip=")&&(o=+c.substring(6)),c.includes("$orderby=")&&(s=c.substring(9)),c.includes("$filter=")){const d=c.substring(8).replace("%20"," ");if(d.includes("contains")){const u=d.match(/contains\(([a-zA-Z/]+),\s?'(.*?)'/),b=u[1].trim();a[b]={type:"substring",term:u[2].trim()}}if(d.includes("substringof")){const u=d.match(/substringof\('(.*?)',\s([a-zA-Z/]+)/),b=u[2].trim();a[b]={type:"substring",term:u[1].trim()}}if(d.includes("eq")){const u=d.match(/([a-zA-Z ]*) eq '(.*?)'/);if(Array.isArray(u)){const b=u[1].trim();a[b]={type:"equal",term:u[2].trim()}}}if(d.includes("startswith")){const u=d.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/),b=u[1].trim();a[b]={type:"starts",term:u[2].trim()}}if(d.includes("endswith")){const u=d.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/),b=u[1].trim();a[b]={type:"ends",term:u[2].trim()}}}this.http.fetch(ze).then(c=>c.json()).then(c=>{if((s==null?void 0:s.length)>0){const f=s.split(",");for(const S of f){const m=S.split(" "),_=m[0];let w=y=>y;for(const y of _.split("/")){const g=w;w=_e=>g(_e)[y]}switch((m[1]??"asc").toLocaleLowerCase()){case"asc":c=c.sort((y,g)=>w(y).localeCompare(w(g)));break;case"desc":c=c.sort((y,g)=>w(g).localeCompare(w(y)));break}}}let d=o,u=c;if(a){for(const f in a)a.hasOwnProperty(f)&&(u=u.filter(S=>{const m=a[f].type,_=a[f].term;let w=f;if(f&&f.indexOf(" ")!==-1){const g=f.split(" ");w=g[g.length-1]}let E,y=S;for(const g of w.split("/"))E=y[g],y=E;if(E)switch(m){case"equal":return E.toLowerCase()===_;case"ends":return E.toLowerCase().endsWith(_);case"starts":return E.toLowerCase().startsWith(_);case"substring":return E.toLowerCase().includes(_)}}));l=u.length}d>u.length&&(e=e.replace(`$skip=${d}`,""),d=0);const b=u.slice(d,d+i);window.setTimeout(()=>{const f={query:e};this.isCountEnabled||(f.totalRecordCount=l),this.odataVersion===4?(f.value=b,this.isCountEnabled&&(f["@odata.count"]=l)):(f.d={results:b},this.isCountEnabled&&(f.d.__count=l)),r.next(f),r.complete()},150)})})}clearAllFiltersAndSorts(){var e;(e=this.aureliaGrid)==null||e.gridService.clearAllFiltersAndSorts()}goToFirstPage(){var e,r;(r=(e=this.aureliaGrid)==null?void 0:e.paginationService)==null||r.goToFirstPage()}goToLastPage(){var e,r;(r=(e=this.aureliaGrid)==null?void 0:e.paginationService)==null||r.goToLastPage()}gridStateChanged(e){console.log("Client sample, Grid State changed:: ",e.change)}setFiltersDynamically(){var e;(e=this.aureliaGrid)==null||e.filterService.updateFilters([{columnId:"name",searchTerms:["A"],operator:"a*"}])}setSortingDynamically(){var e;(e=this.aureliaGrid)==null||e.sortService.updateSorting([{columnId:"name",direction:"DESC"}])}handleOnBeforeSort(e){return!0}handleOnBeforeSearchChange(e){return!0}handleOnBeforePaginationChange(e){return!0}changeCountEnableFlag(){return this.displaySpinner(!0),this.isCountEnabled=!this.isCountEnabled,this.resetOptions({enableCount:this.isCountEnabled}),!0}changeEnableSelectFlag(){return this.isSelectEnabled=!this.isSelectEnabled,this.resetOptions({enableSelect:this.isSelectEnabled}),!0}changeEnableExpandFlag(){return this.isExpandEnabled=!this.isExpandEnabled,this.resetOptions({enableExpand:this.isExpandEnabled}),!0}setOdataVersion(e){return this.displaySpinner(!0),this.odataVersion=e,this.resetOptions({version:this.odataVersion}),!0}toggleSubTitle(){var r;this.hideSubTitle=!this.hideSubTitle;const e=this.hideSubTitle?"add":"remove";(r=document.querySelector(".subtitle"))==null||r.classList[e]("hidden"),this.aureliaGrid.resizerService.resizeGrid(0)}resetOptions(e){var n;this.displaySpinner(!0);const r=this.gridOptions.backendServiceApi.service;r.updateOptions(e),r.clearFilters(),(n=this.aureliaGrid)==null||n.filterService.clearFilters()}}J=At();j=Rt(J,0,"Example31",xe,j);Ft(J,1,j);export{j as Example31};
//# sourceMappingURL=example31-DXY0Sq3q.js.map
