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
          <a href="/" style="display:flex;align-items:center;text-decoration:none;color:inherit"><img class="c-brand-mark" src="/assets/img/683879694_17916673392359050_4907399894885324601_n.jpg" alt="Klinik CJ logo"></a>
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

  function waFloatHTML(){
    return `<a class="wa-float" href="${C.CLINIC_WHATSAPP_LINK}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">💬</a>`;
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

  function initScrollReveal(){
    const els = document.querySelectorAll('.reveal');
    if(!els.length) return;
    if(!('IntersectionObserver' in window)){ els.forEach(el=>el.classList.add('in-view')); return; }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    els.forEach(el=>io.observe(el));
  }

  /* ---------- WhatsApp quick-contact popup ---------- */

  function waModalHTML(){
    return `<div class="wa-modal-overlay" id="wa-modal-overlay">
      <div class="wa-modal-card">
        <button type="button" class="wa-modal-close" id="wa-modal-close" aria-label="Close">✕</button>
        <h3>${t('wa_modal_title')}</h3>
        <p class="wa-modal-sub">${t('wa_modal_subtitle')}</p>
        <div class="wa-modal-error" id="wa-modal-error" style="display:none"></div>
        <div class="field"><label>${t('booking_name')}</label><input type="text" id="wa-modal-name"></div>
        <div class="field"><label>${t('wa_modal_reason')}</label><input type="text" id="wa-modal-reason" placeholder="${t('wa_modal_reasonPlaceholder')}"></div>
        <div class="field"><label>${t('booking_date')}</label><input type="date" id="wa-modal-date"></div>
        <div class="field"><label>${t('booking_time')}</label><div class="time-slot-grid" id="wa-modal-time-grid"></div></div>
        <p class="wa-modal-note">${t('wa_modal_note')}</p>
        <div class="wa-modal-actions">
          <button type="button" class="btn btn-outline" id="wa-modal-cancel">${t('wa_modal_cancel')}</button>
          <button type="button" class="btn btn-primary" id="wa-modal-submit">${t('wa_modal_submit')}</button>
        </div>
      </div>
    </div>`;
  }

  function buildWaMessage(name, reason, date, time){
    const lang = getLang();
    const timeDisplay = window.CJ_UTIL.formatTimeDisplay(time);
    const lines = {
      en: [`Hi ${C.CLINIC_NAME}, I would like to make an appointment.`, `Name: ${name}`, `Reason: ${reason}`, `Date: ${date}`, `Time: ${timeDisplay}`],
      zh: [`您好 ${C.CLINIC_NAME}，我想预约看诊。`, `姓名：${name}`, `原因：${reason}`, `日期：${date}`, `时间：${timeDisplay}`],
      ms: [`Hai ${C.CLINIC_NAME}, saya ingin membuat temujanji.`, `Nama: ${name}`, `Sebab: ${reason}`, `Tarikh: ${date}`, `Masa: ${timeDisplay}`]
    };
    return (lines[lang] || lines.en).join('
');
  }

  function initWaQuickForm(){
    document.body.insertAdjacentHTML('beforeend', waModalHTML());
    const overlay = document.getElementById('wa-modal-overlay');
    const errorBox = document.getElementById('wa-modal-error');
    const nameInput = document.getElementById('wa-modal-name');
    const reasonInput = document.getElementById('wa-modal-reason');
    const dateInput = document.getElementById('wa-modal-date');
    const timeGrid = document.getElementById('wa-modal-time-grid');
    let selectedTime = '';

    function refreshTimeGrid(){
      selectedTime = '';
      window.CJ_TIMEPICKER.render(timeGrid, dateInput.value, selectedTime, (tm)=>{ selectedTime = tm; });
    }

    function openModal(){
      errorBox.style.display = 'none';
      nameInput.value = '';
      reasonInput.value = '';
      dateInput.value = window.CJ_UTIL.todayISO();
      dateInput.min = window.CJ_UTIL.todayISO();
      refreshTimeGrid();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal(){
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    dateInput.addEventListener('change', refreshTimeGrid);
    document.getElementById('wa-modal-close').addEventListener('click', closeModal);
    document.getElementById('wa-modal-cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

    document.getElementById('wa-modal-submit').addEventListener('click', async ()=>{
      const name = nameInput.value.trim();
      const reason = reasonInput.value.trim();
      const date = dateInput.value;
      if(!name || !reason || !date || !selectedTime){
        errorBox.textContent = t('wa_modal_validation');
        errorBox.style.display = 'block';
        return;
      }
      const message = buildWaMessage(name, reason, date, selectedTime);
      const hour = parseInt(selectedTime.split(':')[0], 10);
      const slot = hour < 13 ? 'morning' : 'afternoon';
      try{
        await window.CJ_API.createAppointment({
          name, phone:'(via WhatsApp)', date, time:selectedTime, slot,
          service:'', doctor:'', notes:'[WhatsApp] ' + reason
        });
      }catch(e){ /* still let the customer through to WhatsApp even if saving failed */ }
      window.open(C.CLINIC_WHATSAPP_LINK + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
      closeModal();
    });

    document.addEventListener('click', (e)=>{
      const trigger = e.target.closest('.wa-float, #visit-whatsapp-link');
      if(trigger){
        e.preventDefault();
        openModal();
      }
    });
  }

  function init(){
    document.body.classList.add('mode-customer');
    const page = document.body.getAttribute('data-page') || 'home';
    const header = document.getElementById('site-header');
    const footer = document.getElementById('site-footer');
    if(header) header.innerHTML = headerHTML(page);
    if(footer) footer.innerHTML = footerHTML();
    document.body.insertAdjacentHTML('beforeend', waFloatHTML());
    const langSelect = document.getElementById('lang-select');
    if(langSelect) langSelect.addEventListener('change', e=>{ setLang(e.target.value); location.reload(); });
    applyStaticI18n();
    renderNoticeBanner();
    if(typeof window.CJ_PAGE_INIT === 'function') window.CJ_PAGE_INIT();
    initScrollReveal();
    initWaQuickForm();
  }

  window.CJ_CHROME = { applyStaticI18n };
  document.addEventListener('DOMContentLoaded', init);
})();
