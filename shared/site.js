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

  .touchbtn{position:fixed;right:10px;bottom:10px;z-index:60;padding:8px 12px;min-height:40px;
    border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--ink);
    font-size:.84rem;font-weight:500;box-shadow:0 2px 10px rgba(0,0,0,.14);cursor:pointer;opacity:.9}
  .touchbtn[aria-pressed="true"]{background:var(--ink);color:var(--panel);border-color:var(--ink)}
  .touchbtn:hover{opacity:1}
  @media print{.touchbtn{display:none}}

  .fsbox{position:relative}
  .fsbtn{position:absolute;top:6px;right:6px;z-index:6;width:34px;height:34px;padding:0;border-radius:9px;
    border:1px solid var(--line);background:var(--panel);color:var(--muted);font-size:15px;line-height:1;cursor:pointer;opacity:.5}
  .fsbtn:hover,.fsbtn:focus-visible{opacity:1;border-color:var(--accent);color:var(--ink)}
  :fullscreen{overflow:auto}
  .panel:fullscreen,.cbox:fullscreen{background:var(--panel);border-radius:0;max-width:none;width:100vw;height:100vh;padding:8px 14px 14px}
  .stepbar{position:fixed;right:10px;bottom:58px;z-index:60;display:flex;gap:6px;align-items:center}
  .stepbar button{padding:8px 12px;min-height:40px;border:1px solid var(--line);border-radius:999px;
    background:var(--panel);color:var(--ink);font-size:.84rem;font-weight:500;box-shadow:0 2px 10px rgba(0,0,0,.14);cursor:pointer;opacity:.62}
  .stepbar button[aria-pressed="true"]{background:var(--ink);color:var(--panel);border-color:var(--ink)}
  .stepbar button:hover{opacity:1}
  @media print{.stepbar,.fsbtn{display:none}}
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
        if (cv.dataset.nofs || cv.closest('button,.chip,.seg')) return;
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
    document.addEventListener('fullscreenchange', () => {
      const fe = document.fullscreenElement;
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
      document.querySelectorAll('.stepbar,.touchbtn').forEach(el => host.appendChild(el));
      [0, 60, 260, 600].forEach(d => setTimeout(() => dispatchEvent(new Event('resize')), d));
    });
  }

  // ---- 逐幀播放：全站共用。開啟後所有動畫停住，按「下一幀」才前進一格 ----
  function frameStep() {
    if (embedded) return;
    const raf0 = window.requestAnimationFrame.bind(window);
    let on = false, q = [], vt = performance.now(), idc = 1, pend = 0;
    window.requestAnimationFrame = cb => { if (!on) return raf0(cb); q.push(cb); return idc++; };
    const flush = adv => { vt += adv; const l = q; q = []; l.forEach(cb => { try { cb(vt); } catch (e) { console.error(e); } }); };
    const soon = () => { if (!on) return; clearTimeout(pend); pend = setTimeout(() => flush(0), 0); };
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

  function init() { fold(); nav(); touchMode(); zoomRedraw(); fsBtns(); frameStep(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
