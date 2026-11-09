
// ================= 狀態 =================
function readMore(){const s=getComputedStyle(document.documentElement);['snd','echo','cliff','sea','sky'].forEach(k=>C[k]=s.getPropertyValue('--'+k).trim());}
readMore();
const vAir=T=>331+0.6*T;
const E={mode:'wall',t:0,run:true,spd:3,med:'air',T:15,vc:340,real:false,
  A:{giv:'d',d:34,tt:.2,mat:'hard'},
  B:{giv:'t',t1:2,dt:1,d1:340,d2:510},
  C:{veh:'ship',dir:'to',giv:'t',tt:4,D:680,u:10,re:0},
  D:{sc:'well',giv:'t',tt:.2,h:34,h0:68,T:15},
  M:{ts:[30,15,28,5,5],hide:false},
  F:{ang:40,mat:'iron'}};
const RMAT={hard:.85,cloth:.3,foam:.1};
const MATN={hard:'光滑堅硬',cloth:'布幔、地毯',foam:'多孔吸音板'};
const RF={iron:.9,wood:.7,cotton:.25,sponge:.1,none:0};
const RFN={iron:'鐵板',wood:'木板',cotton:'棉布',sponge:'海綿',none:'沒有反射板'};
function vS(){return E.med==='air'?vAir(E.T):E.med==='water'?1500:E.vc;}
const fmtT=t=>{const a=Math.abs(t);if(a===0)return '0 s';if(a<1e-3)return (Math.round(t*1e7)/10)+' µs';if(a<.01)return (Math.round(t*1e4)/10)+' ms';if(a<.1)return t.toFixed(3)+' s';if(a<10)return f2(t)+' s';return f1(t)+' s';};
const fmtS=t=>{const a=Math.abs(t);if(a<1e-3)return (Math.round(t*1e8)/100)+' 微秒';if(a<10)return (Math.round(t*1000)/1000).toString().replace(/\.?0+$/,'')+' 秒';return f1(t)+' 秒';};
const nf=(x,dp=2)=>{const r=Math.round(x*10**dp)/10**dp;return r.toString();};
const fmtM=m=>{const a=Math.abs(m);if(a<1)return nf(m*100,1)+' cm';if(a<100)return nf(m,2)+' m';return nf(m,1)+' m';};

// ---------- 各情境的模型 ----------
function mA(){const v=vS(),A=E.A;const d=A.giv==='d'?A.d:v*A.tt/2;const te=2*d/v;const r=RMAT[A.mat];
  return {v,d,te,r,tmax:Math.max(te*1.25,.3),hear:[{t:0,a:1,lab:'原聲'},{t:te,a:r,lab:'回聲'}]};}
const WN=['甲','乙'];
function mB(){const v=vS(),B=E.B;let d1,d2;if(B.giv==='t'){d1=v*B.t1/2;d2=v*(B.t1+B.dt)/2;}else{d1=B.d1;d2=B.d2;}
  const L=d1+d2,s=d1,r=.8;const imgs=[];
  for(const first of [0,1])for(let n=1;n<=4;n++){let p=s;const seq=[];for(let k=0;k<n;k++){const w=(first+k)%2;seq.push(w);p=w===0?-p:2*L-p;}
    imgs.push({p,n,seq,t:Math.abs(p-s)/v,a:Math.pow(r,n)});}
  imgs.sort((a,b)=>a.t-b.t);const arr=[];
  for(const im of imgs){const g=arr.find(x=>Math.abs(x.t-im.t)<1e-7*(1+im.t));if(g){g.ims.push(im);g.a=Math.min(1,g.a+im.a);}else arr.push({t:im.t,ims:[im],a:im.a});}
  arr.forEach((g,i)=>{g.k=i+1;g.lab=g.ims.map(im=>im.seq.map(w=>WN[w]).join('→')).join('、');});
  const tmax=arr[Math.min(3,arr.length-1)].t*1.08;
  const hear=[{t:0,a:1,lab:'原聲'}].concat(arr.filter(g=>g.t<=tmax).map(g=>({t:g.t,a:g.a,lab:'第'+g.k+'聲'})));
  return {v,d1,d2,L,s,r,imgs,arr,tmax,hear};}
const VEH={ship:{n:'船',hn:'鳴笛',wall:'山壁'},train:{n:'火車',hn:'按喇叭',wall:'山壁'},dolphin:{n:'海豚',hn:'發出超聲波',wall:'池壁'}};
function mC(){const C=E.C,v=vS(),u=C.u,sg=C.dir==='to'?1:-1;const den=v+sg*u;
  let D,te;if(C.giv==='t'){te=C.tt;D=den*te/2;}else{D=C.D;te=2*D/den;}
  const tmax=(te+C.re)*1.12+1e-4;const xh=sg*u*te,xr=sg*u*(te+C.re);
  return {v,u,sg,D,te,re:C.re,tmax,xh,xr,hear:[{t:0,a:1,lab:VEH[C.veh].hn},{t:te,a:.8,lab:'回聲'}]};}
const SCD={
  well:{t:'深井',L:[{m:'空氣',v:'air'}],src:'person',dir:1,tR:[.02,10,.01],hR:[1,1700,.5],def:{giv:'t',tt:.2,h:34,T:15},hl:'井深'},
  sonar:{t:'聲納測海深',L:[{m:'海水',v:1500}],src:'ship',dir:1,tR:[.002,8,.002],hR:[1,6000,1],def:{giv:'t',tt:.04,h:30},hl:'海深'},
  heli:{t:'直升機→潛艇',L:[{m:'空氣',v:340,fix:1},{m:'海水',v:1500}],src:'heli',dir:1,tR:[.05,3,.01],hR:[0,800,1],h0R:[5,300,1],def:{giv:'t',tt:.6,h0:68,h:150},hl:'潛艇在水面下',h0l:'直升機離水面'},
  sub:{t:'潛艇→直升機',L:[{m:'海水',v:1500,fix:1},{m:'空氣',v:300}],src:'sub',dir:-1,tR:[.05,4,.01],hR:[0,500,1],h0R:[10,600,1],def:{giv:'t',tt:1.2,h0:300,h:120},hl:'直升機在水面上',h0l:'潛艇在水面下'},
  spk:{t:'喇叭與半滿深井',L:[{m:'空氣',v:300},{m:'水',v:1500,eq:1}],src:'speaker',dir:1,tR:[.05,5,.01],hR:[1,600,1],def:{giv:'t',tt:2,h:250},hl:'水面以上的井'},
  metal:{t:'金屬探傷',L:[{m:'金屬',v:6000}],src:'probe',dir:1,tR:[1e-6,4e-5,1e-7],hR:[.003,.12,.001],def:{giv:'t',tt:1e-5,h:.03},hl:'裂縫深度'}};
function mD(){const D=E.D,S=SCD[D.sc];const vs=S.L.map(l=>l.v==='air'?vAir(D.T):l.v);
  let h=D.h,te,bad=false;const h0=S.L[0].fix?D.h0:0;
  const tOf=h=>S.L.length===1?2*h/vs[0]:S.L[0].fix?2*h0/vs[0]+2*h/vs[1]:2*h/vs[0]+2*h/vs[1];
  if(D.giv==='t'){te=D.tt;
    if(S.L.length===1)h=vs[0]*te/2;else if(S.L[0].fix){h=(te-2*h0/vs[0])*vs[1]/2;if(h<0){bad=true;h=0;}}else h=te/(2/vs[0]+2/vs[1]);}
  else te=tOf(h);
  const th=S.L.length===1?[h]:S.L[0].fix?[h0,h]:[h,h];
  const seg=th.map((x,i)=>x/vs[i]);
  return {S,vs,h,h0,th,seg,te,bad,tmax:te*1.1+1e-9,hear:[{t:0,a:1,lab:'發出'},{t:te,a:.75,lab:'回聲'}]};}
const NM=5,PM=2.4;
function mM(){const ts=E.M.ts;return {ts,tmax:NM*PM+.6,tsc:Math.max(10,...ts)*1.12};}
function model(){return E.mode==='wall'?mA():E.mode==='cliff'?mB():E.mode==='move'?mC():E.mode==='depth'?mD():E.mode==='map'?mM():{tmax:1e9};}

// ================= 控制項 =================
const SPDF=[.25,.5,1,2,4],SPDN=['×¼','×½','×1','×2','×4'];
function syncVel(){segSet($('medE'),E.med);$('TEw').hidden=E.med!=='air';$('vEw').hidden=E.med!=='cus';
  $('TE').value=E.T;$('TEo').textContent=E.T+' °C（'+nf(vAir(E.T),1)+' m/s）';$('vE').value=E.vc;$('vEo').textContent=E.vc+' m/s';}
function syncUI(){const m=E.mode;segSet($('modeE'),m);
  document.querySelectorAll('.mctl').forEach(el=>el.hidden=el.dataset.m!==m);
  $('velE').hidden=!['wall','cliff','move'].includes(m);syncVel();
  $('sndE').hidden=['map','law'].includes(m);
  $('tE').closest('label').hidden=m==='law';$('rstE').hidden=m==='law';
  $('cvXw').hidden=m==='law';$('cvEw').hidden=!['wall','cliff','move','depth'].includes(m);
  const A=E.A;segSet($('givA'),A.giv);segSet($('matA'),A.mat);$('dAw').hidden=A.giv!=='d';$('tAw').hidden=A.giv!=='t';
  $('dA').value=A.d;$('tA').value=A.tt;
  const B=E.B;segSet($('givB'),B.giv);document.querySelectorAll('#b-echo .bt').forEach(e=>e.hidden=B.giv!=='t');document.querySelectorAll('#b-echo .bd').forEach(e=>e.hidden=B.giv!=='d');
  $('t1B').value=B.t1;$('dtB').value=B.dt;$('d1B').value=B.d1;$('d2B').value=B.d2;
  const Cc=E.C;segSet($('vehC'),Cc.veh);segSet($('dirC'),Cc.dir);segSet($('givC'),Cc.giv);$('tCw').hidden=Cc.giv!=='t';$('dCw').hidden=Cc.giv!=='d';
  $('tC').value=Cc.tt;$('dC').value=Cc.D;$('uC').value=Cc.u;$('rC').value=Cc.re;
  const D=E.D,S=SCD[D.sc];segSet($('scD'),D.sc);segSet($('givD'),D.giv);
  const tD=$('tD');[tD.min,tD.max,tD.step]=S.tR;tD.value=D.tt;const hD=$('hD');[hD.min,hD.max,hD.step]=S.hR;hD.value=D.h;
  $('tDw').hidden=D.giv!=='t';$('hDw').hidden=D.giv!=='h';$('hDl').textContent=S.hl;
  $('h0Dw').hidden=!S.L[0].fix;if(S.h0R){const h0=$('h0D');[h0.min,h0.max,h0.step]=S.h0R;h0.value=D.h0;$('h0Dl').textContent=S.h0l;}
  $('TDw').hidden=!S.L.some(l=>l.v==='air');$('TD').value=D.T;
  segSet($('posF'),String(E.F.ang));segSet($('matF'),E.F.mat);$('hideM').checked=E.M.hide;
  outs();}
function outs(){const A=E.A,B=E.B,Cc=E.C,D=E.D,S=SCD[D.sc];
  $('dAo').textContent=nf(A.d,1)+' m';$('tAo').textContent=fmtT(A.tt);
  $('t1Bo').textContent=f1(B.t1)+' s';$('dtBo').textContent=f1(B.dt)+' s';$('d1Bo').textContent=B.d1+' m';$('d2Bo').textContent=B.d2+' m';
  $('tCo').textContent=f1(Cc.tt)+' s';$('dCo').textContent=nf(Cc.D,2)+' m';$('uCo').textContent=Cc.u+' m/s';$('rCo').textContent=f2(Cc.re)+' s';
  $('tDo').textContent=fmtT(D.tt);$('hDo').textContent=fmtM(D.h);$('h0Do').textContent=fmtM(D.h0);$('TDo').textContent=D.T+' °C（'+nf(vAir(D.T),1)+' m/s）';
  $('spdEo').textContent=SPDN[E.spd-1];}
function restart(){E.t=0;E.run=true;E.real=false;playTxt($('playE'),true);kick();}
function changed(){outs();restart();}
segOn($('modeE'),v=>{E.mode=v;hideStory();syncUI();SIZE.echo();restart();});
$('playE').addEventListener('click',()=>{const M=model();if(!E.run&&E.t>=M.tmax-1e-12)E.t=0;E.run=!E.run;E.real=false;playTxt($('playE'),E.run);kick();});
$('rstE').addEventListener('click',restart);
$('tE').addEventListener('input',()=>{const M=model();E.t=+$('tE').value/1000*M.tmax;E.run=false;E.real=false;playTxt($('playE'),false);kick();});
$('spdE').addEventListener('input',()=>{E.spd=+$('spdE').value;outs();});
segOn($('medE'),v=>{E.med=v;syncVel();restart();});
$('TE').addEventListener('input',()=>{E.T=+$('TE').value;syncVel();restart();});
$('vE').addEventListener('input',()=>{E.vc=+$('vE').value;syncVel();restart();});
segOn($('givA'),v=>{const M=mA();E.A.giv=v;if(v==='t')E.A.tt=+M.te.toFixed(2);else E.A.d=Math.round(M.d*2)/2;syncUI();restart();});
segOn($('matA'),v=>{E.A.mat=v;syncUI();restart();});
$('dA').addEventListener('input',()=>{E.A.d=+$('dA').value;changed();});
$('tA').addEventListener('input',()=>{E.A.tt=+$('tA').value;changed();});
segOn($('givB'),v=>{const M=mB();E.B.giv=v;if(v==='d'){E.B.d1=Math.round(M.d1/5)*5;E.B.d2=Math.round(M.d2/5)*5;}else{E.B.t1=+(2*M.d1/M.v).toFixed(1);E.B.dt=+(2*(M.d2-M.d1)/M.v).toFixed(1);if(E.B.dt<0){E.B.dt=0;}}syncUI();restart();});
[['t1B','t1'],['dtB','dt'],['d1B','d1'],['d2B','d2']].forEach(([id,k])=>$(id).addEventListener('input',()=>{E.B[k]=+$(id).value;changed();}));
segOn($('vehC'),v=>{E.C.veh=v;E.med=v==='dolphin'?'water':'air';syncUI();restart();});
segOn($('dirC'),v=>{E.C.dir=v;syncUI();restart();});
segOn($('givC'),v=>{const M=mC();E.C.giv=v;if(v==='d')E.C.D=Math.round(M.D);else E.C.tt=+M.te.toFixed(1);syncUI();restart();});
[['tC','tt'],['dC','D'],['uC','u'],['rC','re']].forEach(([id,k])=>$(id).addEventListener('input',()=>{E.C[k]=+$(id).value;changed();}));
segOn($('scD'),v=>{E.D.sc=v;Object.assign(E.D,SCD[v].def);syncUI();restart();});
segOn($('givD'),v=>{const M=mD();E.D.giv=v;if(v==='h')E.D.h=M.h;else E.D.tt=M.te;syncUI();restart();});
[['tD','tt'],['hD','h'],['h0D','h0'],['TD','T']].forEach(([id,k])=>$(id).addEventListener('input',()=>{E.D[k]=+$(id).value;changed();}));
$('hideM').addEventListener('change',()=>{E.M.hide=$('hideM').checked;kick();});
segOn($('posF'),v=>{E.F.ang=+v;syncUI();kick();});
segOn($('matF'),v=>{E.F.mat=v;syncUI();kick();});
const PREM=[{n:'講義 p.112',ts:[30,15,28,5,5]},{n:'向上 114 #27',ts:[8,15,8,1,7]},{n:'平坦海底',ts:[10,10,10,10,10]},{n:'海溝',ts:[6,9,24,9,6]}];
{const box=$('preM');PREM.forEach((p,i)=>{const b=document.createElement('button');b.className='chip';b.textContent=p.n+'：'+p.ts.join('、');
  b.addEventListener('click',()=>{E.M.ts=p.ts.slice();restart();});box.appendChild(b);});}

// ---------- 用真實時間聽 ----------
let NB=null;
function clap(t0,gain){const s=AC.createBufferSource();s.buffer=NB;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=1400;f.Q.value=.9;
  const g=AC.createGain();g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(gain,t0+.004);g.gain.exponentialRampToValueAtTime(.0008,t0+.09);
  s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t0);s.stop(t0+.12);}
$('sndE').addEventListener('click',()=>{try{const AC=ac();if(!NB){NB=AC.createBuffer(1,AC.sampleRate*.15,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1);}
  const M=model();const t0=AC.currentTime+.08;(M.hear||[]).forEach(h=>{if(h.t<12)clap(t0+h.t,1.6*Math.max(.04,h.a));});
  E.t=0;E.run=true;E.real=true;playTxt($('playE'),true);kick();}catch(e){console.error(e);}});
