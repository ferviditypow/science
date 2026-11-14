<script>
// ================= 共用 =================
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),TAU=Math.PI*2,D2R=Math.PI/180;
const DPR=()=>Math.min(window.devicePixelRatio||1,2);
const C={};
function readColors(){const s=getComputedStyle(document.documentElement);
  ['bg','panel','ink','muted','line','accent','accent-soft','blue','green','red','purple','ray','inc','out','water','glass'].forEach(k=>C[k]=s.getPropertyValue('--'+k).trim());}
readColors();
function fit(cv,ratio,minH,maxH){const w=Math.max(10,cv.clientWidth);if(!cv.clientWidth&&cv.width>20){const d=DPR();return{W:cv.width/d,H:cv.height/d};}
  const h=Math.round(clamp(w*ratio,minH,maxH));cv.style.height=h+'px';const d=DPR();
  if(cv.width!==Math.round(w*d)||cv.height!==Math.round(h*d)){cv.width=Math.round(w*d);cv.height=Math.round(h*d);}
  cv.getContext('2d').setTransform(d,0,0,d,0,0);return{W:w,H:h};}
function segSet(el,v){el.querySelectorAll('button[data-v]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===String(v))));}
function segOn(el,fn){el.addEventListener('click',e=>{const b=e.target.closest('button[data-v]');if(b){segSet(el,b.dataset.v);fn(b.dataset.v);}});}
const FONT='"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif';
function text(g,s,x,y,{col=C.ink,size=13,bold=false,align='left',base='alphabetic',bg=null,mono=false}={}){
  g.font=`${bold?700:500} ${size}px ${mono?'"IBM Plex Mono",monospace':FONT}`;g.textAlign=align;g.textBaseline=base;
  const w=g.measureText(s).width,cw=g.canvas.clientWidth||1e9;let px=align==='center'?x-w/2:align==='right'?x-w:x;x+=Math.max(4-px,0)+Math.min(cw-4-(px+w),0);
  if(bg){px=align==='center'?x-w/2:align==='right'?x-w:x;const py=base==='middle'?y-size/2-1:base==='top'?y-1:y-size;g.save();g.fillStyle=bg;g.globalAlpha=.82;g.fillRect(px-4,py-2,w+8,size+6);g.restore();}
  g.fillStyle=col;g.fillText(s,x,y);}
function line(g,x1,y1,x2,y2,col,w=2,dash=null){g.strokeStyle=col;g.lineWidth=w;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);}
function head(g,x,y,ang,col,size=10){g.fillStyle=col;g.beginPath();g.moveTo(x,y);g.lineTo(x-size*Math.cos(ang-.42),y-size*Math.sin(ang-.42));g.lineTo(x-size*Math.cos(ang+.42),y-size*Math.sin(ang+.42));g.closePath();g.fill();}
function arrow(g,x1,y1,x2,y2,col,w=2.4){const L=Math.hypot(x2-x1,y2-y1);if(L<2)return;const a=Math.atan2(y2-y1,x2-x1);line(g,x1,y1,x2-Math.cos(a)*5,y2-Math.sin(a)*5,col,w);head(g,x2,y2,a,col,Math.min(11,L*.6));}
function dot(g,x,y,r,col){g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
function handle(g,x,y,r=9){g.fillStyle=C.accent;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke();}
function dragger(cv,handles,after){let cur=null;const pos=ev=>{const r=cv.getBoundingClientRect();return[ev.clientX-r.left,ev.clientY-r.top];};
  const pick=(x,y)=>{let best=null,bd=1e9;for(const h of handles()){const d=Math.hypot(x-h.x,y-h.y);if(d<(h.r||26)&&d<bd){bd=d;best=h;}}return best;};
  cv.addEventListener('pointerdown',ev=>{const[x,y]=pos(ev);const h=pick(x,y);if(!h)return;cur={h,dx:h.x-x,dy:h.y-y};cv.setPointerCapture(ev.pointerId);ev.preventDefault();});
  cv.addEventListener('pointermove',ev=>{const[x,y]=pos(ev);if(!cur){cv.style.cursor=pick(x,y)?'grab':'default';return;}cur.h.move(x+cur.dx,y+cur.dy);after();});
  const up=()=>{cur=null;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);}
const nf=(x,d=1)=>{const r=Math.round(x*Math.pow(10,d))/Math.pow(10,d);return (Object.is(r,-0)?0:r).toFixed(d);};
function sliderBind(id,fn,fmt){const el=$(id),o=$(id+'o');const up=()=>{o.textContent=fmt(+el.value);};el.addEventListener('input',()=>{fn(+el.value);up();hideStory();kick();});up();return v=>{el.value=v;o.textContent=fmt(+el.value);};}
const vOf=h=>Math.sqrt(980*h);   // 淺水波：v＝√(g·水深)，cm/s
const PAPER='#87919a',WHITE='rgba(255,255,255,.92)',LBG='#1d2730';

// ================= 實驗台切換與迴圈 =================
let bench='setup';const BENCHES=['setup','refr','refl'];
const DRAW={},TICK={},UI={};
function setBench(b,noHash){if(!BENCHES.includes(b))b='setup';bench=b;segSet($('benchSeg'),b);
  BENCHES.forEach(k=>$('b-'+k).hidden=k!==b);if(!noHash)history.replaceState(null,'','#'+b);UI[b]&&UI[b]();kick();}
segOn($('benchSeg'),v=>{hideStory();setBench(v);});
let raf=0,lastT=0;
function kick(){if(!raf)raf=requestAnimationFrame(loop);}
function loop(now){raf=0;const dt=lastT?Math.min(.05,(now-lastT)/1000):0;lastT=now;
  let more=false;try{more=TICK[bench]?TICK[bench](dt):false;DRAW[bench]();}catch(e){console.error(e);more=false;}
  if(more&&!raf)raf=requestAnimationFrame(loop);else if(!more)lastT=0;}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{readColors();kick();});
new MutationObserver(()=>{readColors();kick();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
addEventListener('resize',kick);
function showStory(t,p){$('storyT').textContent=t;$('storyP').innerHTML=p;$('story').hidden=false;$('story').scrollIntoView({behavior:'smooth',block:'nearest'});}
function hideStory(){$('story').hidden=true;document.querySelectorAll('.qchip[aria-pressed="true"]').forEach(b=>b.setAttribute('aria-pressed','false'));}
$('storyX').addEventListener('click',hideStory);
$('storyBack').addEventListener('click',()=>$('qpanel').scrollIntoView({behavior:'smooth',block:'start'}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const playTxt=(el,on)=>{el.textContent=on?'❚❚ 暫停':'▶ 播放';};

// ======================================================================
// 1 裝置與亮暗紋：燈光穿過水面（凸的波峰、凹的波谷）投到白紙
// ======================================================================
const N_W=1.33,TL=40,NB=360,NR=1080;
const S1={f:8,h:1,amp:.6,Hl:40,Hs:40,src:'line',sponge:true,rays:true,lab:true,run:!reduced,t:0};
const srcX1=()=>S1.src==='line'?1.5:TL/2;
function wave1(){const v=vOf(S1.h),lam=v/S1.f;return{v,lam,k:TAU/lam,w:TAU*S1.f,A:S1.amp/10};}
function eta1(x,t,W){const xs=srcX1(),d=Math.abs(x-xs);let y=W.A*(1-Math.exp(-d*d/1.2))*Math.sin(W.k*d-W.w*t);
  if(!S1.sponge)y+=.8*W.A*Math.sin(W.k*(2*TL-x-xs)-W.w*t)+.8*W.A*Math.sin(W.k*(x+xs)-W.w*t);return y;}
// 一條光線：從燈（TL/2, Hl）到水面 (x, et)，水面斜率 sl；回傳到槽底與白紙的 x
function ray1(x,et,sl){let dx=x-TL/2,dy=et-S1.Hl;const L=Math.hypot(dx,dy);dx/=L;dy/=L;let nx=-sl,ny=1;const nl=Math.hypot(nx,ny);nx/=nl;ny/=nl;
  const er=1/N_W,ci=-(nx*dx+ny*dy),c=er*ci-Math.sqrt(1-er*er*(1-ci*ci)),tx=er*dx+c*nx,ty=er*dy+c*ny;
  const xb=x+tx/(-ty)*(S1.h+et),ox=clamp(N_W*tx,-.999,.999),oy=Math.sqrt(1-ox*ox);return[xb,xb+ox/oy*S1.Hs];}
let P1=null; // {ratio:Float32Array(NB), M, x0, pts:[...]}
function trace1(){const W=wave1(),t=S1.t,e=1e-3;const cw=new Float32Array(NB),cf=new Float32Array(NB),pts=[];
  const a0=ray1(0,0,0)[1],a1=ray1(TL,0,0)[1],M=(a1-a0)/TL,xc=(a0+a1)/2;
  const put=(arr,xs)=>{const u=((xs-xc)/M+TL/2)/TL*NB-.5,i=Math.floor(u),f=u-i;if(i>=0&&i<NB)arr[i]+=1-f;if(i+1>=0&&i+1<NB)arr[i+1]+=f;};
  for(let i=0;i<NR;i++){const x=(i+.5)/NR*TL,et=eta1(x,t,W),sl=(eta1(x+e,t,W)-eta1(x-e,t,W))/(2*e);
    const r=ray1(x,et,sl);put(cw,r[1]);put(cf,ray1(x,0,0)[1]);if(i%18===9)pts.push([x,et,r[0],r[1]]);}
  const ratio=new Float32Array(NB);for(let i=0;i<NB;i++){const a=(cw[Math.max(0,i-1)]+2*cw[i]+cw[Math.min(NB-1,i+1)])/4,b=(cf[Math.max(0,i-1)]+2*cf[i]+cf[Math.min(NB-1,i+1)])/4;ratio[i]=b>0?a/b:1;}
  let mx=0;for(let i=20;i<NB-20;i++)mx=Math.max(mx,ratio[i]);
  P1={ratio,M,xc,pts,W,mx};}
const gray1=r=>{const v=Math.round(255*clamp(.26+.44*r,0,1));return`rgb(${v},${v},${Math.min(255,v+4)})`;};
const ratioAt=u=>{const i=clamp(Math.floor(u/TL*NB),0,NB-1);return P1.ratio[i];};
TICK.setup=dt=>{if(!S1.run)return false;S1.t+=dt*.12;return true;};
DRAW.setup=()=>{trace1();const W=P1.W,M=P1.M;
  const c2=$('cvS2'),o=fit(c2,.15,130,200),h=c2.getContext('2d'),W2=o.W,H2=o.H,CW=W2;
  const pad=CW<600?10:40,sx=(CW-2*pad)/(TL*Math.max(M,1)),cx=CW/2,Xt=x=>cx+(x-TL/2)*sx,Xs=xs=>cx+(xs-P1.xc)*sx,xs0=srcX1(),x0=Xs(P1.xc-M*TL/2),x1=Xs(P1.xc+M*TL/2);
  if(S1.view==='3d'){if(S3D.ren)upd3S(W);}else{const cv=$('cvS'),{H}=fit(cv,.42,300,470),g=cv.getContext('2d');g.clearRect(0,0,CW,H);
  const yL=22,yScr=H-40,band=20,sy=(yScr-yL-band)/(S1.Hl+S1.Hs),yW=yL+S1.Hl*sy,yB=yW+band,AP=60;
  const Ys=x=>yW-eta1(x,S1.t,W)*AP;
  // 光線
  if(S1.rays){g.strokeStyle=C.ray;g.globalAlpha=.42;g.lineWidth=1;g.beginPath();for(const[x,et,xb,xs]of P1.pts){g.moveTo(cx,yL);g.lineTo(Xt(x),yW-et*AP);g.lineTo(Xt(xb),yB);g.lineTo(Xs(xs),yScr);}g.stroke();g.globalAlpha=1;}
  // 水
  g.fillStyle=C.water;g.globalAlpha=.75;g.beginPath();g.moveTo(Xt(0),yB);for(let x=0;x<=TL+1e-6;x+=.1)g.lineTo(Xt(x),Ys(x));g.lineTo(Xt(TL),yB);g.closePath();g.fill();g.globalAlpha=1;
  g.strokeStyle=C.ink;g.lineWidth=1.4;g.beginPath();for(let x=0;x<=TL+1e-6;x+=.1){x?g.lineTo(Xt(x),Ys(x)):g.moveTo(Xt(x),Ys(x));}g.stroke();
  if(S1.ghost!=null){g.strokeStyle=C.muted;g.lineWidth=1.2;g.setLineDash([4,4]);g.beginPath();for(let x=0;x<=TL+1e-6;x+=.1){const y=yW-eta1(x,S1.ghost,W)*AP;x?g.lineTo(Xt(x),y):g.moveTo(Xt(x),y);}g.stroke();g.setLineDash([]);}
  // 槽
  g.strokeStyle=C.glass;g.lineWidth=3;g.beginPath();g.moveTo(Xt(0)-2,yW-16);g.lineTo(Xt(0)-2,yB+1.5);g.lineTo(Xt(TL)+2,yB+1.5);g.lineTo(Xt(TL)+2,yW-16);g.stroke();
  if(S1.sponge){g.fillStyle='#d9b36c';[[Xt(0),1],[Xt(TL),-1]].forEach(([x,s])=>{g.fillRect(s>0?x:x-10,yW-10,10,band+8);});text(g,'海綿',Xt(TL)+6,yW+4,{size:11,col:C.muted});}
  // 起波器
  const xs=Xt(xs0),bob=Math.sin(-W.w*S1.t)*W.A*AP;line(g,xs,yW-44,xs,yW-6-bob,C.ink,2);g.fillStyle=C.ink;if(S1.src==='line')g.fillRect(xs-4,yW-8-bob,8,10);else{g.beginPath();g.arc(xs,yW-3-bob,5,0,TAU);g.fill();}
  g.fillStyle=C.muted;g.fillRect(xs-12,yW-56,24,12);text(g,'起波器（馬達）',xs+16,yW-46,{size:11,col:C.muted,bg:C.panel});
  // 燈
  const gl=g.createRadialGradient(cx,yL,2,cx,yL,24);gl.addColorStop(0,'rgba(255,214,90,.95)');gl.addColorStop(1,'rgba(255,214,90,0)');g.fillStyle=gl;g.beginPath();g.arc(cx,yL,24,0,TAU);g.fill();dot(g,cx,yL,7,'#f4b400');text(g,'燈',cx+14,yL+4,{size:12,bold:true});
  text(g,'水',Xt(0)+8,yB-5,{size:11,col:C.ink});text(g,'玻璃底板',Xt(TL)-6,yB+15,{size:11,col:C.muted,align:'right'});
  // 白紙
  for(let px=Math.floor(x0);px<x1;px+=2){const u=(px+1-x0)/(x1-x0)*TL;g.fillStyle=gray1(ratioAt(u));g.fillRect(px,yScr,2,22);}
  g.strokeStyle=C.line;g.lineWidth=1;g.strokeRect(x0,yScr,x1-x0,22);text(g,'白紙（屏幕）',x0+4,yScr+37,{size:12,bold:true});
  // 尺寸
  if(CW>=600){const xd=Xt(0)-22;line(g,xd,yL,xd,yW,C.muted,1);line(g,xd-4,yL,xd+4,yL,C.muted,1);line(g,xd-4,yW,xd+4,yW,C.muted,1);text(g,S1.Hl+' cm',xd-4,(yL+yW)/2+4,{size:11,col:C.muted,align:'right'});
    line(g,xd,yB,xd,yScr,C.muted,1);line(g,xd-4,yB,xd+4,yB,C.muted,1);line(g,xd-4,yScr,xd+4,yScr,C.muted,1);text(g,S1.Hs+' cm',xd-4,(yB+yScr)/2+4,{size:11,col:C.muted,align:'right'});}
  // 標示：波峰→亮紋、波谷→暗紋
  if(S1.lab&&S1.sponge&&S1.amp>0){const tgt=TL*.66,ph=W.w*S1.t,m=Math.round((W.k*(tgt-xs0)-ph-Math.PI/2)/TAU),xc=xs0+(Math.PI/2+ph+TAU*m)/W.k,xt=xc+W.lam/2;
    const lab=(x,up,s,col,al)=>{if(x<1||x>TL-1)return;const r=ray1(x,eta1(x,S1.t,W),0),px=Xt(x),py=Ys(x);line(g,px,py-4,px,py-up+4,col,1.2);text(g,s,px+(al==='right'?6:-6),py-up,{size:12,bold:true,col,align:al,bg:C.panel});
      const sxp=Xs(r[1]);line(g,sxp,yScr-3,sxp,yScr-14,col,1.6);};
    const nr=CW<700;lab(xc,30,nr?'波峰 → 亮紋':'波峰：像凸透鏡，光會聚 → 亮紋',C.accent,'right');lab(xt,30,nr?'波谷 → 暗紋':'波谷：像凹透鏡，光發散 → 暗紋',C.inc,'left');}
  }
  // ---- 白紙俯視 ----
  h.fillStyle=C.panel;h.fillRect(0,0,W2,H2);const top=4,bh=H2-30;
  if(S1.src==='line'){for(let px=Math.floor(x0);px<x1;px+=2){const u=(px+1-x0)/(x1-x0)*TL;h.fillStyle=gray1(ratioAt(u));h.fillRect(px,top,2,bh);}}
  else{const w2=Math.ceil((x1-x0)/2),h2=Math.ceil(bh/2),im=h.createImageData(w2,h2),d=im.data,sc=sx*M/2,cxp=w2/2,cyp=h2/2;
    for(let j=0;j<h2;j++)for(let i=0;i<w2;i++){const r=Math.hypot(i-cxp,j-cyp)/sc,v=Math.round(255*clamp(.26+.44*ratioAt(TL/2+Math.min(r,TL/2-.2)),0,1)),q=(j*w2+i)*4;d[q]=v;d[q+1]=v;d[q+2]=Math.min(255,v+4);d[q+3]=255;}
    const oc=DRAW.setup.oc||(DRAW.setup.oc=document.createElement('canvas'));oc.width=w2;oc.height=h2;oc.getContext('2d').putImageData(im,0,0);h.imageSmoothingEnabled=true;h.drawImage(oc,x0,top,x1-x0,bh);}
  h.strokeStyle=C.line;h.strokeRect(x0,top,x1-x0,bh);
  // 尺（白紙上的公分）
  const stp=M*TL>120?20:M*TL>60?10:5;for(let c=0;c<=M*TL+1e-6;c+=stp){const px=x0+c*sx;line(h,px,top+bh,px,top+bh+6,C.muted,1);text(h,String(c),px,top+bh+19,{size:10,col:C.muted,align:'center',mono:true});}
  text(h,'cm',x1+2,top+bh+19,{size:10,col:C.muted});
  // 亮紋間距標示
  if(S1.sponge&&S1.amp>0){const ph=W.w*S1.t,base=S1.src==='line'?xs0:TL/2,m=Math.round((W.k*(TL*.55-base)-ph-Math.PI/2)/TAU),xa=base+(Math.PI/2+ph+TAU*m)/W.k,xb=xa+W.lam;
    if(xb<TL-1){const pa=Xs(ray1(xa,W.A,0)[1]),pb=Xs(ray1(xb,W.A,0)[1]),yy=top+14;line(h,pa,yy,pb,yy,C.accent,2);line(h,pa,yy-6,pa,yy+6,C.accent,2);line(h,pb,yy-6,pb,yy+6,C.accent,2);
      text(h,`亮紋間距 ${nf(M*W.lam,1)} cm`,(pa+pb)/2,yy+20,{size:12,bold:true,col:'#fff',align:'center',bg:LBG});}}
  // ---- 數值 ----
  const fc=W.A>0?1/((N_W-1)*W.A*W.k*W.k):Infinity,si=fc<S1.Hl?1/(1/fc-1/S1.Hl):Infinity;
  $('sNow').innerHTML=[['波速 v（由水深決定）',nf(W.v,1)+' cm/s'],['實際波長 λ ＝ v ÷ f',`${nf(W.v,1)} ÷ ${S1.f} ＝ ${nf(W.lam,2)} cm`],['投影放大率',`約 (${S1.Hl}＋${S1.Hs}) ÷ ${S1.Hl} ＝ ${nf(M,2)} 倍`],
    ['白紙上的亮紋間距',`${nf(M,2)} × ${nf(W.lam,2)} ＝ ${nf(M*W.lam,1)} cm`],['亮紋在白紙上移動的速率',nf(M*W.v,1)+' cm/s'],['最亮處是平均亮度的',nf(P1.mx,1)+' 倍']].map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
  let say;if(S1.amp===0)say='水面是平的：光線均勻地照到白紙上，沒有亮暗紋。';
  else if(!S1.sponge)say='沒有海綿條：傳到邊緣的波反射回來，和原來的波疊在一起，白紙上的條紋忽明忽暗、不再整齊地往前走。所以實驗時四周要圍海綿條吸收水波。';
  else if(si===Infinity||S1.Hs<.55*si)say='白紙離水槽太近（或水波振幅太小）：光線還沒會聚好，亮紋寬、對比低。把白紙放遠一點，或把振幅調大。';
  else if(S1.Hs>1.5*si)say='白紙比會聚點還遠：光線會聚後又交叉散開，一條亮紋變寬，甚至分成兩條細線。把白紙移近一點最清楚。';
  else say='白紙差不多在光線會聚的位置：每個波峰下方一條又細又亮的亮紋，波谷下方是暗紋。亮紋跟著波一起往前走；白紙上的間距是實際波長的 '+nf(M,2)+' 倍。';
  $('sSay').textContent=say;};
segOn($('sSrc'),v=>{S1.src=v;hideStory();kick();});
$('sSponge').addEventListener('change',e=>{S1.sponge=e.target.checked;hideStory();kick();});
$('sRays').addEventListener('change',e=>{S1.rays=e.target.checked;kick();});
$('sLab').addEventListener('change',e=>{S1.lab=e.target.checked;kick();});
const setSF=sliderBind('sF',v=>S1.f=v,v=>v+' Hz'),setSH=sliderBind('sH',v=>S1.h=v,v=>nf(v,1)+' cm'),setSA=sliderBind('sA',v=>S1.amp=v,v=>nf(v,1)+' mm'),
  setSHl=sliderBind('sHl',v=>{S1.Hl=v;cam3S();},v=>v+' cm'),setSHs=sliderBind('sHs',v=>{S1.Hs=v;cam3S();},v=>v+' cm');
UI.setup=()=>{segSet($('sSrc'),S1.src);$('sSponge').checked=S1.sponge;playTxt($('sPlay'),S1.run);$('sRays').checked=S1.rays;$('sLab').checked=S1.lab;segSet($('sView'),S1.view);segSet($('sCam'),S1.cam);const d3=S1.view==='3d';$('cvS').hidden=d3;$('st3').hidden=!d3;$('sCamW').style.display=d3?'contents':'none';if(d3&&!S3D.ren)init3S();};

// ----- 逐格播放（三個實驗台共用） -----
let STEPF=.25;
const benchS=b=>b==='setup'?S1:b==='refr'?R2:M3,benchK=b=>b==='setup'?'t':'T';
function stepInfo(){[['s','setup'],['r','refr'],['m','refl']].forEach(([p,b])=>{const S=benchS(b),n=S.nstep||0;$(p+'Info').textContent=n?`逐格：${n>0?'＋':'−'}${Math.abs(n)} 週期（波前${n>0?'前進':'後退'} ${Math.abs(n)} 個波長）`:'';});}
function stepBench(b,dir){const S=benchS(b),k=benchK(b);S.run=false;S.ghost=S[k];S[k]+=dir*STEPF/S.f;S.nstep=Math.round(((S.nstep||0)+dir*STEPF)*1000)/1000;UI[b]&&UI[b]();stepInfo();hideStory();kick();}
function playBench(b){const S=benchS(b);S.run=!S.run;if(S.run){S.ghost=null;S.nstep=0;}UI[b]&&UI[b]();stepInfo();kick();}
[['s','setup'],['r','refr'],['m','refl']].forEach(([p,b])=>{$(p+'Back').addEventListener('click',()=>stepBench(b,-1));$(p+'Step').addEventListener('click',()=>stepBench(b,1));$(p+'Play').addEventListener('click',()=>playBench(b));
  segOn($(p+'Fg'),v=>{STEPF=+v;document.querySelectorAll('.fgseg').forEach(el=>segSet(el,v));});});
document.addEventListener('keydown',e=>{const t=e.target.tagName;if(t==='INPUT'||t==='TEXTAREA'||t==='SELECT'||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='ArrowRight'){stepBench(bench,1);e.preventDefault();}else if(e.key==='ArrowLeft'){stepBench(bench,-1);e.preventDefault();}else if(e.key===' '&&t!=='BUTTON'){playBench(bench);e.preventDefault();}});

// ======================================================================
// 1 的 3D 立體圖（Three.js，切開的水槽：正面切口就是側視圖）
// ======================================================================
const S3D={ren:null,loading:false,fail:false},K3=.25,TZ=26,AP3=14,NX3=160,NZ3=56,NR3=44;   // 1 cm＝0.25 單位；波高放大 14 倍
S1.view='3d';S1.cam='tilt';
const eta3=(x,z,t,W)=>S1.src==='line'?eta1(x,t,W):eta1(TL/2+Math.hypot(x-TL/2,z),t,W);
async function init3S(){if(S3D.ren||S3D.loading||S3D.fail)return;S3D.loading=true;
  try{const THREE=await import('three'),{OrbitControls}=await import('../vendor/three/OrbitControls.js'),cv=$('cvS3');
    const ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});ren.setPixelRatio(DPR());
    const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(34,1,.5,900),ctl=new OrbitControls(cam,cv);ctl.addEventListener('change',kick);
    scene.add(new THREE.HemisphereLight(0xffffff,0x8a97a6,1.7));const dl=new THREE.DirectionalLight(0xffffff,1.5);dl.position.set(-12,40,26);scene.add(dl);
    const R={THREE,ren,scene,cam,ctl,cv};
    // 水面
    const sg=new THREE.PlaneGeometry(TL*K3,TZ*K3,NX3,NZ3);sg.rotateX(-Math.PI/2);sg.setAttribute('color',new THREE.BufferAttribute(new Float32Array(sg.attributes.position.count*3),3));
    R.surf=new THREE.Mesh(sg,new THREE.MeshPhongMaterial({vertexColors:true,shininess:100,specular:0xbfe8ff,transparent:true,opacity:.86,side:THREE.DoubleSide}));R.surf.renderOrder=3;scene.add(R.surf);
    // 四面切口
    const wm=new THREE.MeshBasicMaterial({color:0x4aa3d8,transparent:true,opacity:.42,side:THREE.DoubleSide,depthWrite:false});
    const mkWall=(n,fn)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array((n+1)*6),3));const idx=[];for(let i=0;i<n;i++){const a=i*2;idx.push(a,a+1,a+2,a+2,a+1,a+3);}g.setIndex(idx);const m=new THREE.Mesh(g,wm);m.renderOrder=2;scene.add(m);return{g,n,fn};};
    R.walls=[mkWall(NX3,u=>[u*TL,TZ/2]),mkWall(NX3,u=>[u*TL,-TZ/2]),mkWall(NZ3,u=>[0,-TZ/2+u*TZ]),mkWall(NZ3,u=>[TL,-TZ/2+u*TZ])];
    const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(new Float32Array((NX3+1)*3),3));R.prof=new THREE.Line(pg,new THREE.LineBasicMaterial({color:0x10202e}));R.prof.renderOrder=5;scene.add(R.prof);
    const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(new Float32Array((NX3+1)*3),3));R.ghost=new THREE.Line(gg,new THREE.LineDashedMaterial({color:0x6b7785,dashSize:.22,gapSize:.16}));R.ghost.renderOrder=5;scene.add(R.ghost);
    // 玻璃底板與槽壁
    R.glass=new THREE.Mesh(new THREE.BoxGeometry(TL*K3+.5,.12,TZ*K3+.5),new THREE.MeshPhongMaterial({color:0xcfe3f2,transparent:true,opacity:.4,depthWrite:false}));scene.add(R.glass);
    R.rim=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(TL*K3+.5,1.3,TZ*K3+.5)),new THREE.LineBasicMaterial({color:0x7c8894}));scene.add(R.rim);
    // 海綿條
    R.sponge=new THREE.Group();const sm=new THREE.MeshLambertMaterial({color:0xd9b36c});[[0,-TZ*K3/2+.12,TL*K3,.24],[-TL*K3/2+.12,0,.24,TZ*K3],[TL*K3/2-.12,0,.24,TZ*K3]].forEach(([x,z,w,d])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,.5,d),sm);m.position.set(x,.12,z);R.sponge.add(m);});scene.add(R.sponge);
    // 起波器
    const dark=new THREE.MeshLambertMaterial({color:0x2b3138});R.genL=new THREE.Group();R.genP=new THREE.Group();
    {const bar=new THREE.Mesh(new THREE.BoxGeometry(.28,.34,TZ*K3*.9),dark);R.genL.add(bar);const rod=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,2.2,8),dark);rod.position.y=1.1;R.genL.add(rod);const mot=new THREE.Mesh(new THREE.BoxGeometry(.8,.55,.8),new THREE.MeshLambertMaterial({color:0x59626d}));mot.position.y=2.4;R.genL.add(mot);}
    {const ball=new THREE.Mesh(new THREE.SphereGeometry(.22,16,12),dark);R.genP.add(ball);const rod=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,2.2,8),dark);rod.position.y=1.1;R.genP.add(rod);const arm=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,TZ*K3/2+.6),dark);arm.position.set(0,2.2,-TZ*K3/4-.3);R.genP.add(arm);const mot=new THREE.Mesh(new THREE.BoxGeometry(.8,.55,.8),new THREE.MeshLambertMaterial({color:0x59626d}));mot.position.set(0,2.2,-TZ*K3/2-.6);R.genP.add(mot);}
    scene.add(R.genL);scene.add(R.genP);
    // 燈
    R.lamp=new THREE.Mesh(new THREE.SphereGeometry(.42,20,14),new THREE.MeshBasicMaterial({color:0xffc933}));scene.add(R.lamp);
    {const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),gr=x.createRadialGradient(64,64,4,64,64,64);gr.addColorStop(0,'rgba(255,220,110,.95)');gr.addColorStop(1,'rgba(255,220,110,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);
      R.glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));R.glow.scale.set(4,4,1);scene.add(R.glow);}
    // 白紙與桌面
    R.pc=document.createElement('canvas');R.pc.width=512;R.pc.height=Math.round(512*TZ/TL);R.ptex=new THREE.CanvasTexture(R.pc);R.ptex.colorSpace=THREE.SRGBColorSpace;
    const ppg=new THREE.PlaneGeometry(1,1);ppg.rotateX(-Math.PI/2);R.paper=new THREE.Mesh(ppg,new THREE.MeshBasicMaterial({map:R.ptex,side:THREE.DoubleSide}));scene.add(R.paper);
    const tg=new THREE.PlaneGeometry(1,1);tg.rotateX(-Math.PI/2);R.table=new THREE.Mesh(tg,new THREE.MeshBasicMaterial({color:0xc9d0d8,side:THREE.DoubleSide,transparent:true,opacity:.55}));scene.add(R.table);
    // 光線
    const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(NR3*3*2*3),3));R.rays=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xe59a1f,transparent:true,opacity:.55}));scene.add(R.rays);
    const cg=new THREE.BufferGeometry();cg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(4*2*2*3),3));R.cone=new THREE.LineSegments(cg,new THREE.LineBasicMaterial({color:0xe59a1f,transparent:true,opacity:.22}));scene.add(R.cone);
    // 標籤
    R.tags={};[['lamp','燈'],['gen','起波器（接馬達）'],['sp','海綿條'],['glass','玻璃底板'],['paper','白紙（屏幕）'],['crest','波峰：像凸透鏡 → 亮紋','c'],['trough','波谷：像凹透鏡 → 暗紋','t'],['bright','亮紋','c'],['darkf','暗紋','t']].forEach(([k,s,c])=>{const d=document.createElement('div');d.className='tag3'+(c?' '+c:'');d.textContent=s;$('ov3').appendChild(d);R.tags[k]=d;});
    cv.addEventListener('webglcontextlost',e=>{e.preventDefault();S3D.lost=true;});cv.addEventListener('webglcontextrestored',()=>{S3D.lost=false;kick();});
    Object.assign(S3D,R);$('load3').hidden=true;size3S();cam3S();kick();}
  catch(e){console.warn('3D 無法啟動，改用 2D',e);S3D.fail=true;S1.view='2d';UI.setup();kick();}
  S3D.loading=false;}
function size3S(){if(!S3D.ren)return;const st=$('st3'),fs=document.fullscreenElement===st,w=Math.max(200,st.clientWidth),h=fs?Math.min(innerHeight,Math.round(w*.62)):w<600?clamp(Math.round(w*1.05),320,520):clamp(Math.round(w*.58),320,640);
  S3D.ren.setSize(w,h,false);S3D.cv.style.height=h+'px';S3D.cam.aspect=w/h;S3D.cam.updateProjectionMatrix();S3D.w=w;S3D.h=h;}
function ext3S(){const M=(S1.Hl+S1.Hs)/S1.Hl,yL=S1.Hl*K3,yP=-(S1.h+S1.Hs)*K3,wd=M*TL*K3,dp=M*TZ*K3;return{M,yL,yP,wd,dp};}
function cam3S(){if(!S3D.ren)return;const E=ext3S(),hh=E.yL-E.yP+2,t34=Math.tan(17*D2R),a=S3D.cam.aspect,cy=(E.yL+E.yP)/2;let dir,tg,dist;
  if(S1.cam==='side'){dir=[0,.06,1];tg=[0,cy-1,0];dist=Math.max((hh+E.dp*.12)/2/t34,(E.wd+2)/2/t34/a)*1.12+E.dp/2;}
  else if(S1.cam==='paper'){dir=[.25,.75,.62];tg=[0,E.yP,0];dist=Math.max((E.dp+E.wd*.3)/2/t34,(E.wd+2)/2/t34/a)*1.1;}
  else{dir=[.52,.3,.8];tg=[0,cy,0];dist=Math.max((hh+E.dp*.35)/2/t34,(E.wd*.95+E.dp*.5)/2/t34/a)*1.02;}
  const l=Math.hypot(...dir);S3D.cam.position.set(tg[0]+dir[0]/l*dist,tg[1]+dir[1]/l*dist,tg[2]+dir[2]/l*dist);S3D.ctl.target.set(...tg);S3D.ctl.minDistance=6;S3D.ctl.maxDistance=dist*3;S3D.ctl.update();}
function upd3S(W){const R=S3D;if(R.lost)return;if(!R.w||Math.abs(R.w-$('st3').clientWidth)>1)size3S();
  const E=ext3S(),t=S1.t,hb=-S1.h*K3,wx=x=>(x-TL/2)*K3,A=AP3*K3;
  // 水面
  const p=R.surf.geometry.attributes.position,c=R.surf.geometry.attributes.color,amp=Math.max(W.A*AP3*K3,1e-6);
  for(let i=0;i<p.count;i++){const x=p.getX(i)/K3+TL/2,z=p.getZ(i)/K3,e=eta3(x,z,t,W)*A;p.setY(i,e);const u=clamp(.5+.5*e/amp/1.6,0,1);c.setXYZ(i,.16+.62*u,.5+.42*u,.74+.24*u);}
  p.needsUpdate=true;c.needsUpdate=true;R.surf.geometry.computeVertexNormals();
  R.walls.forEach(w=>{const a=w.g.attributes.position;for(let i=0;i<=w.n;i++){const[x,z]=w.fn(i/w.n),e=eta3(x,z,t,W)*A;a.setXYZ(i*2,wx(x),hb,z*K3);a.setXYZ(i*2+1,wx(x),e,z*K3);}a.needsUpdate=true;w.g.computeBoundingSphere();});
  const zf=TZ/2*K3+.01,pp=R.prof.geometry.attributes.position;for(let i=0;i<=NX3;i++){const x=i/NX3*TL;pp.setXYZ(i,wx(x),eta3(x,TZ/2,t,W)*A,zf);}pp.needsUpdate=true;
  R.ghost.visible=S1.ghost!=null;if(R.ghost.visible){const q=R.ghost.geometry.attributes.position;for(let i=0;i<=NX3;i++){const x=i/NX3*TL;q.setXYZ(i,wx(x),eta3(x,TZ/2,S1.ghost,W)*A,zf);}q.needsUpdate=true;R.ghost.computeLineDistances();}
  R.glass.position.y=hb-.06;R.rim.position.y=hb+.65;R.sponge.visible=S1.sponge;R.sponge.position.y=hb*.5;
  const bob=Math.sin(-W.w*t)*W.A*A;R.genL.visible=S1.src==='line';R.genP.visible=S1.src==='point';R.genL.position.set(wx(1.5),bob,0);R.genP.position.set(0,bob,0);
  R.lamp.position.set(0,E.yL,0);R.glow.position.set(0,E.yL,0);
  // 白紙
  const pc=R.pc,g=pc.getContext('2d'),pw=pc.width,ph=pc.height;
  if(S1.src==='line'){for(let i=0;i<pw;i+=2){g.fillStyle=gray1(ratioAt((i+1)/pw*TL));g.fillRect(i,0,2,ph);}}
  else{const w2=pw/2,h2=Math.round(ph/2),im=R.pim||(R.pim=g.createImageData(w2,h2)),d=im.data,sc=w2/TL;for(let j=0;j<h2;j++)for(let i=0;i<w2;i++){const r=Math.hypot(i+.5-w2/2,j+.5-h2/2)/sc,v=Math.round(255*clamp(.26+.44*ratioAt(Math.min(TL/2+r,TL-.1)),0,1)),o=(j*w2+i)*4;d[o]=v;d[o+1]=v;d[o+2]=Math.min(255,v+4);d[o+3]=255;}
    const oc=R.poc||(R.poc=document.createElement('canvas'));oc.width=w2;oc.height=h2;oc.getContext('2d').putImageData(im,0,0);g.imageSmoothingEnabled=true;g.drawImage(oc,0,0,pw,ph);}
  R.ptex.needsUpdate=true;const pxc=(P1.xc-TL/2)*K3;R.paper.scale.set(E.wd,1,E.dp);R.paper.position.set(pxc,E.yP,0);R.table.scale.set(E.wd+3,1,E.dp+3);R.table.position.set(pxc,E.yP-.05,0);
  // 光線（通過中央 z＝0 的那一排）
  R.rays.visible=S1.rays;R.cone.visible=S1.rays;
  if(S1.rays){const a=R.rays.geometry.attributes.position;let k=0;const n=Math.min(NR3,P1.pts.length),st=P1.pts.length/n;for(let q=0;q<n;q++){const[x,et,xb,xs]=P1.pts[Math.floor(q*st)],P=[[0,E.yL],[wx(x),et*A],[wx(xb),hb],[wx(xs),E.yP]];for(let s=0;s<3;s++){a.setXYZ(k++,P[s][0],P[s][1],0);a.setXYZ(k++,P[s+1][0],P[s+1][1],0);}}
    R.rays.geometry.setDrawRange(0,k);a.needsUpdate=true;R.rays.geometry.computeBoundingSphere();
    const b=R.cone.geometry.attributes.position;let m=0;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sz])=>{const tx=sx*TL/2*K3,tz=sz*TZ/2*K3;b.setXYZ(m++,0,E.yL,0);b.setXYZ(m++,tx,0,tz);b.setXYZ(m++,tx,hb,tz);b.setXYZ(m++,pxc+sx*E.wd/2,E.yP,sz*E.dp/2);});b.needsUpdate=true;R.cone.geometry.computeBoundingSphere();}
  R.ctl.update();R.ren.render(R.scene,R.cam);
  // 標籤
  const v=new R.THREE.Vector3(),put=(k,x,y,z,dy=0)=>{const el=R.tags[k];if(x==null||!S1.lab){el.style.display='none';return;}v.set(x,y,z).project(R.cam);if(v.z>1){el.style.display='none';return;}el.style.display='';el.style.left=((v.x+1)/2*R.w)+'px';el.style.top=((1-v.y)/2*R.h+dy)+'px';};
  const nr=R.w<600;if(R.nr!==nr){R.nr=nr;R.tags.crest.textContent=nr?'波峰 → 亮紋':'波峰：像凸透鏡 → 亮紋';R.tags.trough.textContent=nr?'波谷 → 暗紋':'波谷：像凹透鏡 → 暗紋';R.tags.gen.textContent=nr?'起波器':'起波器（接馬達）';}
  put('lamp',0,E.yL,0,-22);put('gen',S1.src==='line'?wx(1.5):0,2.9,S1.src==='line'?0:-TZ*K3/2-.6,-16);put('sp',S1.sponge&&!nr?TL*K3/2:null,.3,0,-14);put('glass',nr?null:-TL*K3/2,hb,TZ*K3/2,16);put('paper',pxc-E.wd/2+2,E.yP,E.dp/2,16);
  let xc=null,xt=null;if(S1.sponge&&S1.amp>0&&S1.src==='line'){const xs0=1.5,phs=W.w*t,m=Math.round((W.k*(TL*.62-xs0)-phs-Math.PI/2)/TAU);xc=xs0+(Math.PI/2+phs+TAU*m)/W.k;xt=xc+W.lam/2;if(xt>TL-1)xt=xc-W.lam/2;}
  put('crest',xc==null?null:wx(xc),xc==null?0:W.A*A,TZ*K3/2,-16);put('trough',xt==null?null:wx(xt),xt==null?0:-W.A*A,TZ*K3/2,18);
  const scx=x=>(ray1(x,0,0)[1]-TL/2)*K3;put('bright',xc==null?null:scx(xc),E.yP,E.dp/2,-12);put('darkf',xt==null?null:scx(xt),E.yP,E.dp/2,14);}
function setView1(v){S1.view=S3D.fail?'2d':v;UI.setup();if(S1.view==='3d'){if(!S3D.ren)init3S();else{size3S();}}kick();}
segOn($('sView'),v=>{hideStory();setView1(v);});
segOn($('sCam'),v=>{S1.cam=v;cam3S();kick();});
$('sFS').addEventListener('click',()=>{const st=$('st3');if(document.fullscreenElement)document.exitFullscreen();else if(st.requestFullscreen)st.requestFullscreen().catch(()=>{});});
document.addEventListener('fullscreenchange',()=>{$('sFS').textContent=document.fullscreenElement?'✕ 離開全螢幕':'⛶ 全螢幕';setTimeout(()=>{size3S();kick();},120);});
addEventListener('resize',()=>{if(S3D.ren&&bench==='setup'&&S1.view==='3d'){size3S();kick();}});

// ======================================================================
// 俯視水波槽：用射線追蹤算波前（深淺水折射、障礙物反射共用）
// ======================================================================
const TW=40,TH=22;
function traceRays(sc){const rays=[],ds=.08,starts=[];
  if(sc.src==='line'){for(let y=-5;y<=TH+5+1e-9;y+=.3)starts.push([0,y,1,0]);}
  else{for(let a=0;a<360;a+=2){const r=a*D2R;starts.push([sc.px,sc.py,Math.cos(r),Math.sin(r)]);}}
  for(const[x0,y0,dx0,dy0]of starts){let x=x0,y=y0,dx=dx0,dy=dy0,t=0,nb=0,ins=sc.g?sc.g(x,y)<0:false;const X=[x],Y=[y],T=[t],B=[0],I=[ins?1:0],ev=[];
    if(sc.kind==='wall'&&ins){rays.push({X,Y,T,B,I,ev});continue;}
    for(let i=0;i<1500;i++){const v=ins?sc.v2:sc.v1,qx=x+dx*ds,qy=y+dy*ds;
      if(sc.g&&((sc.g(qx,qy)<0)!==ins)){let a=0,b=ds;for(let k=0;k<18;k++){const m=(a+b)/2;if((sc.g(x+dx*m,y+dy*m)<0)===ins)a=m;else b=m;}
        const hx=x+dx*a,hy=y+dy*a,e=1e-3;t+=a/v;let nx=sc.g(hx+e,hy)-sc.g(hx-e,hy),ny=sc.g(hx,hy+e)-sc.g(hx,hy-e);const nl=Math.hypot(nx,ny)||1;nx/=nl;ny/=nl;if(nx*dx+ny*dy>0){nx=-nx;ny=-ny;}
        const ci=-(nx*dx+ny*dy),ix=dx,iy=dy;let type;
        if(sc.kind==='wall'){dx+=2*ci*nx;dy+=2*ci*ny;type='refl';}
        else{const vn=ins?sc.v1:sc.v2,er=vn/v,s2=er*er*(1-ci*ci);if(s2>=1){if(sc.noTir){sc.lost=(sc.lost||0)+1;X.push(hx);Y.push(hy);T.push(t);B.push(nb);I.push(ins?1:0);break;}dx+=2*ci*nx;dy+=2*ci*ny;type='tir';}else{const c=er*ci-Math.sqrt(1-s2);dx=er*dx+c*nx;dy=er*dy+c*ny;ins=!ins;type='refr';}}
        const dl=Math.hypot(dx,dy);dx/=dl;dy/=dl;nb++;X.push(hx);Y.push(hy);T.push(t);B.push(nb);I.push(ins?1:0);ev.push({x:hx,y:hy,nx,ny,ix,iy,ox:dx,oy:dy,type});
        x=hx+dx*2e-3;y=hy+dy*2e-3;if(nb>6)break;continue;}
      x=qx;y=qy;t+=ds/v;X.push(x);Y.push(y);T.push(t);B.push(nb);I.push(ins?1:0);
      if(x<-6||x>TW+6||y<-7||y>TH+7)break;}
    rays.push({X,Y,T,B,I,ev});}
  return rays;}
function crestPts(rays,tau){return rays.map(r=>{const T=r.T,n=T.length-1;if(n<1||tau>T[n]||tau<0)return null;let lo=0,hi=n;while(hi-lo>1){const m=(lo+hi)>>1;if(T[m]<=tau)lo=m;else hi=m;}
  const f=(tau-T[lo])/((T[hi]-T[lo])||1);return[r.X[lo]+(r.X[hi]-r.X[lo])*f,r.Y[lo]+(r.Y[hi]-r.Y[lo])*f,r.B[lo]];});}
// 畫波前（亮線＝波峰）。opt：{closed,gap,inc,ref}
function drawCrests(g,rays,T,P,X,Y,opt){const tmax=rays.reduce((m,r)=>Math.max(m,r.T[r.T.length-1]),0),gap=opt.gap||1.4,p=new Path2D();
  for(let tau=((T%P)+P)%P;tau<=tmax;tau+=P){const pts=crestPts(rays,tau),n=pts.length,m=opt.closed?n:n-1;
    for(let i=0;i<m;i++){const a=pts[i],b=pts[(i+1)%n];if(!a||!b||Math.hypot(a[0]-b[0],a[1]-b[1])>gap)continue;const refl=a[2]>0&&b[2]>0;if(refl?opt.ref===false:opt.inc===false)continue;p.moveTo(X(a[0]),Y(a[1]));p.lineTo(X(b[0]),Y(b[1]));}}
  g.save();if(opt.ghost){g.strokeStyle='rgba(20,30,40,.75)';g.lineWidth=1.6;g.setLineDash([6,5]);g.stroke(p);g.restore();return;}g.lineCap='round';g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=opt.lw*2.4;g.stroke(p);g.strokeStyle=WHITE;g.lineWidth=opt.lw;g.stroke(p);g.restore();}
function tankGeo(cv){const{W,H}=fit(cv,TH/TW,230,560),k=Math.min(W/TW,H/TH),ox=(W-TW*k)/2,oy=(H-TH*k)/2;return{W,H,k,ox,oy,X:x=>ox+x*k,Y:y=>oy+y*k};}
function tankBase(g,G){g.clearRect(0,0,G.W,G.H);g.fillStyle=PAPER;g.fillRect(G.ox,G.oy,TW*G.k,TH*G.k);}
function tankFrame(g,G,src){g.strokeStyle=C.glass;g.lineWidth=3;g.strokeRect(G.ox,G.oy,TW*G.k,TH*G.k);if(src==='line'){g.fillStyle='#39424b';g.fillRect(G.ox,G.oy,5,TH*G.k);text(g,'起波器',G.ox+9,G.oy+TH*G.k-8,{size:11,col:'#fff',bg:LBG});}}
function drawRays(g,rays,X,Y,step,col){g.save();g.strokeStyle=col;g.lineWidth=1.3;g.globalAlpha=.9;g.setLineDash([6,5]);g.beginPath();for(let i=Math.floor(step/2);i<rays.length;i+=step){const r=rays[i];if(r.X.length<2)continue;g.moveTo(X(r.X[0]),Y(r.Y[0]));
    let last=0;for(let j=1;j<r.X.length;j++){if(r.B[j]!==r.B[j-1]||j===r.X.length-1){g.lineTo(X(r.X[j]),Y(r.Y[j]));last=j;}}}g.stroke();g.restore();}
// 畫角度：頂點 (px,py)，從向量 a 到向量 b
function angArc(g,px,py,ax,ay,bx,by,r,col,label){const a0=Math.atan2(ay,ax),a1=Math.atan2(by,bx);let d=a1-a0;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.arc(px,py,r,a0,a0+d,d<0);g.stroke();
  const am=a0+d*.72;text(g,label,px+Math.cos(am)*(r+34),py+Math.sin(am)*(r+34),{size:13,bold:true,col:'#fff',align:'center',base:'middle',bg:LBG});}
const angOf=(ax,ay,bx,by)=>Math.acos(clamp(ax*bx+ay*by,-1,1))/D2R;
</script>
