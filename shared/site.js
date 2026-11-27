// 自然科模擬動畫：全站共用小工具（在 <head> 的 ui.css 後面載入 <script src="../shared/site.js"></script>）
// 1. 手機（寬度 ≤ 600px）時，頁首的說明文字只顯示兩行，點「展開說明」才看全文。
// 2. 單元導覽列：<script src="../shared/site.js" data-nav="waves"></script> 會在頁首下方加「波動」導覽列。
//    （光學頁用 shared/optics.js，另有國中／高中切換。）
(function () {
  const me = document.currentScript;
  const GROUPS = {
    waves: {
      label: '波動',
      pages: [
        ['wavetype', '橫波與縱波', '國二'],
        ['wave', '水波側視', '國二'],
        ['ripple', '漣漪', '國二'],
        ['wave3d', '3D 水波剖面', '國二'],
        ['wavetank', '水波槽實驗', '高一'],
        ['sound', '聲音', '國二'],
        ['doppler', '都卜勒效應', '延伸'],
        ['interference', '繞射與干涉', '高一'],
      ],
    },
  };
  const embedded = window.top !== window;

  const css = `
@media (max-width:600px){
  header>p.sitefold{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  header>p.sitefold.open{display:block}
}
header .foldbtn{display:none}
@media (max-width:600px){header .foldbtn{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--muted);font-size:.85rem;cursor:pointer;margin-top:2px}}
.grpnav{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;padding:8px 10px}
.grpnav .units{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.grpnav a.u{display:inline-flex;align-items:baseline;gap:5px;min-height:36px;padding:6px 12px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--ink);text-decoration:none;font-weight:500;font-size:.92rem;line-height:1.3}
.grpnav a.u:hover,.grpnav a.u:focus-visible{border-color:var(--accent)}
.grpnav a.u .no{font-family:var(--f-mono,monospace);color:var(--muted);font-size:.8rem}
.grpnav a.u small{color:var(--muted);font-size:.72rem}
.grpnav a.u[aria-current="page"]{background:var(--ink);border-color:var(--ink);color:var(--panel)}
.grpnav a.u[aria-current="page"] .no,.grpnav a.u[aria-current="page"] small{color:inherit;opacity:.75}
@media (max-width:700px){.grpnav{gap:6px 10px}.grpnav>.tlabel{display:none}.grpnav .units{flex-wrap:nowrap;overflow-x:auto;max-width:100%;padding-bottom:4px;scrollbar-width:thin}.grpnav a.u{white-space:nowrap;min-height:34px;padding:5px 11px}}

  /* ---- 手寫批註與雷射筆（右側直立工具列） ---- */
  #inkCv{position:fixed;inset:0;width:100vw;height:100vh;z-index:55;pointer-events:none;touch-action:pinch-zoom;display:none}
  #inkCv.live{display:block}                      /* 沒有字也沒在寫的時候整張拿掉，不然 4K 螢幕每一幀都要合成一張全螢幕貼圖 */
  html[data-ink="1"] #inkCv{pointer-events:auto;cursor:crosshair}
  #inkGo{position:fixed;right:6px;top:50%;transform:translateY(-50%);z-index:60;width:34px;height:44px;padding:0;
    border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);font-size:16px;line-height:1;
    box-shadow:0 2px 10px rgba(0,0,0,.14);cursor:pointer;opacity:.72}
  #inkGo:hover{opacity:1}
  html[data-ink="1"] #inkGo{display:none}
  #inkBar{position:fixed;right:6px;top:50%;transform:translateY(-50%);z-index:70;display:none;
    flex-direction:column;gap:3px;align-items:center;padding:5px 4px;border-radius:14px;
    border:1px solid var(--line);background:var(--panel);box-shadow:0 6px 22px rgba(0,0,0,.2);
    max-height:94vh;overflow-y:auto}
  html[data-ink="1"] #inkBar{display:flex}
  #inkBar button{width:34px;height:31px;min-height:0;padding:0;border-radius:9px;border:1px solid var(--line);
    background:var(--panel);color:var(--ink);font:600 12px/1 var(--f-body);cursor:pointer;flex:none}
  #inkBar button[aria-pressed="true"]{background:var(--ink);color:var(--panel);border-color:var(--ink)}
  #inkBar .sw{width:24px;height:24px;border-radius:50%!important;border:1.5px solid var(--line);margin:1px 0}
  #inkBar .sw[aria-pressed="true"]{box-shadow:0 0 0 2.5px var(--panel),0 0 0 5px var(--ink);margin:4px 0}
  #inkBar .sep{width:22px;height:1px;background:var(--line);margin:2px 0;flex:none}
  #inkBar .more{display:none;flex-direction:column;gap:3px;align-items:center}
  #inkBar.open .more{display:flex}
  @media print{#inkGo,#inkBar,#inkCv{display:none!important}}
  .touchbtn{position:fixed;right:10px;bottom:10px;z-index:60;padding:8px 12px;min-height:40px;
    border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--ink);
    font-size:.84rem;font-weight:500;box-shadow:0 2px 10px rgba(0,0,0,.14);cursor:pointer;opacity:.9}
  .touchbtn[aria-pressed="true"]{background:var(--ink);color:var(--panel);border-color:var(--ink)}
  .touchbtn:hover{opacity:1}
  @media print{.touchbtn{display:none}}

  .fsbox{position:relative}
  .fsbtn{position:absolute;top:6px;right:6px;z-index:6;width:34px;height:34px;padding:0;border-radius:9px;
    border:1.5px solid var(--line);background:var(--panel);color:var(--ink);font-size:16px;line-height:1;cursor:pointer;opacity:.85}
  .fsbtn:hover,.fsbtn:focus-visible{opacity:1;border-color:var(--accent);color:var(--ink)}
  :fullscreen{overflow:auto}
  .panel:fullscreen,.cbox:fullscreen{background:var(--panel);border-radius:0;max-width:none;width:100vw;height:100vh;padding:8px 14px 14px}
  .stepbar{position:fixed;right:10px;bottom:58px;z-index:60;display:flex;gap:6px;align-items:center}
  .stepbar button{padding:8px 12px;min-height:40px;border:1px solid var(--line);border-radius:999px;
    background:var(--panel);color:var(--ink);font-size:.84rem;font-weight:500;box-shadow:0 2px 10px rgba(0,0,0,.14);cursor:pointer;opacity:.62}
  .stepbar button[aria-pressed="true"]{background:var(--ink);color:var(--panel);border-color:var(--ink)}
  .stepbar button:hover{opacity:1}
  .fszoom{transform-origin:0 0;will-change:transform}
  html[data-fsz="1"] #inkCv{will-change:transform}
  .fsz11{position:fixed;right:152px;bottom:106px;z-index:61;padding:8px 12px;min-height:40px;display:none;
    border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--ink);
    font:500 .84rem/1 var(--f-body);box-shadow:0 2px 10px rgba(0,0,0,.14);cursor:pointer}
  html[data-fsz="1"] .fsz11{display:block}
  .fsfix{position:fixed;right:10px;bottom:106px;z-index:60;padding:8px 12px;min-height:40px;
    border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--ink);
    font:500 .84rem/1 var(--f-body);box-shadow:0 2px 10px rgba(0,0,0,.14);cursor:pointer;opacity:.78}
  .fsfix:hover{opacity:1}
  @media print{.stepbar,.fsbtn,.fsfix{display:none}}
`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function fold() {
    if (embedded) return;
    const ps = [...document.querySelectorAll('header > p')].filter(p => !p.matches('.formula,.rotate-hint,.hint-inline') && p.textContent.trim().length > 40);
    ps.forEach(p => {
      if (p.classList.contains('sitefold')) return;
      p.classList.add('sitefold');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'foldbtn'; b.textContent = '展開說明 ▾';
      b.addEventListener('click', () => { const o = p.classList.toggle('open'); b.textContent = o ? '收起說明 ▴' : '展開說明 ▾'; });
      p.insertAdjacentElement('afterend', b);
      // 文字本來就不超過兩行時不顯示按鈕
      const chk = () => { if (innerWidth > 600) return; const open = p.classList.contains('open'); if (!open) b.hidden = p.scrollHeight <= p.clientHeight + 2; };
      requestAnimationFrame(chk); addEventListener('resize', chk);
    });
  }

  function nav() {
    const g = me && GROUPS[me.dataset.nav];
    if (!g || embedded || document.querySelector('.grpnav')) return;
    const segs = location.pathname.split('/').filter(Boolean);
    let cur = '';
    for (let i = segs.length - 1; i >= 0; i--) if (g.pages.some(p => p[0] === segs[i])) { cur = segs[i]; break; }
    const el = document.createElement('nav');
    el.className = 'panel grpnav';
    el.setAttribute('aria-label', g.label + '單元');
    el.innerHTML = `<span class="tlabel">${g.label}</span><span class="units">${g.pages.map((p, i) =>
      `<a class="u" href="../${p[0]}/"${p[0] === cur ? ' aria-current="page"' : ''}><span class="no">${i + 1}</span>${p[1]}<small>${p[2]}</small></a>`).join('')}</span>`;
    const h = document.querySelector('header');
    if (h) h.insertAdjacentElement('afterend', el); else document.body.insertAdjacentElement('afterbegin', el);
    requestAnimationFrame(() => { const c = el.querySelector('a.u[aria-current]'); if (c) { const u = el.querySelector('.units'); u.scrollLeft = c.offsetLeft - u.offsetLeft - 12; } });
  }

  // 觸控模式：單指拖曳畫面 ←→ 單指捲動頁面（雙指縮放整頁兩種模式都可以）
  function touchMode() {
    if (embedded || !navigator.maxTouchPoints) return;
    if (document.querySelector('.touchbtn')) return;
    const KEY = 'sci-touch';
    const set = m => { document.documentElement.dataset.touch = m;
      b.textContent = m === 'scroll' ? '↕ 單指捲動頁面' : '✋ 單指操作畫面';
      b.setAttribute('aria-pressed', String(m === 'scroll'));
      try { localStorage.setItem(KEY, m); } catch (e) {} };
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'touchbtn'; b.title = '切換：單指在畫面上拖曳，或單指捲動頁面。兩種模式都可以用兩指縮放整個頁面。';
    b.addEventListener('click', () => set(document.documentElement.dataset.touch === 'scroll' ? 'drag' : 'scroll'));
    document.body.appendChild(b);
    let m = 'drag'; try { m = localStorage.getItem(KEY) || 'drag'; } catch (e) {}
    set(m);
  }

  // 兩指縮放頁面後，重新通知各頁重畫（畫布要用新的解析度，否則放大後會糊）
  function zoomRedraw() {
    if (!window.visualViewport) return;
    let t = 0, last = visualViewport.scale;
    visualViewport.addEventListener('resize', () => {
      if (Math.abs(visualViewport.scale - last) < 0.02) return;
      last = visualViewport.scale;
      clearTimeout(t);
      t = setTimeout(() => window.dispatchEvent(new Event('resize')), 180);
    });
  }


  // ---- 全螢幕：每個畫布右上角一顆 ⛶，把整個實驗台放大到全螢幕 ----
  window.FSH = function (cv, maxH) {       // 各頁的 fit() 會呼叫：全螢幕時畫布可以變高
    cv._usesFit = true;
    const fe = document.fullscreenElement;
    if (!fe || !fe.contains(cv)) { cv._fsTop = null; return maxH; }
    if (cv._fsTop == null) cv._fsTop = cv.getBoundingClientRect().top;
    return Math.max(maxH, Math.floor(innerHeight - cv._fsTop - 14));
  };
  function fsBtns() {
    if (embedded || !document.fullscreenEnabled) return;
    const add = () => {
      document.querySelectorAll('canvas,svg').forEach(cv => {
        if (cv.id === 'inkCv' || cv.dataset.nofs || cv.closest('button,.chip,.seg')) return;   // 手寫層不是內容，不要幫它加全螢幕鈕也不要把它的父層變成 .fsbox
        const box = cv.closest('.cbox') || cv.parentElement;
        if (!box || box.querySelector(':scope > .fsbtn')) return;
        if (cv.clientWidth && cv.clientWidth < 180) return;
        const panel = cv.closest('.panel') || box;
        box.classList.add('fsbox');
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'fsbtn'; b.textContent = '⛶';
        b.title = '全螢幕（再按一次或 Esc 離開）';
        b.addEventListener('click', e => {
          e.preventDefault(); e.stopPropagation();
          if (document.fullscreenElement) document.exitFullscreen();
          else panel.requestFullscreen && panel.requestFullscreen().catch(() => {});
        });
        box.appendChild(b);
      });
    };
    add();
    let t = 0;
    addEventListener('click', () => { clearTimeout(t); t = setTimeout(add, 300); }, true);
    // 固定在右下角的一顆：對「現在畫面上最大的那張圖」所在的面板全螢幕
    const fx = document.createElement('button');
    fx.className = 'fsfix'; fx.type = 'button'; fx.textContent = '⛶ 全螢幕';
    fx.title = '把目前這個實驗台放到最大';
    document.body.appendChild(fx);
    const biggest = () => { let best = null, ba = 0;
      document.querySelectorAll('canvas,svg').forEach(el => {
        if (el.id === 'inkCv') return;
        const r = el.getBoundingClientRect();
        if (r.width < 180 || r.bottom < 0 || r.top > innerHeight) return;
        const vis = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
        const a = r.width * Math.max(0, vis); if (a > ba) { ba = a; best = el; } });
      return best && (best.closest('.panel') || best.closest('.cbox') || best); };
    fx.addEventListener('click', () => {
      if (document.fullscreenElement) { document.exitFullscreen(); return; }
      const el = biggest(); if (el && el.requestFullscreen) el.requestFullscreen(); });
    document.addEventListener('fullscreenchange', () => {
      fx.textContent = document.fullscreenElement ? '⛶ 離開全螢幕' : '⛶ 全螢幕'; });
    // ---- 全螢幕裡的雙指縮放／平移（瀏覽器在全螢幕時會鎖住原生 pinch-zoom，只能自己來）----
    const Z = { s: 1, tx: 0, ty: 0, wrap: null, pts: new Map(), d0: 0, s0: 1, mx: 0, my: 0, tx0: 0, ty0: 0 };
    window.__fsZoom = Z;                                   // 手寫層要用同一組變換才會對齊
    const SKIP = '.stepbar,.touchbtn,.fsfix,.fsz11,#inkCv,#inkGo,#inkBar';
    Z.ix = 0; Z.iy = 0; Z.is = 1;                          // 墨水層上一次「真的重畫」時的變換
    let zq = 0;
    function zApply(now) {                                 // now=true：立刻套用（手勢結束、重設）
      if (!Z.wrap) return;
      if (!now) { if (zq) return; zq = (window.__rafRaw || requestAnimationFrame)(() => { zq = 0; zApply(true); }); return; }
      const one = Z.s === 1 && !Z.tx && !Z.ty;
      Z.wrap.style.transform = one ? '' : `translate(${Z.tx}px,${Z.ty}px) scale(${Z.s})`;
      const fe = document.fullscreenElement, ov = one ? '' : 'hidden';
      if (fe && fe.style.overflow !== ov) fe.style.overflow = ov;
      const fz = one ? '' : '1';
      if (document.documentElement.dataset.fsz !== fz) document.documentElement.dataset.fsz = fz;
      const ink = document.getElementById('inkCv');
      if (Z.live) {                                        // 手勢進行中：墨水層只套 CSS 變換，不重畫
        if (ink) { const k = Z.s / Z.is;
          ink.style.transform = `translate(${Z.tx - k * Z.ix}px,${Z.ty - k * Z.iy}px) scale(${k})`;
          ink.style.transformOrigin = '0 0'; }
      } else {
        if (ink) ink.style.transform = '';
        Z.ix = Z.tx; Z.iy = Z.ty; Z.is = Z.s;
        if (window.__inkRedraw) window.__inkRedraw();
      }
    }
    function zReset() { Z.s = 1; Z.tx = 0; Z.ty = 0; Z.live = false; zApply(true); }
    function zWrap(fe) {                                   // 把內容包進一層，浮動按鈕留在外面才不會跟著縮放
      if (!fe || Z.wrap) return;
      const w = document.createElement('div'); w.className = 'fszoom';
      [...fe.children].forEach(el => { if (!el.matches(SKIP)) w.appendChild(el); });
      fe.insertBefore(w, fe.firstChild); Z.wrap = w;
    }
    function zUnwrap() {
      if (!Z.wrap) return;
      const w = Z.wrap, fe = w.parentElement;
      while (w.firstChild) fe.insertBefore(w.firstChild, w);
      w.remove(); Z.wrap = null; Z.s = 1; Z.tx = 0; Z.ty = 0; Z.ix = 0; Z.iy = 0; Z.is = 1;
      Z.live = false; window.__rafHold = false;
      const ink0 = document.getElementById('inkCv'); if (ink0) ink0.style.transform = '';
      document.documentElement.dataset.fsz = '';
      if (fe) fe.style.overflow = '';
    }
    const zOn = e => {
      if (!document.fullscreenElement || e.pointerType === 'mouse') return;
      // 3D 畫面（OrbitControls）自己要用雙指縮放旋轉，不要搶
      const t = e.target;
      if (t && t.closest && (t.closest('.three3d') || (t.tagName === 'CANVAS' &&
          getComputedStyle(t).touchAction === 'none'))) return;
      Z.pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (Z.pts.size === 2) {
        const [a, b] = [...Z.pts.values()];
        Z.d0 = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1; Z.s0 = Z.s;
        Z.mx = (a[0] + b[0]) / 2; Z.my = (a[1] + b[1]) / 2; Z.tx0 = Z.tx; Z.ty0 = Z.ty;
        Z.live = true; window.__rafHold = true;            // 手勢中暫停頁面動畫，不然全螢幕的大畫布每幀重畫會很卡
        e.preventDefault(); e.stopPropagation();
      }
    };
    const zMove = e => {
      if (!Z.pts.has(e.pointerId)) return;
      Z.pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (Z.pts.size < 2) return;
      e.preventDefault(); e.stopPropagation();
      const [a, b] = [...Z.pts.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1;
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const s = Math.min(4, Math.max(1, Z.s0 * d / Z.d0));
      // 讓兩指中點下的那一點固定不動，再加上中點自己的位移＝平移
      Z.tx = mx - (Z.mx - Z.tx0) * (s / Z.s0);
      Z.ty = my - (Z.my - Z.ty0) * (s / Z.s0);
      Z.s = s;
      if (s === 1) { Z.tx = 0; Z.ty = 0; }
      zApply();
    };
    const zEnd = () => {
      if (!Z.live) return;
      Z.live = false; window.__rafHold = false;
      zApply(true);
      if (window.__rafResume) window.__rafResume();
    };
    const zOff = e => { Z.pts.delete(e.pointerId); if (Z.pts.size < 2) zEnd(); };
    ['pointerdown'].forEach(t => document.addEventListener(t, zOn, true));
    document.addEventListener('pointermove', zMove, true);
    ['pointerup', 'pointercancel'].forEach(t => document.addEventListener(t, zOff, true));
    const z11 = document.createElement('button');
    z11.className = 'fsz11'; z11.type = 'button'; z11.textContent = '↺ 1:1';
    z11.title = '回到原來的大小'; z11.addEventListener('click', zReset);
    document.body.appendChild(z11);

    document.addEventListener('fullscreenchange', () => {
      const fe = document.fullscreenElement;
      if (fe) zWrap(fe); else zUnwrap();
      document.querySelectorAll('canvas').forEach(c => { c._fsTop = null; c._fh = 0; });
      // 沒有用共用 fit() 的頁面（畫布高度寫在 CSS 裡）：全螢幕時也讓它長高一點
      if (fe) {
        fe.querySelectorAll('canvas').forEach(c => {
          if (c._usesFit) return;
          const r = c.getBoundingClientRect();
          if (!c._h0) c._h0 = r.height;
          const avail = Math.floor(innerHeight - r.top - 16);
          if (avail > c._h0 + 40) c.style.height = Math.min(avail, Math.round(c._h0 * 1.7)) + 'px';
        });
      } else {
        document.querySelectorAll('canvas').forEach(c => { if (c._h0) c.style.height = ''; });
      }
      // 全螢幕時只有該元素的子孫會顯示，所以把浮動按鈕搬進去
      const host = fe || document.body;
      document.querySelectorAll('.stepbar,.touchbtn,.fsfix,.fsz11,#inkCv,#inkGo,#inkBar').forEach(el => host.appendChild(el));
      [0, 60, 260, 600].forEach(d => setTimeout(() => dispatchEvent(new Event('resize')), d));
    });
  }

  // ---- 逐幀播放：全站共用。開啟後所有動畫停住，按「下一幀」才前進一格 ----
  function frameStep() {
    if (embedded) { window.__rafRaw = window.requestAnimationFrame.bind(window); return; }
    const raf0 = window.requestAnimationFrame.bind(window);
    window.__rafRaw = raf0;
    let on = false, q = [], vt = performance.now(), idc = 1, pend = 0;
    window.requestAnimationFrame = cb => { if (!on && !window.__rafHold) return raf0(cb); q.push(cb); return idc++; };
    const flush = adv => { vt += adv; const l = q; q = []; l.forEach(cb => { try { cb(vt); } catch (e) { console.error(e); } }); };
    const soon = () => { if (!on || window.__rafHold) return; clearTimeout(pend); pend = setTimeout(() => flush(0), 0); };
    window.__rafResume = () => { if (on) return; const l = q; q = []; l.forEach(cb => raf0(cb)); };
    ['pointerdown', 'pointerup', 'pointermove', 'input', 'change', 'keydown', 'wheel'].forEach(t =>
      addEventListener(t, soon, { passive: true, capture: true }));
    const wrap = document.createElement('div');
    wrap.className = 'stepbar';
    wrap.innerHTML = '<button type="button" aria-pressed="false" title="逐幀模式：動畫會停住，按「下一幀」才前進一格">⏭ 逐幀</button>' +
      '<button type="button" hidden>▸ 1 幀</button><button type="button" hidden>▸▸ 5 幀</button>';
    document.body.appendChild(wrap);
    const bs = wrap.querySelectorAll('button');
    bs[0].addEventListener('click', () => {
      on = !on;
      if (on) vt = performance.now(); else { const l = q; q = []; l.forEach(cb => raf0(cb)); }
      bs[0].setAttribute('aria-pressed', String(on));
      bs[0].textContent = on ? '⏭ 逐幀中' : '⏭ 逐幀';
      bs[1].hidden = bs[2].hidden = !on;
      document.documentElement.dataset.step = on ? '1' : '';
    });
    bs[1].addEventListener('click', () => flush(1000 / 60));
    bs[2].addEventListener('click', () => flush(5000 / 60));
  }


  // ---- 手寫批註：鋼筆（粗細隨速度）、雷射筆、橡皮擦。整頁都能寫，關頁就消失 ----
  function inkLayer() {
    if (document.getElementById('inkCv')) return;
    const COLS = ['#2b3138', '#e03131', '#e8590c', '#1864ab', '#2b8a3e', '#7048e8'];
    const MORE = ['#f59f00', '#e64980', '#0ca678', '#a9754a', '#868e96', '#ffffff'];
    const K = { on: false, tool: 'pen', col: COLS[1], w: 2.5, strokes: [], cur: null, pid: null,
                laser: null, fade: null, tmr: 0, act: new Set(), multi: false };
    let cv = null, g = null;                        // 第一次要寫字才真的建立畫布
    function ensure() {
      if (cv) return cv;
      cv = document.createElement('canvas'); cv.id = 'inkCv'; cv.dataset.nofs = '1'; g = cv.getContext('2d');
      (document.fullscreenElement || document.body).appendChild(cv); wire(); fit(); return cv;
    }
    function live() {                                // 有字、正在寫、或雷射還在淡出才需要這張畫布
      if (!cv) return;
      cv.classList.toggle('live', K.on || K.strokes.length > 0 || !!K.cur || !!K.laser || !!K.fade);
    }
    const go = document.createElement('button'); go.id = 'inkGo'; go.type = 'button';
    go.textContent = '✏️';
    go.title = '整頁都可以用手指寫字；寫字時不會動到動畫。再按「完成」回到操作模式。';
    const bar = document.createElement('div'); bar.id = 'inkBar';
    document.body.append(go, bar);

    // ---- 幾何：墨水存文件座標，畫布只有視窗大小 ----
    const Z = () => window.__fsZoom || { s: 1, tx: 0, ty: 0 };     // 全螢幕縮放的狀態
    window.__inkRedraw = () => { if (cv) draw(); };                 // 縮放時跟著重畫
    const fit = () => { if (!cv) return;
      // 大畫面（例如 4K 電視）用 1 倍就好：全螢幕貼圖愈大，合成愈慢
      const d = Math.min(innerWidth * innerHeight > 2.2e6 ? 1 : 2, devicePixelRatio || 1);
      cv.width = Math.round(innerWidth * d); cv.height = Math.round(innerHeight * d);
      g.setTransform(d, 0, 0, d, 0, 0); draw(); };
    // 墨水存「內容座標」：全螢幕放大／平移後，字才會黏在內容上一起走
    const pt = e => { const z = Z();
      return [(e.clientX - z.tx) / z.s + scrollX, (e.clientY - z.ty) / z.s + scrollY, performance.now()]; };

    // ---- 鋼筆：用書寫速度算粗細（手指沒有筆壓），起筆收筆收尖 ----
    function widths(st) {
      const p = st.pts, n = p.length, out = new Array(n); let w = st.w * .75;
      for (let i = 0; i < n; i++) {
        let v = 0;
        if (i > 0) { const dt = Math.max(4, p[i][2] - p[i - 1][2]);
          v = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]) / dt; }
        const u = Math.min(1, Math.max(0, (v - .12) / 1.5));          // px/ms → 0~1
        const raw = st.w * (1.3 - .92 * u);                            // 慢＝粗、快＝細
        w += (raw - w) * .32;                                          // 平滑，不然會一節一節
        out[i] = w;
      }
      const tp = Math.min(6, Math.floor(n / 2));                       // 兩端收尖
      for (let i = 0; i < tp; i++) { const f = .28 + .72 * (i + 1) / tp;
        out[i] *= f; out[n - 1 - i] *= f; }
      return out;
    }
    function build(st) {                                                // 變寬度筆畫＝填滿的多邊形
      const p = st.pts, n = p.length, P = new Path2D();
      if (n === 1) { P.arc(p[0][0], p[0][1], Math.max(.8, st.w * .45), 0, 7); return P; }
      const w = widths(st), L = [], R = [];
      for (let i = 0; i < n; i++) {
        const a = p[Math.max(0, i - 1)], b = p[Math.min(n - 1, i + 1)];
        let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1;
        const nx = -dy / d * w[i] / 2, ny = dx / d * w[i] / 2;
        L.push([p[i][0] + nx, p[i][1] + ny]); R.push([p[i][0] - nx, p[i][1] - ny]);
      }
      const side = (A, first) => { if (first) P.moveTo(A[0][0], A[0][1]); else P.lineTo(A[0][0], A[0][1]);
        for (let i = 1; i < A.length - 1; i++)
          P.quadraticCurveTo(A[i][0], A[i][1], (A[i][0] + A[i + 1][0]) / 2, (A[i][1] + A[i + 1][1]) / 2);
        P.lineTo(A[A.length - 1][0], A[A.length - 1][1]); };
      side(L, true); R.reverse(); side(R, false); P.closePath(); return P;
    }
    function draw() {
      if (!cv) return; live();
      g.clearRect(0, 0, innerWidth, innerHeight);
      const z = Z();
      const zz = window.__fsZoom;                                   // 真的重畫了，CSS 代用變換就要歸零
      if (zz) { zz.ix = z.tx; zz.iy = z.ty; zz.is = z.s; if (cv.style.transform) cv.style.transform = ''; }
      g.save(); g.translate(z.tx - scrollX, z.ty - scrollY); if (z.s !== 1) g.scale(z.s, z.s);
      K.strokes.forEach(st => { g.fillStyle = st.c; g.fill(st.path || (st.path = build(st))); });
      if (K.cur) { g.fillStyle = K.cur.c; g.fill(build(K.cur)); }
      const las = K.laser || K.fade;
      if (las && las.pts.length) {
        const al = K.fade ? Math.max(0, 1 - (performance.now() - K.fade.t0) / 900) : 1;
        g.lineCap = 'round'; g.lineJoin = 'round'; g.globalAlpha = al;
        g.beginPath(); g.moveTo(las.pts[0][0], las.pts[0][1]);
        las.pts.forEach(q => g.lineTo(q[0], q[1]));
        g.shadowColor = 'rgba(255,40,30,.95)'; g.shadowBlur = 22;
        g.strokeStyle = 'rgba(255,45,35,.9)'; g.lineWidth = 9; g.stroke();
        g.shadowBlur = 10; g.strokeStyle = 'rgba(255,220,215,.95)'; g.lineWidth = 3; g.stroke();
        g.shadowBlur = 0; g.globalAlpha = 1;
      }
      g.restore();
    }
    function fadeTick() {
      if (!K.fade) return;
      if (performance.now() - K.fade.t0 > 900) { K.fade = null; draw(); return; }
      draw(); K.tmr = setTimeout(fadeTick, 16);                        // 用計時器，逐幀模式才不會卡住
    }
    function erase(x, y) { const n = K.strokes.length, r = 16 / Z().s;
      K.strokes = K.strokes.filter(st => !st.pts.some(q => Math.hypot(q[0] - x, q[1] - y) < r + st.w / 2));
      if (K.strokes.length !== n) draw(); }

    function wire() {
    cv.addEventListener('pointerdown', e => {
      if (!K.on) return;
      K.act.add(e.pointerId);
      if (K.act.size >= 2) {            // 第二根手指下去＝要縮放／平移，不是要寫字
        K.multi = true;                 // 把剛剛畫到一半的那一筆丟掉，才不會留下一條雜線
        if (K.cur) { K.cur = null; }
        if (K.laser) { K.laser = null; }
        if (K.pid !== null) { try { cv.releasePointerCapture(K.pid); } catch (_) {} K.pid = null; }
        draw(); return;
      }
      if (K.multi || K.pid !== null) return;                           // 同時只認一根手指＝手掌不會畫到
      K.pid = e.pointerId; try { cv.setPointerCapture(e.pointerId); } catch (_) {}   // 抓不到就算了，不能讓它中斷後面的程式（否則 K.pid 卡住就再也寫不了）
      e.preventDefault();
      const q = pt(e);
      if (K.tool === 'er') { erase(q[0], q[1]); return; }
      if (K.tool === 'laser') { clearTimeout(K.tmr); K.fade = null; K.laser = { pts: [q] }; draw(); return; }
      K.cur = { c: K.col, w: K.w, pts: [q] }; draw();
    });
    cv.addEventListener('pointermove', e => {
      if (!K.on || e.pointerId !== K.pid) return; e.preventDefault();
      const q = pt(e);
      if (K.tool === 'er') { erase(q[0], q[1]); return; }
      const t = K.tool === 'laser' ? K.laser : K.cur; if (!t) return;
      const l = t.pts[t.pts.length - 1];
      if (Math.hypot(q[0] - l[0], q[1] - l[1]) < 1.1) return;
      t.pts.push(q); draw();
    });
    const up = e => {
      K.act.delete(e.pointerId);
      if (K.act.size === 0) K.multi = false;        // 手指全部離開才解除「多指手勢中」
      if (e.pointerId !== K.pid) return; K.pid = null;
      if (K.laser) { K.fade = { pts: K.laser.pts, t0: performance.now() }; K.laser = null;
        clearTimeout(K.tmr); K.tmr = setTimeout(fadeTick, 16); return; }
      if (K.cur) { K.cur.path = build(K.cur); K.strokes.push(K.cur); K.cur = null; draw(); }
    };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    }

    // ---- 工具列 ----
    const mk = (txt, title, cls, host) => { const b = document.createElement('button'); b.type = 'button';
      b.textContent = txt; if (title) b.title = title; if (cls) b.className = cls;
      (host || bar).appendChild(b); return b; };
    const sep = host => (host || bar).appendChild(Object.assign(document.createElement('span'), { className: 'sep' }));
    const penB = mk('✒️', '鋼筆：寫得慢的地方粗、快的地方細');
    const lasB = mk('🔦', '雷射筆：手指按著時軌跡會留著，放開後約 1 秒淡出');
    const erB = mk('擦', '橡皮擦：劃過哪一筆就整筆擦掉');
    sep();
    const swaps = [], mkSw = (c, host) => { const b = mk('', '筆的顏色', 'sw', host); b.style.background = c;
      b.addEventListener('click', () => { K.col = c; K.tool = 'pen'; sync(); }); swaps.push([b, c]); return b; };
    COLS.forEach(c => mkSw(c));
    const moreWrap = document.createElement('span'); moreWrap.className = 'more'; bar.appendChild(moreWrap);
    MORE.forEach(c => mkSw(c, moreWrap));
    const moreB = mk('＋', '展開其他顏色');
    moreB.addEventListener('click', () => { bar.classList.toggle('open');
      moreB.setAttribute('aria-pressed', String(bar.classList.contains('open'))); });
    sep();
    const WS = [[2.5, '細'], [4.5, '中'], [9, '粗']];
    const wB = mk('中', '筆的粗細：按一下換細／中／粗');
    wB.addEventListener('click', () => { const i = WS.findIndex(w => w[0] === K.w);
      [K.w] = WS[(i + 1) % WS.length]; K.tool = 'pen'; sync(); });
    sep();
    const unB = mk('↶', '復原上一筆'); unB.addEventListener('click', () => { K.strokes.pop(); draw(); });
    let arm = 0; const clB = mk('🗑', '全部清掉（要按兩次）');
    clB.addEventListener('click', () => {
      if (Date.now() - arm < 3000) { K.strokes = []; arm = 0; clB.textContent = '🗑'; clB.style.color = ''; draw(); }
      else { arm = Date.now(); clB.textContent = '確定'; clB.style.color = 'var(--red,#e03131)';
        setTimeout(() => { if (Date.now() - arm >= 3000) { clB.textContent = '🗑'; clB.style.color = ''; } }, 3100); } });
    mk('✓', '完成：回到操作動畫（寫的字會留著）').addEventListener('click', () => set(false));

    function sync() {
      penB.setAttribute('aria-pressed', String(K.tool === 'pen'));
      lasB.setAttribute('aria-pressed', String(K.tool === 'laser'));
      erB.setAttribute('aria-pressed', String(K.tool === 'er'));
      swaps.forEach(([b, c]) => b.setAttribute('aria-pressed', String(K.tool === 'pen' && c === K.col)));
      wB.textContent = (WS.find(w => w[0] === K.w) || WS[1])[1];
    }
    penB.addEventListener('click', () => { K.tool = 'pen'; sync(); });
    lasB.addEventListener('click', () => { K.tool = 'laser'; sync(); });
    erB.addEventListener('click', () => { K.tool = 'er'; sync(); });
    function set(v) { K.on = v; document.documentElement.dataset.ink = v ? '1' : '';
      // 全螢幕時只有全螢幕元素的子孫會顯示，所以每次開啟都把三個元素搬到正確的容器
      if (v) { ensure(); const host = document.fullscreenElement || document.body;
        [cv, go, bar].forEach(el => { if (el && el.parentElement !== host) host.appendChild(el); }); fit(); }
      else { K.pid = null; K.cur = null; K.laser = null; K.fade = null; clearTimeout(K.tmr); }
      sync(); live(); draw(); }
    go.addEventListener('click', () => set(true));
    addEventListener('keydown', e => { if (e.key === 'Escape' && K.on) set(false); });
    addEventListener('resize', fit); addEventListener('scroll', () => { if (cv) draw(); }, { passive: true });
    sync();
  }

  function init() { fold(); nav(); touchMode(); zoomRedraw(); fsBtns(); frameStep(); inkLayer(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
