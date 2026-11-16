<script>
// ======================================================================
// 2 沸點上升
// ======================================================================
const BP={view:'sch',i:1,m:1,P:760};
const xwBP=()=>1/(1+0.018*BP.m*BP.i);
segOn($('bpView'),v=>{BP.view=v;hideStory();kick();});
segOn($('bpI'),v=>{BP.i=+v;bhReset();hideStory();kick();});
const setBPM=sliderBind('bpM',v=>{BP.m=v;bhReset();},v=>nf(v,1)+' m');
const setBPP=sliderBind('bpP',v=>{BP.P=v;bhReset();},v=>v+' mmHg'+(v===760?'（1 atm）':''));
function tbPure(){return solve(T=>Pw(T)-BP.P,1,140);}
function tbSol(){const x=xwBP();return solve(T=>x*Pw(T)-BP.P,1,160);}
function tfSol(){const x=xwBP();return solve(T=>Pice(T)-x*Pliq0(T),-40,0.01);}
DRAW.bp=()=>{const cv=$('cvBP'),{W,H}=fit(cv,.45,300,440),g=cv.getContext('2d');g.clearRect(0,0,W,H);
  const l=60,r=20,t=16,b=40,gw=W-l-r,gh=H-t-b;const x=xwBP();
  line(g,l,t+gh,W-r,t+gh,C.muted,1.2);line(g,l,t,l,t+gh,C.muted,1.2);
  const curve=(f,T0,T1,X,Y,col,w,dash)=>{g.strokeStyle=col;g.lineWidth=w;g.setLineDash(dash||[]);g.beginPath();for(let k=0;k<=200;k++){const T=T0+(T1-T0)*k/200;const px=X(T),py=Y(f(T));k?g.lineTo(px,py):g.moveTo(px,py);}g.stroke();g.setLineDash([]);};
  g.save();g.beginPath();g.rect(l,t,gw,gh);g.clip();
  if(BP.view==='sch'){
    const ex=1/(1+0.25*BP.m*BP.i);const T0=0,T1=10,Tf0=2.2,Tb0=7.2;
    const Pl=T=>Math.exp(0.3*(T-Tb0)),Ps=T=>Pl(Tf0)*Math.exp(0.75*(T-Tf0));
    const X=T=>l+(T-T0)/(T1-T0)*gw,Y=P=>t+gh-P/1.6*gh;
    const tbS=solve(T=>ex*Pl(T)-1,0,20),tfS=solve(T=>Ps(T)-ex*Pl(T),-5,Tf0+.001);
    // 區域
    g.fillStyle=C.icebg;g.beginPath();g.moveTo(X(0),Y(Ps(0)));for(let T=0;T<=Tf0;T+=.05)g.lineTo(X(T),Y(Ps(T)));g.lineTo(X(Tf0),t);g.lineTo(X(0),t);g.closePath();g.globalAlpha=.6;g.fill();g.globalAlpha=1;
    curve(Ps,0,Tf0,X,Y,C.ice,3);curve(Pl,Tf0,T1,X,Y,C.water,3);curve(T=>ex*Pl(T),tfS,T1,X,Y,C.sol,3,[7,5]);
    line(g,l,Y(1),W-r,Y(1),C.muted,1.2,[4,4]);
    // ① ② ③
    line(g,X(Tb0),Y(1),X(Tb0),t+gh,C.muted,1,[2,3]);line(g,X(tbS),Y(1),X(tbS),t+gh,C.muted,1,[2,3]);
    line(g,X(Tf0),Y(Ps(Tf0)),X(Tf0),t+gh,C.muted,1,[2,3]);line(g,X(tfS),Y(Ps(tfS)),X(tfS),t+gh,C.muted,1,[2,3]);
    const yb=t+gh-14;arrow(g,X(Tb0),yb,X(tbS),yb,C.hot,1.8);text(g,'① ΔTb',(X(Tb0)+X(tbS))/2,yb-6,{align:'center',size:13,bold:true,col:C.hot});
    arrow(g,X(Tf0),yb,X(tfS),yb,C.blue,1.8);text(g,'② ΔTf',(X(Tf0)+X(tfS))/2-4,yb-6,{align:'center',size:13,bold:true,col:C.blue});
    const T3=5.4;arrow(g,X(T3),Y(ex*Pl(T3)),X(T3),Y(Pl(T3)),C.purple,1.8);text(g,'③ ΔP ＝ X溶質·P°',X(T3)+6,(Y(Pl(T3))+Y(ex*Pl(T3)))/2+4,{size:12,bold:true,col:C.purple});
    text(g,'固',X(.7),Y(1.25),{size:16,bold:true,col:C.muted});text(g,'液',X(4.2),Y(1.25),{size:16,bold:true,col:C.muted});text(g,'氣',X(5.6),Y(.18),{size:16,bold:true,col:C.muted});
    g.restore();
    text(g,'1 atm',W-r-4,Y(1)-5,{align:'right',size:12,col:C.muted});
    text(g,'溫度 →',W-r,H-8,{align:'right',size:12,col:C.muted});text(g,'蒸氣壓 ↑',l+4,t+12,{size:12,col:C.muted,bg:C.panel});
    text(g,'正常沸點',X(Tb0),t+gh+14,{align:'center',size:11,col:C.muted});text(g,'凝固點',X(Tf0),t+gh+14,{align:'center',size:11,col:C.muted});
    text(g,'純溶劑（液）',X(8.3),Y(Pl(8.3))-8,{align:'right',size:12,bold:true,col:C.water});text(g,'溶液',X(9.4),Y(ex*Pl(9.4))+16,{align:'right',size:12,bold:true,col:C.sol});text(g,'固體（冰）',X(1.2),Y(Ps(1.2))+18,{align:'center',size:12,bold:true,col:C.ice});
    $('bpHint').textContent='示意圖（不按比例，差距放大很多倍）：實線是純溶劑，虛線是溶液。溶液的液體蒸氣壓整條變低：要更高溫才碰到 1 atm（沸點上升 ①），和固體蒸氣壓曲線的交點往左移（凝固點下降 ②）。凝固點是「固體蒸氣壓＝液體蒸氣壓」的溫度。';
  } else if(BP.view==='hi'){
    const tb0=tbPure(),tb1=tbSol();const T0=Math.floor(tb0-3),T1=Math.ceil(tb1+3);const Pm=BP.P;const P0=Pm*.8,P1=Pm*1.2;
    const X=T=>l+(T-T0)/(T1-T0)*gw,Y=P=>t+gh-(P-P0)/(P1-P0)*gh;
    curve(Pw,T0,T1,X,Y,C.water,3);curve(T=>x*Pw(T),T0,T1,X,Y,C.sol,3,[7,5]);
    line(g,l,Y(Pm),W-r,Y(Pm),C.muted,1.4,[4,4]);
    dot(g,X(tb0),Y(Pm),5,C.water);dot(g,X(tb1),Y(Pm),5,C.sol);
    line(g,X(tb0),Y(Pm),X(tb0),t+gh,C.water,1,[2,3]);line(g,X(tb1),Y(Pm),X(tb1),t+gh,C.sol,1,[2,3]);
    const ya=Y(Pm)+28;if(tb1-tb0>0.05){arrow(g,X(tb0),ya,X(tb1),ya,C.hot,1.8);text(g,'ΔTb ＝ '+nf(tb1-tb0,2)+' ℃',(X(tb0)+X(tb1))/2,ya+16,{align:'center',size:13,bold:true,col:C.hot,bg:C.panel});}
    const Tm=(T0+tb0)/2+.5;if(Tm<tb0){arrow(g,X(Tm),Y(x*Pw(Tm)),X(Tm),Y(Pw(Tm)),C.purple,1.6);}
    g.restore();
    for(let T=T0;T<=T1;T+=(T1-T0>12?2:1))text(g,T+'',X(T),t+gh+14,{align:'center',size:10,mono:true,col:C.muted});
    for(let k=0;k<=4;k++){const P=P0+(P1-P0)*k/4;text(g,nf(P,0),l-4,Y(P)+4,{align:'right',size:10,mono:true,col:C.muted});}
    text(g,'溫度（℃）',W-r,H-6,{align:'right',size:11,col:C.muted});text(g,'蒸氣壓（mmHg）',l+4,t+12,{size:11,col:C.muted,bg:C.panel});
    text(g,'外界壓力 '+Pm+' mmHg',W-r-4,Y(Pm)-6,{align:'right',size:12,col:C.muted,bg:C.panel});
    text(g,'純水',X(T1-.4),Y(Pw(T1-.4))-6,{align:'right',size:12,bold:true,col:C.water,bg:C.panel});text(g,'溶液',X(T1-.4),Y(x*Pw(T1-.4))+16,{align:'right',size:12,bold:true,col:C.sol,bg:C.panel});
    $('bpHint').textContent='真實的水蒸氣壓曲線。純水的蒸氣壓在 '+nf(tb0,1)+' ℃ 等於外界壓力就沸騰；溶液的蒸氣壓每個溫度都只有純水的 X水 倍，要加熱到 '+nf(tb1,2)+' ℃ 才達到外界壓力。把外界壓力調低（高山上），沸點變低。';
  } else {
    const tf1=tfSol();const T0=Math.min(-3,Math.floor(tf1-1.5)),T1=2;const P0=Pice(T0)*.92,P1=Pliq0(T1)*1.04;
    const X=T=>l+(T-T0)/(T1-T0)*gw,Y=P=>t+gh-(P-P0)/(P1-P0)*gh;
    curve(Pice,T0,T1,X,Y,C.ice,3);curve(Pliq0,T0,T1,X,Y,C.water,3);curve(T=>x*Pliq0(T),T0,T1,X,Y,C.sol,3,[7,5]);
    dot(g,X(0),Y(Pice(0)),5,C.water);dot(g,X(tf1),Y(Pice(tf1)),5,C.sol);
    line(g,X(0),Y(Pice(0)),X(0),t+gh,C.water,1,[2,3]);line(g,X(tf1),Y(Pice(tf1)),X(tf1),t+gh,C.sol,1,[2,3]);
    const ya=t+gh-16;if(-tf1>0.05){arrow(g,X(0),ya,X(tf1),ya,C.blue,1.8);text(g,'ΔTf ＝ '+nf(-tf1,2)+' ℃',(X(0)+X(tf1))/2,ya-6,{align:'center',size:13,bold:true,col:C.blue,bg:C.panel});}
    g.restore();
    for(let T=T0;T<=T1;T+=(T1-T0>10?2:1))text(g,T+'',X(T),t+gh+14,{align:'center',size:10,mono:true,col:C.muted});
    for(let k=0;k<=4;k++){const P=P0+(P1-P0)*k/4;text(g,nf(P,2),l-4,Y(P)+4,{align:'right',size:10,mono:true,col:C.muted});}
    text(g,'溫度（℃）',W-r,H-6,{align:'right',size:11,col:C.muted});text(g,'蒸氣壓（mmHg）',l+4,t+12,{size:11,col:C.muted,bg:C.panel});
    text(g,'冰（固體）',X(T0+.3),Y(Pice(T0+.3))+16,{size:12,bold:true,col:C.ice,bg:C.panel});text(g,'純水（液）',X(T1-.2),Y(Pliq0(T1-.2))-6,{align:'right',size:12,bold:true,col:C.water,bg:C.panel});text(g,'溶液',X(T1-.2),Y(x*Pliq0(T1-.2))+16,{align:'right',size:12,bold:true,col:C.sol,bg:C.panel});
    $('bpHint').textContent='0 ℃ 附近的真實曲線：冰的蒸氣壓曲線比液態水陡。純水在 0 ℃ 時冰和水的蒸氣壓相等（凝固點）；溶液的蒸氣壓變低，要降到 '+nf(tf1,2)+' ℃ 才和冰的蒸氣壓相等。溶液結冰時析出的是純冰。';
  }
  const dTb=KB*BP.m*BP.i,dTf=KF*BP.m*BP.i;
  $('bpF').innerHTML=`X水 ＝ 1 ／（1 ＋ 0.018 × ${nf(BP.m,1)} × ${BP.i}）＝ ${nf(x,4)}<br>公式：ΔTb ＝ Kb·Cm·i ＝ 0.52 × ${nf(BP.m,1)} × ${BP.i} ＝ ${nf(dTb,2)} ℃<br>　　　ΔTf ＝ Kf·Cm·i ＝ 1.86 × ${nf(BP.m,1)} × ${BP.i} ＝ ${nf(dTf,2)} ℃<br>由曲線交點：沸點 ${nf(tbSol(),2)} ℃（純水 ${nf(tbPure(),2)} ℃）、凝固點 ${nf(tfSol(),2)} ℃`;
  drawBH();};
// ---- 加熱 ----
const BH={run:false,spd:.5,t:0,pure:null,sol:null,hist:[]};
function bhReset(){BH.run=false;BH.t=0;BH.pure={T:25,W:1000};BH.sol={T:25,W:1000};BH.hist=[[0,25,25]];$('bhPlay').textContent='▶ 開始加熱';}
function bhStep(dt){BH.t+=dt;const tb0=tbPure();
  [['pure',0],['sol',BP.m*BP.i]].forEach(([k,n])=>{const s=BH[k];const Tb=tb0+KB*n*1000/s.W;
    if(s.T<Tb-1e-6){s.T=Math.min(Tb,s.T+7*dt);}else{s.W=Math.max(300,s.W-30*dt);s.T=tb0+KB*n*1000/s.W;}});
  BH.hist.push([BH.t,BH.pure.T,BH.sol.T]);if(BH.sol.W<=300.5||BH.t>40){BH.run=false;$('bhPlay').textContent='▶ 再一次';}}
TICK.bp=dt=>{const d=sdt(BH,dt);if(d){const n=4;for(let i=0;i<n;i++)bhStep(d/n);}return busy(BH);};
$('bhPlay').addEventListener('click',()=>{if(BH.run){BH.run=false;$('bhPlay').textContent='▶ 繼續';return;}if(BH.t>=40||BH.sol.W<=300.5)bhReset();BH.run=true;$('bhPlay').textContent='❚❚ 暫停';kick();});
$('bhStep').addEventListener('click',()=>{if(BH.t>=40||BH.sol.W<=300.5)bhReset();BH.run=false;$('bhPlay').textContent='▶ 繼續';BH.pend=(BH.pend||0)+.5;kick();});
segSet($('bhSpd'),BH.spd);segOn($('bhSpd'),v=>{BH.spd=+v;kick();});
$('bhReset').addEventListener('click',()=>{bhReset();kick();});
function drawBH(){const tb0=tbPure();const tEnd=Math.max(30,BH.t);const ymax=tb0+KB*BP.m*BP.i*1000/300+1.5,ymin=Math.min(tb0-6,ymax-12);
  chart($('cvBH'),{ratio:.55,x0:0,x1:tEnd,y0:ymin,y1:ymax,xl:'加熱時間（示意）',yl:'溫度（℃）',xfmt:v=>nf(v,0),yfmt:v=>nf(v,1),
    series:[{pts:BH.hist.map(r=>[r[0],r[1]]),col:C.water,w:2.6},{pts:BH.hist.map(r=>[r[0],r[2]]),col:C.sol,w:2.6}],
    extra:(g,X,Y,o)=>{line(g,o.l,Y(tb0),o.l+o.gw,Y(tb0),C.water,1,[4,4]);text(g,'純水沸點 '+nf(tb0,1)+' ℃',o.l+6,Y(tb0)-4,{size:11,col:C.water,bg:C.panel});
      const last=BH.hist[BH.hist.length-1];if(BH.t>0){text(g,'純水 '+nf(last[1],2)+' ℃',o.l+o.gw-4,o.t+14,{align:'right',size:12,bold:true,col:C.water,bg:C.panel});text(g,'溶液 '+nf(last[2],2)+' ℃',o.l+o.gw-4,o.t+30,{align:'right',size:12,bold:true,col:C.sol,bg:C.panel});}}});
  $('bhSay').textContent=BP.m===0?'兩杯都是純水，溫度曲線完全重疊。':BH.t<=0?'按「開始加熱」。':`純水沸騰後溫度停在沸點；溶液比較晚沸騰（沸點較高），而且沸騰時只有水變成蒸氣，溶液愈來愈濃（現在 ${nf(BP.m*1000/BH.sol.W,2)} m），沸點跟著一直上升，所以曲線是斜的。`;}
UI.bp=()=>{};
bhReset();

// ======================================================================
// 3 凝固點下降：冰水交界面
// ======================================================================
let FPC=20,FPR=10;
const FPV={zoom:[20,10],full:[64,34]};
const FP={T:0,xs:0,view:'zoom',mark:true,run:!reduced,spd:.5,grid:null,flash:null,ev:[],t:0,cf:0,cm:0};
function fpDims(){[FPC,FPR]=FPV[FP.view];}
// 格子：0 水、1 溶質、2 冰
function fpReset(){fpDims();const g=new Uint8Array(FPC*FPR),f=new Float32Array(FPC*FPR);
  for(let r=0;r<FPR;r++)for(let c=0;c<FPC;c++)g[r*FPC+c]=c<FPC*.42?2:0;
  const liq=[];g.forEach((v,i)=>{if(v===0)liq.push(i);});liq.sort(()=>Math.random()-.5);const ns=Math.round(liq.length*FP.xs/100);for(let k=0;k<ns;k++)g[liq[k]]=1;
  FP.grid=g;FP.flash=f;FP.ev=[];FP.t=0;FP.cf=0;FP.cm=0;}
const PF=0.06; // 每個鄰近冰的水分子每秒凝固的機率
function fpStep(dt){const g=FP.grid,f=FP.flash;FP.t+=dt;const pm=PF*Math.exp(FP.T/26);let fr=0,me=0;
  // 液體擴散
  for(let k=0;k<FPC*FPR*.6;k++){const i=Math.floor(Math.random()*g.length);if(g[i]===2)continue;const r=Math.floor(i/FPC),c=i%FPC;const d=Math.floor(Math.random()*4);const rr=r+(d===2)-(d===3),cc=c+(d===0)-(d===1);
    if(rr<0||rr>=FPR||cc<0||cc>=FPC)continue;const j=rr*FPC+cc;if(g[j]===2)continue;const tmp=g[i];g[i]=g[j];g[j]=tmp;}
  const toF=[],toM=[];let nF=0,nM=0;
  for(let r=0;r<FPR;r++)for(let c=0;c<FPC;c++){const i=r*FPC+c,v=g[i];
    const nb=[c+1<FPC?i+1:-1,c>0?i-1:-1,r+1<FPR?i+FPC:-1,r>0?i-FPC:-1];
    if(v===0){if(nb.some(j=>j>=0&&g[j]===2)){nF++;if(Math.random()<PF*dt*10)toF.push(i);}}
    else if(v===2){if(nb.some(j=>j>=0&&g[j]!==2)){nM++;if(Math.random()<pm*dt*10)toM.push(i);}}}
  toF.forEach(i=>{g[i]=2;f[i]=FP.t;fr++;FP.cf++;});toM.forEach(i=>{if(g[i]===2){g[i]=0;f[i]=-FP.t;me++;FP.cm++;}});
  FP.ev.push([FP.t,nF*PF*10,nM*pm*10]);while(FP.ev.length&&FP.ev[0][0]<FP.t-1.5)FP.ev.shift();}
TICK.fp=dt=>{const d=sdt(FP,dt);if(d)fpStep(d);let more=busy(FP);if(CC.run){ccTick(dt);more=true;}return more;};
const setFPT=sliderBind('fpT',v=>{FP.T=v;FP.ev=[];},v=>nf(v,1)+' ℃');
const setFPX=sliderBind('fpX',v=>{FP.xs=v;fpReset();},v=>v===0?'純水':'液體的 '+v+'%');
pbar('fp',FP,.3);
segOn($('fpView'),v=>{hideStory();FP.view=v;fpReset();kick();});
$('fpMark').addEventListener('change',e=>{FP.mark=e.target.checked;kick();});
$('fpReset').addEventListener('click',()=>{fpReset();kick();});
DRAW.fp=()=>{const cv=$('cvFP'),{W,H}=fit(cv,.42,240,400),g=cv.getContext('2d');g.clearRect(0,0,W,H);
  const cs=Math.min(W/FPC,(H-6)/FPR),ox=(W-cs*FPC)/2,oy=(H-cs*FPR)/2;const G=FP.grid,F=FP.flash,tt=performance.now()/1000;
  g.fillStyle=C.icebg;g.fillRect(ox,oy,cs*FPC,cs*FPR);
  const Z=FP.view==='zoom';
  const adj=i=>{const r=Math.floor(i/FPC),c=i%FPC;return [c+1<FPC?i+1:-1,c>0?i-1:-1,r+1<FPR?i+FPC:-1,r>0?i-FPC:-1].some(j=>j>=0&&G[j]===2);};
  for(let i=0;i<G.length;i++){const r=Math.floor(i/FPC),c=i%FPC,v=G[i];const fl=F[i];const age=fl>0?FP.t-fl:fl<0?FP.t+fl:9;
    if(v===2){const x=ox+c*cs+(r%2?cs*.25:-cs*.0),y=oy+r*cs;g.fillStyle=C.ice;g.fillRect(ox+c*cs+cs*.12,y+cs*.12,cs*.76,cs*.76);
      if(age<.6&&fl>0){g.strokeStyle=C.accent;g.lineWidth=2.5;g.strokeRect(ox+c*cs+1,y+1,cs-2,cs-2);}}
    else{const jx=Math.sin(tt*6+i*1.3)*cs*.14,jy=Math.cos(tt*5.1+i*2.1)*cs*.14;const x=ox+(c+.5)*cs+jx,y=oy+(r+.5)*cs+jy;
      g.fillStyle=C.panel;g.fillRect(ox+c*cs,oy+r*cs,cs+.5,cs+.5);
      if(FP.mark&&adj(i)){g.strokeStyle=v===1?C.muted:C.blue;g.lineWidth=Z?2:1.2;g.setLineDash(v===1?[3,3]:[]);g.beginPath();g.arc(ox+(c+.5)*cs,oy+(r+.5)*cs,cs*.46,0,TAU);g.stroke();g.setLineDash([]);}
      dot(g,x,y,(v===1?.42:.3)*cs*(Z?1.1:1),v===1?C.sol:C.water);if(age<.6&&fl<0){g.strokeStyle=C.hot;g.lineWidth=2.5;g.beginPath();g.arc(x,y,cs*.5,0,TAU);g.stroke();}}}
  const nIce=G.reduce((a,v)=>a+(v===2),0);
  text(g,`冰 ${nIce} 個分子`,ox+8,oy+16,{size:12,mono:true,bold:true,bg:C.panel});text(g,`溫度 ${nf(FP.T,1)} ℃`,ox+cs*FPC-8,oy+16,{align:'right',size:12,mono:true,bold:true,bg:C.panel});
  if(FP.mark)text(g,'藍圈＝冰面旁邊、可以黏上去的水分子；灰虛圈＝那個位置被溶質佔住了',ox+cs*FPC/2,oy+cs*FPR-6,{align:'center',size:11,col:C.muted,bg:C.panel});
  // 速率圖
  const ne=Math.max(1,FP.ev.length),fr=FP.ev.reduce((a,e)=>a+e[1],0)/ne,me=FP.ev.reduce((a,e)=>a+e[2],0)/ne;
  const c2=$('cvFPR'),o=fit(c2,.4,150,200),h=c2.getContext('2d');h.clearRect(0,0,o.W,o.H);
  const mx=Math.max(10,fr,me)*1.15,bx=110,bw=o.W-bx-60;
  [['凝固（水→冰）',fr,C.ice],['熔化（冰→水）',me,C.hot]].forEach(([nm,v,col],k)=>{const y=20+k*46;text(h,nm,bx-8,y+15,{align:'right',size:12});h.fillStyle=col;h.fillRect(bx,y,bw*v/mx,24);text(h,nf(v,1)+' 次/秒',bx+bw*v/mx+6,y+16,{size:12,mono:true,bold:true});});
  text(h,`累計：凝固 ${FP.cf} 次、熔化 ${FP.cm} 次`,bx,20+2*46+14,{size:12,mono:true,col:C.muted});
  const net=fr-me,thr=Math.max(.6,(fr+me)*.015);text(h,net>thr?'淨結果：冰變多（溫度低於凝固點）':net<-thr?'淨結果：冰變少（溫度高於凝固點）':'兩個速率差不多：接近凝固點（平衡）',o.W/2,o.H-12,{align:'center',size:13,bold:true,col:Math.abs(net)<=thr?C.green:net>0?C.blue:C.hot});
  $('fpSay').textContent=FP.xs===0?'純水：0 ℃ 時凝固與熔化的速率相等（動態平衡）。溫度愈低，冰上的分子愈不容易脫離，熔化變慢。':
    `溶液：冰面旁邊有一部分位置是溶質，溶質不會變成冰，所以每秒「黏上冰」的水分子變少；熔化速率只和溫度有關，不受影響。0 ℃ 時熔化比較快，冰會變少——要降到更低溫，讓熔化也變慢，兩者才再次相等，這就是溶液的凝固點。（模擬中溫度效應放大，只看趨勢）`;
  drawCC();};
UI.fp=()=>{};
fpReset();

// ---- 冷卻曲線 ----
const CC={run:false,t:0,m:1,sup:true,s:[],hist:[],ext:null};
const CCB=-10,CCK=0.12;
function ccReset(){CC.run=false;CC.t=0;CC.s=[{T:15,f:0,nuc:false,m:0},{T:15,f:0,nuc:false,m:CC.m}];CC.hist=[[0,15,15]];CC.nucT=[null,null];$('ccPlay').textContent='▶ 開始冷卻';}
function ccTick(dt){const h=dt*6*(FP.spd==null?1:FP.spd*2);const n=8;for(let k=0;k<n;k++)ccStep(h/n);if(CC.t>100){CC.run=false;$('ccPlay').textContent='▶ 再一次';}}
function ccStep(dt){CC.t+=dt;CC.s.forEach((s,k)=>{const Teq=-KF*s.m/(1-s.f);
  if(!s.nuc){s.T+=-CCK*(s.T-CCB)*dt;const thr=CC.sup?Teq-3.5:Teq;if(s.T<=thr){s.nuc=true;CC.nucT[k]=CC.t;s.f=Math.min(.95,s.f+(Teq-s.T)/80);}}
  else{const Te=-KF*s.m/(1-s.f);if(s.T<Te-0.01){s.T+=Math.min(Te-s.T,25*dt);}
    else if(s.f<0.999&&(s.m===0||Te>CCB+0.3)){const q=CCK*(s.T-CCB)*dt;s.f=Math.min(s.m===0?1:.97,s.f+q/80);s.T=-KF*s.m/(1-s.f);}
    else{s.T+=-CCK*2*(s.T-CCB)*dt;}}});
  CC.hist.push([CC.t,CC.s[0].T,CC.s[1].T]);}
$('ccPlay').addEventListener('click',()=>{if(CC.run){CC.run=false;$('ccPlay').textContent='▶ 繼續';return;}if(CC.t>100)ccReset();CC.run=true;$('ccPlay').textContent='❚❚ 暫停';kick();});
$('ccReset').addEventListener('click',()=>{ccReset();kick();});
$('ccSuper').addEventListener('change',e=>{CC.sup=e.target.checked;ccReset();kick();});
const setCCM=sliderBind('ccM',v=>{CC.m=v;ccReset();},v=>nf(v,1)+' m');
function drawCC(){const h=CC.hist;const tf=-KF*CC.m;
  // 外插：溶液成核後的斜線往回延伸
  let ext=null;const tn=CC.nucT[1];if(CC.sup&&tn!=null){const a=h.find(r=>r[0]>=tn+6),b=h.find(r=>r[0]>=tn+22);if(a&&b){const sl=(b[2]-a[2])/(b[0]-a[0]);
    // 與成核前的液體冷卻曲線交點
    let best=null;for(const r of h){if(r[0]>tn)break;const yl=a[2]+sl*(r[0]-a[0]);if(r[2]<=yl){best=r;break;}}
    if(best)ext={x0:best[0],y0:best[2],x1:b[0],y1:b[2]};}}
  chart($('cvCC'),{ratio:.55,x0:0,x1:Math.max(60,CC.t),y0:-11,y1:16,xl:'時間（示意）',yl:'溫度（℃）',yt:9,yfmt:v=>nf(v,0),
    series:[{pts:h.map(r=>[r[0],r[1]]),col:C.water,w:2.4},{pts:h.map(r=>[r[0],r[2]]),col:C.sol,w:2.4}],
    extra:(g,X,Y,o)=>{line(g,o.l,Y(0),o.l+o.gw,Y(0),C.water,1,[4,4]);line(g,o.l,Y(tf),o.l+o.gw,Y(tf),C.sol,1,[4,4]);
      text(g,'0 ℃',o.l+o.gw-4,Y(0)-4,{align:'right',size:11,col:C.water,bg:C.panel});text(g,'溶液凝固點 '+nf(tf,2)+' ℃',o.l+o.gw-4,Y(tf)+14,{align:'right',size:11,col:C.sol,bg:C.panel});
      if(ext){line(g,X(ext.x0),Y(ext.y0),X(ext.x1),Y(ext.y1),C.purple,1.6,[5,4]);dot(g,X(ext.x0),Y(ext.y0),4,C.purple);text(g,'外插 → 凝固點',X(ext.x0)+6,Y(ext.y0)-8,{size:11,bold:true,col:C.purple,bg:C.panel});}
      text(g,'冷卻槽 −10 ℃',o.l+4,Y(-10)-4,{size:10,col:C.muted});}});
  const s=CC.s;$('ccNow').innerHTML=[['純水：溫度／結冰',nf(s[0].T,2)+' ℃ ／ '+nf(s[0].f*100,0)+'%'],['溶液（'+nf(CC.m,1)+' m）：溫度／結冰',nf(s[1].T,2)+' ℃ ／ '+nf(s[1].f*100,0)+'%'],['剩下溶液的濃度',nf(CC.m/(1-s[1].f),2)+' m']].map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('');}
ccReset();
</script>
