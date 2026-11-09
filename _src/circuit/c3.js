
// =====================================================================
// 3 安培計與伏特計
// =====================================================================
const TERMS={amm:[{lab:'50 mA',fs:.05,maj:[0,10,20,30,40,50],k:1000,u:'mA',m:50},{lab:'500 mA',fs:.5,maj:[0,100,200,300,400,500],k:1000,u:'mA',m:50},{lab:'5 A',fs:5,maj:[0,1,2,3,4,5],k:1,u:'A',m:50}],
  vm:[{lab:'3 V',fs:3,maj:[0,1,2,3],k:1,u:'V',m:30},{lab:'15 V',fs:15,maj:[0,5,10,15],k:1,u:'V',m:30},{lab:'300 V',fs:300,maj:[0,100,200,300],k:1,u:'V',m:30}]};
const CONN={amm:{ok:'串聯在電路中（正確）',rev:'串聯但＋、−端接反',par:'並聯在燈泡兩端（錯誤）',bat:'直接接在電池兩端（錯誤）'},vm:{ok:'並聯在燈泡兩端（正確）',bat:'並聯在電池兩端',rev:'並聯但＋、−端接反',ser:'串聯在電路中（錯誤）'}};
const MT={mode:'amm',conn:'ok',ta:2,tv:1,n:2,sw:true,prac:null,needle:0,c:null};let WM=500,HM=320,WD=400,HD=300;
const mtT=()=>TERMS[MT.mode][MT.mode==='amm'?MT.ta:MT.tv];
function mtBuild(){const N={A:[0,0],B:[2,0],C:[4,0],D:[4,2],E:[0,2]};const t=MT.mode,k=MT.conn,lab=t==='amm'?'A':'V';
  const E=[['bat','E','A',{n:MT.n,E:1.5*MT.n,lab:nf(1.5*MT.n,1)+' V',lp:'l'}],['sw','A','B',{on:MT.sw,lab:'S'}],['bulb','B','C',{lab:'L',R:5}],['wire','D','E']];
  const M=(a,b)=>[t,a,b,{lab,meter:true,lp:t==='vm'&&(k==='ok'||k==='rev')||t==='amm'&&k==='par'?'u':k==='bat'?'l':'l'}];
  if(k==='ok'&&t==='amm'||k==='ser')E.push(M('C','D'));else if(k==='rev'&&t==='amm')E.push(M('D','C'));else E.push(['wire','C','D']);
  if(k==='par'||(t==='vm'&&(k==='ok'||k==='rev'))){N.P=[2,-1];N.Q=[4,-1];E.push(['wire','B','P'],['wire','Q','C'],k==='rev'?M('Q','P'):M('P','Q'));}
  if(k==='bat'){N.X=[-1,0];N.Y=[-1,2];E.push(['wire','A','X'],['wire','Y','E'],M('X','Y'));}
  const old=MT.c;MT.c=solve(mkC(N,E,{Iref:.3,Pref:.6,noLet:['P','Q','X','Y']}));if(old)MT.c.E.forEach((e,i)=>{if(old.E[i])e.ph=old.E[i].ph;});
  const m=MT.c.E.find(e=>e.meter);m.burnt=t==='amm'&&Math.abs(m.I)>20;}
const mtMeter=()=>MT.c.E.find(e=>e.meter);
const mtVal=()=>{const m=mtMeter();return MT.mode==='amm'?m.I:m.dV;};
function mtUI(){segSet($('mtMode'),MT.mode);segSet($('mtN'),MT.n);$('mtSw').checked=MT.sw;
  $('mtConn').innerHTML=Object.entries(CONN[MT.mode]).map(([k,v])=>`<button data-v="${k}">${v}</button>`).join('');segSet($('mtConn'),MT.conn);
  $('mtTerm').innerHTML=TERMS[MT.mode].map((t,i)=>`<button data-v="${i}">＋${t.lab}</button>`).join('');segSet($('mtTerm'),MT.mode==='amm'?MT.ta:MT.tv);
  $('mtAns').hidden=!MT.prac;$('mtPrac').textContent=MT.prac?'換一題':'🎯 讀刻度練習';$('mtExit').hidden=!MT.prac;
  howList('mtHow',['安培計測電流：一定要和待測物「串聯」。安培計內部電阻很小，若並聯或直接接電池兩端，會形成短路、電流極大而燒毀。','伏特計測電壓：一定要和待測物「並聯」。伏特計內部電阻很大，若串聯在電路中，電路幾乎沒有電流，燈泡不亮，讀數約等於電池電壓。',
    '電流從電表的＋端流進、−端流出；接反時指針會往 0 的左邊偏（反偏）。','不知道大小時，先接最大量程的端子（安培計 5 A、伏特計 300 V），指針偏轉太小再依序換小量程，讀數較精確。','讀數：先看接的是哪一個＋端子，滿刻度就是那個值；再算每一小格代表多少。','使用前先檢查指針是否歸零（可調整歸零鈕）。']);}
segOn($('mtMode'),v=>{MT.mode=v;MT.conn='ok';MT.prac=null;hideStory();mtBuild();mtUI();kick();});
segOn($('mtConn'),v=>{MT.conn=v;MT.prac=null;mtBuild();mtUI();kick();});
segOn($('mtTerm'),v=>{if(MT.mode==='amm')MT.ta=+v;else MT.tv=+v;if(MT.prac)MT.prac.show=false;mtUI();kick();});
segOn($('mtN'),v=>{MT.n=+v;mtBuild();mtUI();kick();});
$('mtSw').addEventListener('change',()=>{MT.sw=$('mtSw').checked;mtBuild();kick();});
function mtNewPrac(ti){const L=TERMS[MT.mode];const i=ti!==undefined?ti:Math.floor(Math.random()*3);if(MT.mode==='amm')MT.ta=i;else MT.tv=i;const T=L[i];const k=3+Math.floor(Math.random()*(T.m-5));MT.prac={v:T.fs*k/T.m,show:false};}
$('mtPrac').addEventListener('click',()=>{mtNewPrac();mtUI();kick();});
$('mtAns').addEventListener('click',()=>{if(MT.prac){MT.prac.show=true;kick();}});
$('mtExit').addEventListener('click',()=>{MT.prac=null;mtUI();kick();});
circPointer($('cvMc'),()=>MT.c,()=>[],e=>{if(e&&e.t==='sw'){MT.sw=!MT.sw;mtBuild();mtUI();}},()=>kick());
function drawDial(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const T=mtT();const cx=W/2,R=Math.min(W*.4,H*.62),cy=H*.12+R+6;
  g.fillStyle=CC.dark?'#2c3138':'#fbf8f0';g.strokeStyle=C.ink;g.lineWidth=1.5;g.beginPath();g.roundRect(cx-R-24,cy-R-26,2*R+48,R+70,12);g.fill();g.stroke();
  const a0=-140*D2R,a1=-40*D2R,ang=f=>a0+(a1-a0)*f;
  for(let i=0;i<=T.m;i++){const f=i/T.m,a=ang(f);const isMaj=T.maj.some(v=>Math.abs(v/T.maj[T.maj.length-1]-f)<1e-6),half=i%(T.m/(T.maj.length-1)/2)===0;const l=isMaj?14:half?9:5;
    line(g,cx+Math.cos(a)*R,cy+Math.sin(a)*R,cx+Math.cos(a)*(R-l),cy+Math.sin(a)*(R-l),C.ink,isMaj?2:1);}
  T.maj.forEach((v,i)=>{const a=ang(i/(T.maj.length-1));text(g,String(v),cx+Math.cos(a)*(R-28),cy+Math.sin(a)*(R-28)+4,{size:13,bold:true,align:'center'});});
  g.strokeStyle=C.ink;g.lineWidth=1.2;g.beginPath();g.arc(cx,cy,R,a0,a1);g.stroke();
  text(g,T.u,cx,cy-R*.42,{size:20,bold:true,align:'center',col:C.muted});
  const tg=MT.prac?MT.prac.v/T.fs:mtVal()/T.fs;const f=clamp(MT.needle,-.07,1.07);const a=ang(f);
  line(g,cx,cy,cx+Math.cos(a)*(R-4),cy+Math.sin(a)*(R-4),CC.pos,2.4);g.fillStyle=C.ink;g.beginPath();g.arc(cx,cy,6,0,TAU);g.fill();
  // 端子
  const ty=cy+30,lbs=['−',...TERMS[MT.mode].map(t=>'＋'+t.lab)],sel=(MT.mode==='amm'?MT.ta:MT.tv)+1,dx=Math.min(64,(2*R+20)/4);
  lbs.forEach((l,i)=>{const x=cx-1.5*dx+i*dx;g.fillStyle=i===0?(CC.dark?'#9aa3ad':'#333'):CC.pos;g.beginPath();g.arc(x,ty,7,0,TAU);g.fill();if(i===0||i===sel){g.strokeStyle=C.accent;g.lineWidth=3;g.beginPath();g.arc(x,ty,11,0,TAU);g.stroke();}
    text(g,l,x,ty+24,{size:11.5,bold:i===sel||i===0,align:'center',col:i===sel||i===0?C.ink:C.muted});});
  if(MT.prac){text(g,MT.prac.show?`答案：${nf(MT.prac.v*T.k,2)} ${T.u}`:'指針讀數是多少？',cx,H-8,{size:15,bold:true,align:'center',col:MT.prac.show?C.accent:C.ink});}
  else if(tg>1.02)text(g,'超過量程！指針打到底',cx,H-8,{size:14,bold:true,align:'center',col:CC.pos});else if(tg<-.01)text(g,'指針反偏：＋、−端接反了',cx,H-8,{size:14,bold:true,align:'center',col:CC.pos});}
function mtResults(){const T=mtT(),m=mtMeter(),v=mtVal(),f=v/T.fs;let big,F,ck=[];const isA=MT.mode==='amm';const step=T.fs/T.m;
  if(MT.prac){big=`讀刻度練習：接在「＋${T.lab}」端子`;F=`滿刻度 ＝ ${T.lab}，共 ${T.m} 小格 → 每一小格 ＝ ${nf(step*T.k,3)} ${T.u}`;ck=[['info','先確認接的是哪個端子，再數指針經過幾小格。'],['info','讀完按「看答案」。']];}
  else{if(m.burnt)big=`安培計燒毀！電流極大（${fI(m.I)}）`;else if(f>1.02)big=`超過量程（實際約 ${isA?fI(v):fV(v)}）：要換大一點的端子`;else if(f<-.01)big='指針反偏：電流從－端流進，＋、－端接反了';
    else big=`讀數 ${isA?fI(v):fV(v)}`+(isA&&Math.abs(v)<.995&&Math.abs(v)>=.1?`（${nf(v*1000,0)} mA）`:'');
    F=`接「＋${T.lab}」端子：滿刻度 ${T.lab}，每一小格 ${nf(step*T.k,3)} ${T.u}`+(f>=0&&f<=1.02?`<br>指針約在第 ${nf(f*T.m,1)} 小格`:'');
    const L=MT.c.E.find(e=>e.t==='bulb');const ok=MT.conn==='ok'||(MT.mode==='vm'&&MT.conn==='bat');
    ck.push([ok?'ok':'no',CONN[MT.mode][MT.conn]+'。']);
    if(isA&&(MT.conn==='par'||MT.conn==='bat'))ck.push(['no','安培計電阻極小，並聯或接在電池兩端等於短路：電流極大、燒毀電表，燈泡也不亮。']);
    if(!isA&&MT.conn==='ser')ck.push(['no','伏特計電阻極大，串聯後電路幾乎沒有電流：燈泡不亮，讀數約等於電池電壓。']);
    if(MT.conn==='rev')ck.push(['no','電流要從＋端流入、－端流出；接反指針反偏，可能損壞電表。']);
    if(f>1.02&&!m.burnt)ck.push(['no','超過量程：改接較大量程的端子。不確定大小時，要先接最大量程。']);
    else if(f>0&&f<.1&&MT.conn!=='ser')ck.push(['info','指針偏轉太小，讀數不精確：可以改用小一點的量程。']);
    ck.push(['info',`燈泡：${L.P>.02?'亮':'不亮'}（燈泡兩端電壓 ${fV(Math.abs(L.dV))}，電流 ${fI(Math.abs(L.I))}）`]);}
  $('mtBig').textContent=big;$('mtF').innerHTML=F;checks($('mtC'),ck);}
SIZE.meter=()=>{({W:WM,H:HM}=fit($('cvMc'),.66,260,380));({W:WD,H:HD}=fit($('cvMd'),.72,250,340));};
UI.meter=()=>{if(!MT.c)mtBuild();mtUI();};
let mtAcc=1;TICK.meter=dt=>{tickDots(MT.c,dt,{mode:'c'});const T=mtT();const tg=MT.prac?MT.prac.v/T.fs:mtVal()/T.fs;MT.needle+=(clamp(tg,-.07,1.07)-MT.needle)*Math.min(1,dt*7);mtAcc+=dt;return true;};
DRAW.meter=()=>{const g=$('cvMc').getContext('2d');g.fillStyle=C.panel;g.fillRect(0,0,WM,HM);lay(MT.c,WM,HM,46,150);drawCirc(g,MT.c,{mode:'c',showR:false});
  drawDial($('cvMd').getContext('2d'),WD,HD);if(mtAcc>.2){mtAcc=0;mtResults();}};
