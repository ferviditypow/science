
// ================= 實驗台切換與迴圈 =================
let bench='flow';const BENCHES=['flow','sp','meter','ohm'];
const SIZE={},DRAW={},TICK={},UI={};
function setBench(b,noHash){if(!BENCHES.includes(b))b='flow';bench=b;segSet($('benchSeg'),b);
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

