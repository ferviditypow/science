<script>
// ======================================================================
// 6 養樂多結凍：凍結濃縮——為什麼最下面最甜
// ======================================================================
const YKX=13,YKY=26,YK={mode:'slow',c0:.6,run:false,spd:.5,dots:true,T:5,t:0,nf:0,prog:0,c:null,cf:null,sip:null,done:false};
const ykTf=c=>-1.86*c;                       // 凝固點下降：ΔTf ＝ Kf·m
const ykIdx=(i,j)=>j*YKX+i;
const YKTRACE=.03;                           // 冰裡只留一點點糖
function ykReset(){YK.c=new Float32Array(YKY).fill(YK.c0);YK.cf=new Float32Array(YKY);YK.nf=0;YK.prog=0;YK.T=5;YK.t=0;YK.sip=null;YK.done=false;YK.run=false;$('ykPlay').textContent='▶ 放進冷凍庫';}
const ykLiq=()=>YK.c.slice(YK.nf).reduce((a,b)=>a+b,0)/Math.max(1,YKY-YK.nf);   // 還沒結冰的部分有多甜
function ykStep(dt){const fast=YK.mode==='fast',bath=fast?-50:-18;
  YK.t+=dt;YK.T+=-(fast?.75:.16)*(YK.T-bath)*dt;
  if(YK.nf>=YKY){YK.done='all';return;}
  const j=YK.nf,dT=ykTf(YK.c[j])-YK.T;        // 這一層的凝固點比現在的溫度高多少
  if(dT<=0){ if(Math.abs(YK.T-bath)<.4){YK.done='syrup';YK.run=false;$('ykPlay').textContent='▶ 再凍一次';} return; }
  YK.prog+=Math.min(3,dT)*(fast?3.2:.85)*dt;
  while(YK.prog>=1&&YK.nf<YKY){YK.prog-=1;
    const k=YK.nf,left=YKY-k-1;
    YK.cf[k]=fast?YK.c[k]*.75:YKTRACE;        // 急速凍：糖來不及被推走，直接被關進冰裡
    if(!fast&&left>0){const push=YK.c[k]-YKTRACE;
      // 冰晶只收水分子，糖被擠進下面還沒結冰的液體裡（對流會讓它混勻，愈下面愈濃）
      for(let q=k+1;q<YKY;q++)YK.c[q]+=push/left*(1+.5*(q-k-1)/Math.max(1,left-1));}
    YK.c[k]=YK.cf[k];YK.nf++;
    if(YK.nf>=YKY){YK.done='all';YK.run=false;$('ykPlay').textContent='▶ 再凍一次';}}}
DRAW.yak=()=>{const cv=$('cvYK'),o=fit(cv,.86,300,520),g=cv.getContext('2d'),W=o.W,H=o.H;g.clearRect(0,0,W,H);
  const bw=Math.min(W*.46,H*.4),bh=H-56,bx=(W-bw)/2,by=32,ch=bh/YKY,cw=bw/YKX;
  const cmax=Math.max(YK.c0*3,...YK.c,...YK.cf);
  g.fillStyle=C.panel;g.strokeStyle=C.glass;g.lineWidth=3;g.beginPath();g.roundRect(bx-5,by-5,bw+10,bh+10,[16,16,10,10]);g.fill();g.stroke();
  for(let j=0;j<YKY;j++){const frozen=j<YK.nf,c=frozen?YK.cf[j]:YK.c[j],u=clamp(c/cmax,0,1),y=by+j*ch;
    g.fillStyle=frozen?`rgb(${Math.round(228-26*u)},${Math.round(241-26*u)},${Math.round(250-18*u)})`
      :`rgb(${Math.round(255-16*u)},${Math.round(252-96*u)},${Math.round(246-196*u)})`;
    g.fillRect(bx,y,bw,ch+.6);
    if(frozen){g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=1;
      for(let i=0;i<YKX;i+=2){const x=bx+(i+.5)*cw;g.beginPath();g.moveTo(x-cw*.3,y+ch*.5);g.lineTo(x+cw*.3,y+ch*.5);g.moveTo(x,y+ch*.18);g.lineTo(x,y+ch*.82);g.stroke();}}
    if(YK.dots){const n=Math.min(5,Math.round(c/cmax*6));
      for(let q=0;q<n;q++)dot(g,bx+bw*(.08+.84*((hjit(j*9+q,11)+.5))),y+ch*(.5+hjit(j*9+q,12)*.7),Math.max(1.8,cw*.13),frozen?'rgba(232,126,4,.5)':C.sol);}}
  // 結冰前緣
  if(YK.nf>0&&YK.nf<YKY){const y=by+YK.nf*ch;line(g,bx,y,bx+bw,y,C.ice,2.5);text(g,'結冰前緣',bx+bw+8,y+4,{size:11,col:C.ice,bold:true});}
  g.strokeStyle=C.glass;g.lineWidth=3;g.beginPath();g.roundRect(bx-5,by-5,bw+10,bh+10,[16,16,10,10]);g.stroke();
  text(g,'養樂多',bx+bw/2,by-14,{align:'center',size:13,bold:true});
  text(g,`瓶內 ${nf(YK.T,1)} ℃`,8,by-14,{size:12,mono:true,bold:true});
  text(g,`冷凍庫 ${YK.mode==='fast'?'−50':'−18'} ℃`,W-8,by-14,{align:'right',size:12,col:C.muted});
  if(YK.sip){const j=YK.sip==='top'?1:YKY-2,y=by+j*ch+ch/2;line(g,bx+bw+6,y,bx+bw+40,y,C.accent,3);
    text(g,YK.sip==='top'?'吸上面':'吸下面',bx+bw+44,y+4,{size:12,bold:true,col:C.accent});}
  text(g,'白藍＝冰（幾乎純水）　橘色愈深＝糖愈濃',W/2,H-8,{align:'center',size:11,col:C.muted});
  // 右圖
  const cv2=$('cvYKP'),o2=fit(cv2,.86,300,520),g2=cv2.getContext('2d'),W2=o2.W,H2=o2.H;g2.clearRect(0,0,W2,H2);
  const L=56,R=W2-18,T=38,B=H2-40,rh=(B-T)/YKY,xm=cmax;
  text(g2,'每一層的糖量',L,20,{size:13,bold:true});
  for(let j=0;j<YKY;j++){const frozen=j<YK.nf,c=frozen?YK.cf[j]:YK.c[j],y=T+j*rh;
    g2.fillStyle=frozen?'rgba(232,126,4,.42)':C.sol;g2.fillRect(L,y+.8,(R-L)*clamp(c/xm,0,1),rh-1.2);}
  line(g2,L,T,L,B,C.line,1.5);
  const x0=L+(R-L)*clamp(YK.c0/xm,0,1);line(g2,x0,T,x0,B,C.muted,1.5,[5,4]);
  text(g2,'原本的糖量',x0+5,B+15,{size:11,col:C.muted});
  text(g2,'瓶口',L-6,T+10,{align:'right',size:11,col:C.muted});text(g2,'瓶底',L-6,B,{align:'right',size:11,col:C.muted});
  text(g2,'深橘＝還沒結冰　淡橘＝已經結成冰',R,T-10,{align:'right',size:11,col:C.muted});
  text(g2,'愈長＝愈甜 →',R,B+15,{align:'right',size:11,col:C.muted});
  const cur=j=>j<YK.nf?YK.cf[j]:YK.c[j],band=(a,b)=>{let s=0;for(let j=a;j<b;j++)s+=cur(j);return s/(b-a);};
  const n3=Math.round(YKY/3),top=band(0,n3),bot=band(YKY-n3,YKY),ratio=bot/Math.max(top,1e-6);
  $('ykNow').innerHTML=[['上面三分之一的糖量',nf(top,2)+'（原本的 '+nf(top/YK.c0,2)+' 倍）'],
    ['最下面三分之一的糖量',nf(bot,2)+'（原本的 '+nf(bot/YK.c0,2)+' 倍）'],
    ['下面比上面甜',nf(ratio,1)+' 倍'],
    ['還沒結冰那一段的凝固點',YK.nf>=YKY?'—':nf(ykTf(ykLiq()),2)+' ℃']]
    .map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  const sip=YK.sip==='top'?`<b>上面那一口</b>：糖量 ${nf(top,2)}，幾乎沒味道的冰。`:YK.sip==='bot'?`<b>最下面那一口</b>：糖量 ${nf(bot,2)}，是原本的 ${nf(bot/YK.c0,1)} 倍。`:'';
  $('ykSay').innerHTML=(sip?sip+'<br>':'')+(YK.t<.3?'按「放進冷凍庫」，注意看橘色的糖怎麼被結冰前緣一路往下推。'
    :YK.mode==='fast'?`急速凍：整瓶幾乎同時凍住，糖來不及被推走就被關進冰裡，上下差不多（${nf(ratio,1)} 倍）。`
    :YK.done==='syrup'?`凍完了，但<b>最下面還是液體</b>：那一段的糖量 ${nf(ykLiq(),2)} 讓凝固點降到 ${nf(ykTf(ykLiq()),1)} ℃，比冷凍庫的 −18 ℃ 還低，所以凍不起來——那就是最甜、最濃的糖漿。下面比上面甜 <b>${nf(ratio,1)} 倍</b>。`
    :YK.done?`凍好了：最下面比最上面甜 <b>${nf(ratio,1)} 倍</b>。`
    :`結冰中：已經凍了 ${YK.nf} 層。剩下的液體糖量 ${nf(ykLiq(),2)}，凝固點已經降到 ${nf(ykTf(ykLiq()),1)} ℃，所以愈來愈難凍。`);};
TICK.yak=dt=>{const d=sdt(YK,dt);if(d&&!YK.done){const n=2;for(let i=0;i<n;i++)ykStep(d*2/n);}return busy(YK);};
UI.yak=()=>{playTxt($('ykPlay'),YK.run);segSet($('ykMode'),YK.mode);$('ykDots').checked=YK.dots;};
$('ykPlay').addEventListener('click',()=>{if(YK.done)ykReset();YK.run=!YK.run;playTxt($('ykPlay'),YK.run);if(!YK.run)$('ykPlay').textContent='▶ 繼續';hideStory();kick();});
$('ykStep').addEventListener('click',()=>{if(YK.done)ykReset();YK.run=false;playTxt($('ykPlay'),false);$('ykPlay').textContent='▶ 繼續';YK.pend=(YK.pend||0)+.4;kick();});
segSet($('ykSpd'),YK.spd);segOn($('ykSpd'),v=>{YK.spd=+v;kick();});
segOn($('ykMode'),v=>{YK.mode=v;ykReset();kick();});
$('ykReset').addEventListener('click',()=>{ykReset();kick();});
$('ykDots').addEventListener('change',e=>{YK.dots=e.target.checked;kick();});
$('ykTop').addEventListener('click',()=>{YK.sip='top';kick();});
$('ykBot').addEventListener('click',()=>{YK.sip='bot';kick();});
const setYKC=sliderBind('ykC',v=>{YK.c0=v;ykReset();},v=>v<.4?'少一點':v<.8?'一般養樂多':'很甜');
ykReset();
</script>
