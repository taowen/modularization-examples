var G=Object.defineProperty,W=Object.defineProperties;var X=Object.getOwnPropertyDescriptors;var j=Object.getOwnPropertySymbols;var Y=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var g=(t,e,r)=>e in t?G(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,p=(t,e)=>{for(var r in e||(e={}))Y.call(e,r)&&g(t,r,e[r]);if(j)for(var r of j(e))Z.call(e,r)&&g(t,r,e[r]);return t},T=(t,e)=>W(t,X(e));var u=(t,e,r)=>(g(t,typeof e!="symbol"?e+"":e,r),r);import{i as O,h as ee,t as _,a as te,r as N,e as L,K as re,c as se,n as ne,b as y,g as P,o as oe,d as S,f as I,j as m,k as q,w as ie,v as ae,l as F,m as ue,p as x,q as ce,s as le,u as de,x as fe}from"./vendor.3e4ef62c.js";const he=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerpolicy&&(o.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?o.credentials="include":s.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}};he();const c={rpcProvider(){throw new Error("must install with rpcProvider before query or call")}},$=new Map;function pe(t,e){const r=new b;t.provide(b.key,r),Object.assign(c,e),t.mixin({created(){if(c.dehydrate||c.hydrate){const o=this.$.render;this.$.render=function(...a){let i=o.apply(this,a);if((!O(i)||typeof i.type!="string")&&(i=ee("div",i)),c.hydrate)return i;i.props||(i.props={});const l={},f={};for(const[v,h]of Object.entries(_(this.$.data)))te(h)&&h.value&&h.value.data&&((h.value.stale?f:l)[v]=h.value.data);return i.props["data-dehydrated"]=JSON.stringify(l),i.props["data-stale"]=JSON.stringify(f),i}}const n=this.$.type;let s=n.instanceCount;s||(s=n.instanceCount=N(0)),s.value++},beforeMount(){var a,i;if(!c.hydrate)return;const n=_(this.$.data),s=JSON.parse(((a=this.$el.dataset)==null?void 0:a.dehydrated)||"{}"),o=JSON.parse(((i=this.$el.dataset)==null?void 0:i.stale)||"{}");for(const l of Object.keys(o))n[l].value._query&&n[l].value._query.refresh();for(const[l,f]of Object.entries(p(p({},s),o)))n[l].value={loading:!1,data:f}},unmounted(){this.$.type.instanceCount.value--},async serverPrefetch(){await r.flushing}})}function ye(t,e){L(()=>{const r=e();for(const[n,s]of Object.entries(r))if(typeof s=="object")for(const[o,a]of Object.entries(s))t[n][o]=a;else t[n]=s})}function me(t){return B(t.$).proxy}function B(t){return!t.parent||t.parent.type===re?t:B(t.parent)}function k(t,e){if(t instanceof d){const r=Q(t,e);return se(()=>{const n=r.value;return{loading:n.loading,data:n.data[0],error:n.error}})}return E(t,e)[0]}function E(t,e){if(t instanceof d)return Q(t,e);const r=t;r.instanceCount||(r.instanceCount=N(0)),r.instanceCount.value;const n=[];let s;if(e.$parent)s=e.$parent.$.subTree;else if(e.$root)s=e.$root.$.subTree,delete e.$root;else throw new Error("must provide $parent or $root");return R(n,s,r,e),n}function R(t,e,r,n){if(!!e){if(e.component)e.type===r&&be(e.component.proxy,n)&&t.push(e.component.proxy),R(t,e.component.subTree,r,n);else if(Array.isArray(e.children))for(const s of e.children)O(s)&&R(t,s,r,n)}}function be(t,e){if(!e)return!0;for(const[r,n]of Object.entries(e))if(r==="$parent"){if(t.$.parent.proxy!==n)return!1}else if(t[r]!==n)return!1;return!0}function V(t,e,...r){const n=t.$;M(!0,e,r,n)}function A(t,e,r){if(r.component)M(!1,t,e,r.component);else if(Array.isArray(r.children))for(const n of r.children)O(n)&&A(t,e,n)}function M(t,e,r,n){const s=n.proxy;!t&&s[e]?s[e].apply(s,r):A(e,r,n.subTree)}function D(){return new Promise(t=>{ne(t)})}async function C(t){return new Promise(e=>setTimeout(e,t))}function ve(t,e){if(e instanceof d)return t;if(t.$.type!==e)throw new Error("type mismatch");return t}function J(t){let e=this&&this.Resource!==d?this:void 0;return{as(r){const n=s=>{const o=[];for(const l of t.affectedTables){const f=$.get(l);for(const v of f||[])o.push(v.newRequest())}const a=t.command||r,i=new K(a,s);return c.rpcProvider(o,i),i.promise};return T(p({},e),{[r]:n,defineCommand:J})}}}function ge(t,e){return y(new d(t,e))}class b{constructor(){u(this,"buffered",[]);u(this,"flushing")}execute(e){this.buffered.push(e),this.buffered.length===1&&(this.flushing=this.flush())}async flush(){await D();const e=this.buffered;this.buffered=[],await c.rpcProvider(e),this.flushing=void 0}}u(b,"key",Symbol());class we{constructor(e,r){u(this,"result",N({loading:!1,data:[],error:void 0,_query:this}));u(this,"criteria",{});u(this,"version",0);u(this,"queryBuffer");this.resource=e;const n=P();this.queryBuffer=n.appContext.provides[b.key],L(()=>{r&&(this.criteria=r()),c.hydrate&&!n.isMounted||this.queryBuffer.execute(this.newRequest(!n.isMounted))})}newRequest(e){return this.version++,new H(this,!!e)}refresh(){this.queryBuffer.execute(this.newRequest())}}class d{constructor(e,r){u(this,"pickedFields");u(this,"subResources",{});this.table=e,this.options=r}clone(){const e=new d(this.table,this.options);return e.pickedFields=this.pickedFields,e.subResources=p({},this.subResources),e}pick(...e){const r=this.clone();return r.pickedFields=e,y(r)}load(e,r,n,s){const o=this.clone();return o.subResources[e]={single:!0,resource:r,dynamicCriteria:n,staticCriteria:s==null?void 0:s.staticCriteria},y(o)}query(e,r,n,s){const o=this.clone();return o.subResources[e]={resource:r,dynamicCriteria:n,staticCriteria:s==null?void 0:s.staticCriteria},y(o)}toJSON(){var e;return{table:this.table,staticCriteria:(e=this.options)==null?void 0:e.staticCriteria,subResources:Object.keys(this.subResources).length===0?void 0:this.subResources}}}function Q(t,e){const r=new we(_(t),e);return P().scope.run(()=>{var n;for(const s of((n=t.options)==null?void 0:n.sourceTables)?[t.table,...t.options.sourceTables]:[t.table]){let o=$.get(s);o||$.set(t.table,o=new Set),o.add(r),oe(()=>{o.delete(r)})}}),r.result}class H{constructor(e,r){u(this,"baseVersion");u(this,"criteria");u(this,"showingLoading");this.query=e,this.showLoading=r,this.baseVersion=e.version,this.criteria=e.criteria,r&&!c.dehydrate&&(c.loadingPreDelay?C(c.loadingPreDelay||0).then(()=>{this.showingLoading=this.loadingCountdown()}):this.showingLoading=this.loadingCountdown())}async loadingCountdown(){this.isExpired||(this.query.result.value={loading:!0,data:[],error:void 0},await C(c.loadingPostDelay||0))}get resource(){return this.query.resource}get isExpired(){return this.baseVersion!==this.query.version}resolve(e,r){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.resolve(e,r)});return}this.query.version++,this.query.result.value={loading:!1,data:e,error:void 0,stale:r}}}reject(e){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.reject(e)});return}this.query.version++,this.query.result.value={loading:!1,data:[],error:e}}}toJSON(){return{resource:this.resource,criteria:this.criteria}}}class K{constructor(e,r){u(this,"promise");u(this,"resolve");u(this,"reject");u(this,"responded",!1);this.command=e,this.args=r,this.promise=new Promise((n,s)=>{this.resolve=o=>{this.responded||(this.responded=!0,n(o))},this.reject=o=>{this.responded||(this.responded=!0,s(o))}})}toJSON(){return{command:this.command,args:this.args}}}var _e=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",install:pe,animate:ye,pageOf:me,load:k,query:E,walk:V,waitNextTick:D,sleep:C,castTo:ve,defineCommand:J,defineResource:ge,Resource:d,QueryRequest:H,CommandRequest:K});var U=(t,e)=>{const r=t.__vccOpts||t;for(const[n,s]of e)r[n]=s;return r};let qe=1;const $e=S({props:{name:{required:!0,type:String},label:{default:""},type:{default:"text"}},data(){return{inputId:`input${qe++}`,value:""}},methods:{fillForm(t){t[this.name]=this.value}}}),ke={class:"row"},Re=["for"],Ce=["id","type","name"];function Oe(t,e,r,n,s,o){return F(),I("div",ke,[m("label",{for:t.inputId},q(t.label),9,Re),ie(m("input",{id:t.inputId,"onUpdate:modelValue":e[0]||(e[0]=a=>t.value=a),type:t.type,name:t.name},null,8,Ce),[[ae,t.value]])])}var w=U($e,[["render",Oe],["__scopeId","data-v-20bc85b6"]]);const Ne=S({components:{InputField:w},computed:{username(){var t;return(t=k(w,{$parent:this,name:"username"}))==null?void 0:t.value},hobby(){var t;return(t=k(w,{$parent:this,name:"hobby"}))==null?void 0:t.value}},methods:{onSubmit(){const t={};V(this,"fillForm",t),console.log("!!! submit",t)}}});function Se(t,e,r,n,s,o){const a=ue("InputField");return F(),I("form",null,[m("fieldset",null,[x(a,{label:"User Name:",name:"username"}),x(a,{label:"Hobby:",name:"hobby"}),m("button",{type:"submit",onClick:e[0]||(e[0]=ce((...i)=>t.onSubmit&&t.onSubmit(...i),["prevent"]))},"submit"),le(" hello "+q(t.username||"[username]")+", who likes "+q(t.hobby||"[hobby]"),1)])])}var Fe=U(Ne,[["render",Se],["__scopeId","data-v-554f00a0"]]);const je=S({setup(t){return(e,r)=>(F(),de(Fe))}}),z=fe(je);z.use(_e);z.mount("#app");
