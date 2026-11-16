<script>
// ================= 共用 =================
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),TAU=Math.PI*2;
const DPR=()=>Math.min(window.devicePixelRatio||1,2);
const C={};
function readColors(){const s=getComputedStyle(document.documentElement);
  ['bg','panel','ink','muted','line','accent','accent-soft','blue','green','red','purple','water','wsoft','sol','ion2','vol','ice','icebg','glass','liq','membrane','hot'].forEach(k=>C[k]=s.getPropertyValue('--'+k).trim());}
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
  if(bg){px=align==='center'?x-w/2:align==='right'?x-w:x;const py=base==='middle'?y-size/2-1:base==='top'?y-1:y-size;g.save();g.fillStyle=bg;g.globalAlpha=.88;g.fillRect(px-3,py-2,w+6,size+5);g.restore();}
  g.fillStyle=col;g.fillText(s,x,y);}
function line(g,x1,y1,x2,y2,col,w=2,dash=null){g.strokeStyle=col;g.lineWidth=w;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);}
function head(g,x,y,ang,col,size=10){g.fillStyle=col;g.beginPath();g.moveTo(x,y);g.lineTo(x-size*Math.cos(ang-.42),y-size*Math.sin(ang-.42));g.lineTo(x-size*Math.cos(ang+.42),y-size*Math.sin(ang+.42));g.closePath();g.fill();}
function arrow(g,x1,y1,x2,y2,col,w=2.2){const L=Math.hypot(x2-x1,y2-y1);if(L<2)return;const a=Math.atan2(y2-y1,x2-x1);line(g,x1,y1,x2-Math.cos(a)*5,y2-Math.sin(a)*5,col,w);head(g,x2,y2,a,col,Math.min(10,L*.6));}
function dot(g,x,y,r,col){g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
const nf=(x,d=1)=>{const r=Math.round(x*Math.pow(10,d))/Math.pow(10,d);return (Object.is(r,-0)?0:r).toFixed(d);};
function sliderBind(id,fn,fmt){const el=$(id),o=$(id+'o');const up=()=>{o.textContent=fmt(+el.value);};el.addEventListener('input',()=>{fn(+el.value);up();hideStory();kick();});up();return v=>{el.value=v;o.textContent=fmt(v);};}
// 小圖表：series=[{pts:[[x,y]],col,w,dash}]
function chart(cv,{ratio=.55,minH=170,maxH=250,x0,x1,y0,y1,xl='',yl='',series=[],xt=null,yt=null,extra=null,xfmt=v=>nf(v,0),yfmt=v=>nf(v,0)}){
  const {W,H}=fit(cv,ratio,minH,maxH),g=cv.getContext('2d');g.clearRect(0,0,W,H);
  const l=46,r=10,t=10,b=28,gw=W-l-r,gh=H-t-b;const X=v=>l+(v-x0)/(x1-x0)*gw,Y=v=>t+gh-(v-y0)/(y1-y0)*gh;
  line(g,l,t+gh,W-r,t+gh,C.muted,1);line(g,l,t,l,t+gh,C.muted,1);
  const nx=xt||5,ny=yt||4;
  for(let i=0;i<=nx;i++){const v=x0+(x1-x0)*i/nx;text(g,xfmt(v),X(v),t+gh+14,{size:10,align:'center',mono:true,col:C.muted});}
  for(let i=0;i<=ny;i++){const v=y0+(y1-y0)*i/ny;line(g,l,Y(v),W-r,Y(v),C.line,.6);text(g,yfmt(v),l-4,Y(v)+4,{size:10,align:'right',mono:true,col:C.muted});}
  text(g,xl,W-r,H-3,{size:11,align:'right',col:C.muted});text(g,yl,l+4,t+10,{size:11,col:C.muted,bg:C.panel});
  g.save();g.beginPath();g.rect(l,t-2,gw,gh+4);g.clip();
  series.forEach(s=>{if(!s.pts.length)return;g.strokeStyle=s.col;g.lineWidth=s.w||2;g.setLineDash(s.dash||[]);g.beginPath();s.pts.forEach((p,i)=>i?g.lineTo(X(p[0]),Y(p[1])):g.moveTo(X(p[0]),Y(p[1])));g.stroke();g.setLineDash([]);});
  g.restore();
  extra&&extra(g,X,Y,{W,H,l,t,gw,gh});}

// ================= 實驗台切換與迴圈 =================
let bench='vp';const BENCHES=['vp','bp','fp','sc','os'];
const DRAW={},TICK={},UI={};
function setBench(b,noHash){if(!BENCHES.includes(b))b='vp';bench=b;segSet($('benchSeg'),b);
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

// ---- 共通播放列：▶/❚❚、下一步、速度（0.25／0.5／1／2×，預設 0.5×）----
function playTxt(el,run){if(el)el.textContent=run?'❚❚ 暫停':'▶ 播放';}
function pbar(p,S,stepDt){
  if(S.spd==null)S.spd=.5;S.pend=0;
  const pl=$(p+'Play');if(pl){playTxt(pl,S.run);pl.addEventListener('click',()=>{S.run=!S.run;if(S.run)S.pend=0;playTxt(pl,S.run);hideStory();kick();});}
  const st=$(p+'Step');if(st)st.addEventListener('click',()=>{S.run=false;playTxt(pl,false);S.pend=(S.pend||0)+stepDt;kick();});
  const sg=$(p+'Spd');if(sg){segSet(sg,S.spd);segOn(sg,v=>{S.spd=+v;kick();});}
}
// 這一幀要前進多少模擬時間；逐格時把一步分成幾幀播完，看得到過程
function sdt(S,dt){
  if(S.run)return dt*(S.spd==null?1:S.spd);
  if(S.pend>0){const d=Math.min(S.pend,1/40);S.pend-=d;if(S.pend<1e-6)S.pend=0;return d;}
  return 0;}
const busy=S=>!!S.run||S.pend>0;

// 水的飽和蒸氣壓（mmHg，Antoine，1～110 ℃）
const Pw=T=>Math.pow(10,8.07131-1730.63/(233.426+T));
const Pliq0=T=>4.58*Math.exp(5419*(1/273.16-1/(T+273.15)));   // 0 ℃ 附近液態水
const Pice=T=>4.58*Math.exp(6142*(1/273.16-1/(T+273.15)));    // 冰
function solve(f,a,b){let fa=f(a);for(let i=0;i<60;i++){const m=(a+b)/2,fm=f(m);if((fm>0)===(fa>0)){a=m;fa=fm;}else b=m;}return(a+b)/2;}
const KB=0.52,KF=1.86;

// ======================================================================
// 1 蒸氣壓下降
// ======================================================================
const VP={mode:'part',view:'zoom',run:!reduced,type:'1',N:6,Nfull:24,T:60,box:[],geo:null,hist:[],t:0,
  cups:[],cupSet:'ex10',spd:.5,gmode:'n',flyers:[],ct:0};
const VPV={zoom:{cols:12,rows:3},full:{cols:22,rows:9}};
let COLS=12,ROWS=3;
function vpDims(){const d=VPV[VP.view];COLS=d.cols;ROWS=d.rows;}
function vpMake(sol){const n=COLS*ROWS,g=new Array(n).fill('w');
  if(sol){const ty=VP.type,NN=VP.view==='zoom'?VP.N:VP.Nfull;let parts=[];
    if(ty==='vol')for(let k=0;k<NN;k++)parts.push('v');
    else{const i=+ty;for(let k=0;k<NN;k++){parts.push('s');for(let j=1;j<i;j++)parts.push('a');}}
    parts=parts.slice(0,Math.floor(n*.6));
    const idx=[...Array(n).keys()].sort(()=>Math.random()-.5);parts.forEach((p,k)=>g[idx[k]]=p);}
  return{grid:g,vap:[],esc:0,cap:0,avg:0};}
function vpReset(){vpDims();VP.box=[vpMake(false),vpMake(true)];VP.hist=[];VP.t=0;}
function vpGeo(W,H){const gap=24,cw=(W-gap*3)/2,top=34,bot=H-14;const cs=cw/COLS;
  const liqH=Math.min(cs*ROWS,(bot-top)*(VP.view==='zoom'?.52:.72));const surf=bot-liqH;
  return{cw,gap,top,bot,cs,surf,x:[gap,gap*2+cw]};}
const vpSpeed=T=>130*Math.sqrt((T+273)/333);
function vpPe(T,geo){ // 每個表面水分子每秒逃出的機率，使純水 100 ℃ 時氣相約 70 個
  const gh=geo.surf-geo.top,vy=(2/Math.PI)*vpSpeed(100);const K=110*vy/(COLS*2*gh);return K*Pw(T)/760;}
function vpStep(dt){const geo=VP.geo;if(!geo)return;VP.t+=dt;
  const pe=vpPe(VP.T,geo),sp=vpSpeed(VP.T);
  VP.box.forEach((b,bi)=>{const x0=geo.x[bi],g=b.grid;
    // 液體內擴散
    for(let k=0;k<70;k++){const i=Math.floor(Math.random()*g.length),r=Math.floor(i/COLS),c=i%COLS;const nb=[[r,c+1],[r,c-1],[r+1,c],[r-1,c]][Math.floor(Math.random()*4)];
      if(nb[0]<0||nb[0]>=ROWS||nb[1]<0||nb[1]>=COLS)continue;const j=nb[0]*COLS+nb[1];const tmp=g[i];g[i]=g[j];g[j]=tmp;}
    // 逃出液面（只有最上排）
    for(let c=0;c<COLS;c++){const ty=g[c];let p=0;if(ty==='w')p=pe;else if(ty==='v')p=pe*3.2;
      if(p>0&&Math.random()<p*dt){const a=-Math.PI/2+(Math.random()-.5)*2.2;const mx=x0+(c+.5)*geo.cs;
        b.vap.push({x:mx,y:geo.surf-2,vx:sp*Math.cos(a),vy:sp*Math.sin(a),ty});b.esc++;
        if(VP.view==='zoom')(b.fx=b.fx||[]).push({x:mx,y:geo.surf,up:1,t:0});}}
    // 氣體運動與回到液面
    for(let k=b.vap.length-1;k>=0;k--){const m=b.vap[k];m.x+=m.vx*dt;m.y+=m.vy*dt;
      if(m.x<x0+3){m.x=x0+3;m.vx=Math.abs(m.vx);}if(m.x>x0+geo.cw-3){m.x=x0+geo.cw-3;m.vx=-Math.abs(m.vx);}
      if(m.y<geo.top+3){m.y=geo.top+3;m.vy=Math.abs(m.vy);}
      if(m.y>=geo.surf){b.vap.splice(k,1);b.cap++;if(VP.view==='zoom')(b.fx=b.fx||[]).push({x:m.x,y:geo.surf,up:-1,t:0});}}
    if(b.fx){for(let k=b.fx.length-1;k>=0;k--){b.fx[k].t+=dt;if(b.fx[k].t>.8)b.fx.splice(k,1);}}
    b.avg+=(b.vap.length-b.avg)*Math.min(1,dt/2.5);});
  if(!VP.hist.length||VP.t-VP.hist[VP.hist.length-1][0]>0.1){VP.hist.push([VP.t,VP.box[0].vap.length,VP.box[1].vap.length,VP.box[1].esc,VP.box[1].cap]);if(VP.hist.length>900)VP.hist.shift();}}
function vpXw(){const g=VP.box[1].grid;const w=g.filter(t=>t==='w').length;return w/g.length;}
DRAW.vp=()=>{if(VP.mode==='cups')return drawCups();
  const cv=$('cvVP'),{W,H}=fit(cv,.42,300,430),g=cv.getContext('2d');g.clearRect(0,0,W,H);const geo=vpGeo(W,H);VP.geo=geo;
  const names=['純水',VP.type==='vol'?'酒精水溶液':'溶液'];
  VP.box.forEach((b,bi)=>{const x0=geo.x[bi];
    g.fillStyle=C.panel;g.strokeStyle=C.glass;g.lineWidth=3;g.beginPath();g.roundRect(x0,geo.top,geo.cw,geo.bot-geo.top,6);g.stroke();
    g.fillStyle=C.liq;g.fillRect(x0+1.5,geo.surf,geo.cw-3,geo.bot-geo.surf-1.5);
    line(g,x0,geo.top,x0+geo.cw,geo.top,C.glass,5);
    const tt=performance.now()/1000,cs=geo.cs,Z=VP.view==='zoom';
    if(Z){ // 把液面最上排畫成一格一格的「位置」
      for(let c=0;c<COLS;c++){const x=x0+c*cs,y=geo.surf;g.strokeStyle=C.line;g.lineWidth=1;g.setLineDash([3,3]);g.strokeRect(x+1,y+1,cs-2,cs-2);g.setLineDash([]);}
      line(g,x0+1.5,geo.surf,x0+geo.cw-1.5,geo.surf,C.glass,2);}
    b.grid.forEach((ty,i)=>{const r=Math.floor(i/COLS),c=i%COLS;const jx=Math.sin(tt*5+i*1.7)*cs*.08,jy=Math.cos(tt*4.3+i*2.3)*cs*.08;
      const x=x0+(c+.5)*cs+jx,y=geo.surf+(r+.5)*cs+jy;const col=ty==='w'?C.water:ty==='s'?C.sol:ty==='a'?C.ion2:C.vol;
      dot(g,x,y,(ty==='w'?.3:.4)*cs*(Z?1.15:1),col);
      if(r===0&&ty!=='w'&&ty!=='v'){g.strokeStyle=C.ink;g.lineWidth=Z?2:1;g.beginPath();g.arc(x,y,cs*(Z?.5:.46),0,TAU);g.stroke();
        if(Z)text(g,'佔住',x,y+cs*.5+12,{align:'center',size:10,col:C.muted});}});
    b.vap.forEach(m=>dot(g,m.x,m.y,cs*(Z?.3:.26),m.ty==='v'?C.vol:C.water));
    if(b.fx)b.fx.forEach(f=>{const a=1-f.t/.8,L=cs*.9*(1+f.t*1.6);g.globalAlpha=a;
      const col=f.up>0?C.red:C.blue;arrow(g,f.x,f.y-(f.up>0?0:L),f.x,f.y-(f.up>0?L:0),col,2.4);g.globalAlpha=1;});
    if(Z){text(g,`逃出 ${b.esc}`,x0+8,geo.top+18,{size:12,mono:true,col:C.red,bg:C.panel});
      text(g,`回來 ${b.cap}`,x0+8,geo.top+36,{size:12,mono:true,col:C.blue,bg:C.panel});}
    text(g,names[bi],x0+geo.cw/2,geo.top-10,{align:'center',bold:true,size:14});
    const P=b.avg;text(g,`氣相 ${b.vap.length} 個`,x0+geo.cw-8,geo.top+18,{align:'right',size:12,mono:true,col:C.muted,bg:C.panel});
  });
  text(g,VP.view==='zoom'?'虛線格子＝液面上的位置。被溶質佔住（黑圈）的位置，水分子就不能從那裡逃出去':'液面最上排（黑圈）被溶質佔走的位置，水分子就不能從那裡逃出去',W/2,H-2,{align:'center',size:11,col:C.muted});
  // 圖
  const h=VP.hist,t1=Math.max(10,VP.t),t0=Math.max(0,t1-30);
  if(VP.gmode==='cum'){const hh=h.filter(r=>r[0]>=t0),ym=Math.max(10,...hh.map(r=>Math.max(r[3],r[4])))*1.1;
    chart($('cvVPG'),{x0:t0,x1:t1,y0:0,y1:ym,xl:'時間（s）',yl:'累計次數',series:[
      {pts:hh.map(r=>[r[0],r[3]]),col:C.red,w:2.6},{pts:hh.map(r=>[r[0],r[4]]),col:C.blue,w:2.6}],
      extra:(g,X,Y,o)=>{text(g,'逃出液面（累計）',o.l+o.gw-4,o.t+14,{align:'right',col:C.red,size:12,bold:true});
        text(g,'回到液面（累計）',o.l+o.gw-4,o.t+30,{align:'right',col:C.blue,size:12,bold:true});
        text(g,'兩條線斜率一樣 → 動態平衡',o.l+8,o.t+o.gh-8,{col:C.muted,size:11});}});}
  else{const ymax=Math.max(20,...h.map(r=>Math.max(r[1],r[2])))*1.15;
  const sm=(k)=>{const out=[];let a=null;h.forEach(r=>{if(r[0]<t0)return;a=a==null?r[k]:a+(r[k]-a)*.08;out.push([r[0],a]);});return out;};
  chart($('cvVPG'),{x0:t0,x1:t1,y0:0,y1:ymax,xl:'時間（s）',yl:'氣相分子數',series:[
    {pts:h.filter(r=>r[0]>=t0).map(r=>[r[0],r[1]]),col:C.water,w:1,dash:[2,2]},{pts:h.filter(r=>r[0]>=t0).map(r=>[r[0],r[2]]),col:VP.type==='vol'?C.vol:C.sol,w:1,dash:[2,2]},
    {pts:sm(1),col:C.water,w:2.6},{pts:sm(2),col:VP.type==='vol'?C.vol:C.sol,w:2.6}],
    extra:(g,X,Y,o)=>{text(g,'純水',o.l+o.gw-4,o.t+14,{align:'right',col:C.water,size:12,bold:true});text(g,names[1],o.l+o.gw-4,o.t+30,{align:'right',col:VP.type==='vol'?C.vol:C.sol,size:12,bold:true});}});}
  const xw=vpXw(),P0=Pw(VP.T);const ns=VP.box[1].grid.length-VP.box[1].grid.filter(t=>t==='w').length;
  $('vpNow').innerHTML=[['溫度',VP.T+' ℃'],['純水的飽和蒸氣壓 P°',nf(P0,0)+' mmHg'],['右杯：水的莫耳分率 X水',nf(xw,2)],['右杯溶質粒子數',ns+' 個'+(VP.type!=='vol'&&VP.type!=='1'?`（${VP.view==='zoom'?VP.N:VP.Nfull} 個化學式 × i＝${VP.type}）`:'')],
    [VP.type==='vol'?'水的分壓 X水·P°':'拉午耳：P ＝ X水·P°',nf(xw*P0,0)+' mmHg'],['模擬：右杯／左杯 氣相分子',VP.box[0].avg>0.5?nf(VP.box[1].avg/VP.box[0].avg,2):'—']].map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
  $('vpSay').textContent=VP.type==='vol'?'酒精分子自己也會逃出液面（而且比水更容易），所以溶液上方的總蒸氣壓反而比純水高。拉午耳的蒸氣壓下降、沸點上升公式只能用在「不揮發」的溶質。':
    (VP.view==='zoom'?VP.N:VP.Nfull)===0?'右杯也是純水，兩杯的氣相分子數一樣多。':
    `液面上一部分位置被溶質佔走，每秒逃出的水分子變少；回到液面的速率只和氣相分子多少有關。兩個速率相等時（動態平衡），溶液上方的水分子就比較少，蒸氣壓比較低。電解質解離成${VP.type==='1'?'':VP.type+' 個'}粒子，佔掉的位置更多。`;};
TICK.vp=dt=>{if(VP.mode==='cups')return tickCups(dt);const d=sdt(VP,dt);if(d){const n=3;for(let i=0;i<n;i++)vpStep(d/n);}return busy(VP);};
segOn($('vpType'),v=>{VP.type=v;vpReset();});
const setVPN=sliderBind('vpN',v=>{if(VP.view==='zoom')VP.N=v;else VP.Nfull=v;vpReset();},v=>v+' 個');
const setVPT=sliderBind('vpT',v=>{VP.T=v;VP.box.forEach(b=>b.vap.length=0);VP.hist=[];VP.t=0;},v=>v+' ℃');
pbar('vp',VP,.4);
segOn($('vpG'),v=>{VP.gmode=v;kick();});
segOn($('vpView'),v=>{hideStory();if(v===VP.view)return;
  if(VP.view==='zoom')VP.N=+$('vpN').value;else VP.Nfull=+$('vpN').value;
  VP.view=v;vpDims();vpSetRange();vpReset();kick();});
function vpSetRange(){const z=VP.view==='zoom',el=$('vpN');
  el.min=0;el.max=z?18:60;el.step=z?1:2;el.value=z?VP.N:VP.Nfull;$('vpNo').textContent=el.value+' 個';}
$('vpReset').addEventListener('click',()=>{if(VP.mode==='cups')cupsLoad(VP.cupSet);else vpReset();kick();});
function vpSetMode(m){VP.mode=m;segSet($('vpMode'),m);$('vpPartCtl').hidden=m!=='part';$('vpCupCtl').hidden=m!=='cups';$('vpLeg').hidden=m!=='part';
  $('vpRTitle').textContent=m==='part'?'為什麼溶液的蒸氣壓比較低':'各杯的水量變化';$('vpGTitle').innerHTML=m==='part'?'氣相中的分子數（＝蒸氣壓）<small>隨時間</small>':'各杯的水量 <small>隨時間</small>';}
segOn($('vpMode'),v=>{hideStory();vpSetMode(v);if(v==='cups')cupsLoad(VP.cupSet);VP.run=true;$('vpPlay').textContent='❚❚ 暫停';kick();});
UI.vp=()=>{$('vpGSegW').hidden=VP.mode!=='part';};
vpDims();vpSetRange();vpReset();

// ---- 密閉容器裡的杯子 ----
const CUPSETS={
  ex10:[{n:'A',W:100,mol:0,i:1,s:'純水',M:0},{n:'B',W:100,mol:0.1,i:1,s:'蔗糖 0.1 mol',M:342},{n:'C',W:100,mol:0.3,i:1,s:'葡萄糖 0.3 mol',M:180}],
  four:[{n:'甲',W:700,mol:0.3,i:1,s:'葡萄糖 0.3 mol',M:180},{n:'乙',W:300,mol:0.3,i:3,s:'BaCl₂ 0.3 mol',M:208},{n:'丙',W:1000,mol:0.3,i:2,s:'NaNO₃ 0.3 mol',M:85},{n:'丁',W:400,mol:0.3,i:1.02,s:'醋酸 0.3 mol（弱電解質）',M:60}],
  two:[{n:'甲',W:100,mol:0,i:1,s:'純水',M:0},{n:'乙',W:100,mol:0.2,i:1,s:'葡萄糖 0.2 mol',M:180}]};
function cupsLoad(k){VP.cupSet=k;segSet($('vpCupSet'),k);VP.cups=CUPSETS[k].map(c=>({...c,W0:c.W}));VP.flyers=[];VP.ct=0;VP.cupHist=[[0,...VP.cups.map(c=>c.W)]];}
segOn($('vpCupSet'),v=>{hideStory();cupsLoad(v);VP.run=true;kick();});
const xwOf=c=>c.W<=1e-9?0:(c.W/18)/((c.W/18)+c.i*c.mol);
function tickCups(dt){const h0=sdt(VP,dt);if(!h0)return busy(VP);const cs=VP.cups;const h=h0*6;VP.ct+=h;
  for(let s=0;s<20;s++){const act=cs.filter(c=>c.W>1e-6);const Pbar=act.reduce((a,c)=>a+xwOf(c),0)/act.length;
    const kk=30*cs.reduce((a,c)=>a+c.W0,0);act.forEach(c=>{c.W=Math.max(0,c.W-kk*(xwOf(c)-Pbar)*h/20);});
    const tot=cs.reduce((a,c)=>a+c.W,0),tot0=cs.reduce((a,c)=>a+c.W0,0);const act2=cs.filter(c=>c.W>1e-6);const fix=(tot0-tot)/act2.length;act2.forEach(c=>c.W+=fix);}
  // 飛行的水分子（示意淨流向）
  const act=cs.filter(c=>c.W>1e-6);const Pbar=act.reduce((a,c)=>a+xwOf(c),0)/act.length;
  cs.forEach((c,i)=>{const f=xwOf(c)-Pbar;if(c.W>1e-6&&f>0.0004&&Math.random()<Math.min(1,f*300)*dt*8){const tgt=cs.map((d,j)=>({j,f:xwOf(d)-Pbar})).filter(o=>o.f<0&&cs[o.j].W>0);if(tgt.length){const o=tgt[Math.floor(Math.random()*tgt.length)];VP.flyers.push({a:i,b:o.j,t:0});}}});
  if(VP.ct-VP.cupHist[VP.cupHist.length-1][0]>0.05)VP.cupHist.push([VP.ct,...cs.map(c=>c.W)]);
  VP.flyers.forEach(f=>f.t+=dt*.8);VP.flyers=VP.flyers.filter(f=>f.t<1);
  return busy(VP);}
function drawCups(){const cv=$('cvVP'),{W,H}=fit(cv,.42,300,430),g=cv.getContext('2d');g.clearRect(0,0,W,H);
  const cs=VP.cups,n=cs.length,pad=20;g.strokeStyle=C.glass;g.lineWidth=3;g.beginPath();g.roundRect(pad,14,W-2*pad,H-28,14);g.stroke();
  text(g,'密閉容器（定溫）',pad+12,32,{size:12,col:C.muted});
  const slot=(W-2*pad)/n,bw=Math.min(110,slot*.6),bh=H*.48,by=H-30;const Wmax=Math.max(cs.reduce((a,c)=>a+c.W0,0)*.85,Math.max(...cs.map(c=>c.W0))*1.2);
  const pos=cs.map((c,i)=>({x:pad+slot*(i+.5),y:by-bh}));
  cs.forEach((c,i)=>{const x=pos[i].x;const lh=bh*c.W/Wmax;
    g.fillStyle=C.liq;g.fillRect(x-bw/2,by-lh,bw,lh);
    if(c.mol>0&&c.W>0){g.fillStyle=C.sol;const k=Math.min(60,Math.round(c.mol*c.i*60));for(let j=0;j<k;j++){const px=x-bw/2+6+((j*37)%Math.max(1,bw-12)),py=by-4-((j*53)%Math.max(1,lh-8));if(py>by-lh+2)dot(g,px,py,2.2,C.sol);}}
    g.strokeStyle=C.glass;g.lineWidth=2.5;g.beginPath();g.moveTo(x-bw/2,by-bh);g.lineTo(x-bw/2,by);g.lineTo(x+bw/2,by);g.lineTo(x+bw/2,by-bh);g.stroke();
    text(g,c.n,x,by-bh-26,{align:'center',bold:true,size:15});text(g,c.s,x,by-bh-10,{align:'center',size:11,col:C.muted});
    text(g,nf(c.W,c.W<10?1:0)+' g 水',x,by-Math.max(lh,16)-4,{align:'center',size:12,mono:true,bold:true,col:C.water,bg:C.panel});});
  VP.flyers.forEach(f=>{const a=pos[f.a],b=pos[f.b];const x=a.x+(b.x-a.x)*f.t,y=a.y-10-Math.sin(f.t*Math.PI)*60+(b.y-a.y)*f.t;dot(g,x,y,3.2,C.water);});
  const cols=[C.water,C.sol,C.purple,C.green];const hh=VP.cupHist;
  chart($('cvVPG'),{x0:0,x1:Math.max(5,VP.ct),y0:0,y1:Math.max(...hh.map(r=>Math.max(...r.slice(1))))*1.15,xl:'時間（示意）',yl:'水量（g）',
    series:cs.map((c,k)=>({pts:hh.map(r=>[r[0],r[k+1]]),col:cols[k],w:2.4})),extra:(g,X,Y,o)=>{cs.forEach((c,k)=>text(g,c.n,o.l+o.gw-4,Y(c.W)-4,{align:'right',size:12,bold:true,col:cols[k],bg:C.panel}));}});
  // 表格
  const act=cs.filter(c=>c.W>1e-6);
  $('vpNow').innerHTML=cs.map(c=>`<dt>${c.n}：${c.s}</dt><dd>${nf(c.W,1)} g，${c.W>1e-6&&c.mol>0?nf(c.mol*c.i/(c.W/1000),2)+' m（粒子）':c.W>1e-6?'純水':'已蒸發光'}</dd>`).join('')+`<dt>經過時間（示意）</dt><dd>${nf(VP.ct,1)}</dd>`;
  const eq=act.length>1&&Math.max(...act.map(xwOf))-Math.min(...act.map(xwOf))<2e-5;
  $('vpSay').textContent='蒸氣壓高的杯子（水的莫耳分率大、粒子濃度小）蒸發得比凝結多，水分子經過氣相跑到蒸氣壓低的杯子。純水會全部跑光；溶液之間一直搬到「粒子的重量莫耳濃度相等」（蒸氣壓相等）才停。'+(eq?' 現在各杯已經平衡。':'');}
</script>
