// ================= common =================
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,f)=>a+(b-a)*f,TAU=Math.PI*2,D2R=Math.PI/180;
const DPR=()=>Math.min(window.devicePixelRatio||1,2);
const C={};
function readColors(){const s=getComputedStyle(document.documentElement);
  ['bg','panel','ink','muted','line','grid','accent','accent-soft','blue','green','red','purple','ray','water','w1','w2','sum'].forEach(k=>C[k]=s.getPropertyValue('--'+k).trim());}
readColors();
function fit(cv,ratio,minH,maxH){if(!cv.clientWidth&&cv.width>20){const d=DPR();return{W:cv.width/d,H:cv.height/d};}const w=Math.max(10,cv.clientWidth);const h=Math.round(clamp(w*ratio,minH,maxH));
  cv.style.height=h+'px';const d=DPR();cv.width=Math.round(w*d);cv.height=Math.round(h*d);cv.getContext('2d').setTransform(d,0,0,d,0,0);return{W:w,H:h};}
function segSet(el,v){el.querySelectorAll('button[data-v]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===String(v))));}
function segOn(el,fn){el.addEventListener('click',e=>{const b=e.target.closest('button[data-v]');if(b)fn(b.dataset.v);});}
const FONT='"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif';
function text(g,s,x,y,{col=C.ink,size=13,bold=false,align='left',base='alphabetic',bg=null}={}){
  g.font=`${bold?700:500} ${size}px ${FONT}`;g.textAlign=align;g.textBaseline=base;
  {const w=g.measureText(s).width,cw=g.canvas.clientWidth||1e9;let px=align==='center'?x-w/2:align==='right'?x-w:x;const sh=Math.max(6-px,0)+Math.min(cw-6-(px+w),0);x+=sh;}
  if(bg){const w=g.measureText(s).width,px=align==='center'?x-w/2:align==='right'?x-w:x,py=base==='middle'?y-size/2:y-size;g.save();g.fillStyle=bg;g.globalAlpha=.85;g.fillRect(px-4,py-2,w+8,size+6);g.restore();}
  g.fillStyle=col;g.fillText(s,x,y);}
function line(g,x1,y1,x2,y2,col,w=2,dash=null){g.strokeStyle=col;g.lineWidth=w;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);}
function head(g,x,y,ang,col,size=9){g.fillStyle=col;g.beginPath();g.moveTo(x+Math.cos(ang)*size*.5,y+Math.sin(ang)*size*.5);g.lineTo(x-size*Math.cos(ang-.45),y-size*Math.sin(ang-.45));g.lineTo(x-size*Math.cos(ang+.45),y-size*Math.sin(ang+.45));g.closePath();g.fill();}
function arrow(g,x1,y1,x2,y2,col,w=2){line(g,x1,y1,x2,y2,col,w);head(g,x2,y2,Math.atan2(y2-y1,x2-x1),col,10);}
function handle(g,x,y,r=9){g.fillStyle=C.accent;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.strokeStyle=C.panel;g.lineWidth=2;g.stroke();}
function dragger(cv,handles,after){let cur=null;const pos=ev=>{const r=cv.getBoundingClientRect();return[ev.clientX-r.left,ev.clientY-r.top];};
  const pick=(x,y)=>{let best=null,bd=1e9;for(const h of handles()){const d=h.hit?h.hit(x,y):Math.hypot(x-h.x,y-h.y);if(d<(h.r||26)&&d<bd){bd=d;best=h;}}return best;};
  cv.addEventListener('pointerdown',ev=>{const[x,y]=pos(ev);const h=pick(x,y);if(!h)return;cur={h,dx:h.free?0:h.x-x,dy:h.free?0:h.y-y};h.start&&h.start();cv.setPointerCapture(ev.pointerId);ev.preventDefault();});
  cv.addEventListener('pointermove',ev=>{const[x,y]=pos(ev);if(!cur){cv.style.cursor=pick(x,y)?'grab':'default';return;}cur.h.move(x+cur.dx,y+cur.dy);after();});
  const up=()=>{cur=null;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);}
function nmRGBa(nm){let r=0,g=0,b=0;if(nm<440){r=-(nm-440)/60;b=1;}else if(nm<490){g=(nm-440)/50;b=1;}else if(nm<510){g=1;b=-(nm-510)/20;}else if(nm<580){r=(nm-510)/70;g=1;}else if(nm<645){r=1;g=-(nm-645)/65;}else r=1;
  let f=1;if(nm<420)f=.45+.55*(nm-380)/40;else if(nm>700)f=.45+.55*(780-nm)/80;return[r*f,g*f,b*f].map(v=>clamp(v,0,1));}
const rgbStr=(a,k=1)=>`rgb(${a.map(v=>Math.round(255*Math.pow(clamp(v*k,0,1),.8))).join(',')})`;
const nmCol=nm=>rgbStr(nmRGBa(nm));
const f1=x=>(Math.round(x*10)/10).toFixed(1),f2=x=>(Math.round(x*100)/100).toFixed(2);
const checks=(el,L)=>{el.innerHTML=L.map(([c,t])=>`<li class="${c}"><span>${t}</span></li>`).join('');};
