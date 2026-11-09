
// =====================================================================
// 3 示波器與三要素
// =====================================================================
const SC={n:2,sel:0,div:1,tr:[{src:'fork',f:400,a:3},{src:'fork',f:400,a:1.5},{src:'fork',f:200,a:2},{src:'fork',f:400,a:1}],dbA:80,dbB:40};
const TRN=['甲','乙','丙','丁'],TRC=['#5ee08a','#ffd166','#7cc6ff','#ff8fab'];
const SRCN={fork:'音叉',flute:'長笛',clar:'單簧管',violin:'小提琴',piano:'鋼琴',voice:'人聲',noise:'噪音'};
const WMAX={};function wv(src,p){if(src==='noise'){let s=0;for(let k=1;k<9;k++)s+=Math.sin(p*TAU*(k*1.37+.3)+k*k)*(1/k);return s*.9*(.6+.4*Math.sin(p*3.1));}
  const h=HARM[src]||[1];if(!WMAX[src]){let m=0;for(let i=0;i<400;i++){const q=i/400;let s=0;h.forEach((a,k)=>s+=a*Math.sin(TAU*(k+1)*q));m=Math.max(m,Math.abs(s));}WMAX[src]=m;}
  let s=0;h.forEach((a,k)=>s+=a*Math.sin(TAU*(k+1)*p));return s/WMAX[src];}
let WSC=600,HSC=300,WDB=300,HDB=80;
function scUI(){segSet($('scN'),String(SC.n));const sel=$('scSel');sel.innerHTML='';for(let i=0;i<SC.n;i++){const b=document.createElement('button');b.dataset.v=i;b.textContent=TRN[i];sel.appendChild(b);}
  SC.sel=Math.min(SC.sel,SC.n-1);segSet(sel,String(SC.sel));const T=SC.tr[SC.sel];segSet($('scSrc'),T.src);$('scF').value=T.f;$('scFo').textContent=T.src==='noise'?'（沒有固定頻率）':T.f+' Hz';$('scA').value=T.a;$('scAo').textContent=T.a+' 格';segSet($('scDiv'),String(SC.div));
  $('scPlayAll').hidden=SC.n===1;$('dbA').value=SC.dbA;$('dbB').value=SC.dbB;$('dbAo').textContent=SC.dbA+' dB';$('dbBo').textContent=SC.dbB+' dB';}
segOn($('scN'),v=>{SC.n=+v;hideStory();scUI();SIZE.scope();kick();});
segOn($('scSel'),v=>{SC.sel=+v;scUI();kick();});
segOn($('scSrc'),v=>{SC.tr[SC.sel].src=v;scUI();kick();});
segOn($('scDiv'),v=>{SC.div=+v;scUI();kick();});
$('scF').addEventListener('input',()=>{SC.tr[SC.sel].f=+$('scF').value;scUI();kick();});
$('scA').addEventListener('input',()=>{SC.tr[SC.sel].a=+$('scA').value;scUI();kick();});
$('dbA').addEventListener('input',()=>{SC.dbA=+$('dbA').value;scUI();kick();});
$('dbB').addEventListener('input',()=>{SC.dbB=+$('dbB').value;scUI();kick();});
const playTr=(T,at=0)=>tone(T.f,{src:T.src,gain:.05*T.a,dur:1,at,decay:T.src==='piano'});
$('scPlay').addEventListener('click',()=>playTr(SC.tr[SC.sel]));
$('scPlayAll').addEventListener('click',()=>{for(let i=0;i<SC.n;i++)playTr(SC.tr[i],i*1.2);});
function drawScope(g,W,H){g.fillStyle='#0e1a14';g.fillRect(0,0,W,H);const n=SC.n,pad=8,ph=(H-pad*(n+1))/n,L=40,R=W-14,ms=SC.div*10;
  for(let i=0;i<n;i++){const T=SC.tr[i],y0=pad+i*(ph+pad),ym=y0+ph/2,dv=ph/8,dx=(R-L)/10;
    g.strokeStyle='rgba(120,200,150,.18)';g.lineWidth=1;for(let k=0;k<=10;k++)line(g,L+k*dx,y0,L+k*dx,y0+ph,'rgba(120,200,150,.18)',1);for(let k=0;k<=8;k++)line(g,L,y0+k*dv,R,y0+k*dv,k===4?'rgba(120,200,150,.4)':'rgba(120,200,150,.18)',1);
    text(g,TRN[i],L-22,ym+6,{size:16,bold:true,col:TRC[i]});
    g.strokeStyle=TRC[i];g.lineWidth=i===SC.sel&&n>1?2.6:2;g.shadowColor=TRC[i];g.shadowBlur=6;g.beginPath();
    for(let x=L;x<=R;x+=1){const tms=(x-L)/(R-L)*ms;const p=T.f*tms/1000;const y=ym-T.a*dv*wv(T.src,p);x===L?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();g.shadowBlur=0;
    text(g,`${SRCN[T.src]}　${T.src==='noise'?'不規則':T.f+' Hz'}　振幅 ${T.a} 格`,R-6,y0+14,{size:11,col:TRC[i],align:'right'});
    if(T.src!=='noise'&&(i===SC.sel||n===1)){const Tms=1000/T.f;const px=Tms/ms*(R-L);if(px>18&&px<R-L){const yb=y0+ph-8;line(g,L,yb,L+px,yb,'#fff',1.5);line(g,L,yb-5,L,yb+5,'#fff',1.5);line(g,L+px,yb-5,L+px,yb+5,'#fff',1.5);text(g,'1 個週期 '+nf(Tms,2)+' ms',L+px+6,yb+4,{size:11,col:'#fff'});}}}
  text(g,'橫軸：每格 '+SC.div+' ms（全部 '+ms+' ms）',W-12,H-2,{size:10,col:'rgba(220,255,230,.7)',align:'right'});}
function drawDb(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const L=10,R=W-10,y=H*.55,X=d=>L+d/140*(R-L);line(g,L,y,R,y,C.ink,2);
  for(let d=0;d<=140;d+=20){line(g,X(d),y-5,X(d),y+5,C.ink,1.5);text(g,String(d),X(d),y+18,{size:10,align:'center',col:C.muted});}
  [[SC.dbA,'甲',C.echo],[SC.dbB,'乙',C.snd]].forEach(([d,n,c],i)=>{dot(g,X(d),y,c,7);text(g,n,X(d),y-12-(i*0),{size:12,bold:true,col:c,align:'center'});});}
function scResults(){const tr=SC.tr.slice(0,SC.n);let big='',f='',ck=[];const v=340;
  if(SC.n===1){const T=tr[0];big=T.src==='noise'?'噪音：波形沒有規律，也沒有固定的頻率':`${SRCN[T.src]} ${T.f} Hz：每秒振動 ${T.f} 次`;
    f=T.src==='noise'?'樂音的波形有規律；噪音沒有規律，聽起來不舒服':`週期 T ＝ 1 ÷ f ＝ 1 ÷ ${T.f} ＝ ${nf(1000/T.f,2)} ms<br>空氣中（340 m/s）波長 λ ＝ v ÷ f ＝ ${nf(v/T.f,3)} m`;
    ck=[['info','響度：由振幅決定，振幅越大越大聲（單位分貝 dB）。'],['info','音調：由頻率決定，頻率越高音調越高（單位 Hz）。'],['info','音色：由波形決定，不同樂器、不同的人波形不同；音叉是最單純的正弦波，常用來調音。']];}
  else{const pairs=[];for(let i=0;i<tr.length;i++)for(let j=i+1;j<tr.length;j++)pairs.push([i,j]);
    const desc=([i,j])=>{const A=tr[i],B=tr[j];const sa=A.a===B.a,sf=A.f===B.f||A.src==='noise'&&B.src==='noise',ss=A.src===B.src;return {i,j,sa,sf,ss};};const D=pairs.map(desc);
    if(SC.n===2){const d=D[0];const diff=[!d.sa&&'響度',!d.sf&&'音調',!d.ss&&'音色'].filter(Boolean);big=diff.length?`甲、乙的${diff.join('、')}不同`:'甲、乙完全一樣';
      ck=[[d.sa?'ok':'no',`響度（振幅）：${d.sa?'相同':'不同——振幅'+(tr[0].a>tr[1].a?'甲':'乙')+'較大，較大聲'}`],[d.sf?'ok':'no',`音調（頻率）：${d.sf?'相同':'不同——'+(tr[0].f>tr[1].f?'甲':'乙')+'的波較密，音調較高'}`],[d.ss?'ok':'no',`音色（波形）：${d.ss?'相同':'不同——'+SRCN[tr[0].src]+'和'+SRCN[tr[1].src]+'的波形不一樣'}`]];}
    else{const nm=x=>TRN[x];const sameA=D.filter(d=>d.sa&&!d.sf).map(d=>nm(d.i)+nm(d.j)),sameF=D.filter(d=>d.sf&&!d.sa).map(d=>nm(d.i)+nm(d.j));
      const hi=tr.reduce((b,T,i)=>T.f>tr[b].f?i:b,0),loud=tr.reduce((b,T,i)=>T.a>tr[b].a?i:b,0);
      big=`音調最高：${nm(hi)}；響度最大：${nm(loud)}`;ck=[['info','響度相同、音調不同：'+(sameA.join('、')||'沒有')],['info','音調相同、響度不同：'+(sameF.join('、')||'沒有')],['info',`振幅最大的 ${nm(loud)} 能量最大，可以傳得最遠。`]];}
    f=tr.map((T,i)=>`${TRN[i]}：${SRCN[T.src]}，${T.src==='noise'?'不規則':T.f+' Hz（T＝'+nf(1000/T.f,2)+' ms）'}，振幅 ${T.a} 格`).join('<br>');}
  $('scBig').textContent=big;$('scF2').innerHTML=f;checks($('scC'),ck);
  const d=SC.dbA-SC.dbB,r=Math.pow(10,Math.abs(d)/10);$('dbTxt').innerHTML=d===0?'一樣強':`${d>0?'甲':'乙'}比${d>0?'乙':'甲'}多 ${Math.abs(d)} dB → 強度是 10<sup>${Math.abs(d)/10}</sup> ＝ ${Math.round(r).toLocaleString()} 倍`;}
SIZE.scope=()=>{({W:WSC,H:HSC}=fit($('cvSc'),SC.n===4?.62:SC.n===2?.42:.3,SC.n===4?420:220,SC.n===4?620:400));({W:WDB,H:HDB}=fit($('cvDb'),.16,60,80));};
UI.scope=()=>{scUI();};
DRAW.scope=()=>{drawScope($('cvSc').getContext('2d'),WSC,HSC);drawDb($('cvDb').getContext('2d'),WDB,HDB);scResults();};
