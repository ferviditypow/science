
// =====================================================================
// 1 色散與彩虹
// =====================================================================
const DS={mode:'prism',src:'white',p2:false,ex:true,sy:.3,h:16,face:'E'};
let WD=600,HD=320;
const DSRC={white:[],red:[650],green:[530],violet:[410],rb:[650,460]};for(let l=400;l<=700;l+=12)DSRC.white.push(l);
const nGlass=(nm,ex)=>{const n=1.5046+4200/(nm*nm),n0=1.5046+4200/(550*550);return ex?n0+(n-n0)*4:n;};
const nWater=(nm,ex=1)=>{const n=1.3236+3180/(nm*nm),n0=1.3236+3180/(550*550);return n0+(n-n0)*ex;};
const nmCss=(nm,a=1)=>{const c=nmRGBa(nm);return `rgba(${c.map(v=>Math.round(255*Math.pow(v,.8))).join(',')},${a})`;};
function dsGeo(W,H){const s=Math.min(H*.6,W*.28),h=s*Math.sqrt(3)/2,cx=W*.38,cy=H*.56;const A=[cx,cy-2*h/3],Bl=[cx-s/2,cy+h/3],Br=[cx+s/2,cy+h/3];
  const gx=8,P1=[A[0]+gx,A[1]],P2=[A[0]+gx+s,A[1]],P3=[Br[0]+gx,Br[1]];return {s,h,cx,cy,A,Bl,Br,P:[[A,Br,Bl]],P2:[P1,P2,P3],sx:34,scr:W-34};}
function segHit(p,d,a,b){const ex=b[0]-a[0],ey=b[1]-a[1];const den=d[0]*ey-d[1]*ex;if(Math.abs(den)<1e-9)return null;
  const t=((a[0]-p[0])*ey-(a[1]-p[1])*ex)/den,u=((a[0]-p[0])*d[1]-(a[1]-p[1])*d[0])/den;return t>1e-6&&u>=0&&u<=1?t:null;}
function refr(d,nrm,n1,n2){// nrm 指向入射那一側
  const ci=-(d[0]*nrm[0]+d[1]*nrm[1]),r=n1/n2,k=1-r*r*(1-ci*ci);if(k<0)return [d[0]+2*ci*nrm[0],d[1]+2*ci*nrm[1]];const ct=Math.sqrt(k);return [r*d[0]+(r*ci-ct)*nrm[0],r*d[1]+(r*ci-ct)*nrm[1]];}
function tracePolys(p,d,n,polys,xEnd){const pts=[p.slice()];let inside=-1;
  for(let it=0;it<8;it++){let best=null;polys.forEach((P,pi)=>{for(let i=0;i<3;i++){const a=P[i],b=P[(i+1)%3];const t=segHit(p,d,a,b);if(t!==null&&(!best||t<best.t))best={t,pi,a,b};}});
    if(!best)break;p=[p[0]+d[0]*best.t,p[1]+d[1]*best.t];pts.push(p.slice());
    const ex=best.b[0]-best.a[0],ey=best.b[1]-best.a[1],L=Math.hypot(ex,ey);let nr=[ey/L,-ex/L];if(nr[0]*d[0]+nr[1]*d[1]>0)nr=[-nr[0],-nr[1]];
    if(inside<0){d=refr(d,nr,1,n);inside=best.pi;}else{const nd=refr(d,nr,n,1);const tir=(nd[0]*nr[0]+nd[1]*nr[1])>0;d=nd;if(!tir)inside=-1;}}
  const t=d[0]>0?(xEnd-p[0])/d[0]:400;pts.push([p[0]+d[0]*Math.max(0,t),p[1]+d[1]*Math.max(0,t)]);return pts;}
function drawPrism(g,W,H){const G=dsGeo(W,H);g.fillStyle='#0b0d12';g.fillRect(0,0,W,H);
  const polys=DS.p2?[G.P[0],G.P2]:[G.P[0]];
  polys.forEach(P=>{g.fillStyle='rgba(170,200,255,.13)';g.strokeStyle='rgba(200,220,255,.65)';g.lineWidth=1.5;g.beginPath();P.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fill();g.stroke();});
  const M=[(G.A[0]+G.Bl[0])/2,(G.A[1]+G.Bl[1])/2],S=[G.sx,G.cy+DS.sy*H];const L=Math.hypot(M[0]-S[0],M[1]-S[1]);const d=[(M[0]-S[0])/L,(M[1]-S[1])/L];
  // 光源
  g.save();g.translate(S[0],S[1]);g.rotate(Math.atan2(d[1],d[0]));g.fillStyle='#5b6470';g.fillRect(-26,-9,30,18);g.restore();
  const nms=DSRC[DS.src];const bins=new Float32Array(Math.ceil(H))  ,binC=[new Float32Array(Math.ceil(H)),new Float32Array(Math.ceil(H)),new Float32Array(Math.ceil(H))];
  g.save();g.globalCompositeOperation='lighter';const ends=[];
  nms.forEach(nm=>{const pts=tracePolys(S,d,nGlass(nm,DS.ex),polys,G.scr);const col=nmCss(nm,DS.src==='white'?.5:.95);g.strokeStyle=col;g.lineWidth=DS.src==='white'?2:3;
    g.beginPath();pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();const e=pts[pts.length-1];ends.push([nm,e]);
    if(e[0]>=G.scr-1&&e[1]>0&&e[1]<H){const c=nmRGBa(nm);for(let y=Math.max(0,Math.floor(e[1]-6));y<Math.min(H,e[1]+6);y++){const w=Math.exp(-((y-e[1])**2)/8);for(let k=0;k<3;k++)binC[k][y]+=c[k]*w;}}});
  g.restore();
  // 屏幕
  g.fillStyle='#e9e6df';g.fillRect(G.scr,0,14,H);const mx=Math.max(.001,...binC[0],...binC[1],...binC[2]);const norm=DS.src==='white'?(DS.p2?mx:mx*.55):mx;
  for(let y=0;y<H;y++){const r=binC[0][y],gg=binC[1][y],b=binC[2][y];if(r+gg+b<1e-3)continue;const k=1/norm;g.fillStyle=`rgb(${Math.min(255,Math.round(255*Math.pow(Math.min(1,r*k),.7)))},${Math.min(255,Math.round(255*Math.pow(Math.min(1,gg*k),.7)))},${Math.min(255,Math.round(255*Math.pow(Math.min(1,b*k),.7)))})`;g.fillRect(G.scr,y,14,1);}
  text(g,'屏幕',G.scr+7,14,{size:11,col:'#ccc',align:'center'});
  if(DS.src==='white'&&!DS.p2&&ends.length){const r=ends.find(e=>e[0]>=650)||ends[ends.length-1],v=ends[0];text(g,'紅',G.scr-6,r[1][1]+4,{size:13,bold:true,col:'#ff6b5b',align:'right'});text(g,'紫',G.scr-6,v[1][1]+4,{size:13,bold:true,col:'#b48cff',align:'right'});
    text(g,'紅光偏折最小、紫光偏折最大',G.cx+G.s*.55,G.cy+G.h*.62,{size:12,col:'#ddd'});}
  if(DS.p2)text(g,'倒放的三稜鏡把色光偏折回來，重疊處又變成白光',W/2,22,{size:13,bold:true,col:'#fff',align:'center'});
  handle(g,S[0],S[1],9);}
// 彩虹
function drawRain(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const half=W<640?W:W*.46;
  // 左：水滴
  const R=Math.min(H*.36,half*.36),cx=half*.55,cy=H*.48;g.fillStyle='rgba(120,180,255,.18)';g.strokeStyle=C.blue;g.lineWidth=2;g.beginPath();g.arc(cx,cy,R,0,TAU);g.fill();g.stroke();
  text(g,'小水滴（放大）',8,18,{size:12,col:C.muted});
  const nm0=550,n0=nWater(nm0,3),b=R*Math.sqrt((4-n0*n0)/3);const E=[cx-Math.sqrt(R*R-b*b),cy-b];line(g,8,E[1],E[0],E[1],'#e0a800',3);arrow(g,8,E[1],E[0]-30,E[1],'#e0a800',3);text(g,'陽光',10,E[1]-8,{size:12,bold:true,col:'#c08a00'});
  g.save();g.globalCompositeOperation=document.documentElement.matches('[data-theme="dark"]')||matchMedia('(prefers-color-scheme: dark)').matches?'lighter':'source-over';
  [700,640,590,550,510,470,420].forEach(nm=>{const n=nWater(nm,3);let p=E,d=[1,0];let nr=[(p[0]-cx)/R,(p[1]-cy)/R];d=refr(d,nr,1,n);const pts=[p];
    const hitC=(p,d)=>{const fx=p[0]-cx,fy=p[1]-cy;const bb=fx*d[0]+fy*d[1];const cc=fx*fx+fy*fy-R*R;const t=-bb+Math.sqrt(Math.max(0,bb*bb-cc));return [p[0]+d[0]*t,p[1]+d[1]*t];};
    p=hitC(p,d);pts.push(p);nr=[-(p[0]-cx)/R,-(p[1]-cy)/R];d=[d[0]+2*(-(d[0]*nr[0]+d[1]*nr[1]))*nr[0],d[1]+2*(-(d[0]*nr[0]+d[1]*nr[1]))*nr[1]];
    p=hitC(p,d);pts.push(p);nr=[-(p[0]-cx)/R,-(p[1]-cy)/R];d=refr(d,nr,n,1);pts.push([p[0]+d[0]*R*1.3,p[1]+d[1]*R*1.3]);
    g.strokeStyle=nmCss(nm,.9);g.lineWidth=2;g.beginPath();pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();});
  g.restore();text(g,'折射 → 內部反射 → 折射',cx,cy-R-12,{size:12,bold:true,align:'center'});
  text(g,'紅光約 42°、紫光約 40°',cx-R*.2,cy+R*1.18,{size:12,col:C.muted,align:'center'});
  if(W<640)return;
  // 右：天空
  const L=W*.5,T=14,Wd=W-L-12,Hs=H-28,hz=T+Hs*.78,k=(hz-T)/62;const hh=DS.h,e=Math.max(0,65*Math.sin(Math.PI*(hh-6)/12)),sunSide=hh<12?'E':hh>12?'W':'S',anti=sunSide==='E'?'W':sunSide==='W'?'E':'N';
  g.save();g.beginPath();g.rect(L,T,Wd,Hs);g.clip();g.fillStyle=C.sky||'#dbe9f7';g.fillStyle='#cfe3f6';g.fillRect(L,T,Wd,hz-T);g.fillStyle='#8fbf6a';g.fillRect(L,hz,Wd,T+Hs-hz);
  const vx=L+Wd/2;
  if(DS.face===anti){// 雨雲在前方
    g.fillStyle='rgba(110,120,135,.55)';g.fillRect(L,T,Wd,(hz-T)*.25);for(let i=0;i<40;i++){const x=L+((i*53)%Wd),y=T+(hz-T)*.25+((i*37)%((hz-T)*.7));line(g,x,y,x-3,y+10,'rgba(90,110,140,.35)',1);}
    if(e<42){const cy2=hz+e*k;[[42,'#ff3b30'],[41.6,'#ff9500'],[41.2,'#ffd60a'],[40.9,'#34c759'],[40.6,'#0a84ff'],[40.3,'#5e5ce6'],[40,'#af52de']].forEach(([a,c])=>{g.strokeStyle=c;g.globalAlpha=.75;g.lineWidth=Math.max(2,k*.45);g.beginPath();g.arc(vx,cy2,a*k,Math.PI,0);g.stroke();});g.globalAlpha=1;}}
  else if(e>0){const sy=hz-e*k;g.fillStyle='#ffcc33';g.beginPath();g.arc(vx,Math.max(T+14,sy),14,0,TAU);g.fill();}
  g.restore();g.strokeStyle=C.line;g.strokeRect(L,T,Wd,Hs);
  // 人與影子
  g.save();g.fillStyle=C.ink;g.beginPath();g.arc(vx,T+Hs-46,7,0,TAU);g.fill();g.fillRect(vx-6,T+Hs-38,12,24);g.restore();
  if(DS.face===anti&&e>0){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(vx,T+Hs-12+0,8,3,0,0,TAU);g.fill();line(g,vx,T+Hs-12,vx,T+Hs-12-Math.min(60,30/Math.tan(Math.max(.1,e*D2R))),'rgba(0,0,0,.25)',8);}
  text(g,'面向'+(DS.face==='E'?'東方':'西方'),L+8,T+18,{size:13,bold:true});
  text(g,`${Math.floor(hh)}:${String(Math.round((hh%1)*60)).padStart(2,'0')}　太陽仰角 ${Math.round(e)}°（在${sunSide==='E'?'東方':sunSide==='W'?'西方':'正上方附近'}）`,L+Wd-8,T+18,{size:12,align:'right'});}
function dsUI(){segSet($('dsMode'),DS.mode);document.querySelectorAll('.dsc').forEach(e=>e.hidden=e.dataset.m!==DS.mode);segSet($('dsSrc'),DS.src);$('dsP2').checked=DS.p2;$('dsEx').checked=DS.ex;
  $('dsH').value=DS.h;$('dsHo').textContent=Math.floor(DS.h)+':'+String(Math.round((DS.h%1)*60)).padStart(2,'0');segSet($('dsFace'),DS.face);
  $('dsHint').textContent=DS.mode==='prism'?'拖曳左邊光源的橘點改變入射角度；換成單色光看看還會不會分開。':'拖曳時間、選擇面向的方向：彩虹總是出現在太陽的對面。';
  $('dsHowT').textContent=DS.mode==='prism'?'三稜鏡：怎麼看':'彩虹：怎麼看';
  howList('dsHow',DS.mode==='prism'?['白光（太陽光）經過三稜鏡，各色光偏折程度不同而分開：色散。1666 年牛頓的實驗。','紅光偏折最小、紫光偏折最大；在玻璃中紅光最快、紫光最慢。在真空中各色光一樣快。','單色光（雷射）只會偏折，不會再分出其他顏色。','再放一個倒放的三稜鏡，七色光又合成白光：白光是由各色光混合而成的。']
    :['陽光射入空中的小水滴，經過「折射 → 內部反射 → 折射」射出，各色光分開，形成彩虹。','彩虹一定在太陽的對面：背對太陽才看得到。早上彩虹在西方，下午彩虹在東方。','太陽太高（仰角超過約 42°）時，彩虹落在地平線下看不到，所以中午很少看到彩虹。','彩虹外圈紅、內圈紫。']);}
segOn($('dsMode'),v=>{DS.mode=v;hideStory();dsUI();SIZE.disp();kick();});
segOn($('dsSrc'),v=>{DS.src=v;dsUI();kick();});
$('dsP2').addEventListener('change',()=>{DS.p2=$('dsP2').checked;kick();});
$('dsEx').addEventListener('change',()=>{DS.ex=$('dsEx').checked;kick();});
$('dsH').addEventListener('input',()=>{DS.h=+$('dsH').value;dsUI();kick();});
segOn($('dsFace'),v=>{DS.face=v;dsUI();kick();});
dragger($('cvDs'),()=>{if(DS.mode!=='prism')return [];const G=dsGeo(WD,HD);return [{x:G.sx,y:G.cy+DS.sy*HD,r:26,move:(x,y)=>{DS.sy=clamp((y-G.cy)/HD,-.3,.42);}}];},()=>kick());
$('cvDs').style.touchAction='none';
function dsResults(){let big,f,ck;
  if(DS.mode==='prism'){const s=DS.src;big=s==='white'?(DS.p2?'七色光再合成白光：白光由各色光混合而成':'白光分成紅、橙、黃、綠、藍、靛、紫：光的色散'):s==='rb'?'紅光和藍光各自偏折：藍光偏折較多':'單色光只偏折，不會色散';
    const nr=nGlass(650,false),nv=nGlass(410,false);f=`玻璃中：紅光 n ≈ ${nf(nr,3)}，v ≈ ${nf(3/nr,3)}×10⁸ m/s<br>　　　　紫光 n ≈ ${nf(nv,3)}，v ≈ ${nf(3/nv,3)}×10⁸ m/s<br>真空中各色光都是 3×10⁸ m/s`;
    ck=[['info','色散的原因：各色光在玻璃中的速率不同，偏折程度不同。'],['info','紅光波長最長、在玻璃中最快、偏折最小；紫光波長最短、最慢、偏折最大。'],['info','複色光（白光）會色散；單色光（雷射）不會。']];}
  else{const e=Math.max(0,65*Math.sin(Math.PI*(DS.h-6)/12)),side=DS.h<12?'E':DS.h>12?'W':'S',anti=side==='E'?'W':side==='W'?'E':'N';const vis=DS.face===anti&&e<42;
    big=vis?`看得到彩虹（在${DS.face==='E'?'東':'西'}方天空）`:DS.face!==anti?'面向太陽那一側，看不到彩虹':'太陽太高，彩虹在地平線下';
    f=`彩虹的中心在太陽的正對面、地平線下 ${Math.round(e)}°<br>彩虹半徑約 42°：太陽仰角要小於 42° 才看得到`;
    ck=[['info','早上太陽在東，彩虹在西方；下午太陽在西，彩虹在東方。'],['info','彩虹是色散：陽光進出水滴時折射，各色光偏折程度不同。']];}
  $('dsBig').textContent=big;$('dsF').innerHTML=f;checks($('dsC'),ck);}
SIZE.disp=()=>{({W:WD,H:HD}=fit($('cvDs'),DS.mode==='rain'?.42:.46,280,460));};
UI.disp=()=>{dsUI();};
DRAW.disp=()=>{const g=$('cvDs').getContext('2d');if(DS.mode==='prism')drawPrism(g,WD,HD);else drawRain(g,WD,HD);dsResults();};
