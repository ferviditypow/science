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

  function init() { fold(); nav(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
