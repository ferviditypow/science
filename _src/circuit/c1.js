
// =====================================================================
// 1 電流與電子流
// =====================================================================
const MATS={cu:{n:'銅線',R:1e-3,cls:'metal',col:'#c8794a'},fe:{n:'鐵釘',R:5e-3,cls:'metal',col:'#8a9099'},al:{n:'鋁箔',R:2e-3,cls:'metal',col:'#cfd5db'},
  pen:{n:'鉛筆芯',R:3,cls:'graphite',col:'#4a4a4a'},salt:{n:'鹽水',R:40,cls:'ion',col:'#9cc9e8'},water:{n:'純水',R:2e5,cls:'water',col:'#d5ecf7'},
  eraser:{n:'橡皮擦',cls:'ins',col:'#f2c4cf'},plastic:{n:'塑膠尺',cls:'ins',col:'#7fb4d8'},glass:{n:'玻璃棒',cls:'ins',col:'#d9eef0'},wood:{n:'木筷',cls:'ins',col:'#d7b98a'},air:{n:'什麼都不夾',cls:'air'}};
const FL={n:1,mat:'cu',sw:true,jL:false,jB:false,mode:'e',showV:false,energy:false,zoom:'mat',Q:0,tm:0,c:null,parts:[]};let WF=600,HF=340,WZ=400,HZ=300;
const sup=n=>String(n).replace(/-/g,'⁻').replace(/\d/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const sci=(x,dp=2)=>{if(x===0)return '0';const e=Math.floor(Math.log10(Math.abs(x))),m=x/10**e;return Math.abs(e)<3?nf(x,dp):nf(m,dp)+'×10'+sup(e);};
function flBuild(){const M=MATS[FL.mat];const c=mkC({A:[0,0],B:[1.5,0],C:[3,0],D:[3,2],E:[1.5,2],F:[0,2]},[
  ['bat','F','A',{n:FL.n,E:1.5*FL.n,lab:nf(1.5*FL.n,1)+' V',lp:'r'}],['sw','A','B',{on:FL.sw,lab:'開關'}],['bulb','B','C',{lab:'燈泡',R:5,lp:'d'}],
  ['mat','C','D',{mat:FL.mat,R:M.R||1,off:M.cls==='ins'||M.cls==='air',lab:''}],['amm','D','E',{lab:'安培計',lp:'d'}],['wire','E','F'],
  ['jump','B','C',{on:FL.jL,lab:'跨接燈泡',side:-1,hu:.6}],['jump','F','A',{on:FL.jB,lab:'跨接電池',side:-1,hu:.6}]],{Iref:.3,Pref:.6,padT:24,ext:[.7,.75,0,0]});
  if(FL.c)c.E.forEach((e,i)=>{if(FL.c.E[i])e.ph=FL.c.E[i].ph;});FL.c=solve(c);FL.Q=0;FL.tm=0;flParts();}
function flParts(){const M=MATS[FL.mat],z=FL.zoom==='wire'?'metal':M.cls;FL.parts=[];FL.zcls=z;
  const n=z==='metal'?46:z==='graphite'?26:z==='ion'?14:z==='water'?2:z==='ins'?30:0;
  for(let i=0;i<n;i++)FL.parts.push({x:rnd(i*3+1),y:rnd(i*7+2),a:rnd(i)*TAU,k:i%2?1:-1,ox:rnd(i*5+4),oy:rnd(i*9+3)});}
function flUI(){segSet($('flN'),FL.n);segSet($('flMat'),FL.mat);segSet($('flMode'),FL.mode);segSet($('flZoom'),FL.zoom);
  $('flSw').checked=FL.sw;$('flJL').checked=FL.jL;$('flJB').checked=FL.jB;$('flV').checked=FL.showV;$('flEn').checked=FL.energy;
  howList('flHow',['電路要形成一個沒有中斷的迴路（通路）才有電流；中間斷開就是斷路。','電流方向：從電池正極經外電路流回負極。金屬導線中真正移動的是自由電子，電子流方向和電流方向相反。','原子核（帶正電）固定在原處不會移動；電子並沒有被燈泡「用掉」，繞一圈回到電池。',
    '電流 I ＝ Q／t：1 安培（A）表示每秒有 1 庫侖的電量通過導線的某一截面，1 A ＝ 1000 mA。','導線直接接在燈泡或電池兩端，電流幾乎都從導線走（短路）：燈泡不亮，電流很大，導線和電池會發熱，很危險。',
    '電壓：電池讓每 1 庫侖電荷得到的能量。1.5 V 的電池給每庫侖 1.5 焦耳；電荷通過燈泡時把能量轉成光和熱。勾「顯示每個電荷帶的能量」看黃色的「貨物」。']);}
segOn($('flN'),v=>{FL.n=+v;hideStory();flBuild();flUI();kick();});
segOn($('flMat'),v=>{FL.mat=v;hideStory();flBuild();flUI();kick();});
segOn($('flMode'),v=>{FL.mode=v;if(v==='e')FL.energy=false;flUI();kick();});
segOn($('flZoom'),v=>{FL.zoom=v;flParts();flUI();kick();});
[['flSw','sw'],['flJL','jL'],['flJB','jB']].forEach(([id,k])=>$(id).addEventListener('change',()=>{FL[k]=$(id).checked;flBuild();kick();}));
$('flV').addEventListener('change',()=>{FL.showV=$('flV').checked;kick();});
$('flEn').addEventListener('change',()=>{FL.energy=$('flEn').checked;if(FL.energy)FL.mode='c';flUI();kick();});
circPointer($('cvFl'),()=>FL.c,()=>[],e=>{if(!e)return;if(e.t==='sw'){FL.sw=!FL.sw;}else if(e.t==='jump'){if(e.a==='B')FL.jL=!FL.jL;else FL.jB=!FL.jB;}else if(e.t==='mat'){FL.zoom='mat';flParts();}else if(e.t==='wire'){FL.zoom='wire';flParts();}else return;flBuild();flUI();},()=>kick());
function flState(){const c=FL.c,bat=c.E[0],I=Math.abs(bat.I),Vt=Math.abs(c.V.A-c.V.F);const Rext=I>1e-9?Vt/I:1e12;
  return {c,I,Rext,short:I>1e-6&&Rext<.05,open:I<1e-7,lamp:c.E[2],amm:c.E[4],mat:c.E[3]};}
function drawFlow(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const c=FL.c;lay(c,W,H,52,190);drawCirc(g,c,{mode:FL.mode,showV:FL.showV,energy:FL.energy});
  const S=flState();if(S.short)text(g,'短路！電流非常大',W/2,H-10,{size:14,bold:true,col:CC.pos,align:'center',bg:C.panel});
  else if(S.open)text(g,'斷路：沒有電流',W/2,H-10,{size:14,bold:true,col:C.muted,align:'center',bg:C.panel});
  text(g,FL.mode==='e'?'藍點：電子（帶負電）':'紅色箭頭：電流方向',10,18,{size:12,col:FL.mode==='e'?CC.neg:CC.pos,bold:true});}
function drawZoom(g,W,H,dt){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const S=flState(),M=MATS[FL.mat];const z=FL.zcls;
  const e=FL.zoom==='wire'?FL.c.E[5]:S.mat;const I=e.off?0:e.I;const x0=12,y0=38,w=W-24,h=H-84;
  g.fillStyle=z==='ion'||z==='water'?(CC.dark?'#1d3a4f':'#e3f2fb'):z==='ins'?(CC.dark?'#3a3340':'#f6eef2'):z==='air'?C.panel:(CC.dark?'#3a3128':'#f5ead9');g.strokeStyle=C.line;g.lineWidth=1;g.fillRect(x0,y0,w,h);g.strokeRect(x0,y0,w,h);
  text(g,FL.zoom==='wire'?'放大導線（銅）':'放大：'+M.n,x0,y0-10,{size:13,bold:true});
  const vd=clamp(70*I/.3,-220,220);const rows=4,cols=Math.max(6,Math.round(w/52));
  if(z==='metal'||z==='graphite'||z==='ins'){for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const x=x0+w*(k+.5)/cols,y=y0+h*(r+.5)/rows;g.fillStyle=CC.dark?'#5a4a3a':'#e2cdb0';g.beginPath();g.arc(x,y,11,0,TAU);g.fill();sym(g,x,y,1,4.5);}}
  if(z==='water'||z==='ion'){for(let i=0;i<22;i++){const x=x0+w*rnd(i+50),y=y0+h*rnd(i+80);g.strokeStyle=CC.dark?'#4c6e86':'#a9cbe0';g.lineWidth=1.2;g.beginPath();g.arc(x,y,6,0,TAU);g.stroke();}}
  FL.parts.forEach((p,i)=>{let x,y;
    if(z==='ins'){const r=i%rows,k=Math.floor(i/rows)%cols;p.a+=dt*4;x=x0+w*(k+.5)/cols+Math.cos(p.a)*15;y=y0+h*(r+.5)/rows+Math.sin(p.a)*15;sym2(g,x,y,-1);return;}
    const sgn=z==='ion'?p.k:-1;const v=z==='ion'?vd*.5*sgn:-vd;// 正離子順電流，負離子與電子逆電流
    p.a+=(rnd(i+Math.floor(FL.tt*6))-.5)*dt*30;p.x+=(v+Math.cos(p.a)*(z==='ion'?20:60))*dt/w;p.y+=Math.sin(p.a)*(z==='ion'?20:60)*dt/h;
    p.x=((p.x%1)+1)%1;if(p.y<.03||p.y>.97){p.a=-p.a;p.y=clamp(p.y,.03,.97);}x=x0+w*p.x;y=y0+h*p.y;
    if(z==='ion'){if(p.k>0){g.fillStyle=CC.pos;g.beginPath();g.arc(x,y,7,0,TAU);g.fill();text(g,'Na⁺',x,y+3,{size:8,col:'#fff',align:'center'});}else{g.fillStyle=C.green;g.beginPath();g.arc(x,y,8,0,TAU);g.fill();text(g,'Cl⁻',x,y+3,{size:8,col:'#fff',align:'center'});}}
    else sym2(g,x,y,-1);});
  const yb=y0+h+18;
  if(Math.abs(I)>1e-6){arrow(g,x0+10,yb,x0+80,yb,CC.pos,2.5);text(g,'電流方向',x0+86,yb+4,{size:12,col:CC.pos,bold:true});
    if(z==='ion'){text(g,'正離子順著電流、負離子逆著電流移動',x0,yb+22,{size:12});}
    else{arrow(g,x0+w-10,yb,x0+w-80,yb,CC.neg,2.5);text(g,'電子移動',x0+w-86,yb+4,{size:12,col:CC.neg,bold:true,align:'right'});text(g,z==='metal'||z==='graphite'?'原子核（＋）只在原位置，不會移動':'',x0,yb+22,{size:12});}}
  else text(g,z==='ins'?'電子被原子緊緊束縛，不能自由移動 → 不導電':z==='air'?'夾子之間沒有東西：斷路':z==='water'?'純水中的離子非常少，幾乎不導電':'沒有電流：自由電子只在原地亂動，沒有整體移動',x0,yb+4,{size:12});}
function sym(g,x,y,s,sz=6){const c=s>0?CC.pos:CC.neg;g.strokeStyle=c;g.lineWidth=2;g.beginPath();g.moveTo(x-sz,y);g.lineTo(x+sz,y);if(s>0){g.moveTo(x,y-sz);g.lineTo(x,y+sz);}g.stroke();}
function sym2(g,x,y){g.fillStyle=CC.neg;g.beginPath();g.arc(x,y,4.2,0,TAU);g.fill();g.strokeStyle='#fff';g.lineWidth=1.3;g.beginPath();g.moveTo(x-2.2,y);g.lineTo(x+2.2,y);g.stroke();}
function flResults(){const S=flState(),M=MATS[FL.mat],b=bright(S.lamp,.6);let big,f,ck=[];
  if(S.short)big=FL.jB?'短路：導線直接接在電池兩端，電流不經過燈泡':'短路：電流從導線走，不經過燈泡';
  else if(S.open)big=!FL.sw?'斷路：開關打開，電路沒有接通':M.cls==='ins'||M.cls==='air'?`斷路：${M.n==='什麼都不夾'?'夾子之間沒有東西':M.n+'是絕緣體'}，沒有電流`:'斷路';
  else if(b<.03)big=`通路，但電流很小（${fI(S.amm.I)}），燈泡幾乎不亮`;else big=`通路：燈泡發亮，電流 ${fI(S.amm.I)}`;
  const I=Math.abs(S.amm.I);f=`安培計讀數 I ＝ ${fI(I)}`+(I>1e-6?`<br>每秒通過 ${sci(I)} 庫侖 ≈ ${sci(I*6.25e18)} 個電子<br>計時 ${nf(FL.tm,1)} 秒：Q ＝ I × t ≈ ${sci(FL.Q)} 庫侖`:'');
  ck.push(['info',FL.mode==='e'?'藍點是電子：從電池負極出發，經外電路流回正極。':'電流方向：從電池正極經外電路流回負極（和電子流相反）。']);
  ck.push({metal:['ok',M.n+'是金屬，有自由電子 → 導體。'],graphite:['ok','鉛筆芯（石墨）不是金屬，但也能導電。'],ion:['ok','鹽水（電解質水溶液）靠正、負離子移動導電；電流小，燈泡可能不亮，但安培計有讀數。'],water:['no','純水的離子極少，幾乎不導電。'],ins:['no',M.n+'是絕緣體：沒有可以自由移動的電荷。'],air:['no','夾子之間是空氣：斷路。']}[M.cls]);
  if(S.short)ck.push(['no','短路時電阻極小、電流很大，導線與電池發熱，可能造成危險。']);
  if(FL.jL&&!FL.jB&&!S.open&&!S.short)ck.push(['info','燈泡被導線跨接：電流走電阻較小的導線，燈泡不亮。']);
  if(FL.energy)ck.push(['info',`黃色圓的大小代表每單位電荷帶的電能：經過電池得到 ${nf(1.5*FL.n,1)} 焦耳／庫侖，經過燈泡時轉成光和熱；電荷本身沒有被用掉。`]);
  $('flBig').textContent=big;$('flF').innerHTML=f;checks($('flC'),ck);}
SIZE.flow=()=>{({W:WF,H:HF}=fit($('cvFl'),.78,300,480));({W:WZ,H:HZ}=fit($('cvFz'),.75,250,340));};
UI.flow=()=>{if(!FL.c)flBuild();flUI();};
let flAcc=0;TICK.flow=dt=>{FL.tt=(FL.tt||0)+dt;tickDots(FL.c,dt,{mode:FL.mode});const I=Math.abs(FL.c.E[4].I);if(I>1e-6){FL.Q+=I*dt;FL.tm+=dt;}flAcc+=dt;FL.dt=dt;return true;};
DRAW.flow=()=>{drawFlow($('cvFl').getContext('2d'),WF,HF);drawZoom($('cvFz').getContext('2d'),WZ,HZ,FL.dt||0);if(flAcc>.25||!$('flBig').textContent){flAcc=0;flResults();}};
