
// =====================================================================
// 4 樂器與音調
// =====================================================================
const STRPRE={uke:[{n:'1 號（最細）',thk:.7},{n:'2 號（次粗）',thk:1.3},{n:'3 號（最粗）',thk:1.6},{n:'4 號（次細）',thk:1}],
  sham:[{n:'粗弦',thk:1.6},{n:'中弦',thk:1.2},{n:'細弦',thk:.8}],free:[{n:'這條弦',thk:1}]};
const BOTPRE={glass:{n:'玻璃杯',w:[.2,.4,.6,.8],L:.12,shape:'glass'},tube:{n:'試管',w:[.15,.35,.55,.75],L:.15,shape:'tube'},cyl:{n:'量筒',w:[.2,.5,.8],L:.25,shape:'cyl'}};
const IN={mode:'string',pre:'uke',sel:0,str:[],pow:.7,t:0,pl:{},act:'blow',bpre:'glass',bot:[],tubeV:'len',tubeA:'hit',res:440,box:true,hitR:-99};
function inLoadStr(p){IN.pre=p;IN.str=STRPRE[p].map(s=>({n:s.n,thk:s.thk,ten:1,len:1}));IN.sel=0;IN.pl={};}
function inLoadBot(p){IN.bpre=p;IN.bot=BOTPRE[p].w.slice();IN.pl={};}
inLoadStr('uke');inLoadBot('glass');
let WI=600,HI=300;
const strF=s=>300/s.thk*Math.sqrt(s.ten)/s.len;
const SOL=['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];
const noteName=f=>{const m=Math.round(12*Math.log2(f/261.63));const o=Math.floor(m/12);const k=((m%12)+12)%12;return SOL[k]+(o===0?'':o>0?'（高'+o+'個八度）':'（低'+(-o)+'個八度）');};
function botF(i){const P=BOTPRE[IN.bpre],w=IN.bot[i];return IN.act==='blow'?340/(4*P.L*(1-w)):1500/(1+1.4*w);}
const TUBL=[1,.85,.7,.55],TUBW=[1,1.5,2,2.5];
function tubeF(i){const L=IN.tubeV==='len'?TUBL[i]:1,w=IN.tubeV==='wall'?TUBW[i]:1;return IN.tubeA==='hit'?600*w/(L*L):340/(4*.3*L);}
function inUI(){const m=IN.mode;segSet($('inMode'),m);document.querySelectorAll('.inc').forEach(e=>e.hidden=e.dataset.m!==m);
  segSet($('inStrPre'),IN.pre);const sel=$('inStrSel');sel.innerHTML='';IN.str.forEach((s,i)=>{const b=document.createElement('button');b.dataset.v=i;b.textContent=s.n.split('（')[0];sel.appendChild(b);});segSet(sel,String(IN.sel));
  const S=IN.str[IN.sel];$('inTen').value=S.ten;$('inTeno').textContent=S.ten<.9?'鬆':S.ten>1.1?'緊':'標準';$('inThk').value=S.thk;$('inThko').textContent=S.thk<.9?'細':S.thk>1.3?'粗':'中';
  $('inLen').value=S.len;$('inLeno').textContent=Math.round(S.len*100)+'%';$('inPow').value=IN.pow;$('inPowo').textContent=IN.pow<.5?'輕':IN.pow>.8?'重':'中';
  $('inThk').disabled=IN.pre!=='free'&&false;
  segSet($('inAct'),IN.act);segSet($('inBotPre'),IN.bpre);segSet($('inTubeV'),IN.tubeV);segSet($('inTubeA'),IN.tubeA);segSet($('inRes'),String(IN.res));$('inBox').checked=IN.box;
  $('inHint').textContent={string:'點一條弦就會撥動它（也會發出聲音）；用滑桿調整選取那條弦的鬆緊、粗細、按壓位置。',bottle:'點容器就會吹（或敲）它並發出聲音；拖曳水面的橘點改變水量。',tube:'點管子就會敲（或吹）它並發出聲音。',reso:'按「敲左邊音叉」，看右邊的音叉會不會跟著振動。'}[m];
  $('inHowT').textContent={string:'弦樂器：怎麼看',bottle:'瓶子與試管：怎麼看',tube:'敲管子、吹管子：怎麼看',reso:'共鳴：怎麼看'}[m];
  $('inHow').innerHTML=({string:['弦振動得越快，頻率越高、音調越高。','弦越緊、越細、振動部分越短 → 音調越高（吉他按弦、調音就是在改這些）。','撥得越用力，振幅越大 → 響度越大，但音調不變；撥得快慢（節奏）也不改變音調。'],
    bottle:['吹氣時振動的是「空氣柱」：水越多，空氣柱越短，音調越高。','敲擊時振動的是「杯子（含水）」：水越多，振動越慢，音調越低。','兩種方法的高低順序剛好相反——先想清楚是誰在振動。'],
    tube:['敲擊時振動的是管子本身：同材質，越短、管壁越厚 → 音調越高。','對管口吹氣時振動的是管內空氣柱：只和空氣柱長短有關，越短越高；管壁厚薄不影響。','下端封閉的管子，空氣柱長度約是波長的 ¼：λ ＝ 4L，f ＝ v ÷ 4L。'],
    reso:['兩支頻率相同的音叉，敲一支，另一支也會跟著振動發聲：共振（共鳴）。','頻率不同就不會共振——即使大小、材質一樣。','共鳴箱：箱內空氣跟著振動，使聲音變大；小提琴、吉他的琴身也有這個作用。']})[m].map(s=>`<li>${s}</li>`).join('');}
segOn($('inMode'),v=>{IN.mode=v;hideStory();inUI();SIZE.inst();kick();});
segOn($('inStrPre'),v=>{inLoadStr(v);inUI();kick();});
segOn($('inStrSel'),v=>{IN.sel=+v;inUI();kick();});
[['inTen','ten'],['inThk','thk'],['inLen','len']].forEach(([id,k])=>$(id).addEventListener('input',()=>{IN.str[IN.sel][k]=+$(id).value;inUI();kick();}));
$('inPow').addEventListener('input',()=>{IN.pow=+$('inPow').value;inUI();});
segOn($('inAct'),v=>{IN.act=v;IN.pl={};inUI();kick();});
segOn($('inBotPre'),v=>{inLoadBot(v);inUI();kick();});
segOn($('inTubeV'),v=>{IN.tubeV=v;IN.pl={};inUI();kick();});
segOn($('inTubeA'),v=>{IN.tubeA=v;IN.pl={};inUI();kick();});
segOn($('inRes'),v=>{IN.res=+v;IN.hitR=-99;inUI();kick();});
$('inBox').addEventListener('change',()=>{IN.box=$('inBox').checked;kick();});
$('inHitR').addEventListener('click',()=>{IN.hitR=IN.t;const g=IN.box?.2:.07;tone(440,{gain:g,dur:3.5,decay:true});if(IN.res===440)tone(440,{gain:g*.6,dur:3.5,decay:true,at:.3});kick();});
function pluck(i){IN.pl[i]=IN.t;let f;if(IN.mode==='string'){f=strF(IN.str[i]);tone(f,{src:'piano',gain:.18*IN.pow,dur:1.6,decay:true});}
  else if(IN.mode==='bottle'){f=botF(i);tone(f,{src:IN.act==='blow'?'flute':'fork',gain:.1,dur:IN.act==='blow'?.9:1.2,decay:IN.act!=='blow'});}
  else{f=tubeF(i);tone(f,{src:IN.tubeA==='blow'?'flute':'piano',gain:.1,dur:1.1,decay:IN.tubeA!=='blow'});}kick();}
// 版面
function strGeo(W,H){const n=IN.str.length,L=110,R=W-50,top=H*.16,gap=Math.min(56,(H*.68)/n);return {n,L,R,y:i=>top+gap*(i+.5),gap};}
function botGeo(W,H){const n=IN.bot.length,w=Math.min(110,(W-80)/n-30),Hc=H*.55,base=H*.86;return {n,w,Hc,base,x:i=>40+(W-80)*(i+.5)/n};}
function tubeGeo(W,H){const n=4,top=H*.14,Lmax=H*.6,w=34;return {n,top,Lmax,w,x:i=>W*(i+1)/(n+1)};}
function rankOf(fs){const o=fs.map((f,i)=>[f,i]).sort((a,b)=>b[0]-a[0]);const r=[];o.forEach(([f,i],k)=>r[i]=k+1);return r;}
function drawInStr(g,W,H){const G=strGeo(W,H),t=IN.t;g.fillStyle=C.panel;g.fillRect(0,0,W,H);
  g.fillStyle='#c79a63';g.fillRect(G.L-14,G.y(0)-G.gap*.5,G.R-G.L+28,G.gap*G.n);g.fillStyle='#8a5a2b';g.fillRect(G.L-14,G.y(0)-G.gap*.5,10,G.gap*G.n);g.fillRect(G.R+4,G.y(0)-G.gap*.5,10,G.gap*G.n);
  text(g,'弦枕',G.L-9,G.y(0)-G.gap*.5-6,{size:10,align:'center',col:C.muted});text(g,'琴橋',G.R+9,G.y(0)-G.gap*.5-6,{size:10,align:'center',col:C.muted});
  const fs=IN.str.map(strF),rk=rankOf(fs);
  IN.str.forEach((s,i)=>{const y=G.y(i),xf=G.R-(G.R-G.L)*s.len,f=fs[i];const tp=IN.pl[i];const el=tp===undefined?99:t-tp;const A=el<6?Math.min(G.gap*.32,14)*IN.pow*Math.exp(-el/1.4):0;const fv=f/90;
    if(s.len<.995){line(g,G.L,y,xf,y,'#555',1.2+s.thk*2);}
    g.strokeStyle=i===IN.sel?C.accent:C.ink;g.lineWidth=1.2+s.thk*2;g.beginPath();for(let x=xf;x<=G.R;x+=3){const u=(x-xf)/(G.R-xf);const yy=y+A*Math.sin(Math.PI*u)*Math.cos(TAU*fv*el);x===xf?g.moveTo(x,yy):g.lineTo(x,yy);}g.stroke();
    if(s.len<.995){g.fillStyle='#e8b98f';g.beginPath();g.ellipse(xf,y-8,9,13,0,0,TAU);g.fill();}
    text(g,s.n,G.L-20,y+4,{size:12,bold:true,align:'right',col:i===IN.sel?C.accent:C.ink});
    text(g,`${Math.round(f)} Hz　${noteName(f)}`,G.R-8,y-8,{size:11,align:'right',col:C.muted});
    if(G.n>1)text(g,'第'+rk[i]+'高',G.R+22,y+4,{size:11,bold:true,col:rk[i]===1?C.echo:C.muted});});}
function glassShape(g,x,base,w,Hc,shape){g.beginPath();if(shape==='glass'){g.moveTo(x-w/2,base-Hc);g.lineTo(x-w*.38,base);g.lineTo(x+w*.38,base);g.lineTo(x+w/2,base-Hc);}
  else if(shape==='tube'){g.moveTo(x-w*.22,base-Hc);g.lineTo(x-w*.22,base-w*.22);g.arc(x,base-w*.22,w*.22,Math.PI,0,true);g.lineTo(x+w*.22,base-Hc);}
  else{g.moveTo(x-w*.3,base-Hc);g.lineTo(x-w*.3,base);g.lineTo(x+w*.3,base);g.lineTo(x+w*.3,base-Hc);}}
function drawInBot(g,W,H){const G=botGeo(W,H),P=BOTPRE[IN.bpre],t=IN.t;g.fillStyle=C.panel;g.fillRect(0,0,W,H);line(g,0,G.base,W,G.base,C.muted,2);
  const fs=IN.bot.map((w,i)=>botF(i)),rk=rankOf(fs);
  IN.bot.forEach((w,i)=>{const x=G.x(i),el=IN.pl[i]===undefined?99:t-IN.pl[i],act=el<1.4;const shake=act&&IN.act==='hit'?Math.sin(el*80)*3*Math.exp(-el*2):0;const yw=G.base-G.Hc*w;
    g.save();g.translate(shake,0);glassShape(g,x,G.base,G.w,G.Hc,P.shape);g.save();g.clip();g.fillStyle=C.sea;g.fillRect(x-G.w,yw,G.w*2,G.base-yw);
    if(act&&IN.act==='blow'){g.globalAlpha=.6*Math.exp(-el);for(let k=0;k<6;k++){const yy=G.base-G.Hc+((el*120+k*(G.Hc*(1-w))/6)%(G.Hc*(1-w)));line(g,x-G.w,yy,x+G.w,yy,C.echo,2);}g.globalAlpha=1;}
    if(act&&IN.act==='hit'){g.strokeStyle=C.snd;g.lineWidth=1.5;for(let k=1;k<=2;k++){g.beginPath();g.ellipse(x,yw,(k*8+el*30)%(G.w*.4),3,0,0,TAU);g.stroke();}}
    g.restore();g.strokeStyle=act&&IN.act==='hit'?C.echo:C.ink;g.lineWidth=act&&IN.act==='hit'?3.5:2.5;glassShape(g,x,G.base,G.w,G.Hc,P.shape);g.stroke();g.restore();
    handle(g,x,yw,8);text(g,'第'+rk[i]+'高',x,G.base-G.Hc-12,{size:12,bold:true,align:'center',col:rk[i]===1?C.echo:C.muted});
    text(g,Math.round(fs[i])+' Hz',x,G.base+18,{size:11,align:'center',col:C.muted});
    if(act)text(g,IN.act==='blow'?'空氣柱振動':'杯子＋水振動',x,G.base-G.Hc-30,{size:11,align:'center',col:C.echo,bold:true});
    if(act&&IN.act==='blow'){g.save();g.strokeStyle=C.snd;g.lineWidth=2;g.beginPath();g.moveTo(x-G.w*.9,G.base-G.Hc-4);g.lineTo(x-G.w*.25,G.base-G.Hc+2);g.stroke();g.restore();}});
  text(g,IN.act==='blow'?'對瓶口吹氣：振動的是空氣柱':'用木棒敲：振動的是容器和水',W/2,22,{size:14,bold:true,align:'center'});}
function drawInTube(g,W,H){const G=tubeGeo(W,H),t=IN.t;g.fillStyle=C.panel;g.fillRect(0,0,W,H);line(g,W*.1,G.top-20,W*.9,G.top-20,C.ink,4);
  const fs=[0,1,2,3].map(tubeF),rk=rankOf(fs);
  for(let i=0;i<4;i++){const x=G.x(i),L=(IN.tubeV==='len'?TUBL[i]:1)*G.Lmax,wt=(IN.tubeV==='wall'?TUBW[i]:1)*3,el=IN.pl[i]===undefined?99:t-IN.pl[i],act=el<1.4;
    const sh=act&&IN.tubeA==='hit'?Math.sin(el*70)*3*Math.exp(-el*2):0;line(g,x,G.top-20,x,G.top,C.muted,1.5);
    g.save();g.translate(sh,0);g.fillStyle=C.sky;g.fillRect(x-G.w/2,G.top,G.w,L);g.fillStyle='#8f9aa3';g.fillRect(x-G.w/2,G.top,wt,L);g.fillRect(x+G.w/2-wt,G.top,wt,L);
    if(IN.tubeA==='blow')g.fillRect(x-G.w/2,G.top+L-4,G.w,4);
    if(act&&IN.tubeA==='blow'){g.globalAlpha=.6*Math.exp(-el);for(let k=0;k<5;k++){const yy=G.top+((el*100+k*L/5)%L);line(g,x-G.w/2+wt,yy,x+G.w/2-wt,yy,C.echo,2);}g.globalAlpha=1;}
    g.strokeStyle=act&&IN.tubeA==='hit'?C.echo:C.ink;g.lineWidth=1.5;g.strokeRect(x-G.w/2,G.top,G.w,L);g.restore();
    text(g,TRN[i],x,G.top+L+18,{size:14,bold:true,align:'center'});text(g,Math.round(fs[i])+' Hz',x,G.top+L+34,{size:11,align:'center',col:C.muted});
    text(g,'第'+rk[i]+'高',x,G.top-26,{size:12,bold:true,align:'center',col:rk[i]===1?C.echo:C.muted});}
  text(g,IN.tubeA==='hit'?'用槌子敲：振動的是管子本身':'對管口吹（下端封閉）：振動的是管內空氣柱',W/2,H-10,{size:13,bold:true,align:'center'});}
function drawInReso(g,W,H){const t=IN.t,el=t-IN.hitR,base=H*.78;g.fillStyle=C.panel;g.fillRect(0,0,W,H);line(g,0,base,W,base,C.muted,2);
  const aL=el>=0?Math.exp(-el/4):0,same=IN.res===440,aR=el>=0&&same?(1-Math.exp(-el/.8))*aL*.75:0,xl=W*.25,xr=W*.72,bw=Math.min(150,W*.2),bh=H*.18;
  [[xl,aL,440],[xr,aR,IN.res]].forEach(([x,a,f],i)=>{if(IN.box){g.fillStyle='#c79a63';g.fillRect(x-bw/2,base-bh,bw,bh);g.fillStyle='#5b3a22';g.beginPath();g.ellipse(x+(i?-1:1)*bw*.5,base-bh/2,6,bh*.3,0,0,TAU);g.fill();}
    const yb=IN.box?base-bh:base;const sz=i&&f===360?1.15:i&&f===500?.88:1;const dx=4*a*Math.sin(TAU*6*t);
    g.save();g.translate(x,yb);g.scale(1,-1);fork(g,0,0,H*.42*sz,dx);g.restore();
    text(g,f+' Hz',x,yb-H*.42*sz-14,{size:13,bold:true,align:'center',col:i&&a>.05?C.echo:C.ink});
    if(a>.05){g.save();g.strokeStyle=i?C.echo:C.snd;for(let k=0;k<3;k++){const ph=(t*1.2+k/3)%1;g.globalAlpha=a*(1-ph)*(IN.box?1:.5);g.lineWidth=IN.box?3:2;g.beginPath();g.arc(x,yb-H*.25,30+ph*W*.2,-.8,.8);g.stroke();g.beginPath();g.arc(x,yb-H*.25,30+ph*W*.2,Math.PI-.8,Math.PI+.8);g.stroke();}g.restore();}});
  if(el>=0&&el<8)text(g,same?(aR>.1?'右邊音叉也響了！（共振）':''):'右邊音叉頻率不同，不會跟著振動',W/2,30,{size:14,bold:true,align:'center',col:same?C.echo:C.muted});
  text(g,'左邊（被敲）',xl,base+20,{size:12,align:'center'});text(g,'右邊（沒有敲）',xr,base+20,{size:12,align:'center'});}
dragger($('cvIn'),()=>{if(IN.mode==='bottle'){const G=botGeo(WI,HI);return IN.bot.map((w,i)=>({x:G.x(i),y:G.base-G.Hc*w,r:20,move:(x,y)=>{IN.bot[i]=clamp((G.base-y)/G.Hc,.05,.9);}}));}return [];},()=>kick());
$('cvIn').addEventListener('click',ev=>{const r=$('cvIn').getBoundingClientRect(),x=ev.clientX-r.left,y=ev.clientY-r.top;
  if(IN.mode==='string'){const G=strGeo(WI,HI);for(let i=0;i<G.n;i++)if(Math.abs(y-G.y(i))<G.gap/2&&x>G.L-20&&x<G.R+30){IN.sel=i;inUI();pluck(i);return;}}
  else if(IN.mode==='bottle'){const G=botGeo(WI,HI);for(let i=0;i<G.n;i++){const yw=G.base-G.Hc*IN.bot[i];if(Math.abs(x-G.x(i))<G.w/2&&y>G.base-G.Hc-20&&y<G.base&&Math.hypot(x-G.x(i),y-yw)>16){pluck(i);return;}}}
  else if(IN.mode==='tube'){const G=tubeGeo(WI,HI);for(let i=0;i<4;i++)if(Math.abs(x-G.x(i))<G.w&&y>G.top&&y<G.top+G.Lmax+40){pluck(i);return;}}});
$('cvIn').style.touchAction='none';
function inResults(){let big='',f='',ck=[];const m=IN.mode;
  if(m==='string'){const fs=IN.str.map(strF),S=IN.str[IN.sel];big=IN.str.length>1?'由高到低：'+fs.map((f,i)=>[f,i]).sort((a,b)=>b[0]-a[0]).map(([f,i])=>IN.str[i].n.split('（')[0]).join(' → '):`${Math.round(fs[0])} Hz（${noteName(fs[0])}）`;
    f=`選取的弦：${Math.round(strF(S))} Hz<br>越緊、越細、振動部分越短 → 頻率越高`;
    ck=[['info','撥得用力：振幅變大 → 響度變大，頻率（音調）不變。'],['info','調音時聲音太低 → 把弦調緊（或換細一點的弦）。'],['info','左手按弦的位置改變振動部分的長度，用來改變音調。']];}
  else if(m==='bottle'){const fs=IN.bot.map((w,i)=>botF(i));const o=fs.map((f,i)=>[f,i]).sort((a,b)=>b[0]-a[0]).map(a=>a[1]+1);big=(IN.act==='blow'?'吹氣':'敲擊')+'：由高到低是第 '+o.join('、')+' 個';
    f=IN.act==='blow'?'振動的是空氣柱：空氣柱越短（水越多）→ 音調越高':'振動的是容器和水：水越多越重 → 振動越慢 → 音調越低';
    ck=[['info','吹氣和敲擊，高低順序剛好相反。'],['info','下端封閉的空氣柱：波長約是空氣柱長度的 4 倍。']];}
  else if(m==='tube'){const fs=[0,1,2,3].map(tubeF);const o=fs.map((f,i)=>[f,i]).sort((a,b)=>b[0]-a[0]).map(a=>TRN[a[1]]);big=(IN.tubeA==='hit'?'敲擊':'吹氣')+'：由高到低 '+o.join(' → ');
    f=IN.tubeA==='hit'?(IN.tubeV==='len'?'同材質同粗細：越短越高':'同長度：管壁越厚越硬 → 振動越快 → 音調越高'):(IN.tubeV==='len'?'空氣柱 λ ＝ 4L：越短波長越短、頻率越高':'空氣柱長度一樣 → 音調一樣（管壁厚薄不影響吹氣的音調）');
    ck=[['info','先問：是誰在振動？敲 → 管子；吹 → 空氣柱。']];}
  else{big=IN.res===440?'頻率相同 → 右邊音叉跟著振動（共振）':'頻率不同 → 不會共振';f='共振（共鳴）：發聲體的聲音傳到頻率相同的物體，使它也跟著振動發聲';
    ck=[[IN.box?'ok':'info',IN.box?'有共鳴箱：箱內空氣一起振動，聲音比較大。':'沒有共鳴箱：音叉本身推動的空氣少，聲音小。'],['info','要證明「頻率相同才會共振」，要把其中一支換成不同頻率的音叉做對照。']];}
  $('inBig').textContent=big;$('inF2').innerHTML=f;checks($('inC'),ck);}
SIZE.inst=()=>{({W:WI,H:HI}=fit($('cvIn'),.44,280,430));};
UI.inst=()=>{inUI();};
TICK.inst=dt=>{IN.t+=dt;return true;};
let inLast='';DRAW.inst=()=>{const g=$('cvIn').getContext('2d'),m=IN.mode;if(m==='string')drawInStr(g,WI,HI);else if(m==='bottle')drawInBot(g,WI,HI);else if(m==='tube')drawInTube(g,WI,HI);else drawInReso(g,WI,HI);
  const key=JSON.stringify([m,IN.str,IN.sel,IN.act,IN.bot.map(w=>Math.round(w*50)),IN.tubeV,IN.tubeA,IN.res,IN.box]);if(key!==inLast){inLast=key;inResults();}};
