
// ================= 繪圖小工具 =================
const RC=n=>[C.snd,C.echo,C.purple,C.green,C.muted][Math.min(n,4)];
function person(g,x,G,dir=1,col=C.ink,shout=0){g.save();g.strokeStyle=col;g.fillStyle=col;g.lineWidth=2.4;g.lineCap='round';
  const hy=G-44;g.beginPath();g.arc(x,hy,9,0,TAU);g.stroke();
  g.beginPath();g.moveTo(x,hy+9);g.lineTo(x,G-16);g.moveTo(x,G-16);g.lineTo(x-7,G);g.moveTo(x,G-16);g.lineTo(x+7,G);
  g.moveTo(x,hy+15);g.lineTo(x+dir*9,hy+22);g.moveTo(x,hy+15);g.lineTo(x-dir*8,hy+24);g.stroke();
  g.beginPath();g.arc(x+dir*4,hy-2,1.6,0,TAU);g.fill();
  if(shout>0){g.globalAlpha=shout;g.lineWidth=2;for(let k=1;k<=3;k++){g.beginPath();g.arc(x+dir*6,hy+3,6+k*5,-.5+(dir<0?Math.PI:0),.5+(dir<0?Math.PI:0));g.stroke();}}
  g.restore();}
function ear(g,x,y,col=C.ink){g.save();g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.moveTo(x-4,y+8);g.bezierCurveTo(x-10,y+2,x-9,y-11,x,y-11);g.bezierCurveTo(x+8,y-11,x+9,y-2,x+3,y+3);g.lineTo(x+1,y+9);g.stroke();g.restore();}
function cliffR(g,x,G,top,w=70){g.save();g.fillStyle=C.cliff;g.beginPath();g.moveTo(x+w,G);g.lineTo(x,G);
  const n=7;for(let i=1;i<=n;i++){const yy=G-(G-top)*i/n;g.lineTo(x+((i%2)?4:-3),yy);}g.lineTo(x+18,top-8);g.lineTo(x+w,top+6);g.closePath();g.fill();g.restore();}
function cliffL(g,x,G,top,w=70){g.save();g.translate(2*x,0);g.scale(-1,1);cliffR(g,x,G,top,w);g.restore();}
function wallA(g,x,G,top,mat){g.save();const w=22;g.fillStyle=mat==='hard'?'#9aa3ab':mat==='cloth'?'#a0453b':'#7e8d6a';g.fillRect(x,top,w,G-top);
  g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1;
  if(mat==='hard'){for(let y=top+14;y<G;y+=14)line(g,x,y,x+w,y,'rgba(0,0,0,.2)',1);}
  else if(mat==='cloth'){g.strokeStyle='rgba(255,255,255,.35)';for(let k=0;k<4;k++){g.beginPath();for(let y=top;y<=G;y+=4){const xx=x+3+k*5+Math.sin(y*.12+k)*2;y===top?g.moveTo(xx,y):g.lineTo(xx,y);}g.stroke();}}
  else{g.fillStyle='rgba(0,0,0,.28)';for(let y=top+5;y<G-3;y+=9)for(let xx=x+3;xx<x+w-3;xx+=8){g.beginPath();g.arc(xx+((y/9|0)%2)*3,y,2.2,0,TAU);g.fill();}}
  g.restore();}
function ship(g,x,G,dir=1,col=C.ink){g.save();g.translate(x,G);g.scale(dir,1);g.fillStyle=col;
  g.beginPath();g.moveTo(-36,-10);g.lineTo(34,-10);g.lineTo(24,4);g.lineTo(-30,4);g.closePath();g.fill();
  g.fillRect(-20,-24,26,14);g.fillStyle=C.echo;g.fillRect(-2,-34,8,12);g.restore();}
function train(g,x,G,dir=1){g.save();g.translate(x,G);g.scale(dir,1);g.fillStyle=C.blue;
  g.beginPath();g.moveTo(-46,-4);g.lineTo(-46,-30);g.lineTo(26,-30);g.quadraticCurveTo(42,-28,44,-4);g.closePath();g.fill();
  g.fillStyle=C.panel;for(let k=0;k<3;k++)g.fillRect(-40+k*18,-25,12,9);g.fillRect(28,-25,9,9);
  g.fillStyle=C.ink;[-34,-12,14,32].forEach(cx=>{g.beginPath();g.arc(cx,-2,4,0,TAU);g.fill();});g.restore();}
function dolphin(g,x,y,dir=1){g.save();g.translate(x,y);g.scale(dir,1);g.fillStyle='#5f7f99';
  g.beginPath();g.moveTo(34,2);g.quadraticCurveTo(24,-14,-6,-12);g.quadraticCurveTo(-28,-10,-38,-2);g.lineTo(-48,-12);g.lineTo(-44,2);g.lineTo(-50,12);g.lineTo(-38,4);
  g.quadraticCurveTo(-8,14,22,6);g.lineTo(40,4);g.closePath();g.fill();
  g.beginPath();g.moveTo(-4,-12);g.lineTo(-14,-24);g.lineTo(-16,-11);g.fill();
  g.fillStyle='#fff';g.beginPath();g.arc(20,-3,1.8,0,TAU);g.fill();g.restore();}
function heli(g,x,y){g.save();g.translate(x,y);g.fillStyle=C.ink;g.beginPath();g.ellipse(0,0,22,11,0,0,TAU);g.fill();
  g.fillRect(14,-3,34,5);g.fillRect(44,-10,4,12);line(g,-30,-16,30,-16,C.ink,2.5);line(g,0,-16,0,-10,C.ink,3);
  line(g,-14,14,14,14,C.ink,2.5);g.fillStyle=C.sky;g.beginPath();g.ellipse(-9,-2,7,5,0,0,TAU);g.fill();g.restore();}
function sub(g,x,y){g.save();g.translate(x,y);g.fillStyle='#4a5a66';g.beginPath();g.ellipse(0,0,40,11,0,0,TAU);g.fill();
  g.fillRect(-8,-20,16,11);g.fillRect(-2,-27,3,8);g.beginPath();g.moveTo(-40,0);g.lineTo(-52,-9);g.lineTo(-52,9);g.fill();g.restore();}
function speaker(g,x,y){g.save();g.fillStyle=C.ink;g.fillRect(x-14,y-9,10,18);g.beginPath();g.moveTo(x-4,y-9);g.lineTo(x+10,y-18);g.lineTo(x+10,y+18);g.lineTo(x-4,y+9);g.fill();g.restore();}
// 波前：以 (cx,cy) 為中心、半徑 r 的圓，r0..r 之間畫成一圈有厚度的聲波
function ring(g,cx,cy,r,col,a,w=3){if(r<=0||a<=.01)return;g.save();g.globalAlpha=a;g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.arc(cx,cy,r,0,TAU);g.stroke();
  g.globalAlpha=a*.22;g.lineWidth=w*3.2;g.beginPath();g.arc(cx,cy,Math.max(.1,r-w*1.6),0,TAU);g.stroke();g.restore();}
function dimLine(g,x1,x2,y,lab,col=C.ink,size=13){if(Math.abs(x2-x1)<4)return;line(g,x1,y,x2,y,col,1.4);line(g,x1,y-6,x1,y+6,col,1.4);line(g,x2,y-6,x2,y+6,col,1.4);
  head(g,x1,y,Math.PI,col,8);head(g,x2,y,0,col,8);text(g,lab,(x1+x2)/2,y-6,{col,size,bold:true,align:'center',bg:C.panel});}
function dot(g,x,y,col,r=6){g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.strokeStyle=C.panel;g.lineWidth=2;g.stroke();}

// ================= 版面與座標 =================
let W1=600,H1=300,WX=600,HX=220,WE=400,HE=110;
function sizeEcho(){const m=E.mode;const r=m==='depth'?.5:m==='law'?.56:m==='map'?.46:.42;
  ({W:W1,H:H1}=fit($('cvA'),r,250,m==='depth'?520:460));
  if(!$('cvXw').hidden)({W:WX,H:HX}=fit($('cvX'),m==='depth'?.12:m==='map'?.26:.34,m==='depth'?100:170,m==='depth'?130:320));
  if(!$('cvEw').hidden)({W:WE,H:HE}=fit($('cvE'),.24,96,120));}
function xmap(W,x0,x1){const L=54,R=W-40;const s=(R-L)/(x1-x0);return {s,L,R,X:x=>L+(x-x0)*s,inv:px=>x0+(px-L)/s};}
function rangeABC(M){if(E.mode==='wall'){const d=M.d;return [-d*.16,d*1.06];}
  if(E.mode==='cliff'){return [-M.L*.05,M.L*1.05];}
  const lo=Math.min(0,M.sg<0?-M.u*(M.te+M.re):0);return [lo-M.D*.12,M.D*1.06];}
