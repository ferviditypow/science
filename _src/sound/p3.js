
// ================= 場景：對牆喊／兩峭壁／移動 =================
const fold=(x,L)=>{const P=2*L;let y=((x%P)+P)%P;const n=Math.floor(x/L);return [y>L?P-y:y,Math.abs(n)];};
function bgLand(g,W,H,G){g.fillStyle=C.sky;g.fillRect(0,0,W,G);g.fillStyle=C.grid;g.fillRect(0,G,W,H-G);line(g,0,G,W,G,C.muted,1.5);}
function drawA(g,W,H,M){const [x0,x1]=rangeABC(M),mp=xmap(W,x0,x1),G=H*.72,top=H*.1,t=E.t,v=M.v;bgLand(g,W,H,G);
  const xw=mp.X(M.d),xp=mp.X(0),ys=G-40;
  // 0.1 秒界線
  const d17=v*.1/2;if(d17<x1*.98){const xx=mp.X(d17);line(g,xx,G,xx,top+24,C.green,1.3,[5,4]);text(g,'離牆 '+nf(d17,1)+' m 以上才分得出回聲',xx+(xx<W*.6?6:-6),top+20,{col:C.green,size:11,bold:true,align:xx<W*.6?'left':'right'});}
  g.save();g.beginPath();g.rect(0,0,xw,G);g.clip();
  ring(g,xp,ys,v*t*mp.s,C.snd,1-.4*t/M.tmax);
  if(v*t>M.d)ring(g,mp.X(2*M.d),ys,v*t*mp.s,C.echo,M.r*(1-.3*t/M.tmax));
  g.restore();
  wallA(g,xw,G,top,E.A.mat);text(g,MATN[E.A.mat],xw+11,top-6,{size:12,bold:true,align:'center'});
  person(g,xp,G,1,C.ink,t<M.tmax*.06?1:0);
  // 追蹤一小段聲音
  const s=v*t;if(s<=2*M.d){const x=s<M.d?s:2*M.d-s;dot(g,mp.X(x),ys,s<M.d?C.snd:C.echo);}
  if(t>=M.te){text(g,M.te<.1?'回聲回來了，但和原聲混在一起':'聽到回聲！',xp+16,G-66,{col:C.echo,size:13,bold:true,bg:C.panel});ear(g,xp-1,G-44,C.echo);}
  dimLine(g,xp,xw,G+22,'d = '+fmtM(M.d));if(E.A.giv==='d')handle(g,xw+11,G-(G-top)/2,9);
  const yb=G+44;if(s>0){const go=Math.min(s,M.d);arrow(g,xp,yb,mp.X(go),yb,C.snd,2.5);
    if(s>M.d){const back=Math.min(s,2*M.d)-M.d;arrow(g,xw,yb+12,mp.X(M.d-back),yb+12,C.echo,2.5);}
    text(g,'聲音已走 '+fmtM(Math.min(s,2*M.d))+(s>=2*M.d?'＝ 2d（來回）':''),W-12,H-8,{size:12,bold:true,align:'right',col:s>=2*M.d?C.echo:C.snd});}}
function drawB(g,W,H,M){const [x0,x1]=rangeABC(M),mp=xmap(W,x0,x1),G=H*.72,top=H*.12,t=E.t,v=M.v;bgLand(g,W,H,G);
  const xa=mp.X(0),xb=mp.X(M.L),xp=mp.X(M.s),ys=G-40,fd=1-.35*t/M.tmax;
  g.save();g.beginPath();g.rect(xa,0,xb-xa,G);g.clip();
  ring(g,xp,ys,v*t*mp.s,C.snd,fd);
  for(const im of M.imgs)if(v*t>Math.abs(im.p-M.s)/2)ring(g,mp.X(im.p),ys,v*t*mp.s,RC(im.n),im.a*fd,2.5);
  g.restore();
  cliffL(g,xa,G,top);cliffR(g,xb,G,top);
  text(g,'甲',xa-22,top+18,{size:16,bold:true,col:'#fff',align:'center'});text(g,'乙',xb+22,top+18,{size:16,bold:true,col:'#fff',align:'center'});
  person(g,xp,G,1,C.ink,t<M.tmax*.04?1:0);
  for(const dir of [-1,1]){const [x,n]=fold(M.s+dir*v*t,M.L);if(n<=4)dot(g,mp.X(x),ys,RC(n),5.5);}
  const heard=M.arr.filter(a=>a.t<=t&&a.t<=M.tmax);
  if(heard.length){const h=heard[heard.length-1];text(g,'第 '+h.k+' 聲回聲（'+h.lab+'）',xp,G-66,{col:RC(h.ims[0].n),size:13,bold:true,align:'center',bg:C.panel});ear(g,xp-1,G-44,C.echo);}
  dimLine(g,xa,xp,G+22,'人到甲 '+fmtM(M.d1),C.ink,12);dimLine(g,xp,xb,G+22,'人到乙 '+fmtM(M.d2),C.ink,12);
  dimLine(g,xa,xb,G+50,'兩峭壁相距 '+fmtM(M.L),C.purple,12);
  if(E.B.giv==='d')handle(g,xp,G+2,8);}
function drawC(g,W,H,M){const [x0,x1]=rangeABC(M),mp=xmap(W,x0,x1),t=E.t,v=M.v,veh=E.C.veh,G=H*.66,top=H*.1;
  const xw=mp.X(M.D),xe=mp.X(0);let ys=G-24,clipTop=0;
  if(veh==='ship'){g.fillStyle=C.sky;g.fillRect(0,0,W,G);g.fillStyle=C.sea;g.fillRect(0,G,W,H-G);line(g,0,G,W,G,C.snd,1.2);ys=G-26;}
  else if(veh==='train'){bgLand(g,W,H,G);line(g,0,G-1,W,G-1,C.ink,2);ys=G-26;}
  else{g.fillStyle=C.sky;g.fillRect(0,0,W,top);g.fillStyle=C.sea;g.fillRect(0,top,W,G-top);g.fillStyle=C.grid;g.fillRect(0,G,W,H-G);ys=(top+G)/2;clipTop=top;}
  g.save();g.beginPath();g.rect(0,clipTop,xw,G-clipTop);g.clip();
  const fd=1-.35*t/M.tmax;ring(g,xe,ys,v*t*mp.s,C.snd,fd);if(v*t>M.D)ring(g,mp.X(2*M.D),ys,v*t*mp.s,C.echo,.8*fd);g.restore();
  if(veh==='dolphin'){g.fillStyle='#8f9aa3';g.fillRect(xw,top-6,20,G-top+6);text(g,'池壁',xw+10,top-10,{size:12,bold:true,align:'center'});}
  else{cliffR(g,xw,G,top);if(veh==='train'){g.fillStyle='#1a1a1a';g.beginPath();g.moveTo(xw+2,G);g.lineTo(xw+2,G-30);g.quadraticCurveTo(xw+22,G-48,xw+42,G-30);g.lineTo(xw+42,G);g.fill();text(g,'隧道',xw+22,G-52,{size:11,col:'#fff',align:'center',bold:true});}
    else text(g,'山壁',xw+30,top+18,{size:13,col:'#fff',bold:true,align:'center'});}
  // 鳴笛處
  line(g,xe,top+6,xe,H-4,C.muted,1.2,[4,4]);text(g,VEH[veh].hn+'處',xe,top+2,{size:11,col:C.muted,align:'center'});
  const tv=Math.min(t,M.te+M.re),xv=mp.X(M.sg*M.u*tv),dir=M.sg;
  g.save();g.globalAlpha=.25;if(veh==='ship')ship(g,xe,G,dir);else if(veh==='train')train(g,xe,G,dir);else dolphin(g,xe,ys,dir);g.restore();
  if(veh==='ship')ship(g,xv,G,dir);else if(veh==='train')train(g,xv,G,dir);else dolphin(g,xv,ys,dir);
  if(t<M.tmax*.05){g.save();g.strokeStyle=C.snd;g.lineWidth=2;for(let k=1;k<=3;k++){g.beginPath();g.arc(xe+dir*30,ys-8,5+k*5,-.6,.6);g.stroke();}g.restore();}
  const s=v*t;if(t<M.te){const x=s<M.D?s:2*M.D-s;dot(g,mp.X(x),ys,s<M.D?C.snd:C.echo);}
  if(t>=M.te){const st=t>=M.te+M.re&&M.re>0;const left=M.D-M.sg*M.u*(M.te+M.re);
    text(g,st?'停住！離'+VEH[veh].wall+'還有 '+fmtM(left):M.re>0?'聽到回聲，反應中…':'聽到回聲！',xv,top+(veh==='dolphin'?-4:26),{col:C.echo,size:13,bold:true,align:'center',bg:C.panel});}
  // 線段圖
  const y1=G+16,y2=G+36,y3=G+58;
  if(s>0){const go=Math.min(s,M.D);line(g,xe,y1,mp.X(go),y1,C.snd,3.5);
    if(s>M.D){const back=Math.min(s,2*M.D-M.sg*M.u*Math.min(t,M.te))-M.D;if(back>0){line(g,xw,y1+7,mp.X(M.D-back),y1+7,C.echo,3.5);}}
    const su=v*Math.min(t,M.te);text(g,'聲音走 v·t = '+fmtM(su),W-10,y1+4,{size:12,bold:true,col:C.snd,align:'right',bg:C.panel});}
  const ut=M.u*Math.min(t,M.te);if(ut>0){line(g,xe,y2,mp.X(M.sg*ut),y2,C.green,3.5);text(g,VEH[veh].n+'走 u·t = '+fmtM(ut),W-10,y2+4,{size:12,bold:true,col:C.green,align:'right',bg:C.panel});}
  if(H-G>70)dimLine(g,xe,xw,y3,'D = '+fmtM(M.D),C.ink,12);}

// ================= 位置－時間圖 =================
function niceStep(T){const raw=T/5,p=10**Math.floor(Math.log10(raw));for(const k of [1,2,5,10])if(raw<=k*p)return k*p;return 10*p;}
function drawXT(g,W,H,M){g.clearRect(0,0,W,H);const [x0,x1]=rangeABC(M),mp=xmap(W,x0,x1),T0=16,BT=H-10,ty=t=>T0+t/M.tmax*(BT-T0),v=M.v;
  g.fillStyle=C.panel;g.fillRect(0,0,W,H);
  const st=niceStep(M.tmax);for(let tt=0;tt<=M.tmax+1e-9;tt+=st){const y=ty(tt);line(g,mp.L-4,y,W-8,y,C.grid,1);text(g,fmtT(tt),mp.L-8,y+4,{size:10,col:C.muted,align:'right'});}
  text(g,'時間 ↓',6,BT,{size:10,col:C.muted});
  const poly=(pts,col,w=2.4,dash=null)=>{g.strokeStyle=col;g.lineWidth=w;g.setLineDash(dash||[]);g.beginPath();pts.forEach(([x,t],i)=>{const px=mp.X(x),py=ty(t);i?g.lineTo(px,py):g.moveTo(px,py);});g.stroke();g.setLineDash([]);};
  const hit=(x,t,col,lab)=>{dot(g,mp.X(x),ty(t),col,5.5);if(lab)text(g,lab,mp.X(x)+9,ty(t)+4,{size:11,bold:true,col,bg:C.panel});};
  if(E.mode==='wall'){const xw=mp.X(M.d);g.fillStyle='#9aa3ab';g.fillRect(xw,T0,6,BT-T0);
    if(.1<M.tmax){g.fillStyle=C.green;g.globalAlpha=.12;g.fillRect(mp.X(0)-34,ty(0),68,ty(.1)-ty(0));g.globalAlpha=1;text(g,'0.1 s 內分不出',mp.X(0)-30,ty(.1)+13,{size:10,col:C.green,bold:true});}
    poly([[0,0],[0,M.tmax]],C.ink,3);poly([[0,0],[-v*M.tmax,M.tmax]],C.snd,1.5,[4,4]);
    poly([[0,0],[M.d,M.d/v],[0,M.te]],C.snd,2.4);poly([[M.d,M.d/v],[0,M.te]],C.echo,2.4);
    hit(0,M.te,C.echo,'聽到回聲 '+fmtT(M.te));text(g,'人',mp.X(0),T0-3,{size:11,bold:true,align:'center'});text(g,'牆',xw+3,T0-3,{size:11,bold:true,align:'center'});}
  else if(E.mode==='cliff'){g.fillStyle=C.cliff;g.fillRect(mp.X(0)-6,T0,6,BT-T0);g.fillRect(mp.X(M.L),T0,6,BT-T0);
    poly([[M.s,0],[M.s,M.tmax]],C.ink,3);
    for(const dir of [-1,1]){let x=M.s,t=0,n=0,d=dir;while(t<M.tmax&&n<6){const wx=d<0?0:M.L;const dt=Math.abs(wx-x)/v;const t2=Math.min(t+dt,M.tmax);const x2=x+d*v*(t2-t);poly([[x,t],[x2,t2]],RC(n),2.2);x=x2;t=t2;n++;d=-d;}}
    for(const a of M.arr)if(a.t<=M.tmax)hit(M.s,a.t,RC(a.ims[0].n),'第'+a.k+'聲 '+fmtT(a.t));
    text(g,'甲',mp.X(0)-3,T0-3,{size:11,bold:true,align:'center'});text(g,'乙',mp.X(M.L)+3,T0-3,{size:11,bold:true,align:'center'});text(g,'人',mp.X(M.s),T0-3,{size:11,bold:true,align:'center'});}
  else{const xw=mp.X(M.D);g.fillStyle=C.cliff;g.fillRect(xw,T0,6,BT-T0);
    const pts=[[0,0],[M.sg*M.u*(M.te+M.re),M.te+M.re]];if(M.tmax>M.te+M.re)pts.push([M.sg*M.u*(M.te+M.re),M.tmax]);poly(pts,C.green,3);
    poly([[0,0],[M.D,M.D/v]],C.snd,2.4);poly([[M.D,M.D/v],[M.xh,M.te]],C.echo,2.4);
    hit(M.xh,M.te,C.echo,'聽到回聲 '+fmtT(M.te));text(g,VEH[E.C.veh].n,mp.X(0),T0-3,{size:11,bold:true,align:'center'});text(g,VEH[E.C.veh].wall,xw+3,T0-3,{size:11,bold:true,align:'center'});}
  const yn=ty(Math.min(E.t,M.tmax));line(g,mp.L-4,yn,W-8,yn,C.accent,1.5,[6,4]);text(g,'現在',W-10,yn-4,{size:10,col:C.accent,bold:true,align:'right'});}

// ================= 耳朵聽到的 =================
function drawEar(g,W,H,M){g.clearRect(0,0,W,H);g.fillStyle=C.panel;g.fillRect(0,0,W,H);const L=14,R=W-14,base=H*.58,X=t=>L+t/M.tmax*(R-L),amp=H*.36;
  if(E.mode!=='depth'&&.1<M.tmax){g.fillStyle=C.green;g.globalAlpha=.12;g.fillRect(X(0),6,X(.1)-X(0),H-26);g.globalAlpha=1;}
  line(g,L,base,R,base,C.line,1);
  for(const h of M.hear){const x0=X(h.t),shown=E.t>=h.t,col=h.t===0?C.snd:C.echo;const w=Math.max(10,Math.min(26,(R-L)*.04));
    g.strokeStyle=col;g.lineWidth=1.6;g.globalAlpha=shown?1:.18;g.beginPath();for(let k=0;k<=60;k++){const u=k/60,x=x0+u*w,y=base-amp*h.a*Math.exp(-u*3.2)*Math.sin(u*TAU*5);k?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();g.globalAlpha=1;
    if(shown)text(g,h.lab,x0+2,H-6,{size:11,col,bold:true});}
  if(E.mode!=='depth'&&.1<M.tmax)text(g,'← 0.1 s →',X(.05),14,{size:10,col:C.green,bold:true,align:'center'});
  const xn=X(Math.min(E.t,M.tmax));line(g,xn,4,xn,H-18,C.accent,1.5);}
