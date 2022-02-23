var Q=Object.defineProperty,z=Object.defineProperties;var H=Object.getOwnPropertyDescriptors;var O=Object.getOwnPropertySymbols;var I=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable;var w=(r,e,t)=>e in r?Q(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,h=(r,e)=>{for(var t in e||(e={}))I.call(e,t)&&w(r,t,e[t]);if(O)for(var t of O(e))G.call(e,t)&&w(r,t,e[t]);return r},_=(r,e)=>z(r,H(e));var a=(r,e,t)=>(w(r,typeof e!="symbol"?e+"":e,t),t);import{i as $,h as U,t as q,a as W,r as v,g as C,e as j,K as X,c as Y,n as Z,b as g,o as ee,d as N,f as S,j as L,k as te,l as re,m as se,w as ne,p as x,F as ie,q as oe,s as ae}from"./vendor.0058b349.js";const ue=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerpolicy&&(i.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?i.credentials="include":n.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}};ue();const u={rpcProvider(){throw new Error("must install with rpcProvider before query or call")}},k=new Map;function ce(r,e){y.provide(r),Object.assign(u,e),r.mixin({created(){if(u.dehydrate||u.hydrate){const n=this.$.render;this.$.render=function(...i){let o=n.apply(this,i);if((!$(o)||typeof o.type!="string")&&(o=U("div",o)),u.hydrate)return o;o.props||(o.props={});const c={},d={};for(const[b,f]of Object.entries(q(this.$.data)))W(f)&&f.value&&f.value.data&&((f.value.stale?d:c)[b]=f.value.data);return o.props["data-dehydrated"]=JSON.stringify(c),o.props["data-stale"]=JSON.stringify(d),o}}const t=this.$.type;let s=t.instanceCount;s||(s=t.instanceCount=v(0)),s.value++},beforeMount(){var i,o;if(!u.hydrate)return;const t=q(this.$.data),s=JSON.parse(((i=this.$el.dataset)==null?void 0:i.dehydrated)||"{}"),n=JSON.parse(((o=this.$el.dataset)==null?void 0:o.stale)||"{}");for(const c of Object.keys(n))t[c].value._query&&t[c].value._query.refresh();for(const[c,d]of Object.entries(h(h({},s),n)))t[c].value={loading:!1,data:d}},async serverPrefetch(){await y.inject().flushing}})}function P(r,e){j(()=>{const t=e();for(const[s,n]of Object.entries(t))if(typeof n=="object")for(const[i,o]of Object.entries(n))r[s][i]=o;else r[s]=n})}function le(r){return T(r.$).proxy}function T(r){return!r.parent||r.parent.type===X?r:T(r.parent)}function fe(r,e){if(r instanceof l){const t=J(r,e);return Y(()=>{const s=t.value;return{loading:s.loading,data:s.data[0],error:s.error}})}return A(r,e)[0]}function A(r,e){if(r instanceof l)return J(r,e);const t=r;t.instanceCount||(t.instanceCount=v(0)),t.instanceCount.value;const s=[];let n;if(e.$parent)n=e.$parent.$.subTree;else if(e.$root)n=e.$root.$.subTree,delete e.$root;else throw new Error("must provide $parent or $root");return R(s,n,t,e),s}function R(r,e,t,s){if(!!e){if(e.component)e.type===t&&de(e.component.proxy,s)&&r.push(e.component.proxy),R(r,e.component.subTree,t,s);else if(Array.isArray(e.children))for(const n of e.children)$(n)&&R(r,n,t,s)}}function de(r,e){if(!e)return!0;for(const[t,s]of Object.entries(e))if(t==="$parent"){if(r.$.parent.proxy!==s)return!1}else if(r[t]!==s)return!1;return!0}function he(r,e,...t){const s=r.$;F(!0,e,t,s)}function E(r,e,t){if(t.component)F(!1,r,e,t.component);else if(Array.isArray(t.children))for(const s of t.children)$(s)&&E(r,e,s)}function F(r,e,t,s){const n=s.proxy;!r&&n[e]?n[e].apply(n,t):E(e,t,s.subTree)}function V(){return new Promise(r=>{Z(r)})}async function m(r){return new Promise(e=>setTimeout(e,r))}function pe(r,e){if(e instanceof l)return r;if(r.$.type!==e)throw new Error("type mismatch");return r}function D(r){let e=this&&this.Resource!==l?this:void 0;return{as(t){const s=n=>{const i=[];for(const d of r.affectedTables){const b=k.get(d);for(const f of b||[])i.push(f.newRequest())}const o=r.command||t,c=new M(o,n);return u.rpcProvider(i,c),c.promise};return _(h({},e),{[t]:s,defineCommand:D})}}}function ye(r,e){return g(new l(r,e))}const p=class{constructor(){a(this,"buffered",[]);a(this,"flushing")}static provide(e){e.provide(p.key,new p)}static inject(){return C().appContext.provides[p.key]}execute(e){this.buffered.push(e),this.buffered.length===1&&(this.flushing=this.flush())}async flush(){await V();const e=this.buffered;this.buffered=[],await u.rpcProvider(e),this.flushing=void 0}};let y=p;a(y,"key",Symbol());class ge{constructor(e,t){a(this,"result",v({loading:!1,data:[],error:void 0,_query:this}));a(this,"criteria",{});a(this,"version",0);a(this,"queryBuffer");this.resource=e,this.queryBuffer=y.inject();const s=C();j(()=>{t&&(this.criteria=t()),u.hydrate&&!s.isMounted||this.queryBuffer.execute(this.newRequest(!s.isMounted))})}newRequest(e){return this.version++,new B(this,!!e)}refresh(){this.queryBuffer.execute(this.newRequest())}}class l{constructor(e,t){a(this,"pickedFields");a(this,"subResources",{});this.table=e,this.options=t}clone(){const e=new l(this.table,this.options);return e.pickedFields=this.pickedFields,e.subResources=h({},this.subResources),e}pick(...e){const t=this.clone();return t.pickedFields=e,g(t)}load(e,t,s,n){const i=this.clone();return i.subResources[e]={single:!0,resource:t,dynamicCriteria:s,staticCriteria:n==null?void 0:n.staticCriteria},g(i)}query(e,t,s,n){const i=this.clone();return i.subResources[e]={resource:t,dynamicCriteria:s,staticCriteria:n==null?void 0:n.staticCriteria},g(i)}toJSON(){var e;return{table:this.table,staticCriteria:(e=this.options)==null?void 0:e.staticCriteria,subResources:Object.keys(this.subResources).length===0?void 0:this.subResources}}}function J(r,e){const t=new ge(q(r),e);return C().scope.run(()=>{let s=k.get(r.table);s||k.set(r.table,s=new Set),s.add(t),ee(()=>{s.delete(t)})}),t.result}class B{constructor(e,t){a(this,"baseVersion");a(this,"criteria");a(this,"showingLoading");this.query=e,this.showLoading=t,this.baseVersion=e.version,this.criteria=e.criteria,t&&!u.dehydrate&&(u.loadingPreDelay?m(u.loadingPreDelay||0).then(()=>{this.showingLoading=this.loadingCountdown()}):this.showingLoading=this.loadingCountdown())}async loadingCountdown(){this.isExpired||(this.query.result.value={loading:!0,data:[],error:void 0},await m(u.loadingPostDelay||0))}get resource(){return this.query.resource}get isExpired(){return this.baseVersion!==this.query.version}resolve(e,t){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.resolve(e,t)});return}this.query.version++,this.query.result.value={loading:!1,data:e,error:void 0,stale:t}}}reject(e){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.reject(e)});return}this.query.version++,this.query.result.value={loading:!1,data:[],error:e}}}toJSON(){return{resource:this.resource,criteria:this.criteria}}}class M{constructor(e,t){a(this,"promise");a(this,"resolve");a(this,"reject");a(this,"responded",!1);this.command=e,this.args=t,this.promise=new Promise((s,n)=>{this.resolve=i=>{this.responded||(this.responded=!0,s(i))},this.reject=i=>{this.responded||(this.responded=!0,n(i))}})}toJSON(){return{command:this.command,args:this.args}}}var me=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",install:ce,animate:P,pageOf:le,load:fe,query:A,walk:he,waitNextTick:V,sleep:m,castTo:pe,defineCommand:D,defineResource:ye,Resource:l,QueryRequest:B,CommandRequest:M}),ve=(r,e)=>{const t=r.__vccOpts||r;for(const[s,n]of e)t[s]=n;return t};const be=N({props:["color"],data(){return{left:0}},mounted(){P(this.$refs.myDiv,()=>({style:{left:`${this.left}px`}})),(async()=>{for(;;)await m(500),this.left+=20})()}});function we(r,e,t,s,n,i){return S(),L("div",{style:re({position:"absolute",backgroundColor:r.color}),ref:"myDiv"},[te(r.$slots,"default")],4)}var qe=ve(be,[["render",we]]);const ke=oe("O_O"),Re=N({setup(r){const e=v("red");return(t,s)=>(S(),L(ie,null,[se(qe,{color:e.value},{default:ne(()=>[ke]),_:1},8,["color"]),x("button",{onClick:s[0]||(s[0]=n=>e.value="red")},"red"),x("button",{onClick:s[1]||(s[1]=n=>e.value="green")},"green")],64))}}),K=ae(Re);K.use(me);K.mount("#app");