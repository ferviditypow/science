
// ================= 拖曳 =================
const _rABC=rangeABC;
rangeABC=function(M){if(E.frz)return E.frz;if(E.mode==='wall'){const nice=[5,10,20,30,50,100,200,300,400,600,1000,2000];const dm=nice.find(n=>n>=M.d*1.12)||M.d*1.12;return [-dm*.16,dm*1.04];}return _rABC(M);};
function showEnd(){E.run=false;E.real=false;E.t=model().tmax;playTxt($('playE'),false);}
dragger($('cvA'),()=>{const M=model(),m=E.mode,W=W1,H=H1;
  if(m==='wall'&&E.A.giv==='d'){const mp=xmap(W,...rangeABC(M)),G=H*.72,top=H*.1;return [{x:mp.X(M.d)+11,y:G-(G-top)/2,r:30,start:()=>{E.frz=rangeABC(M);},
    move:x=>{const mq=xmap(W,...E.frz);E.A.d=clamp(Math.round(mq.inv(x-11)*2)/2,1,400);$('dA').value=E.A.d;outs();showEnd();}}];}
  if(m==='cliff'&&E.B.giv==='d'){const mp=xmap(W,...rangeABC(M)),G=H*.72;return [{x:mp.X(M.s),y:G-20,r:34,
    move:x=>{const L=M.L;const d1=clamp(Math.round(mp.inv(x)/5)*5,10,L-10);E.B.d1=d1;E.B.d2=L-d1;$('d1B').value=d1;$('d2B').value=E.B.d2;outs();showEnd();}}];}
  if(m==='map'&&!E.M.hide){const Gm=geoM(W,H);return M.ts.map((t,j)=>({x:Gm.xs(j),y:Gm.yd(t),r:22,move:(x,y)=>{E.M.ts[j]=clamp(Math.round((y-Gm.ys-18)/(H-Gm.ys-30)*TSC),1,32);E.t=model().tmax;E.run=false;playTxt($('playE'),false);}}));}
  if(m==='law'){const G=geoF(W,H),T2=tubeAt(G,E.F.ang,1);return [{x:T2.b[0],y:T2.b[1],r:30,move:(x,y)=>{E.F.ang=clamp(Math.round(Math.atan2(x-G.cx,y-G.py)/D2R),5,80);segSet($('posF'),String(E.F.ang));}}];}
  return [];},()=>kick());
$('cvA').addEventListener('pointerup',()=>{if(E.frz){E.frz=null;kick();}});
$('cvA').style.touchAction='none';

SIZE.echo=sizeEcho;UI.echo=()=>{syncUI();showHow();lastRes='';};
TICK.echo=dt=>{if(!E.run)return false;const M=model();
  if(E.mode==='law'){E.t+=dt*SPDF[E.spd-1]*.8;return true;}
  const rate=E.real?1:E.mode==='map'?1.1*SPDF[E.spd-1]:M.tmax/6*SPDF[E.spd-1];E.t+=dt*rate;
  if(E.t>=M.tmax){E.t=M.tmax;E.run=false;E.real=false;playTxt($('playE'),false);}return E.run;};
DRAW.echo=()=>{const M=model(),m=E.mode,g=$('cvA').getContext('2d');g.clearRect(0,0,W1,H1);
  if(m==='wall')drawA(g,W1,H1,M);else if(m==='cliff')drawB(g,W1,H1,M);else if(m==='move')drawC(g,W1,H1,M);else if(m==='depth')drawD(g,W1,H1,M);else if(m==='map')drawM(g,W1,H1,M);else drawF(g,W1,H1);
  if(!$('cvXw').hidden){const gx=$('cvX').getContext('2d');if(m==='depth')drawDT(gx,WX,HX,M);else if(m==='map')drawMT(gx,WX,HX,M);else drawXT(gx,WX,HX,M);}
  if(!$('cvEw').hidden)drawEar($('cvE').getContext('2d'),WE,HE,M);
  if(m!=='law'){$('tE').value=Math.round(E.t/M.tmax*1000);$('tEo').textContent=m==='map'?'第 '+(clamp(Math.floor(E.t/PM),0,NM-1)+1)+' 站':fmtT(E.t)+' / '+fmtT(M.tmax);}
  showResults(M);};

