
// =====================================================================
// 3 庫侖定律
// =====================================================================
const CL={sel:1,n:2,q:[1,1,-1],x:[-1,1,3],each:true,ref:null,msg:''};let WC=600,HC=300;const CN3=['A','B','C'];
function clMap(W){const L=40,R=W-40,u=(R-L)/12;return {X:x=>L+(x+6)*u,inv:p=>(p-L)/u-6,u};}
function forces(){const n=CL.n,F=[];for(let i=0;i<n;i++){F[i]={net:0,parts:[]};for(let j=0;j<n;j++){if(i===j)continue;const d=CL.x[i]-CL.x[j];const mag=CL.q[i]*CL.q[j]/(d*d);const f=mag*Math.sign(d);// 同號（mag>0）沿遠離方向
      F[i].parts.push({j,f});F[i].net+=f;}}return F;}
const fmtF=f=>{const a=Math.abs(f);if(a<1e-9)return '0';const r=Math.round(a*1000)/1000;const fr=[[1/2,'½'],[1/4,'¼'],[3/4,'¾'],[1/9,'1/9'],[1/16,'1/16'],[1/3,'⅓'],[4/9,'4/9']].find(([v])=>Math.abs(a-v)<1e-6);return (fr?fr[1]:nf(r,3))+' F';};
function drawCoul(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const M=clMap(W),y=H*.55;
  for(let k=-6;k<=6;k++){line(g,M.X(k),y-H*.32,M.X(k),y+H*.3,C.grid,1);text(g,k===0?'0':String(k),M.X(k),H-8,{size:10,col:C.muted,align:'center'});}text(g,'單位：r',W-8,H-8,{size:10,col:C.muted,align:'right'});
  line(g,M.X(-6),y,M.X(6),y,C.line,1.5);const F=forces();const sc=f=>Math.sign(f)*Math.min(M.u*3.2,Math.sqrt(Math.abs(f))*M.u*1.1);
  for(let i=0;i<CL.n;i++){const x=M.X(CL.x[i]);const q=CL.q[i];
    if(CL.each&&i===CL.sel)F[i].parts.forEach((p,k)=>{if(Math.abs(p.f)<1e-9)return;const yy=y-54-k*18;arrow(g,x,yy,x+sc(p.f),yy,C.muted,2);text(g,(CN3[p.j])+'給'+CN3[i]+' '+fmtF(p.f),x+sc(p.f)+(p.f>0?6:-6),yy+4,{size:11,col:C.muted,align:p.f>0?'left':'right'});});
    if(Math.abs(F[i].net)>1e-9){arrow(g,x,y+34,x+sc(F[i].net),y+34,C.accent,4);text(g,'合力 '+fmtF(F[i].net),x+sc(F[i].net)/2,y+56,{size:12,bold:true,col:C.accent,align:'center',bg:C.panel});}
    else if(CL.n===3)text(g,'合力 0',x,y+40,{size:12,bold:true,col:C.accent,align:'center'});
    const col=q>0?CC.pos:q<0?CC.neg:C.muted;g.fillStyle=col;g.beginPath();g.arc(x,y,16,0,TAU);g.fill();sym2(g,x,y,q);
    text(g,CN3[i]+'　'+(q>0?'＋':q<0?'−':'')+Math.abs(q)+'q',x,y-24,{size:13,bold:true,align:'center',col});if(i===CL.sel&&CL.each){g.strokeStyle=C.accent;g.lineWidth=2;g.setLineDash([3,3]);g.beginPath();g.arc(x,y,21,0,TAU);g.stroke();g.setLineDash([]);}}
  for(let i=0;i<CL.n;i++)handle(g,M.X(CL.x[i]),y+16+0,6);}
function sym2(g,x,y,q){g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.moveTo(x-7,y);g.lineTo(x+7,y);if(q>0){g.moveTo(x,y-7);g.lineTo(x,y+7);}g.stroke();}
function clUI(){segSet($('clN'),String(CL.n));$('clQCw').hidden=CL.n<3;['A','B','C'].forEach((k,i)=>{$('clQ'+k).value=CL.q[i];$('clQ'+k+'o').textContent=(CL.q[i]>0?'＋':'')+CL.q[i]+'q';});$('clEach').checked=CL.each;
  howList('clHow',['庫侖定律：F ＝ k × Q × q ÷ R²。力和兩電量的乘積成正比，和距離的平方成反比。','距離變成 2 倍，力變成 ¼；距離變成一半，力變成 4 倍。','同性電互相排斥、異性電互相吸引；兩電荷受的力大小相等、方向相反（作用力與反作用力）。','三個電荷：每一個電荷受到另外兩個的力，合起來就是合力（同方向相加、反方向相減）。','兩顆相同的金屬球接觸後分開：電量先合起來再平分。']);}
segOn($('clN'),v=>{CL.n=+v;if(CL.n===3&&Math.abs(CL.x[2]-CL.x[1])<.5)CL.x[2]=CL.x[1]+2;hideStory();clUI();kick();});
['A','B','C'].forEach((k,i)=>$('clQ'+k).addEventListener('input',()=>{CL.q[i]=+$('clQ'+k).value;CL.msg='';clUI();kick();}));
$('clEach').addEventListener('change',()=>{CL.each=$('clEach').checked;kick();});
$('clTouch').addEventListener('click',()=>{const a=CL.q[0],b=CL.q[1],f0=a*b/((CL.x[0]-CL.x[1])**2);const m=(a+b)/2;CL.q[0]=CL.q[1]=m;const f1=m*m/((CL.x[0]-CL.x[1])**2);
  CL.msg=`接觸前 A ${a>0?'＋':''}${a}q、B ${b>0?'＋':''}${b}q；接觸後各 ${m>0?'＋':''}${m}q。<br>距離不變時，力由 ${fmtF(Math.abs(f0))}${f0<0?'（吸引）':'（排斥）'} 變成 ${fmtF(Math.abs(f1))}${f1<0?'（吸引）':f1>0?'（排斥）':''}`;clUI();kick();});
dragger($('cvCl'),()=>{const M=clMap(WC),y=HC*.55;const hs=[];for(let i=0;i<CL.n;i++)hs.push({x:M.X(CL.x[i]),y,r:24,start:()=>{CL.sel=i;},move:x=>{CL.sel=i;let v=Math.round(M.inv(x)*2)/2;v=clamp(v,-6,6);for(let j=0;j<CL.n;j++)if(j!==i&&Math.abs(v-CL.x[j])<.5)return;CL.x[i]=v;CL.msg='';}});return hs;},()=>kick());
$('cvCl').style.touchAction='none';
function clResults(){const F=forces(),d=Math.abs(CL.x[0]-CL.x[1]),f=CL.q[0]*CL.q[1]/(d*d);
  const big=CL.n===2?`A、B 相距 ${d}r：${f>0?'排斥力':f<0?'吸引力':'沒有力'} ${fmtF(Math.abs(f))}`:`合力：A ${fmtF(F[0].net)}、B ${fmtF(F[1].net)}、C ${fmtF(F[2].net)}`;
  let fx=`F ＝ k·Q·q ÷ R²　→　A、B：${Math.abs(CL.q[0])}×${Math.abs(CL.q[1])} ÷ ${d}² ＝ ${fmtF(Math.abs(f))}`;if(CL.n===3){const d2=Math.abs(CL.x[1]-CL.x[2]),d3=Math.abs(CL.x[0]-CL.x[2]);fx+=`<br>B、C：${Math.abs(CL.q[1])}×${Math.abs(CL.q[2])} ÷ ${d2}² ＝ ${fmtF(CL.q[1]*CL.q[2]/(d2*d2))}　A、C：${Math.abs(CL.q[0])}×${Math.abs(CL.q[2])} ÷ ${d3}² ＝ ${fmtF(CL.q[0]*CL.q[2]/(d3*d3))}`;}
  if(CL.msg)fx+='<br>'+CL.msg;fx+='<br>（F：兩個 1q 相距 1r 時的力）';
  $('clBig').textContent=big;$('clF').innerHTML=fx;checks($('clC'),[['info','合力方向：向右的箭頭為正、向左為負。'],['info','兩電荷之間的力，大小相等、方向相反。']]);}
SIZE.coul=()=>{({W:WC,H:HC}=fit($('cvCl'),.36,260,380));};
UI.coul=()=>{clUI();};
DRAW.coul=()=>{drawCoul($('cvCl').getContext('2d'),WC,HC);clResults();};
