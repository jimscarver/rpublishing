import{http as r,utils as t}from"rchain-toolkit";import{inflate as e}from"pako";import{toString as i}from"uint8arrays";import{ec as o}from"elliptic";const{readBagOrTokenDataTerm:n,read:a}=require("rchain-token-files"),s=new o("secp256k1");function c(){const r=new Map;return async(t,e)=>{if(t.params&&"true"===t.params["no-cache"])return await e();const i=r.get(t.did);if(void 0!==i)return i;const o=await e();return null!==o&&r.set(t.did,o),o}}function l(r,t){return t()}const u=new RegExp("^did:([a-zA-Z0-9_]+):([a-zA-Z0-9_.-]+(:[a-zA-Z0-9_.-]+)*)((;[a-zA-Z0-9_.:%-]+=[a-zA-Z0-9_.:%-]*)*)(/[^#?]*)?([?][^#]*)?(#.*)?$");function p(r){if(""===r||!r)throw new Error("Missing DID");const t=r.match(u);if(t){const e={did:`did:${t[1]}:${t[2]}`,method:t[1],id:t[2],didUrl:r};if(t[4]){const r=t[4].slice(1).split(";");e.params={};for(const t of r){const r=t.split("=");e.params[r[0]]=r[1]}}return t[6]&&(e.path=t[6]),t[7]&&(e.query=t[7].slice(1)),t[8]&&(e.fragment=t[8].slice(1)),e}throw new Error(`Invalid DID ${r}`)}class d{constructor(r={},t){this.registry=r,this.cache=!0===t?c():t||l}async resolve(r){const t=p(r),e=this.registry[t.method];if(e){const r=await this.cache(t,()=>e(t.did,t,this));if(null==r)throw new Error(`resolver returned null for ${t.did}`);return r}throw new Error(`Unsupported DID method: '${t.method}'`)}}function f(r){const t=s.keyFromPublic(r,"hex").getPublic(!0,"array"),e=new Uint8Array(t.length+2);return e[0]=231,e[1]=1,e.set(t,2),`did:key:z${i(e,"base58btc")}`}function h(){return{rchain:async function(i,o,s){let c;var l;c=o.path&&""!==o.path?n(o.id,"bags",null==(l=o.path)?void 0:l.substring(1)):a(o.id);const u=await r.exploreDeploy("http://localhost:40403",{term:c});if(o.path&&""!==o.path){let r={};try{const i=Buffer.from(decodeURI(t.rhoValToJs(JSON.parse(u).expr[0])),"base64"),o=Buffer.from(e(i)).toString("utf-8");r=JSON.parse(o)}finally{}return r}{const r=t.rhoValToJs(JSON.parse(u).expr[0]),e=f(r.publicKey),i=e.substr(8),o=e+"#"+i;return{id:e,publicKey:[{id:o,type:"Secp256k1VerificationKey2018",controller:o,publicKeyHex:r.publicKey}]}}}}}export{d as Resolver,f as encodeDIDFromPubKey,h as getResolver,c as inMemoryCache,l as noCache,p as parse};
//# sourceMappingURL=rchain-did-resolver.modern.js.map
