
// ================= 共用小工具 =================
readColors();const CC={};function readMore(){const s=getComputedStyle(document.documentElement);['pos','neg','metal','metal2'].forEach(k=>CC[k]=s.getPropertyValue('--'+k).trim());}readMore();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',readMore);
const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
function sym(g,x,y,s,sz=6){const c=s>0?CC.pos:CC.neg;g.strokeStyle=c;g.lineWidth=2.2;g.beginPath();g.moveTo(x-sz,y);g.lineTo(x+sz,y);if(s>0){g.moveTo(x,y-sz);g.lineTo(x,y+sz);}g.stroke();}
const qStr=q=>q>0?'＋'+q:q<0?'−'+(-q):'0';

// =====================================================================
// 1 摩擦起電
// =====================================================================
const PAIRS={fur:{c:'毛皮',r:'塑膠尺',s:-1,col:'#3b5f8a',cc:'#9a7b5a'},silk:{c:'絲絹',r:'玻璃棒',s:1,col:'#bcd8e6',cc:'#e9dfc8'},wool:{c:'毛布',r:'氣球',s:-1,col:'#d2504b',cc:'#7d8c6a'},cu:{c:'毛皮',r:'銅棒',s:-1,col:'#c58a52',cc:'#9a7b5a'}};
const RB={pair:'fur',grip:false,wet:false,auto:0,x:.55,y:.22,T:0,leak:0,t:0,bits:[]};let WR=600,HR=320;
for(let i=0;i<14;i++)RB.bits.push({x:.66+rnd(i)*.28,y:.9-rnd(i+20)*.05,dy:0,stuck:false});
function rbRod(W,H){const L=Math.min(W*.3,260),x=RB.x*W,y=RB.y*H;return {x0:x-L/2,x1:x+L/2,y,L};}
function rbCloth(W,H){return {x:W*.08,y:H*.12,w:W*.36,h:H*.32};}
function rbQ(){const P=PAIRS[RB.pair];const leaks=RB.pair==='cu'&&!RB.grip;return {rod:leaks?0:P.s*Math.round(RB.T),cloth:-P.s*Math.round(RB.T),leaks};}
function drawRub(g,W,H){const P=PAIRS[RB.pair],Q=rbQ(),Cl=rbCloth(W,H),R=rbRod(W,H);g.fillStyle=C.panel;g.fillRect(0,0,W,H);
  // 布
  g.fillStyle=P.cc;g.globalAlpha=.85;g.fillRect(Cl.x,Cl.y,Cl.w,Cl.h);g.globalAlpha=1;text(g,P.c+'（'+qStr(Q.cloth)+'）',Cl.x+4,Cl.y-6,{size:13,bold:true});
  const drawCharges=(x0,y0,w,h,q,seed)=>{const n=20,np=n,ne=n-q;for(let i=0;i<np;i++)sym(g,x0+w*((i+.5)/np),y0+h*.3,1,4.5);for(let i=0;i<Math.max(0,ne);i++)sym(g,x0+w*((i+.5)/Math.max(ne,np)),y0+h*.72,-1,4.5);};
  drawCharges(Cl.x+6,Cl.y+6,Cl.w-12,Cl.h-12,Q.cloth,1);
  // 小紙片
  const tbl=H*.93;line(g,W*.62,tbl,W-8,tbl,C.muted,2);text(g,'小紙片',W-10,tbl+16,{size:11,col:C.muted,align:'right'});
  RB.bits.forEach(b=>{g.fillStyle='#f3efe4';g.strokeStyle='#999';g.lineWidth=1;g.save();g.translate(b.x*W,b.y*H-b.dy);g.rotate(rnd(b.x*99)*.6-.3);g.fillRect(-5,-3,10,6);g.strokeRect(-5,-3,10,6);g.restore();});
  // 棒子
  if(RB.pair==='wool'){g.fillStyle=P.col;g.beginPath();g.ellipse(R.x0+R.L/2,R.y,R.L/2,24,0,0,TAU);g.fill();line(g,R.x1,R.y,R.x1+30,R.y+16,'#777',1.5);}
  else{g.fillStyle=P.col;g.fillRect(R.x0,R.y-10,R.L,20);g.strokeStyle='rgba(0,0,0,.3)';g.strokeRect(R.x0,R.y-10,R.L,20);}
  if(RB.pair==='cu'){if(RB.grip){g.fillStyle='#333';g.fillRect(R.x1-50,R.y-12,50,24);text(g,'絕緣把手',R.x1-25,R.y+28,{size:11,align:'center'});}
    else{g.fillStyle='#e8b98f';g.beginPath();g.ellipse(R.x1-20,R.y,26,16,0,0,TAU);g.fill();text(g,'手直接握住',R.x1-20,R.y+30,{size:11,align:'center'});}}
  const rq=Q.rod;for(let i=0;i<Math.min(16,Math.abs(rq));i++){const sx=R.x0+14+i*((R.L-70)/16);g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(sx,R.y,6.5,0,TAU);g.fill();sym(g,sx,R.y,Math.sign(rq),4.5);}
  text(g,P.r+'（'+qStr(rq)+'）',R.x0,R.y-(RB.pair==='wool'?30:16),{size:13,bold:true});
  if(Q.leaks&&RB.leak>0){text(g,'電子經過手和人體流走了 → 銅棒不帶電',R.x1+8,R.y-16,{size:12,bold:true,col:C.accent});}
  handle(g,R.x0+R.L/2,R.y,9);}
function rbUI(){segSet($('rbPair'),RB.pair);$('rbGripW').hidden=RB.pair!=='cu';$('rbGrip').checked=RB.grip;$('rbWet').checked=RB.wet;
  howList('rbHow',['兩個物體互相摩擦，其中一個的部分電子轉移到另一個：得到電子的帶負電，失去電子的帶正電。','兩者帶的電量相等、電性相反；質子（原子核）不會移動，移動的只有電子。','毛皮摩擦塑膠尺：塑膠尺得到電子帶負電；絲絹摩擦玻璃棒：玻璃棒失去電子帶正電。','摩擦起電適合絕緣體。金屬（導體）摩擦後電子會經過手流走；裝上絕緣把手才留得住。','潮濕時電荷容易經由水氣流失，摩擦起電比較不容易成功；冬天乾燥較容易。','帶電的棒子靠近小紙片，紙片會被吸起來（靜電感應）。']);}
segOn($('rbPair'),v=>{RB.pair=v;RB.T=0;RB.leak=0;hideStory();rbUI();kick();});
$('rbGrip').addEventListener('change',()=>{RB.grip=$('rbGrip').checked;RB.T=0;kick();});
$('rbWet').addEventListener('change',()=>{RB.wet=$('rbWet').checked;kick();});
$('rbAuto').addEventListener('click',()=>{RB.auto=3;RB.y=.27;kick();});
$('rbReset').addEventListener('click',()=>{RB.T=0;RB.leak=0;RB.x=.55;RB.y=.22;RB.bits.forEach(b=>{b.dy=0;});kick();});
let rbPrevX=null;
dragger($('cvRb'),()=>{const R=rbRod(WR,HR);return [{x:R.x0+R.L/2,y:R.y,r:40,hit:(x,y)=>x>R.x0-6&&x<R.x1+6&&Math.abs(y-R.y)<26?Math.abs(x-(R.x0+R.L/2))*.01:99,start:()=>{rbPrevX=null;},move:(x,y)=>{rubMove(x/WR,y/HR);}}];},()=>kick());
$('cvRb').style.touchAction='none';
function rubMove(nx,ny){const W=WR,H=HR,Cl=rbCloth(W,H);const ox=RB.x;RB.x=clamp(nx,.12,.9);RB.y=clamp(ny,.08,.86);const R=rbRod(W,H);
  const over=R.y>Cl.y-6&&R.y<Cl.y+Cl.h+6&&R.x0<Cl.x+Cl.w&&R.x1>Cl.x;if(over){RB.T=Math.min(14,RB.T+Math.abs(RB.x-ox)*14);if(RB.pair==='cu'&&!RB.grip)RB.leak=2;}}
function rbResults(){const P=PAIRS[RB.pair],Q=rbQ(),n=Math.round(RB.T);let big,f,ck;
  if(n===0){big='還沒摩擦：兩個物體都是電中性（質子數＝電子數）';f='把棒子拖到布上左右來回摩擦';}
  else{const gain=P.s<0?P.r:P.c,lose=P.s<0?P.c:P.r;big=Q.leaks?`${P.c}失去 ${n} 個電子帶正電；銅棒得到的電子經手流走，銅棒不帶電`:`${gain}得到 ${n} 個電子帶負電，${lose}失去 ${n} 個電子帶正電`;
    f=`${P.c}：${qStr(Q.cloth)}　${P.r}：${qStr(Q.rod)}${Q.leaks?'（電子經手流走）':''}<br>摩擦前後總電量不變：電子只是從一個物體轉移到另一個`;}
  ck=[['info','移動的是電子，質子留在原子核裡不會移動。'],[RB.wet?'no':'info',RB.wet?'潮濕：電荷會慢慢流失。':'乾燥時摩擦起電較容易成功。']];
  if(RB.pair==='cu')ck.push([RB.grip?'ok':'no',RB.grip?'有絕緣把手，銅棒可以留住電荷。':'銅是導體，電子經過手流走，銅棒不帶電。']);
  $('rbBig').textContent=big;$('rbF').innerHTML=f;checks($('rbC'),ck);}
SIZE.rub=()=>{({W:WR,H:HR}=fit($('cvRb'),.42,280,420));};
UI.rub=()=>{rbUI();};
TICK.rub=dt=>{RB.t+=dt;if(RB.auto>0){RB.auto-=dt;const Cl=rbCloth(WR,HR);rubMove((Cl.x+Cl.w/2)/WR+Math.sin(RB.t*8)*.12,.12+.16);if(RB.auto<=0){RB.x=.55;RB.y=.22;}}
  if(RB.wet&&RB.T>0)RB.T=Math.max(0,RB.T-dt*1.5);if(RB.leak>0)RB.leak-=dt;
  const Q=rbQ(),R=rbRod(WR,HR);RB.bits.forEach(b=>{const bx=b.x*WR,by=b.y*HR;const dx=bx<R.x0?R.x0-bx:bx>R.x1?bx-R.x1:0,dy=by-R.y;const d=Math.hypot(dx,dy);const reach=12*Math.abs(Q.rod);
    const target=Math.abs(Q.rod)>=2&&d<reach+30&&dx<8?Math.max(0,by-(R.y+(RB.pair==='wool'?26:12))):0;b.dy+=(target-b.dy)*Math.min(1,dt*6);});
  return true;};
let rbLast='';DRAW.rub=()=>{drawRub($('cvRb').getContext('2d'),WR,HR);const k=RB.pair+Math.round(RB.T)+RB.grip+RB.wet+(RB.leak>0);if(k!==rbLast){rbLast=k;rbResults();}};
