// ================= 實驗台切換與迴圈 =================
let bench='make';const BENCHES=['make','speed','scope','inst','echo','range'];const MODES=['wall','cliff','move','depth','map','law'];
const SIZE={},DRAW={},TICK={},UI={},STOP=[];
function setBench(b,noHash){if(MODES.includes(b)){E.mode=b;b='echo';}if(!BENCHES.includes(b))b='make';if(b!==bench)STOP.forEach(f=>f());bench=b;segSet($('benchSeg'),b);
  BENCHES.forEach(k=>$('b-'+k).hidden=k!==b);if(!noHash)history.replaceState(null,'','#'+b);UI[b]&&UI[b]();SIZE[b]();kick();}
segOn($('benchSeg'),v=>{hideStory();setBench(v);});
let raf=0,lastT=0;
function kick(){if(!raf)raf=requestAnimationFrame(loop);}
function loop(now){raf=0;const dt=lastT?Math.min(.05,(now-lastT)/1000):0;lastT=now;
  let more=false;try{more=TICK[bench]?TICK[bench](dt):false;DRAW[bench]();}catch(e){console.error(e);more=false;}
  if(more&&!raf)raf=requestAnimationFrame(loop);else if(!more&&!raf)lastT=0;}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{readColors();readMore();kick();});
function showStory(t,p){$('storyT').textContent=t;$('storyP').innerHTML=p;$('story').hidden=false;}
function hideStory(){$('story').hidden=true;}
$('storyX').addEventListener('click',hideStory);
$('storyBack').addEventListener('click',()=>$('qpanel').scrollIntoView({behavior:'smooth',block:'start'}));
const playTxt=(el,on)=>{el.textContent=on?'❚❚ 暫停':'▶ 播放';};


// ---------- 聲音播放 ----------
let AC=null;function ac(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state!=='running')AC.resume();return AC;}
const HARM={fork:[1],flute:[1,.45,.14,.06,.03],clar:[1,0,.6,0,.38,0,.22,0,.12],violin:[1,.75,.55,.42,.33,.26,.2,.16,.12],piano:[1,.55,.32,.2,.1,.08,.05],voice:[1,.9,.5,.65,.2,.3,.1]};
const PW={};function pwave(k){const c=ac();if(!PW[k]){const h=HARM[k]||[1];const re=new Float32Array(h.length+1),im=new Float32Array(h.length+1);h.forEach((a,i)=>im[i+1]=a);PW[k]=c.createPeriodicWave(re,im);}return PW[k];}
let NOISEB=null;function noiseBuf(){const c=ac();if(!NOISEB){NOISEB=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const d=NOISEB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}return NOISEB;}
function tone(f,{src='fork',dur=1,gain=.25,at=0,decay=false}={}){try{const c=ac(),t0=c.currentTime+.03+at;const g=c.createGain();
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(gain,t0+.015);if(decay)g.gain.exponentialRampToValueAtTime(.0005,t0+dur);else{g.gain.setValueAtTime(gain,t0+dur-.06);g.gain.linearRampToValueAtTime(0,t0+dur);}
  g.connect(c.destination);let s;if(src==='noise'){s=c.createBufferSource();s.buffer=noiseBuf();const bp=c.createBiquadFilter();bp.type='lowpass';bp.frequency.value=3000;s.connect(bp);bp.connect(g);}
  else{s=c.createOscillator();if(src==='fork')s.type='sine';else s.setPeriodicWave(pwave(src));s.frequency.value=f;s.connect(g);}
  s.start(t0);s.stop(t0+dur+.05);}catch(e){console.error(e);}}
// 持續發聲（音量每格更新）
function contSrc(f,src='fork'){const c=ac();const g=c.createGain();g.gain.value=0;g.connect(c.destination);const o=c.createOscillator();if(src==='fork')o.type='sine';else o.setPeriodicWave(pwave(src));o.frequency.value=f;o.connect(g);o.start();
  return {o,g,set(v){g.gain.setTargetAtTime(v,c.currentTime,.03);},freq(x){o.frequency.setTargetAtTime(x,c.currentTime,.02);},stop(){try{g.gain.setTargetAtTime(0,c.currentTime,.03);o.stop(c.currentTime+.2);}catch(e){}}};}
