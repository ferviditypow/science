
// =====================================================================
// 2 電路編輯器（串聯與並聯）：所有元件、接點、端點、標籤都可以拖曳
// =====================================================================
const TP={
 one:{n:'一個燈泡',N:{A:[0,0],B:[2,0],C:[4,0],D:[4,2],E:[0,2]},E:[['bat','E','A'],['sw','A','B',{lab:'S'}],['L','B','C',{lab:1}],['amm','C','D',{lab:'A'}],['wire','D','E']]},
 ser2:{n:'兩個串聯',N:{A:[0,0],B:[1,0],C:[2,0],D:[3,0],E:[4,0],F:[4,2],G:[2,2],H:[0,2]},E:[['bat','H','A'],['amm','A','B',{lab:'A1'}],['L','B','C',{lab:1}],['amm','C','D',{lab:'A2'}],['L','D','E',{lab:2}],['amm','E','F',{lab:'A3'}],['wire','F','G'],['sw','G','H',{lab:'S',lp:'d'}]],kind:'ser'},
 ser3:{n:'三個串聯',N:{A:[0,0],B:[4/3,0],C:[8/3,0],D:[4,0],E:[4,2],F:[2,2],G:[0,2]},E:[['bat','G','A'],['L','A','B',{lab:1}],['L','B','C',{lab:2}],['L','C','D',{lab:3}],['amm','D','E',{lab:'A'}],['sw','E','F',{lab:'S',lp:'d'}],['wire','F','G']],kind:'ser'},
 ser4:{n:'四個串聯',N:{A:[0,0],B:[1,0],C:[2,0],D:[3,0],E:[4,0],F:[4,2],G:[0,2]},E:[['bat','G','A'],['L','A','B',{lab:1}],['L','B','C',{lab:2}],['L','C','D',{lab:3}],['L','D','E',{lab:4}],['sw','E','F',{lab:'S'}],['wire','F','G']],kind:'ser'},
 par2:{n:'兩個並聯',N:{A:[0,0],B:[1,0],C:[2,0],D:[3,0],E:[4,0],F:[2,1],G:[4,1],H:[4,2],I:[2,2],J:[0,2]},E:[['bat','J','A'],['amm','A','B',{lab:'A'}],['sw','B','C',{lab:'S'}],['sw','C','D',{lab:'S2'}],['wire','D','E'],['L','C','F',{lab:1}],['amm','F','I',{lab:'A1'}],['L','E','G',{lab:2}],['amm','G','H',{lab:'A2'}],['wire','H','I'],['wire','I','J']],kind:'par'},
 par3:{n:'三個並聯',N:{A:[0,0],B:[1,0],C:[2,0],D:[3,0],E:[4,0],F:[2,2],G:[3,2],H:[4,2],I:[1,2],J:[0,2]},E:[['bat','J','A'],['amm','A','B',{lab:'A'}],['wire','B','C'],['wire','C','D'],['wire','D','E'],['L','C','F',{lab:1}],['L','D','G',{lab:2}],['L','E','H',{lab:3}],['wire','H','G'],['wire','G','F'],['wire','F','I'],['sw','I','J',{lab:'S',lp:'d'}]],kind:'par'},
 mix:{n:'1 串（2∥3）',N:{A:[0,0],B:[1,0],C:[2,0],D:[3,0],E:[4,0],F:[3,2],G:[4,2],H:[1,2],I:[0,2]},E:[['bat','I','A'],['amm','A','B',{lab:'A'}],['L','B','C',{lab:1}],['wire','C','D'],['wire','D','E'],['L','D','F',{lab:2,lp:'l'}],['L','E','G',{lab:3}],['wire','G','F'],['wire','F','H'],['sw','H','I',{lab:'S',lp:'d'}]],kind:'mix'},
 spx:{n:'（1 串 2）∥3',N:{A:[0,0],B:[1,0],C:[2.5,0],D:[4,0],E:[1,1],F:[4,1],G:[4,2],H:[0,2]},E:[['bat','H','A'],['amm','A','B',{lab:'A'}],['L','B','C',{lab:1}],['L','C','D',{lab:2}],['wire','D','F'],['wire','B','E'],['L','E','F',{lab:3,lp:'d'}],['wire','F','G'],['sw','G','H',{lab:'S',lp:'d'}]],kind:'mix'},
 rheo:{n:'滑線變阻器',N:{A:[0,0],B:[1,0],C:[2,0],D:[3,0],E:[4,0],F:[4,2],G:[0,2],P:[1,-1],Q:[2,-1],R:[3,-1],S:[4,-1]},E:[['bat','G','A'],['wire','A','B'],['L','B','C',{lab:1,lp:'d'}],['wire','C','D'],['rheo','D','E',{lab:'Rv',lp:'d',R:10}],['amm','E','F',{lab:'A'}],['sw','F','G',{lab:'S',lp:'d'}],['wire','B','P'],['vm','P','Q',{lab:'V1'}],['wire','Q','C'],['wire','D','R'],['vm','R','S',{lab:'V2'}],['wire','S','E']],kind:'ser'},
 cells:{n:'電池串並聯'},blank:{n:'空白'}};
const DEF={bat:{E:3},bulb:{R:5,Vr:3,Pr:1.8},res:{R:5},rheo:{R:10},sw:{on:true},jump:{on:true},amm:{rng:5},vm:{rng:15},fuse:{Ir:1},wire:{}};
const TNAME={bat:'電池',bulb:'燈泡',res:'電阻器',rheo:'滑線變阻器',sw:'開關',jump:'跨接導線（弧形）',amm:'安培計',vm:'伏特計',fuse:'保險絲',wire:'導線'};
const PRE={bulb:'L',res:'R',amm:'A',vm:'V',sw:'S',rheo:'Rv',fuse:'F'};
const SP={tpl:'ser2',kind:'bulb',mode:'e',showV:false,showVI:true,cells:'s2',vm:false,vp:null,vn:null,letters:false,snap:true,hide:false,tool:'sel',
  sel:null,selN:null,N:{},E:[],z:44,ox:0,oy:0,c:null,hist:[],nid:0,eid:0,tp:null,tn:null,edited:false};let WS=900,HS=520;
const LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function newLab(){const used=new Set(Object.values(SP.N).map(n=>n.lab));for(let i=0;;i++){const s=i<26?LET[i]:LET[i%26]+Math.floor(i/26);if(!used.has(s))return s;}}
function addNode(x,y,lab){const id='n'+(++SP.nid);SP.N[id]={x,y,lab:lab||newLab()};return id;}
function autoName(t){const p=PRE[t];if(!p)return '';const used=new Set(SP.E.map(e=>e.lab));for(let i=1;;i++)if(!used.has(p+i))return p+i;}
function addEl(t,a,b,p={}){const e=Object.assign({id:'e'+(++SP.eid),t,a,b,ph:rnd(SP.eid)*30},JSON.parse(JSON.stringify(DEF[t]||{})),p);SP.E.push(e);return e;}
const idOf=lab=>Object.keys(SP.N).find(k=>SP.N[k].lab===lab);
const selEl=()=>SP.E.find(e=>e.id===SP.sel);
const TW=(x,y)=>{const c=Math.cos(SP.rot||0),s=Math.sin(SP.rot||0),X=x*SP.z,Y=y*SP.z;return[SP.ox+X*c-Y*s,SP.oy+X*s+Y*c];};
const scr=id=>TW(SP.N[id].x,SP.N[id].y);
const wxy=(x,y)=>{const c=Math.cos(SP.rot||0),s=Math.sin(SP.rot||0),dx=x-SP.ox,dy=y-SP.oy;return[(dx*c+dy*s)/SP.z,(-dx*s+dy*c)/SP.z];};
function setAnchor(wx,wy,x,y){const p=TW(wx,wy);SP.ox+=x-p[0];SP.oy+=y-p[1];}
const snapV=v=>SP.snap?Math.round(v):Math.round(v*4)/4;
const degN=id=>SP.E.filter(e=>e.a===id||e.b===id).length;
// ---------- 範本 ----------
function loadTpl(name){SP.tpl=name;SP.N={};SP.E=[];SP.sel=null;SP.selN=null;SP.tp=SP.tn=null;SP.hist=[];SP.edited=false;let N={},E=[];
  if(name==='cells'){N={A:[0,0],B:[2,0],C:[4,0],D:[4,2],Z:[0,2]};E=[['amm','A','B',{lab:'A'}],['L','B','C',{lab:1}],['wire','C','D'],['wire','D','Z']];
    const cell=(a,b,nm,lp)=>['bat',a,b,{E:1.5,nm,lp}];const m=SP.cells;
    if(m==='one')E.push(cell('Z','A','','l'));
    else if(m==='s2'||m==='r2'){N.M=[0,1];E.push(cell('Z','M','甲','l'));E.push(m==='s2'?cell('M','A','乙','l'):cell('A','M','乙（反接）','l'));}
    else if(m==='p2'){N.X=[-1,0];N.Y=[-1,2];E.push(cell('Z','A','甲','r'),['wire','A','X'],cell('Y','X','乙','l'),['wire','Y','Z']);}
    else{N.M=[0,1];N.X=[-1,1];N.Y=[-1,2];E.push(cell('Z','M','甲','r'),cell('Y','X','乙','l'),['wire','Z','Y'],['wire','M','X'],cell('M','A','丙','l'));}}
  else if(TP[name].N){N=TP[name].N;E=TP[name].E;}
  const map={};for(const k in N)map[k]=addNode(Math.round(N[k][0]*2*4)/4+2,N[k][1]*2+2,k);
  E.forEach(x=>{let [t,a,b,p]=x;p=Object.assign({},p||{});if(t==='L'){t=SP.kind;p.lab=(SP.kind==='bulb'?'L':'R')+p.lab;}addEl(t,map[a],map[b],p);});
  if(name==='cells'){SP.tp=map.A;SP.tn=map.Z;}else{const b=SP.E.find(e=>e.t==='bat');if(b){SP.tp=b.b;SP.tn=b.a;}}
  const ks=Object.keys(SP.N);SP.vp=ks[1]||null;SP.vn=ks[2]||null;edFit();edSolve();}
// ---------- 求解（含燒壞、熔斷） ----------
function edSync(){SP.E.forEach(e=>{if(e.t==='bat'){e.n=clamp(Math.round(e.E/1.5),1,5);e.lab=(e.nm?e.nm+' ':'')+nf(e.E,1)+' V';}
  if(e.t==='bulb'&&e.rate){e.R=e.Vr*e.Vr/Math.max(e.Pr,.01);e.Pref=e.Pr*.6;}else if(e.t==='bulb')e.Pref=0;});}
function edSolve(){edSync();const N={};for(const k in SP.N)N[k]=[SP.N[k].x,SP.N[k].y];const bat=SP.E.find(e=>e.t==='bat'&&!e.off);
  const old=SP.c;SP.c={N,E:SP.E,V:{},Iref:.6,Pref:1.2,gnd:bat?bat.a:undefined,P:old&&old.P,u:old&&old.u,s:old&&old.s,z:SP.z};
  if(!Object.keys(N).length){SP.c.P={};return;}
  for(let k=0;k<8;k++){solve(SP.c);let ch=false;
    for(const e of SP.E){if(e.broken)continue;
      if(e.t==='bulb'&&e.rate&&e.P>2*e.Pr){e.broken=true;ch=true;}
      if(e.t==='fuse'&&Math.abs(e.I)>e.Ir){e.broken=true;ch=true;}
      if(e.t==='amm'&&Math.abs(e.I)>Math.max(20,4*(e.rng||5))){e.broken=true;ch=true;}}
    if(!ch)break;}}
// ---------- 編輯動作 ----------
const snapState=()=>JSON.stringify({N:SP.N,E:SP.E.map(e=>{const o={};for(const k in e)if(!['I','dV','P','pt','M','L','nv','lbox','ph'].includes(k))o[k]=e[k];return o;}),nid:SP.nid,eid:SP.eid,tp:SP.tp,tn:SP.tn});
function pushHist(s){SP.hist.push(s||snapState());if(SP.hist.length>80)SP.hist.shift();SP.edited=true;}
function undo(){const s=SP.hist.pop();if(!s)return;const o=JSON.parse(s);SP.N=o.N;SP.E=o.E.map((e,i)=>Object.assign(e,{ph:rnd(i)*30}));SP.nid=o.nid;SP.eid=o.eid;SP.tp=o.tp;SP.tn=o.tn;
  if(!selEl())SP.sel=null;if(SP.selN&&!SP.N[SP.selN])SP.selN=null;edSolve();edPanel();kick();}
function cleanup(){SP.E=SP.E.filter(e=>e.a!==e.b&&SP.N[e.a]&&SP.N[e.b]);const used=new Set();SP.E.forEach(e=>{used.add(e.a);used.add(e.b);});
  for(const k in SP.N)if(!used.has(k))delete SP.N[k];if(SP.vp&&!SP.N[SP.vp])SP.vp=null;if(SP.vn&&!SP.N[SP.vn])SP.vn=null;if(SP.selN&&!SP.N[SP.selN])SP.selN=null;if(!selEl())SP.sel=null;}
function mergeN(src,dst){if(src===dst)return true;if(SP.E.some(e=>e.t!=='wire'&&((e.a===src&&e.b===dst)||(e.a===dst&&e.b===src))))return false;
  SP.E.forEach(e=>{if(e.a===src)e.a=dst;if(e.b===src)e.b=dst;});if(SP.vp===src)SP.vp=dst;if(SP.vn===src)SP.vn=dst;if(SP.tp===src)SP.tp=dst;if(SP.tn===src)SP.tn=dst;delete SP.N[src];cleanup();return true;}
// 可以接在導線上，也可以接在元件兩端的引線上（避開中間的符號）
function symHalf(e){const sz=SP.c&&SP.c.s||14;return e.t==='bat'?((Math.min(e.n||1,4)*2-1)*7)/2+12:e.t==='wire'?0:sz*1.5+6;}
function wireHit(x,y,ex,sym){let best=null,bd=8;for(const e of SP.E){if(e.t==='jump'||e.a===ex||e.b===ex||!SP.N[e.a]||!SP.N[e.b])continue;const P=scr(e.a),Q=scr(e.b);const dx=Q[0]-P[0],dy=Q[1]-P[1],L2=dx*dx+dy*dy;if(L2<1)continue;
  const L=Math.sqrt(L2),t=((x-P[0])*dx+(y-P[1])*dy)/L2;if(t*L<8||(1-t)*L<8)continue;const d=Math.hypot(x-P[0]-t*dx,y-P[1]-t*dy);if(d>=bd)continue;const inSym=e.t!=='wire'&&Math.abs(t-.5)*L<symHalf(e);if(inSym&&!sym)continue;bd=d;best={e,t,sym:inSym};}return best;}
function splitWire(h){const e=h.e,A=SP.N[e.a],B=SP.N[e.b];let x=A.x+(B.x-A.x)*h.t,y=A.y+(B.y-A.y)*h.t;if(Math.abs(A.x-B.x)<1e-6)y=snapV(y);else if(Math.abs(A.y-B.y)<1e-6)x=snapV(x);
  const M=addNode(x,y);if(e.t==='wire'||h.t>=.5){addEl('wire',M,e.b);e.b=M;}else{addEl('wire',e.a,M);e.a=M;}return M;}
function nodeAt(x,y,r=10,ex){let best=null,bd=r;for(const id in SP.N){if(id===ex)continue;const p=scr(id);const d=Math.hypot(x-p[0],y-p[1]);if(d<bd){bd=d;best=id;}}return best;}
function tryMerge(id){if(!SP.N[id])return false;const p=scr(id);const q=nodeAt(p[0],p[1],12,id);if(q){if(!mergeN(id,q)){SP.N[id].x+=.5;return false;}return true;}
  const h=wireHit(p[0],p[1],id);if(h){const M=splitWire(h);mergeN(id,M);return true;}return false;}
// 元件放到導線上：兩端接好後，拿掉原本直接連在兩端之間的那段導線（等於把元件串進去）
function hitFor(id){const p=scr(id);if(nodeAt(p[0],p[1],12,id))return{n:1};const h=wireHit(p[0],p[1],id,true);return h?{h}:null;}
// 單獨的元件放到另一個元件的引線上（同一直線）：把它串接進去，原元件往另一邊縮短
function insertInto(D){if(degN(D.a)!==1||degN(D.b)!==1)return false;const A=SP.N[D.a],B=SP.N[D.b];
  for(const X of SP.E){if(X===D||X.t==='wire'||X.t==='jump')continue;const P=SP.N[X.a],Q=SP.N[X.b];if(!P||!Q)continue;const L=Math.hypot(Q.x-P.x,Q.y-P.y);if(L<.5)continue;
    const ux=(Q.x-P.x)/L,uy=(Q.y-P.y)/L;const perp=p=>Math.abs((p.x-P.x)*uy-(p.y-P.y)*ux),along=p=>(p.x-P.x)*ux+(p.y-P.y)*uy;if(perp(A)>.2||perp(B)>.2)continue;
    const sa=along(A),sb=along(B),s1=Math.min(sa,sb),s2=Math.max(sa,sb),len=s2-s1;if(s2<=.05||s1>=L-.05||len<.4)continue;const minX=2*symHalf(X)/SP.z+.4;let a,b,n1,n2;
    const at=v=>{const n=addNode(P.x+ux*v,P.y+uy*v);return n;};
    if((s1+s2)/2<L/2){a=Math.max(0,s1);b=a+len;if(L-b<minX){a=0;b=len;if(L-b<minX)continue;}
      n1=a<.05?X.a:at(a);if(n1!==X.a)addEl('wire',X.a,n1);n2=at(b);X.a=n2;}
    else{b=Math.min(L,s2);a=b-len;if(a<minX){b=L;a=L-len;if(a<minX)continue;}
      n2=b>L-.05?X.b:at(b);if(n2!==X.b)addEl('wire',n2,X.b);n1=at(a);X.b=n1;}
    const lo=sa<=sb?'a':'b',hi=lo==='a'?'b':'a';D[lo]=n1;D[hi]=n2;D.ins=true;cleanup();autoPol(D);return true;}return false;}
function dropEl(e,both){if(insertInto(e))return;const A=SP.N[e.a],B=SP.N[e.b];if(!A||!B)return;const a0=[A.x,A.y],b0=[B.x,B.y];const L=Math.hypot(B.x-A.x,B.y-A.y)||1,ux=(B.x-A.x)/L,uy=(B.y-A.y)/L;
  const axis=Math.abs(ux)<1e-6||Math.abs(uy)<1e-6;const shifts=axis?[0,-.5,.5,-1,1,-1.5,1.5,-2,2,-2.5,2.5]:[0];let ok=false;
  for(const sh of shifts){A.x=a0[0]+ux*sh;A.y=a0[1]+uy*sh;B.x=b0[0]+ux*sh;B.y=b0[1]+uy*sh;const ha=hitFor(e.a),hb=hitFor(e.b);
    if(!ha&&!hb){if(sh===0){ok=true;break;}continue;}if(both&&!(ha&&hb)){if(sh===0&&!both)break;continue;}
    const bad=(ha&&ha.h&&ha.h.sym)||(hb&&hb.h&&hb.h.sym)||(ha&&hb&&ha.h&&hb.h&&ha.h.e===hb.h.e&&ha.h.e.t!=='wire');if(!bad){ok=true;break;}if(sh===0&&!both&&!(ha&&ha.h&&ha.h.e.t!=='wire')&&!(hb&&hb.h&&hb.h.e.t!=='wire'))break;}
  if(!ok){A.x=a0[0];A.y=a0[1];B.x=b0[0];B.y=b0[1];return;}
  const m1=tryMerge(e.a),m2=tryMerge(e.b);if(m1||m2)SP.E=SP.E.filter(w=>!(w.t==='wire'&&((w.a===e.a&&w.b===e.b)||(w.a===e.b&&w.b===e.a))));if(m1&&m2)e.ins=true;cleanup();autoPol(e);}
function autoPol(e){if(e.t!=='amm'||!e.ins)return;edSolve();if(e.I<-1e-6)[e.a,e.b]=[e.b,e.a];}
function pick(x,y){const n=nodeAt(x,y,11);if(n)return n;const h=wireHit(x,y);if(h)return splitWire(h);const [wx,wy]=wxy(x,y);return addNode(snapV(wx),snapV(wy));}
function rotEl(e){const A=SP.N[e.a],B=SP.N[e.b],mx=(A.x+B.x)/2,my=(A.y+B.y)/2;[A,B].forEach(p=>{const dx=p.x-mx,dy=p.y-my;p.x=snapV(mx-dy);p.y=snapV(my+dx);});}
function splitNode(id){const p=SP.N[id];const at=SP.E.filter(e=>e.a===id||e.b===id);at.slice(1).forEach(e=>{const o=SP.N[e.a===id?e.b:e.a];const d=Math.hypot(o.x-p.x,o.y-p.y)||1;
  const n=addNode(p.x+(o.x-p.x)/d*.6,p.y+(o.y-p.y)/d*.6);if(e.a===id)e.a=n;else e.b=n;});}
// 串接進去的元件（或安培計）：刪除或拖離時用導線把原本的位置接回去
const healable=e=>e&&(e.t==='amm'||e.ins)&&e.t!=='wire'&&degN(e.a)>=2&&degN(e.b)>=2;
function delSel(){if(SP.sel){pushHist();const e=selEl();
    if(healable(e)){e.t='wire';['lab','ins','rng','R','E','on','rate','broken','off','lo'].forEach(k=>delete e[k]);}
    else{const ns=[e.a,e.b];SP.E=SP.E.filter(q=>q!==e);if(e.t==='vm'){// 伏特計：連它的引線一起刪
        ns.forEach(n=>{let cur=n;for(let k=0;k<6;k++){const at=SP.E.filter(q=>q.a===cur||q.b===cur);if(at.length!==1||at[0].t!=='wire')break;const w=at[0];cur=w.a===cur?w.b:w.a;SP.E=SP.E.filter(q=>q!==w);if(SP.E.filter(q=>q.a===cur||q.b===cur).length!==0)break;}});}}
    SP.sel=null;cleanup();}else if(SP.selN){pushHist();const id=SP.selN;SP.E=SP.E.filter(e=>e.a!==id&&e.b!==id);SP.selN=null;cleanup();}else return;edSolve();edPanel();kick();}
function segD(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1;const t=clamp(((px-ax)*dx+(py-ay)*dy)/L2,0,1);return Math.hypot(px-ax-t*dx,py-ay-t*dy);}
function freeSpot(){const [cx,cy]=wxy(WS/2,HS/2);const clr=(x,y)=>{let m=1e9;for(let k=-1;k<=1;k+=.25){const px=x+k*1.4;for(const e of SP.E){const A=SP.N[e.a],B=SP.N[e.b];if(A&&B)m=Math.min(m,segD(px,y,A.x,A.y,B.x,B.y));}}return m;};
  const cs=[wxy(0,0),wxy(WS,0),wxy(0,HS),wxy(WS,HS)];const x0=Math.min(...cs.map(p=>p[0])),x1=Math.max(...cs.map(p=>p[0])),y0=Math.min(...cs.map(p=>p[1])),y1=Math.max(...cs.map(p=>p[1]));let best=[Math.round(cx),Math.round(cy)],bs=-1;
  for(let y=Math.ceil(y0);y<=y1;y++)for(let x=Math.ceil(x0);x<=x1;x++){const q=TW(x,y);if(q[0]<SP.z*1.8||q[0]>WS-SP.z*1.8||q[1]<SP.z*1.3||q[1]>HS-SP.z*1.3)continue;const c=clr(x,y);const sc=Math.min(c,1.6)-Math.hypot(x-cx,y-cy)*.01;if(sc>bs){bs=sc;best=[x,y];}}return best;}
function addAt(t,x,y,drop){pushHist();let e;
  if(t==='vm'){// 預設形狀：直立的伏特計＋兩條往左伸出的引線，拖引線的端點去接要量的兩點
    const a=addNode(snapV(x),snapV(y-1.5)),b=addNode(snapV(x),snapV(y+1.5)),pa=addNode(snapV(x-1.5),snapV(y-1.5)),pb=addNode(snapV(x-1.5),snapV(y+1.5));
    e=addEl('vm',a,b,{lab:autoName('vm')});addEl('wire',pa,a);addEl('wire',b,pb);if(drop){tryMerge(pa);tryMerge(pb);cleanup();}}
  else{const a=addNode(snapV(x-1),snapV(y)),b=addNode(snapV(x+1),snapV(y));e=addEl(t,a,b,{lab:autoName(t)});if(drop)dropEl(e);}
SP.sel=e.id;SP.selN=null;SP.tool='sel';edSolve();edPanel();spUI();kick();}
function edFit(){const ns=Object.values(SP.N);if(!ns.length){SP.z=54;SP.ox=WS/2;SP.oy=HS/2;return;}const c=Math.cos(SP.rot||0),sn=Math.sin(SP.rot||0);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  ns.forEach(n=>{const X=n.x*c-n.y*sn,Y=n.x*sn+n.y*c;x0=Math.min(x0,X);x1=Math.max(x1,X);y0=Math.min(y0,Y);y1=Math.max(y1,Y);});
  SP.z=clamp(Math.min((WS-150)/Math.max(2,x1-x0),(HS-130)/Math.max(2,y1-y0)),22,66);SP.ox=WS/2-SP.z*(x0+x1)/2;SP.oy=HS/2-SP.z*(y0+y1)/2+6;}
function zoomAt(f,x,y){const [wx,wy]=wxy(x,y);SP.z=clamp(SP.z*f,16,110);setAnchor(wx,wy,x,y);kick();}
function rotView(d,x=WS/2,y=HS/2){const [wx,wy]=wxy(x,y);SP.rot=(SP.rot||0)+d;SP.rot=Math.atan2(Math.sin(SP.rot),Math.cos(SP.rot));setAnchor(wx,wy,x,y);kick();}
// ---------- 指標操作 ----------
const cvS=$('cvSp');cvS.tabIndex=0;cvS.style.touchAction='none';let drg=null,hov=null;
const posS=ev=>{const r=cvS.getBoundingClientRect();return[ev.clientX-r.left,ev.clientY-r.top];};
const probeH=()=>SP.vm?[{k:'vp',col:CC.pos,lab:'+',off:[9,-9]},{k:'vn',col:CC.dark?'#9aa3ad':'#333',lab:'−',off:[-9,9]}]:[];
const probePos=h=>h.drag||(SP[h.k]&&SP.N[SP[h.k]]?[scr(SP[h.k])[0]+h.off[0],scr(SP[h.k])[1]+h.off[1]]:null);
function endHandles(e){if(!e||!SP.N[e.a]||!SP.N[e.b])return[];const P=scr(e.a),Q=scr(e.b),L=Math.hypot(Q[0]-P[0],Q[1]-P[1])||1,ux=(Q[0]-P[0])/L,uy=(Q[1]-P[1])/L,d=Math.min(18,L*.25);
  return[{end:'a',x:P[0]+ux*d,y:P[1]+uy*d},{end:'b',x:Q[0]-ux*d,y:Q[1]-uy*d}];}
function rotBtn(e){if(!e||!e.M||!SP.N[e.a]||!SP.N[e.b]||e.t==='wire')return null;const P=scr(e.a),Q=scr(e.b),L=Math.hypot(Q[0]-P[0],Q[1]-P[1])||1;let nx=-(Q[1]-P[1])/L,ny=(Q[0]-P[0])/L;if(ny>0||(Math.abs(ny)<.01&&nx<0)){nx=-nx;ny=-ny;}
  const d=(SP.c.s||14)+24;return[e.M[0]+nx*d+((Q[0]-P[0])/L)*d*.9,e.M[1]+ny*d+((Q[1]-P[1])/L)*d*.9];}
function elAt(x,y){const c=SP.c;let best=null,bd=1e9;for(const e of SP.E){if(!e.L)continue;let d;
  if(e.t==='jump'){d=1e9;for(let i=0;i<=20;i++){const p=e.pt(i/20);d=Math.min(d,Math.hypot(x-p[0],y-p[1]));}}
  else{const P=c.P[e.a],Q=c.P[e.b],dx=Q[0]-P[0],dy=Q[1]-P[1],L2=dx*dx+dy*dy||1;const t=clamp(((x-P[0])*dx+(y-P[1])*dy)/L2,0,1);d=Math.hypot(x-P[0]-t*dx,y-P[1]-t*dy);
    if(e.t!=='wire'&&Math.hypot(x-e.M[0],y-e.M[1])<c.s+6)d=Math.min(d,1);}
  const lim=e.t==='wire'?6:9;if(d<lim&&(d<bd||(e.t!=='wire'&&best&&best.t==='wire'))){bd=d;best=e;}}return best;}
function labAt(x,y){for(const e of SP.E){const b=e.lbox;if(b&&x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3])return{e};}if(SP.letters||SP.vm)for(const id in SP.N){const b=SP.N[id].lb;if(b&&x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3])return{n:id};}return null;}
const TCH=new Map();let gest=null;
function gestStart(){const [p,q]=[...TCH.values()];const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;gest={a0:Math.atan2(q[1]-p[1],q[0]-p[0]),d0:Math.hypot(q[0]-p[0],q[1]-p[1])||1,rot0:SP.rot||0,z0:SP.z,w:wxy(mx,my)};}
function gestMove(){const [p,q]=[...TCH.values()];const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;let r=gest.rot0+Math.atan2(q[1]-p[1],q[0]-p[0])-gest.a0;
  const k=Math.round(r/(Math.PI/2))*(Math.PI/2);if(Math.abs(r-k)<.06)r=k;SP.rot=r;SP.z=clamp(gest.z0*Math.hypot(q[0]-p[0],q[1]-p[1])/gest.d0,16,110);setAnchor(gest.w[0],gest.w[1],mx,my);kick();}
function undoTo(sn){const o=JSON.parse(sn);SP.N=o.N;SP.E=o.E.map((e,i)=>Object.assign(e,{ph:rnd(i)*30}));SP.nid=o.nid;SP.eid=o.eid;edSolve();}
cvS.addEventListener('pointerdown',ev=>{if(ev.pointerType!=='touch')return;TCH.set(ev.pointerId,posS(ev));if(TCH.size===2){if(drg&&drg.moved&&drg.snap)undoTo(drg.snap);drg=null;try{cvS.setPointerCapture(ev.pointerId);}catch(e){}gestStart();ev.preventDefault();ev.stopImmediatePropagation();}else if(TCH.size>2)ev.stopImmediatePropagation();},true);
cvS.addEventListener('pointermove',ev=>{if(ev.pointerType==='touch'&&TCH.has(ev.pointerId)){TCH.set(ev.pointerId,posS(ev));if(gest&&TCH.size>=2){gestMove();ev.stopImmediatePropagation();}}},true);
const tEnd=ev=>{if(TCH.has(ev.pointerId)){TCH.delete(ev.pointerId);if(gest){if(TCH.size<2)gest=null;ev.stopImmediatePropagation();}}};
cvS.addEventListener('pointerup',tEnd,true);cvS.addEventListener('pointercancel',tEnd,true);
cvS.addEventListener('pointerdown',ev=>{if(ev.button===2||gest)return;const [x,y]=posS(ev);cvS.setPointerCapture(ev.pointerId);cvS.focus({preventScroll:true});ev.preventDefault();const snap=snapState();
  for(const h of probeH()){const p=probePos(h);if(p&&Math.hypot(x-p[0],y-p[1])<11){drg={k:'probe',h,x,y};return;}}
  if(SP.tool==='wire'){drg={k:'wire',x,y,cx:x,cy:y,snap};return;}
  {const rb=rotBtn(selEl());if(rb&&Math.hypot(x-rb[0],y-rb[1])<13){const e=selEl();pushHist(snap);rotEl(e);dropEl(e,true);edSolve();edPanel();kick();return;}}
  for(const h of endHandles(selEl())){if(Math.hypot(x-h.x,y-h.y)<8){drg={k:'end',e:selEl(),end:h.end,x,y,snap};return;}}
  const n=nodeAt(x,y,8);if(n){drg={k:'node',id:n,x,y,snap};return;}
  const L=labAt(x,y);if(L){const o=L.e||SP.N[L.n];drg={k:'lab',L,x,y,lo:(o.lo||[0,0]).slice(),snap};return;}
  const e=elAt(x,y);if(e){drg={k:'el',e,x,y,a0:Object.assign({},SP.N[e.a]),b0:Object.assign({},SP.N[e.b]),snap};return;}
  drg={k:'pan',x,y,ox:SP.ox,oy:SP.oy};});
cvS.addEventListener('pointermove',ev=>{const [x,y]=posS(ev);
  if(!drg){let cur='default';if(SP.tool==='wire')cur='crosshair';else if((()=>{const rb=rotBtn(selEl());return rb&&Math.hypot(x-rb[0],y-rb[1])<13;})())cur='pointer';else if(probeH().some(h=>{const p=probePos(h);return p&&Math.hypot(x-p[0],y-p[1])<11;})||nodeAt(x,y,8)||labAt(x,y))cur='grab';else if(elAt(x,y))cur='pointer';else cur='move';cvS.style.cursor=cur;
    if(SP.tool==='wire'){hov=[x,y];kick();}return;}
  const mv=Math.hypot(x-drg.x,y-drg.y)>4;drg.moved=drg.moved||mv;if(!drg.moved)return;const [wx,wy]=wxy(x,y);
  switch(drg.k){
  case'probe':drg.h.drag=[x,y];break;
  case'wire':drg.cx=x;drg.cy=y;break;
  case'end':{if(!drg.id){let id=drg.e[drg.end];if(degN(id)>1){const p=SP.N[id];const n=addNode(p.x,p.y);drg.e[drg.end]=n;id=n;}drg.id=id;}SP.N[drg.id].x=snapV(wx);SP.N[drg.id].y=snapV(wy);break;}
  case'node':SP.N[drg.id].x=snapV(wx);SP.N[drg.id].y=snapV(wy);break;
  case'lab':{const o=drg.L.e||SP.N[drg.L.n];o.lo=[drg.lo[0]+(x-drg.x)/SP.z,drg.lo[1]+(y-drg.y)/SP.z];break;}
  case'el':{if(!drg.det&&healable(drg.e)){const e=drg.e;drg.det=true;addEl('wire',e.a,e.b);const A=SP.N[e.a],B=SP.N[e.b];e.a=addNode(A.x,A.y);e.b=addNode(B.x,B.y);e.ins=false;drg.a0=Object.assign({},SP.N[e.a]);drg.b0=Object.assign({},SP.N[e.b]);edSolve();}
    const [x0,y0]=wxy(drg.x,drg.y);const dx=snapV(wx-x0),dy=snapV(wy-y0);const A=SP.N[drg.e.a],B=SP.N[drg.e.b];A.x=drg.a0.x+dx;A.y=drg.a0.y+dy;if(B!==A){B.x=drg.b0.x+dx;B.y=drg.b0.y+dy;}break;}
  case'pan':SP.ox=drg.ox+x-drg.x;SP.oy=drg.oy+y-drg.y;break;}
  kick();});
function ptrUp(ev){if(!drg)return;const [x,y]=ev?posS(ev):[drg.x,drg.y];const d=drg;drg=null;let changed=false;
  if(d.k==='probe'){const k=nodeAt(x,y,34);if(k)SP[d.h.k]=k;d.h.drag=null;}
  else if(d.k==='wire'){if(d.moved){const a=pick(d.x,d.y),b=pick(x,y);if(a!==b){addEl('wire',a,b);changed=true;}cleanup();}}
  else if(!d.moved){// 點一下
    if(d.k==='el'){SP.sel=d.e.id;SP.selN=null;if(d.e.t==='sw'||d.e.t==='jump'){pushHist(d.snap);d.e.on=!d.e.on;}}
    else if(d.k==='node'){SP.selN=d.id;SP.sel=null;}else if(d.k==='lab'){if(d.L.e){SP.sel=d.L.e.id;SP.selN=null;}else{SP.selN=d.L.n;SP.sel=null;}}
    else if(d.k==='pan'){SP.sel=null;SP.selN=null;}}
  else{if(d.k==='end'||d.k==='node'){tryMerge(d.id);changed=true;}else if(d.k==='el'){dropEl(d.e);changed=true;}else if(d.k==='lab')changed=true;}
  if(changed)pushHist(d.snap);edSolve();edPanel();spUI();kick();}
cvS.addEventListener('pointerup',ptrUp);cvS.addEventListener('pointercancel',()=>ptrUp(null));
cvS.addEventListener('pointerleave',()=>{hov=null;kick();});
cvS.addEventListener('wheel',ev=>{const [x,y]=posS(ev);if(ev.shiftKey&&!ev.ctrlKey){ev.preventDefault();rotView((ev.deltaY||ev.deltaX)<0?-Math.PI/36:Math.PI/36,x,y);return;}if(!ev.ctrlKey&&!ev.metaKey)return;ev.preventDefault();zoomAt(ev.deltaY<0?1.12:1/1.12,x,y);},{passive:false});
cvS.addEventListener('dblclick',ev=>{const [x,y]=posS(ev);const e=elAt(x,y);if(e&&e.t!=='wire'&&e.t!=='sw'&&e.t!=='jump'){SP.sel=e.id;edPanel();const f=$('spProp').querySelector('input[type=text],input[type=number]');if(f)f.focus();}});
document.addEventListener('keydown',ev=>{if(bench!=='sp')return;const tg=ev.target.tagName;if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT')return;
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='z'){ev.preventDefault();undo();return;}
  if(ev.key==='Delete'||ev.key==='Backspace'){if(SP.sel||SP.selN){ev.preventDefault();delSel();}return;}
  if(ev.key==='Escape'){SP.sel=null;SP.selN=null;SP.tool='sel';edPanel();spUI();kick();return;}
  const e=selEl();if(ev.key==='r'&&e){pushHist();rotEl(e);dropEl(e,true);edSolve();kick();}else if(ev.key==='f'&&e){pushHist();[e.a,e.b]=[e.b,e.a];edSolve();edPanel();kick();}
  else if(ev.key==='w'){SP.tool=SP.tool==='wire'?'sel':'wire';spUI();kick();}});
// 工具列：點一下加在空位、拖到畫布上放在指定位置
document.querySelectorAll('#spPal button[data-add]').forEach(btn=>{btn.addEventListener('pointerdown',ev=>{ev.preventDefault();const t=btn.dataset.add,sx=ev.clientX,sy=ev.clientY;
  const mv=e2=>{if(Math.hypot(e2.clientX-sx,e2.clientY-sy)>6){document.body.style.cursor='copy';}};
  const up=e2=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.body.style.cursor='';
    const r=cvS.getBoundingClientRect();const inside=e2.clientX>=r.left&&e2.clientX<=r.right&&e2.clientY>=r.top&&e2.clientY<=r.bottom;
    if(Math.hypot(e2.clientX-sx,e2.clientY-sy)>6&&inside){const [wx,wy]=wxy(e2.clientX-r.left,e2.clientY-r.top);addAt(t,wx,wy,true);}else if(Math.hypot(e2.clientX-sx,e2.clientY-sy)<=6){const [x,y]=freeSpot();addAt(t,x,y);}};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);});});
// ---------- 屬性面板 ----------
const row=(lab,k,v,min,max,step,u,dis)=>`<div class="prow"><span>${lab}</span><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${v}"${dis?' disabled':''}><input type="number" data-k="${k}" min="0" step="${step}" value="${nf(v,3)}"${dis?' disabled':''}><span>${u}</span></div>`;
const chk=(lab,k,v)=>`<label class="tog"><input type="checkbox" data-k="${k}"${v?' checked':''}>${lab}</label>`;
function edPanel(){const P=$('spProp');const e=selEl();let h='';
  if(e){h+=`<p class="ptype">${TNAME[e.t]}</p>`;if(e.t!=='wire'&&e.t!=='jump')h+=`<div class="prow2"><span>名稱</span><input type="text" data-k="${e.t==='bat'?'nm':'lab'}" value="${(e.t==='bat'?e.nm:e.lab)||''}"></div>`;
    if(e.t==='bat')h+=row('電壓','E',e.E,.5,24,.5,'V');
    if(e.t==='bulb'){h+=chk('用規格（額定電壓、功率）','rate',e.rate);h+=e.rate?row('額定電壓','Vr',e.Vr,.5,24,.5,'V')+row('額定功率','Pr',e.Pr,.1,40,.1,'W')+`<p class="pnote">電阻 R ＝ V²／P ＝ ${nf(e.R,2)} Ω；實際功率超過額定的 2 倍會燒壞</p>`:row('電阻','R',e.R,.5,30,.5,'Ω');}
    if(e.t==='res')h+=row('電阻','R',e.R,.5,30,.5,'Ω');if(e.t==='rheo')h+=row('電阻','R',e.R,0,30,.5,'Ω');
    if(e.t==='sw')h+=chk('接通','on',e.on);if(e.t==='jump')h+=chk('接上','on',e.on);
    if(e.t==='fuse')h+=row('額定電流','Ir',e.Ir,.1,10,.1,'A');
    if(e.t==='amm')h+=`<div class="prow2"><span>量程</span><select data-k="rng">${[[.05,'50 mA'],[.5,'500 mA'],[5,'5 A'],[0,'不限']].map(([v,t])=>`<option value="${v}"${+e.rng===v?' selected':''}>${t}</option>`).join('')}</select></div>`;
    if(e.t==='vm')h+=`<div class="prow2"><span>量程</span><select data-k="rng">${[[3,'3 V'],[15,'15 V'],[300,'300 V'],[0,'不限']].map(([v,t])=>`<option value="${v}"${+e.rng===v?' selected':''}>${t}</option>`).join('')}</select></div>`;
    h+=`<div class="pbtns"><button class="btn" data-act="rot">↻ 旋轉 <kbd>R</kbd></button><button class="btn" data-act="flip">⇄ 對調兩端 <kbd>F</kbd></button>`;
    if(e.t==='bulb'||e.t==='res')h+=`<button class="btn" data-act="off">${e.off?'裝回':'取下'}</button>`;if(e.broken)h+=`<button class="btn primary" data-act="fix">${e.t==='fuse'?'換新的保險絲':'修好'}</button>`;
    h+=`<button class="btn" data-act="del">🗑 刪除 <kbd>Del</kbd></button></div><div class="pread" id="spPR"></div>`;}
  else if(SP.selN&&SP.N[SP.selN]){const n=SP.N[SP.selN];h+=`<p class="ptype">接點 ${n.lab}（連著 ${degN(SP.selN)} 個元件）</p><div class="prow2"><span>名稱</span><input type="text" data-n="lab" value="${n.lab}"></div>`;
    h+=`<div class="pbtns">${degN(SP.selN)>1?'<button class="btn" data-act="split">拆開這個接點</button>':''}<button class="btn" data-act="del">🗑 刪除接點與相連元件</button></div><div class="pread" id="spPR"></div>`;}
  else h+=`<p class="ptype">怎麼操作</p><ul class="pnote"><li>上方工具列：點一下加入元件，或直接拖到畫布上。</li><li>拖元件本體＝移動；拖黑色接點＝整個接點一起移動；選取元件後拖兩端的橘點＝把那一端拆下來，放到別的接點上就接起來。</li>
    <li>放到導線中間會自動分岔（T 字接點）。</li><li>「✎ 畫導線」：從一點拖到另一點。</li><li>點開關、跨接導線＝切換；點其他元件＝選取後在這裡改數值。</li><li>拖標籤可以移動文字；拖空白處移動畫面，Ctrl＋滾輪縮放。</li><li>觸控螢幕：兩根手指旋轉、縮放、移動整個畫面（接近 0°、90° 會自動對齊）；滑鼠用 Shift＋滾輪旋轉。</li><li>串接進去的元件和安培計：拖離電路或刪除時，原位置會自動用導線接回去。</li><li>選取元件後點旁邊的 ↻ 可以轉 90°；元件放到導線上會自動串接進去。</li><li>鍵盤：R 旋轉、F 對調、Del 刪除、W 畫導線、Ctrl＋Z 復原。</li></ul>`;
  P.innerHTML=h;edRead();}
function edRead(){const el=$('spPR');if(!el)return;const e=selEl();if(SP.hide){el.innerHTML='<span class="pnote">先猜再看：按「揭曉」才會顯示讀數</span>';return;}
  if(e){const L=[];const v=Math.abs(e.dV||0),i=Math.abs(e.I||0);
    if(e.t==='bat')L.push(`輸出電流 ${fI(i)}`);else if(e.t==='amm')L.push(`讀數 ${fI(e.I)}`);else if(e.t==='vm')L.push(`讀數 ${fV(e.dV)}`);
    else{L.push(`兩端電壓 ${fV(v)}`,`電流 ${fI(i)}`);if(['bulb','res','rheo'].includes(e.t)&&!e.off&&!e.broken)L.push(`電功率 P ＝ IV ≈ ${nf(e.P,2)} W`);}
    if(e.t==='bulb'&&!e.off&&!e.broken)L.push(`亮度 ${Math.round(100*bright(e,e.Pref||1.2))}%`+(e.rate?`（額定 ${nf(e.Pr,1)} W 時約 63%）`:''));el.innerHTML=L.join('<br>');}
  else if(SP.selN&&SP.c.V){el.innerHTML=`電位 ${fV(SP.c.V[SP.selN]-(SP.tn&&SP.N[SP.tn]?SP.c.V[SP.tn]:0))}（以電池負極為 0）`;}}
const PP=$('spProp');let preS=null;
PP.addEventListener('pointerdown',()=>{preS=snapState();});PP.addEventListener('focusin',()=>{if(!preS)preS=snapState();});
PP.addEventListener('input',ev=>{const t=ev.target;const e=selEl();
  if(t.dataset.n&&SP.selN){SP.N[SP.selN].lab=t.value;kick();return;}if(!e||!t.dataset.k)return;const k=t.dataset.k;
  if(t.type==='checkbox')e[k]=t.checked;else if(t.type==='text')e[k]=t.value;else{const v=parseFloat(t.value);if(!Number.isFinite(v))return;e[k]=t.tagName==='SELECT'?v:Math.max(0,v);
    PP.querySelectorAll(`input[data-k="${k}"]`).forEach(o=>{if(o!==t)o.value=t.type==='number'?v:nf(v,3);});}
  if(e.broken&&k!=='lab'&&k!=='nm')e.broken=false;edSolve();if(t.type==='checkbox'||t.tagName==='SELECT')edPanel();else edRead();kick();});
PP.addEventListener('change',()=>{if(preS){pushHist(preS);preS=null;}});
PP.addEventListener('click',ev=>{const b=ev.target.closest('button[data-act]');if(!b)return;const a=b.dataset.act,e=selEl();pushHist(preS||snapState());preS=null;
  if(a==='del'){SP.hist.pop();delSel();return;}if(a==='rot'&&e){rotEl(e);dropEl(e,true);}if(a==='flip'&&e)[e.a,e.b]=[e.b,e.a];if(a==='off'&&e)e.off=!e.off;if(a==='fix'&&e)e.broken=false;if(a==='split'&&SP.selN)splitNode(SP.selN);
  edSolve();edPanel();kick();});
// ---------- 上方控制 ----------
function spUI(){segSet($('spT'),SP.edited?'':SP.tpl);segSet($('spKind'),SP.kind);segSet($('spMode'),SP.mode);segSet($('spCells'),SP.cells);segSet($('spTool'),SP.tool);
  $('spCellsW').hidden=SP.tpl!=='cells';$('spVm').checked=SP.vm;$('spV').checked=SP.showV;$('spVI').checked=SP.showVI;$('spLet').checked=SP.letters;$('spSnap').checked=SP.snap;$('spHide').checked=SP.hide;$('spReveal').hidden=!SP.hide;
  howList('spHow',['串聯：電流只有一條路，各處電流相等；總電壓 ＝ 各燈電壓相加；總電阻 R ＝ R1 ＋ R2 ＋ …。取下任一個燈泡，整個電路斷路。','並聯：每個燈泡兩端都直接接到電池，各支路電壓相等（＝ 電池電壓）；總電流 ＝ 各支路電流相加；1／R ＝ 1／R1 ＋ 1／R2 ＋ …。取下一個，其他照常亮。',
    '相同的燈泡：串聯越多越暗；並聯時每個都和單獨接時一樣亮，但電池輸出的總電流變大。','電池串聯：總電壓相加；相同電池並聯：總電壓和一個電池相同（可用較久）；接反會互相抵消。','導線直接接在某個燈泡兩端，那個燈泡被短路不亮；其餘串聯的燈泡電壓變大、變亮。','國中題目通常把燈泡電阻視為固定值；勾「用規格」的燈泡，實際功率超過額定 2 倍會燒壞；保險絲電流超過額定會熔斷。']);}
segOn($('spT'),v=>{hideStory();if(v==='blank'&&SP.E.length)pushHist();loadTpl(v);edPanel();spUI();kick();});
segOn($('spCells'),v=>{SP.cells=v;loadTpl('cells');edPanel();spUI();kick();});
segOn($('spKind'),v=>{if(v===SP.kind)return;pushHist();SP.kind=v;SP.E.forEach(e=>{if(e.t==='bulb'||e.t==='res'){e.t=v;if(e.lab)e.lab=e.lab.replace(/^[LR](?=\d)/,v==='bulb'?'L':'R');e.rate=false;}});edSolve();edPanel();spUI();kick();});
segOn($('spMode'),v=>{SP.mode=v;spUI();kick();});segOn($('spTool'),v=>{SP.tool=v;spUI();kick();});
[['spVm','vm'],['spV','showV'],['spVI','showVI'],['spLet','letters'],['spSnap','snap'],['spHide','hide']].forEach(([id,k])=>$(id).addEventListener('change',()=>{SP[k]=$(id).checked;
  if(k==='vm'&&SP.vm){const ks=Object.keys(SP.N);if(!SP.N[SP.vp])SP.vp=ks[0];if(!SP.N[SP.vn])SP.vn=ks[1];}edRead();spUI();kick();}));
$('spReveal').addEventListener('click',()=>{SP.hide=false;edRead();spUI();kick();});
$('spUndo').addEventListener('click',undo);$('spFix').addEventListener('click',()=>{pushHist();SP.E.forEach(e=>e.broken=false);edSolve();edPanel();kick();});
$('spFit').addEventListener('click',()=>{edFit();kick();});$('spRl').addEventListener('click',()=>rotView(-Math.PI/12));$('spRr').addEventListener('click',()=>rotView(Math.PI/12));$('spR0').addEventListener('click',()=>{SP.rot=0;edFit();kick();});$('spZin').addEventListener('click',()=>zoomAt(1.2,WS/2,HS/2));$('spZout').addEventListener('click',()=>zoomAt(1/1.2,WS/2,HS/2));
// ---------- 繪圖 ----------
function drawSp(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const c=SP.c,z=SP.z;
  if(SP.snap){g.fillStyle=C.line;const cs=[wxy(0,0),wxy(W,0),wxy(0,H),wxy(W,H)];const gx0=Math.floor(Math.min(...cs.map(p=>p[0]))),gx1=Math.ceil(Math.max(...cs.map(p=>p[0]))),gy0=Math.floor(Math.min(...cs.map(p=>p[1]))),gy1=Math.ceil(Math.max(...cs.map(p=>p[1])));
    if((gx1-gx0)*(gy1-gy0)<20000)for(let x=gx0;x<=gx1;x++)for(let y=gy0;y<=gy1;y++){const p=TW(x,y);if(p[0]>=0&&p[0]<=W&&p[1]>=0&&p[1]<=H)g.fillRect(p[0]-1,p[1]-1,2,2);}}
  if(!SP.E.length){text(g,'從上方工具列點一下或拖曳元件到這裡，開始接電路',W/2,H/2,{size:15,align:'center',col:C.muted});c.P={};}
  else{c.P={};for(const k in SP.N)c.P[k]=scr(k);c.u=z*2;c.s=clamp(z*.34,9,16);c.z=z;const ps=Object.values(c.P);c.cx=ps.reduce((s,p)=>s+p[0],0)/ps.length;c.cy=ps.reduce((s,p)=>s+p[1],0)/ps.length;
    SP.E.forEach(e=>geom(c,e));const o={mode:SP.mode,showV:SP.showV&&!SP.hide,showVI:SP.showVI,sel:selEl(),hideR:SP.hide,hideB:SP.hide,noDots:SP.hide||SP.mode==='off'};
    drawCirc(g,c,o);
    // 端點：沒接上的端點畫空心圈
    for(const k in SP.N){const p=c.P[k],d=degN(k);if(d===1){g.strokeStyle=CC.pos;g.lineWidth=1.6;g.fillStyle=C.panel;g.beginPath();g.arc(p[0],p[1],4.2,0,TAU);g.fill();g.stroke();}else if(d===2){g.fillStyle=C.ink;g.beginPath();g.arc(p[0],p[1],2.2,0,TAU);g.fill();}}
    if(SP.letters||SP.vm)for(const k in SP.N){const n=SP.N[k],p=c.P[k];let x=p[0]-7+(n.lo?n.lo[0]*z:0),y=p[1]-7+(n.lo?n.lo[1]*z:0);text(g,n.lab,x,y,{size:12.5,bold:true,col:C.purple,align:'right'});g.font=`700 12.5px ${FONT}`;const w=g.measureText(n.lab).width;n.lb=[x-w-3,y-13,x+3,y+3];}
    if(SP.selN&&c.P[SP.selN]){const p=c.P[SP.selN];g.strokeStyle=C.accent;g.lineWidth=2;g.setLineDash([3,3]);g.beginPath();g.arc(p[0],p[1],10,0,TAU);g.stroke();g.setLineDash([]);}
    {const rb=rotBtn(selEl());if(rb){g.fillStyle=C.panel;g.strokeStyle=C.accent;g.lineWidth=2;g.beginPath();g.arc(rb[0],rb[1],11,0,TAU);g.fill();g.stroke();text(g,'↻',rb[0],rb[1]+1,{size:15,bold:true,col:C.accent,align:'center',base:'middle'});}}
    endHandles(selEl()).forEach(h=>{g.fillStyle=C.accent;g.beginPath();g.arc(h.x,h.y,5.5,0,TAU);g.fill();g.strokeStyle=C.panel;g.lineWidth=1.5;g.stroke();});
    if(SP.vm){const H2=probeH(),p=probePos(H2[0]),q=probePos(H2[1]);const bx=W-122,by=H-50;g.fillStyle=C.panel;g.strokeStyle=C.ink;g.lineWidth=1.5;g.beginPath();g.roundRect(bx,by,112,40,8);g.fill();g.stroke();
      const v=SP.vp&&SP.vn&&c.V?c.V[SP.vp]-c.V[SP.vn]:0;text(g,'V',bx+14,by+25,{size:16,bold:true});text(g,SP.hide?'？':(SP.vp===SP.vn||!SP.vp||!SP.vn?'—':fV(v)),bx+102,by+26,{size:15,bold:true,col:C.blue,align:'right'});
      [[p,CC.pos,bx+30],[q,CC.dark?'#9aa3ad':'#333',bx+80]].forEach(([pp,col,tx])=>{if(!pp)return;g.strokeStyle=col;g.lineWidth=1.6;g.beginPath();g.moveTo(tx,by);g.bezierCurveTo(tx,by-60,pp[0],pp[1]+60,pp[0],pp[1]);g.stroke();});
      H2.forEach(h=>{const pp=probePos(h);if(pp)drawHandle(g,pp,h.col,h.lab);});}
    const S=spState();if(S.short&&!SP.hide)text(g,'短路！電流非常大',W/2,H-12,{size:14,bold:true,col:CC.pos,align:'center',bg:C.panel});}
  if(drg&&drg.k==='wire'&&drg.moved){const s0=nodeAt(drg.x,drg.y,11),s1=nodeAt(drg.cx,drg.cy,11);const sn=(x,y,n)=>n?SP.c.P[n]||scr(n):(()=>{const [a,b]=wxy(x,y);returnTW(snapV(a),snapV(b));})();
    const a=sn(drg.x,drg.y,s0),b=sn(drg.cx,drg.cy,s1);line(g,a[0],a[1],b[0],b[1],C.accent,2.6,[6,4]);}
  else if(SP.tool==='wire'&&hov){const n=nodeAt(hov[0],hov[1],11);const [a,b]=wxy(hov[0],hov[1]);const p=n?scr(n):TW(snapV(a),snapV(b));g.strokeStyle=C.accent;g.lineWidth=2;g.beginPath();g.arc(p[0],p[1],7,0,TAU);g.stroke();}
  if(SP.tool==='wire')text(g,'畫導線模式：從一點拖到另一點（按 W 或 Esc 結束）',10,18,{size:12,bold:true,col:C.accent});}
function spState(){const bats=SP.E.filter(e=>e.t==='bat'&&!e.off);const c=SP.c;let Vt=null,I=0;
  if(SP.tpl==='cells'&&!SP.edited&&SP.tp&&c.V){Vt=c.V[SP.tp]-c.V[SP.tn];const a=SP.E.find(e=>e.lab==='A'&&e.t==='amm');I=a?a.I:0;}
  else if(bats.length===1&&c.V){const b=bats[0];Vt=b.E-b.I*elR(c,b);I=b.I;}
  const Rext=Vt!==null&&Math.abs(I)>1e-7?Vt/I:Infinity;return{Vt,I,Rext,nb:bats.length,short:bats.some(b=>Math.abs(b.I)>30)||(Math.abs(I)>1e-4&&Rext<.05)};}
function spResults(){const c=SP.c,S=spState();const loads=SP.E.filter(e=>['bulb','res','rheo'].includes(e.t));let big,f=[],ck=[];
  if(SP.hide){$('spBig').textContent='先猜猜看：哪些燈泡會亮？電表讀數是多少？';$('spF').innerHTML='想好之後按上方的「揭曉」。';checks($('spC'),[]);return;}
  const loose=Object.keys(SP.N).filter(k=>degN(k)===1).length;
  if(!SP.E.length)big='加入電池、燈泡和導線，把它們接成一個迴路';else if(S.short)big='短路：電流幾乎都走導線，電流極大！';else if(S.nb===0)big='還沒有電池：電路需要電源';
  else if(Math.abs(S.I)<1e-6&&S.nb===1)big='斷路：沒有電流（檢查開關、燈泡或接線）';else if(S.Vt!==null)big=`總電壓 ${fV(S.Vt)}，總電流 ${fI(S.I)}，總電阻 ${Number.isFinite(S.Rext)?fR(S.Rext):'—'}`;
  else big=`有 ${S.nb} 個電池：各電池電流 ${SP.E.filter(e=>e.t==='bat'&&!e.off).map(b=>(b.nm||b.lab)+' '+fI(b.I)).join('、')}`;
  loads.forEach(e=>f.push(`${e.lab||TNAME[e.t]}：${e.off?'已取下':e.broken?'燒壞（斷路）':`V ＝ ${fV(Math.abs(e.dV))}，I ＝ ${fI(Math.abs(e.I))}，R ＝ ${nf(e.R,2)} Ω`+(e.t==='bulb'?`，亮度 ${Math.round(100*bright(e,e.Pref||1.2))}%`:'')}`));
  const am=SP.E.filter(e=>e.t==='amm'||e.t==='vm');if(am.length)f.push(am.map(e=>(e.lab||TNAME[e.t])+' '+(e.broken?'燒毀':e.t==='amm'?fI(e.I):fV(e.dV))).join('，'));
  if(SP.vm&&SP.vp&&SP.vn)f.push(`伏特計探棒：＋接 ${SP.N[SP.vp].lab}、−接 ${SP.N[SP.vn].lab}，讀數 ${fV(c.V[SP.vp]-c.V[SP.vn])}`);
  const T=TP[SP.tpl],kind=SP.edited?null:SP.tpl==='cells'?'cells':T&&T.kind;
  if(kind==='ser')ck.push(['info','串聯：各處電流相等；總電壓 ＝ 各元件電壓相加；R ＝ R1 ＋ R2 ＋ …']);
  if(kind==='par')ck.push(['info','並聯：各支路電壓都等於電池電壓；總電流 ＝ 各支路電流相加；1／R ＝ 1／R1 ＋ 1／R2 ＋ …']);
  if(kind==='mix')ck.push(['info','先把並聯的部分合成一個電阻，再和其他部分串聯計算。']);
  if(SP.tpl==='rheo'&&!SP.edited)ck.push(['info','滑線變阻器電阻變大 → 總電阻變大 → 電流變小，燈泡變暗；V1 變小、V2 變大，但 V1 ＋ V2 ＝ 電池電壓。']);
  if(kind==='cells')ck.push(['info',{one:'一個電池：1.5 V。',s2:'兩個電池串聯（正極接負極）：總電壓 1.5 ＋ 1.5 ＝ 3 V，燈泡較亮。',p2:'兩個相同電池並聯：總電壓仍是 1.5 V，亮度和一個電池相同，但可用比較久。',r2:'串聯但一個接反：電壓互相抵消，總電壓 0 V，燈泡不亮。',p2s1:'兩個並聯（1.5 V）再串聯一個（1.5 V）：總電壓 3 V。'}[SP.cells]]);
  loads.forEach(e=>{if(!e.off&&!e.broken&&e.t==='bulb'&&Math.abs(e.I)<1e-4&&Math.abs(S.I)>1e-6)ck.push(['no',`${e.lab} 不亮：兩端沒有電壓（被短路，或所在的支路斷了）。`]);});
  SP.E.forEach(e=>{if(e.broken)ck.push(['no',e.t==='fuse'?`${e.lab} 熔斷：電流超過額定 ${nf(e.Ir,2)} A，電路被切斷。`:e.t==='amm'?`${e.lab} 燒毀：安培計電阻極小，不能並聯或直接接電池。`:`${e.lab} 燒壞：實際功率超過額定的 2 倍，燈絲斷了（斷路）。`]);});
  SP.E.forEach(e=>{if(e.t==='amm'&&e.rng&&Math.abs(e.I)>e.rng*1.02&&!e.broken)ck.push(['no',`${e.lab} 超過量程，要改接較大量程的端子。`]);if(e.t==='vm'&&e.rng&&Math.abs(e.dV)>e.rng*1.02)ck.push(['no',`${e.lab} 超過量程。`]);
    if((e.t==='amm'&&e.I<-1e-4)||(e.t==='vm'&&e.dV<-1e-3))ck.push(['no',`${e.lab} 的＋、−端接反了（指針反偏）：選取後按「對調兩端」。`]);});
  if(loose)ck.push(['info',`有 ${loose} 個端點還沒接上（紅色空心圈）。`]);
  if(S.short)ck.push(['no','短路：電阻極小、電流極大，導線和電池會發熱，非常危險。']);
  $('spBig').textContent=big;$('spF').innerHTML=f.join('<br>')||'—';checks($('spC'),ck);}
SIZE.sp=()=>{const ow=WS;({W:WS,H:HS}=fit($('cvSp'),.56,420,620));if(!SP.fitted||ow!==WS){SP.fitted=true;edFit();}};
UI.sp=()=>{if(!SP.E.length&&!SP.loaded){SP.loaded=true;loadTpl('ser2');}edPanel();spUI();};
let spAcc=1;TICK.sp=dt=>{if(SP.c&&SP.c.P)tickDots(SP.c,dt,{mode:SP.mode});spAcc+=dt;return true;};
DRAW.sp=()=>{drawSp($('cvSp').getContext('2d'),WS,HS);if(spAcc>.2){spAcc=0;spResults();edRead();}};
// 舊版題目用的捷徑
function spBuild(){loadTpl(SP.tpl);}function spSolve(){edSolve();}
