
// =====================================================================
// 6 可聽範圍與分貝
// =====================================================================
const ANI=[{k:'human',n:'人',a:20,b:20000,th:0,c:'#1c68ad'},{k:'dog',n:'狗',a:15,b:50000,th:0,c:'#1f8a5b'},{k:'cat',n:'貓',a:60,b:65000,th:0,c:'#6a7f3a'},{k:'dolphin',n:'海豚',a:2000,b:100000,th:0,c:'#d23b2f'},{k:'bat',n:'蝙蝠',a:1000,b:120000,th:0,c:'#c2410c'},
  {k:'elephant',n:'大象',a:16,b:12000,th:0,c:'#7a5c3e'},{k:'rabbit',n:'兔子',a:360,b:42000,th:0,c:'#a0458e'},{k:'fishA',n:'吳郭魚、石斑魚（普通型）',a:200,b:1000,th:90,c:'#2f8fbf'},{k:'fishB',n:'鯉魚、鯰魚（特化型）',a:200,b:8000,th:60,c:'#0f6e78'}];
const RG={mode:'bars',on:{human:1,dog:1,cat:1,dolphin:1,bat:1},fv:0,L:70,af:2,al:40,d1:80,d2:40};
const FLO=Math.log10(5),FHI=Math.log10(200000);const fOf=v=>Math.pow(10,FLO+(FHI-FLO)*v/1000),vOf=f=>(Math.log10(f)-FLO)/(FHI-FLO)*1000;RG.fv=vOf(1000);
const AF=[125,250,500,1000,2000,4000,8000],AUL=[10,10,15,20,25,45,70],AUR=[20,25,40,45,50,60,80];
const DBS=[[0,'人耳剛好聽得到'],[10,'呼吸聲'],[20,'樹葉沙沙聲'],[30,'輕聲細語'],[40,'安靜的圖書館'],[60,'一般交談'],[70,'吸塵器、吵雜的教室'],[80,'交通繁忙的街道'],[90,'卡車、工廠機器'],[100,'工地施工'],[110,'鞭炮'],[120,'飛機起飛（近處）'],[130,'耳朵感到疼痛'],[140,'近距離槍聲']];
let WR=600,HR=300;
const fmtHz=f=>f>=1000?nf(f/1000,f>=10000?0:1)+' kHz':Math.round(f)+' Hz';
function rgUI(){const m=RG.mode;segSet($('rgMode'),m);document.querySelectorAll('#b-range .rgc').forEach(e=>e.hidden=!e.dataset.m.split(' ').includes(m));
  const box=$('rgAni');box.innerHTML='';ANI.forEach(a=>{const b=document.createElement('button');b.className='chip';b.textContent=a.n;b.setAttribute('aria-pressed',String(!!RG.on[a.k]));b.addEventListener('click',()=>{RG.on[a.k]=!RG.on[a.k];rgUI();kick();});box.appendChild(b);});
  const f=fOf(RG.fv);$('rgF').value=RG.fv;$('rgFo').textContent=fmtHz(f);$('rgL').value=RG.L;$('rgLo').textContent=RG.L+' dB';
  $('rgAf').value=RG.af;$('rgAfo').textContent=AF[RG.af]+' Hz';$('rgAl').value=RG.al;$('rgAlo').textContent=RG.al+' dB';
  $('rgD1').value=RG.d1;$('rgD1o').textContent=RG.d1+' dB';$('rgD2').value=RG.d2;$('rgD2o').textContent=RG.d2+' dB';$('rgSnd').hidden=m==='db';
  $('rgHint').textContent={bars:'拖曳橘色的頻率指標（或滑桿），看哪些動物聽得到。按 🔊 可以真的播放這個頻率（超過 20 kHz 人耳聽不到）。',area:'聲音要「頻率在範圍內」而且「夠大聲」才聽得到：拖曳橘點同時改變頻率和響度。',audio:'聽力檢查：每個頻率找出剛好聽得到的最小音量。拖曳橘點（測試音），看左耳、右耳聽不聽得到。',db:'分貝尺：拖曳兩個聲音比較強度；每多 10 分貝，強度變 10 倍。'}[m];
  $('rgHowT').textContent={bars:'誰聽得到：怎麼看',area:'頻率＋響度：怎麼看',audio:'聽力檢查：怎麼看',db:'分貝尺與噪音：怎麼看'}[m];
  $('rgHow').innerHTML=({bars:['人耳可聽頻率約 20～20000 Hz；低於 20 Hz 是次聲波，高於 20000 Hz 是超聲波（超音波）。','不同動物聽得到的範圍不同：狗笛、犬笛的頻率高於 20000 Hz，人聽不到、狗聽得到。','蝙蝠、海豚用超聲波找食物、辨方向（回聲定位）；大象、鯨魚可以用次聲波溝通。','超聲波和一般聲音在同一介質中速率一樣，只是頻率高、波長短。'],
    area:['每個方框是一種動物聽得到的範圍：左右是頻率範圍，下緣是最小要多大聲。','點要落在方框裡面才聽得到：頻率不對，再大聲也聽不到；頻率對了，太小聲也聽不到。','大業 113 魚類閱讀題：普通型 200～1000 Hz 且 90 dB 以上；特化型 200～8000 Hz、60 dB 就聽得到。'],
    audio:['橫軸是頻率，縱軸是音量（分貝），往下越大聲。','× 和 ○ 是左耳、右耳在各頻率「剛好聽得到」的最小音量，連成聽力曲線。','測試音在曲線上方（比曲線小聲）→ 聽不到；在曲線上或下方（夠大聲）→ 聽得到。','曲線越往下，表示要越大聲才聽得到 → 聽力越差。'],
    db:['分貝（dB）表示聲音的強弱（響度）：0 dB 是人耳剛好聽得到。','每增加 10 dB，聲音的強度變 10 倍；增加 20 dB 變 100 倍；增加 40 dB 變 10000 倍。','長時間處在 70 dB 會煩躁、影響學習；85 dB 以上可能損害聽力。','防制噪音：隔音牆、種樹、雙層窗、吸音材料、遠離噪音源。']})[m].map(s=>`<li>${s}</li>`).join('');}
segOn($('rgMode'),v=>{RG.mode=v;hideStory();rgUI();SIZE.range();kick();});
$('rgF').addEventListener('input',()=>{RG.fv=+$('rgF').value;rgUI();kick();});
$('rgL').addEventListener('input',()=>{RG.L=+$('rgL').value;rgUI();kick();});
[['rgAf','af'],['rgAl','al'],['rgD1','d1'],['rgD2','d2']].forEach(([id,k])=>$(id).addEventListener('input',()=>{RG[k]=+$(id).value;rgUI();kick();}));
$('rgSnd').addEventListener('click',()=>{const f=RG.mode==='audio'?AF[RG.af]:fOf(RG.fv);if(f>=20&&f<=22000)tone(f,{gain:RG.mode==='area'?.02+.12*RG.L/140:.08,dur:1.2});});
function rgGeo(W,H){const L=RG.mode==='bars'?(W<560?96:168):54,R=W-24,top=RG.mode==='bars'?40:22,bot=H-34;return {L,R,top,bot,X:f=>L+(Math.log10(f)-FLO)/(FHI-FLO)*(R-L),fx:x=>Math.pow(10,FLO+(x-L)/(R-L)*(FHI-FLO)),Y:d=>bot-d/140*(bot-top),dy:y=>(bot-y)/(bot-top)*140};}
function fAxis(g,G){line(g,G.L,G.bot,G.R,G.bot,C.ink,1.5);[10,100,1000,10000,100000].forEach(f=>{const x=G.X(f);line(g,x,G.top,x,G.bot,C.grid,1);text(g,fmtHz(f),x,G.bot+16,{size:11,align:'center',col:C.muted});});
  text(g,'頻率（Hz）',G.R,G.bot+30,{size:11,align:'right',col:C.muted});
  g.fillStyle=C.purple;g.globalAlpha=.08;g.fillRect(G.L,G.top,G.X(20)-G.L,G.bot-G.top);g.fillStyle=C.echo;g.fillRect(G.X(20000),G.top,G.R-G.X(20000),G.bot-G.top);g.globalAlpha=1;
  text(g,'次聲波',(G.L+G.X(20))/2,G.top-6,{size:11,bold:true,align:'center',col:C.purple});text(g,'人耳可聽',(G.X(20)+G.X(20000))/2,G.top-6,{size:11,bold:true,align:'center',col:C.snd});text(g,'超聲波',(G.X(20000)+G.R)/2,G.top-6,{size:11,bold:true,align:'center',col:C.echo});}
function drawRgBars(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const G=rgGeo(W,H),f=fOf(RG.fv);fAxis(g,G);const list=ANI.filter(a=>RG.on[a.k]);const rh=Math.min(40,(G.bot-G.top-8)/Math.max(1,list.length));
  list.forEach((a,i)=>{const y=G.top+8+rh*(i+.5),ok=f>=a.a&&f<=a.b;g.fillStyle=a.c;g.globalAlpha=ok?.85:.45;g.fillRect(G.X(a.a),y-rh*.28,G.X(a.b)-G.X(a.a),rh*.56);g.globalAlpha=1;
    text(g,a.n,G.L-10,y-1,{size:12,bold:true,align:'right'});text(g,fmtHz(a.a)+'～'+fmtHz(a.b),G.L-10,y+13,{size:10,align:'right',col:C.muted});
    text(g,ok?'✓':'✕',G.R-2,y+5,{size:15,bold:true,col:ok?C.green:'#c0453b',align:'right'});});
  const x=G.X(f);line(g,x,G.top,x,G.bot,C.accent,2.5);handle(g,x,G.bot,9);text(g,fmtHz(f),x,G.bot-8,{size:12,bold:true,col:C.accent,align:x>W*.8?'right':'left',bg:C.panel});}
function drawRgArea(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const G=rgGeo(W,H);fAxis(g,G);
  for(let d=0;d<=140;d+=20){const y=G.Y(d);line(g,G.L,y,G.R,y,C.grid,1);text(g,d+' dB',G.L-6,y+4,{size:10,align:'right',col:C.muted});}
  const f=fOf(RG.fv),px=G.X(f),py=G.Y(RG.L);
  ANI.filter(a=>RG.on[a.k]).forEach((a,i)=>{const x0=G.X(a.a),x1=G.X(a.b),y0=G.Y(140),y1=G.Y(a.th);const ok=f>=a.a&&f<=a.b&&RG.L>=a.th;g.fillStyle=a.c;g.globalAlpha=ok?.22:.1;g.fillRect(x0,y0,x1-x0,y1-y0);g.globalAlpha=1;g.strokeStyle=a.c;g.lineWidth=ok?2.5:1.5;g.strokeRect(x0,y0,x1-x0,y1-y0);
    text(g,a.n+(ok?' ✓':''),x0+4,y1-6-(i%3)*14,{size:11,bold:true,col:a.c,bg:C.panel});});
  handle(g,px,py,9);text(g,fmtHz(f)+'、'+RG.L+' dB',px+12,py-10,{size:12,bold:true,col:C.accent,bg:C.panel});}
function audioThr(arr,i){return arr[i];}
function drawRgAudio(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const L=70,R=W-30,top=34,bot=H-30,X=i=>L+i/6*(R-L),Y=d=>top+(d+10)/130*(bot-top);
  for(let d=-10;d<=120;d+=10){const y=Y(d);line(g,L,y,R,y,C.grid,1);text(g,String(d),L-8,y+4,{size:10,align:'right',col:C.muted});}text(g,'音量（dB）↓ 越大聲',8,H-8,{size:11,col:C.muted});
  AF.forEach((f,i)=>{line(g,X(i),top,X(i),bot,C.grid,1);text(g,f>=1000?f/1000+'k':String(f),X(i),top-6,{size:11,align:'center',col:C.muted});});text(g,'頻率（Hz）',R,top-20,{size:11,align:'right',col:C.muted});
  const curve=(arr,col,mk)=>{g.strokeStyle=col;g.lineWidth=2;g.beginPath();arr.forEach((d,i)=>i?g.lineTo(X(i),Y(d)):g.moveTo(X(i),Y(d)));g.stroke();arr.forEach((d,i)=>{const x=X(i),y=Y(d);if(mk==='x'){line(g,x-6,y-6,x+6,y+6,col,2.5);line(g,x-6,y+6,x+6,y-6,col,2.5);}else{g.strokeStyle=col;g.lineWidth=2.5;g.beginPath();g.arc(x,y,6,0,TAU);g.stroke();}});};
  curve(AUL,C.snd,'x');curve(AUR,C.red,'o');text(g,'× 左耳',R-120,bot-10,{size:12,bold:true,col:C.snd});text(g,'○ 右耳',R-60,bot-10,{size:12,bold:true,col:C.red});
  const px=X(RG.af),py=Y(RG.al);handle(g,px,py,9);const hl=RG.al>=AUL[RG.af],hr=RG.al>=AUR[RG.af];text(g,`左耳${hl?'聽得到':'聽不到'}、右耳${hr?'聽得到':'聽不到'}`,px+(px>W*.7?-12:12),py-12,{size:12,bold:true,col:C.accent,align:px>W*.7?'right':'left',bg:C.panel});}
function drawRgDb(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const top=20,bot=H-20,x0=Math.min(W*.3,200),Y=d=>bot-d/140*(bot-top);
  const grad=g.createLinearGradient(0,bot,0,top);grad.addColorStop(0,'#5fbf7a');grad.addColorStop(.5,'#f2c14e');grad.addColorStop(.62,'#f08a4b');grad.addColorStop(1,'#c0453b');g.fillStyle=grad;g.fillRect(x0-14,top,28,bot-top);
  DBS.forEach(([d,s])=>{const y=Y(d);line(g,x0+14,y,x0+24,y,C.ink,1.5);text(g,d+' dB　'+s,x0+30,y+4,{size:12});});
  [[70,'70 dB：煩躁、影響學習'],[85,'85 dB 以上：可能損害聽力']].forEach(([d,s])=>{const y=Y(d);line(g,x0-14,y,W-14,y,'#c0453b',1.5,[6,4]);text(g,s,W-16,y-4,{size:11,bold:true,col:'#c0453b',align:'right'});});
  [[RG.d1,'甲',C.echo],[RG.d2,'乙',C.snd]].forEach(([d,n,c],i)=>{const y=Y(d);const xx=x0-30-i*34;line(g,xx+8,y,x0-14,y,c,2);handle(g,xx,y,9);text(g,n,xx-14,y+5,{size:14,bold:true,col:c,align:'right'});});}
dragger($('cvRg'),()=>{const m=RG.mode,G=rgGeo(WR,HR);
  if(m==='bars'){const f=fOf(RG.fv);return [{x:G.X(f),y:G.bot,r:30,hit:(x,y)=>Math.abs(x-G.X(fOf(RG.fv)))<16?0:99,move:x=>{RG.fv=clamp(vOf(clamp(G.fx(x),5,200000)),0,1000);rgUI();}}];}
  if(m==='area'){return [{x:G.X(fOf(RG.fv)),y:G.Y(RG.L),r:30,move:(x,y)=>{RG.fv=clamp(vOf(clamp(G.fx(x),5,200000)),0,1000);RG.L=clamp(Math.round(G.dy(y)),0,140);rgUI();}}];}
  if(m==='audio'){const L=70,R=WR-30,top=34,bot=HR-30;return [{x:L+RG.af/6*(R-L),y:top+(RG.al+10)/130*(bot-top),r:30,move:(x,y)=>{RG.af=clamp(Math.round((x-L)/(R-L)*6),0,6);RG.al=clamp(Math.round(((y-top)/(bot-top)*130-10)/5)*5,-10,120);rgUI();}}];}
  const top=20,bot=HR-20,x0=Math.min(WR*.3,200),Y=d=>bot-d/140*(bot-top),dy=y=>(bot-y)/(bot-top)*140;
  return [{x:x0-30,y:Y(RG.d1),r:24,move:(x,y)=>{RG.d1=clamp(Math.round(dy(y)),0,140);rgUI();}},{x:x0-64,y:Y(RG.d2),r:24,move:(x,y)=>{RG.d2=clamp(Math.round(dy(y)),0,140);rgUI();}}];},()=>kick());
$('cvRg').style.touchAction='none';
function rgResults(){let big='',f='',ck=[];const m=RG.mode;
  if(m==='bars'||m==='area'){const fr=fOf(RG.fv);const who=ANI.filter(a=>RG.on[a.k]&&fr>=a.a&&fr<=a.b&&(m==='bars'||RG.L>=a.th)).map(a=>a.n);
    big=`${fmtHz(fr)}${m==='area'?'、'+RG.L+' dB':''}：${who.length?who.join('、')+' 聽得到':'選取的動物都聽不到'}`;
    f=`${fr<20?'次聲波（低於 20 Hz）':fr>20000?'超聲波（高於 20000 Hz）':'人耳可聽範圍內'}<br>空氣中波長 λ ＝ 340 ÷ ${Math.round(fr)} ＝ ${fmtM(340/fr)}；水中 ${fmtM(1500/fr)}`;
    ck=[['info','超聲波的應用：聲納測距、魚群探測、醫學超音波檢查胎兒、震碎結石、超聲波清洗、倒車雷達。'],['info','耳溫槍用的是紅外線，不是超聲波；自動門感應器多半也是紅外線。'],['info','次聲波人聽不到，但可能使人頭暈不舒服；大象、長頸鹿、藍鯨可用次聲波溝通。']];}
  else if(m==='audio'){const hl=RG.al>=AUL[RG.af],hr=RG.al>=AUR[RG.af];big=`${AF[RG.af]} Hz、${RG.al} dB：左耳${hl?'聽得到':'聽不到'}，右耳${hr?'聽得到':'聽不到'}`;
    f=`這個頻率：左耳至少 ${AUL[RG.af]} dB、右耳至少 ${AUR[RG.af]} dB 才聽得到`;ck=[['info','同一個頻率，音量比曲線上的值大（在曲線下方）才聽得到。'],['info','這位受測者右耳的曲線比較低（要更大聲），右耳聽力較差；兩耳在高頻都變差。']];}
  else{const d=RG.d1-RG.d2,r=Math.pow(10,Math.abs(d)/10);big=d===0?'兩個聲音一樣強':`${d>0?'甲':'乙'}比${d>0?'乙':'甲'}多 ${Math.abs(d)} dB，強度是 ${r<100?nf(r,2):Math.round(r).toLocaleString()} 倍`;
    f=`強度比 ＝ 10<sup>(分貝差 ÷ 10)</sup> ＝ 10<sup>${nf(Math.abs(d)/10,1)}</sup>`;ck=[['info','80 dB 是 40 dB 的 10⁴ ＝ 10000 倍（向上 113 #5）。'],['info','分貝數越大 → 振幅越大、能量越大，傳得越遠。'],[Math.max(RG.d1,RG.d2)>=85?'no':'ok',Math.max(RG.d1,RG.d2)>=85?'85 dB 以上，長時間會損害聽力。':'85 dB 以下。']];}
  $('rgBig').textContent=big;$('rgF2').innerHTML=f;checks($('rgC'),ck);}
SIZE.range=()=>{({W:WR,H:HR}=fit($('cvRg'),RG.mode==='bars'?.42:RG.mode==='db'?.55:.48,280,480));};
UI.range=()=>{rgUI();};
DRAW.range=()=>{const g=$('cvRg').getContext('2d'),m=RG.mode;if(m==='bars')drawRgBars(g,WR,HR);else if(m==='area')drawRgArea(g,WR,HR);else if(m==='audio')drawRgAudio(g,WR,HR);else drawRgDb(g,WR,HR);rgResults();};
