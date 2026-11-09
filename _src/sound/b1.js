
// =====================================================================
// 1 聲音的產生與傳播
// =====================================================================
const MK={mode:'fork',t:0,hitT:-99,holdT:null,f:440,water:false,slow:true,snd:false,bell:true,air:1,pump:0,dist:1.4,med:'air',cup:'taut',goT:0};
let WM=600,HM=320,mkSrc=null;
const rnd=(i)=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
function mkAmp(t){if(t<MK.hitT)return 0;let a=Math.exp(-(t-MK.hitT)/4)*Math.min(1,(t-MK.hitT)/.2);if(MK.holdT!==null&&MK.holdT>=MK.hitT&&t>MK.holdT)a*=Math.exp(-(t-MK.holdT)/.07);return a;}
function mkLoud(){return MK.bell?(.03+.97*MK.air)/MK.dist:0;}
function mkSyncSnd(){$('mkSnd').setAttribute('aria-pressed',String(MK.snd));$('mkSnd').textContent=MK.snd?'🔊 聲音：開':'🔈 聲音：關';
  if(MK.snd&&!mkSrc&&(MK.mode==='fork'||MK.mode==='jar')){mkSrc=MK.mode==='fork'?contSrc(MK.f,'fork'):contSrc(880,'clar');}
  if((!MK.snd||!(MK.mode==='fork'||MK.mode==='jar'))&&mkSrc){mkSrc.stop();mkSrc=null;}}
STOP.push(()=>{if(mkSrc){mkSrc.stop();mkSrc=null;}});
function mkUI(){segSet($('mkMode'),MK.mode);document.querySelectorAll('.mkc').forEach(e=>e.hidden=e.dataset.m!==MK.mode);
  segSet($('mkPump'),String(MK.pump));segSet($('mkMed'),MK.med);segSet($('mkCup'),MK.cup);$('mkCup').hidden=MK.med!=='cup';
  $('mkF').value=MK.f;$('mkFo').textContent=MK.f+' Hz';$('mkAir').value=Math.round(MK.air*100);$('mkAiro').textContent=Math.round(MK.air*100)+'%';
  $('mkDist').value=MK.dist;$('mkDisto').textContent=MK.dist<1.6?'近':MK.dist<2.8?'中':'遠';$('mkBell').textContent=MK.bell?'🔔 電鈴：通電中':'🔕 電鈴：斷電';
  $('mkWater').checked=MK.water;$('mkSlow').checked=MK.slow;
  $('mkHint').textContent={fork:'按「敲擊音叉」，看音叉振動推動空氣分子，疏密一層一層傳到耳朵；紅色分子只在原地前後振動。',jar:'按「抽氣」把鐘罩內的空氣抽走，聽聽鈴聲怎麼變；拖「人離鐘罩」看走遠時聲音變小。',med:'選一種介質，按「發出聲音」，看聲音經過介質傳到另一邊；真空中沒有分子，聲音傳不過去。'}[MK.mode];
  const H={fork:['音叉快速振動（左右來回），推擠旁邊的空氣分子，形成「密部」和「疏部」。','疏密一層層往右傳，傳到耳朵使耳膜振動，我們才聽到聲音。','紅色的分子只在原地前後振動，振動方向和傳播方向平行：聲波是縱波。','下方曲線是各處空氣的疏密（壓力）：高的地方是密部、低的地方是疏部。','「用手握住」：音叉停止振動，聲音立刻消失；「碰水面」：振動的音叉會濺起水花。'],
    jar:['電鈴在鐘罩裡響，聲音經過罩內空氣、玻璃傳到外面。','抽氣時罩內空氣（小點）越來越少，鈴聲越來越小；鈴錘仍在振動，卻幾乎聽不到。','充氣後聲音又恢復：聲音的傳播需要介質。','人走遠，聲音的能量分散到更大範圍，聽起來變小。'],
    med:['聲音可以在固體、液體、氣體中傳播；一般而言速率：固體＞液體＞氣體。','真空中沒有分子可以振動，聲音無法傳播；光是電磁波，可以在真空中傳播。','傳話筒：拉緊的棉線把振動傳過去；放鬆或剪斷就聽不到。']}[MK.mode];
  $('mkHowT').textContent={fork:'音叉與空氣分子：怎麼看',jar:'波以耳真空鈴：怎麼看',med:'傳聲的介質：怎麼看'}[MK.mode];$('mkHow').innerHTML=H.map(s=>`<li>${s}</li>`).join('');mkSyncSnd();}
segOn($('mkMode'),v=>{MK.mode=v;hideStory();if(v==='med')MK.goT=MK.t;mkUI();SIZE.make();kick();});
$('mkSnd').addEventListener('click',()=>{MK.snd=!MK.snd;mkSyncSnd();kick();});
$('mkHit').addEventListener('click',()=>{MK.hitT=MK.t;MK.holdT=null;kick();});
$('mkHold').addEventListener('click',()=>{MK.holdT=MK.t;kick();});
$('mkWater').addEventListener('change',()=>{MK.water=$('mkWater').checked;kick();});
$('mkSlow').addEventListener('change',()=>{MK.slow=$('mkSlow').checked;kick();});
$('mkF').addEventListener('input',()=>{MK.f=+$('mkF').value;$('mkFo').textContent=MK.f+' Hz';if(mkSrc&&MK.mode==='fork')mkSrc.freq(MK.f);kick();});
$('mkBell').addEventListener('click',()=>{MK.bell=!MK.bell;mkUI();kick();});
segOn($('mkPump'),v=>{MK.pump=+v;mkUI();kick();});
$('mkAir').addEventListener('input',()=>{MK.air=+$('mkAir').value/100;MK.pump=0;mkUI();kick();});
$('mkDist').addEventListener('input',()=>{MK.dist=+$('mkDist').value;mkUI();kick();});
segOn($('mkMed'),v=>{MK.med=v;MK.goT=MK.t;mkUI();kick();});
segOn($('mkCup'),v=>{MK.cup=v;MK.goT=MK.t;mkUI();kick();});
$('mkGo').addEventListener('click',()=>{MK.goT=MK.t;kick();});

function fork(g,x,y0,y1,dx,col=C.ink){// 柄在上、叉在下：柄 y0→中段，叉到 y1
  const ym=y0+(y1-y0)*.3;g.save();g.lineCap='round';line(g,x,y0,x,ym,col,6);
  g.strokeStyle=col;g.lineWidth=6;g.beginPath();g.moveTo(x-9-dx,y1);g.lineTo(x-9-dx*.3,ym+14);g.quadraticCurveTo(x-9,ym,x,ym);g.quadraticCurveTo(x+9,ym,x+9+dx*.3,ym+14);g.lineTo(x+9+dx,y1);g.stroke();g.restore();}
function drawMkFork(g,W,H){const t=MK.t,fv=MK.f/440*(MK.slow?1:2.4),cv=MK.slow?150:330,lam=cv/fv,k=TAU/lam;
  const x0=86,xL=118,xR=W-92,yT=H*.12,yB=H*.62,sp=Math.max(10,Math.min(14,(xR-xL)/60));
  const amp0=mkAmp(t);const dx=6*amp0*Math.sin(TAU*fv*t);
  g.fillStyle=C.panel;g.fillRect(0,0,W,H);
  // 空氣分子
  const sAt=x=>{const d=x-x0;const tr=t-d/cv;return .62*sp*mkAmp(tr)*Math.sin(TAU*fv*tr);};
  for(let x=xL;x<xR;x+=4){const d=x-x0,tr=t-d/cv,p=mkAmp(tr)*Math.cos(TAU*fv*tr);if(p>.05){g.fillStyle=C.accent;g.globalAlpha=.16*p;g.fillRect(x,yT-6,4,yB-yT+12);}}g.globalAlpha=1;
  const rows=Math.floor((yB-yT)/sp);let hl=null;
  for(let r=0;r<=rows;r++)for(let c=0;;c++){const xr=xL+c*sp+(rnd(r*91+c)-.5)*sp*.25;if(xr>xR)break;const y=yT+r*sp+(rnd(r*37+c*11)-.5)*sp*.3;const x=xr+sAt(xr);
    const isH=r===Math.floor(rows/2)&&c===Math.round((xR-xL)/sp*.42);if(isH){hl={x,y,xr};continue;}g.fillStyle=C.muted;g.globalAlpha=.75;g.beginPath();g.arc(x,y,2.1,0,TAU);g.fill();}
  g.globalAlpha=1;
  if(hl){line(g,hl.xr,hl.y-12,hl.xr,hl.y+12,C.red,1,[2,2]);dot(g,hl.x,hl.y,C.red,5);text(g,'分子只在原地前後振動 ↔',hl.xr,yT-6,{size:12,col:C.red,bold:true,align:'center',bg:C.panel});}
  arrow(g,xL+10,H*.07,xL+150,H*.07,C.snd,2);text(g,'聲音傳播方向',xL+158,H*.07+4,{size:12,col:C.snd,bold:true});
  // 音叉
  const yf0=H*.08,yf1=yB-4;fork(g,x0,yf0,yf1,dx);
  if(MK.holdT!==null&&MK.holdT>=MK.hitT&&t>MK.holdT){g.fillStyle='#e8b98f';g.beginPath();g.ellipse(x0,(yf0+yf1)*.62,22,30,0,0,TAU);g.fill();text(g,'✋ 握住',x0,(yf0+yf1)*.62+46,{size:12,bold:true,align:'center'});}
  if(t-MK.hitT<.25&&t>=MK.hitT)text(g,'噹！',x0+26,yf0+30,{size:16,bold:true,col:C.accent});
  if(MK.water){const by=yB+2;g.fillStyle=C.sea;g.fillRect(x0-34,by,68,22);line(g,x0-34,by,x0+34,by,C.snd,2);g.strokeStyle=C.ink;g.lineWidth=2;g.strokeRect(x0-36,by-6,72,30);
    if(amp0>.06){for(let i=0;i<10;i++){const ph=(t*3+rnd(i))%1,ang=-Math.PI/2+(rnd(i+5)-.5)*2.2,r=ph*40*amp0;g.fillStyle=C.snd;g.globalAlpha=1-ph;g.beginPath();g.arc(x0+Math.cos(ang)*r,by-2+Math.sin(ang)*r*1.2+ph*ph*30,2.5,0,TAU);g.fill();}g.globalAlpha=1;
      text(g,'水花四濺',x0+40,by-8,{size:11,col:C.snd,bold:true});}}
  // 耳朵
  const xe=W-48,ye=(yT+yB)/2,se=sAt(xe-30);g.strokeStyle=C.ink;g.lineWidth=2.5;g.beginPath();g.ellipse(xe-24+se,ye,5,26,0,0,TAU);g.stroke();ear(g,xe+6,ye,C.ink);text(g,'耳膜',xe-24,ye+44,{size:11,align:'center'});
  // 疏密曲線
  const gT=H*.7,gB=H*.95,gm=(gT+gB)/2,ga=(gB-gT)*.42;line(g,xL,gm,xR,gm,C.line,1);text(g,'空氣的疏密（壓力）',xL,gT-4,{size:11,col:C.muted});
  g.strokeStyle=C.accent;g.lineWidth=2;g.beginPath();let best={v:0,x:0},worst={v:0,x:0};
  for(let x=xL;x<=xR;x+=2){const d=x-x0,tr=t-d/cv,a=mkAmp(tr),p=a*Math.cos(TAU*fv*tr);const y=gm-ga*p;x===xL?g.moveTo(x,y):g.lineTo(x,y);
    if(x>xL+40&&x<xR-40){if(p>best.v)best={v:p,x};if(p<worst.v)worst={v:p,x};}}g.stroke();
  if(best.v>.15){text(g,'密部',best.x,gm-ga*best.v-4,{size:11,bold:true,col:C.accent,align:'center'});}
  if(worst.v<-.15){text(g,'疏部',worst.x,gm-ga*worst.v+14,{size:11,bold:true,col:C.accent,align:'center'});}
  if(mkSrc)mkSrc.set(.18*amp0);}
function drawMkJar(g,W,H){const t=MK.t;g.fillStyle=C.panel;g.fillRect(0,0,W,H);const by=H*.8,cx=W*.36,jw=Math.min(W*.26,240),jt=H*.16;
  g.fillStyle=C.grid;g.fillRect(0,by,W,H-by);line(g,0,by,W,by,C.muted,1.5);
  // 抽氣機
  const px=Math.max(20,cx-jw/2-W*.16);g.fillStyle=C.ink;g.fillRect(px,by-44,54,44);text(g,'抽氣機',px+27,by-50,{size:11,bold:true,align:'center'});
  g.fillStyle=C.panel;g.beginPath();g.arc(px+27,by-22,12,0,TAU);g.fill();if(MK.pump!==0){const a=t*6*MK.pump;line(g,px+27,by-22,px+27+Math.cos(a)*10,by-22+Math.sin(a)*10,C.ink,2);}
  g.strokeStyle=C.muted;g.lineWidth=5;g.beginPath();g.moveTo(px+54,by-10);g.lineTo(cx-jw/2+6,by-10);g.stroke();
  if(MK.pump!==0)text(g,MK.pump<0?'← 空氣被抽出':'空氣充回 →',(px+54+cx-jw/2)/2,by-16,{size:11,col:C.accent,bold:true,align:'center'});
  // 鐘罩
  const L=cx-jw/2,R=cx+jw/2,ar=jw/2,yt=jt+ar;g.save();g.beginPath();g.moveTo(L,by-6);g.lineTo(L,yt);g.arc(cx,yt,ar,Math.PI,0);g.lineTo(R,by-6);g.closePath();
  g.fillStyle=C.sky;g.globalAlpha=.35+.65*MK.air;g.fill();g.globalAlpha=1;g.clip();
  const n=Math.round(MK.air*110);for(let i=0;i<n;i++){const x=L+8+((rnd(i)*(R-L-16)+Math.sin(t*1.7+i)*14)%(R-L-16)+(R-L-16))%(R-L-16),y=jt+8+((rnd(i+300)*(by-jt-20)+Math.cos(t*1.3+i*2)*12)%(by-jt-20)+(by-jt-20))%(by-jt-20);g.fillStyle=C.snd;g.beginPath();g.arc(x,y,2.2,0,TAU);g.fill();}
  g.restore();g.strokeStyle=C.ink;g.lineWidth=2.5;g.beginPath();g.moveTo(L,by-6);g.lineTo(L,yt);g.arc(cx,yt,ar,Math.PI,0);g.lineTo(R,by-6);g.stroke();
  g.fillStyle=C.muted;g.fillRect(L-14,by-6,jw+28,8);
  // 電鈴
  const bx=cx,byy=by-H*.24;line(g,bx,by-6,bx,byy+10,C.ink,3);g.fillStyle='#d4a017';g.beginPath();g.arc(bx,byy,20,Math.PI,0);g.lineTo(bx+20,byy+8);g.lineTo(bx-20,byy+8);g.closePath();g.fill();
  const hk=MK.bell?Math.sin(t*TAU*9)*8:0;line(g,bx+40,byy+30,bx+22+hk,byy+2,C.ink,2.5);dot(g,bx+22+hk,byy+2,C.ink,4);
  text(g,'電鈴',bx,byy+30,{size:11,align:'center'});
  // 聲波往外
  const Ld=mkLoud(),src=(.03+.97*MK.air);if(MK.bell){for(let k=0;k<5;k++){const ph=((t*.8+k/5)%1);const r=jw/2+ph*W*.5;g.save();g.globalAlpha=src*(1-ph)*.9;g.strokeStyle=C.snd;g.lineWidth=3;g.beginPath();g.arc(cx,byy,r,-1,1);g.stroke();g.restore();}}
  // 聽者
  const lx=Math.min(W-30,R+20+(MK.dist-.8)*W*.13);person(g,lx,by,-1,C.ink);ear(g,lx-2,by-44,Ld>.15?C.echo:C.muted);
  // 響度表
  const mx=W-40,mh=H*.42,my=H*.1;g.strokeStyle=C.ink;g.lineWidth=1.5;g.strokeRect(mx,my,20,mh);g.fillStyle=C.echo;const lv=clamp(Ld*(MK.bell?.85+.15*Math.sin(t*TAU*9):1),0,1);g.fillRect(mx+2,my+mh-mh*lv,16,mh*lv);
  text(g,'聽到的',mx+10,my-18,{size:11,align:'center'});text(g,'響度',mx+10,my-5,{size:11,align:'center'});
  text(g,'罩內空氣 '+Math.round(MK.air*100)+'%',cx,jt-8,{size:13,bold:true,align:'center'});
  if(mkSrc)mkSrc.set(.12*lv);}
function drawMkMed(g,W,H){const t=MK.t,m=MK.med,el=t-MK.goT;g.fillStyle=C.panel;g.fillRect(0,0,W,H);const xa=96,xb=W-90,ym=H*.5;
  const VREL={air:340,water:1463,solid:3352},pxs=(xb-xa)/2.2;// 空氣跑完全程約 2.2 秒
  const bg={air:C.sky,water:C.sea,solid:'#b98a64',vac:'#0b1020',cup:C.sky}[m];g.fillStyle=bg;g.fillRect(xa,H*.14,xb-xa,H*.72);
  if(m==='vac'){for(let i=0;i<70;i++){g.fillStyle='#fff';g.globalAlpha=.3+.7*rnd(i+9);g.beginPath();g.arc(xa+rnd(i)*(xb-xa),H*.14+rnd(i+50)*H*.72,1.2,0,TAU);g.fill();}g.globalAlpha=1;}
  if(m==='solid'){g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1;for(let y=H*.14;y<H*.86;y+=16){line(g,xa,y,xb,y,'rgba(0,0,0,.18)',1);for(let x=xa+((y/16|0)%2)*20;x<xb;x+=40)line(g,x,y,x,y+16,'rgba(0,0,0,.18)',1);}}
  if(m==='cup'){const y=ym,cutX=(xa+xb)/2;const sag=MK.cup==='slack'?H*.22:0;g.strokeStyle=C.ink;g.lineWidth=2;g.beginPath();
    for(let x=xa;x<=xb;x+=4){const u=(x-xa)/(xb-xa);const yy=y+sag*4*u*(1-u);if(MK.cup==='cut'&&Math.abs(x-cutX)<12){g.stroke();g.beginPath();continue;}x===xa?g.moveTo(x,yy):g.lineTo(x,yy);}g.stroke();
    if(MK.cup==='cut')text(g,'✂',cutX,y-10,{size:18,align:'center'});
    g.fillStyle=C.accent;[xa,xb].forEach((x,i)=>{g.beginPath();g.moveTo(x+(i?0:-0),y-16);g.lineTo(x+(i?16:-16),y-24);g.lineTo(x+(i?16:-16),y+24);g.lineTo(x,y+16);g.closePath();g.fill();});
    if(el>0){const v=MK.cup==='taut'?pxs*3.5:pxs*2;const xp=xa+v*el;const decay=MK.cup==='slack'?Math.exp(-(xp-xa)/(xb-xa)*5):1;const stop=MK.cup==='cut'?cutX-12:xb;
      if(xp<stop){const u=(xp-xa)/(xb-xa);const yy=y+sag*4*u*(1-u);g.globalAlpha=decay;for(let k=-2;k<=2;k++)dot(g,xp-k*6,yy+Math.sin(k*1.4+el*40)*4*decay,C.snd,3);g.globalAlpha=1;}
      const heard=MK.cup==='taut'&&xp>=xb;if(heard)text(g,'聽到了！',xb,y-40,{size:14,bold:true,col:C.echo,align:'center',bg:C.panel});
      if(MK.cup!=='taut'&&xp>=stop)text(g,MK.cup==='cut'?'線斷了，振動傳不過去':'線太鬆，振動傳不過去',(xa+xb)/2,y+60,{size:13,bold:true,col:'#c0453b',align:'center',bg:C.panel});}
    person(g,xa-44,H*.86,1,C.ink,el>=0&&el<.4?1:0);person(g,xb+44,H*.86,-1,C.ink);return;}
  // 分子
  if(m!=='vac'){const sp=m==='air'?18:m==='water'?11:9;const v=pxs*VREL[m]/340;const xp=xa+v*el;const w=24;
    for(let r=0;;r++){const y=H*.18+r*sp;if(y>H*.82)break;for(let c=0;;c++){const xr=xa+8+c*sp+(rnd(r*7+c)-.5)*sp*.3;if(xr>xb-6)break;const d=xr-xp;const s=el>0&&xp<xb+40?10*Math.exp(-(d*d)/(2*w*w))*Math.sign(-d)*Math.min(1,Math.abs(d)/w):0;
      g.fillStyle=m==='solid'?'#5b3a22':C.snd;g.globalAlpha=.75;g.beginPath();g.arc(xr+s,y,m==='air'?2.2:2.6,0,TAU);g.fill();}}g.globalAlpha=1;
    if(el>0&&xp<xb){line(g,xp,H*.14,xp,H*.86,C.accent,2,[5,4]);}
    if(el>0){text(g,xp>=xb?'傳到了！':'傳播中…',W/2,H*.1,{size:13,bold:true,col:C.accent,align:'center'});}}
  else{if(el>0&&el<1.2){g.save();g.globalAlpha=1-el/1.2;g.fillStyle='#ffd34d';g.beginPath();g.arc(xa+20,ym,30+el*40,0,TAU);g.fill();g.restore();}
    if(el>0){text(g,'看得到閃光（光可以在真空中傳播），但聽不到爆炸聲',W/2,H*.1,{size:13,bold:true,col:C.accent,align:'center'});}}
  // 兩端
  if(m==='vac'){g.fillStyle='#9aa3ab';g.fillRect(xa-50,ym-14,44,28);g.fillRect(xb+8,ym-14,44,28);text(g,'太空船',xb+30,ym+30,{size:11,align:'center'});text(g,'相撞',xa-28,ym+30,{size:11,align:'center'});}
  else{speaker(g,xa-24,ym);ear(g,xb+30,ym,C.ink);}
  text(g,{air:'空氣',water:'水',solid:'固體（牆壁）',vac:'真空'}[m],xa+8,H*.14+16,{size:13,bold:true,col:m==='vac'?'#fff':C.ink});}
function mkResults(){let big='',ck=[];
  if(MK.mode==='fork'){const a=mkAmp(MK.t);big=a<.02?(MK.hitT<0?'按「敲擊音叉」開始':'音叉停止振動 → 聲音消失'):'音叉振動中：空氣疏密相間往外傳 → 聽到聲音';
    ck=[['info','聲音由物體快速振動產生；振動停止，聲音就停止。'],['info','聲波傳播方向與空氣分子振動方向平行：縱波。'],['info','空氣分子沒有跟著聲音跑過去，只在原地振動，傳出去的是能量。'],['info','音叉每秒振動幾次，空氣每秒就產生幾次疏密：頻率越高，疏密排得越密。']];}
  else if(MK.mode==='jar'){const L=mkLoud();big=!MK.bell?'電鈴斷電：沒有振動，沒有聲音':MK.air<.05?'鈴錘還在振動，但幾乎聽不到（空氣幾乎被抽光）':MK.air<.6?'空氣變少，鈴聲變小':'鈴聲清楚';
    ck=[[MK.dist>2?'ok':'info','甲：人走遠，聲音變小——聲音的能量隨距離分散。'],[MK.air<.95?'ok':'info','乙：抽氣，鈴聲漸小——聲音的傳播要靠介質（空氣）。'],[MK.air<.05&&MK.bell?'ok':'info','丙：空氣抽光，鈴錘仍在振動卻幾乎聽不到——物體有振動，不一定能讓人聽到聲音。'],['info','還聽得到一點點：鐘罩的玻璃、底座等固體也能傳聲。']];}
  else{const m=MK.med;big={air:'空氣可以傳聲（約 340 m/s）',water:'水可以傳聲：比空氣快（約 1500 m/s）',solid:'固體可以傳聲：最快（木材約 3350 m/s）',vac:'真空不能傳聲',cup:MK.cup==='taut'?'拉緊的棉線把振動傳過去':'棉線'+(MK.cup==='cut'?'斷了':'太鬆')+'，聽不到'}[m];
    ck=[['info','聲音的傳播需要介質：固體、液體、氣體都可以。'],['info','一般速率：固體＞液體＞氣體（課本：空氣 340、水 1463、木材 3352 m/s）。'],['info','太空中沒有空氣：太空人用無線電（電磁波）通話；頭盔內有空氣，所以自己說話聽得到。']];}
  $('mkBig').textContent=big;checks($('mkC'),ck);}
SIZE.make=()=>{({W:WM,H:HM}=fit($('cvMk'),MK.mode==='fork'?.46:.42,280,440));};
UI.make=()=>{mkUI();};
TICK.make=dt=>{MK.t+=dt;if(MK.mode==='jar'&&MK.pump!==0){MK.air=clamp(MK.air+MK.pump*dt/5,0,1);if(MK.air===0||MK.air===1)MK.pump=0;$('mkAir').value=Math.round(MK.air*100);$('mkAiro').textContent=Math.round(MK.air*100)+'%';segSet($('mkPump'),String(MK.pump));}return true;};
let mkLast='';DRAW.make=()=>{const g=$('cvMk').getContext('2d');if(MK.mode==='fork')drawMkFork(g,WM,HM);else if(MK.mode==='jar')drawMkJar(g,WM,HM);else drawMkMed(g,WM,HM);
  const key=MK.mode+Math.round(mkAmp(MK.t)*20)+MK.bell+Math.round(MK.air*20)+(MK.dist>2)+MK.med+MK.cup+MK.hitT;if(key!==mkLast){mkLast=key;mkResults();}};
