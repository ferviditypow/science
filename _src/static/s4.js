
// =====================================================================
// 4 電量計算
// =====================================================================
const E0=1.6e-19;const CN={Iu:'A',Tu:'min',v:2.5};let WN=600,HN=160;
const parseNum=s=>{s=String(s).trim().replace(/\s/g,'').replace(/[×xX]10\^?/,'e').replace('−','-').replace('⁻','-');const v=Number(s);return isFinite(v)?v:NaN;};
const sup=n=>String(n).replace(/-/g,'⁻').replace(/[0-9]/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
function sci(v,dp=3){if(v===0)return '0';const a=Math.abs(v);if(a>=.01&&a<1e5)return nf(v,dp);const e=Math.floor(Math.log10(a));let m=v/10**e;m=Math.round(m*10**dp)/10**dp;if(Math.abs(m)>=10){m/=10;}return `${m}×10${sup(e)}`;}
function cnFrom(which){const q=parseNum($('cnQ').value),n=parseNum($('cnN').value),e=parseNum($('cnE').value);
  let Q;if(which==='Q')Q=q;else if(which==='N')Q=n*E0;else Q=e*E0;if(!isFinite(Q))return;
  const N=Q/E0;const fi=v=>{const a=Math.abs(v);return a!==0&&(a>=1e6||a<1e-3)?Number(v.toPrecision(4)).toExponential().replace('e+','e'):String(Number(v.toPrecision(4)));};if(which!=='Q')$('cnQ').value=fi(Q);if(which!=='N')$('cnN').value=fi(N);if(which!=='E')$('cnE').value=fi(N);
  $('cnF1').innerHTML=`電子數 ＝ 電量 ÷ 1.6×10⁻¹⁹ ＝ ${sci(Q)} ÷ (1.6×10⁻¹⁹) ＝ ${sci(N)} 個<br>1 庫侖 ＝ 6.25×10¹⁸ 個電子的電量`;
  const isInt=Math.abs(N-Math.round(N))<1e-6*Math.max(1,Math.abs(N))||Math.abs(N)>1e6;
  checks($('cnC1'),[[isInt?'ok':'no',isInt?'是基本電荷 e 的整數倍：可能存在。':`${nf(N,3)} 不是整數：這個電量不可能存在。`],['info','一個電子 −1.6×10⁻¹⁹ C，一個質子 ＋1.6×10⁻¹⁹ C；Ca²⁺ 是 ＋2e ＝ ＋3.2×10⁻¹⁹ C。']]);}
['Q','N','E'].forEach(k=>$('cn'+k).addEventListener('input',()=>cnFrom(k)));
function cnIt(){const I=parseNum($('cnI').value)*(CN.Iu==='mA'?1e-3:1),t=parseNum($('cnT').value)*(CN.Tu==='min'?60:CN.Tu==='h'?3600:1);segSet($('cnIu'),CN.Iu);segSet($('cnTu'),CN.Tu);if(!isFinite(I)||!isFinite(t))return;
  const Q=I*t,N=Q/E0;$('cnF2').innerHTML=`Q ＝ I × t ＝ ${nf(I,4)} A × ${nf(t,2)} s ＝ ${sci(Q)} 庫侖<br>通過的電子數 ＝ ${sci(Q)} ÷ (1.6×10⁻¹⁹) ＝ ${sci(N)} 個<br>換成毫安時：${nf(Q/3.6,3)} mAh（1 mAh ＝ 0.001 A × 3600 s ＝ 3.6 C）`;
  checks($('cnC2'),[['info','1 安培 ＝ 每秒通過 1 庫侖 ＝ 每秒 6.25×10¹⁸ 個電子。'],['info','行動電源標示的 mAh 是「電量」：例如 5000 mAh ＝ 5 A × 1 h ＝ 18000 C。']]);}
['cnI','cnT'].forEach(id=>$(id).addEventListener('input',cnIt));segOn($('cnIu'),v=>{CN.Iu=v;cnIt();});segOn($('cnTu'),v=>{CN.Tu=v;cnIt();});
const TRY=[['3.2×10⁻¹⁹ C',2],['4.0×10⁻¹⁹ C',2.5],['2.4×10⁻¹⁹ C',1.5],['8.0×10⁻¹⁹ C',5],['−2.5e',2.5],['1.6×10⁻¹⁸ C',10],['Ca²⁺',2],['PO₄³⁻',3]];
{const b=$('cnTry');TRY.forEach(([n,v])=>{const x=document.createElement('button');x.className='chip';x.textContent=n;x.addEventListener('click',()=>{CN.v=v;CN.lab=n;kick();});b.appendChild(x);});}
function drawNum(g,W,H){g.fillStyle=C.panel;g.fillRect(0,0,W,H);const L=30,R=W-30,y=H*.55,X=v=>L+v/12*(R-L);line(g,L,y,R,y,C.ink,2);
  for(let k=0;k<=12;k++){line(g,X(k),y-10,X(k),y+10,C.ink,2);text(g,k+'e',X(k),y+26,{size:11,align:'center',col:C.muted});}
  const v=CN.v,ok=Math.abs(v-Math.round(v))<.02;const x=X(v);line(g,x,y-34,x,y,ok?C.green:'#c0453b',2);handle(g,x,y-34,9);
  text(g,`${CN.lab?CN.lab+' ＝ ':''}${nf(v,2)} e　${ok?'✓ 整數倍，可能存在':'✕ 不是整數倍，不可能'}`,clamp(x,120,W-120),y-48,{size:13,bold:true,col:ok?C.green:'#c0453b',align:'center',bg:C.panel});}
dragger($('cvCn'),()=>{const L=30,R=WN-30,y=HN*.55,X=v=>L+v/12*(R-L);return [{x:X(CN.v),y:y-34,r:24,move:x=>{CN.v=clamp(Math.round((x-L)/(R-L)*12*20)/20,0,12);CN.lab='';}}];},()=>kick());
$('cvCn').style.touchAction='none';
SIZE.count=()=>{({W:WN,H:HN}=fit($('cvCn'),.16,130,170));};
UI.count=()=>{cnFrom('Q');cnIt();};
DRAW.count=()=>{drawNum($('cvCn').getContext('2d'),WN,HN);};
