var ee=Object.defineProperty,te=Object.defineProperties;var re=Object.getOwnPropertyDescriptors;var A=Object.getOwnPropertySymbols;var se=Object.prototype.hasOwnProperty,ne=Object.prototype.propertyIsEnumerable;var k=(t,e,r)=>e in t?ee(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,v=(t,e)=>{for(var r in e||(e={}))se.call(e,r)&&k(t,r,e[r]);if(A)for(var r of A(e))ne.call(e,r)&&k(t,r,e[r]);return t},L=(t,e)=>te(t,re(e));var u=(t,e,r)=>(k(t,typeof e!="symbol"?e+"":e,r),r);import{t as C,i as oe,a as N,h as ie,r as T,K as ae,c as ue,n as le,b as w,g as B,o as ce,e as de,d as b,f as g,j as h,k as $,w as M,v as fe,F as S,l as y,m as pe,p as he,q as _,s as F,u as me,x as ye,y as ge}from"./vendor.6ef24320.js";const ve=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerpolicy&&(o.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?o.credentials="include":s.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}};ve();const l={rpcProvider(){throw new Error("must install with rpcProvider before query or call")}},O=new Map;function _e(t,e){const r=new q;t.provide(q.key,r),Object.assign(l,e),t.mixin({created(){if(l.dehydrate||l.hydrate){const o=this.$.render;this.$.render=function(...i){let a=o.apply(this,i);const d={},f={};for(const[c,p]of Object.entries(C(this.$.data)))oe(p)&&p.value&&p.value.data&&((p.value.stale?f:d)[c]=p.value.data);return Object.keys(f).length===0&&Object.keys(d).length===0||((!N(a)||typeof a.type!="string")&&(a=ie(l.wrapperComponent||"div",a)),l.hydrate)||(a.props||(a.props={}),a.props["data-dehydrated"]=JSON.stringify(d),a.props["data-stale"]=JSON.stringify(f)),a}}const n=this.$.type;let s=n.instanceCount;s||(s=n.instanceCount=T(0)),s.value++},beforeMount(){var i,a,d,f;if(!l.hydrate)return;const n=C(this.$.data),s=JSON.parse(((a=(i=this.$el)==null?void 0:i.dataset)==null?void 0:a.dehydrated)||"{}"),o=JSON.parse(((f=(d=this.$el)==null?void 0:d.dataset)==null?void 0:f.stale)||"{}");for(const c of Object.keys(o))n[c].value._query&&n[c].value._query.refresh();for(const[c,p]of Object.entries(v(v({},s),o)))n[c].__query_ref__?n[c].__query_ref__.value={loading:!1,data:[p]}:n[c].value={loading:!1,data:p}},async serverPrefetch(){await r.flushing},unmounted(){this.$.type.instanceCount.value--}})}function be(t){return V(t.$).proxy}function V(t){return!t.parent||t.parent.type===ae?t:V(t.parent)}function I(t,e){if(t instanceof m){const r=U(t,e),n=ue(()=>{const s=r.value;return{loading:s.loading,data:s.data[0],error:s.error}});return n.__query_ref__=r,n}return J(t,e)[0]}function J(t,e){if(t instanceof m)return U(t,e);const r=t;r.instanceCount||(r.instanceCount=T(0)),r.instanceCount.value;const n=[];let s;if(e.$parent)s=e.$parent.$.subTree;else if(e.$root)s=e.$root.$.subTree,delete e.$root;else throw new Error("must provide $parent or $root");return j(n,s,r,e),n}function j(t,e,r,n){if(!!e){if(e.component)e.type===r&&we(e.component.proxy,n)&&t.push(e.component.proxy),j(t,e.component.subTree,r,n);else if(Array.isArray(e.children))for(const s of e.children)N(s)&&j(t,s,r,n)}}function we(t,e){if(!e)return!0;for(const[r,n]of Object.entries(e))if(r==="$parent"){if(t.$.parent.proxy!==n)return!1}else if(t[r]!==n)return!1;return!0}function D(t,e,...r){const n=t.$;K(!0,e,r,n)}function Q(t,e,r){if(r.component)K(!1,t,e,r.component);else if(Array.isArray(r.children))for(const n of r.children)N(n)&&Q(t,e,n)}function K(t,e,r,n){const s=n.proxy;!t&&s[e]?s[e].apply(s,r):Q(e,r,n.subTree)}function H(){return new Promise(t=>le(t))}async function x(t){return new Promise(e=>setTimeout(e,t))}function $e(t,e){if(e instanceof m)return t;if(t.$.type!==e)throw new Error("type mismatch");return t}function qe(t,e){return w(new m(t,e))}class m{constructor(e,r){u(this,"pickedFields");u(this,"subResources",{});this.table=e,this.options=r}clone(){const e=new m(this.table,this.options);return e.pickedFields=this.pickedFields,e.subResources=v({},this.subResources),e}pick(...e){const r=this.clone();return r.pickedFields=e,w(r)}load(e,r,n,s){const o=this.clone();return o.subResources[e]={single:!0,resource:r,dynamicCriteria:n,staticCriteria:s==null?void 0:s.staticCriteria},w(o)}query(e,r,n,s){const o=this.clone();return o.subResources[e]={resource:r,dynamicCriteria:n,staticCriteria:s==null?void 0:s.staticCriteria},w(o)}toJSON(){var e;return{table:this.table,staticCriteria:(e=this.options)==null?void 0:e.staticCriteria,subResources:Object.keys(this.subResources).length===0?void 0:this.subResources}}}function U(t,e){const r=new Re(C(t),e);return B().scope.run(()=>{const n=z(t);n.forEach(s=>P(s).add(r)),ce(()=>{n.forEach(s=>P(s).delete(r))})}),r.result}function P(t){let e=O.get(t);return e||O.set(t,e=new Set),e}function z(t){var r;let e=((r=t.options)==null?void 0:r.sourceTables)?[t.table,...t.options.sourceTables]:[t.table];for(const n of Object.values(t.subResources))e=[...e,...z(n.resource)];return e}class q{constructor(){u(this,"buffered",[]);u(this,"flushing")}execute(e){this.buffered.push(e),this.buffered.length===1&&(this.flushing=this.flush())}async flush(){await H();const e=this.buffered;this.buffered=[],await l.rpcProvider(e),this.flushing=void 0}}u(q,"key",Symbol());class Re{constructor(e,r){u(this,"result",T({loading:!1,data:[],error:void 0,_query:this}));u(this,"criteria",{});u(this,"version",0);u(this,"queryBuffer");this.resource=e;const n=B();if(this.queryBuffer=n.appContext.provides[q.key],!this.queryBuffer)throw new Error("please add app.use(vdb) to install vue-db before query");de(()=>{r&&(this.criteria=r()),l.hydrate&&!n.isMounted||this.queryBuffer.execute(this.newRequest(!n.isMounted))})}newRequest(e){return this.version++,new G(this,!!e)}refresh(){this.queryBuffer.execute(this.newRequest())}}class G{constructor(e,r){u(this,"baseVersion");u(this,"criteria");u(this,"showingLoading");this.query=e,this.showLoading=r,this.baseVersion=e.version,this.criteria=e.criteria,r&&!l.dehydrate&&(l.loadingPreDelay?x(l.loadingPreDelay||0).then(()=>{this.showingLoading=this.loadingCountdown()}):this.showingLoading=this.loadingCountdown())}async loadingCountdown(){this.isExpired||(this.query.result.value={loading:!0,data:[],error:void 0},await x(l.loadingPostDelay||0))}get resource(){return this.query.resource}get isExpired(){return this.baseVersion!==this.query.version}resolve(e,r){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.resolve(e,r)});return}this.query.version++,this.query.result.value={loading:!1,data:e,error:void 0,stale:r}}}reject(e){if(!this.isExpired){if(this.showingLoading){this.showingLoading.then(()=>{this.showingLoading=void 0,this.reject(e)});return}this.query.version++,this.query.result.value={loading:!1,data:[],error:e}}}toJSON(){return{resource:this.resource,criteria:this.criteria}}}function W(t){let e=this&&this.Resource!==m?this:void 0;return{as(r){const n=s=>{const o=[];for(const d of t.affectedTables){const f=O.get(d);for(const c of f||[])o.push(c.newRequest())}const i=t.command||r,a=new X(i,s);return l.rpcProvider(o,a),a.promise};return L(v({},e),{[r]:n,defineCommand:W})}}}class X{constructor(e,r){u(this,"promise");u(this,"resolve");u(this,"reject");u(this,"responded",!1);this.command=e,this.args=r,this.promise=new Promise((n,s)=>{this.resolve=o=>{this.responded||(this.responded=!0,n(o))},this.reject=o=>{this.responded||(this.responded=!0,s(o))}})}toJSON(){return{command:this.command,args:this.args}}}var ke=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",install:_e,pageOf:be,load:I,query:J,walk:D,waitNextTick:H,sleep:x,castTo:$e,defineResource:qe,Resource:m,QueryRequest:G,defineCommand:W,CommandRequest:X});function Y(t){const e={};return D(t,"fillForm",e),e}var R=(t,e)=>{const r=t.__vccOpts||t;for(const[n,s]of e)r[n]=s;return r};const Ce=b({props:{label:{default:""},name:{type:String,required:!0}},data(){return{value:""}},methods:{fillForm(t){t[this.name]=this.value}}}),Se=["name"];function Fe(t,e,r,n,s,o){return y(),g(S,null,[h("label",null,$(t.label),1),M(h("input",{type:"textbox",name:t.name,"onUpdate:modelValue":e[0]||(e[0]=i=>t.value=i)},null,8,Se),[[fe,t.value]])],64)}var Oe=R(Ce,[["render",Fe]]);const je=b({props:{label:{default:""},name:{required:!0,type:String},options:{default:[]}},data(){return{selected:""}},methods:{fillForm(t){t[this.name]=this.selected}}}),xe=h("option",{value:""},"Please select...",-1),Ne=["value"];function Te(t,e,r,n,s,o){return y(),g(S,null,[h("label",null,$(t.label),1),M(h("select",{"onUpdate:modelValue":e[0]||(e[0]=i=>t.selected=i)},[xe,(y(!0),g(S,null,he(t.options,i=>(y(),g("option",{value:i.id},$(i.name),9,Ne))),256))],512),[[pe,t.selected]])],64)}var E=R(je,[["render",Te]]);const Ae=b({components:{SelectField:E,InputField:Oe},props:{name:{required:!0,type:String},legend:{default:"Address"}},data(){return{provinces:[{id:"jiangxi",name:"jiangxi"},{id:"hubei",name:"hubei"}]}},computed:{cities(){var r;const t=(r=I(E,{$parent:this,name:"province"}))==null?void 0:r.selected;return{jiangxi:[{id:"nanchang",name:"nanchange"},{id:"jiujiang",name:"jiujiang"}],hubei:[{id:"wuhan",name:"wuhan"},{id:"huangshi",name:"huangshi"}]}[t]||[]}},methods:{fillForm(t){t[this.name]=Y(this)}}}),Le={class:"fields"};function Pe(t,e,r,n,s,o){const i=F("SelectField"),a=F("InputField");return y(),g("fieldset",null,[h("legend",null,$(t.legend),1),h("div",Le,[_(i,{label:"province:",name:"province",options:t.provinces},null,8,["options"]),_(i,{label:"city:",name:"city",options:t.cities},null,8,["options"]),_(a,{label:"street:",name:"street"})])])}var Ee=R(Ae,[["render",Pe],["__scopeId","data-v-29a4da50"]]);const Be=b({components:{AddressForm:Ee},methods:{onSend(){console.log("send",Y(this))}}});function Me(t,e,r,n,s,o){const i=F("AddressForm");return y(),g("form",null,[_(i,{name:"fromAddr",legend:"Send From"}),_(i,{name:"toAddr",legend:"Send To"}),h("button",{type:"submit",onClick:e[0]||(e[0]=me((...a)=>t.onSend&&t.onSend(...a),["prevent"]))},"Send")])}var Ve=R(Be,[["render",Me],["__scopeId","data-v-22008459"]]);const Ie=b({setup(t){return(e,r)=>(y(),ye(Ve))}}),Z=ge(Ie);Z.use(ke);Z.mount("#app");