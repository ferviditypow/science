
// =====================================================================
// 4 透明物體與濾光
// =====================================================================
const FT={mode:'filter',light:'W',f1:'R',f2:'none',lens:'G',card:'dog',glass:'G'};
const FK=['none','R','G','B','Y','M','C'],FN={none:'無',R:'紅',G:'綠',B:'藍',Y:'黃',M:'洋紅',C:'青'};
const TV=k=>k==='none'?[1,1,1]:CV[k];let WF=600,HF=320;
segFill('ftLight',OL,LN);segFill('ftF1',FK,FN);segFill('ftF2',FK,FN);segFill('ftLens',FK,FN);segFill('ftGlass',FK,FN);
function filterRect(g,x,y,h,k){if(k==='none')return;const c=PAPER[k];g.fillStyle=`rgba(${c.join(',')},.45)`;g.fillRect(x-8,y,16,h);g.strokeStyle=`rgba(${c.join(',')},1)`;g.lineWidth=2;g.strokeRect(x-8,y,16,h);}
function drawFilter(g,W,H){g.fillStyle='#0b0d12';g.fillRect(0,0,W,H);const L=CV[FT.light],xs=[W*.36,W*.6],xsc=W*.86,ym=H*.52,fh=H*.5;
  g.fillStyle='#5b6470';g.fillRect(14,ym-16,34,32);g.fillStyle=lightCss(L);g.beginPath();g.arc(48,ym,10,-Math.PI/2,Math.PI/2);g.fill();
  let cur=L.slice();const segs=[[48,xs[0]],[xs[0],xs[1]],[xs[1],xsc]];const fs=[FT.f1,FT.f2];
  g.save();g.globalCompositeOperation='lighter';
  segs.forEach(([a,b],si)=>{if(si>0)cur=mul(cur,TV(fs[si-1]));[0,1,2].forEach(j=>{if(cur[j]<.5)return;const c=[0,0,0];c[j]=1;line(g,a,ym+(j-1)*12,b,ym+(j-1)*12,lightCss(c,.95),4);});
    if(cur.some(v=>v>.5)){g.fillStyle=lightCss(cur,.12);g.fillRect(a,ym-24,b-a,48);}});
  g.restore();
  fs.forEach((k,i)=>{filterRect(g,xs[i],ym-fh/2,fh,k);text(g,k==='none'?'（沒有放）':FN[k]+'色玻璃紙',xs[i],ym-fh/2-8,{size:12,bold:true,col:'#ddd',align:'center'});
    const before=i===0?L:mul(L,TV(fs[0])),after=mul(before,TV(k));[0,1,2].forEach(j=>{if(before[j]>.5&&after[j]<.5)text(g,'✕',xs[i]-14,ym+(j-1)*12+5,{size:13,bold:true,col:'#ff8080',align:'right'});});});
  const fin=mul(mul(L,TV(FT.f1)),TV(FT.f2));g.fillStyle='#e9e6df';g.fillRect(xsc,ym-fh/2,18,fh);if(fin.some(v=>v>.5)){g.fillStyle=seenRGB('W',fin);g.fillRect(xsc,ym-34,18,68);}
  text(g,'白色屏幕：'+CN[keyOf(fin)],xsc+9,ym+fh/2+18,{size:12,bold:true,col:'#fff',align:'center'});
  text(g,'紅',58,ym-12+4,{size:10,col:'#f88'});text(g,'綠',58,ym+4,{size:10,col:'#8f8'});text(g,'藍',58,ym+12+4,{size:10,col:'#88f'});}
function drawGlasses(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const T=TV(FT.lens),gap=24,pw=(W-gap*3)/2,ph=H-60;
  [[[1,1,1],'不戴眼鏡'],[T,'透過'+(FT.lens==='none'?'透明':FN[FT.lens]+'色')+'鏡片']].forEach(([TT,t],i)=>{const x=gap+i*(pw+gap),y=36;text(g,t,x,24,{size:13,bold:true});
    if(FT.card==='dog'){g.fillStyle=seenRGB('W',TT);g.fillRect(x,y,pw,ph);g.strokeStyle=C.line;g.strokeRect(x,y,pw,ph);const fs=Math.min(ph*.55,pw*.3);g.font=`900 ${fs}px "Noto Sans TC",sans-serif`;g.textAlign='center';g.textBaseline='middle';
      [['d','K'],['o','K'],['g','G']].forEach(([ch,k],j)=>{g.fillStyle=seenRGB(k,TT);g.fillText(ch,x+pw*(.25+j*.25),y+ph/2);});g.textBaseline='alphabetic';}
    else{g.fillStyle=C.panel;g.fillRect(x,y,pw,ph);const sx=x+pw/2,sy=y+ph*.08,sw=Math.min(pw*.8,ph*.95);g.fillStyle=seenRGB('W',TT);g.beginPath();g.moveTo(sx-sw*.3,sy);g.lineTo(sx-sw*.5,sy+sw*.18);g.lineTo(sx-sw*.38,sy+sw*.3);g.lineTo(sx-sw*.3,sy+sw*.24);g.lineTo(sx-sw*.3,sy+sw*.82);g.lineTo(sx+sw*.3,sy+sw*.82);g.lineTo(sx+sw*.3,sy+sw*.24);g.lineTo(sx+sw*.38,sy+sw*.3);g.lineTo(sx+sw*.5,sy+sw*.18);g.lineTo(sx+sw*.3,sy);g.closePath();g.fill();g.strokeStyle='#999';g.stroke();
      const star=(cx,cy,r)=>{g.beginPath();for(let k=0;k<10;k++){const rr=k%2?r*.45:r,a=-Math.PI/2+k*Math.PI/5;g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}g.closePath();g.fill();};
      g.fillStyle=seenRGB('B',TT);star(sx-sw*.1,sy+sw*.42,sw*.15);g.fillStyle=seenRGB('R',TT);g.beginPath();g.arc(sx+sw*.15,sy+sw*.5,sw*.07,0,TAU);g.fill();
      g.fillStyle=seenRGB('Y',TT);g.fillRect(sx-sw*.2,sy+sw*.68,sw*.4,sw*.05);}});
  if(FT.card==='dog')text(g,'字卡：白紙，d、o 是黑色，g 是綠色',W/2,H-6,{size:11,col:C.muted,align:'center'});else text(g,'白 T 恤：藍色星星、紅色圓點、黃色條紋',W/2,H-6,{size:11,col:C.muted,align:'center'});}
function drawHouse(g,W,H){const T=TV(FT.glass);g.fillStyle='#cfe3f6';g.fillRect(0,0,W,H);g.fillStyle='#8fbf6a';g.fillRect(0,H*.85,W,H*.15);
  const x0=W*.18,x1=W*.82,top=H*.12,bot=H*.85;g.fillStyle=seenRGB('W',T);g.fillRect(x0,top+40,x1-x0,bot-top-40);g.fillStyle=FT.glass==='none'?'#f4f1ea':`rgba(${PAPER[FT.glass].join(',')},.35)`;
  g.fillStyle='#202428';g.fillRect(x0,top+40,x1-x0,bot-top-40);// 室內（只有透過玻璃的光）
  g.save();g.globalAlpha=.25;g.fillStyle=lightCss(T);g.fillRect(x0,top+40,x1-x0,bot-top-40);g.restore();
  g.strokeStyle=FT.glass==='none'?'#9aa':paperCss(FT.glass);g.lineWidth=6;g.strokeRect(x0,top+40,x1-x0,bot-top-40);g.beginPath();g.moveTo(x0-10,top+44);g.lineTo((x0+x1)/2,top);g.lineTo(x1+10,top+44);g.stroke();
  for(let i=0;i<3;i++){const cx=x0+(x1-x0)*(i+.5)/3,cy=bot-10;g.strokeStyle=seenRGB('G',T);g.lineWidth=4;line(g,cx,cy,cx,cy-110,seenRGB('G',T),5);
    g.fillStyle=seenRGB('G',T);[[-1,60],[1,80],[-1,95]].forEach(([s,h])=>{g.beginPath();g.ellipse(cx+s*18,cy-h,18,8,s*.5,0,TAU);g.fill();});
    g.fillStyle=seenRGB('R',T);for(let k=0;k<6;k++){g.beginPath();g.arc(cx+Math.cos(k)*10,cy-120+Math.sin(k)*8,9,0,TAU);g.fill();}}
  const gr=(T[0]+T[2])/2;const mx=W-34,mh=H*.5,my=H*.2;g.fillStyle=C.panel;g.fillRect(mx-6,my-30,32,mh+40);g.strokeStyle=C.ink;g.strokeRect(mx,my,20,mh);g.fillStyle=C.green;g.fillRect(mx+2,my+mh-mh*gr,16,mh*gr);text(g,'生長',mx+10,my-12,{size:11,align:'center'});
  text(g,'溫室：'+(FT.glass==='none'?'透明玻璃':FN[FT.glass]+'色玻璃'),12,22,{size:13,bold:true,col:'#13202c'});}
function ftUI(){segSet($('ftMode'),FT.mode);document.querySelectorAll('.ftc').forEach(e=>e.hidden=e.dataset.m!==FT.mode);segSet($('ftLight'),FT.light);segSet($('ftF1'),FT.f1);segSet($('ftF2'),FT.f2);segSet($('ftLens'),FT.lens);segSet($('ftCard'),FT.card);segSet($('ftGlass'),FT.glass);
  $('ftHint').textContent={filter:'光由左邊射出：三條細線代表紅、綠、藍三種成分，被玻璃紙吸收的成分在那裡停止（✕）。',glasses:'左邊是不戴眼鏡看到的圖卡，右邊是透過有色鏡片看到的樣子。',house:'換溫室玻璃的顏色，看玫瑰看起來的顏色，以及植物能利用的光。'}[FT.mode];
  $('ftHowT').textContent={filter:'光穿過玻璃紙：怎麼看',glasses:'戴有色眼鏡：怎麼看',house:'溫室的玻璃：怎麼看'}[FT.mode];
  howList('ftHow',{filter:['透明物體的顏色，由它「透過」的色光決定：有色玻璃紙只讓同色光通過，吸收其他色光。','無色透明的玻璃讓所有色光通過。','黃色玻璃紙讓紅、綠光通過（擋藍光）——抗藍光鏡片就是這樣；紅、綠、藍玻璃紙疊在一起，什麼光都過不去。'],
    glasses:['透過紅色鏡片：只有紅光進入眼睛。白紙反射全部的光，經過鏡片後剩紅光，看起來紅色。','和鏡片同色的字會和白紙一樣顏色，看起來「消失」；其他顏色的字變黑。','綠色鏡片看紅色、藍色的圖案都變黑。'],
    house:['葉子是綠色，表示葉子反射（不吸收）綠光；植物生長主要利用紅光和藍光。','只給綠光，植物幾乎沒有可以利用的光，會長不好。','藍色玻璃溫室裡只有藍光：紅花和綠葉都看起來是黑色。']}[FT.mode]);}
segOn($('ftMode'),v=>{FT.mode=v;hideStory();ftUI();SIZE.filt();kick();});
[['ftLight','light'],['ftF1','f1'],['ftF2','f2'],['ftLens','lens'],['ftCard','card'],['ftGlass','glass']].forEach(([id,k])=>segOn($(id),v=>{FT[k]=v;ftUI();kick();}));
function ftResults(){let big='',f='',ck=[];const comp=c=>['紅','綠','藍'].filter((n,i)=>c[i]>.5).join('、')||'沒有光';
  if(FT.mode==='filter'){const L=CV[FT.light],a=mul(L,TV(FT.f1)),b=mul(a,TV(FT.f2));big=`屏幕上：${CN[keyOf(b)]}${keyOf(b)==='K'?'（沒有光通過）':'光'}`;
    f=`${LN[FT.light]}：${comp(L)}<br>${FT.f1==='none'?'':'通過'+FN[FT.f1]+'色玻璃紙：'+comp(a)+'<br>'}${FT.f2==='none'?'':'通過'+FN[FT.f2]+'色玻璃紙：'+comp(b)}`;
    ck=[['info','有色透明體：透過同色光，吸收其他色光。'],['info','抗藍光鏡片可以用白光檢驗：通過後屏幕偏黃（藍光被擋掉）；或用藍光照，屏幕幾乎不亮。']];}
  else if(FT.mode==='glasses'){const T=TV(FT.lens);if(FT.card==='dog'){const vis=[['d','K'],['o','K'],['g','G']].filter(([c,k])=>keyOf(mul(CV[k],T))!==keyOf(mul(CV.W,T))).map(a=>a[0]).join('');big=`看到的字：「${vis}」`;f='跟背景（白紙經過鏡片後的顏色）一樣的字，就看不出來';}
    else{big='白 T 恤看起來：'+CN[keyOf(mul(CV.W,T))]+'；藍星星：'+CN[keyOf(mul(CV.B,T))]+'；紅圓點：'+CN[keyOf(mul(CV.R,T))]+'；黃條紋：'+CN[keyOf(mul(CV.Y,T))];f='進入眼睛的光 ＝ 物體反射的光 再經過鏡片過濾';}
    ck=[['info','有色鏡片 ＝ 濾光片：只讓同色光進入眼睛。']];}
  else{const T=TV(FT.glass);big=`玫瑰看起來：花${CN[keyOf(mul(CV.R,T))]}、葉${CN[keyOf(mul(CV.G,T))]}`;f=`植物能利用的紅光＋藍光：${Math.round((T[0]+T[2])/2*100)}%`;
    ck=[['info','同樣強度的單色光中，洋紅光（紅＋藍）讓植物長得最好；綠光最差。']];}
  $('ftBig').textContent=big;$('ftF').innerHTML=f;checks($('ftC'),ck);}
SIZE.filt=()=>{({W:WF,H:HF}=fit($('cvFt'),.42,260,420));};
UI.filt=()=>{ftUI();};
DRAW.filt=()=>{const g=$('cvFt').getContext('2d');if(FT.mode==='filter')drawFilter(g,WF,HF);else if(FT.mode==='glasses')drawGlasses(g,WF,HF);else drawHouse(g,WF,HF);ftResults();};
