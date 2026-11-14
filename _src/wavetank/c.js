<script>
// ======================================================================
// 2 深水與淺水：折射
// ======================================================================
const R2={shape:'half',swap:false,inc:40,f:8,h1:1.2,h2:.4,ray:true,ang:true,lam:true,run:!reduced,T:0,spd:.1,rays:null,dirty:true,g:null};
const CY=TH/2;
function polyG(P){const cx=P.reduce((s,p)=>s+p[0],0)/P.length,cy=P.reduce((s,p)=>s+p[1],0)/P.length;const E=P.map((p,i)=>{const q=P[(i+1)%P.length],ex=q[0]-p[0],ey=q[1]-p[1],l=Math.hypot(ex,ey);let nx=ey/l,ny=-ex/l;if((cx-p[0])*nx+(cy-p[1])*ny>0){nx=-nx;ny=-ny;}return[p[0],p[1],nx,ny];});
  return(x,y)=>{let m=-1e9;for(const[a,b,nx,ny]of E)m=Math.max(m,(x-a)*nx+(y-b)*ny);return m;};}
const PRISM=[[10,20],[26,20],[18,3]];
function g2(){const ph=R2.inc*D2R,c=Math.cos(ph),s=Math.sin(ph),bx=17,u=(x,y)=>(x-bx)*c+(y-CY)*s;
  switch(R2.shape){
    case'half':return R2.swap?(x,y)=>u(x,y):(x,y)=>-u(x,y);
    case'slab':return(x,y)=>{const q=u(x,y);return Math.max(-q,q-8);};
    case'prism':return polyG(PRISM);
    case'lensx':return(x,y)=>Math.max(Math.hypot(x-28,y-CY)-15,Math.hypot(x-2,y-CY)-15);
    default:return(x,y)=>Math.max(Math.abs(x-15)-4.5,Math.abs(y-CY)-9,14-Math.hypot(x,y-CY),14-Math.hypot(x-30,y-CY));}}
function prep2(){R2.g=g2();const sc={src:'line',g:R2.g,kind:'shallow',v1:vOf(R2.h1),v2:vOf(R2.h2),noTir:!(R2.shape==='half'||R2.shape==='slab')};R2.rays=traceRays(sc);R2.lost=sc.lost||0;R2.dirty=false;R2.shadeKey='';
  let best=0,bd=1e9;R2.rays.forEach((r,i)=>{const d=Math.abs(r.Y[0]-CY);if(d<bd){bd=d;best=i;}});R2.mid=best;}
const shadeC=document.createElement('canvas');
function shadeShallow(g,G){ // 把淺水區塗深一點（形狀或大小改變時才重畫）
  const w=Math.round(TW*G.k),h=Math.round(TH*G.k),key=w+'x'+h;if(R2.shadeKey!==key){R2.shadeKey=key;shadeC.width=w;shadeC.height=h;const c=shadeC.getContext('2d'),im=c.createImageData(w,h),d=im.data;
    for(let j=0;j<h;j++)for(let i=0;i<w;i++){const v=R2.g((i+.5)/G.k,(j+.5)/G.k);if(v<0){const o=(j*w+i)*4;d[o]=20;d[o+1]=40;d[o+2]=60;d[o+3]=Math.round(66*clamp(-v*G.k,0,1));}}c.putImageData(im,0,0);}
  g.drawImage(shadeC,G.ox,G.oy,w,h);}
TICK.refr=dt=>{if(!R2.run)return false;R2.T+=dt*R2.spd;return true;};
DRAW.refr=()=>{if(R2.dirty)prep2();const cv=$('cvR'),G=tankGeo(cv),g=cv.getContext('2d'),{X,Y,k}=G,v1=vOf(R2.h1),v2=vOf(R2.h2),l1=v1/R2.f,l2=v2/R2.f;
  const sh0=R2.shape;tankBase(g,G);g.save();g.beginPath();g.rect(G.ox,G.oy,TW*k,TH*k);g.clip();shadeShallow(g,G);
  drawCrests(g,R2.rays,R2.T,1/R2.f,X,Y,{lw:clamp(l2*k*.16,1.6,4.5)});
  if(R2.ray)drawRays(g,R2.rays,X,Y,R2.shape==='half'||R2.shape==='slab'?16:7,'#ffd27a');
  const mid=R2.rays[R2.mid],ev=mid.ev[0];let iA=0,rA=0,tir=false;
  if(ev){iA=angOf(-ev.ix,-ev.iy,ev.nx,ev.ny);tir=ev.type==='tir';rA=tir?iA:angOf(ev.ox,ev.oy,-ev.nx,-ev.ny);}
  if(R2.ang&&ev&&(R2.shape==='half'||R2.shape==='slab')){const px=X(ev.x),py=Y(ev.y),L=7*k;
    line(g,px-ev.nx*L,py-ev.ny*L,px+ev.nx*L,py+ev.ny*L,'#fff',1.4,[5,5]);text(g,'法線',px+ev.nx*L*1.02,py+ev.ny*L*1.02-6,{size:12,col:'#fff',bg:LBG,align:'center'});
    arrow(g,px-ev.ix*L,py-ev.iy*L,px,py,'#8fd0ff',3);arrow(g,px,py,px+ev.ox*L,py+ev.oy*L,'#9ff0b0',3);
    if(iA>.5){angArc(g,px,py,ev.nx,ev.ny,-ev.ix,-ev.iy,Math.min(46,L*.45),'#8fd0ff',`入射角 ${nf(iA,0)}°`);
      if(tir)angArc(g,px,py,ev.nx,ev.ny,ev.ox,ev.oy,Math.min(34,L*.34),'#9ff0b0',`反射角 ${nf(rA,0)}°`);else angArc(g,px,py,-ev.nx,-ev.ny,ev.ox,ev.oy,Math.min(46,L*.45),'#9ff0b0',`折射角 ${nf(rA,1)}°`);}}
  if(R2.lam){const deepFirst=!(R2.shape==='half'&&R2.swap);text(g,(deepFirst?'深水區':'淺水區')+`　λ＝${nf(deepFirst?l1:l2,1)} cm`,X(1.2),Y(1.6),{size:13,bold:true,col:'#fff',bg:LBG});
    let lx,ly;if(R2.shape==='half'){lx=TW-1;ly=TH-1.2;text(g,(deepFirst?'淺水區（墊玻璃板）':'深水區')+`　λ＝${nf(deepFirst?l2:l1,1)} cm`,X(lx),Y(ly),{size:13,bold:true,col:'#fff',bg:LBG,align:'right'});}
    else text(g,`淺水區（玻璃板）　λ＝${nf(l2,1)} cm`,X(sh0==='slab'?22:16),Y(TH-.9),{size:13,bold:true,col:'#fff',bg:LBG,align:'center'});}
  g.restore();tankFrame(g,G,'line');
  // ---- 剖面 ----
  const c2=$('cvRS'),o=fit(c2,.11,112,136),h=c2.getContext('2d'),W2=o.W,H2=o.H;h.clearRect(0,0,W2,H2);
  {const r=mid,n=r.X.length;let S=[0];for(let i=1;i<n;i++)S.push(S[i-1]+Math.hypot(r.X[i]-r.X[i-1],r.Y[i]-r.Y[i-1]));const Sm=Math.min(S[n-1],46),L=10,sxp=(W2-2*L)/Sm,y0=22,dp=Math.min(34,(H2-48)/R2.h1),yb1=y0+R2.h1*dp,w=TAU*R2.f;
    h.fillStyle=C.water;h.globalAlpha=.55;h.beginPath();h.moveTo(L,yb1);for(let i=0;i<n&&S[i]<=Sm;i++){const e=Math.sin(w*(R2.T-r.T[i]))*4;h.lineTo(L+S[i]*sxp,y0-e);}h.lineTo(L+Sm*sxp,yb1);h.closePath();h.fill();h.globalAlpha=1;
    h.strokeStyle=C.ink;h.lineWidth=1.6;h.beginPath();for(let i=0;i<n&&S[i]<=Sm;i++){const e=Math.sin(w*(R2.T-r.T[i]))*4,px=L+S[i]*sxp;i?h.lineTo(px,y0-e):h.moveTo(px,y0-e);}h.stroke();
    h.fillStyle=C.glass;let st=-1;for(let i=0;i<n&&S[i]<=Sm;i++){const ins=r.I[i]===1;if(ins&&st<0)st=S[i];if((!ins||i===n-1||S[i+1]>Sm)&&st>=0){h.fillRect(L+st*sxp,y0+R2.h2*dp,(S[i]-st)*sxp,(R2.h1-R2.h2)*dp);st=-1;}}
    line(h,L,yb1,L+Sm*sxp,yb1,C.ink,2);
    let a=-1;for(let i=0;i<n&&S[i]<=Sm;i++){if(r.I[i]===1){if(a<0)a=i;}}
    text(h,`深水 ${nf(R2.h1,1)} cm：波速快、波長長`,L+4,H2-6,{size:12,col:C.muted});
    if(a>=0)text(h,`玻璃板上方是淺水 ${nf(R2.h2,2)} cm：波速慢、波長短`,L+S[a]*sxp+6,H2-6,{size:12,bold:true,col:C.ink,bg:C.panel});}
  // ---- 表與說明 ----
  const td=s=>`<td style="border-bottom:1px solid var(--line);padding:4px 6px;font-family:var(--f-mono);text-align:right">${s}</td>`,th=s=>`<th style="border-bottom:1px solid var(--line);padding:4px 6px;text-align:left;font-weight:500;color:var(--muted)">${s}</th>`;
  $('rTab').innerHTML=`<tr>${th('')}${th('深水區')}${th('淺水區')}</tr><tr>${th('水深')}${td(nf(R2.h1,1)+' cm')}${td(nf(R2.h2,2)+' cm')}</tr><tr>${th('波速 v')}${td(nf(v1,1)+' cm/s')}${td(nf(v2,1)+' cm/s')}</tr><tr>${th('波長 λ＝v／f')}${td(nf(l1,2)+' cm')}${td(nf(l2,2)+' cm')}</tr><tr>${th('頻率 f')}${td(R2.f+' Hz')}${td(R2.f+' Hz（不變）')}</tr>`;
  const sh=R2.shape,crit=Math.asin(v2/v1)/D2R;let f2='',say='';
  if(sh==='half'||sh==='slab'){if(tir)f2=`淺 → 深的臨界角：sin θc ＝ v淺／v深 ＝ ${nf(v2/v1,2)}，θc ＝ ${nf(crit,1)}°`;
    else if(iA<.5)f2='垂直入射：入射角 0°，折射角 0°，方向不變';
    else f2=`sin i／sin r ＝ sin ${nf(iA,0)}°／sin ${nf(rA,1)}° ＝ ${nf(Math.sin(iA*D2R)/Math.sin(rA*D2R),2)}<br>v入／v折 ＝ λ入／λ折 ＝ ${nf(R2.swap&&sh==='half'?v2/v1:v1/v2,2)}`;}
  else f2=`v₁／v₂ ＝ λ₁／λ₂ ＝ ${nf(v1/v2,2)}（相當於淺水區的「折射率」）`;
  if(sh==='half'){if(tir)say=`入射角 ${nf(iA,0)}° 超過臨界角 ${nf(crit,1)}°：水波進不了深水區，全部反射回淺水區（全反射）。`;
    else if(iA<.5)say='垂直入射：行進方向不變，但進入'+(R2.swap?'深水區後波長變長':'淺水區後波長變短')+'，頻率不變。';
    else say=R2.swap?'淺 → 深：波速變快、波長變長，行進方向偏離法線（折射角＞入射角）。入射角再大一點就會全反射。':'深 → 淺：波速變慢、波長變短，行進方向偏向法線（折射角＜入射角）。頻率不變。波前和邊界的夾角，在深水區等於入射角、在淺水區等於折射角。';}
  else if(sh==='slab')say='進入長條形淺水區時偏向法線，離開時又偏回來：出來的波前和原來的平行，波長也恢復，只是位置平移了一點。';
  else if(sh==='prism')say='經過三角形淺水區，進去、出來兩次都往底邊那一側偏——和光通過三稜鏡往底邊偏折一樣。';
  else if(sh==='lensx')say='凸透鏡形淺水區：中間最厚，走在中間的波在淺水區待最久、落後最多，波前變成向前凹的弧形，往焦點會聚；過了焦點又散開。';
  else say='凹透鏡形淺水區：邊緣最厚，邊緣的波落後最多，波前變成向前凸的弧形，像從左邊某一點發散出來。';
  if(R2.lost>0)say+=' （最邊緣的波在淺水區裡發生全反射，出不來，畫面沒有畫出；把淺水區加深一點就不會。）';
  $('rF2').innerHTML=f2;$('rSay').textContent=say;};
function ui2(){segSet($('rShape'),R2.shape);$('rSwap').checked=R2.swap;$('rSwapW').hidden=R2.shape!=='half';$('rIw').hidden=!(R2.shape==='half'||R2.shape==='slab');playTxt($('rPlay'),R2.run);segSet($('rSpd'),R2.spd);
  $('rRay').checked=R2.ray;$('rAng').checked=R2.ang;$('rLam').checked=R2.lam;}
UI.refr=ui2;
const set2=o=>{Object.assign(R2,o);R2.dirty=true;ui2();kick();};
segOn($('rShape'),v=>{hideStory();const o={shape:v};if(v==='prism'||v==='lensx'||v==='lensv'){o.h1=1.2;o.h2=.55;setRH1(1.2);setRH2(.55);}set2(o);});
$('rSwap').addEventListener('change',e=>{hideStory();set2({swap:e.target.checked});});
['rRay','rAng','rLam'].forEach((id,i)=>$(id).addEventListener('change',e=>{R2[['ray','ang','lam'][i]]=e.target.checked;kick();}));
segOn($('rSpd'),v=>{R2.spd=+v;});
$('rPlay').addEventListener('click',()=>{R2.run=!R2.run;playTxt($('rPlay'),R2.run);kick();});
const setRI=sliderBind('rI',v=>{R2.inc=v;R2.dirty=true;},v=>v+'°'),setRF=sliderBind('rF',v=>{R2.f=v;},v=>v+' Hz'),
  setRH1=sliderBind('rH1',v=>{R2.h1=v;if(R2.h2>v-.2){R2.h2=Math.round((v-.2)*20)/20;setRH2(R2.h2);}R2.dirty=true;},v=>nf(v,1)+' cm'),
  setRH2=sliderBind('rH2',v=>{R2.h2=Math.min(v,R2.h1-.2);R2.dirty=true;if(R2.h2!==v)setRH2(R2.h2);},v=>nf(v,2)+' cm');

// ======================================================================
// 3 障礙物：反射
// ======================================================================
const M3={shape:'line',src:'line',inc:30,f:8,h:1,ray:true,ang:true,sinc:true,sref:true,run:!reduced,T:0,spd:.1,P:{x:12,y:CY},rays:null,dirty:true,g:null},FOC=9;
const wallX=y=>M3.shape==='line'?27-(y-CY)*Math.tan(M3.inc*D2R):M3.shape==='concave'?35-(y-CY)**2/(4*FOC):27+(y-CY)**2/(4*FOC);
function prep3(){M3.g=(x,y)=>wallX(y)-x;M3.rays=traceRays({src:M3.src,px:M3.P.x,py:M3.P.y,g:M3.g,kind:'wall',v1:vOf(M3.h),v2:vOf(M3.h)});M3.dirty=false;
  let best=0,bd=1e9;if(M3.src==='line')M3.rays.forEach((r,i)=>{const d=Math.abs(r.Y[0]-CY);if(d<bd){bd=d;best=i;}});M3.mid=best;}
TICK.refl=dt=>{if(!M3.run)return false;M3.T+=dt*M3.spd;return true;};
let G3=null;
DRAW.refl=()=>{if(M3.dirty)prep3();const cv=$('cvM'),G=tankGeo(cv),g=cv.getContext('2d'),{X,Y,k}=G,v=vOf(M3.h),lam=v/M3.f;G3=G;
  tankBase(g,G);g.save();g.beginPath();g.rect(G.ox,G.oy,TW*k,TH*k);g.clip();
  drawCrests(g,M3.rays,M3.T,1/M3.f,X,Y,{lw:clamp(lam*k*.1,1.6,4),closed:M3.src==='point',gap:M3.src==='point'?2.2:1.4,inc:M3.sinc,ref:M3.sref});
  if(M3.ray)drawRays(g,M3.rays,X,Y,M3.src==='line'?(M3.shape==='line'?16:8):12,'#ffd27a');
  // 障礙物
  g.fillStyle='#2b3138';g.beginPath();g.moveTo(X(wallX(-1)),Y(-1));for(let y=-1;y<=TH+1;y+=.25)g.lineTo(X(wallX(y)),Y(y));g.lineTo(X(TW+2),Y(TH+1));g.lineTo(X(TW+2),Y(-1));g.closePath();g.fill();
  text(g,'障礙物（擋板）',X(TW-.6),Y(TH-.8),{size:12,col:'#fff',align:'right'});
  let iA=0,rA=0;const ev=M3.src==='line'&&M3.shape==='line'?M3.rays[M3.mid].ev[0]:null;
  if(ev){iA=angOf(-ev.ix,-ev.iy,ev.nx,ev.ny);rA=angOf(ev.ox,ev.oy,ev.nx,ev.ny);}
  if(M3.ang){
    if(ev){const px=X(ev.x),py=Y(ev.y),L=8*k;line(g,px,py,px+ev.nx*L,py+ev.ny*L,'#fff',1.4,[5,5]);text(g,'法線',px+ev.nx*L*1.04,py+ev.ny*L*1.04-4,{size:12,col:'#fff',bg:LBG,align:'center'});
      arrow(g,px-ev.ix*L,py-ev.iy*L,px,py,'#8fd0ff',3);arrow(g,px,py,px+ev.ox*L,py+ev.oy*L,'#9ff0b0',3);
      if(iA>.5){angArc(g,px,py,ev.nx,ev.ny,-ev.ix,-ev.iy,Math.min(50,L*.4),'#8fd0ff',`入射角 ${nf(iA,0)}°`);angArc(g,px,py,ev.nx,ev.ny,ev.ox,ev.oy,Math.min(50,L*.4),'#9ff0b0',`反射角 ${nf(rA,0)}°`);}}
    if(M3.shape==='line'&&M3.src==='point'){const t=Math.tan(M3.inc*D2R),nx=Math.cos(M3.inc*D2R),ny=Math.sin(M3.inc*D2R),d=(M3.P.x-27)*nx+(M3.P.y-CY)*ny,ix=M3.P.x-2*d*nx,iy=M3.P.y-2*d*ny;
      line(g,X(M3.P.x),Y(M3.P.y),X(ix),Y(iy),'#fff',1.2,[4,5]);g.strokeStyle='#fff';g.lineWidth=2;g.setLineDash([3,3]);g.beginPath();g.arc(X(ix),Y(iy),8,0,TAU);g.stroke();g.setLineDash([]);text(g,'像點 S′',X(ix)+12,Y(iy)+4,{size:13,bold:true,col:'#fff',bg:LBG});}
    if(M3.shape!=='line'){const fx=M3.shape==='concave'?35-FOC:27+FOC;line(g,X(2),Y(CY),X(TW),Y(CY),'rgba(255,255,255,.6)',1,[3,6]);const px=X(fx),py=Y(CY);line(g,px-6,py-6,px+6,py+6,'#ffd27a',2.5);line(g,px-6,py+6,px+6,py-6,'#ffd27a',2.5);
      text(g,M3.shape==='concave'?'焦點 F':'虛焦點 F（在擋板後面）',px,py-12,{size:13,bold:true,col:'#fff',bg:LBG,align:'center'});}}
  if(M3.src==='point'){handle(g,X(M3.P.x),Y(M3.P.y),8);text(g,'波源 S',X(M3.P.x),Y(M3.P.y)-14,{size:13,bold:true,col:'#fff',bg:LBG,align:'center'});}
  g.restore();tankFrame(g,G,M3.src);
  // 說明
  $('mNow').innerHTML=(ev?[['入射角（行進方向與法線）',nf(iA,0)+'°'],['反射角',nf(rA,0)+'°'],['入射波前與擋板的夾角',nf(iA,0)+'°（＝入射角）']]:[]).concat([['波速（反射前後）',nf(v,1)+' cm/s'],['波長（反射前後）',nf(lam,2)+' cm'],['頻率',M3.f+' Hz']]).map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
  let say='';const nearF=M3.shape==='concave'&&M3.src==='point'&&Math.hypot(M3.P.x-(35-FOC),M3.P.y-CY)<.8;
  if(M3.shape==='line'&&M3.src==='line')say=iA<.5?'垂直入射：反射波沿原路回去，入射角＝反射角＝0°。':'入射角＝反射角。注意角度是行進方向（射線）和法線的夾角；波前和行進方向垂直，所以入射波前和擋板的夾角也等於入射角。只留波前（把「行進方向」「法線與角度」關掉）練習讀角度。';
  else if(M3.shape==='line')say='圓形波遇到直線擋板：反射波是以「像點 S′」為圓心的圓形波。像點和波源對稱於擋板（到擋板的距離相等）——和平面鏡成像一樣。拖曳波源看像點跟著動。';
  else if(M3.shape==='concave')say=M3.src==='line'?'直線波遇到拋物面擋板：各處反射後都通過焦點 F，波前變成向 F 收縮的圓弧，在焦點最強，過了焦點再散開。':(nearF?'波源正好在焦點：反射後變成直線波，平行地往回走（探照燈、碟型天線的原理）。':'把波源拖到焦點 F 上，反射波會變成直線波。現在不在焦點，反射波前是彎的。');
  else say=M3.src==='line'?'直線波遇到凸面擋板：反射波向外散開，像是從擋板後面的虛焦點 F 發出來的圓形波。':'圓形波遇到凸面擋板：反射後散得更開。';
  $('mSay').textContent=say;$('mTitle').textContent=M3.shape==='line'?'反射定律':'曲面擋板';
  $('mHint').textContent=M3.src==='point'?'拖曳橘色的波源 S 改變位置。亮線是波峰（波前），黃色虛線是行進方向。':'亮線是波峰（波前），黃色虛線是行進方向（和波前垂直）。可以分別關掉入射波或反射波。';};
function ui3(){segSet($('mShape'),M3.shape);segSet($('mSrc'),M3.src);$('mIw').hidden=M3.shape!=='line';$('mIl').textContent=M3.src==='point'?'擋板傾斜':'入射角';playTxt($('mPlay'),M3.run);segSet($('mSpd'),M3.spd);
  ['mRay','mAng','mInc','mRef'].forEach((id,i)=>$(id).checked=M3[['ray','ang','sinc','sref'][i]]);}
UI.refl=ui3;
const set3=o=>{Object.assign(M3,o);M3.dirty=true;ui3();kick();};
segOn($('mShape'),v=>{hideStory();set3({shape:v,P:{x:v==='concave'?14:12,y:CY}});});
segOn($('mSrc'),v=>{hideStory();const o={src:v};if(v==='point'&&M3.shape==='line'){o.inc=0;o.P={x:17,y:CY};setMI(0);}set3(o);});
['mRay','mAng','mInc','mRef'].forEach((id,i)=>$(id).addEventListener('change',e=>{M3[['ray','ang','sinc','sref'][i]]=e.target.checked;kick();}));
segOn($('mSpd'),v=>{M3.spd=+v;});
$('mPlay').addEventListener('click',()=>{M3.run=!M3.run;playTxt($('mPlay'),M3.run);kick();});
const setMI=sliderBind('mI',v=>{M3.inc=v;M3.dirty=true;},v=>v+'°'),setMF=sliderBind('mF',v=>{M3.f=v;},v=>v+' Hz'),setMH=sliderBind('mH',v=>{M3.h=v;M3.dirty=true;},v=>nf(v,1)+' cm');
dragger($('cvM'),()=>G3&&M3.src==='point'?[{x:G3.X(M3.P.x),y:G3.Y(M3.P.y),r:30,move(x,y){let wx=clamp((x-G3.ox)/G3.k,1,TW-1),wy=clamp((y-G3.oy)/G3.k,1,TH-1);wx=Math.min(wx,wallX(wy)-1);
  if(M3.shape==='concave'&&Math.hypot(wx-(35-FOC),wy-CY)<.9){wx=35-FOC;wy=CY;}M3.P={x:wx,y:wy};M3.dirty=true;hideStory();}}]:[],kick);

// ======================================================================
// 考古題情境
// ======================================================================
function goS(o){setBench('setup');Object.assign(S1,o);setSF(S1.f);setSH(S1.h);setSA(S1.amp);setSHl(S1.Hl);setSHs(S1.Hs);S1.run=true;UI.setup();}
function goR(o){setBench('refr');Object.assign(R2,{swap:false,ray:true,ang:true,lam:true},o);setRI(R2.inc);setRF(R2.f);setRH1(R2.h1);setRH2(R2.h2);R2.run=true;R2.dirty=true;ui2();}
function goM(o){setBench('refl');Object.assign(M3,{ray:true,ang:true,sinc:true,sref:true},o);setMI(M3.inc);setMF(M3.f);setMH(M3.h);M3.run=true;M3.dirty=true;ui3();}
const QG=[
 {h:'水波槽的裝置、亮暗紋與波速',q:[
  {t:'一中 112-2-3 第 26 題（水波槽各個裝置的功用）',go(){goS({src:'line',f:8,h:1,amp:.6,Hl:40,Hs:40,sponge:true,rays:true,lab:true});},p:'(A) 長木條起波器產生直線波 ✓。\n(B) 可變電阻是用來改變起波器馬達的轉速（頻率），不是調整燈光亮度 ✗。\n(C) 燈光是散開的，白紙上的影像被放大：亮紋間距 ＝ 放大率 × 波長，不等於波長 ✗（看下方「量到的和實際的」）。\n(D) 海綿條是吸收邊緣的水波、避免反射，和頻率無關 ✗（把「四周圍海綿條」取消看看）。\n(E) 波谷的水面下凹，像凹透鏡使光發散，白紙上是暗紋 ✓。\n答案 <b>AE</b>。'},
  {t:'一中 110-2-3 第 1 題（筆尖點水、投影放大 2 倍，求實際波長）',go(){goS({src:'point',f:4,h:.3,amp:.6,Hl:40,Hs:40,sponge:true,rays:true,lab:false});},p:'每秒輕觸 4 次 → f ＝ 4 Hz。影像在 4.0 秒內向外移動 48 cm → 白紙上的速率 12 cm/s；放大率 2 倍 → 水波的實際波速 ＝ 12 ÷ 2 ＝ 6 cm/s。\nλ ＝ v ÷ f ＝ 6 ÷ 4 ＝ 1.5 cm，答案 <b>(E)</b>。\n畫面：圓形波、4 Hz、燈到水面和水槽到白紙等距（放大率約 2 倍）。畫面裡的水比題目深、波速比較快，但算法相同：白紙上量到的距離、速率都要先除以放大率。'},
  {t:'一中 112-2-3 第 1 題（因次分析：波速和 g、水深 D）',go(){goR({shape:'half',inc:0,h1:1.6,h2:.4,f:8});},p:'v 的單位是 m/s；g 是 m/s²、D 是 m。g × D 的單位是 m²/s²，開根號才是 m/s，所以 v 正比於 √(gD)，答案 <b>(C)</b>。\n畫面：深水區 1.6 cm、淺水區 0.4 cm。水深 4 倍 → 波速 2 倍 → 波長 2 倍（頻率相同）。'},
  {t:'一中 113-2-3 第 4 題（深水到淺水；干涉時的灰線）',go(){goR({shape:'half',inc:30,h1:1.2,h2:.4,f:8});},p:'深水 → 淺水：波速變慢、頻率不變，所以深水區的波長較大：(B) ✓，(A)(C) ✗。\n干涉時白紙上的灰線是節線：那裡的水面幾乎不動，沒有波峰、波谷去會聚或發散光線，亮度維持不變（灰色）。節線的振幅最小、振動速度也最小，(D)(E) ✗。\n答案 <b>(B)</b>。'},
 ]},
 {h:'深水與淺水：折射',q:[
  {t:'二中 114-2-3 第 2 題（水波由深水區進入淺水區）',go(){goR({shape:'half',inc:45,h1:1.2,h2:.4,f:8});},p:'(A) 深水區波速快，波長較長 ✓。\n(B) 頻率由起波器決定，兩區相同 ✗。\n(C) 進入淺水區波速變慢 ✓。\n(D) 波速變慢，行進方向偏向法線 ✓。\n(E) 偏向法線，所以折射角小於入射角 ✗。\n答案 <b>ACD</b>。'},
  {t:'二中 114-1-3 第 27 題（波前由 A 區進入 B 區）',go(){goR({shape:'half',inc:50,h1:1.4,h2:.35,f:8,ray:false,ang:false});},p:'原圖：A 區的波前間距寬、B 區的波前很密，折射線比入射線更靠近法線。\n(A) A 區波長長 → 波速快 → 水比較深 ✓。\n(B) 偏向法線：A 區的入射角大於 B 區的折射角 ✗。\n(C) 頻率相同 ✗。\n(D) A 區波速較大 ✓。\n(E) 入射波與折射波頻率相同 ✓。\n答案 <b>ADE</b>。\n畫面先只畫波前；勾「行進方向」「法線與角度」再核對。'},
  {t:'二中 113-1-3 第 26 題（折射實驗的亮線：P、Q 兩區）',go(){goR({shape:'half',inc:58,h1:1.4,h2:.4,f:6,ray:false,ang:false});},p:'原圖：亮線是波峰。P 區的亮線間距寬，Q 區的亮線密。\n亮線間距就是波長（同一張白紙，放大率相同）：P 區波長較長 (B ✓)。頻率相同 (A ✗)。λ＝v／f，所以 Q 區波速較慢 (D ✓)、P 區較快 (C ✗)；波速快的 P 區水比較深 (E ✗)。\n答案 <b>BD</b>。'},
  {t:'二中 110-2-3 第 1 題（反射、折射過程中不變的量）',go(){goR({shape:'slab',inc:35,h1:1.2,h2:.4,f:8});},p:'波的頻率由波源決定，經過反射、折射或被介質吸收能量都不會改變；波速、波長隨介質改變，振幅因能量被吸收而變小。答案 <b>(A) 頻率</b>。\n畫面：通過長條形淺水區，波長變短又變回來，每秒通過的波峰數始終一樣。'},
 ]},
 {h:'障礙物：反射',q:[
  {t:'二中 112-1-2 第 18 題（由波前讀入射角）',go(){goM({shape:'line',src:'line',inc:59,f:8,h:1});},p:'原圖：(1)、(2) 是波峰（波前），箭頭是行進方向，N 是法線。波前和法線夾 31°，和障礙物夾 31°＋28°＝59°。\n入射角是「行進方向」和法線的夾角。行進方向和波前垂直，所以入射角 ＝ 90° − 31° ＝ 59°，也就是波前和障礙物的夾角。答案 <b>(E) 59°</b>。\n常見錯誤：把波前當成射線，答成 31°。畫面設成入射角 59°，可以把「行進方向」「法線與角度」關掉，只看波前。'},
 ]},
];
function buildQ(){const box=$('qbox');box.innerHTML='';QG.forEach(gp=>{const d=document.createElement('div');d.className='qgrp';d.innerHTML=`<h4>${gp.h}</h4>`;const w=document.createElement('div');w.className='qchips';
  gp.q.forEach(q=>{const b=document.createElement('button');b.className='qchip';b.type='button';b.setAttribute('aria-pressed','false');b.textContent=q.t;
    b.onclick=()=>{q.go();document.querySelectorAll('.qchip').forEach(c=>c.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');showStory(q.t,q.p);kick();};w.appendChild(b);});
  d.appendChild(w);box.appendChild(d);});}
buildQ();
setBench((location.hash||'').slice(1),true);
</script>
</body>
</html>
