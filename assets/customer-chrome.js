/* Renders the shared header/footer/notice-banner for customer-facing pages.
   Expects <div id="site-header"></div> and <div id="site-footer"></div>
   in the page, and body[data-page] set to one of: home, doctors, duty, booking. */
(function(){
  const C = window.CJ_CONTENT;
  const { t, tr, getLang, setLang } = window.CJ_I18N;

  function langSelectHTML(){
    const lang = getLang();
    return `<select class="lang-select" id="lang-select">
      <option value="en" ${lang==='en'?'selected':''}>English</option>
      <option value="zh" ${lang==='zh'?'selected':''}>中文</option>
      <option value="ms" ${lang==='ms'?'selected':''}>Bahasa Malaysia</option>
    </select>`;
  }

  function headerHTML(activePage){
    const nav = [
      ['home','nav_home','/'],
      ['doctors','nav_doctors','/doctors'],
      ['duty','nav_duty','/duty'],
      ['booking','nav_booking','/booking']
    ];
    return `
    <div class="c-topbar">
      <div class="c-topbar-inner">
        <div class="c-brand">
          <a href="/" style="display:flex;align-items:center;text-decoration:none;color:inherit"><div class="c-brand-mark">✚</div></a>
          <div>
            <a href="/" class="c-brand-name" style="text-decoration:none;color:inherit;display:block">${t('brand')}</a>
            <div class="c-brand-loc"><a class="map-link" href="${C.googleMapsUrl()}" target="_blank" rel="noopener">📍 ${tr(C.CLINIC_LOCATION)} <span class="map-arrow">↗</span></a></div>
          </div>
        </div>
        <div class="c-nav">
          ${nav.map(([key,labelKey,href])=>`<a href="${href}" class="${activePage===key?'active':''}">${t(labelKey)}</a>`).join('')}
        </div>
        <div class="c-topbar-right">
          ${langSelectHTML()}
          <a class="c-staff-link" href="/staff/">${t('nav_staffLogin')}</a>
        </div>
      </div>
    </div>
    <div id="notice-banner-slot"></div>
    `;
  }

  function footerHTML(){
    return `<div class="c-footer"><div class="c-footer-inner">
      <div>© ${new Date().getFullYear()} ${t('brand')} · <a class="footer-loc-link" href="${C.googleMapsUrl()}" target="_blank" rel="noopener">📍 ${tr(C.CLINIC_LOCATION)} (${t('view_on_map')} ↗)</a>. ${t('footer_rights')}</div>
      <div style="opacity:.75">${t('footer_lang')}: EN · 中文 · BM</div>
    </div></div>`;
  }

  function applyStaticI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-html]').forEach(el=>{ el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{ el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
  }

  async function renderNoticeBanner(){
    const slot = document.getElementById('notice-banner-slot');
    if(!slot) return;
    try{
      const {notice} = await window.CJ_API.getNotice();
      if(!notice){ slot.innerHTML=''; return; }
      const tmpl = C.NOTICE_TEMPLATES.find(n=>n.type===notice.type);
      const icon = tmpl ? tmpl.icon : '📢';
      const cls = notice.type==='closed' ? 'notice-closed' : 'notice-rest';
      slot.innerHTML = `<div class="notice-banner"><div class="notice-banner-inner ${cls}"><span style="font-size:20px">${icon}</span><span>${window.CJ_UTIL.escapeHTML(notice.message)}</span></div></div>`;
    }catch(e){ /* notice banner is non-critical; fail silently */ }
  }

  function init(){
    document.body.classList.add('mode-customer');
    const page = document.body.getAttribute('data-page') || 'home';
    const header = document.getElementById('site-header');
    const footer = document.getElementById('site-footer');
    if(header) header.innerHTML = headerHTML(page);
    if(footer) footer.innerHTML = footerHTML();
    const langSelect = document.getElementById('lang-select');
    if(langSelect) langSelect.addEventListener('change', e=>{ setLang(e.target.value); location.reload(); });
    applyStaticI18n();
    renderNoticeBanner();
    if(typeof window.CJ_PAGE_INIT === 'function') window.CJ_PAGE_INIT();
  }

  window.CJ_CHROME = { applyStaticI18n };
  document.addEventListener('DOMContentLoaded', init);
})();
