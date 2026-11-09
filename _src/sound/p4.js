
// ================= 測深 =================
function zAt(M,t){const tt=t<=M.te/2?t:M.te-t;let z=0,acc=0;for(let i=0;i<M.th.length;i++){if(tt<=acc+M.seg[i]){return z+(tt-acc)*M.vs[i];}acc+=M.seg[i];z+=M.th[i];}return z;}
function drawD(g,W,H,M){const D=E.D,S=M.S,sc=D.sc,t=E.t;g.fillStyle=C.panel;g.fillRect(0,0,W,H);
  const xl=24,xr=Math.max(W*.6,260),cx=(xl+xr)/2,top=sc==='heli'||sc==='sub'?54:62,bot=H-34;const tot=M.th.reduce((a,b)=>a+b,0)||1;const k=(bot-top)/tot;
  const dir=S.dir,y0=dir>0?top:bot,Y=z=>y0+dir*z*k;const yEnd=Y(tot);const y1=Y(M.th[0]);
  const shaft=sc==='well'||sc==='spk',sw=shaft?64:xr-xl;
  if(shaft){g.fillStyle=C.sky;g.fillRect(0,0,W,top);g.fillStyle=C.cliff;g.globalAlpha=.55;g.fillRect(0,top,xr+20,H-top);g.globalAlpha=1;
    g.fillStyle=C.sky;g.fillRect(cx-sw/2,top,sw,yEnd-top);if(sc==='spk'){g.fillStyle=C.sea;g.fillRect(cx-sw/2,y1,sw,yEnd-y1);line(g,cx-sw/2,y1,cx+sw/2,y1,C.snd,1.5);}
    line(g,cx-sw/2-4,yEnd+2,cx+sw/2+4,yEnd+2,C.ink,4);text(g,'井底',cx+sw/2+8,yEnd+6,{size:12,bold:true});line(g,0,top,xr+20,top,C.ink,1.5);
    if(sc==='well')person(g,cx-sw/2-18,top,1,C.ink,t<M.tmax*.05?1:0);else{speaker(g,cx-sw/2-10,top-18);text(g,'← 大樓',4,top-30,{size:11,col:C.muted});}}
  else if(sc==='sonar'){g.fillStyle=C.sky;g.fillRect(0,0,W,top);g.fillStyle=C.sea;g.fillRect(0,top,W,yEnd-top);g.fillStyle=C.cliff;g.fillRect(0,yEnd,W,H-yEnd);
    for(let i=0;i<8;i++){const fx=xl+40+i*((xr-xl-80)/7);g.fillStyle=C.muted;g.beginPath();g.ellipse(fx,top+(yEnd-top)*.45+Math.sin(i*1.7)*8,7,3,0,0,TAU);g.fill();}
    text(g,'魚群／海底',xr-6,yEnd-6,{size:11,col:C.muted,align:'right'});ship(g,cx,top,1);}
  else if(sc==='heli'){g.fillStyle=C.sky;g.fillRect(0,0,W,y1);g.fillStyle=C.sea;g.fillRect(0,y1,W,H-y1);line(g,0,y1,xr+20,y1,C.snd,1.5);text(g,'水面',xl,y1-5,{size:11,col:C.snd,bold:true});heli(g,cx,top-14);sub(g,cx,yEnd+12);}
  else if(sc==='sub'){g.fillStyle=C.sky;g.fillRect(0,0,W,y1);g.fillStyle=C.sea;g.fillRect(0,y1,W,H-y1);line(g,0,y1,xr+20,y1,C.snd,1.5);text(g,'水面',xl,y1-5,{size:11,col:C.snd,bold:true});heli(g,cx,yEnd-14);sub(g,cx,bot+12);}
  else{g.fillStyle='#9aa3ab';g.fillRect(xl,top,xr-xl,H-top-6);g.strokeStyle=C.ink;g.lineWidth=3;g.beginPath();for(let x=cx-50;x<=cx+50;x+=10)g.lineTo(x,yEnd+((x/10)%2?4:-4));g.stroke();
    text(g,'裂縫',cx+56,yEnd+4,{size:12,bold:true});g.fillStyle=C.ink;g.fillRect(cx-14,top-22,28,22);text(g,'探頭',cx+20,top-8,{size:11});text(g,'機翼金屬',xl+6,H-14,{size:11,col:'#fff',bold:true});}
  // 聲波
  if(t>0&&t<M.te){const z=zAt(M,t),y=Y(z),back=t>M.te/2;const w=shaft?sw-8:Math.min(170,(xr-xl)*.6);
    g.save();g.globalAlpha=.25;line(g,cx-w/2,y-dir*(back?-6:6),cx+w/2,y-dir*(back?-6:6),back?C.echo:C.snd,6);g.restore();line(g,cx-w/2,y,cx+w/2,y,back?C.echo:C.snd,3.5);
    arrow(g,cx+w/2+12,y,cx+w/2+12,y+(back?-dir:dir)*16,back?C.echo:C.snd,2);}
  if(t>=M.te)text(g,'收到回聲！',cx,dir>0?top-(sc==='heli'?40:46):bot+28,{col:C.echo,size:13,bold:true,align:'center',bg:C.panel});
  // 尺寸
  let z=0;const xd=xr+16;M.th.forEach((h,i)=>{const ya=Y(z),yb=Y(z+h);z+=h;if(Math.abs(yb-ya)<6)return;const ym=(ya+yb)/2;
    line(g,xd,ya,xd,yb,C.ink,1.4);line(g,xd-6,ya,xd+6,ya,C.ink,1.4);line(g,xd-6,yb,xd+6,yb,C.ink,1.4);
    text(g,S.L[i].m+' '+fmtM(h),xd+10,ym-2,{size:13,bold:true});text(g,'聲速 '+nf(M.vs[i],1)+' m/s',xd+10,ym+15,{size:11,col:C.muted});});
  if(M.bad)text(g,'時間太短：第一段來回就不只這麼久了',W-10,H-8,{col:'#c0453b',size:12,bold:true,align:'right'});}
function drawDT(g,W,H,M){g.clearRect(0,0,W,H);g.fillStyle=C.panel;g.fillRect(0,0,W,H);const L=14,R=W-14,y=H*.42,bh=Math.min(40,H*.3);
  const parts=[];M.seg.forEach((s,i)=>parts.push({s,i,back:false}));M.seg.slice().reverse().forEach((s,j)=>parts.push({s,i:M.seg.length-1-j,back:true}));
  const X=t=>L+t/M.te*(R-L);let acc=0;
  parts.forEach(p=>{const xa=X(acc),xb=X(acc+p.s);acc+=p.s;g.fillStyle=p.back?C.echo:C.snd;g.globalAlpha=p.i%2?.35:.6;g.fillRect(xa,y-bh/2,xb-xa,bh);g.globalAlpha=1;
    g.strokeStyle=C.panel;g.lineWidth=2;g.strokeRect(xa,y-bh/2,xb-xa,bh);
    if(xb-xa>48)text(g,M.S.L[p.i].m+' '+fmtT(p.s),(xa+xb)/2,y+5,{size:11,bold:true,align:'center',col:C.ink});});
  text(g,'去程 →',L,y-bh/2-6,{size:11,col:C.snd,bold:true});text(g,'← 回程',R,y-bh/2-6,{size:11,col:C.echo,bold:true,align:'right'});
  text(g,'回聲時間 ＝ '+fmtT(M.te),(L+R)/2,y+bh/2+18,{size:12,bold:true,align:'center'});
  const xn=X(Math.min(E.t,M.te));line(g,xn,y-bh/2-2,xn,y+bh/2+2,C.accent,2.5);}

// ================= 聲納測海底 =================
const TSC=34;
function geoM(W,H){const ys=58,L=26,R=W-26,xs=i=>L+(i+.5)*(R-L)/NM,yd=t=>ys+18+t/TSC*(H-ys-30);return {ys,L,R,xs,yd};}
function mPhase(M,i){const u=E.t-i*PM;const dp=1.7*M.ts[i]/Math.max(...M.ts);return {u,dp,ping:u-.6};}
function drawM(g,W,H,M){const Gm=geoM(W,H),{ys,xs,yd}=Gm;g.fillStyle=C.sky;g.fillRect(0,0,W,ys);g.fillStyle=C.sea;g.fillRect(0,ys,W,H-ys);line(g,0,ys,W,ys,C.snd,1.2);
  const pts=[[0,yd(M.ts[0])]].concat(M.ts.map((t,i)=>[xs(i),yd(t)])).concat([[W,yd(M.ts[NM-1])]]);
  if(E.M.hide){g.fillStyle=C.muted;g.globalAlpha=.35;g.fillRect(0,ys+14,W,H-ys-14);g.globalAlpha=1;text(g,'海底遮起來了：看下方的回聲時間猜猜看',W/2,(ys+H)/2,{size:14,bold:true,align:'center',bg:C.panel});}
  else{g.fillStyle=C.cliff;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.lineTo(W,H);g.lineTo(0,H);g.closePath();g.fill();}
  for(let i=0;i<NM;i++){text(g,'第'+(i+1)+'站',xs(i),ys-38,{size:11,col:C.muted,align:'center'});line(g,xs(i),ys-32,xs(i),ys-26,C.muted,1);}
  let i=clamp(Math.floor(E.t/PM),0,NM-1);const ph=mPhase(M,i);let sx;
  if(ph.u<.6){const xa=i?xs(i-1):Gm.L-30;sx=lerp(xa,xs(i),clamp(ph.u/.6,0,1));}else sx=xs(i);
  ship(g,sx,ys,1);
  for(let j=0;j<=i;j++){const p=mPhase(M,j);if(p.ping<0)continue;const q=p.ping/p.dp;if(q>=1){if(!E.M.hide)dot(g,xs(j),yd(M.ts[j]),C.echo,4);continue;}
    const yy=q<.5?lerp(ys+6,yd(M.ts[j]),q*2):lerp(yd(M.ts[j]),ys+6,(q-.5)*2);
    line(g,xs(j)-22,yy,xs(j)+22,yy,q<.5?C.snd:C.echo,3.5);}
  text(g,'東 →',W-8,ys-8,{size:12,bold:true,align:'right'});
  if(!E.M.hide)M.ts.forEach((t,j)=>handle(g,xs(j),yd(t),7));}
function drawMT(g,W,H,M){g.clearRect(0,0,W,H);g.fillStyle=C.panel;g.fillRect(0,0,W,H);const L=26,R=W-26,xs=i=>L+(i+.5)*(R-L)/NM,top=22,yd=t=>top+t/TSC*(H-top-18);
  line(g,L-10,top,R+10,top,C.ink,1.5);text(g,'回聲時間往下畫 ↓',L-10,14,{size:11,col:C.muted});
  const ends=[];for(let j=0;j<NM;j++){const p=mPhase(M,j);if(p.ping<=0)continue;const q=clamp(p.ping/p.dp,0,1);const el=q*M.ts[j];
    g.fillStyle=q>=1?C.echo:C.snd;g.globalAlpha=.75;g.fillRect(xs(j)-12,top,24,yd(el)-top);g.globalAlpha=1;
    if(q>=1){ends.push([xs(j),yd(M.ts[j])]);text(g,M.ts[j]+' s',xs(j),yd(M.ts[j])+14,{size:11,bold:true,align:'center'});}}
  if(ends.length>1){g.strokeStyle=C.ink;g.lineWidth=2;g.setLineDash([5,4]);g.beginPath();ends.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();g.setLineDash([]);}}

// ================= 反射定律 =================
function geoF(W,H){const cx=W*.46,py=H*.16,g0=H*.12,Lt=Math.min(H*.56,W*.42);return {cx,py,g0,Lt};}
function tubeAt(G,ang,side){const a=ang*D2R,d=[side*Math.sin(a),Math.cos(a)];return {a:[G.cx+d[0]*G.g0,G.py+d[1]*G.g0],b:[G.cx+d[0]*(G.g0+G.Lt),G.py+d[1]*(G.g0+G.Lt)],d};}
function loudF(){const r=RF[E.F.mat];return r*Math.exp(-(((E.F.ang-40)/9)**2));}
function drawF(g,W,H){const G=geoF(W,H),F=E.F,r=RF[F.mat],t=E.t;g.fillStyle=C.panel;g.fillRect(0,0,W,H);g.fillStyle=C.grid;g.fillRect(0,G.py,W,H-G.py);
  const pw=Math.min(170,W*.24);if(F.mat!=='none'){g.fillStyle={iron:'#7d8790',wood:'#b08350',cotton:'#e9e2d0',sponge:'#e7c64a'}[F.mat];g.fillRect(G.cx-pw,G.py-14,pw*2,14);g.strokeStyle=C.ink;g.lineWidth=1;g.strokeRect(G.cx-pw,G.py-14,pw*2,14);
    text(g,RFN[F.mat],G.cx+pw+8,G.py-3,{size:13,bold:true});}else text(g,'（沒有反射板）',G.cx+pw+8,G.py-3,{size:13,col:C.muted});
  line(g,G.cx,G.py,G.cx,G.py+G.g0+G.Lt+10,C.muted,1.3,[6,5]);text(g,'法線',G.cx+4,G.py+G.g0+G.Lt+22,{size:11,col:C.muted});
  const T1=tubeAt(G,40,-1),T2=tubeAt(G,F.ang,1);
  [[20,'甲'],[40,'乙'],[62,'丙']].forEach(([a,n])=>{const T=tubeAt(G,a,1);text(g,n,T.b[0]+T.d[0]*46,T.b[1]+T.d[1]*46+5,{size:15,bold:true,col:a===F.ang?C.accent:C.muted,align:'center'});});
  const mir=tubeAt(G,40,1);line(g,G.cx,G.py,mir.b[0],mir.b[1],C.echo,1.4,[3,5]);
  const tube=T=>{g.lineCap='round';line(g,T.a[0],T.a[1],T.b[0],T.b[1],C.ink,20);line(g,T.a[0],T.a[1],T.b[0],T.b[1],C.panel,14);g.lineCap='butt';};
  tube(T1);tube(T2);
  // 時鐘與耳朵
  const ck=[T1.b[0]+T1.d[0]*20,T1.b[1]+T1.d[1]*20];g.fillStyle=C.panel;g.strokeStyle=C.ink;g.lineWidth=2.5;g.beginPath();g.arc(ck[0],ck[1],16,0,TAU);g.fill();g.stroke();
  const tk=(t%1)*TAU;line(g,ck[0],ck[1],ck[0]+Math.sin(tk)*11,ck[1]-Math.cos(tk)*11,C.accent,2);line(g,ck[0],ck[1],ck[0],ck[1]-7,C.ink,2.5);
  ear(g,T2.b[0]+T2.d[0]*18,T2.b[1]+T2.d[1]*18,C.ink);
  // 角度
  g.strokeStyle=C.snd;g.lineWidth=2;g.beginPath();g.arc(G.cx,G.py,G.g0*.75,Math.PI/2,Math.PI/2+40*D2R);g.stroke();
  text(g,'入射角 40°',G.cx-G.g0*.9,G.py+G.g0*1.2,{size:12,bold:true,col:C.snd,align:'right'});
  g.strokeStyle=C.echo;g.beginPath();g.arc(G.cx,G.py,G.g0*.6,Math.PI/2-40*D2R,Math.PI/2);g.stroke();
  text(g,'反射角 40°',G.cx+G.g0*.95,G.py+G.g0*.95,{size:12,bold:true,col:C.echo});
  // 聲音脈衝（每 1 秒滴答一次）
  const L1=G.g0+G.Lt;for(let k=Math.floor(t)-2;k<=Math.floor(t);k++){const ph=t-k;if(ph<0)continue;
    if(ph<.55){const f=ph/.55;const p=[lerp(T1.b[0],G.cx,f*(1)),lerp(T1.b[1],G.py,f)];const q=f*L1;const px=T1.b[0]-T1.d[0]*q,py=T1.b[1]-T1.d[1]*q;dot(g,px,py,C.snd,5);}
    else if(ph<1.25){const f=(ph-.55)/.7,rr=f*L1;
      if(r>0){g.save();g.globalAlpha=(1-f*.5)*Math.max(.12,r);g.strokeStyle=C.echo;g.lineWidth=4;g.beginPath();const a0=Math.PI/2-40*D2R;g.arc(G.cx,G.py,rr,a0-.3,a0+.3);g.stroke();g.restore();}
      else{const px=G.cx+T1.d[0]*-rr,py=G.py-T1.d[1]*rr;if(py>4)dot(g,px,py,C.snd,4);}
      if(f>.93&&loudF()>.05){g.save();g.globalAlpha=loudF();g.strokeStyle=C.echo;g.lineWidth=2;const ex=T2.b[0]+T2.d[0]*18,ey=T2.b[1]+T2.d[1]*18;for(let j=1;j<=3;j++){g.beginPath();g.arc(ex,ey,8+j*6,0,TAU);g.stroke();}g.restore();}}}
  // 響度表
  const lv=loudF(),mx=W-44,mh=H*.55,my=H*.25;g.strokeStyle=C.ink;g.lineWidth=1.5;g.strokeRect(mx,my,22,mh);g.fillStyle=C.echo;g.fillRect(mx+2,my+mh-mh*lv,18,mh*lv);
  text(g,'聽到的',mx+11,my-20,{size:11,align:'center'});text(g,'響度',mx+11,my-6,{size:11,align:'center'});
  handle(g,T2.b[0],T2.b[1],9);}

// ================= 結果文字 =================
const HOW={
  wall:['聲音從人出發（藍色圓），碰到牆反射回來（橘色圓）——橘色圓好像是從牆後面的「鏡像位置」發出的。','小圓點追蹤一小段聲音：去程 d、回程 d，來回 2d ＝ v × t。','中間的「位置－時間圖」：時間往下走，聲音的路線是斜線，碰到牆就折回來。','綠色虛線是 0.1 秒的界線：人離牆太近，回聲和原聲重疊，只會覺得聲音比較大。','按「🔊 用真實時間聽」：用真的時間差播放原聲和回聲，比較 5 m 和 50 m。'],
  cliff:['兩邊峭壁都會反射；顏色代表反射了幾次：藍 0 次、橘 1 次、紫 2 次、綠 3 次。','人的左右各有一顆小圓點，追蹤往甲、往乙出發的聲音，碰壁就折回。','「位置－時間圖」的折線碰到「人」那條直線，就是聽到一聲回聲。','「已知聽到回聲的時間」：設定先後聽到的時間，自動算距離；「已知距離」：可以拖曳人的位置。'],
  move:['在藍色虛線處鳴笛，之後繼續前進；聲音碰到山壁反射回來，在半路和它相遇。','地面下的線段圖：藍＋橘是聲音走的路，綠色是船（火車、海豚）走的路。駛向山壁：兩者相加 ＝ 2D；駛離：兩者相減 ＝ 2D。','「位置－時間圖」：綠色斜線是船，藍、橘是聲音；兩線交會就是聽到回聲。','把速率調成 0，就變回「對牆喊」。反應時間：聽到回聲後還要多久才停下（向上 114 #38）。'],
  depth:['聲音往下到底（或往上到直升機）再反射回來，回聲時間是「來回」的時間，所以距離要 ÷ 2。','經過兩種介質時，各段的聲速不同，要分段算時間再相加；下方時間軸顯示每一段花了多少時間。','「已知回聲時間」：拖時間，算出深度；「已知深度」：拖深度，算出回聲時間。'],
  map:['探測船往東開，每到一站就向正下方發出聲納，記錄回聲時間。','下方把每一站的回聲時間「往下」畫：時間越長＝海越深，連起來就是海底的形狀。','可以拖曳海底的橘點改變地形；勾「先遮住海底，猜猜看」來練習。'],
  law:['左邊水管放時鐘，右邊水管用耳朵聽；聲音從水管射出，碰到反射板後反射。','聲音反射也遵守反射定律：入射角＝反射角（都從法線量）。','拖曳右邊水管末端的橘點，或點甲、乙、丙，看哪個位置最大聲；換成棉布、海綿，反射的聲音變小。']};
const HOWT={wall:'對牆喊：怎麼看',cliff:'兩峭壁：怎麼看',move:'邊走邊鳴笛：怎麼看',depth:'測深：怎麼看',map:'聲納測海底：怎麼看',law:'反射定律：怎麼看'};
const vline=()=>E.med==='air'?`v ＝ 331 ＋ 0.6×${E.T} ＝ ${nf(vAir(E.T),1)} m/s`:E.med==='water'?'水中 v ＝ 1500 m/s':`v ＝ ${E.vc} m/s`;
function results(M){let big='',f='',ck=[];const v=M.v;
  if(E.mode==='wall'){const d17=v*.1/2;
    big=M.te<.1?`回聲只晚 <span class="mono">${fmtT(M.te)}</span>：和原聲混在一起，聽起來比較響亮`:`回聲 <span class="mono">${fmtT(M.te)}</span> 後傳回：聽得到兩個聲音`;
    f=vline()+'<br>'+(E.A.giv==='d'?`來回 2d ＝ v × t → 2×${nf(M.d,2)} ＝ ${nf(v,1)} × t → t ＝ ${fmtT(M.te)}`:`d ＝ v × t ÷ 2 ＝ ${nf(v,1)} × ${nf(E.A.tt,3)} ÷ 2 ＝ ${fmtM(M.d)}`)+`<br>分得出回聲：t ≥ 0.1 s → d ≥ ${nf(v,1)}×0.1÷2 ＝ ${nf(d17,2)} m`;
    ck=[[M.te>=.1?'ok':'no',M.te>=.1?`人離牆 ${fmtM(M.d)} ≥ ${nf(d17,1)} m，分得出原聲和回聲。`:`人離牆不到 ${nf(d17,1)} m：回聲在 0.1 s 內回來，和原聲重疊——小房間不是沒有反射，而是分不出來，所以說話特別大聲。`],
      ['info','回聲和原聲：波速、頻率、波長都一樣，只有振幅（響度）變小。'],
      [E.A.mat==='hard'?'info':'ok',E.A.mat==='hard'?'光滑堅硬的表面反射強：傳聲筒、聽診器、音樂廳的反射板都利用這點。':'柔軟、多孔、凹凸不平的表面會吸收聲音，回聲變小：禮堂、歌劇院用布幕、地毯、吸音板。']];
    if(E.med==='air')ck.push(['info',`氣溫越低，聲速越慢，回聲越晚回來（現在 ${E.T} °C）。`]);}
  else if(E.mode==='cliff'){const first=M.arr.slice(0,3);
    big=first.map(a=>`第${a.k}聲 <span class="mono">${fmtT(a.t)}</span>（${a.ims.length>1?'甲乙同時':a.lab}）`).join('、');
    f=vline()+`<br>人到甲：d₁ ＝ ${nf(v,1)} × ${fmtT(2*M.d1/v).replace(' s','')} ÷ 2 ＝ ${fmtM(M.d1)}<br>人到乙：d₂ ＝ ${nf(v,1)} × ${fmtT(2*M.d2/v).replace(' s','')} ÷ 2 ＝ ${fmtM(M.d2)}<br>兩峭壁相距 L ＝ d₁ ＋ d₂ ＝ ${fmtM(M.L)}<br>甲乙同時傳來的回聲：聲音走 2L ＝ ${fmtM(2*M.L)}，花 ${fmtT(2*M.L/v)}`;
    ck=[['info','只碰一面峭壁的回聲：時間 2d₁÷v、2d₂÷v。'],['info','往甲的聲音反彈到乙再回來、往乙的聲音反彈到甲再回來：兩條路都走 2L，同時到達，所以這一聲比較大聲。'],['info','再後面的回聲反射更多次，一聲比一聲小。']];}
  else if(E.mode==='move'){const V=VEH[E.C.veh],to=M.sg>0;
    big=`${V.n}在離${V.wall} <span class="mono">${fmtM(M.D)}</span> 處${V.hn}，<span class="mono">${fmtT(M.te)}</span> 後聽到回聲`;
    f=vline()+'<br>'+(to?`聲音走的 ＋ ${V.n}走的 ＝ 2D<br>(v ＋ u) × t ＝ 2D → (${nf(v,1)} ＋ ${M.u}) × ${nf(M.te,3)} ＝ 2 × ${nf(M.D,2)}`:`聲音走的 − ${V.n}走的 ＝ 2D<br>(v − u) × t ＝ 2D → (${nf(v,1)} − ${M.u}) × ${nf(M.te,3)} ＝ 2 × ${nf(M.D,2)}`)+`<br>聽到回聲時，離${V.wall} ${fmtM(M.D-M.xh)}`;
    ck=[['info',`如果${V.n}不動，回聲要 ${fmtT(2*M.D/v)}；${to?'駛向'+V.wall+'，回聲提早':'駛離'+V.wall+'，回聲延後'}到 ${fmtT(M.te)}。`],['info','u ＝ 0 時就是對牆喊：2D ＝ v × t。']];
    if(M.re>0){const left=M.D-M.sg*M.u*(M.te+M.re);ck.push([left>=-1e-9?'ok':'no',`聽到回聲後再前進 u × ${f2(M.re)} ＝ ${fmtM(M.u*M.re)}，停下時離${V.wall} ${fmtM(left)}${left<-1e-9?'：撞上了！':''}`]);}}
  else if(E.mode==='depth'){const S=M.S,sc=E.D.sc;
    big=sc==='spk'?`井深 <span class="mono">${fmtM(2*M.h)}</span>（空氣段、水段各 ${fmtM(M.h)}）`:`${S.hl} <span class="mono">${fmtM(M.h)}</span>，回聲時間 <span class="mono">${fmtT(M.te)}</span>`;
    if(S.L.length===1)f=`${S.hl} ＝ v × t ÷ 2 ＝ ${nf(M.vs[0],1)} × ${fmtS(M.te)} ÷ 2 ＝ ${fmtM(M.h)}`;
    else if(S.L[0].fix)f=`t ＝ 2×h₁÷v₁ ＋ 2×h₂÷v₂<br>${fmtS(M.te)} ＝ 2×${nf(M.h0,2)}÷${M.vs[0]} ＋ 2×h÷${M.vs[1]}<br>${S.L[0].m}來回 ${fmtS(M.seg[0]*2)}，剩下 ${fmtS(M.te-M.seg[0]*2)} 在${S.L[1].m}中來回<br>h ＝ ${M.vs[1]} × ${nf(M.te-M.seg[0]*2,4)} ÷ 2 ＝ ${fmtM(M.h)}`;
    else f=`空氣段＝水段＝h：2h÷${M.vs[0]} ＋ 2h÷${M.vs[1]} ＝ ${fmtS(M.te)}<br>h ＝ ${fmtM(M.h)}，井深 2h ＝ ${fmtM(2*M.h)}<br>喇叭到大樓：${M.vs[0]} × ${fmtS(M.te)} ＝ ${fmtM(M.vs[0]*M.te)}`;
    ck=[['info','回聲時間是來回的時間：距離 ＝ 速率 × 時間 ÷ 2。'],['info',S.L.length>1?'聲音在水中比空氣中快約 4～5 倍，所以同樣的距離，水中花的時間短很多。':sc==='metal'?'固體中聲速最快，時間只有幾微秒，要用儀器量（超聲波探傷）。':'聲速會隨氣溫改變：v ＝ 331 ＋ 0.6T。']];}
  else if(E.mode==='map'){const done=M.ts.filter((t,j)=>{const p=mPhase(M,j);return p.ping>=p.dp;});
    big=done.length?`已測 ${done.length} 站：<span class="mono">${done.join('、')}</span> 秒`:'探測船出發……';
    f='深度 ＝ v × t ÷ 2：回聲時間越長 → 海越深<br>'+M.ts.map((t,j)=>`第${j+1}站 ${t} s → ${nf(1500*t/2/1000,2)} km`).join('、');
    const mx=M.ts.indexOf(Math.max(...M.ts)),mn=M.ts.indexOf(Math.min(...M.ts));
    ck=[['info','把每一站的回聲時間由上往下畫，連起來就是海底的形狀。'],['info',`最深在第 ${mx+1} 站、最淺在第 ${mn+1} 站。`]];}
  else{const lv=loudF();big=E.F.ang===40&&E.F.mat!=='none'?`乙：入射角＝反射角＝40°，滴答聲最清楚`:E.F.mat==='none'?'沒有反射板：聲音直直出去，聽不到':`水管在 ${E.F.ang}°，偏離反射方向，聲音${lv<.2?'很小':'變小'}`;
    f='反射定律：入射角 ＝ 反射角（都從法線量起）<br>反射板：'+RFN[E.F.mat]+'，反射的比例約 '+Math.round(RF[E.F.mat]*100)+'%';
    ck=[['info','聲音和光一樣遵守反射定律，所以耳朵要放在反射方向上。'],['info','鐵板、木板光滑堅硬，反射強；棉布、海綿柔軟多孔，吸收聲音，反射弱。']];}
  return {big,f,ck};}
let lastRes='';
function showResults(M){const R=results(M);const key=R.big+R.f+JSON.stringify(R.ck);if(key===lastRes)return;lastRes=key;$('rEbig').innerHTML=R.big;$('rEf').innerHTML=R.f;checks($('rEc'),R.ck);}
function showHow(){$('howT').textContent=HOWT[E.mode];$('howL').innerHTML=HOW[E.mode].map(s=>`<li>${s}</li>`).join('');
  $('capX').textContent={wall:'位置－時間圖（橫軸是位置，時間往下走）',cliff:'位置－時間圖（橫軸是位置，時間往下走）',move:'位置－時間圖（橫軸是位置，時間往下走）',depth:'時間軸：每一段各花多少時間',map:'每一站的回聲時間'}[E.mode]||'';
  $('hintE').textContent={wall:'可以拖曳牆（已知距離時）。',cliff:'已知距離時，可以拖曳人（地面上的橘點）。',move:'',depth:'',map:'拖曳海底的橘點可以改變地形。',law:'拖曳右邊水管末端的橘點，改變聽的位置。'}[E.mode];}
