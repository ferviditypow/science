<script>
// ======================================================================
// 共用的 3D 水槽：實驗台 2（折射）、3（反射）、4（干涉）都能切 2D／3D
// ======================================================================
const NXG=152,NZG=84,AGW=.34,DEPK=1.7,LXG=TW*K3,LZG=TH*K3;
const V3={refr:'2d',refl:'2d',two:'2d'},GW={ren:null,loading:false,fail:false,pre:'tilt',host:null};
const gx3=i=>(i/(NXG-1)*TW-TW/2)*K3, gz3=k=>(k/(NZG-1)*TH-TH/2)*K3;
// --- 由射線的抵達時間做出相位網格（空的地方＝波還沒到／陰影）---
function phaseGrid(rays,sel){const G=new Float32Array(NXG*NZG).fill(-1);
  for(const r of rays){const n=r.X.length;for(let j=0;j<n;j++){const b=r.B[j];
    if(sel===0&&b>0)break;if(sel===1&&b===0)continue;
    const i=Math.round(r.X[j]/TW*(NXG-1)),k=Math.round(r.Y[j]/TH*(NZG-1));
    if(i<0||i>=NXG||k<0||k>=NZG)continue;const o=k*NXG+i;if(G[o]<0||r.T[j]<G[o])G[o]=r.T[j];}}
  for(let p=0;p<3;p++){const C=G.slice();let holes=0;
    for(let k=0;k<NZG;k++)for(let i=0;i<NXG;i++){const o=k*NXG+i;if(C[o]>=0)continue;let s=0,c=0;
      for(let dk=-1;dk<=1;dk++)for(let di=-1;di<=1;di++){const kk=k+dk,ii=i+di;if(kk<0||kk>=NZG||ii<0||ii>=NXG)continue;const v=C[kk*NXG+ii];if(v>=0){s+=v;c++;}}
      if(c>=3)G[o]=s/c;else holes++;}
    if(!holes)break;}
  return G;}
const GC={};   // 每個實驗台的相位網格快取
function gridsFor(b){
  if(b==='refr'){if(R2.dirty)prep2();if(GC.rk!==R2.rays)  {GC.rk=R2.rays;GC.r=[phaseGrid(R2.rays,null)];}return GC.r;}
  if(b==='refl'){if(M3.dirty)prep3();if(GC.mk!==M3.rays){GC.mk=M3.rays;GC.m=[phaseGrid(M3.rays,0),phaseGrid(M3.rays,1)];}return GC.m;}
  return null;}
// 各實驗台的水面高度、水深、底部障礙
function cfg3(b){
  if(b==='refr'){const v1=vOf(R2.h1),v2=vOf(R2.h2),w=TAU*R2.f,sh=R2.g||g2(),G=gridsFor(b)[0];
    return{t:R2.T,w,dep:(x,z)=>(sh(x,z)<0?R2.h2:R2.h1)*DEPK,
      eta:(i,k)=>{const T=G[k*NXG+i];return T<0||R2.T<T?0:AGW*Math.cos(w*(R2.T-T));},solid:null};}
  if(b==='refl'){const w=TAU*M3.f,G=gridsFor(b),pt=M3.src==='point',v=vOf(M3.h);
    return{t:M3.T,w,dep:()=>M3.h*DEPK,
      eta:(i,k)=>{const o=k*NXG+i;let e=0;
        if(M3.sinc){const T=G[0][o];if(T>=0&&M3.T>=T)e+=Math.cos(w*(M3.T-T))*(pt?Math.min(1,.9/Math.sqrt(Math.max(.6,v*T/8))):1);}
        if(M3.sref){const T=G[1][o];if(T>=0&&M3.T>=T)e+=Math.cos(w*(M3.T-T))*(pt?Math.min(1,.9/Math.sqrt(Math.max(.6,v*T/8))):1);}
        return AGW*e*(M3.sinc&&M3.sref?.62:1);},solid:(x,z)=>x>wallX(z)};}
  const W=w4(),S=srcs4();
  return{t:T4.T,w:W.w,dep:()=>T4.h*DEPK,etaXY:(x,z)=>AGW*fld4(x,z,T4.T,W,S)[0]/W.A*.8,solid:null};}
async function initGW(){if(GW.ren||GW.loading||GW.fail)return;GW.loading=true;
  try{const THREE=await import('three'),{OrbitControls}=await import('../vendor/three/OrbitControls.js');
    const cv=document.createElement('canvas');cv.id='cvG3';cv.setAttribute('aria-label','水波槽 3D 立體圖');
    const ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});ren.setPixelRatio(DPR());
    const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(36,1,.3,500),ctl=new OrbitControls(cam,cv);ctl.addEventListener('change',kick);
    scene.add(new THREE.HemisphereLight(0xffffff,0x8a97a6,1.7));const dl=new THREE.DirectionalLight(0xffffff,1.5);dl.position.set(-8,22,16);scene.add(dl);
    const sg=new THREE.PlaneGeometry(LXG,LZG,NXG-1,NZG-1);sg.rotateX(-Math.PI/2);
    sg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(sg.attributes.position.count*3),3));
    const surf=new THREE.Mesh(sg,new THREE.MeshPhongMaterial({vertexColors:true,shininess:100,specular:0xbfe8ff,transparent:true,opacity:.93,side:THREE.DoubleSide}));surf.renderOrder=3;scene.add(surf);
    const WT=new THREE.Color(0x8fdcf2),WB=new THREE.Color(0x0a4260);
    const wm=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false});
    const mkW=(n,fn)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array((n+1)*6),3));
      const c=new Float32Array((n+1)*6);for(let i=0;i<=n;i++){c.set([WT.r,WT.g,WT.b],i*6);c.set([WB.r,WB.g,WB.b],i*6+3);}
      g.setAttribute('color',new THREE.BufferAttribute(c,3));const idx=[];for(let i=0;i<n;i++){const a=i*2;idx.push(a,a+1,a+2,a+2,a+1,a+3);}g.setIndex(idx);
      const m=new THREE.Mesh(g,wm);m.renderOrder=2;scene.add(m);return{g,n,fn};};
    const walls=[mkW(NXG-1,i=>[i,NZG-1]),mkW(NXG-1,i=>[i,0]),mkW(NZG-1,k=>[0,k]),mkW(NZG-1,k=>[NXG-1,k])];
    const fg=new THREE.PlaneGeometry(LXG,LZG,NXG-1,NZG-1);fg.rotateX(-Math.PI/2);
    const floor=new THREE.Mesh(fg,new THREE.MeshLambertMaterial({color:0x14556f,transparent:true,opacity:.92}));floor.renderOrder=1;scene.add(floor);
    const base=new THREE.Mesh(new THREE.BoxGeometry(LXG+.3,.16,LZG+.3),new THREE.MeshLambertMaterial({color:0x0c3042}));scene.add(base);
    const rim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(LXG+.3,1,LZG+.3)),new THREE.LineBasicMaterial({color:0x7c8894}));scene.add(rim);
    const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NXG*3),3));
    const prof=new THREE.Line(pg,new THREE.LineBasicMaterial({color:0x10202e}));prof.renderOrder=5;scene.add(prof);
    const dip=new THREE.Group();scene.add(dip);
    const paper=new THREE.Mesh((()=>{const p=new THREE.PlaneGeometry(1,1);p.rotateX(-Math.PI/2);return p;})(),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));paper.visible=false;scene.add(paper);
    Object.assign(GW,{THREE,ren,scene,cam,ctl,cv,surf,sg,walls,floor,base,rim,prof,dip,paper,WT,WB});
    cv.addEventListener('webglcontextlost',e=>{e.preventDefault();GW.lost=true;});cv.addEventListener('webglcontextrestored',()=>{GW.lost=false;kick();});
    hostGW();kick();}
  catch(e){console.warn('3D 無法啟動',e);GW.fail=true;['refr','refl','two'].forEach(b=>{V3[b]='2d';});UI[bench]&&UI[bench]();kick();}
  GW.loading=false;}
function hostGW(){if(!GW.ren)return;const st=$('st3'+{refr:'r',refl:'m',two:'t'}[bench]);if(!st)return;
  if(GW.cv.parentNode!==st)st.insertBefore(GW.cv,st.firstChild);GW.host=st;$('load3'+{refr:'r',refl:'m',two:'t'}[bench]).hidden=true;sizeGW();camGW();}
function sizeGW(){if(!GW.ren||!GW.host)return;const fs=document.fullscreenElement===GW.host,w=Math.max(200,GW.host.clientWidth);
  const h=fs?Math.min(innerHeight,Math.round(w*.6)):w<600?clamp(Math.round(w*.95),300,520):clamp(Math.round(w*.56),320,620);
  GW.ren.setSize(w,h,false);GW.cv.style.height=h+'px';GW.cam.aspect=w/h;GW.cam.updateProjectionMatrix();GW.w=w;GW.h=h;}
function camGW(){if(!GW.ren)return;const tw=bench==='two',d=tw?5.6:2.2,t34=Math.tan(18*D2R),a=GW.cam.aspect||1.6,tg=[0,tw?-2.3:-1.1,0];
  const P={tilt:[.42,.52,.74],top:[0,1,.0001],low:[.1,.16,1]}[GW.pre]||[.42,.52,.74];
  const need=Math.max((LZG*(GW.pre==='top'?1:.8)+d)/2/t34,(LXG+1.2)/2/t34/a)*(GW.pre==='top'?1.05:GW.pre==='low'?1.6:1.45);
  const l=Math.hypot(...P);GW.cam.position.set(tg[0]+P[0]/l*need,tg[1]+P[1]/l*need,tg[2]+P[2]/l*need);
  GW.ctl.target.set(...tg);GW.ctl.minDistance=3;GW.ctl.maxDistance=need*3;GW.ctl.update();}
function updGW(b){const R=GW;if(!R.ren||R.lost)return;if(!R.host||R.host!==$('st3'+{refr:'r',refl:'m',two:'t'}[b]))hostGW();
  if(Math.abs((R.w||0)-R.host.clientWidth)>1)sizeGW();
  const C=cfg3(b),p=R.sg.attributes.position,col=R.sg.attributes.color,fp=R.floor.geometry.attributes.position;
  let dmax=0;const H=new Float32Array(NXG*NZG);
  for(let k=0;k<NZG;k++)for(let i=0;i<NXG;i++){const o=k*NXG+i,x=i/(NXG-1)*TW,z=k/(NZG-1)*TH;
    const dp=C.dep(x,z);if(dp>dmax)dmax=dp;
    const solid=C.solid?C.solid(x,z):false;
    const e=solid?.42:(C.etaXY?C.etaXY(x,z):C.eta(i,k));H[o]=e;
    p.setY(o,e);const u=clamp(.5+.5*e/AGW/1.5,0,1);
    if(solid)col.setXYZ(o,.46,.49,.53);else col.setXYZ(o,.09+.46*u,.41+.40*u,.62+.33*u);
    fp.setY(o,-dp+.02);}
  p.needsUpdate=true;col.needsUpdate=true;R.sg.computeVertexNormals();fp.needsUpdate=true;R.floor.geometry.computeVertexNormals();
  R.walls.forEach(w=>{const a=w.g.attributes.position;for(let i=0;i<=w.n;i++){const[ii,kk]=w.fn(i),o=kk*NXG+ii,x=ii/(NXG-1)*TW,z=kk/(NZG-1)*TH;
    a.setXYZ(i*2,gx3(ii),H[o],gz3(kk));a.setXYZ(i*2+1,gx3(ii),-C.dep(x,z),gz3(kk));}a.needsUpdate=true;w.g.computeBoundingSphere();});
  const zf=LZG/2+.01,pp=R.prof.geometry.attributes.position;for(let i=0;i<NXG;i++)pp.setXYZ(i,gx3(i),H[(NZG-1)*NXG+i],zf);pp.needsUpdate=true;
  R.base.position.y=-dmax-.08;R.rim.scale.y=dmax+.8;R.rim.position.y=-dmax+(dmax+.8)/2;
  // 波源小球（干涉台）
  if(b==='two'){if(R.dip.children.length!==2){while(R.dip.children.length)R.dip.remove(R.dip.children[0]);
      for(let s=0;s<2;s++){const m=new R.THREE.Mesh(new R.THREE.SphereGeometry(.13,14,10),new R.THREE.MeshLambertMaterial({color:0x2b3138}));R.dip.add(m);}}
    srcs4().forEach(([x,z],s)=>{R.dip.children[s].position.set((x-TW/2)*K3,.12,(z-TH/2)*K3);});R.dip.visible=true;
    if(oc4){if(!R.ptex){R.ptex=new R.THREE.CanvasTexture(oc4);R.ptex.colorSpace=R.THREE.SRGBColorSpace;R.paper.material.map=R.ptex;R.paper.material.needsUpdate=true;}
      R.ptex.needsUpdate=true;R.paper.visible=true;R.paper.scale.set(LXG*1.3,1,LZG*1.3);R.paper.position.set(0,-dmax-2.2,0);}}
  else{R.dip.visible=false;R.paper.visible=false;}
  R.ctl.update();R.ren.render(R.scene,R.cam);}
// --- 把 2D 的 DRAW 包起來：3D 時多畫一次 3D ---
['refr','refl','two'].forEach(b=>{const f=DRAW[b];DRAW[b]=()=>{f();if(V3[b]==='3d'){if(GW.ren)updGW(b);else initGW();}};});
function ui3d(b){const p={refr:'r',refl:'m',two:'t'}[b],d3=V3[b]==='3d';
  segSet($(p+'V3'),V3[b]);$({refr:'cvR',refl:'cvM',two:'cvT'}[b]).hidden=d3;$('st3'+p).hidden=!d3;
  $(p+'CamW').style.display=d3?'contents':'none';if(d3)segSet($(p+'Cam'),GW.pre);}
['refr','refl','two'].forEach(b=>{const p={refr:'r',refl:'m',two:'t'}[b],u=UI[b];
  UI[b]=()=>{u&&u();ui3d(b);};
  segOn($(p+'V3'),v=>{hideStory();V3[b]=GW.fail?'2d':v;ui3d(b);if(V3[b]==='3d'){GW.ren?hostGW():initGW();}kick();});
  segOn($(p+'Cam'),v=>{GW.pre=v;document.querySelectorAll('#rCam,#mCam,#tCam').forEach(el=>segSet(el,v));camGW();kick();});
  $(p+'FS').addEventListener('click',()=>{const st=$('st3'+p);if(document.fullscreenElement)document.exitFullscreen();else if(st.requestFullscreen)st.requestFullscreen().catch(()=>{});});});
addEventListener('resize',()=>{if(GW.ren&&V3[bench]==='3d'){sizeGW();kick();}});
document.addEventListener('fullscreenchange',()=>{setTimeout(()=>{sizeGW();kick();},120);});
UI[bench]&&UI[bench]();
</script>
