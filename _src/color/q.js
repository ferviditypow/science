
// ================= 題目情境 =================
const gDs=(p)=>{if(p.mode==='prism'&&p.sy===undefined)p.sy=.3;Object.assign(DS,p);UI.disp();SIZE.disp();kick();};
const gMx=(p)=>{Object.assign(MX,p);UI.mix();SIZE.mix();kick();};
const gOb=(p)=>{Object.assign(OB,p);UI.obj();SIZE.obj();kick();};
const gFt=(p)=>{Object.assign(FT,p);UI.filt();SIZE.filt();kick();};
const QS=[{g:'翰林講義 4-5 光與顏色',items:[
  {n:'隨堂1　色散的主要原因',pg:'p.157',b:'disp',set:()=>gDs({mode:'prism',src:'white',p2:false}),t:'p.157 隨堂1　答案：各色光在玻璃中的速率不同',
   p:'各色光在真空中一樣快，在玻璃中速率不同，偏折程度不同而分開。紅光最快、偏折最小；紫光最慢、偏折最大。'},
  {n:'隨堂2　色散敘述何者錯誤',pg:'p.157',b:'disp',set:()=>gDs({mode:'prism',src:'white',p2:false}),t:'p.157 隨堂2　答案 (B)',
   p:'紅光在三稜鏡中傳播速率最快，但波長是「最長」，不是最短。'},
  {n:'隨堂3　白光和雷射光的比較',pg:'p.157',b:'disp',set:()=>gDs({mode:'prism',src:'red',p2:false}),t:'p.157 隨堂3　答案 (C) 在真空中速率相等',
   p:'雷射光（單色光）經過三稜鏡只偏折、不色散；白光會色散。兩者都會折射、反射；在真空中一樣快。'},
  {n:'隨堂4　紅綠藍光照在白紙上',pg:'p.157',b:'mix',set:()=>gMx({mode:'spot',on:[1,1,1]}),t:'p.157 隨堂4　三原色光的混合',
   p:'三色交會處是白色；紅＋綠＝黃；綠＋藍＝青；紅＋藍＝洋紅。拖曳白色十字到各區域檢查選項。'},
  {n:'探討活動 4-4　色紙在各色光下的顏色',pg:'p.158',b:'obj',set:()=>gOb({mode:'cards',light:'R',sel:'R'}),t:'p.158 探討活動：光被選擇性的吸收與反射',
   p:'紅紙在白光、紅光下呈紅色，在綠光、藍光下呈黑色：紅紙只反射紅光，吸收其他色光。下方表格和講義的表一樣，換燈光逐列對照。'},
  {n:'隨堂1　物體吸收或反射光的敘述',pg:'p.159',b:'obj',set:()=>gOb({mode:'cards',light:'W',sel:'G'}),t:'p.159 隨堂1　答案 (B)',
   p:'綠色的葉子是「反射」綠光，吸收其他色光，所以看起來是綠色。'},
  {n:'隨堂2　透過藍色玻璃紙看日光燈',pg:'p.159',b:'filt',set:()=>gFt({mode:'filter',light:'W',f1:'B',f2:'none'}),t:'p.159 隨堂2　答案 (C) 透射藍光',
   p:'藍色玻璃紙只讓藍光通過，吸收紅光和綠光。'},
  {n:'隨堂3　紅色、綠色眼鏡看 dog',pg:'p.159',b:'filt',set:()=>gFt({mode:'glasses',lens:'R',card:'dog'}),t:'p.159 隨堂3　字的顏色和鏡片同色就看不見',
   p:'戴紅色鏡片看得到「dog」，戴綠色鏡片只看到「do」：g 透過綠色鏡片和白紙一樣，代表 g 是綠色（或能反射綠光的顏色）；透過紅色鏡片時 g 變黑，所以看得到。\n切換鏡片比較。'},
  {n:'第1、2題　三稜鏡色散',pg:'p.159',b:'disp',set:()=>gDs({mode:'prism',src:'white',p2:false}),t:'p.159 第1題 (C) 光的色散；第2題 (D)',
   p:'紫光偏向角最大、折射角最小；紅光偏向角最小。所以「紫光折射角最大」是錯的。'},
  {n:'第3～6題　三原色光',pg:'p.160',b:'mix',set:()=>gMx({mode:'pixel',px:[255,255,0]}),t:'p.160 第3題 紅綠藍；第4題 3 種；第5題 (A) 黃；第6題 (D)',
   p:'電視、電腦螢幕用紅、綠、藍三種色光混合出所有顏色。紅光＋綠光＝黃光，所以黃光不是原色光；紅光無法由其他色光混合出來。'},
  {n:'第7題　白色物體與黑色物體',pg:'p.160',b:'obj',set:()=>gOb({mode:'cards',light:'W',sel:'W'}),t:'p.160 第7題　答案 (B)',p:'白色物體反射各色光，黑色物體吸收各色光。'},
  {n:'第8題　紅綠藍光照黃色紙',pg:'p.160',b:'obj',set:()=>gOb({mode:'cards',light:'W',sel:'Y'}),t:'p.160 第8題　答案 (D) 黃色',p:'紅＋綠＋藍＝白光，黃紙在白光下就是黃色（反射紅、綠，吸收藍）。'},
  {n:'第9題　甲乙丙在紅光、綠光下',pg:'p.160',b:'obj',set:()=>gOb({mode:'cards',light:'R',sel:'W'}),t:'p.160 第9題　答案 (B) 白、紅、藍',
   p:'紅光下：甲紅、乙紅、丙黑；綠光下：甲綠、乙黑、丙黑。\n甲兩種光都反射 → 白；乙只反射紅 → 紅；丙兩種都不反射，題目說有一張是藍色 → 丙藍。\n切換紅光、綠光，看哪些色紙符合。'},
  {n:'第10題　紅綠藍玻璃紙疊在一起',pg:'p.160',b:'filt',set:()=>gFt({mode:'filter',light:'W',f1:'R',f2:'G'}),t:'p.160 第10題　答案：黑色',
   p:'紅色玻璃紙只讓紅光過，綠色玻璃紙又把紅光吸收——已經沒有光可以通過，再加藍色也一樣。白紙看起來是黑的。'},
  {n:'第2、3題　綠色、藍色玻璃溫室',pg:'p.161',b:'filt',set:()=>gFt({mode:'house',glass:'G'}),t:'p.161 第2題 (D) 黑色；第3題 全部皆黑',
   p:'綠色玻璃只讓綠光進來：紅花沒有紅光可以反射，看起來黑色；葉子是綠色。\n藍色玻璃：紅花、綠葉都沒有能反射的光，全部看起來黑色。'},
  {n:'第4、5題　紅光派對的命案',pg:'p.161',b:'obj',set:()=>gOb({mode:'outfit',light:'R',top:'B',bot:'K'}),t:'p.161 第4題 (A) 1 人；第5題 (C) 3 人',
   p:'第4題：燈熄後看不見（甲錯）；紅光下看到「黑衣」可能（乙對）；紅光下不會看到藍色或黃色衣服（丙、丁錯）。\n第5題：兇手在紅光下看起來是黑衣——藍色、綠色（郵差）、黑色衣服的人都可能，紅色、白色不可能 → 3 人。\n換上衣顏色試試看哪些在紅光下會變黑。'},
  {n:'第2題　四種光照紅色玻璃',pg:'p.162',b:'filt',set:()=>gFt({mode:'filter',light:'W',f1:'R',f2:'none'}),t:'p.162 第2題　紅色玻璃只讓紅光通過',p:'白光、紅光照紅色玻璃 → 紅光通過；綠光、藍光照 → 沒有光通過。切換光源比較。'},
  {n:'第4題　黑色部分 10 cm² 用什麼光',pg:'p.162',b:'obj',set:()=>gOb({mode:'pic',pic:'blocks',light:'R'}),t:'p.162 第4題　答案 (A) 紅光',
   p:'藍 8、紅 2、綠 2、白 2 cm²。紅光照射：藍、綠變黑 → 8 ＋ 2 ＝ 10 cm²。換成藍光、綠光比較。'},
  {n:'第5題　只反射紅光的圖卡改照藍光',pg:'p.162',b:'obj',set:()=>gOb({mode:'cards',light:'B',sel:'R'}),t:'p.162 第5題　答案 (B) 吸收藍光',p:'紅色圖卡只反射紅光；照藍光時藍光被吸收，看起來黑色。'},
  {n:'自我評量第12題　阿秀的舞會服裝',pg:'p.164',b:'obj',set:()=>gOb({mode:'outfit',light:'R',top:'W',bot:'R'}),t:'p.164 第12題　答案 (B) 白衣紅裙',
   p:'紅光下紅衣紅裙、藍光下藍衣黑裙：上衣能反射紅光也能反射藍光 → 白（選項中）；裙子只反射紅光 → 紅。\n切換紅光、藍光確認。'},
  {n:'自我評量第13題　藍光照四色卡',pg:'p.165',b:'obj',set:()=>gOb({mode:'pic',pic:'face',light:'B'}),t:'p.165 第13題　答案 (C)',
   p:'藍光照射：藍色的頭仍是藍；黑眼珠黑；白色臉頰反射藍光 → 藍；紅色嘴巴沒有紅光可反射 → 黑。'}]},
 {g:'考古題（大業、向上 八年級）',items:[
  {n:'白光與綠光射入三稜鏡',pg:'向上 113-1-2 #35',b:'disp',set:()=>gDs({mode:'prism',src:'green',p2:false}),t:'向上 113-1-2 #35　白光色散、綠光不色散',p:'白光是複色光，會分出七色；綠光是單色光，只偏折。切換光源比較。'},
  {n:'三稜鏡色散的敘述',pg:'向上 114-1-2 #10',b:'disp',set:()=>gDs({mode:'prism',src:'red',p2:false}),t:'向上 114-1-2 #10　答案 (D)',
   p:'改用紅色雷射光，只會出現在「紅光」的位置（甲），不是紫光的位置（丙）。在三稜鏡中紅光比紫光快，真空中一樣快。'},
  {n:'彩虹何時、往哪裡看',pg:'向上 113-1-2 #43',b:'disp',set:()=>gDs({mode:'rain',h:16,face:'E'}),t:'向上 113-1-2 #43　答案 (C) 下午 4 點面向東方',
   p:'彩虹在太陽的對面，太陽仰角要低。下午 4 點太陽在西方、仰角低，面向東方天空看得到彩虹。中午太陽太高看不到。'},
  {n:'紅燈、藍燈照物體的彩色影子',pg:'向上 113-1-2 #25',b:'mix',set:()=>gMx({mode:'shadow',sh:'RB'}),t:'向上 113-1-2 #25　彩色的影子',
   p:'擋住紅燈的影子只剩藍光 → 藍；擋住藍燈的影子只剩紅光 → 紅；兩盞都擋住 → 黑；都照到 → 洋紅。對照考卷的燈與影子位置判斷甲乙丙。'},
  {n:'檢驗抗藍光鏡片',pg:'向上 113-1-2 #26',b:'filt',set:()=>gFt({mode:'filter',light:'W',f1:'Y',f2:'none'}),t:'向上 113-1-2 #26　擋藍光 ＝ 屏幕少了藍光',
   p:'白光經過有效的抗藍光鏡片，藍光被吸收，剩紅＋綠 → 屏幕呈黃色。也可以只用藍光照射：鏡片有效時屏幕幾乎不亮。'},
  {n:'紅光下三顆小球紅、紅、黑',pg:'向上 114-1-2 #26',b:'obj',set:()=>gOb({mode:'cards',light:'R',sel:'W'}),t:'向上 114-1-2 #26　答案 (C) 最多有兩顆白球',
   p:'紅光下看起來紅色的：紅、白、黃、洋紅都可能——不一定有紅球，最多兩顆白球。\n看起來黑色的：綠、藍、青、黑都可能——不一定有黑球，綠球最多一顆。'},
  {n:'溫室植物要照什麼光、藍玻璃看到什麼',pg:'向上 114-1-2 #35～36',b:'filt',set:()=>gFt({mode:'house',glass:'M'}),t:'向上 114-1-2 #35 (A) 洋紅光；#36 (C) 全部皆黑',
   p:'#35：葉子反射綠光、主要吸收紅光和藍光：洋紅光（紅＋藍）最好。\n#36：藍色玻璃只讓藍光進來，紅花綠葉都看起來黑色。切換玻璃顏色比較生長。'},
  {n:'戴綠色蛙鏡看白 T 恤圖案',pg:'大業 113-1-2 #33',b:'filt',set:()=>gFt({mode:'glasses',lens:'G',card:'shirt'}),t:'大業 113-1-2 #33　綠色鏡片：白變綠，其他顏色多半變黑',
   p:'只有綠光能穿過鏡片：白色部分看起來綠色；藍色、紅色部分沒有綠光反射 → 黑色；黃色（反射紅、綠）→ 綠色。'},
  {n:'紅光密室裡的場景',pg:'大業 114-1-2 #29',b:'obj',set:()=>gOb({mode:'cards',light:'R',sel:'K'}),t:'大業 114-1-2 #29　答案 (C) 乙丁',
   p:'紅光下：綠色仙人掌看起來黑（甲錯）；紅蘋果看起來紅（乙對）；藍色大衣看起來黑，不會看出藍色（丙錯）；黑色氣球可能是綠、藍、青、黑，無法確定（丁對）。'},
  {n:'紅光密室裡的圖卡',pg:'大業 114-1-2 #30',b:'obj',set:()=>gOb({mode:'cards',light:'R',sel:'W'}),t:'大業 114-1-2 #30　答案 (B)',
   p:'紅光下看起來黑、紅、紅：黑色處可能是藍、綠、黑；紅色處可能是紅、白、黃、洋紅。\n逐一檢查選項：只有 (B) 藍、白、紅 在紅光下變成 黑、紅、紅。'},
  {n:'螢幕的 RGB 三原色',pg:'大業 114-1-2 #33～35',b:'mix',set:()=>gMx({mode:'pixel',px:[255,200,120]}),t:'大業 114-1-2 #33～35　RGB 三種光的亮度比例',
   p:'每個畫素有紅、綠、藍三個 LED，調整亮度比例就能混出各種顏色；全亮白、全暗黑。\n紅綠亮、藍暗 → 偏黃（夜間模式）。'}]}];
{const box=$('qbox');QS.forEach(gr=>{const d=document.createElement('div');d.className='qgrp';d.innerHTML=`<h4>${gr.g}</h4>`;const c=document.createElement('div');c.className='qchips';
  gr.items.forEach(it=>{const b=document.createElement('button');b.className='qchip';b.innerHTML=`${it.n}<span class="pg">${it.pg}</span>`;
    b.addEventListener('click',()=>{setBench(it.b);it.set();showStory(it.t,it.p);$('story').scrollIntoView({behavior:'smooth',block:'start'});});c.appendChild(b);});
  d.appendChild(c);box.appendChild(d);});}
let lastWW=0;new ResizeObserver(()=>{const w=document.querySelector('.wrap').clientWidth;if(w===lastWW)return;lastWW=w;SIZE[bench]();kick();}).observe(document.querySelector('.wrap'));
setBench((location.hash||'#disp').slice(1),true);
window.addEventListener('hashchange',()=>setBench(location.hash.slice(1),true));
