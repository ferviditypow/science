
// =====================================================================
// 3 不透明物體的顏色
// =====================================================================
const OB={mode:'cards',light:'R',sel:'R',pic:'scene',top:'W',bot:'R'};
const OL=['W','R','G','B','Y','M','C'];let WO=600,HO=320;
segFill('obLight',OL,LN);segFill('obTop',CK,CN);segFill('obBot',CK,CN);
const mulCss=(rgb,L)=>`rgb(${rgb.map((v,i)=>Math.round(v*(.06+.94*L[i]))).join(',')})`;
function cardRects(W,H){const n=8,cols=W<560?4:8,rows=Math.ceil(n/cols),gap=12,top=H*.3,cw=Math.min(90,(W-40-gap*(cols-1))/cols),ch=Math.min(cw*1.25,(H-top-30)/rows-40);
  const x0=(W-(cols*cw+(cols-1)*gap))/2;return CK.map((k,i)=>({k,x:x0+(i%cols)*(cw+gap),y:top+Math.floor(i/cols)*(ch+44),w:cw,h:ch}));}
function lamp(g,x,y,Lk,H){const L=CV[Lk];g.fillStyle='#555';g.fillRect(x-30,y-10,60,14);if(Lk!=='K'){const gr=g.createLinearGradient(0,y,0,H);gr.addColorStop(0,lightCss(L,.35));gr.addColorStop(1,lightCss(L,.03));g.fillStyle=gr;g.beginPath();g.moveTo(x-26,y+4);g.lineTo(x+26,y+4);g.lineTo(x+H*.9,H);g.lineTo(x-H*.9,H);g.closePath();g.fill();}
  g.fillStyle=lightCss(L);g.beginPath();g.ellipse(x,y+5,22,6,0,0,TAU);g.fill();}
function drawCards(g,W,H){const L=CV[OB.light];g.fillStyle='#0d0f13';g.fillRect(0,0,W,H);lamp(g,W/2,16,OB.light,H);text(g,'暗箱：只有'+LN[OB.light]+'照射',12,22,{size:13,bold:true,col:'#ddd'});
  cardRects(W,H).forEach(r=>{g.fillStyle=seenRGB(r.k,L);g.fillRect(r.x,r.y,r.w,r.h);g.strokeStyle=r.k===OB.sel?'#ff9a5c':'rgba(255,255,255,.25)';g.lineWidth=r.k===OB.sel?3:1;g.strokeRect(r.x,r.y,r.w,r.h);
    const sk=keyOf(mul(CV[r.k],L));text(g,CN[r.k]+'紙',r.x+r.w/2,r.y+r.h+16,{size:12,bold:true,col:'#ccc',align:'center'});text(g,'看起來'+CN[sk],r.x+r.w/2,r.y+r.h+32,{size:12,col:sk==='K'?'#888':'#fff',align:'center'});});}
// 圖卡
const SCENE=[{k:'B',n:'天空'},{k:'Y',n:'太陽'},{k:'G',n:'山'},{k:'W',n:'牆'},{k:'R',n:'屋頂'},{k:'K',n:'門'},{k:'M',n:'花'},{k:'C',n:'湖'}];
function drawScene(g,x,y,w,h,L){const P=k=>seenRGB(k,L);g.fillStyle=P('B');g.fillRect(x,y,w,h*.6);g.fillStyle=P('Y');g.beginPath();g.arc(x+w*.8,y+h*.18,h*.09,0,TAU);g.fill();
  g.fillStyle=P('G');g.beginPath();g.moveTo(x,y+h*.6);g.lineTo(x+w*.25,y+h*.25);g.lineTo(x+w*.55,y+h*.6);g.closePath();g.fill();g.fillStyle=P('C');g.fillRect(x,y+h*.6,w,h*.4);
  g.fillStyle=P('G');g.fillRect(x,y+h*.6,w*.6,h*.4);g.fillStyle=P('W');g.fillRect(x+w*.12,y+h*.45,w*.3,h*.3);g.fillStyle=P('R');g.beginPath();g.moveTo(x+w*.08,y+h*.45);g.lineTo(x+w*.27,y+h*.3);g.lineTo(x+w*.46,y+h*.45);g.closePath();g.fill();
  g.fillStyle=P('K');g.fillRect(x+w*.24,y+h*.58,w*.07,h*.17);g.fillStyle=P('M');for(let i=0;i<5;i++){g.beginPath();g.arc(x+w*(.08+i*.1),y+h*.86,h*.035,0,TAU);g.fill();}
  g.strokeStyle='rgba(128,128,128,.5)';g.strokeRect(x,y,w,h);}
const BLK=[{k:'B',a:8},{k:'R',a:2},{k:'G',a:2},{k:'W',a:2}];
function drawBlocks(g,x,y,w,h,L){const u=Math.min(w/4,h/4);// 4×4 格，藍 8 格，紅、綠、白各 2 格
  const lay=['BBBB','BBBB','RRGG','WW..'];lay.forEach((row,r)=>[...row].forEach((k,c)=>{if(k==='.')return;g.fillStyle=seenRGB(k,L);g.fillRect(x+c*u,y+r*u,u-1,u-1);}));
  g.strokeStyle='rgba(128,128,128,.5)';g.strokeRect(x,y,u*4,u*4);text(g,'每格 1 cm²',x,y+u*4+16,{size:11,col:C.muted});}
function drawFace(g,x,y,w,h,L){const items=[['B','頭'],['K','眼珠'],['W','臉頰'],['R','嘴巴']];const cw=w/2-10,chh=(h-30)/2-10;
  items.forEach(([k,n],i)=>{const xx=x+(i%2)*(cw+20),yy=y+Math.floor(i/2)*(chh+20);g.fillStyle=seenRGB(k,L);g.fillRect(xx,yy,cw,chh);g.strokeStyle='rgba(128,128,128,.5)';g.strokeRect(xx,yy,cw,chh);text(g,n,xx+cw/2,yy+chh+14,{size:12,align:'center',col:C.muted});});}
function drawPic(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const L=CV[OB.light],gap=24,pw=(W-gap*3)/2,ph=H-60;
  [[CV.W,'白光下'],[L,'在'+LN[OB.light]+'下']].forEach(([LL,t],i)=>{const x=gap+i*(pw+gap),y=34;text(g,t,x,24,{size:13,bold:true});
    if(OB.pic==='scene')drawScene(g,x,y,pw,ph,LL);else if(OB.pic==='blocks')drawBlocks(g,x,y,pw,ph,LL);else drawFace(g,x,y,pw,ph,LL);});}
function drawOutfit(g,W,H){const L=CV[OB.light];g.fillStyle='#0d0f13';g.fillRect(0,0,W,H);lamp(g,W/2,12,OB.light,H);
  const cx=W/2,base=H-14,s=Math.min(1.25,H/320);g.fillStyle=mulCss([236,192,152],L);g.beginPath();g.arc(cx,base-210*s,22*s,0,TAU);g.fill();
  g.fillStyle=seenRGB(OB.top,L);g.beginPath();g.moveTo(cx-34*s,base-186*s);g.lineTo(cx+34*s,base-186*s);g.lineTo(cx+44*s,base-110*s);g.lineTo(cx-44*s,base-110*s);g.closePath();g.fill();
  g.fillRect(cx-58*s,base-182*s,22*s,60*s);g.fillRect(cx+36*s,base-182*s,22*s,60*s);
  g.fillStyle=seenRGB(OB.bot,L);g.beginPath();g.moveTo(cx-44*s,base-112*s);g.lineTo(cx+44*s,base-112*s);g.lineTo(cx+62*s,base-50*s);g.lineTo(cx-62*s,base-50*s);g.closePath();g.fill();
  g.fillStyle=mulCss([236,192,152],L);g.fillRect(cx-22*s,base-50*s,12*s,48*s);g.fillRect(cx+10*s,base-50*s,12*s,48*s);
  const tk=keyOf(mul(CV[OB.top],L)),bk=keyOf(mul(CV[OB.bot],L));text(g,'看起來：'+CN[tk]+'衣、'+CN[bk]+'裙',W-14,H-14,{size:14,bold:true,col:'#fff',align:'right'});
  text(g,'白光下：'+CN[OB.top]+'衣、'+CN[OB.bot]+'裙',14,H-14,{size:12,col:'#aaa'});}
$('cvOb').addEventListener('click',ev=>{if(OB.mode!=='cards')return;const r=$('cvOb').getBoundingClientRect(),x=ev.clientX-r.left,y=ev.clientY-r.top;for(const c of cardRects(WO,HO))if(x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h+36){OB.sel=c.k;kick();}});
function obUI(){segSet($('obMode'),OB.mode);document.querySelectorAll('.obc').forEach(e=>e.hidden=e.dataset.m!==OB.mode);segSet($('obLight'),OB.light);segSet($('obPic'),OB.pic);segSet($('obTop'),OB.top);segSet($('obBot'),OB.bot);
  $('obHint').textContent={cards:'換上方「照射的光」，看每張色紙變成什麼顏色；點一張色紙看它反射、吸收了哪些光。',pic:'左邊是白光下真正的顏色，右邊是在選定的光下看起來的顏色。',outfit:'選擇服裝顏色和舞台燈光，看看觀眾看到什麼。'}[OB.mode];
  $('obHowT').textContent={cards:'暗箱裡的色紙：怎麼看',pic:'圖卡：怎麼看',outfit:'舞台上的服裝：怎麼看'}[OB.mode];
  howList('obHow',['不透明物體的顏色，由它「反射」的色光決定：反射和自己同色的光，吸收其他色光。','白色物體反射所有色光，所以照什麼光就呈現什麼顏色；黑色物體吸收所有色光。','黃色紙反射紅、綠（黃）光，吸收藍光；洋紅紙反射紅、藍光；青色紙反射綠、藍光。','照到的光裡如果沒有物體能反射的顏色，物體就看起來是黑色。']);
  const rows=['W','R','G','B'],cols=['R','B','G','K','W','Y','M','C'];
  $('obTab').innerHTML='<table class="ctable"><tr><th>光＼紙</th>'+cols.map(k=>`<th>${swatch(k)}${CN[k]}</th>`).join('')+'</tr>'+rows.map(l=>`<tr class="${l===OB.light?'on':''}"><th>${LN[l]}</th>`+cols.map(k=>{const s=keyOf(mul(CV[k],CV[l]));return `<td>${swatch(s)}${CN[s]}</td>`;}).join('')+'</tr>').join('')+'</table>';}
segOn($('obMode'),v=>{OB.mode=v;hideStory();obUI();SIZE.obj();kick();});
segOn($('obLight'),v=>{OB.light=v;obUI();kick();});segOn($('obPic'),v=>{OB.pic=v;obUI();kick();});
segOn($('obTop'),v=>{OB.top=v;obUI();kick();});segOn($('obBot'),v=>{OB.bot=v;obUI();kick();});
function obResults(){const L=CV[OB.light];let big='',f='',ck=[];const comp=c=>['紅','綠','藍'].filter((n,i)=>c[i]>.5).join('、')||'沒有';
  if(OB.mode==='cards'){const k=OB.sel,s=mul(CV[k],L),sk=keyOf(s);big=`${CN[k]}紙在${LN[OB.light]}下：${CN[sk]}色`;
    f=`照到的光：${comp(L)}<br>${CN[k]}紙能反射：${comp(CV[k])}<br>反射出來：${comp(s)} → 看起來${CN[sk]}色`;
    const ps=possible(sk,L);ck=[['info',`反過來推理：在${LN[OB.light]}下看起來${CN[sk]}色的紙，可能是：${ps.map(p=>CN[p]).join('、')}。`],['info',`在${LN[OB.light]}下看起來是黑色的紙：${possible('K',L).map(p=>CN[p]).join('、')}。`]];}
  else if(OB.mode==='pic'){if(OB.pic==='blocks'){let black=0;BLK.forEach(b=>{if(keyOf(mul(CV[b.k],L))==='K')black+=b.a;});big=`在${LN[OB.light]}下，黑色部分共 ${black} cm²`;f='藍 8、紅 2、綠 2、白 2（cm²）<br>看起來黑色＝反射不到任何照到的光';}
    else{const items=OB.pic==='scene'?SCENE:[{k:'B',n:'頭'},{k:'K',n:'眼珠'},{k:'W',n:'臉頰'},{k:'R',n:'嘴巴'}];big=`在${LN[OB.light]}下：`+items.map(it=>it.n+CN[keyOf(mul(CV[it.k],L))]).join('、');f='白色的部分會變成燈光的顏色；照不到能反射的光就變黑';}
    ck=[['info','只照單色光時，畫面只剩那一種顏色和黑色。']];}
  else{const tk=keyOf(mul(CV[OB.top],L)),bk=keyOf(mul(CV[OB.bot],L));big=`觀眾看到：${CN[tk]}衣、${CN[bk]}裙`;f=`上衣可能是：${possible(tk,L).map(p=>CN[p]).join('、')}<br>裙子可能是：${possible(bk,L).map(p=>CN[p]).join('、')}`;
    ck=[['info','換兩種燈光觀察，就能縮小可能的範圍，推出真正的顏色。']];}
  $('obBig').textContent=big;$('obF').innerHTML=f;checks($('obC'),ck);}
SIZE.obj=()=>{({W:WO,H:HO}=fit($('cvOb'),OB.mode==='pic'?.42:.44,260,440));};
UI.obj=()=>{obUI();};
DRAW.obj=()=>{const g=$('cvOb').getContext('2d');if(OB.mode==='cards')drawCards(g,WO,HO);else if(OB.mode==='pic')drawPic(g,WO,HO);else drawOutfit(g,WO,HO);obResults();};
