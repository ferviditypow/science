
// =====================================================================
// 2 聲速
// =====================================================================
const SP={mode:'race',t:0,run:false,T:15,D:1000,pair:'fire',giv:'t',dt:2,dd:680,rv:8.5,cue:'sound',dir:'aw',f:340};
let WS=600,HS=300;
const PAIRS={
  fire:{n:'煙火：光與聲',src:'煙火',dst:'觀眾',P:[{n:'光',v:3e8,c:'#e0a800'},{n:'聲音（空氣）',v:'air',c:'snd'}],def:{giv:'t',dt:2,T:15}},
  ship:{n:'甲乙船：海水與空氣',src:'甲船',dst:'乙船',P:[{n:'海水',v:1700,c:'sea2'},{n:'空氣',v:340,c:'snd'}],def:{giv:'d',dd:680}},
  navy:{n:'軍艦：海水與空氣',src:'敵艦爆炸',dst:'我方軍艦',P:[{n:'海水',v:1500,c:'sea2'},{n:'空氣',v:300,c:'snd'}],def:{giv:'t',dt:3}},
  ground:{n:'爆炸：地面與空氣',src:'A 地爆炸',dst:'小王',P:[{n:'地面振動',v:3500,c:'cliff'},{n:'空氣',v:350,c:'snd'}],def:{giv:'t',dt:8}},
  navy2:{n:'軍艦：海水 1360、空氣 340',src:'敵艦爆炸',dst:'我方軍艦',P:[{n:'海水',v:1360,c:'sea2'},{n:'空氣',v:340,c:'snd'}],def:{giv:'t',dt:12}},
  plant:{n:'煉油廠：光、地震、聲',src:'煉油廠',dst:'我們',P:[{n:'光',v:3e8,c:'#e0a800'},{n:'地面',v:2000,c:'cliff'},{n:'空氣',v:340,c:'snd'}],def:{giv:'d',dd:3400}}};
const pv=p=>p.v==='air'?vAir(SP.T):p.v;
const pcol=c=>c==='snd'?C.snd:c==='sea2'?'#2f8fbf':c==='cliff'?C.cliff:c;
function spModel(){const m=SP.mode;
  if(m==='race'){const v=vAir(SP.T);const L=[{n:'空氣 0 °C',v:331},{n:`空氣 ${SP.T} °C（大聲、高音）`,v},{n:`空氣 ${SP.T} °C（小聲、低音）`,v},{n:'水',v:1463},{n:'木材',v:3352},{n:'鋼鐵（約）',v:5000}];
    const tmax=SP.D/Math.min(...L.map(l=>l.v))*1.05;return {L,tmax};}
  if(m==='delay'){const P=PAIRS[SP.pair];const vs=P.P.map(pv);const fast=Math.max(...vs),slow=Math.min(...vs);
    let D,dt;if(SP.giv==='t'){dt=SP.dt;D=dt/(1/slow-1/fast);}else{D=SP.dd;dt=D/slow-D/fast;}const ts=vs.map(v=>D/v);return {P,vs,D,dt,ts,tmax:D/slow*1.08};}
  if(m==='timer'){const v=vAir(SP.T);const ts=SP.cue==='sound'?100/v:0;const tf=100/SP.rv;return {v,ts,tf,rec:tf-ts,tmax:tf+.6};}
  const va=vAir(SP.T),vw=1500;const v1=SP.dir==='aw'?va:vw,v2=SP.dir==='aw'?vw:va;return {v1,v2,l1:v1/SP.f,l2:v2/SP.f,tmax:1e9};}
function spUI(){const m=SP.mode;segSet($('spMode'),m);document.querySelectorAll('.spc').forEach(e=>e.hidden=e.dataset.m!==m);
  $('spPlay').hidden=$('spRst').hidden=m==='cross';
  const P=PAIRS[SP.pair];$('spTw').hidden=m==='delay'&&!P.P.some(p=>p.v==='air');
  $('spT').value=SP.T;$('spTo').textContent=SP.T+' °C（'+nf(vAir(SP.T),1)+' m/s）';$('spD').value=SP.D;$('spDo').textContent=SP.D+' m';
  $('spRun').value=SP.rv;$('spRuno').textContent=SP.rv+' m/s';segSet($('spCue'),SP.cue);segSet($('spPair'),SP.pair);segSet($('spGiv'),SP.giv);
  $('spDtw').hidden=SP.giv!=='t';$('spDdw').hidden=SP.giv!=='d';$('spDt').value=SP.dt;$('spDto').textContent=f1(SP.dt)+' s';$('spDd').value=SP.dd;$('spDdo').textContent=SP.dd+' m';
  segSet($('spDir'),SP.dir);$('spF').value=SP.f;$('spFo').textContent=SP.f+' Hz';playTxt($('spPlay'),SP.run);
  $('spHint').textContent={race:'按播放，看同一個聲音在不同介質中跑完同樣的距離要多久。',delay:'光幾乎瞬間到達，聲音比較慢；先後到達的時間差可以算出距離。',timer:'計時員站在終點，聽到槍聲才按碼錶——槍聲要花一點時間才傳到終點。',cross:'聲音從一種介質進入另一種介質：頻率不變，速率和波長改變。'}[m];
  $('spHowT').textContent={race:'各種介質賽跑：怎麼看',delay:'先看到、後聽到：怎麼看',timer:'百米計時：怎麼看',cross:'傳進另一種介質：怎麼看'}[m];
  $('spHow').innerHTML=({race:['每一道是一種介質，同時出發；聲速：固體＞液體＞氣體。','空氣中溫度越高，聲速越快：v ＝ 331 ＋ 0.6T。','中間兩道是同溫的空氣，一個大聲高音、一個小聲低音：同時到達——聲速與響度、音調、說話快慢無關。'],
    delay:['同一個地點同時發出的光（或振動）和聲音，走不同的路、速率不同，先後到達。','光速 3×10⁸ m/s，幾乎是一瞬間：看到閃光到聽到聲音的時間 ≈ 聲音走的時間。','兩種聲速都要算時：距離 ÷ 慢的 − 距離 ÷ 快的 ＝ 時間差。'],
    timer:['發令槍一響，選手就起跑；聲音走 100 m 要約 0.29 秒才到終點。','計時員聽到槍聲才按碼錶，比選手起跑晚，所以記錄的成績太快，要加回 100 ÷ v 秒。','看槍煙（光）就按，誤差幾乎是 0。'],
    cross:['左右是兩種介質，波峰（密部）一個接一個通過界面。','每秒通過界面的波數一樣：頻率由發聲體決定，不會改變。','進入水中速率變快，同樣的頻率，波長變長：λ ＝ v ÷ f。']})[m].map(s=>`<li>${s}</li>`).join('');}
{const box=$('spPair');Object.entries(PAIRS).forEach(([k,p])=>{const b=document.createElement('button');b.dataset.v=k;b.textContent=p.n;box.appendChild(b);});}
function spRestart(run=true){SP.t=0;SP.run=run;spUI();kick();}
segOn($('spMode'),v=>{SP.mode=v;hideStory();spUI();SIZE.speed();spRestart(v!=='cross');});
$('spPlay').addEventListener('click',()=>{const M=spModel();if(!SP.run&&SP.t>=M.tmax-1e-9)SP.t=0;SP.run=!SP.run;spUI();kick();});
$('spRst').addEventListener('click',()=>spRestart());
$('spT').addEventListener('input',()=>{SP.T=+$('spT').value;spUI();kick();});
$('spD').addEventListener('input',()=>{SP.D=+$('spD').value;spRestart(false);});
$('spRun').addEventListener('input',()=>{SP.rv=+$('spRun').value;spRestart(false);});
segOn($('spCue'),v=>{SP.cue=v;spRestart();});
segOn($('spPair'),v=>{SP.pair=v;Object.assign(SP,PAIRS[v].def);spRestart();});
segOn($('spGiv'),v=>{if(SP.mode!=='delay')return;const M=spModel();SP.giv=v;if(v==='d')SP.dd=Math.round(M.D/10)*10;else SP.dt=+M.dt.toFixed(1);spRestart(false);});
$('spDt').addEventListener('input',()=>{SP.dt=+$('spDt').value;spRestart(false);});
$('spDd').addEventListener('input',()=>{SP.dd=+$('spDd').value;spRestart(false);});
segOn($('spDir'),v=>{SP.dir=v;spUI();kick();});
$('spF').addEventListener('input',()=>{SP.f=+$('spF').value;spUI();kick();});

function wavIcon(g,x,y,col){g.save();g.strokeStyle=col;g.lineWidth=2.5;for(let k=0;k<3;k++){g.beginPath();g.arc(x-14,y,6+k*5,-.7,.7);g.stroke();}g.restore();}
function drawSpRace(g,W,H,M){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const nar=W<560,L0=nar?12:150,R0=W-(nar?70:110),n=M.L.length,top=34,lh=(H-top-20)/n;const X=d=>L0+d/SP.D*(R0-L0);
  line(g,L0,top-6,L0,H-14,C.ink,2);line(g,R0,top-6,R0,H-14,C.ink,2,[6,4]);text(g,'出發',L0,top-12,{size:11,align:'center',col:C.muted});text(g,SP.D+' m',R0,top-12,{size:11,align:'center',col:C.muted});
  M.L.forEach((l,i)=>{const y=top+lh*(i+.5);g.fillStyle=i%2?C.grid:C.panel;g.fillRect(L0,y-lh/2,R0-L0,lh);if(nar)text(g,l.n,L0+4,y-lh/2+12,{size:10,bold:true});else text(g,l.n,L0-8,y+4,{size:12,bold:true,align:'right'});
    const ta=SP.D/l.v,d=Math.min(l.v*SP.t,SP.D);const col=i===3?'#2f8fbf':i===4?C.cliff:i===5?C.purple:C.snd;g.fillStyle=col;g.globalAlpha=.35;g.fillRect(L0,y-lh*.18,X(d)-L0,lh*.36);g.globalAlpha=1;wavIcon(g,X(d),y,col);
    text(g,SP.t>=ta?fmtT(ta):nf(l.v,0)+' m/s',R0+8,y+4,{size:12,bold:SP.t>=ta,col:SP.t>=ta?C.echo:C.muted});});
  text(g,'t ＝ '+fmtT(Math.min(SP.t,M.tmax)),W-10,16,{size:13,bold:true,align:'right',col:C.accent});}
function blast(g,x,y,s=1){g.save();g.fillStyle='#ffb020';g.beginPath();for(let i=0;i<16;i++){const r=(i%2?10:22)*s,a=i/16*TAU;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}g.closePath();g.fill();g.restore();}
function drawSpDelay(g,W,H,M){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const nar=W<560,P=M.P,L0=nar?56:120,R0=W-(nar?56:120),top=40,n=P.P.length,lh=Math.min(70,(H-top-50)/n);const X=d=>L0+d/M.D*(R0-L0);
  const ox=nar?28:56;text(g,P.src,L0-ox,top-12,{size:nar?11:13,bold:true,align:'center'});text(g,P.dst,R0+ox,top-12,{size:nar?11:13,bold:true,align:'center'});
  if(SP.t<M.tmax*.08||P.src.includes('爆炸')||P.src==='煙火'||P.src==='煉油廠'){if(SP.t<M.tmax*.12)blast(g,L0-ox,top+lh*n/2,1.2-SP.t/M.tmax*3);}
  if(P.src.includes('船')){ship(g,L0-ox,top+lh*n/2+10,1);}if(P.dst.includes('船')||P.dst.includes('艦'))ship(g,R0+ox,top+lh*n/2+10,-1);else person(g,R0+ox,top+lh*n/2+30,-1);
  P.P.forEach((p,i)=>{const y=top+lh*(i+.5),v=M.vs[i],col=pcol(p.c);g.fillStyle=i%2?C.grid:C.sky;g.fillRect(L0,y-lh/2,R0-L0,lh);text(g,p.n+'　'+(v>1e7?'3×10⁸ m/s':nf(v,0)+' m/s'),L0+6,y-lh/2+14,{size:11,bold:true,col});
    const d=Math.min(v*SP.t,M.D);g.fillStyle=col;g.globalAlpha=.35;g.fillRect(L0,y-4,X(d)-L0,8);g.globalAlpha=1;dot(g,X(d),y,col,6);
    const ta=M.ts[i];if(SP.t>=ta)text(g,'到達 '+fmtT(ta),R0-6,y+lh/2-6,{size:12,bold:true,align:'right',col:C.echo});});
  dimLine(g,L0,R0,top+lh*n+18,'距離 '+fmtM(M.D),C.ink,12);
  const yt=H-20,Xt=t=>L0+t/M.tmax*(R0-L0);line(g,L0,yt,R0,yt,C.line,1.5);text(g,'時間',L0-8,yt+4,{size:11,col:C.muted,align:'right'});
  M.ts.forEach((ta,i)=>{if(SP.t>=ta){line(g,Xt(ta),yt-8,Xt(ta),yt+8,pcol(P.P[i].c),3);}});
  const t1=Math.min(...M.ts),t2=Math.max(...M.ts);if(SP.t>=t2){line(g,Xt(t1),yt-14,Xt(t2),yt-14,C.echo,2);text(g,'相差 '+fmtT(M.dt),(Xt(t1)+Xt(t2))/2,yt-18,{size:12,bold:true,col:C.echo,align:'center',bg:C.panel});}
  line(g,Xt(Math.min(SP.t,M.tmax)),yt-10,Xt(Math.min(SP.t,M.tmax)),yt+10,C.accent,2);}
function runner(g,x,y,t,run){g.save();g.strokeStyle=C.green;g.fillStyle=C.green;g.lineWidth=3;g.lineCap='round';const p=run?Math.sin(t*14):0;
  g.beginPath();g.arc(x+3,y-40,6,0,TAU);g.fill();line(g,x+2,y-34,x-2,y-16,C.green,3);line(g,x-2,y-16,x-2+10*p,y,C.green,3);line(g,x-2,y-16,x-2-10*p,y,C.green,3);line(g,x+1,y-28,x+1+9*p,y-20,C.green,3);line(g,x+1,y-28,x+1-9*p,y-22,C.green,3);g.restore();}
function drawSpTimer(g,W,H,M){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const L0=70,R0=W-90,G=H*.62,X=d=>L0+d/100*(R0-L0),t=SP.t;
  g.fillStyle='#c46a4a';g.fillRect(L0-20,G,R0-L0+40,22);for(let d=0;d<=100;d+=10){line(g,X(d),G,X(d),G+22,'rgba(255,255,255,.5)',1);text(g,d+' m',X(d),G+36,{size:10,align:'center',col:C.muted});}
  line(g,X(100),G-70,X(100),G+22,C.ink,2);
  person(g,L0-36,G,1);if(t<.25){g.fillStyle='#bbb';g.beginPath();g.arc(L0-22,G-52,8+t*40,0,TAU);g.fill();text(g,'砰！',L0-20,G-70,{size:14,bold:true,col:C.accent});}
  person(g,R0+40,G,-1);const xr=Math.min(SP.rv*t,100);runner(g,X(xr),G,t,xr<100);
  const ds=Math.min(M.v*t,100);if(ds<100){dot(g,X(ds),G-30,C.snd,6);text(g,'槍聲',X(ds),G-42,{size:11,col:C.snd,bold:true,align:'center'});}
  // 碼錶
  const started=t>=M.ts,sw=started?Math.min(t,M.tf)-M.ts:0;const bx=W/2-80,byy=14;g.fillStyle=C.ink;g.fillRect(bx,byy,160,40);text(g,(sw).toFixed(2)+' s',bx+80,byy+28,{size:20,bold:true,col:started?'#7cf29a':'#888',align:'center'});
  text(g,started?(t>=M.tf?'計時員按停':'計時員的碼錶跑動中'):'計時員還沒聽到槍聲…',bx+80,byy+58,{size:12,align:'center',col:started?C.green:C.echo,bold:true});
  text(g,'選手真正的時間：'+Math.min(t,M.tf).toFixed(2)+' s',W-10,H-10,{size:12,bold:true,align:'right'});
  if(SP.cue==='sound'&&t>=M.ts){text(g,'選手已經跑了 '+fmtM(SP.rv*M.ts),X(SP.rv*M.ts),G-74,{size:11,col:C.green,bold:true,align:'center',bg:C.panel});}}
function drawSpCross(g,W,H,M){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const xm=W/2,top=H*.14,bot=H*.66;
  const s=Math.min((xm-20)/(M.l1*3.2),(W-xm-40)/(M.l2*1.15));// 左邊放約 3 個波長
  const c1=SP.dir==='aw'?C.sky:C.sea,c2=SP.dir==='aw'?C.sea:C.sky;g.fillStyle=c1;g.fillRect(0,top,xm,bot-top);g.fillStyle=c2;g.fillRect(xm,top,W-xm,bot-top);
  const vis=60/(M.v1*s);// 左側波前動畫速率 60 px/s
  const ph=x=>{const tt=SP.t*vis;return x<xm?SP.f*(tt-(x-0)/(M.v1*s)*1):SP.f*(tt-xm/(M.v1*s)-(x-xm)/(M.v2*s));};
  // 分子
  for(let r=0;;r++){const y=top+8+r*13;if(y>bot-6)break;for(let x=4;x<W;x+=11){const p=ph(x);const dx=-4*Math.sin(TAU*p);g.fillStyle=x<xm?(SP.dir==='aw'?C.snd:'#2f8fbf'):(SP.dir==='aw'?'#2f8fbf':C.snd);g.globalAlpha=.7;g.beginPath();g.arc(x+dx,y,2,0,TAU);g.fill();}}g.globalAlpha=1;
  line(g,xm,top-6,xm,bot+6,C.ink,2);text(g,SP.dir==='aw'?'空氣':'水',12,top-8,{size:14,bold:true});text(g,SP.dir==='aw'?'水':'空氣',xm+12,top-8,{size:14,bold:true});
  // 波長標示：找左右各一段密部
  const findCrest=(x0,x1)=>{let best=null;for(let x=x0;x<x1;x++){const p=ph(x);const fr=((p%1)+1)%1;if(fr<.02||fr>.98){best=x;break;}}return best;};
  const yl=bot+22;const ca=findCrest(30,xm-s*M.l1-10);if(ca!==null)dimLine(g,ca,ca+s*M.l1,yl,'λ ＝ '+nf(M.l1,2)+' m',C.ink,12);
  if(xm+6+s*M.l2<W-2)dimLine(g,xm+6,xm+6+s*M.l2,yl,'λ ＝ '+nf(M.l2,2)+' m',C.ink,12);else text(g,'λ ＝ '+nf(M.l2,2)+' m',xm+12,yl+4,{size:12,bold:true});
  // 波形曲線
  const gy=H*.9,ga=H*.05;g.strokeStyle=C.accent;g.lineWidth=2;g.beginPath();for(let x=0;x<=W;x+=2){const y=gy-ga*Math.cos(TAU*ph(x));x?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();text(g,'疏密',4,gy-ga-4,{size:10,col:C.muted});}
function spResults(M){let big='',f='',ck=[];const m=SP.mode;
  if(m==='race'){const fast=M.L[5],air=M.L[1];big=`跑 ${SP.D} m：空氣（${SP.T} °C）${fmtT(SP.D/air.v)}，水 ${fmtT(SP.D/1463)}，木材 ${fmtT(SP.D/3352)}`;
    f=`空氣中的聲速 v ＝ 331 ＋ 0.6T ＝ 331 ＋ 0.6×${SP.T} ＝ ${nf(air.v,1)} m/s<br>時間 ＝ 距離 ÷ 聲速`;
    ck=[['info','聲速：固體＞液體＞氣體（介質的種類）。'],['info','溫度越高，空氣中的聲速越快（介質的狀態）。'],['ok','大聲與小聲、高音與低音同時到達：聲速與響度、音調、說話快慢無關。']];}
  else if(m==='delay'){const P=M.P,i1=M.vs.indexOf(Math.max(...M.vs)),i2=M.vs.indexOf(Math.min(...M.vs));const v1=M.vs[i1],v2=M.vs[i2];
    big=`相距 ${fmtM(M.D)}：${P.P[i1].n}先到，${P.P[i2].n}晚 ${fmtT(M.dt)}`;
    f=v1>1e7?`光幾乎不花時間 → 距離 ＝ 聲速 × 時間差 ＝ ${nf(v2,1)} × ${nf(M.dt,2)} ＝ ${fmtM(M.D)}`:`D ÷ ${nf(v2,1)} − D ÷ ${nf(v1,1)} ＝ ${nf(M.dt,3)} s<br>D ＝ ${fmtM(M.D)}`;
    if(P.P.length===3)f+=`<br>先後順序：${P.P.map((p,i)=>[p.n,M.ts[i]]).sort((a,b)=>a[1]-b[1]).map(a=>a[0]).join(' → ')}`;
    ck=[['info','同時發出，速率快的先到。光速 3×10⁸ m/s，比聲速快約 100 萬倍。'],['info','打雷時先看到閃電、後聽到雷聲，也是同樣的道理：秒數 × 340 ≈ 距離。']];}
  else if(m==='timer'){big=SP.cue==='sound'?`記錄 ${M.rec.toFixed(2)} s，比實際 ${M.tf.toFixed(2)} s 少了 ${M.ts.toFixed(2)} s`:`看到槍煙就按：記錄 ${M.tf.toFixed(2)} s，幾乎沒有誤差`;
    f=`聲速 v ＝ 331 ＋ 0.6×${SP.T} ＝ ${nf(M.v,1)} m/s<br>槍聲走 100 m：100 ÷ ${nf(M.v,1)} ＝ ${(100/M.v).toFixed(2)} s`+(SP.cue==='sound'?`<br>成績要「加回」${(100/M.v).toFixed(2)} s`:'');
    ck=[['info','計時員晚按碼錶 → 記錄的時間太短 → 成績要加回聲音走 100 m 的時間。'],['info','光走 100 m 只要 3×10⁻⁷ s，可以忽略。']];}
  else{big=`頻率不變 ${SP.f} Hz；波長 ${nf(M.l1,2)} m → ${nf(M.l2,2)} m`;
    f=`λ ＝ v ÷ f<br>${SP.dir==='aw'?'空氣':'水'}：${nf(M.v1,1)} ÷ ${SP.f} ＝ ${nf(M.l1,3)} m<br>${SP.dir==='aw'?'水':'空氣'}：${nf(M.v2,1)} ÷ ${SP.f} ＝ ${nf(M.l2,3)} m`;
    ck=[['info','頻率、週期由發聲體決定，進入別的介質不變；兩支音叉 300 Hz 與 200 Hz 傳入水中，頻率比還是 3：2。'],['info',SP.dir==='aw'?'進入水中聲速變快 → 波長變長。':'進入空氣中聲速變慢 → 波長變短。'],['info','傳播過程中能量散失 → 振幅變小。']];}
  $('spBig').textContent=big;$('spF2').innerHTML=f;checks($('spC'),ck);}
SIZE.speed=()=>{({W:WS,H:HS}=fit($('cvSp'),SP.mode==='race'?.42:.4,260,420));};
UI.speed=()=>{spUI();};
TICK.speed=dt=>{if(SP.mode==='cross')return true;if(!SP.run)return false;const M=spModel();const rate=SP.mode==='timer'?.8:M.tmax/6;SP.t+=dt*rate;if(SP.t>=M.tmax){SP.t=M.tmax;SP.run=false;playTxt($('spPlay'),false);}return SP.run;};
let spLast='';DRAW.speed=()=>{const M=spModel(),g=$('cvSp').getContext('2d');const m=SP.mode;if(m==='race')drawSpRace(g,WS,HS,M);else if(m==='delay')drawSpDelay(g,WS,HS,M);else if(m==='timer')drawSpTimer(g,WS,HS,M);else drawSpCross(g,WS,HS,M);
  const key=JSON.stringify([m,SP.T,SP.D,SP.pair,SP.giv,SP.dt,SP.dd,SP.rv,SP.cue,SP.dir,SP.f]);if(key!==spLast){spLast=key;spResults(M);}};
