
// ================= 實驗台切換與迴圈 =================
let bench='disp';const BENCHES=['disp','mix','obj','filt'];
const SIZE={},DRAW={},TICK={},UI={};
function setBench(b,noHash){if(!BENCHES.includes(b))b='disp';bench=b;segSet($('benchSeg'),b);
  BENCHES.forEach(k=>$('b-'+k).hidden=k!==b);if(!noHash)history.replaceState(null,'','#'+b);UI[b]&&UI[b]();SIZE[b]();kick();}
segOn($('benchSeg'),v=>{hideStory();setBench(v);});
let raf=0,lastT=0;
function kick(){if(!raf)raf=requestAnimationFrame(loop);}
function loop(now){raf=0;const dt=lastT?Math.min(.05,(now-lastT)/1000):0;lastT=now;
  let more=false;try{more=TICK[bench]?TICK[bench](dt):false;DRAW[bench]();}catch(e){console.error(e);more=false;}
  if(more&&!raf)raf=requestAnimationFrame(loop);else if(!more&&!raf)lastT=0;}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{readColors();kick();});
function showStory(t,p){$('storyT').textContent=t;$('storyP').innerHTML=p;$('story').hidden=false;}
function hideStory(){$('story').hidden=true;}
$('storyX').addEventListener('click',hideStory);
$('storyBack').addEventListener('click',()=>$('qpanel').scrollIntoView({behavior:'smooth',block:'start'}));
const nf=(x,dp=2)=>(Math.round(x*10**dp)/10**dp).toString();
const howList=(el,arr)=>{$(el).innerHTML=arr.map(s=>`<li>${s}</li>`).join('');};

// ================= 顏色工具 =================
// 三色模型：每種光或物體用 [紅, 綠, 藍] 三個成分（0～1）表示
const CK=['W','R','G','B','Y','M','C','K'];
const CV={W:[1,1,1],R:[1,0,0],G:[0,1,0],B:[0,0,1],Y:[1,1,0],M:[1,0,1],C:[0,1,1],K:[0,0,0]};
const CN={W:'白',R:'紅',G:'綠',B:'藍',Y:'黃',M:'洋紅',C:'青',K:'黑'};
const LN={W:'白光',R:'紅光',G:'綠光',B:'藍光',Y:'黃光',M:'洋紅光',C:'青光',K:'沒有光'};
// 紙張（物體）在白光下的顏色
const PAPER={W:[245,245,240],R:[214,40,40],G:[36,160,70],B:[36,86,204],Y:[244,206,40],M:[204,48,160],C:[40,184,206],K:[24,24,26]};
// 光的顏色（在黑底上）
const LIGHT={W:[255,255,255],R:[255,40,30],G:[40,230,60],B:[50,90,255],Y:[255,230,40],M:[255,50,220],C:[40,230,255],K:[0,0,0]};
const mul=(a,b)=>a.map((v,i)=>v*b[i]);
const add=(a,b)=>a.map((v,i)=>Math.min(1,v+b[i]));
function keyOf(c){const b=c.map(v=>v>.5?1:0);for(const k of CK)if(CV[k].every((v,i)=>v===b[i]))return k;return 'K';}
// 物體在某種光下看起來的顏色（畫在畫面上）
function seenRGB(paperKey,light){const p=CV[paperKey],s=mul(p,light);const k=keyOf(s);if(k==='K')return 'rgb(24,24,26)';const base=PAPER[k];const lum=Math.max(...s.filter((v,i)=>p[i]>0).concat([0]));const f=.35+.65*Math.min(1,lum);return `rgb(${base.map(v=>Math.round(v*f)).join(',')})`;}
const paperCss=k=>`rgb(${PAPER[k].join(',')})`;
const lightCss=(c,a=1)=>`rgba(${Math.round(c[0]*255)},${Math.round(c[1]*255)},${Math.round(c[2]*255)},${a})`;
const swatch=k=>`<span class="sw" style="background:${paperCss(k)}"></span>`;
function nameRGB(c){const mx=Math.max(...c);if(mx<.08)return '黑';const n=c.map(v=>v/mx);const on=n.map(v=>v>.75),mid=n.map(v=>v>.25&&v<=.75);
  const cnt=on.filter(Boolean).length;let base;
  if(cnt===3)base='白';else if(cnt===2)base=on[0]&&on[1]?'黃':on[0]&&on[2]?'洋紅':'青';else base=on[0]?'紅':on[1]?'綠':'藍';
  let mod='';if(cnt===1&&mid.some(Boolean)){const i=mid.indexOf(true);mod=base==='紅'&&i===1?'橙':base==='綠'&&i===0?'黃綠':base==='綠'&&i===2?'青綠':base==='藍'&&i===0?'紫':base==='藍'&&i===1?'天藍':base==='紅'&&i===2?'桃紅':'';}
  if(cnt===2&&mid.some(Boolean))mod='偏白的'+base;if(cnt===3)return mx<.6?'灰':'白';
  const nm=mod&&!mod.startsWith('偏')?mod:(mod||base);return (mx<.55?'暗':'')+nm;}
function possible(seenK,light){return CK.filter(k=>keyOf(mul(CV[k],light))===seenK);}
function segFill(id,keys,names){const s=$(id);s.innerHTML='';keys.forEach(k=>{const b=document.createElement('button');b.dataset.v=k;b.innerHTML=(k==='none'?'':swatch(k))+(names[k]||k);s.appendChild(b);});}
