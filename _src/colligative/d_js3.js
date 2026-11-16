<script>
// ======================================================================
// 4 過冷現象
// ======================================================================
const SC={T:15,bath:-20,k:.09,spd:.5,zoom:true,run:false,t:0,cl:[],f:0,front:null,dust:false,shake:0,hist:[[0,15]],state:'liq',maxN:0,dustPts:[]};
const nStar=(dT,het)=>dT<=0.05?1e9:Math.pow(30/dT,2)*(het?0.22:1);
function scReset(){Object.assign(SC,{T:15,run:false,t:0,cl:[],f:0,front:null,shake:0,hist:[[0,15]],state:'liq',maxN:0,nucT:null});
  SC.dustPts=[...Array(7)].map(()=>[.1+.8*Math.random(),.15+.75*Math.random()]);$('scPlay').textContent='▶ 開始冷卻';}
function scNucleate(c){SC.state='freezing';SC.front={x:c.x,y:c.y};SC.nucT=SC.t;const dT=Math.max(0,-SC.T);SC.f=Math.min(1,dT/80);SC.cl=[];}
let scAcc=0;
function scStep(dt){SC.t+=dt;const dT=-SC.T;
  if(SC.state==='liq'){SC.T+=-SC.k*(SC.T-SC.bath)*dt;
    // 冰核的誕生
    if(dT>0.3){const rate=20*Math.min(3,dT/6)*(SC.shake>0?8:1);let k=rate*dt;while(k>0){if(Math.random()<Math.min(1,k)){
        const het=SC.dust&&Math.random()<.5;let x,y;if(het){const p=SC.dustPts[Math.floor(Math.random()*SC.dustPts.length)];x=p[0];y=p[1];}else{x=.05+.9*Math.random();y=.08+.84*Math.random();}
        SC.cl.push({x,y,n:SC.shake>0?3:1,het});}k-=1;}}
    // 長大或散掉（每 0.15 s 一次）
    scAcc+=dt;while(scAcc>=0.15){scAcc-=0.15;
      for(let i=SC.cl.length-1;i>=0;i--){const c=SC.cl[i];const ns=nStar(dT,c.het);const pg=dT<=0.05?0.1:0.5*(1+Math.tanh(1.2*(c.n-ns)/ns));
        c.n+=Math.random()<pg?1:-1;if(c.n<=0){SC.cl.splice(i,1);continue;}
        if(ns<1e8&&c.n>=ns+6){scNucleate(c);break;}}}
    SC.shake=Math.max(0,SC.shake-dt);SC.maxN=SC.cl.reduce((a,c)=>Math.max(a,c.n),0);}
  else if(SC.state==='freezing'){if(SC.T<0)SC.T=Math.min(0,SC.T+30*dt);else{SC.T=0;SC.f=Math.min(1,SC.f+SC.k*(0-SC.bath)*dt/80*2.2);if(SC.f>=1)SC.state='ice';}}
  else{SC.T+=-SC.k*1.8*(SC.T-SC.bath)*dt;}
  if(SC.t-SC.hist[SC.hist.length-1][0]>0.1)SC.hist.push([SC.t,SC.T]);
  if(SC.t>260){SC.run=false;}}
TICK.sc=dt=>{const d=sdt(SC,dt);if(d){const h=d*4,n=6;for(let i=0;i<n;i++)scStep(h/n);}if(!SC.run&&!SC.pend)$('scPlay').textContent=SC.state==='ice'?'▶ 再一次':'▶ 繼續';return busy(SC);};
$('scPlay').addEventListener('click',()=>{if(SC.run){SC.run=false;$('scPlay').textContent='▶ 繼續';return;}if(SC.state==='ice'&&SC.T<SC.bath+1)scReset();SC.run=true;$('scPlay').textContent='❚❚ 暫停';kick();});
$('scStep').addEventListener('click',()=>{if(SC.state==='ice'&&SC.T<SC.bath+1)scReset();SC.run=false;$('scPlay').textContent='▶ 繼續';SC.pend=(SC.pend||0)+.25;kick();});
segSet($('scSpd'),SC.spd);segOn($('scSpd'),v=>{SC.spd=+v;kick();});
$('scZoom').addEventListener('change',e=>{SC.zoom=e.target.checked;kick();});
const setSCK=sliderBind('scK',v=>{SC.k=v;},v=>v<.06?'很慢':v<.12?'普通':v<.19?'快':'很快');
$('scReset').addEventListener('click',()=>{scReset();kick();});
$('scSeed').addEventListener('click',()=>{hideStory();if(SC.state!=='liq')return;const dT=-SC.T;const c={x:.5,y:.5,n:dT>0.05?Math.min(400,Math.ceil(nStar(dT,false))+8):6,het:false,seed:true};SC.cl.push(c);if(!SC.run){SC.run=true;$('scPlay').textContent='❚❚ 暫停';}kick();});
$('scShake').addEventListener('click',()=>{hideStory();SC.shake=1.5;if(!SC.run){SC.run=true;$('scPlay').textContent='❚❚ 暫停';}kick();});
$('scDust').addEventListener('change',e=>{SC.dust=e.target.checked;kick();});
const setSCB=sliderBind('scBath',v=>{SC.bath=v;},v=>v+' ℃');
DRAW.sc=()=>{const cv=$('cvSC'),{W,H}=fit(cv,.4,240,380),g=cv.getContext('2d');g.clearRect(0,0,W,H);
  const bx=14,by=10,bw=W-28,bh=H-20;g.fillStyle=C.liq;g.fillRect(bx,by,bw,bh);g.strokeStyle=C.glass;g.lineWidth=3;g.strokeRect(bx,by,bw,bh);
  const cs=Math.max(12,Math.min(20,bw/40)),cols=Math.floor(bw/cs),rows=Math.floor(bh/cs),tt=SC.t;
  // 結冰區（由成核點往外）
  let fr=null;if(SC.front){const R=Math.sqrt(SC.f)*Math.hypot(bw,bh)*0.75;fr={x:bx+SC.front.x*bw,y:by+SC.front.y*bh,R};}
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x0=bx+(c+.5)*cs,y0=by+(r+.5)*cs;
    const iced=SC.state==='ice'||(fr&&Math.hypot(x0-fr.x,y0-fr.y)<fr.R);
    if(iced){g.fillStyle=C.ice;g.fillRect(x0-cs*.38,y0-cs*.38,cs*.76,cs*.76);}
    else{const k=r*cols+c;dot(g,x0+hjit(k,5)*cs*.3,y0+hjit(k,6)*cs*.3,cs*.3,C.water);}}
  // 灰塵
  if(SC.dust)SC.dustPts.forEach(p=>{g.fillStyle=C.muted;g.beginPath();g.ellipse(bx+p[0]*bw,by+p[1]*bh,cs*.9,cs*.55,.6,0,TAU);g.fill();});
  // 冰核
  const dT=-SC.T;
  SC.cl.forEach(c=>{const ns=nStar(dT,c.het);const R=Math.sqrt(c.n)*cs*.62+cs*.3;const x=bx+c.x*bw,y=by+c.y*bh;
    g.fillStyle=C.panel;g.beginPath();g.arc(x,y,R+1,0,TAU);g.fill();
    const k=Math.ceil(R/cs);for(let i=-k;i<=k;i++)for(let j=-k;j<=k;j++){const px=x+i*cs*.9,py=y+j*cs*.9;if(Math.hypot(px-x,py-y)<=R){g.fillStyle=c.n>=ns*.7?C.accent:C.ice;g.fillRect(px-cs*.33,py-cs*.33,cs*.66,cs*.66);}}
    if(c.n>=4)text(g,c.n+'',x,y-R-3,{align:'center',size:10,mono:true,col:C.ink,bg:C.panel});});
  if(fr&&SC.state==='freezing')text(g,'❄ 由這裡開始結冰',fr.x,fr.y-8,{align:'center',size:12,bold:true,col:C.accent,bg:C.panel});
  text(g,`${nf(SC.T,1)} ℃`,bx+bw-8,by+20,{align:'right',size:16,bold:true,mono:true,bg:C.panel});
  if(SC.shake>0)text(g,'↯ 搖晃中',bx+8,by+20,{size:13,bold:true,col:C.accent,bg:C.panel});
  // 放大看最大的那顆冰核：和臨界大小比一比
  if(SC.zoom&&SC.state==='liq'){const big=SC.cl.reduce((a,c)=>(!a||c.n>a.n)?c:a,null);
    const iw=Math.min(240,bw*.42),ih=Math.min(150,bh*.52),ix=bx+bw-iw-10,iy=by+bh-ih-10;
    g.fillStyle=C.panel;g.fillRect(ix,iy,iw,ih);g.strokeStyle=C.line;g.lineWidth=1.5;g.strokeRect(ix,iy,iw,ih);
    text(g,'放大看最大的冰核',ix+8,iy+16,{size:11,bold:true,col:C.muted});
    const ns2=nStar(dT,big&&big.het),cx=ix+iw*.32,cy=iy+ih*.58,u=Math.min(iw,ih)*.3;
    if(ns2<1e8){const Rs=u;g.strokeStyle=C.muted;g.lineWidth=1.5;g.setLineDash([4,4]);g.beginPath();g.arc(cx,cy,Rs,0,TAU);g.stroke();g.setLineDash([]);
      text(g,'臨界大小 '+nf(ns2,0),cx,cy+Rs+14,{align:'center',size:10.5,col:C.muted});
      if(big){const R2=Rs*Math.sqrt(big.n/ns2);g.fillStyle=big.n>=ns2?C.accent:C.ice;g.beginPath();g.arc(cx,cy,Math.max(3,R2),0,TAU);g.fill();
        text(g,big.n+' 個分子',cx,cy-Rs-6,{align:'center',size:11,bold:true,col:C.ink});
        text(g,big.n>=ns2?'超過臨界 → 一路長大':'比臨界小 → 馬上散掉',ix+iw-8,iy+ih-10,{align:'right',size:11,bold:true,col:big.n>=ns2?C.accent:C.muted});}
      else text(g,'目前沒有冰核',ix+iw-8,iy+ih-10,{align:'right',size:11,col:C.muted});}
    else text(g,'0 ℃ 以上：臨界大小無限大，\n再大的冰核也會散掉'.split('\n')[0],ix+8,iy+ih/2+6,{size:11,col:C.muted});}
  // 圖
  chart($('cvSCG'),{ratio:.55,x0:0,x1:Math.max(60,SC.t),y0:Math.min(-21,SC.bath-1),y1:16,xl:'時間（示意）',yl:'溫度（℃）',yfmt:v=>nf(v,0),
    series:[{pts:SC.hist,col:C.water,w:2.6}],extra:(g,X,Y,o)=>{line(g,o.l,Y(0),o.l+o.gw,Y(0),C.muted,1,[4,4]);text(g,'0 ℃（凝固點）',o.l+o.gw-4,Y(0)-4,{align:'right',size:11,col:C.muted,bg:C.panel});
      if(SC.nucT!=null){const r=SC.hist.find(p=>p[0]>=SC.nucT);if(r){dot(g,X(r[0]),Y(r[1]),4,C.accent);text(g,'開始結冰',X(r[0])+6,Y(r[1])+14,{size:11,bold:true,col:C.accent,bg:C.panel});}}}});
  const ns=nStar(dT,false);
  $('scNow').innerHTML=[['水溫',nf(SC.T,2)+' ℃'],['過冷度（低於 0 ℃）',dT>0?nf(dT,1)+' ℃':'—'],['臨界大小（約幾個分子）',ns<1e8?nf(ns,0)+(SC.dust?'（灰塵上約 '+nf(nStar(dT,true),0)+'）':''):'無限大（0 ℃ 以上冰不穩定）'],
    ['現在的冰核數 ／ 最大的',SC.cl.length+' ／ '+SC.maxN],['已結冰',nf(SC.f*100,0)+'%']].map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
  $('scSay').textContent=SC.state==='liq'?(SC.T>0?'溫度高於 0 ℃：冰不穩定，偶爾聚在一起的分子馬上散開。':'已經低於 0 ℃ 卻還沒結冰——這就是過冷。冰要從一個小冰核長大，但很小的冰核表面分子比例高、不穩定，大多長沒幾個就散掉。溫度愈低，臨界大小愈小，愈容易有冰核剛好長過臨界大小。丟一顆冰晶、搖一搖或有灰塵，都能幫忙越過這一關。'):
    SC.state==='freezing'?'一顆冰核長過臨界大小後就一路長大。結冰會放出凝固熱，水溫立刻回升到 0 ℃，並停在 0 ℃ 直到全部結冰——所以冷卻曲線會先往下凹，再彈回凝固點。測凝固點時要把曲線外插回去讀。':'全部結冰後，冰的溫度才繼續往下降到冷卻槽的溫度。';};
UI.sc=()=>{};
scReset();

// ======================================================================
// 5 滲透壓
// ======================================================================
const OS={mode:'u',view:'zoom',run:!reduced,spd:.5,i:1,C:0.02,CL:0,T:27,P:0,dh:0,parts:[],ev:[],t:0,obj:'rbc',ton:'iso',sc:1,burst:0};
const piOf=()=>OS.i*(OS.C-OS.CL)*0.082*(OS.T+273);
const piSide=c=>OS.i*c*0.082*(OS.T+273);
const osNW=()=>OS.view==='zoom'?70:240;
function osParts(){const L=[];const nW=osNW();
  const fL=Math.min(.32,OS.CL*OS.i*3),nSL=Math.round(nW*fL);
  for(let k=0;k<nW-nSL;k++)L.push({s:-1,x:Math.random(),y:Math.random(),ty:'w'});
  for(let k=0;k<nSL;k++)L.push({s:-1,x:Math.random(),y:Math.random(),ty:'s'});
  const fs=Math.min(.32,OS.C*OS.i*3);const nS=Math.round(nW*fs),nWR=nW-nS;
  for(let k=0;k<nWR;k++)L.push({s:1,x:Math.random(),y:Math.random(),ty:'w'});for(let k=0;k<nS;k++)L.push({s:1,x:Math.random(),y:Math.random(),ty:'s'});
  L.forEach(p=>{const a=Math.random()*TAU;p.vx=Math.cos(a)*.25;p.vy=Math.sin(a)*.25;});OS.parts=L;OS.ev=[];}
function osReset(){OS.dh=0;OS.t=0;OS.sc=1;OS.burst=0;osParts();}
function osStep(dt){OS.t+=dt;const pi=piOf();const hyd=OS.dh/1033.6;
  if(OS.mode==='u'){const k=0.6;OS.dh+=k*((pi-OS.P)*1033.6-OS.dh)*dt;
    // 粒子：s=-1 左邊（純水）、1 右邊；x∈[0,1] 是各自那半邊的位置，膜在左半 x=1、右半 x=0
    const R=OS.parts,nR=R.filter(p=>p.s===1).length,xwR=R.filter(p=>p.s===1&&p.ty==='w').length/nR;
    const f=pi>1e-9?1+((hyd+OS.P)/pi)*(1/Math.max(xwR,.01)-1):1+(hyd+OS.P)*3;const NW=osNW();
    let lr=0,rl=0;
    R.forEach(p=>{p.vx+=(Math.random()-.5)*1.2*dt*6;p.vy+=(Math.random()-.5)*1.2*dt*6;const sp=Math.hypot(p.vx,p.vy);if(sp>.6){p.vx*=.6/sp;p.vy*=.6/sp;}
      p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y<0){p.y=-p.y;p.vy=Math.abs(p.vy);}if(p.y>1){p.y=2-p.y;p.vy=-Math.abs(p.vy);}
      if(p.s===-1){if(p.x<0){p.x=-p.x;p.vx=Math.abs(p.vx);}if(p.x>1){const ok=p.ty==='w'&&Math.random()<0.5;if(ok){p.s=1;p.x=p.x-1;lr++;}else{p.x=2-p.x;p.vx=-Math.abs(p.vx);}}}
      else{if(p.x>1){p.x=2-p.x;p.vx=-Math.abs(p.vx);}if(p.x<0){const ok=p.ty==='w'&&Math.random()<Math.min(1,0.5*f);if(ok){p.s=-1;p.x=1+p.x;rl++;}else{p.x=-p.x;p.vx=Math.abs(p.vx);}}}});
    // 維持兩邊數量（代表後面還有很多溶液），把多出來的水分子從遠端搬回
    const nL=R.filter(p=>p.s===-1).length;if(nL<NW){const c=R.filter(p=>p.s===1&&p.ty==='w'&&p.x>.8);for(let k=0;k<NW-nL&&k<c.length;k++){c[k].s=-1;c[k].x=.05+.1*Math.random();}}
    else if(nL>NW){const c=R.filter(p=>p.s===-1&&p.x<.2);for(let k=0;k<nL-NW&&k<c.length;k++){c[k].s=1;c[k].x=.85+.1*Math.random();}}
    OS.ev.push([OS.t,lr,rl]);while(OS.ev.length&&OS.ev[0][0]<OS.t-3)OS.ev.shift();}
  else{const tgt=OS.ton==='hypo'?(OS.obj==='rbc'?1.42:1.35):OS.ton==='hyper'?.72:1;OS.sc+=(tgt-OS.sc)*Math.min(1,dt*.5);
    if(OS.obj==='rbc'&&OS.ton==='hypo'&&OS.sc>1.33)OS.burst=Math.min(1,OS.burst+dt*.8);}}
TICK.os=dt=>{const d=sdt(OS,dt);if(d){const n=3;for(let i=0;i<n;i++)osStep(d/n);}return busy(OS);};
segOn($('osMode'),v=>{OS.mode=v;$('osUCtl').hidden=v!=='u';$('osUCtl2').hidden=v!=='u';$('osCCtl').hidden=v!=='cell';hideStory();osReset();kick();});
segOn($('osI'),v=>{OS.i=+v;osReset();hideStory();kick();});
segOn($('osObj'),v=>{OS.obj=v;OS.sc=1;OS.burst=0;hideStory();kick();});
segOn($('osTon'),v=>{OS.ton=v;OS.sc=1;OS.burst=0;hideStory();kick();});
const setOSC=sliderBind('osC',v=>{OS.C=v;osParts();},v=>nf(v,3)+' M');
const setOSP=sliderBind('osP',v=>{OS.P=v;},v=>nf(v,2)+' atm');
pbar('os',OS,.4);
segOn($('osView'),v=>{hideStory();OS.view=v;osParts();kick();});
const setOSCL=sliderBind('osCL',v=>{OS.CL=v;osParts();},v=>v===0?'純水':nf(v,3)+' M');
const setOST=sliderBind('osT',v=>{OS.T=v;},v=>v+' ℃');
$('osReset').addEventListener('click',()=>{osReset();kick();});
DRAW.os=()=>{const cv=$('cvOS'),nar=cv.clientWidth<640,{W,H}=fit(cv,nar?1.35:.42,nar?480:300,nar?640:420),g=cv.getContext('2d');g.clearRect(0,0,W,H);
  if(OS.mode==='cell')return drawCell(g,W,H);
  const pi=piOf();const uw=nar?W:W*.42,uh=nar?H*.48:H;
  // ---- U 形管 ----
  const cx=uw/2,tw=Math.min(54,uw*.16,uh*.13),gap=Math.min(110,uw*.34,uh*.26),lx=cx-gap/2-tw/2,rx=cx+gap/2+tw/2,Ro=gap/2+tw,bot=uh-Ro-22,top=26,base=(top+bot)/2+10;
  const eq=(pi-OS.P)*1033.6;const sMax=Math.max(Math.abs(eq),Math.abs(OS.dh),1);const pxPerCm=((bot-top)*.42)/sMax;
  const d=OS.dh*pxPerCm/2;const yl=base+d,yr=base-d;
  g.strokeStyle=C.glass;g.lineWidth=3;
  g.beginPath();g.moveTo(lx-tw/2,top);g.lineTo(lx-tw/2,bot);g.arc(cx,bot,(rx+tw/2)-cx,Math.PI,0,true);g.lineTo(rx+tw/2,top);g.stroke();
  g.beginPath();g.moveTo(lx+tw/2,top);g.lineTo(lx+tw/2,bot);g.arc(cx,bot,cx-(lx+tw/2),Math.PI,0,true);g.lineTo(rx-tw/2,top);g.stroke();
  // 液體
  g.fillStyle=C.liq;g.fillRect(lx-tw/2+2,yl,tw-4,bot-yl);g.fillStyle=OS.C>0?'rgba(232,89,12,.18)':C.liq;g.fillRect(rx-tw/2+2,yr,tw-4,bot-yr);
  g.fillStyle=C.liq;g.beginPath();g.arc(cx,bot,(rx+tw/2)-cx-2,0,Math.PI);g.arc(cx,bot,cx-(lx+tw/2)+2,Math.PI,0,true);g.fill();
  line(g,cx,bot+((rx+tw/2)-cx)-tw,cx,bot+((rx+tw/2)-cx),C.membrane,4);
  text(g,'純水',lx,top-8,{align:'center',size:12,bold:true,col:C.water});text(g,OS.C>0?'溶液':'純水',rx,top-8,{align:'center',size:12,bold:true,col:OS.C>0?C.sol:C.water});
  if(OS.P>0){g.fillStyle=C.muted;g.fillRect(rx-tw/2+3,yr-10,tw-6,8);arrow(g,rx,yr-40,rx,yr-12,C.hot,2.4);text(g,nf(OS.P,2)+' atm',rx,yr-44,{align:'center',size:11,bold:true,col:C.hot,bg:C.panel});}
  if(Math.abs(OS.dh)>0.5){line(g,lx,yl,rx+tw/2+8,yl,C.muted,1,[3,3]);line(g,rx+tw/2+4,yr,rx+tw/2+12,yr,C.muted,1.2);arrow(g,rx+tw/2+8,yl,rx+tw/2+8,yr,C.purple,1.6);
    text(g,'Δh ＝ '+(Math.abs(OS.dh)>=100?nf(OS.dh/100,2)+' m':nf(OS.dh,1)+' cm'),rx+tw/2+14,(yl+yr)/2+4,{size:12,bold:true,col:C.purple,bg:C.panel});}
  text(g,'半透膜',cx,bot+((rx+tw/2)-cx)+16,{align:'center',size:11,col:C.membrane});
  // ---- 放大的半透膜 ----
  const zx=nar?10:uw+10,zy=nar?uh+8:14,zw=nar?W-20:W-uw-24,zh=nar?H-uh-16:H-28;
  g.strokeStyle=C.line;g.lineWidth=1;g.strokeRect(zx,zy,zw,zh);g.fillStyle=C.liq;g.fillRect(zx,zy,zw/2,zh);g.fillStyle=OS.C>0?'rgba(232,89,12,.10)':C.liq;g.fillRect(zx+zw/2,zy,zw/2,zh);
  const mx=zx+zw/2;g.fillStyle=C.membrane;for(let y=zy;y<zy+zh;y+=14)g.fillRect(mx-3,y,6,8);
  const hw=zw/2-8;
  const pr=OS.view==='zoom'?1.9:1;OS.parts.forEach(p=>{const x=p.s===-1?zx+4+p.x*hw:mx+4+p.x*hw,y=zy+6+p.y*(zh-12);dot(g,x,y,(p.ty==='w'?3:5.2)*pr,p.ty==='w'?C.water:C.sol);});
  text(g,'放大：半透膜附近',zx+6,zy+14,{size:11,col:C.muted,bg:C.panel});
  // ---- 速率 ----
  const span=Math.max(.5,Math.min(3,OS.t)),lr=OS.ev.reduce((a,e)=>a+e[1],0)/span,rl=OS.ev.reduce((a,e)=>a+e[2],0)/span;
  const c2=$('cvOSR'),o=fit(c2,.4,150,200),h=c2.getContext('2d');h.clearRect(0,0,o.W,o.H);const mxv=Math.max(10,lr,rl)*1.15,bx=120,bw=o.W-bx-70;
  [['純水 → 溶液',lr,C.water],['溶液 → 純水',rl,C.sol]].forEach(([nm,v,col],k)=>{const y=18+k*46;text(h,nm,bx-8,y+15,{align:'right',size:12});h.fillStyle=col;h.fillRect(bx,y,bw*v/mxv,24);text(h,nf(v,0)+' 個/秒',bx+bw*v/mxv+6,y+16,{size:12,mono:true,bold:true});});
  const net=lr-rl;text(h,Math.abs(net)<3?'兩方向差不多：平衡':net>0?'淨流向：純水 → 溶液（滲透）':'淨流向：溶液 → 純水（逆滲透）',o.W/2,o.H-10,{align:'center',size:13,bold:true,col:Math.abs(net)<3?C.green:net>0?C.water:C.hot});
  $('osNow').innerHTML=[['右側 π＝i·C·R·T',`${OS.i} × ${nf(OS.C,3)} × 0.082 × ${OS.T+273} ＝ ${nf(piSide(OS.C),3)} atm`],
    ['左側 π',OS.CL>0?`${OS.i} × ${nf(OS.CL,3)} × 0.082 × ${OS.T+273} ＝ ${nf(piSide(OS.CL),3)} atm`:'0（純水）'],
    ['兩側的差（會推動水的那個）',nf(pi,3)+' atm'],['換成水柱高度',nf(pi*1033.6,1)+' cm（1 atm ＝ 1033.6 cm 水柱）'],['外加壓力',nf(OS.P,2)+' atm'],['目前液面差 Δh',nf(OS.dh,1)+' cm'],['液柱的壓力 ρgh',nf(OS.dh/1033.6,3)+' atm']].map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
  $('osSay').textContent=OS.C===0?'兩邊都是純水，穿過去的水分子兩方向一樣多，液面不動。':
    OS.P>pi+1e-6?'外加壓力大於滲透壓：溶液這邊的水被壓過去比較多，水分子淨流向純水——逆滲透（海水淡化、淨水器）。':
    `兩邊的水分子都會穿過半透膜。溶液那邊膜上有一部分位置被溶質擋住，每秒穿過來的水分子比較少，所以水淨流入溶液，溶液液面上升。液面差產生的壓力把溶液那邊的水「壓」回去，直到兩方向一樣多（平衡）。平衡時 ρgh ＝ π${OS.P>0?' − 外加壓力':''}。`;};
function drawCell(g,W,H){const cx=W/2,cy=H/2+6,R=Math.min(W,H)*.22*OS.sc;
  g.fillStyle=OS.ton==='hyper'?'rgba(232,89,12,.14)':C.liq;g.fillRect(10,10,W-20,H-20);g.strokeStyle=C.glass;g.lineWidth=3;g.strokeRect(10,10,W-20,H-20);
  const obj=OS.obj,tt=OS.t;
  if(obj==='rbc'){if(OS.burst>=1){g.fillStyle='rgba(201,42,42,.5)';for(let k=0;k<9;k++){const a=k/9*TAU+.3;g.beginPath();g.ellipse(cx+Math.cos(a)*R*.9,cy+Math.sin(a)*R*.7,R*.22,R*.08,a,0,TAU);g.fill();}text(g,'破裂（溶血）',cx,cy+4,{align:'center',size:15,bold:true,col:C.hot});}
    else{g.save();g.translate(cx,cy);g.fillStyle='#d9480f';g.strokeStyle='#8a2d0a';g.lineWidth=2;g.beginPath();const sp=OS.ton==='hyper'?Math.min(1,(1-OS.sc)/0.28):0;
      for(let k=0;k<=72;k++){const a=k/72*TAU;let rr=R*(1+sp*.12*Math.sin(a*12));const x=Math.cos(a)*rr,y=Math.sin(a)*rr*(OS.sc>1.15?0.95:0.62);k?g.lineTo(x,y):g.moveTo(x,y);}g.closePath();g.fill();g.stroke();
      if(OS.sc<1.2){g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.ellipse(0,0,R*.45,R*.25,0,0,TAU);g.fill();}g.restore();}}
  else if(obj==='egg'){g.fillStyle='#fff3bf';g.strokeStyle='#b08900';g.lineWidth=2;g.beginPath();g.ellipse(cx,cy,R*.85,R*1.1,0,0,TAU);g.fill();g.stroke();dot(g,cx,cy+R*.15,R*.38,'#fab005');}
  else{g.fillStyle='#69db7c';g.strokeStyle='#2b8a3e';g.lineWidth=2;g.beginPath();for(let k=0;k<=72;k++){const a=k/72*TAU;const rr=R*(1+(OS.ton==='hyper'?(1-OS.sc)*.5*Math.sin(a*9):0));const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;k?g.lineTo(x,y):g.moveTo(x,y);}g.closePath();g.fill();g.stroke();
    g.fillStyle='#d3f9d8';g.beginPath();g.arc(cx,cy,R*.7,0,TAU);g.fill();for(let k=0;k<8;k++){const a=k/8*TAU;dot(g,cx+Math.cos(a)*R*.38,cy+Math.sin(a)*R*.38,R*.06,'#ebfbee');}}
  // 水分子流向
  const dir=OS.ton==='hypo'?1:OS.ton==='hyper'?-1:0;const moving=Math.abs((OS.ton==='hypo'?(obj==='rbc'?1.42:1.35):OS.ton==='hyper'?.72:1)-OS.sc)>0.02&&OS.burst<1;
  for(let k=0;k<14;k++){const a=k/14*TAU+tt*.2;const ph=((tt*.6+k*.37)%1);let r1;if(dir===0||!moving)r1=R*1.25+Math.sin(tt*3+k)*R*.12;else r1=dir>0?R*(1.6-ph*.6):R*(1+ph*.6);
    dot(g,cx+Math.cos(a)*r1,cy+Math.sin(a)*r1*(obj==='rbc'?0.7:1),3.2,C.water);}
  const nm={rbc:'紅血球',egg:'去殼雞蛋（卵殼膜是半透膜）',veg:'小黃瓜'}[obj],tn={hypo:'清水（低張：外面比較稀）',iso:'等張溶液（例如 0.9% 生理食鹽水）',hyper:'濃溶液（高張：外面比較濃，例如濃食鹽水、濃糖漿）'}[OS.ton];
  text(g,nm+' 放進 '+tn,W/2,32,{align:'center',size:13,bold:true,bg:C.panel});
  text(g,moving?(dir>0?'水淨流入 → 膨脹':'水淨流出 → 皺縮'):(OS.burst>=1?'水流入太多，細胞膜撐破':'進出的水一樣多，大小不變'),W/2,H-22,{align:'center',size:14,bold:true,col:dir>0?C.water:dir<0?C.sol:C.green,bg:C.panel});
  const c2=$('cvOSR'),o=fit(c2,.4,150,200),h=c2.getContext('2d');h.clearRect(0,0,o.W,o.H);text(h,'細胞與雞蛋模式：看上方動畫',o.W/2,o.H/2,{align:'center',size:13,col:C.muted});
  $('osNow').innerHTML=[['大小（和原本比）',nf(OS.sc*100,0)+'%'],['血液的滲透壓','約 7.7 atm（37 ℃）'],['等張溶液','約 0.30 M 粒子：0.3 M 葡萄糖或 0.15 M NaCl']].map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');
  $('osSay').textContent=OS.ton==='hypo'?'外面比細胞內稀（滲透壓小）：水由外往內淨流入，細胞膨脹；紅血球沒有細胞壁，會脹破（溶血）。去殼雞蛋泡清水會變大。':OS.ton==='hyper'?'外面比細胞內濃（滲透壓大）：水由內往外淨流出，細胞皺縮。醃菜、泡黃瓜就是這樣出水變軟；吃太鹹的食物也會讓組織間積水。':'內外滲透壓相等：水進出一樣多。靜脈注射的點滴一定要先調成和血液等張。';}
UI.os=()=>{};
osReset();
</script>
