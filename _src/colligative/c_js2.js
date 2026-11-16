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
let FPC=11,FPR=13;
const FPV={zoom:[11,13],full:[24,28]},FPTS=14;   // FPTS：熔化速率隨溫度變化的尺度（℃）
const FP={T:-1,xs:8,type:'1',view:'zoom',mark:true,run:false,spd:.5,box:[],t:0,scene:'if'};
const fpI=()=>FP.type==='vol'?1:+FP.type;        // 一個化學式單位解離出幾個粒子
function fpDims(){[FPC,FPR]=FPV[FP.view];}
function fpMake(sol){const n=FPC*FPR,g=new Uint8Array(n),f=new Float32Array(n);
  // 一開始全部都是液體，冰要自己從上面的冷板長出來
  if(sol){const liq=[];g.forEach((v,i)=>{if(v===0)liq.push(i);});
    for(let k=liq.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[liq[k],liq[j]]=[liq[j],liq[k]];}
    const i=fpI(),want=Math.min(liq.length-FPC*2,FP.xs*i);
    for(let k=0;k<want;k++)g[liq[k]]=(FP.type==='vol')?3:(k%i===0?1:4);}  // 1=溶質本體 4=解離出來的離子 3=揮發性分子
  return{g,f,cf:0,cm:0,fr:0,me:0,dacc:0};}
function fpReset(){fpDims();FP.box=[fpMake(false),fpMake(true)];FP.t=0;}
const PF=0.06;                                   // 每個鄰近冰的水分子每秒凝固的機率
function fpStepBox(b,dt){const g=b.g,f=b.f,pm=PF*Math.exp(FP.T/FPTS),cold=FP.T<0;
  b.dacc+=FPC*FPR*0.5*dt;let nsw=Math.floor(b.dacc);b.dacc-=nsw;
  for(let k=0;k<nsw;k++){const i=Math.floor(Math.random()*g.length);if(g[i]===2)continue;
    const r=Math.floor(i/FPC),c=i%FPC,d=Math.floor(Math.random()*4),rr=r+(d===2)-(d===3),cc=c+(d===0)-(d===1);
    if(rr<0||rr>=FPR||cc<0||cc>=FPC)continue;const j=rr*FPC+cc;if(g[j]===2)continue;const t=g[i];g[i]=g[j];g[j]=t;}
  // 以「冰面上的位置」為單位：每個位置都可能長一顆水分子上去，或掉一顆下來。
  // 這樣兩杯的冰面大小就算不同也能公平比較——差別只在位置有沒有被溶質佔住。
  const toF=[],toM=[];let nS=0,nM=0,nw=0,nall=0;
  // 冰面上的每個位置都可能長一顆水分子上去，或掉一顆下來
  for(let r=0;r<FPR;r++)for(let c=0;c<FPC;c++){const i=r*FPC+c;if(g[i]!==2)continue;
    const nb=[c+1<FPC?i+1:-1,c>0?i-1:-1,r+1<FPR?i+FPC:-1,r>0?i-FPC:-1].filter(j=>j>=0&&g[j]!==2);
    if(!nb.length)continue;nM++;nS++;nall+=nb.length;nb.forEach(j=>{if(g[j]===0)nw++;});
    const j=nb[Math.floor(Math.random()*nb.length)];
    if(g[j]===0&&Math.random()<PF*dt*10)toF.push(j);
    if(Math.random()<pm*dt*10)toM.push(i);}
  // 最上面那一排貼著冷板：冷板低於 0 ℃ 時，冰可以直接從那裡長出來
  if(cold)for(let c=0;c<FPC;c++){const i=c;if(g[i]===2)continue;nS++;
    if(g[i]===0&&Math.random()<PF*dt*10)toF.push(i);}
  toF.forEach(i=>{if(g[i]===0){g[i]=2;f[i]=FP.t;b.cf++;}});
  toM.forEach(i=>{if(g[i]===2){g[i]=0;f[i]=-FP.t;b.cm++;}});
  const wf=nall?nw/nall:1;                       // 冰面旁邊有多少比例是「可以黏上去的水分子」
  const fr=nM*PF*10*wf,me=nM*pm*10,k=Math.min(1,dt/3);   // 比較的是「冰面上」的速率，不含冷板   // 平滑 1.5 秒，數字才不會亂跳
  b.nM=nM;b.wf=nall?wf:null;b.fr=(b.fr||fr)+(fr-(b.fr||fr))*k;b.me=(b.me||me)+(me-(b.me||me))*k;}
function fpStep(dt){FP.t+=dt;FP.box.forEach(b=>fpStepBox(b,dt));}
const FPCOL=v=>v===1?C.sol:v===4?C.ion2:v===3?C.vol:C.water;
DRAW.fp=()=>{const cv=$('cvFP'),{W,H}=fit(cv,.46,260,440),g=cv.getContext('2d');g.clearRect(0,0,W,H);
  const gap=18,bw=(W-gap*3)/2,top=30,bot=H-26,cs=Math.min(bw/FPC,(bot-top)/FPR),
        ox0=[gap+(bw-cs*FPC)/2,gap*2+bw+(bw-cs*FPC)/2],oy=top+((bot-top)-cs*FPR)/2,Z=FP.view==='zoom';
  FP.box.forEach((b,k)=>{const ox=ox0[k],G=b.g,F=b.f;
    g.fillStyle=C.icebg;g.fillRect(ox,oy,cs*FPC,cs*FPR);
    g.fillStyle=FP.T<0?'#9fb6c9':'#d7dee4';g.fillRect(ox,oy-7,cs*FPC,6);
    const adj=i=>{const r=Math.floor(i/FPC),c=i%FPC;return [c+1<FPC?i+1:-1,c>0?i-1:-1,r+1<FPR?i+FPC:-1,r>0?i-FPC:-1].some(j=>j>=0&&G[j]===2);};
    for(let i=0;i<G.length;i++){const r=Math.floor(i/FPC),c=i%FPC,v=G[i],fl=F[i],age=fl>0?FP.t-fl:fl<0?FP.t+fl:9;
      if(v===2){const y=oy+r*cs;g.fillStyle=C.ice;g.fillRect(ox+c*cs+cs*.12,y+cs*.12,cs*.76,cs*.76);
        if(age<.6&&fl>0){g.strokeStyle=C.accent;g.lineWidth=2.5;g.strokeRect(ox+c*cs+1,y+1,cs-2,cs-2);}}
      else{const x=ox+(c+.5)*cs+hjit(i+k*977,3)*cs*.16,y=oy+(r+.5)*cs+hjit(i+k*977,4)*cs*.16;
        if(FP.mark&&adj(i)){g.strokeStyle=v===0?C.blue:C.muted;g.lineWidth=Z?2:1.2;g.setLineDash(v===0?[]:[3,3]);
          g.beginPath();g.arc(ox+(c+.5)*cs,oy+(r+.5)*cs,cs*.46,0,TAU);g.stroke();g.setLineDash([]);}
        dot(g,x,y,(v===0?.3:.4)*cs*(Z?1.1:1),FPCOL(v));
        if(age<.6&&fl<0){g.strokeStyle=C.hot;g.lineWidth=2.5;g.beginPath();g.arc(x,y,cs*.5,0,TAU);g.stroke();}}}
    g.strokeStyle=C.line;g.lineWidth=1.5;g.strokeRect(ox+.5,oy+.5,cs*FPC,cs*FPR);
    const nIce=G.reduce((a,v)=>a+(v===2),0);
    text(g,k?'溶液':'純水',ox+cs*FPC/2,top-12,{align:'center',size:13,bold:true,col:k?C.sol:C.water});
    text(g,`冰 ${nIce} 個`,ox+6,oy+15,{size:11.5,mono:true,bold:true,bg:C.panel});
    text(g,`累計 凝固 ${b.cf}／熔化 ${b.cm}`,ox+cs*FPC-6,oy+15,{align:'right',size:11,mono:true,col:C.muted,bg:C.panel});
    if(k&&b.wf!=null)text(g,`冰面旁邊有 ${nf((1-b.wf)*100,0)}% 的位置被溶質佔住`,ox+cs*FPC/2,bot+14,{align:'center',size:11.5,bold:true,col:C.sol});});
  text(g,`溫度 ${nf(FP.T,1)} ℃`,W/2,top-12,{align:'center',size:12.5,mono:true,bold:true});
  if(FP.mark)text(g,'藍圈＝可以黏上冰面的水分子；灰虛圈＝被溶質佔住的位置',W/2,H-5,{align:'center',size:11,col:C.muted});
  // 速率比較
  const c2=$('cvFPR'),o=fit(c2,.52,190,260),h=c2.getContext('2d');h.clearRect(0,0,o.W,o.H);
  const mx=Math.max(8,...FP.box.map(b=>Math.max(b.fr,b.me)))*1.15,bx=96,bwid=o.W-bx-66;
  FP.box.forEach((b,k)=>{const y0=14+k*86;
    text(h,k?'溶液':'純水',4,y0+13,{size:12.5,bold:true,col:k?C.sol:C.water});
    [['凝固（水→冰）',b.fr,C.ice],['熔化（冰→水）',b.me,C.hot]].forEach(([nm,v,col],q)=>{const y=y0+q*32;
      text(h,nm,bx-8,y+15,{align:'right',size:11.5});h.fillStyle=col;h.fillRect(bx,y,Math.max(1,bwid*v/mx),22);
      text(h,nf(v,1)+' 次/秒',bx+bwid*v/mx+6,y+15,{size:11.5,mono:true});});
    const net=b.fr-b.me,thr=Math.max(.15,(b.fr+b.me)*.012);
    text(h,net>thr?'→ 冰變多':net<-thr?'→ 冰變少':'→ 兩邊一樣快（平衡）',o.W-4,y0+13,{align:'right',size:11.5,bold:true,col:net>thr?C.ice:net<-thr?C.hot:C.green});});
  const i=fpI(),np=FP.xs*i,nm2=['','非電解質','電解質 NaCl','電解質 CaCl₂'][FP.type==='vol'?1:+FP.type];
  const wfS=FP.box[1].wf,tfS=wfS!=null&&wfS>0?FPTS*Math.log(wfS):0;
  $('fpSay').innerHTML=FP.xs===0?'兩杯都是純水：溫度一降到 0 ℃ 以下，冰就從上面的冷板長下來；剛好 0 ℃ 時凝固和熔化一樣快（動態平衡）。把右杯加一點溶質再比比看。'
    :`右杯放了 <b>${FP.xs}</b> 個${FP.type==='vol'?'揮發性溶質分子（酒精）':nm2+'的化學式單位'}${i>1?`，解離成 <b>${np}</b> 個粒子（i＝${i}）`:''}。<br>
      溶質不會變成冰，它佔住的位置讓水分子<b>黏不上冰面</b>，所以右杯的「凝固」比較慢；<b>熔化只看溫度</b>，兩杯一樣。<br>
      目前 ${nf(FP.T,1)} ℃：純水的冰<b>${FP.T<0?'一路往下長':FP.T>0?'長不起來':'不增不減'}</b>；
      右杯${tfS<FP.T-0.05?`的冰<b>只停在貼著冷板的那一層，長不下去</b>——要降到大約 <b>${nf(tfS,1)} ℃</b> 以下才會繼續結冰，這就是<b>凝固點下降</b>。`:`已經低於它的凝固點（約 ${nf(tfS,1)} ℃），所以也開始往下結冰了。`}
      ${i>1?'相同莫耳數下，電解質解離出的粒子多，佔住的位置更多，凝固點下降得更多。':''}
      ${FP.type==='vol'?'<br>（揮發性不影響凝固點：凝固點只看<b>溶質粒子數</b>，和會不會蒸發無關。）':''}`;
  drawCC();};
TICK.fp=dt=>{const d=sdt(FP,dt);if(d)fpStep(d);let more=busy(FP);if(CC.run){ccTick(dt);more=true;}return more;};
const setFPT=sliderBind('fpT',v=>{FP.T=v;},v=>nf(v,1)+' ℃');
const setFPX=sliderBind('fpX',v=>{FP.xs=v;fpReset();},v=>v===0?'右杯也是純水':v+' 個（共 '+v*fpI()+' 個粒子）');
pbar('fp',FP,.3);
segOn($('fpType'),v=>{FP.type=v;setFPX(FP.xs);fpReset();hideStory();kick();});
segOn($('fpView'),v=>{hideStory();FP.view=v;fpReset();kick();});
$('fpMark').addEventListener('change',e=>{FP.mark=e.target.checked;kick();});
$('fpReset').addEventListener('click',()=>{fpReset();kick();});
UI.fp=()=>{segSet($('fpType'),FP.type);};
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
