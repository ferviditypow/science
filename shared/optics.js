// 光學單元共用：上方導覽列＋國中／高中切換
// 用法：在 <head> 載入 <script src="../shared/optics.js"></script>
//   - 國中模式會隱藏 class="sh-only" 的東西（公式、高一講義題目等）；class="jh-only" 則只在國中模式顯示
//   - 程度記在瀏覽器裡（全站共用），網址加 ?level=jh 或 ?level=sh 可直接指定（方便做 QR Code 給學生）
//   - 頁面程式用 isJH() 判斷；切換時會發出 window 的 'levelchange' 事件
//   - 被 iframe 嵌進其他頁面時（例如反射頁裡的面鏡），自動隱藏頁首與導覽列，並把高度告訴外層頁面
(function () {
  const PAGES = [
    ['pinhole', '光的直線傳播', '國二'],
    ['reflection', '光的反射', '國二・高一'],
    ['refraction', '光的折射', '國二・高一'],
    ['lens', '透鏡', '國二'],
    ['color', '色光與顏色', '國二'],
    ['emwave', '電磁波', '高一'],
    ['interference', '繞射與干涉', '高一'],
  ];
  const KEY = 'optics-level';
  const root = document.documentElement;
  const embedded = window.top !== window;

  function readLevel() {
    if (embedded) {
      try { const lv = window.parent.document.documentElement.dataset.level; if (lv) return lv; } catch (e) {}
    }
    const q = new URLSearchParams(location.search).get('level');
    if (q === 'jh' || q === 'sh') { try { localStorage.setItem(KEY, q); } catch (e) {} return q; }
    try { return localStorage.getItem(KEY) || 'sh'; } catch (e) { return 'sh'; }
  }

  root.dataset.level = readLevel();
  if (embedded) root.classList.add('embed');

  window.isJH = () => root.dataset.level === 'jh';
  window.setOpticsLevel = function (lv, fromParent) {
    lv = lv === 'jh' ? 'jh' : 'sh';
    if (root.dataset.level === lv) return;
    root.dataset.level = lv;
    if (!fromParent) { try { localStorage.setItem(KEY, lv); } catch (e) {} }
    document.querySelectorAll('.optnav .lv button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lv === lv)));
    // 把程度傳給嵌在頁面裡的 iframe
    document.querySelectorAll('iframe').forEach(f => { try { f.contentWindow.setOpticsLevel && f.contentWindow.setOpticsLevel(lv, true); } catch (e) {} });
    window.dispatchEvent(new Event('levelchange'));
  };

  const css = `
html[data-level="jh"] .sh-only{display:none!important}
html[data-level="sh"] .jh-only{display:none!important}
html.embed header,html.embed .optnav,html.embed .rotate-hint{display:none!important}
html.embed body{background:transparent}
.optnav{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;padding:8px 10px}
.optnav .units{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.optnav a.u{display:inline-flex;align-items:baseline;gap:5px;min-height:36px;padding:6px 12px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--ink);text-decoration:none;font-weight:500;font-size:.92rem;line-height:1.3}
.optnav a.u:hover,.optnav a.u:focus-visible{border-color:var(--accent)}
.optnav a.u .no{font-family:var(--f-mono,monospace);color:var(--muted);font-size:.8rem}
.optnav a.u small{color:var(--muted);font-size:.72rem}
.optnav a.u[aria-current="page"]{background:var(--ink);border-color:var(--ink);color:var(--panel)}
.optnav a.u[aria-current="page"] .no,.optnav a.u[aria-current="page"] small{color:inherit;opacity:.75}
.optnav .lvwrap{margin-left:auto;display:flex;align-items:center;gap:8px}
.optnav .lvwrap .tlabel{white-space:nowrap}
@media (max-width:700px){.optnav{gap:6px 10px}.optnav>.tlabel{display:none}.optnav .units{flex-wrap:nowrap;overflow-x:auto;max-width:100%;padding-bottom:4px;scrollbar-width:thin}.optnav a.u{white-space:nowrap;min-height:34px;padding:5px 11px}.optnav .lvwrap{margin-left:0}}
`;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function here() {
    const segs = location.pathname.split('/').filter(Boolean);
    for (let i = segs.length - 1; i >= 0; i--) if (PAGES.some(p => p[0] === segs[i])) return segs[i];
    return '';
  }

  function buildNav() {
    if (embedded || document.querySelector('.optnav')) return;
    const cur = here();
    const nav = document.createElement('nav');
    nav.className = 'panel optnav';
    nav.setAttribute('aria-label', '光學單元');
    const units = PAGES.map((p, i) =>
      `<a class="u" href="../${p[0]}/"${p[0] === cur ? ' aria-current="page"' : ''}><span class="no">${i + 1}</span>${p[1]}<small>${p[2]}</small></a>`).join('');
    const lv = root.dataset.level;
    nav.innerHTML = `<span class="tlabel">光學</span><span class="units">${units}</span>
      <span class="lvwrap"><span class="tlabel">程度</span><span class="seg lv" role="group" aria-label="國中或高中">
      <button type="button" data-lv="jh" aria-pressed="${lv === 'jh'}">國中</button><button type="button" data-lv="sh" aria-pressed="${lv === 'sh'}">高中</button></span></span>`;
    nav.querySelector('.lv').addEventListener('click', e => { const b = e.target.closest('button[data-lv]'); if (b) window.setOpticsLevel(b.dataset.lv); });
    requestAnimationFrame(() => { const c = nav.querySelector('a.u[aria-current]'); if (c) { const u = nav.querySelector('.units'); u.scrollLeft = c.offsetLeft - u.offsetLeft - 12; } });
    const header = document.querySelector('header');
    if (header) header.insertAdjacentElement('afterend', nav);
    else document.body.insertAdjacentElement('afterbegin', nav);
  }

  // 被嵌進其他頁面時：隨內容高度調整 iframe 高度
  function reportHeight() {
    if (!embedded) return;
    let fe = null;
    try { fe = window.frameElement; } catch (e) {}
    if (!fe) return;
    const wrap = document.querySelector('.wrap') || document.body;
    const send = () => { const h = Math.ceil(wrap.getBoundingClientRect().bottom + window.scrollY + 8); if (h > 50) fe.style.height = h + 'px'; };
    new ResizeObserver(send).observe(wrap);
    window.addEventListener('load', send);
    send();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { buildNav(); reportHeight(); });
  else { buildNav(); reportHeight(); }
})();
