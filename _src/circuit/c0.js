
// =====================================================================
// 電路引擎：節點電壓法求解、繪圖、點選與探棒
// =====================================================================
const CC={};function readMore(){const s=getComputedStyle(document.documentElement);['pos','neg','metal','metal2','glow'].forEach(k=>CC[k]=s.getPropertyValue('--'+k).trim());
  const th=document.documentElement.dataset.theme;CC.dark=th==='dark'||(th!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);}
readMore();matchMedia('(prefers-color-scheme: dark)').addEventListener('change',readMore);
const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const fI=x=>{const a=Math.abs(x);if(a<5e-5)return '0 A';if(a<.1)return nf(x*1000,1)+' mA';if(a>=100)return (x<0?'−':'')+'超過 100 A';return nf(x,2)+' A';};
const fV=x=>(Math.abs(x)<5e-3?'0':Math.abs(x)>=100?Math.round(x).toString():nf(x,2))+' V';
const fR=x=>x>=1e5?'很大':nf(x,2)+' Ω';
const potCol=f=>`hsl(${Math.round(230-230*clamp(f,0,1))},${CC.dark?80:72}%,${CC.dark?62:44}%)`;

function elR(c,e){if(e.off||e.broken)return 0;switch(e.t){case'wire':return 1e-6;case'jump':return e.on?1e-6:0;case'sw':return e.on?1e-6:0;
  case'bulb':case'res':case'rheo':case'mat':return Math.max(e.R,1e-4);case'fuse':return 1e-4;case'bat':return e.r||1e-4;case'amm':return c.ammR||1e-5;case'vm':return c.vmR||1e6;}return 0;}
function gauss(A,b){const n=b.length;for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;
  if(p!==i){[A[i],A[p]]=[A[p],A[i]];const t=b[i];b[i]=b[p];b[p]=t;}const d=A[i][i]||1e-18;
  for(let r=i+1;r<n;r++){const f=A[r][i]/d;if(!f)continue;for(let k=i;k<n;k++)A[r][k]-=f*A[i][k];b[r]-=f*b[i];}}
  const x=new Float64Array(n);for(let i=n-1;i>=0;i--){let s=b[i];for(let k=i+1;k<n;k++)s-=A[i][k]*x[k];x[i]=s/(A[i][i]||1e-18);}return x;}
function solve(c){const ids=Object.keys(c.N),n=ids.length,ix={};ids.forEach((k,i)=>ix[k]=i);
  const bats=c.E.filter(e=>e.t==='bat');const g0=c.gnd||(bats[0]?bats[0].a:ids[0]);
  const its=c.E.some(e=>e.non&&!e.off)?40:1;c.V={};
  for(let k=0;k<its;k++){const A=Array.from({length:n},()=>new Float64Array(n)),J=new Float64Array(n);
    for(const e of c.E){const R=elR(c,e);if(!R||!(e.a in ix)||!(e.b in ix)||e.a===e.b)continue;const g=1/R,i=ix[e.a],j=ix[e.b];
      A[i][i]+=g;A[j][j]+=g;A[i][j]-=g;A[j][i]-=g;if(e.t==='bat'){J[j]+=e.E*g;J[i]-=e.E*g;}}
    for(let i=0;i<n;i++)A[i][i]+=1e-9;const gi=ix[g0];A[gi].fill(0);A[gi][gi]=1;J[gi]=0;
    const V=gauss(A,J);ids.forEach((k,i)=>c.V[k]=V[i]);
    for(const e of c.E){const R=elR(c,e);e.I=R&&e.a!==e.b?(c.V[e.a]-c.V[e.b]+(e.t==='bat'?e.E:0))/R:0;}
    if(its>1)c.E.forEach(e=>{if(e.non&&!e.off){const v=Math.abs(c.V[e.a]-c.V[e.b]);e.R=.5*e.R+.5*(1.5+3.5*Math.pow(v/1.5,.6));}});}
  c.E.forEach(e=>{e.dV=c.V[e.a]-c.V[e.b];e.P=['bulb','res','rheo','mat'].includes(e.t)&&!e.off?e.I*e.I*elR(c,e):0;});return c;}
// 建立電路：els 為 [種類, a, b, {其他}]
function mkC(N,els,o={}){return Object.assign({N,E:els.map((x,i)=>Object.assign({t:x[0],a:x[1],b:x[2],id:'e'+i,ph:rnd(i+1)*30},
  x[0]==='bulb'||x[0]==='res'?{R:5}:x[0]==='sw'||x[0]==='jump'?{on:true}:x[0]==='bat'?{E:1.5,n:1}:{},x[3]||{})),V:{}},o);}
const bright=(e,Pref=1.2)=>e.off?0:1-Math.exp(-e.P/Pref);
const Eget=(c,lab)=>c.E.find(e=>e.lab===lab);

// ---------- 版面 ----------
function lay(c,W,H,pad=46,umax=170){const ps=Object.values(c.N);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;ps.forEach(p=>{x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);});
  if(c.ext){x0-=c.ext[0];y0-=c.ext[1];x1+=c.ext[2];y1+=c.ext[3];}
  const padT=pad+(c.padT||0);const u=Math.min((W-2*pad)/Math.max(.5,x1-x0),(H-pad-padT)/Math.max(.5,y1-y0),umax);
  const ox=(W-u*(x1-x0))/2-u*x0,oy=padT+((H-pad-padT)-u*(y1-y0))/2-u*y0;c.u=u;c.s=clamp(u*.2,9,18);c.P={};
  for(const k in c.N)c.P[k]=[ox+u*c.N[k][0],oy+u*c.N[k][1]];c.cx=ox+u*(x0+x1)/2;c.cy=oy+u*(y0+y1)/2;
  c.E.forEach(e=>geom(c,e));}
function geom(c,e){const P=c.P[e.a],Q=c.P[e.b];if(!P||!Q){e.L=0;return;}
  if(e.t==='jump'){const mx=(P[0]+Q[0])/2,my=(P[1]+Q[1])/2,d=Math.hypot(Q[0]-P[0],Q[1]-P[1])||1;let nx=-(Q[1]-P[1])/d,ny=(Q[0]-P[0])/d;
    const side=e.side||((mx-c.cx)*nx+(my-c.cy)*ny>=0?1:-1);if(e.side===undefined&&Math.abs((mx-c.cx)*nx+(my-c.cy)*ny)<1&&ny>0)nx=-nx,ny=-ny;
    const h=(e.hu?e.hu*c.u:(.18*d+c.u*.28))*side;e.nv=[nx*side,ny*side];const K=[mx+nx*h,my+ny*h];
    e.pt=t=>[(1-t)*(1-t)*P[0]+2*t*(1-t)*K[0]+t*t*Q[0],(1-t)*(1-t)*P[1]+2*t*(1-t)*K[1]+t*t*Q[1]];
    let L=0,pr=P;for(let i=1;i<=16;i++){const q=e.pt(i/16);L+=Math.hypot(q[0]-pr[0],q[1]-pr[1]);pr=q;}e.L=L;e.M=e.pt(.5);}
  else{e.pt=t=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];e.L=Math.hypot(Q[0]-P[0],Q[1]-P[1]);e.M=e.pt(.5);}}

// ---------- 繪圖 ----------
function drawCirc(g,c,o={}){const s=c.s;const Vs=Object.values(c.V).filter(Number.isFinite);const vmin=Math.min(0,...Vs),vmax=Math.max(...Vs,1e-9);
  const lc=v=>o.showV&&vmax-vmin>1e-3?potCol((v-vmin)/(vmax-vmin)):C.ink;
  const deg={};c.E.forEach(e=>{if(e.t==='jump'&&!e.on)return;deg[e.a]=(deg[e.a]||0)+1;deg[e.b]=(deg[e.b]||0)+1;});
  g.lineCap='round';
  // 跨接導線（未接時虛線）
  c.E.filter(e=>e.t==='jump'&&e.L&&(e.on||!e.probe)).forEach(e=>{g.save();g.beginPath();const p0=e.pt(0);g.moveTo(p0[0],p0[1]);for(let i=1;i<=24;i++){const q=e.pt(i/24);g.lineTo(q[0],q[1]);}
    if(e.on){g.strokeStyle=C.accent;g.lineWidth=4;g.setLineDash([]);}else{g.strokeStyle=C.muted;g.lineWidth=1.6;g.setLineDash([5,5]);}g.stroke();g.restore();
    if(e.lab&&!e.probe){const nv=e.nv||[0,-1];text(g,e.lab+(e.on?'':'（點我）'),e.M[0]+nv[0]*10,e.M[1]+nv[1]*10+(nv[1]<-.5?-2:nv[1]>.5?12:4),{size:11.5,bold:e.on,align:nv[0]<-.5?'right':nv[0]>.5?'left':'center',col:e.on?C.accent:C.muted,bg:C.panel});}});
  for(const e of c.E){if(e.t==='jump'||!e.L)continue;drawEl(g,c,e,o,lc);}
  // 節點
  for(const k in c.P){if((deg[k]||0)>=3){g.fillStyle=lc(c.V[k]);g.beginPath();g.arc(c.P[k][0],c.P[k][1],4,0,TAU);g.fill();}}
  if(o.letters)for(const k in c.P){if(c.noLet&&c.noLet.includes(k))continue;const[x,y]=c.P[k];g.fillStyle=C.panel;g.strokeStyle=C.ink;g.lineWidth=1.3;g.beginPath();g.arc(x,y,3.2,0,TAU);g.fill();g.stroke();
    text(g,k,x-7,y-7,{size:12,bold:true,col:C.purple,align:'right'});}
  // 電子／電流
  drawDots(g,c,o,vmin,vmax);
  // 標籤
  for(const e of c.E){if(!e.lab||e.t==='wire'||e.t==='jump'||!e.L)continue;labelEl(g,c,e,o);}
  if(o.sel){const e=o.sel;if(e.L){g.strokeStyle=C.accent;g.lineWidth=2;g.setLineDash([4,3]);g.beginPath();g.arc(e.M[0],e.M[1],s+7,0,TAU);g.stroke();g.setLineDash([]);}}
  if(o.showV&&vmax-vmin>1e-3){const W=g.canvas.clientWidth,bx=W-26,by=12,bh=70;for(let i=0;i<bh;i++){g.fillStyle=potCol(1-i/bh);g.fillRect(bx,by+i,12,1);}
    text(g,'電位高',bx-4,by+10,{size:10,align:'right',col:C.muted});text(g,'電位低',bx-4,by+bh,{size:10,align:'right',col:C.muted});}}
function drawEl(g,c,e,o,lc){const s=c.s,P=c.P[e.a],Q=c.P[e.b],L=e.L,ux=(Q[0]-P[0])/L,uy=(Q[1]-P[1])/L,[mx,my]=e.M;const ca=lc(c.V[e.a]),cb=lc(c.V[e.b]);
  const lead=(r)=>{line(g,P[0],P[1],mx-ux*r,my-uy*r,ca,2.4);line(g,mx+ux*r,my+uy*r,Q[0],Q[1],cb,2.4);};
  const nx=-uy,ny=ux;
  switch(e.t){
  case'wire':line(g,P[0],P[1],Q[0],Q[1],ca,2.4);break;
  case'bulb':{lead(s);const b=o.hideB||e.broken?0:bright(e,e.Pref||c.Pref);if(b>.01){const gr=g.createRadialGradient(mx,my,s*.3,mx,my,s*(1.3+2.6*b));gr.addColorStop(0,`rgba(255,214,80,${.95*b})`);gr.addColorStop(1,'rgba(255,214,80,0)');g.fillStyle=gr;g.beginPath();g.arc(mx,my,s*(1.3+2.6*b),0,TAU);g.fill();}
    g.fillStyle=e.off?C.panel:b>.01?`rgba(255,236,150,${.35+.6*b})`:C.panel;g.strokeStyle=C.ink;g.lineWidth=2;g.setLineDash(e.off?[4,3]:[]);g.beginPath();g.arc(mx,my,s,0,TAU);g.fill();g.stroke();g.setLineDash([]);
    if(e.broken){const k=s*.68;line(g,mx-k,my-k,mx-k*.2,my-k*.2,C.ink,1.8);line(g,mx+k*.25,my+k*.25,mx+k,my+k,C.ink,1.8);line(g,mx-k,my+k,mx-k*.2,my+k*.2,C.ink,1.8);line(g,mx+k*.25,my-k*.25,mx+k,my-k,C.ink,1.8);text(g,'燒壞',mx,my+s+14,{size:11,bold:true,align:'center',col:CC.pos,bg:C.panel});}
    else if(!e.off){const k=s*.68;line(g,mx-k,my-k,mx+k,my+k,C.ink,1.8);line(g,mx-k,my+k,mx+k,my-k,C.ink,1.8);}
    else{line(g,P[0],P[1],mx-ux*s,my-uy*s,ca,2.4);text(g,'已取下',mx,my+4,{size:10,align:'center',col:C.muted});}break;}
  case'res':case'rheo':case'mat':{const r=s*1.35;lead(r);
    if(e.t==='mat'){const M=MATS[e.mat]||{};g.save();g.translate(mx,my);g.rotate(Math.atan2(uy,ux));
      if(M.cls!=='air'){g.fillStyle=M.col||C.metal;g.strokeStyle=C.ink;g.lineWidth=1.2;g.beginPath();g.roundRect(-r,-s*.55,2*r,s*1.1,4);g.fill();g.stroke();}
      g.fillStyle=C.metal2;g.fillRect(-r-5,-s*.7,8,s*1.4);g.fillRect(r-3,-s*.7,8,s*1.4);g.restore();
      text(g,M.n||'',mx+nx*0+ (Math.abs(ux)>.5?0:s+8),my+(Math.abs(ux)>.5?s+18:4),{size:12,bold:true,align:Math.abs(ux)>.5?'center':'left',bg:C.panel});break;}
    g.strokeStyle=C.ink;g.lineWidth=2;g.beginPath();g.moveTo(mx-ux*r,my-uy*r);const z=6;for(let i=1;i<z;i++){const t=-r+2*r*i/z,sg=i%2?1:-1;g.lineTo(mx+ux*t+nx*sg*s*.5,my+uy*t+ny*sg*s*.5);}g.lineTo(mx+ux*r,my+uy*r);g.stroke();
    if(e.t==='rheo'){arrow(g,mx-ux*r*.9+nx*s*1.1,my-uy*r*.9+ny*s*1.1,mx+ux*r*.9-nx*s*1.1,my+uy*r*.9-ny*s*1.1,C.accent,2);}break;}
  case'bat':{const n=Math.min(e.n||1,4),gap=7,w=(n*2-1)*gap;lead(w/2+1);
    for(let i=0;i<n;i++){const t0=-w/2+i*2*gap;// 由 a（負）到 b（正）：每個電池先短板（負）再長板（正）
      const t1=t0,t2=t0+gap;const sh=s*.42,lg=s*.95;line(g,mx+ux*t1-nx*sh,my+uy*t1-ny*sh,mx+ux*t1+nx*sh,my+uy*t1+ny*sh,C.ink,3.4);
      line(g,mx+ux*t2-nx*lg,my+uy*t2-ny*lg,mx+ux*t2+nx*lg,my+uy*t2+ny*lg,C.ink,1.8);
      if(i<n-1)line(g,mx+ux*t2,my+uy*t2,mx+ux*(t2+gap),my+uy*(t2+gap),C.ink,1.6);}
    const pp=w/2+9;text(g,'＋',mx+ux*pp+nx*s*.9,my+uy*pp+ny*s*.9+4,{size:12,bold:true,col:CC.pos,align:'center'});text(g,'−',mx-ux*pp+nx*s*.9,my-uy*pp+ny*s*.9+4,{size:13,bold:true,col:CC.neg,align:'center'});
    if((e.n||1)>4)text(g,'…',mx+nx*s*1.3,my+ny*s*1.3,{size:12,align:'center'});break;}
  case'fuse':{const r=s*1.2;lead(r);g.save();g.translate(mx,my);g.rotate(Math.atan2(uy,ux));g.fillStyle=C.panel;g.strokeStyle=C.ink;g.lineWidth=1.8;g.beginPath();g.rect(-r,-s*.42,2*r,s*.84);g.fill();g.stroke();
    if(e.broken){line(g,-r,0,-r*.25,s*.15,CC.pos,2);line(g,r*.25,-s*.15,r,0,CC.pos,2);}else line(g,-r,0,r,0,C.ink,1.6);g.restore();break;}
  case'sw':{lead(s);g.fillStyle=C.ink;[-1,1].forEach(k=>{g.beginPath();g.arc(mx+k*ux*s,my+k*uy*s,4.2,0,TAU);g.fill();});
    const a=-.5,rx=ux*Math.cos(a)-uy*Math.sin(a),ry=ux*Math.sin(a)+uy*Math.cos(a);
    line(g,mx-ux*s,my-uy*s,e.on?mx+ux*s:mx-ux*s+rx*2.1*s,e.on?my+uy*s:my-uy*s+ry*2.1*s,C.ink,3.4);break;}
  case'amm':case'vm':{lead(s);g.fillStyle=C.panel;g.strokeStyle=e.burnt?CC.pos:C.ink;g.lineWidth=2;g.beginPath();g.arc(mx,my,s,0,TAU);g.fill();g.stroke();
    text(g,e.t==='amm'?'A':'V',mx,my+1,{size:s*1.05,bold:true,align:'center',base:'middle'});
    text(g,'+',mx-ux*(s+7)+nx*7,my-uy*(s+7)+ny*7+4,{size:11,bold:true,col:CC.pos,align:'center'});
    if(e.burnt){line(g,mx-s,my-s,mx+s,my+s,CC.pos,3);line(g,mx-s,my+s,mx+s,my-s,CC.pos,3);}break;}}}
function labelEl(g,c,e,o){const s=c.s,P=c.P[e.a],Q=c.P[e.b];const hz=Math.abs(Q[0]-P[0])>=Math.abs(Q[1]-P[1]);const lp=e.lp||(hz?'u':'r');
  const [mx,my]=e.M;const lines=[e.lab+(e.t==='bulb'||e.t==='res'||e.t==='rheo'?(o.showR===false?'':' '+nf(e.R,1)+'Ω'):'')];
  const hr=o.hideR;if(e.t==='amm')lines.push(e.burnt||e.broken?'燒毀！':hr?'？ A':fI(e.I)+(e.rng&&Math.abs(e.I)>e.rng*1.02?' 超過量程':''));if(e.t==='vm')lines.push(hr?'？ V':fV(e.dV)+(e.rng&&Math.abs(e.dV)>e.rng*1.02?' 超過量程':''));
  if(e.t==='fuse')lines.push(e.broken?'熔斷':'額定 '+nf(e.Ir,2)+' A');if(e.t==='bulb'&&e.rate)lines[0]=e.lab+' '+nf(e.Vr,1)+'V '+nf(e.Pr,1)+'W';
  if(o.showVI&&!hr&&(e.t==='bulb'||e.t==='res'||e.t==='rheo')&&!e.off&&!e.broken)lines.push(fV(Math.abs(e.dV))+'，'+fI(Math.abs(e.I)));
  const d=s+(e.t==='bulb'?10:e.t==='bat'?14:8);let x=mx,y=my,al='center';
  if(lp==='u')y=my-d-(lines.length-1)*14;else if(lp==='d')y=my+d+10;else if(lp==='r'){x=mx+d;al='left';y=my-(lines.length-1)*7+4;}else{x=mx-d;al='right';y=my-(lines.length-1)*7+4;}
  if(e.lo&&c.z){x+=e.lo[0]*c.z;y+=e.lo[1]*c.z;}
  g.font=`700 12.5px ${FONT}`;const w=Math.max(...lines.map(t=>g.measureText(t).width))+6;const bx=al==='center'?x-w/2:al==='right'?x-w:x;e.lbox=[bx,y-14,bx+w,y+(lines.length-1)*14+4];
  lines.forEach((t,i)=>text(g,t,x,y+i*14,{size:i?11.5:12.5,bold:!i,align:al,col:i?(e.t==='amm'||e.t==='vm'||e.t==='fuse'?(/超過|燒毀|熔斷/.test(t)?CC.pos:C.blue):C.muted):C.ink,bg:C.panel}));}
function drawDots(g,c,o,vmin,vmax){if(o.noDots)return;const sp=18;for(const e of c.E){if(!e.L||e.t==='vm'||Math.abs(e.I)<2e-5||e.off||(e.t==='jump'&&!e.on))continue;
  const ph=((e.ph%sp)+sp)%sp;const el=o.mode!=='c';const fwd=(e.I>0)!==el;
  for(let d=ph;d<e.L;d+=sp){const t=d/e.L,[x,y]=e.pt(t);
    if(el){g.fillStyle=CC.neg;g.beginPath();g.arc(x,y,3.3,0,TAU);g.fill();g.strokeStyle='#fff';g.lineWidth=1.2;g.beginPath();g.moveTo(x-1.8,y);g.lineTo(x+1.8,y);g.stroke();}
    else{if(o.energy){const v=e.t==='wire'||e.t==='jump'||e.t==='sw'||e.t==='amm'?c.V[e.a]:lerp(c.V[e.a],c.V[e.b],t);const f=(v-vmin)/Math.max(1e-6,vmax-vmin);
        g.fillStyle=CC.glow;g.globalAlpha=.75;g.beginPath();g.arc(x,y,2+7*f,0,TAU);g.fill();g.globalAlpha=1;}
      const p2=e.pt(Math.min(1,t+.001)),p1=e.pt(Math.max(0,t-.001));let an=Math.atan2(p2[1]-p1[1],p2[0]-p1[0]);if(!fwd)an+=Math.PI;head(g,x+Math.cos(an)*3,y+Math.sin(an)*3,an,CC.pos,8);}}}}
function tickDots(c,dt,o={}){const Iref=c.Iref||.3;for(const e of c.E){if(!e.L)continue;const v=Math.min(420,75*Math.abs(e.I||0)/Iref);const el=o.mode!=='c';e.ph+=v*dt*((e.I>0)!==el?1:-1)*(e.I?1:0);}}
// ---------- 點選與探棒 ----------
function hitEl(c,x,y){let best=null,bd=1e9;for(const e of c.E){if(!e.L||e.t==='wire'||e.probe)continue;const d=Math.hypot(x-e.M[0],y-e.M[1]);if(d<c.s+12&&d<bd){bd=d;best=e;}}return best;}
function nearNode(c,x,y,r=34){let best=null,bd=r;for(const k in c.P){if(c.noLet&&c.noLet.includes(k))continue;const d=Math.hypot(x-c.P[k][0],y-c.P[k][1]);if(d<bd){bd=d;best=k;}}return best;}
// handles: [{key,col,node:()=>id,set:id=>{},off:[dx,dy]}]
function circPointer(cv,getC,getH,onClick,after){let drag=null;const pos=ev=>{const r=cv.getBoundingClientRect();return[ev.clientX-r.left,ev.clientY-r.top];};
  const hpos=(c,h)=>h.drag||(c.P[h.node()]?[c.P[h.node()][0]+(h.off||[0,0])[0],c.P[h.node()][1]+(h.off||[0,0])[1]]:null);
  cv.addEventListener('pointerdown',ev=>{const[x,y]=pos(ev);const c=getC();if(!c||!c.P)return;
    for(const h of getH()){const p=hpos(c,h);if(p&&Math.hypot(x-p[0],y-p[1])<24){drag=h;h.drag=[x,y];cv.setPointerCapture(ev.pointerId);ev.preventDefault();after();return;}}
    onClick(hitEl(c,x,y),x,y);after();});
  cv.addEventListener('pointermove',ev=>{const[x,y]=pos(ev);const c=getC();if(!c||!c.P)return;if(drag){drag.drag=[x,y];after();return;}
    const onH=getH().some(h=>{const p=hpos(c,h);return p&&Math.hypot(x-p[0],y-p[1])<24;});cv.style.cursor=onH?'grab':hitEl(c,x,y)?'pointer':'default';});
  const up=()=>{if(!drag)return;const c=getC();const k=nearNode(c,drag.drag[0],drag.drag[1],60);if(k)drag.set(k);drag.drag=null;drag=null;after();};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.style.touchAction='none';return hpos;}
function drawHandle(g,p,col,lab){g.fillStyle=col;g.beginPath();g.arc(p[0],p[1],9,0,TAU);g.fill();g.strokeStyle=C.panel;g.lineWidth=2;g.stroke();text(g,lab,p[0],p[1]+1,{size:12,bold:true,col:'#fff',align:'center',base:'middle'});}
