<script>
// ======================================================================
// 4 兩點波源干涉：白紙上的亮紋、暗紋與不動的灰線（節線）
// ======================================================================
const T4={f:8,h:1,d:8,amp:.6,Hl:40,Hs:40,run:!reduced,T:0,spd:.12,avg:false,node:true,xs:10,dirty:true,ghost:null,nstep:0};
const IW4=320,IH4=Math.round(IW4*TH/TW);let im4=null,buf4=null,oc4=null;
const w4=()=>{const v=vOf(T4.h),lam=v/T4.f;return{v,lam,k:TAU/lam,w:TAU*T4.f,A:T4.amp/10,
  b:(N_W-1)*(T4.h/N_W+T4.Hs)/((T4.Hl+T4.Hs)/T4.Hl)};};
const srcs4=()=>[[T4.xs,TH/2-T4.d/2],[T4.xs,TH/2+T4.d/2]];
// 水面高度與二階導數（極座標展開後相加）
function fld4(x,z,t,W,S){let e=0,hxx=0,hzz=0,hxz=0;
  for(let s=0;s<2;s++){const dx=x-S[s][0],dz=z-S[s][1];let r=Math.sqrt(dx*dx+dz*dz);if(r<.35)r=.35;
    const rm=Math.max(r,1.4),a=W.A*(1-Math.exp(-r*r/1.5))/Math.sqrt(rm/2),ps=W.k*r-W.w*t,si=Math.sin(ps),co=Math.cos(ps),
      ap=-a/(2*rm),app=3*a/(4*rm*rm),
      P=ap*si+a*W.k*co, Q=app*si+2*ap*W.k*co-a*W.k*W.k*si, ux=dx/r,uz=dz/r,pr=P/r;
    e+=a*si;hxx+=Q*ux*ux+pr*(1-ux*ux);hzz+=Q*uz*uz+pr*(1-uz*uz);hxz+=(Q-pr)*ux*uz;}
  return[e,hxx,hzz,hxz];}
const bright4=(x,z,t,W,S)=>{const[,xx,zz,xz]=fld4(x,z,t,W,S),b=W.b,
  det=(1+b*xx)*(1+b*zz)-b*b*xz*xz;return Math.min(4,1/Math.max(.08,Math.abs(det)));};
function paint4(){const W=w4(),S=srcs4(),t=T4.T;
  if(!im4){oc4=document.createElement('canvas');oc4.width=IW4;oc4.height=IH4;im4=oc4.getContext('2d').createImageData(IW4,IH4);buf4=new Float32Array(IW4*IH4);}
  const NP=T4.avg?8:1;buf4.fill(0);
  for(let p=0;p<NP;p++){const tt=T4.avg?p/NP/T4.f:t;
    for(let j=0;j<IH4;j++){const z=(j+.5)/IH4*TH;
      for(let i=0;i<IW4;i++){const x=(i+.5)/IW4*TW;buf4[j*IW4+i]+=bright4(x,z,tt,W,S);}}}
  const d=im4.data;for(let n=0;n<buf4.length;n++){const I=buf4[n]/NP,v=Math.round(255*clamp(.70+.62*(I-1),0,1)),o=n*4;
    if(T4.view==='water'){const e=0;d[o]=v;d[o+1]=v;d[o+2]=v;}else{d[o]=v;d[o+1]=v;d[o+2]=Math.min(255,v+3);}d[o+3]=255;}
  if(T4.view==='water'){const amp=W.A*1.9;for(let j=0;j<IH4;j++){const z=(j+.5)/IH4*TH;for(let i=0;i<IW4;i++){const x=(i+.5)/IW4*TW,
      e=T4.avg?Math.abs(fld4(x,z,0,W,S)[0])+Math.abs(fld4(x,z,.25/T4.f,W,S)[0]):fld4(x,z,t,W,S)[0],
      u=clamp(T4.avg?e/(2*amp):.5+.5*e/amp,0,1),o=(j*IW4+i)*4;
      d[o]=Math.round(26+210*u);d[o+1]=Math.round(90+150*u);d[o+2]=Math.round(140+110*u);d[o+3]=255;}}}
  oc4.getContext('2d').putImageData(im4,0,0);T4.dirty=false;T4.key=[T4.avg,T4.view,T4.f,T4.h,T4.d,T4.amp,T4.avg?0:t].join();}
DRAW.two=()=>{const cv=$('cvT'),G=tankGeo(cv),g=cv.getContext('2d'),{X,Y,k}=G,W=w4(),S=srcs4();
  const key=[T4.avg,T4.view,T4.f,T4.h,T4.d,T4.amp,T4.avg?0:T4.T].join();if(key!==T4.key)paint4();
  tankBase(g,G);g.save();g.imageSmoothingEnabled=true;g.drawImage(oc4,G.ox,G.oy,TW*k,TH*k);g.restore();
  // 節線（雙曲線：|r1−r2| ＝ (m+½)λ）
  g.save();g.beginPath();g.rect(G.ox,G.oy,TW*k,TH*k);g.clip();
  if(T4.node){const zc=TH/2,hd=T4.d/2;
    for(let m=0;;m++){const A=(m+.5)*W.lam/2;if(A>=hd-.05)break;const B=Math.sqrt(hd*hd-A*A);
      [1,-1].forEach(sg=>{g.strokeStyle=C.accent;g.lineWidth=2;g.setLineDash([7,5]);g.beginPath();
        for(let u=-3;u<=3.001;u+=.04){const z=zc+sg*A*Math.cosh(u),x=T4.xs+B*Math.sinh(u);
          if(u===-3)g.moveTo(X(x),Y(z));else g.lineTo(X(x),Y(z));}g.stroke();g.setLineDash([]);});}
    for(let m=1;;m++){const A=m*W.lam/2;if(A>=hd-.05)break;const B=Math.sqrt(hd*hd-A*A);
      [1,-1].forEach(sg=>{g.strokeStyle='rgba(60,140,80,.75)';g.lineWidth=1.6;g.beginPath();
        for(let u=-3;u<=3.001;u+=.04){const z=zc+sg*A*Math.cosh(u),x=T4.xs+B*Math.sinh(u);
          if(u===-3)g.moveTo(X(x),Y(z));else g.lineTo(X(x),Y(z));}g.stroke();});}
    g.strokeStyle='rgba(60,140,80,.75)';g.lineWidth=1.6;g.beginPath();g.moveTo(X(T4.xs),Y(TH/2));g.lineTo(X(TW),Y(TH/2));g.stroke();
  }
  g.restore();
  // 波源
  S.forEach(([x,z])=>{g.fillStyle='#2b3138';g.beginPath();g.arc(X(x),Y(z),5,0,TAU);g.fill();
    g.strokeStyle=WHITE;g.lineWidth=1.5;g.stroke();});
  text(g,'兩個同相點波源',X(T4.xs),Y(TH/2-T4.d/2)-14,{size:11,col:'#fff',bg:LBG,align:'center'});
  if(T4.node){text(g,'橘虛線＝節線（白紙上的灰線）',G.ox+8,G.oy+TH*k-24,{size:11,col:'#fff',bg:LBG});
    text(g,'綠線＝腹線（振幅最大）',G.ox+8,G.oy+TH*k-7,{size:11,col:'#fff',bg:LBG});}
  tankFrame(g,G);
  const n=Math.floor(T4.d/W.lam*2)+1;
  $('tNow').innerHTML=`<div><dt>波速</dt><dd>${nf(W.v,1)} cm/s</dd></div><div><dt>波長</dt><dd>${nf(W.lam,2)} cm</dd></div><div><dt>兩波源間距</dt><dd>${nf(T4.d,1)} cm ＝ ${nf(T4.d/W.lam,2)} λ</dd></div><div><dt>節線條數</dt><dd>${2*Math.ceil(T4.d/W.lam-.5)} 條</dd></div>`;
  $('tSay').innerHTML=T4.avg
    ?'這是<b>肉眼看到的</b>樣子（對時間平均）：會動的亮暗紋糊掉了，只剩下幾條<b>不動的灰線</b>——那就是節線。灰線上水面幾乎不動，光不會聚也不發散，所以維持原來的亮度。'
    :'現在是<b>瞬間</b>的畫面：亮紋暗紋會一圈圈往外跑，但橘色虛線（節線）上永遠是灰的、不動。切到「肉眼看到的」就只剩灰線。';}
TICK.two=dt=>{if(!T4.run)return false;T4.T+=dt*T4.spd;return true;};
UI.two=()=>{playTxt($('tPlay'),T4.run);$('tNode').checked=T4.node;segSet($('tView'),T4.view);segSet($('tMode'),T4.avg?'avg':'now');segSet($('tSpd'),T4.spd);
  $('tStepW').style.display=T4.avg?'none':'';};
const setTD=sliderBind('tD',v=>{T4.d=v;},v=>nf(v,1)+' cm'),setTF=sliderBind('tF',v=>{T4.f=v;},v=>v+' Hz'),setTH4=sliderBind('tH',v=>{T4.h=v;},v=>nf(v,1)+' cm');
segOn($('tView'),v=>{T4.view=v;hideStory();kick();});
segOn($('tMode'),v=>{T4.avg=v==='avg';UI.two();hideStory();kick();});
segOn($('tSpd'),v=>{T4.spd=+v;});
$('tNode').addEventListener('change',e=>{T4.node=e.target.checked;kick();});
function goT(o){setBench('two');Object.assign(T4,o);setTD(T4.d);setTF(T4.f);setTH4(T4.h);UI.two();}
</script>
