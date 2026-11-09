
// =====================================================================
// 2 接觸起電與感應起電
// =====================================================================
const ID={set:'one',rodS:-1,rodQ:10,rx:.12,ry:.45,gnd:false,parts:[],touch:null,flow:0,flowDir:0,t:0,step:0,bits:[]};let WI=600,HI=320;
const KAP=.75,NP=12;
function idInit(){const s=ID.set;ID.rodQ=10;ID.rx=.08;ID.ry=s==='scope'?.32:.5;ID.gnd=false;ID.touch=null;ID.step=0;ID.flow=0;
  const R=()=>idR();
  if(s==='one')ID.parts=[{n:'金屬球',x:.55,y:.5,Q:0}];
  else if(s==='two')ID.parts=[{n:'甲',x:.5,y:.5,Q:0},{n:'乙',x:null,y:.5,Q:0}];
  else if(s==='three')ID.parts=[{n:'A',x:.42,y:.5,Q:0},{n:'B',x:null,y:.5,Q:0},{n:'C',x:null,y:.5,Q:0}];
  else if(s==='scope')ID.parts=[{n:'金屬球',x:.5,y:.32,Q:0,knob:true},{n:'金屬箔',x:.5,y:.74,Q:0,leaf:true}];
  else ID.parts=[];
  ID.bits=[];for(let i=0;i<6;i++)ID.bits.push({x:.5+i*.07,lift:0});}
function idR(){return Math.min(WI,HI)*.13;}
function idPx(p,i){const R=idR();if(p.x===null){const prev=ID.parts[i-1];p.x=(idPx(prev,i-1).x+2*R)/WI;}return {x:p.x*WI,y:p.y*HI};}
function rodTip(){return {x:ID.rx*WI,y:ID.ry*HI};}
function groups(){const n=ID.parts.length,par=[...Array(n).keys()],f=i=>par[i]===i?i:(par[i]=f(par[i]));const R=idR();
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const a=ID.parts[i],b=ID.parts[j];const linked=(a.knob&&b.leaf)||(b.knob&&a.leaf)||(!a.knob&&!a.leaf&&!b.knob&&!b.leaf&&Math.abs(idPx(a,i).x-idPx(b,j).x)<=2*R+3);if(linked)par[f(i)]=f(j);}
  const G={};for(let i=0;i<n;i++){const r=f(i);(G[r]=G[r]||[]).push(i);}return Object.values(G);}
function gndIndex(){if(ID.set==='scope')return 0;let best=0;ID.parts.forEach((p,i)=>{if(idPx(p,i).x>idPx(ID.parts[best],best).x)best=i;});return best;}
function sInf(i){const p=ID.parts[i],P=idPx(p,i),T=rodTip(),R=idR();const d=Math.hypot(P.x-T.x,P.y-T.y);const f=d<=R?1:1/(1+((d-R)/(3*R))**2);return ID.rodS*ID.rodQ*f*(p.leaf?.2:1);}
function idSolve(dt){const gs=groups(),gi=gndIndex();
  // 接觸起電
  const T=rodTip(),R=idR();let touching=null;ID.parts.forEach((p,i)=>{if(p.leaf)return;const P=idPx(p,i);if(Math.hypot(P.x-T.x,P.y-T.y)<R+6)touching=i;});
  if(touching!==null&&ID.touch===null&&ID.rodQ>0){const d=Math.max(1,Math.round(ID.rodQ*.3));ID.parts[touching].Q+=ID.rodS*d;ID.rodQ-=d;ID.touch=touching;}
  if(touching===null)ID.touch=null;
  gs.forEach(G=>{const grounded=ID.gnd&&G.includes(gi);const s=G.map(sInf),ms=s.reduce((a,b)=>a+b,0)/G.length;
    const before=G.reduce((a,i)=>a+ID.parts[i].Q,0);
    if(grounded){G.forEach((i,k)=>{ID.parts[i].Q=-KAP*s[k];});const after=G.reduce((a,i)=>a+ID.parts[i].Q,0);const dq=after-before;if(Math.abs(dq)>.05){ID.flow=1.4;ID.flowDir=dq>0?1:-1;}}
    else{G.forEach((i,k)=>{ID.parts[i].Q=before/G.length+1.2*(ms-s[k]);});}});
  if(ID.flow>0)ID.flow-=dt;}
function metalBall(g,x,y,R){const gr=g.createRadialGradient(x-R*.35,y-R*.35,R*.1,x,y,R);gr.addColorStop(0,'#fff');gr.addColorStop(.35,CC.metal);gr.addColorStop(1,CC.metal2);g.fillStyle=gr;g.beginPath();g.arc(x,y,R,0,TAU);g.fill();}
function chargesOn(g,x,y,R,Q,i){const T=rodTip();const th=Math.atan2(T.y-y,T.x-x);const s=sInf(i);const b=clamp(Math.abs(s)/12,0,.85);const toward=s>0;// 正電棒吸引電子
  for(let k=0;k<NP;k++){const a=k/NP*TAU+.26;sym(g,x+Math.cos(a)*R*.42,y+Math.sin(a)*R*.42,1,4.5);}
  const E=Math.max(0,NP-Math.round(Q));const c0=toward?th:th+Math.PI;
  for(let k=0;k<E;k++){const u=((k+.5)/E)*TAU-Math.PI;const a=c0+u*(1-b*.8)+Math.PI*(1-1)+0;const aa=b<.05?(k+.5)/E*TAU:a;sym(g,x+Math.cos(aa)*R*.8,y+Math.sin(aa)*R*.8,-1,4.5);}}
function drawStand(g,x,y,R,H){g.fillStyle='#6b5a49';g.fillRect(x-4,y+R,8,H*.86-y-R);g.fillRect(x-26,H*.86,52,8);}
function drawInd(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const R=idR();line(g,0,H*.86+8,W,H*.86+8,C.line,2);
  if(ID.set==='paper'){drawPaper(g,W,H);drawRod(g,W,H);return;}
  if(ID.set==='scope'){const k=idPx(ID.parts[0],0),l=idPx(ID.parts[1],1);// 玻璃瓶
    g.strokeStyle=C.muted;g.lineWidth=2;g.strokeRect(k.x-R*1.6,k.y+R*1.1,R*3.2,l.y-k.y+R*.8);line(g,k.x,k.y+R,k.x,l.y-6,CC.metal2,6);
    const ang=Math.min(1,Math.max(0,Math.abs(ID.parts[1].Q)-.6)/3.5)*.55;[-1,1].forEach(s=>{g.save();g.translate(l.x,l.y-6);g.rotate(s*ang);g.fillStyle='#d8c27a';g.fillRect(-3,0,6,R*1.1);
      const q=ID.parts[1].Q/2;for(let m=0;m<Math.min(4,Math.round(Math.abs(q)));m++)sym(g,0,R*.25+m*R*.22,Math.sign(q),3.5);g.restore();});
    metalBall(g,k.x,k.y,R);chargesOn(g,k.x,k.y,R,ID.parts[0].Q,0);text(g,'驗電器　'+qStr(Math.round(ID.parts[0].Q+ID.parts[1].Q)),k.x,k.y-R-10,{size:13,bold:true,align:'center'});
    text(g,ang>.1?'金屬箔張開':'金屬箔閉合',l.x+R*1.8,l.y,{size:12,bold:true,col:ang>.1?C.accent:C.muted});}
  else ID.parts.forEach((p,i)=>{const P=idPx(p,i);drawStand(g,P.x,P.y,R,H);metalBall(g,P.x,P.y,R);chargesOn(g,P.x,P.y,R,p.Q,i);
    const q=Math.round(p.Q);text(g,p.n+'　'+qStr(q),P.x,P.y-R-10,{size:14,bold:true,align:'center',col:q>0?CC.pos:q<0?CC.neg:C.ink});if(ID.parts.length>1)handle(g,P.x,P.y+R+14,7);});
  // 接地
  if(ID.gnd){const gi=gndIndex(),P=idPx(ID.parts[gi],gi);const hx=P.x+R*.9,hy=P.y+R*.2;g.fillStyle='#e8b98f';g.beginPath();g.ellipse(hx+18,hy+6,20,10,.3,0,TAU);g.fill();
    g.strokeStyle=C.ink;g.lineWidth=2;g.beginPath();g.moveTo(hx+34,hy+12);g.lineTo(hx+60,H*.86-10);g.stroke();for(let k=0;k<3;k++)line(g,hx+50+k*4,H*.86-10+k*5,hx+70-k*4,H*.86-10+k*5,C.ink,2);
    text(g,'接地（人體連到大地）',hx+64,hy-8,{size:12,col:C.muted});
    if(ID.flow>0){const u=(ID.t*1.8)%1;for(let k=0;k<4;k++){const f=(u+k/4)%1,ff=ID.flowDir>0?f:1-f;// flowDir>0：電荷增加 → 電子流出到地面
        const x=lerp(hx+34,hx+60,ID.flowDir>0?f:1-f),y=lerp(hy+12,H*.86-10,ID.flowDir>0?f:1-f);sym(g,x,y,-1,4);}
      text(g,ID.flowDir>0?'電子由球流向地面 ↓':'電子由地面流入球 ↑',hx+64,hy+10,{size:12,bold:true,col:C.accent});}}
  drawRod(g,W,H);}
function drawRod(g,W,H){const T=rodTip(),L=Math.min(W*.32,260);g.fillStyle=ID.rodS>0?'#bcd8e6':'#3b5f8a';g.fillRect(T.x-L,T.y-9,L,18);g.strokeStyle='rgba(0,0,0,.3)';g.strokeRect(T.x-L,T.y-9,L,18);
  const n=Math.round(ID.rodQ);for(let k=0;k<Math.min(n,12);k++)sym(g,T.x-10-k*((L-30)/12),T.y,ID.rodS,4.5);
  text(g,(ID.rodS>0?'帶正電的玻璃棒':'帶負電的塑膠尺')+'（'+qStr(ID.rodS*n)+'）',Math.max(8,T.x-L),T.y-16,{size:12,bold:true});handle(g,T.x-L*.5,T.y,9);}
function drawPaper(g,W,H){const T=rodTip(),tbl=H*.86;ID.bits.forEach((b,i)=>{const x=b.x*W,y=tbl-6-b.lift;const th=Math.atan2(T.y-y,T.x-x);const near=Math.hypot(T.x-x,T.y-y);const pol=clamp(ID.rodQ*14/Math.max(near,30),0,1);
    g.save();g.translate(x,y);g.fillStyle='#f3efe4';g.strokeStyle='#999';g.fillRect(-14,-8,28,16);g.strokeRect(-14,-8,28,16);
    const dx=Math.cos(th)*5*pol,dy=Math.sin(th)*3*pol;const sgn=ID.rodS;// 正電棒：負電端朝向棒子
    [-7,7].forEach(ox=>{sym(g,ox+dx*-sgn,dy*-sgn,1,3);sym(g,ox+dx*sgn,dy*sgn,-1,3);});g.restore();});
  text(g,'絕緣體的分子：正、負電只稍微偏移（極化），電子不會跑走',W*.5,H*.95,{size:12,col:C.muted,align:'center'});}
function idUI(){segSet($('idSet'),ID.set);segSet($('idRod'),String(ID.rodS));$('idGnd').textContent=ID.gnd?'✋ 移開手指':'✋ 用手指接觸（接地）';$('idGnd').hidden=ID.set==='paper';
  const ST={one:[['帶電棒靠近（不接觸）',()=>{ID.rx=(idPx(ID.parts[0],0).x-idR()*1.6)/WI;}],['手指接觸（接地）',()=>{ID.gnd=true;}],['移開手指',()=>{ID.gnd=false;}],['移開帶電棒',()=>{ID.rx=-.3;}],['接觸起電：帶電棒碰一下球',()=>{ID.rx=(idPx(ID.parts[0],0).x-idR()+2)/WI;setTimeout(()=>{ID.rx=.08;kick();},700);}]],
    two:[['帶電棒靠近甲（甲乙接觸）',()=>{ID.rx=(idPx(ID.parts[0],0).x-idR()*1.6)/WI;}],['把乙移開',()=>{const p=ID.parts[1];p.x=(idPx(p,1).x+idR()*1.6)/WI;}],['移開帶電棒',()=>{ID.rx=-.3;}],['甲乙再接觸',()=>{ID.parts[1].x=(idPx(ID.parts[0],0).x+2*idR())/WI;}]],
    three:[['帶電棒靠近 A',()=>{ID.rx=(idPx(ID.parts[0],0).x-idR()*1.6)/WI;}],['移開 C',()=>{const p=ID.parts[2];p.x=(idPx(p,2).x+idR()*1.4)/WI;}],['移開 B',()=>{const p=ID.parts[1],c=ID.parts[2];p.x=(idPx(p,1).x+idR()*.9)/WI;c.x=Math.max(c.x,p.x+2.6*idR()/WI);}],['移開帶電棒',()=>{ID.rx=-.3;}]],
    scope:[['帶電棒靠近金屬球（不接觸）',()=>{ID.rx=(idPx(ID.parts[0],0).x-idR()*1.7)/WI;ID.ry=ID.parts[0].y;}],['手指接觸（接地）',()=>{ID.gnd=true;}],['移開手指',()=>{ID.gnd=false;}],['移開帶電棒',()=>{ID.rx=-.3;}],['接觸起電：碰一下金屬球',()=>{ID.rx=(idPx(ID.parts[0],0).x-idR()+2)/WI;ID.ry=ID.parts[0].y;setTimeout(()=>{ID.rx=.08;kick();},700);}]],
    paper:[['帶電棒靠近紙片',()=>{ID.rx=.46;ID.ry=.62;}],['移開帶電棒',()=>{ID.rx=-.3;}]]}[ID.set];
  const box=$('idSteps');box.innerHTML='';ST.forEach(([n,fn],k)=>{const b=document.createElement('button');b.className='chip';b.textContent=(k<4&&!n.startsWith('接觸')?('①②③④'[k]+' '):'')+n;b.addEventListener('click',()=>{fn();idUI();kick();});box.appendChild(b);});
  $('idHint').textContent=ID.set==='paper'?'拖曳帶電棒靠近小紙片。':'拖曳帶電棒（橘點）靠近或碰觸金屬'+(ID.parts.length>1?'；拖曳球下方的橘點可以把球分開或靠在一起':'')+'。也可以按「步驟」一步一步做。';
  howList('idHow',ID.set==='paper'?['絕緣體裡的電子不能自由移動，但帶電體靠近時，分子內的正、負電會稍微偏移（極化）。','靠近帶電體的一端是異性電，吸引力大於另一端的排斥力，所以小紙片被吸過來。','帶電體靠近不帶電的物體一定是互相吸引。']:
    ['金屬是導體，裡面有可以自由移動的電子（藍色 −）；質子（紅色 ＋）固定不動。','靜電感應：帶電棒靠近時，電子被吸過來或推開，金屬兩端帶異性電，但總電量不變；棒子移開就恢復。','感應起電：帶電棒靠近→手指接地→先移開手指→再移開帶電棒。金屬最後帶的電和棒子相反。','接觸起電：帶電棒碰觸金屬，電荷分一些給金屬，兩者帶同性電。','驗電器：帶電體靠近或接觸金屬球，下面的金屬箔帶同性電而張開。']);}
segOn($('idSet'),v=>{ID.set=v;hideStory();idInit();idUI();kick();});
segOn($('idRod'),v=>{ID.rodS=+v;ID.rodQ=10;idUI();kick();});
$('idGnd').addEventListener('click',()=>{ID.gnd=!ID.gnd;idUI();kick();});
$('idAway').addEventListener('click',()=>{ID.rx=-.3;kick();});
$('idReset').addEventListener('click',()=>{idInit();idUI();kick();});
dragger($('cvId'),()=>{const T=rodTip(),L=Math.min(WI*.32,260);const hs=[{x:T.x-L*.5,y:T.y,r:30,hit:(x,y)=>x>T.x-L&&x<T.x+4&&Math.abs(y-T.y)<16?0:99,move:(x,y)=>{ID.rx=clamp((x+L*.5)/WI,-.3,.95);ID.ry=clamp(y/HI,.15,.8);}}];
  if(ID.parts.length>1&&ID.set!=='scope'){const R=idR();ID.parts.forEach((p,i)=>{const P=idPx(p,i);hs.push({x:P.x,y:P.y+R+14,r:22,move:x=>{let nx=x;// 不可重疊
      if(i>0)nx=Math.max(nx,idPx(ID.parts[i-1],i-1).x+2*R);if(i<ID.parts.length-1)nx=Math.min(nx,idPx(ID.parts[i+1],i+1).x-2*R);p.x=clamp(nx,R+40,WI-R-10)/WI;}});});}
  return hs;},()=>kick());
$('cvId').style.touchAction='none';
function idResults(){let big='',f='',ck=[];const Qs=ID.parts.map(p=>Math.round(p.Q));
  if(ID.set==='paper'){const T=rodTip();big=T.x>0?'帶電棒靠近：小紙片被吸引':'帶電棒移開';f='絕緣體不能感應起電（電子不能流動），但會極化而被吸引';ck=[['info','絕緣體適合摩擦起電；導體適合接觸起電、感應起電。']];}
  else{big=ID.set==='scope'?`驗電器帶 ${qStr(Qs[0]+Qs[1])}，金屬箔${Math.abs(ID.parts[1].Q)>.8?'張開':'閉合'}`:ID.parts.map((p,i)=>`${p.n} ${qStr(Qs[i])}`).join('、');
    const T=rodTip(),near=T.x>0;f=`帶電棒：${qStr(ID.rodS*Math.round(ID.rodQ))}　${near?'在旁邊':'已移開'}　${ID.gnd?'接地中':'沒有接地'}<br>導體總電量：${qStr(Qs.reduce((a,b)=>a+b,0))}`;
    ck=[['info','靜電感應時，金屬上的電量總和不變，只是電子位置改變。'],['info','接地時，電子可以在金屬和大地之間流動，所以金屬的總電量會改變。'],['info','感應起電：金屬最後帶的電和帶電棒相反；接觸起電：和帶電棒相同。']];}
  $('idBig').textContent=big;$('idF').innerHTML=f;checks($('idC'),ck);}
SIZE.ind=()=>{({W:WI,H:HI}=fit($('cvId'),.44,300,440));};
UI.ind=()=>{if(!ID.parts.length&&ID.set!=='paper')idInit();idUI();};
TICK.ind=dt=>{ID.t+=dt;idSolve(dt);if(ID.set==='paper'){const T=rodTip();ID.bits.forEach(b=>{const x=b.x*WI,y=HI*.86-6-b.lift;const d=Math.hypot(T.x-x,T.y-y);const tgt=T.x>0&&d<110&&ID.rodQ>0?Math.max(0,HI*.86-6-(T.y+14)):0;b.lift+=(tgt-b.lift)*Math.min(1,dt*5);});}return true;};
let idLast='';DRAW.ind=()=>{drawInd($('cvId').getContext('2d'),WI,HI);const k=ID.parts.map(p=>Math.round(p.Q)).join()+ID.gnd+(ID.rx>0)+ID.rodQ+ID.set+(ID.parts[1]?Math.abs(ID.parts[1].Q)>.8:'');if(k!==idLast){idLast=k;idResults();}};
idInit();
