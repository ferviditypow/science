
// =====================================================================
// 2 色光的混合
// =====================================================================
const MX={mode:'spot',on:[1,1,1],pos:[[.42,.4],[.58,.4],[.5,.64]],probe:[.5,.47],sh:'RB',shL:{RB:[.28,.72],RG:[.28,.72],RGB:[.22,.5,.78]},obj:[.5,.62],px:[255,255,0]};
const SHC={RB:['R','B'],RG:['R','G'],RGB:['R','G','B']};
let WX=600,HX=320;
const LIGHTV={R:[1,0,0],G:[0,1,0],B:[0,0,1]};
function spotR(W,H){return Math.min(W,H)*.27;}
function spotAt(x,y,W,H){const r=spotR(W,H);const c=[0,0,0];MX.pos.forEach((p,i)=>{if(!MX.on[i])return;const d=Math.hypot(x-p[0]*W,y-p[1]*H);const f=d<r*.85?1:d<r?(r-d)/(r*.15):0;c[i]+=f;});return c.map(v=>Math.min(1,v));}
function drawSpot(g,W,H){g.fillStyle='#07080b';g.fillRect(0,0,W,H);const r=spotR(W,H);g.save();g.globalCompositeOperation='lighter';
  MX.pos.forEach((p,i)=>{if(!MX.on[i])return;const x=p[0]*W,y=p[1]*H;const gr=g.createRadialGradient(x,y,0,x,y,r);const c=['255,0,0','0,255,0','0,0,255'][i];gr.addColorStop(0,`rgba(${c},1)`);gr.addColorStop(.85,`rgba(${c},1)`);gr.addColorStop(1,`rgba(${c},0)`);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();});
  g.restore();
  MX.pos.forEach((p,i)=>{handle(g,p[0]*W,p[1]*H,8);text(g,['紅燈','綠燈','藍燈'][i],p[0]*W,p[1]*H-14,{size:11,bold:true,col:'#fff',align:'center'});});
  const px=MX.probe[0]*W,py=MX.probe[1]*H;g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(px,py,10,0,TAU);g.stroke();line(g,px-16,py,px-6,py,'#fff',2);line(g,px+6,py,px+16,py,'#fff',2);line(g,px,py-16,px,py-6,'#fff',2);line(g,px,py+6,px,py+16,'#fff',2);
  const c=spotAt(px,py,W,H);text(g,'這裡：'+nameRGB(c)+'光',px+20,py-12,{size:13,bold:true,col:'#fff',bg:'rgba(0,0,0,.6)'});
  text(g,'白色牆面（暗室）',10,H-10,{size:11,col:'#aaa'});}
function shGeo(W,H){return {ys:H*.08,hs:H*.24,yw:H*.42,yl:H*.92,ro:Math.min(W,H)*.045};}
function shWall(x,W,H){const G=shGeo(W,H),ks=SHC[MX.sh],L=MX.shL[MX.sh];const c=[0,0,0];const ox=MX.obj[0]*W,oy=MX.obj[1]*H;
  ks.forEach((k,i)=>{const lx=L[i]*W,ly=G.yl;// 光源到牆上點的線段是否被物體擋住
    const dx=x-lx,dy=G.yw-ly,t=clamp(((ox-lx)*dx+(oy-ly)*dy)/(dx*dx+dy*dy),0,1);const d=Math.hypot(lx+dx*t-ox,ly+dy*t-oy);if(d>G.ro)LIGHTV[k].forEach((v,j)=>c[j]+=v);});return c.map(v=>Math.min(1,v));}
function drawShadow(g,W,H){const G=shGeo(W,H),ks=SHC[MX.sh],L=MX.shL[MX.sh];g.fillStyle='#0b0d12';g.fillRect(0,0,W,H);
  // 牆面正視
  let seg=[];let prev=null,start=0;for(let x=0;x<=W;x+=2){const c=x<W?shWall(x,W,H):null;const k=c?c.join():'end';if(k!==prev){if(prev!==null)seg.push({a:start,b:x,c:prev.split(',').map(Number)});prev=k;start=x;}}
  seg.forEach(s=>{g.fillStyle=lightCss(s.c);g.fillRect(s.a,G.ys,s.b-s.a,G.hs);if(s.b-s.a>44)text(g,nameRGB(s.c),(s.a+s.b)/2,G.ys+G.hs/2+5,{size:13,bold:true,col:s.c.reduce((a,b)=>a+b,0)>1.5||s.c[1]>.5?'#111':'#fff',align:'center'});});
  text(g,'牆面（正面看）',8,G.ys-4,{size:11,col:'#bbb'});
  // 俯視圖
  line(g,0,G.yw,W,G.yw,'#ddd',3);text(g,'牆（上方俯視）',8,G.yw+16,{size:11,col:'#bbb'});
  const ox=MX.obj[0]*W,oy=MX.obj[1]*H;
  ks.forEach((k,i)=>{const lx=L[i]*W;g.save();g.globalCompositeOperation='lighter';g.fillStyle=lightCss(LIGHTV[k],.12);g.beginPath();g.moveTo(lx,G.yl);g.lineTo(0,G.yw);g.lineTo(W,G.yw);g.closePath();g.fill();g.restore();
    // 影子邊界
    const ang=Math.atan2(oy-G.yl,ox-lx),dd=Math.hypot(ox-lx,oy-G.yl),da=Math.asin(Math.min(1,G.ro/dd));[ang-da,ang+da].forEach(a=>{const t=(G.yw-G.yl)/Math.sin(a);line(g,lx,G.yl,lx+Math.cos(a)*t,G.yw,lightCss(LIGHTV[k],.6),1,[4,4]);});
    g.fillStyle=lightCss(LIGHTV[k]);g.beginPath();g.arc(lx,G.yl,12,0,TAU);g.fill();handle(g,lx,G.yl,6);text(g,CN[k]+'燈',lx,G.yl-18,{size:12,bold:true,col:'#fff',align:'center'});});
  g.fillStyle='#8a6b4a';g.beginPath();g.arc(ox,oy,G.ro,0,TAU);g.fill();handle(g,ox,oy,6);text(g,'物體',ox+G.ro+6,oy+4,{size:12,col:'#ddd'});}
function drawPixel(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const c=MX.px;const sw=Math.min(W*.38,H*.8);g.fillStyle=`rgb(${c.join(',')})`;g.fillRect(20,(H-sw)/2,sw,sw);g.strokeStyle=C.line;g.strokeRect(20,(H-sw)/2,sw,sw);
  text(g,'遠遠看：'+nameRGB(c.map(v=>v/255))+'色',20+sw/2,(H-sw)/2-8,{size:13,bold:true,align:'center'});
  const L=sw+60,cols=6,rows=4,pw=Math.min((W-L-20)/cols,(H-40)/rows);g.fillStyle='#000';g.fillRect(L,20,pw*cols,pw*rows);
  for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const x=L+k*pw,y=20+r*pw;[0,1,2].forEach(j=>{const v=c[j]/255;const col=[0,0,0];col[j]=v;g.fillStyle=lightCss(col);g.fillRect(x+pw*(.06+j*.31),y+pw*.08,pw*.26,pw*.84);});}
  text(g,'靠近看：每個畫素都是紅、綠、藍三個小燈',L,H-8,{size:12,col:C.muted});}
function mxUI(){segSet($('mxMode'),MX.mode);document.querySelectorAll('.mxc').forEach(e=>e.hidden=e.dataset.m!==MX.mode);['mxR','mxG','mxB'].forEach((id,i)=>$(id).checked=!!MX.on[i]);segSet($('mxSh'),MX.sh);
  ['pxR','pxG','pxB'].forEach((id,i)=>{$(id).value=MX.px[i];$(id+'o').textContent=MX.px[i];});
  $('mxHint').textContent={spot:'拖曳三盞燈（橘點）讓光重疊，拖曳白色十字看那一點是什麼顏色。',shadow:'拖曳燈或物體（橘點）：被擋住一盞燈的地方，只剩另一盞燈的顏色。',pixel:'拖三個滑桿調整紅、綠、藍小燈的亮度，混出各種顏色。'}[MX.mode];
  $('mxHowT').textContent={spot:'三盞聚光燈：怎麼看',shadow:'彩色的影子：怎麼看',pixel:'螢幕的畫素：怎麼看'}[MX.mode];
  howList('mxHow',{spot:['紅、綠、藍是光的三原色（RGB），不能由其他色光混合出來。','紅＋綠＝黃；紅＋藍＝洋紅；綠＋藍＝青；紅＋綠＋藍＝白。','色光混合越混越亮（加法）；顏料混合越混越暗，兩者不同。'],
    shadow:['兩盞不同顏色的燈照牆，物體擋住其中一盞燈的光，影子就是另一盞燈的顏色。','兩盞燈都被擋住的地方才是黑色。','兩盞燈都照到的地方是兩色光混合，例如紅＋藍＝洋紅。'],
    pixel:['手機、電視、電腦螢幕的每個畫素都由紅、綠、藍三個小燈組成。','調整三個小燈的亮度比例，就能混出幾百萬種顏色；三個全亮是白，全暗是黑。','夜間模式把藍光調暗，畫面看起來偏黃。']}[MX.mode]);}
segOn($('mxMode'),v=>{MX.mode=v;hideStory();mxUI();SIZE.mix();kick();});
['mxR','mxG','mxB'].forEach((id,i)=>$(id).addEventListener('change',()=>{MX.on[i]=$(id).checked?1:0;kick();}));
$('mxReset').addEventListener('click',()=>{MX.pos=[[.42,.4],[.58,.4],[.5,.64]];MX.probe=[.5,.47];kick();});
segOn($('mxSh'),v=>{MX.sh=v;mxUI();kick();});
['pxR','pxG','pxB'].forEach((id,i)=>$(id).addEventListener('input',()=>{MX.px[i]=+$(id).value;mxUI();kick();}));
const PXP=[['白',[255,255,255]],['黃',[255,255,0]],['洋紅',[255,0,255]],['青',[0,255,255]],['紅',[255,0,0]],['橙',[255,128,0]],['灰',[128,128,128]],['黑',[0,0,0]],['夜間模式（藍光調暗）',[255,200,120]]];
{const b=$('pxPre');PXP.forEach(([n,c])=>{const x=document.createElement('button');x.className='chip';x.textContent=n;x.addEventListener('click',()=>{MX.px=c.slice();mxUI();kick();});b.appendChild(x);});}
dragger($('cvMx'),()=>{const W=WX,H=HX;if(MX.mode==='spot')return MX.pos.map((p,i)=>({x:p[0]*W,y:p[1]*H,r:22,move:(x,y)=>{MX.pos[i]=[clamp(x/W,0,1),clamp(y/H,0,1)];}})).concat([{x:MX.probe[0]*W,y:MX.probe[1]*H,r:22,move:(x,y)=>{MX.probe=[clamp(x/W,0,1),clamp(y/H,0,1)];}}]);
  if(MX.mode==='shadow'){const G=shGeo(W,H),L=MX.shL[MX.sh];return L.map((lx,i)=>({x:lx*W,y:G.yl,r:22,move:x=>{L[i]=clamp(x/W,.02,.98);}})).concat([{x:MX.obj[0]*W,y:MX.obj[1]*H,r:24,move:(x,y)=>{MX.obj=[clamp(x/W,.05,.95),clamp(y/H,(G.yw+G.ro+8)/H,(G.yl-30)/H)];}}]);}return [];},()=>kick());
$('cvMx').style.touchAction='none';
function mxResults(){let big='',f='',ck=[];
  if(MX.mode==='spot'){const c=spotAt(MX.probe[0]*WX,MX.probe[1]*HX,WX,HX);const parts=['紅','綠','藍'].filter((n,i)=>c[i]>.5);big=parts.length?`十字處：${parts.join('＋')} ＝ ${nameRGB(c)}光`:'十字處沒有光：黑';
    f='紅＋綠＝黃　紅＋藍＝洋紅　綠＋藍＝青<br>紅＋綠＋藍＝白';ck=[['info','三原色光：紅、綠、藍（RGB）。黃光可以由紅光＋綠光混合出來，所以黃不是原色光。'],['info','白光不是一種顏色，是各色光混合而成。']];}
  else if(MX.mode==='shadow'){const ks=SHC[MX.sh];big=`${ks.map(k=>CN[k]).join('、')}兩盞燈：影子有${ks.length===2?'兩':'好幾'}種顏色`;f=ks.length===2?`擋住${CN[ks[0]]}燈的影子是${CN[ks[1]]}色；擋住${CN[ks[1]]}燈的影子是${CN[ks[0]]}色；兩盞都擋住是黑色<br>兩盞都照到：${CN[keyOf(add(CV[ks[0]],CV[ks[1]]))]}`:'每個影子是「沒被擋住的燈」混合的顏色';
    ck=[['info','影子不是一定是黑色：只要還有別的色光照到，影子就有顏色。']];}
  else{const c=MX.px;big=`R ${c[0]}、G ${c[1]}、B ${c[2]} → ${nameRGB(c.map(v=>v/255))}`;f='每個小燈 0～255 共 256 種亮度：256 × 256 × 256 ≈ 1677 萬種顏色';ck=[['info','螢幕只用三種原色光的小燈，靠亮度比例混出所有顏色。']];}
  $('mxBig').textContent=big;$('mxF').innerHTML=f;checks($('mxC'),ck);}
SIZE.mix=()=>{({W:WX,H:HX}=fit($('cvMx'),MX.mode==='pixel'?.36:.5,260,480));};
UI.mix=()=>{mxUI();};
DRAW.mix=()=>{const g=$('cvMx').getContext('2d');if(MX.mode==='spot')drawSpot(g,WX,HX);else if(MX.mode==='shadow')drawShadow(g,WX,HX);else drawPixel(g,WX,HX);mxResults();};
