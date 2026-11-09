
// =====================================================================
// 4 歐姆定律
// =====================================================================
const SMP={A:{n:'電阻線 A',R:2},B:{n:'電阻線 B',R:1},S:{n:'A、B 串聯',R:3},P:{n:'A、B 並聯',R:2/3},pen:{n:'鉛筆芯',R:2.5},ni:{n:'鎳鉻絲',R:5},bulb:{n:'燈泡（燈絲）',non:true},cus:{n:'自訂導線'}};
const RHO={cu:{n:'銅',r:.017},w:{n:'鎢',r:.055},fe:{n:'鐵',r:.1},ni:{n:'鎳鉻合金',r:1.1}};
const OH={smp:'A',n:2,ax:'VI',mt:'ideal',mat:'ni',L:1,A:.5,data:{},order:[],c:null};let WO=360,HO=260,WG=520,HG=360;
const PAL=['#d2452f','#1f77b4','#2a9d5c','#9a4fc4','#e08a1e','#00838f','#c2185b','#6d6d6d'];
const ohR=()=>OH.smp==='cus'?RHO[OH.mat].r*OH.L/OH.A:SMP[OH.smp].R;
const ohKey=()=>(OH.smp==='cus'?'cus:'+nf(ohR(),3):OH.smp)+(OH.mt==='ideal'?'':'*'+OH.mt);
const ohName=k=>{const [b,m]=k.split('*');const nm=b.startsWith('cus:')?`自訂 ${b.slice(4)} Ω`:SMP[b].n+(SMP[b].R?` ${nf(SMP[b].R,2)} Ω`:'');return nm+(m?(m==='out'?'（安培計外接）':'（安培計內接）'):'');};
function ohBuild(){const N={A:[0,0],B:[2,0],C:[4,0],D:[4,2],E:[0,2],Q:[4,-1]};const s=SMP[OH.smp];
  const E=[['bat','E','A',{n:OH.n,E:1.5*OH.n,lab:nf(1.5*OH.n,1)+' V',lp:'l'}],['amm','A','B',{lab:'A'}],[s.non?'bulb':'res','B','C',s.non?{lab:'燈泡',non:true,R:5,lp:'d'}:{lab:'待測',R:ohR(),lp:'d'}],['wire','C','D'],['wire','D','E']];
  if(OH.mt==='in'){N.P=[0,-1];E.push(['wire','A','P'],['vm','P','Q',{lab:'V'}],['wire','Q','C']);}else{N.P=[2,-1];E.push(['wire','B','P'],['vm','P','Q',{lab:'V'}],['wire','Q','C']);}
  const o={Iref:.75,Pref:1.2,noLet:['P','Q']};if(OH.mt!=='ideal'){o.ammR=.5;o.vmR=10;}const old=OH.c;OH.c=solve(mkC(N,E,o));if(old)OH.c.E.forEach((e,i)=>{if(old.E[i])e.ph=old.E[i].ph;});}
const ohRead=()=>{const c=OH.c;return{V:c.E.find(e=>e.t==='vm').dV,I:c.E.find(e=>e.t==='amm').I,R:c.E[2].R};};
function ohRec(){const r=ohRead(),k=ohKey();if(!OH.data[k]){OH.data[k]=[];OH.order.push(k);}const L=OH.data[k];const i=L.findIndex(p=>p.n===OH.n);const p={n:OH.n,V:r.V,I:r.I};if(i>=0)L[i]=p;else L.push(p);L.sort((a,b)=>a.n-b.n);}
function ohUI(){segSet($('ohS'),OH.smp);segSet($('ohN'),OH.n);segSet($('ohAx'),OH.ax);segSet($('ohMt'),OH.mt);segSet($('ohMat'),OH.mat);
  $('ohCus').hidden=OH.smp!=='cus';$('ohL').value=OH.L;$('ohLo').textContent=nf(OH.L,2)+' m';$('ohA').value=OH.A;$('ohAo').textContent=nf(OH.A,2)+' mm²';
  const k=ohKey(),L=OH.data[k]||[];$('ohTab').innerHTML=`<tr><th>電池數</th><th>電壓 V（V）</th><th>電流 I（A）</th><th>V／I（Ω）</th></tr>`+(L.length?L.map(p=>`<tr><td>${p.n}</td><td>${nf(p.V,2)}</td><td>${nf(p.I,3)}</td><td>${nf(p.V/p.I,2)}</td></tr>`).join(''):'<tr><td colspan="4">按「記錄這一點」把數據加進表格與圖</td></tr>');
  $('ohTabT').textContent=ohName(k)+' 的數據';
  howList('ohHow',['歐姆定律：同一個導體在溫度不變時，兩端電壓 V 和電流 I 成正比，V／I 是定值，這個比值就是電阻 R（R ＝ V／I，單位歐姆 Ω）。','V–I 圖（縱軸電壓、橫軸電流）是通過原點的直線，斜率 ＝ 電阻；越陡電阻越大。I–V 圖（縱軸電流）斜率 ＝ 1／R，越陡電阻越小。',
    '電阻和電池數無關：電池數改變，V、I 一起改變，V／I 不變。','R ＝ ρ × L ／ A：材質（電阻率 ρ）、長度 L、截面積 A 決定電阻；越長越大，越粗越小。','燈泡（燈絲）不是歐姆導體：電壓越大燈絲越熱，電阻越大，V–I 圖是曲線。','串聯總電阻比每一個都大；並聯總電阻比每一個都小，所以在 V–I 圖上，串聯的線最陡、並聯的線最平。']);}
segOn($('ohS'),v=>{OH.smp=v;hideStory();ohBuild();ohUI();kick();});segOn($('ohN'),v=>{OH.n=+v;ohBuild();ohUI();kick();});
segOn($('ohAx'),v=>{OH.ax=v;ohUI();kick();});segOn($('ohMt'),v=>{OH.mt=v;ohBuild();ohUI();kick();});segOn($('ohMat'),v=>{OH.mat=v;ohBuild();ohUI();kick();});
$('ohL').addEventListener('input',()=>{OH.L=+$('ohL').value;ohBuild();ohUI();kick();});$('ohA').addEventListener('input',()=>{OH.A=+$('ohA').value;ohBuild();ohUI();kick();});
$('ohRec').addEventListener('click',()=>{ohRec();ohUI();kick();});
$('ohAll').addEventListener('click',()=>{for(let n=1;n<=4;n++){OH.n=n;ohBuild();ohRec();}ohUI();kick();});
$('ohClr').addEventListener('click',()=>{OH.data={};OH.order=[];ohUI();kick();});
const niceMax=x=>[.5,1,1.5,2,3,4,5,6,8,10,12,15,20,30,40,50,80,100,150,200,300,400].find(v=>v>=x*1.05)||Math.ceil(x);
function drawGraph(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const L=56,R=W-18,T=22,B=H-42;const r=ohRead();
  let Im=Math.abs(r.I);OH.order.forEach(k=>OH.data[k].forEach(p=>Im=Math.max(Im,p.I)));Im=niceMax(Math.max(Im,.5));const Vm=7;
  const VI=OH.ax==='VI';const xm=VI?Im:Vm,ym=VI?Vm:Im;const X=v=>L+(R-L)*v/xm,Y=v=>B-(B-T)*v/ym;const px=(V,I)=>VI?[X(I),Y(V)]:[X(V),Y(I)];
  // 格線
  const xs=VI?Im/5:1,ys=VI?1:Im/5;for(let v=0;v<=xm+1e-9;v+=xs){line(g,X(v),T,X(v),B,C.grid,1);text(g,nf(v,2),X(v),B+16,{size:11,align:'center',col:C.muted});}
  for(let v=0;v<=ym+1e-9;v+=ys){line(g,L,Y(v),R,Y(v),C.grid,1);text(g,nf(v,2),L-6,Y(v)+4,{size:11,align:'right',col:C.muted});}
  line(g,L,B,R,B,C.ink,1.6);line(g,L,B,L,T,C.ink,1.6);text(g,VI?'電流 I（A）':'電壓 V（V）',R,B+34,{size:12,bold:true,align:'right'});text(g,VI?'電壓 V（V）':'電流 I（A）',L-50,T-8,{size:12,bold:true});
  g.save();g.beginPath();g.rect(L,T,R-L,B-T);g.clip();
  // 區域
  if(OH.data.A&&OH.data.B){const ang=Rr=>{const p=px(Rr,1);const o=px(0,0);return Math.atan2(p[1]-o[1],p[0]-o[0]);};const o=px(0,0),aA=ang(2),aB=ang(1),aV=-Math.PI/2,aH=0;const rr=Math.min(R-L,B-T)*.72;
    const regs=VI?[[(aV+aA)/2,'R＞2 Ω'],[(aA+aB)/2,'1～2 Ω'],[(aB+aH)/2,'R＜1 Ω']]:[[(aV+aB)/2,'R＜1 Ω'],[(aA+aB)/2,'1～2 Ω'],[(aA+aH)/2,'R＞2 Ω']];
    regs.forEach(([a,t])=>text(g,t,o[0]+Math.cos(a)*rr,o[1]+Math.sin(a)*rr,{size:12,bold:true,col:C.purple,align:'center',bg:C.panel}));}
  OH.order.forEach((k,i)=>{const P=OH.data[k],col=PAL[i%PAL.length];if(!P.length)return;const non=k.startsWith('bulb');
    if(non){g.strokeStyle=col;g.lineWidth=2.2;g.beginPath();const o=px(0,0);g.moveTo(o[0],o[1]);P.forEach(p=>{const q=px(p.V,p.I);g.lineTo(q[0],q[1]);});g.stroke();}
    else{const sl=P.reduce((s,p)=>s+p.V*p.I,0)/P.reduce((s,p)=>s+p.I*p.I,0);const tI=Math.min(Im,Vm/sl)*1.0;const o=px(0,0),e=px(sl*tI,tI);line(g,o[0],o[1],e[0],e[1],col,2.2);}
    P.forEach(p=>{const q=px(p.V,p.I);g.fillStyle=col;g.beginPath();g.arc(q[0],q[1],5,0,TAU);g.fill();});});
  g.restore();
  OH.order.forEach((k,i)=>{const P=OH.data[k];if(!P.length)return;const p=P[P.length-1],q=px(p.V,p.I);text(g,ohName(k).replace(/（.*）/,''),Math.min(q[0]+8,R-4),q[1]-8,{size:11.5,bold:true,col:PAL[i%PAL.length],align:q[0]>R-90?'right':'left',bg:C.panel});});
  const q=px(r.V,r.I);if(q[0]<=R+2&&q[1]>=T-2){g.strokeStyle=C.accent;g.lineWidth=2.5;g.beginPath();g.arc(q[0],q[1],8,0,TAU);g.stroke();}}
function ohResults(){const r=ohRead(),Rm=r.V/r.I,Rt=r.R;let big=`V ＝ ${fV(r.V)}，I ＝ ${fI(r.I)}，V／I ＝ ${nf(Rm,2)} Ω`;const F=[],ck=[];
  if(OH.smp==='cus'){const M=RHO[OH.mat];F.push(`R ＝ ρ × L ／ A ＝ ${M.r} × ${nf(OH.L,2)} ÷ ${nf(OH.A,2)} ＝ ${nf(Rt,3)} Ω（${M.n}，ρ 單位 Ω·mm²／m）`);if(Rt<.2)ck.push(['no','電阻非常小，直接接電池時電流很大（接近短路），實驗時要串聯其他電阻保護。']);}
  if(SMP[OH.smp].non){F.push(`燈絲此時的電阻 ≈ ${nf(Rt,2)} Ω：電壓越大燈絲越熱，V／I 越大`);ck.push(['no','燈泡不是歐姆導體：V／I 不是定值，V–I 圖不是直線。']);}
  else ck.push(['ok','歐姆導體：電池數改變時 V、I 同比例改變，V／I 不變。']);
  if(OH.smp==='S')F.push('串聯：R ＝ R_A ＋ R_B ＝ 2 ＋ 1 ＝ 3 Ω');if(OH.smp==='P')F.push('並聯：1／R ＝ 1／2 ＋ 1／1 ＝ 3／2 → R ＝ 2／3 ≈ 0.67 Ω');
  if(OH.mt!=='ideal'){F.push(`真正的電阻 ${nf(Rt,2)} Ω；用電表讀數算出 ${nf(Rm,2)} Ω（${Rm>Rt?'偏大':'偏小'}）`);
    ck.push(['info',OH.mt==='out'?'安培計外接：伏特計只量待測物的電壓，但安培計的讀數包含流過伏特計的電流 → 算出的 R 偏小。':'安培計內接：安培計只量待測物的電流，但伏特計的讀數包含安培計兩端的電壓 → 算出的 R 偏大。']);ck.push(['info','（電表的電阻故意放大：安培計 0.5 Ω、伏特計 10 Ω，讓差異明顯。）']);}
  else ck.push(['info','安培計和待測物串聯，伏特計和待測物並聯。']);
  $('ohBig').textContent=big;$('ohF').innerHTML=F.join('<br>')||'R ＝ V ／ I';checks($('ohC'),ck);}
SIZE.ohm=()=>{({W:WO,H:HO}=fit($('cvOc'),.7,240,330));({W:WG,H:HG}=fit($('cvOg'),.7,280,420));};
UI.ohm=()=>{if(!OH.c)ohBuild();ohUI();};
let ohAcc=1;TICK.ohm=dt=>{tickDots(OH.c,dt,{mode:'c'});ohAcc+=dt;return true;};
DRAW.ohm=()=>{const g=$('cvOc').getContext('2d');g.fillStyle=C.panel;g.fillRect(0,0,WO,HO);lay(OH.c,WO,HO,44,120);drawCirc(g,OH.c,{mode:'c',showR:false});drawGraph($('cvOg').getContext('2d'),WG,HG);if(ohAcc>.2){ohAcc=0;ohResults();}};
