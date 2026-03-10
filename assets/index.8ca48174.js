var h=Object.defineProperty;var C=(r,e,t)=>e in r?h(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var u=(r,e,t)=>(C(r,typeof e!="symbol"?e+"":e,t),t);import v from"./index.05d63807.js";import g from"./index.50e761e4.js";import y from"./index.822846b6.js";import E from"./index.6571a43e.js";import{Z as M,E as k}from"./index.98b660c2.js";import z from"./index.f5ea6fcd.js";import{_ as w,d as x,q as B,s as D,r as I,I as S,$ as R,g as T,m as F,c as s,y as n,b as i}from"./index.063e71fb.js";import"./ipcEvents.99225826.js";import"./index.0e233ef7.js";import"./moment.40bc58bf.js";import"./v4.3dd88906.js";import"./line.adb01cff.js";import"./utils.851fad6a.js";import"./lodash.76c59d62.js";import"./home.4c95ff05.js";import"./ipcRenderer.fe336b84.js";import"./index.3222187b.js";import"./index.468a7e6c.js";import"./index.9b9f6254.js";import"./index.833a2120.js";class l{constructor(e,t){u(this,"_time");u(this,"_color");u(this,"_radius");u(this,"definitionChanged");this._time=0,this._color=e,this._radius=t,this.definitionChanged=new Cesium.Event,Cesium.Material._materialCache.addMaterial("PyramidScannerMaterial",{fabric:{type:"PyramidScannerMaterial",uniforms:{color:e,time:0,radius:t},source:`
                    czm_material czm_getMaterial(czm_materialInput materialInput) {
                        czm_material material = czm_getDefaultMaterial(materialInput);
                        vec2 st = materialInput.st;
                        vec3 positionEC = materialInput.positionToEyeEC;
                        
                        // \u6781\u5750\u6807\u8F6C\u6362
                        vec2 uv = (st - 0.5) * 2.0;
                        float angle = time * 3.0;
                        float currentRadius = radius * (0.5 + sin(time) * 0.5);
                        
                        // \u56DB\u68F1\u9525\u8BA1\u7B97
                        float theta = atan(uv.y, uv.x) + angle;
                        theta = mod(theta, radians(360.0));
                        float sector = floor(theta / radians(90.0));
                        float dist = length(uv) * radius;
                        
                        // \u53EF\u89C1\u6027\u5224\u65AD
                        if (dist < currentRadius && sector < 4.0 && positionEC.z > -length(positionEC)*0.5) {
                            float alpha = color.a * (1.0 - smoothstep(0.0, radius, dist));
                            material.alpha = alpha;
                            material.diffuse = color.rgb;
                        } else {
                            material.alpha = 0.0;
                        }
                        return material;
                    }
                `},translucent:function(a){return!0}})}getType(){return"PyramidScannerMaterial"}getValue(e,t){return{color:this._color,time:this._time,radius:this._radius}}equals(e){return this===e||e instanceof l&&this._color.equals(e._color)&&this._radius===e._radius}update(e){this._time+=e,this.definitionChanged.raiseEvent(this)}}const N={class:"home-container"},Z={name:"Home"},b=x({...Z,setup(r){const{ziCesium:e}=B(),{setZiCesium:t}=e,a=D(()=>e.ziCesium);return I(null),S(()=>{const m=new M("cesiumContainer");t(m);const{viewer:o}=m,c=Cesium.Cartesian3.fromDegrees(114.3,30.6,1e6),d=new l(new Cesium.Color(1,0,0,1),5e4);o.entities.add({position:c,rectangle:{coordinates:Cesium.Rectangle.fromDegrees(113.8,30.4,114.8,30.8),height:1e6,extrudedHeight:1e6,material:d}});let p=Date.now();o.scene.preUpdate.addEventListener(()=>{const _=Date.now(),f=(_-p)/1e3;d.update(f),p=_}),o.camera.flyTo({destination:c,orientation:{heading:0,pitch:Cesium.Math.toRadians(-60),roll:0}})}),R(()=>{}),(m,o)=>(i(),T("div",N,[o[0]||(o[0]=F("div",{id:"cesiumContainer",class:"cesiumContainer"},null,-1)),a.value?(i(),s(v,{key:0})):n("",!0),a.value?(i(),s(g,{key:1})):n("",!0),a.value?(i(),s(y,{key:2})):n("",!0),a.value?(i(),s(E,{key:3})):n("",!0),a.value?(i(),s(k,{key:4})):n("",!0),a.value?(i(),s(z,{key:5})):n("",!0)]))}});var re=w(b,[["__scopeId","data-v-13a0089d"]]);export{re as default};
