/* Renders the shared sidebar/topbar for staff pages, and guards every staff
   page (except the login page) behind a server-checked session cookie.
   Expects <div id="staff-sidebar"></div> and <div id="staff-topbar"></div>
   in the page, and body[data-page] set to one of:
   login, dashboard, guidelines, sheets, timetable, slots, notices, appointments */
(function(){
  const { t, getLang, setLang } = window.CJ_I18N;

  const NAV_ITEMS = [
    ['dashboard','staff_dashboard','🏠','/staff/dashboard'],
    ['guidelines','staff_guidelines','📘','/staff/guidelines'],
    ['sheets','staff_sheets','📊','/staff/sheets'],
    ['timetable','staff_timetable','🗓️','/staff/timetable'],
    ['slots','staff_slots','🩺','/staff/slots'],
    ['notices','staff_notices','📢','/staff/notices'],
    ['appointments','staff_appointments','📥','/staff/appointments']
  ];

  function langSelectHTML(){
    const lang = getLang();
    return `<select class="lang-select" id="lang-select">
      <option value="en" ${lang==='en'?'selected':''}>English</option>
      <option value="zh" ${lang==='zh'?'selected':''}>中文</option>
      <option value="ms" ${lang==='ms'?'selected':''}>Bahasa Malaysia</option>
    </select>`;
  }

  function applyStaticI18n(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{ el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
  }

  function renderSidebarAndTopbar(activePage){
    const sidebar = document.getElementById('staff-sidebar');
    const topbar = document.getElementById('staff-topbar');
    if(sidebar){
      sidebar.className = 's-sidebar';
      sidebar.innerHTML = `
        <div class="s-brand">🔒 <span class="brand-text">${t('brand')}<br><small>Staff System</small></span></div>
        ${NAV_ITEMS.map(([key,labelKey,icon,href])=>`<a class="s-nav-item ${activePage===key?'active':''}" href="${href}" style="text-decoration:none">
          <span class="label-text">${icon} ${t(labelKey)}</span>
          ${key==='appointments' ? `<span id="appt-badge"></span>` : ''}
        </a>`).join('')}
        <div class="s-sidebar-foot">
          ${langSelectHTML()}
          <a class="s-nav-item" href="/" style="text-decoration:none">👁️ <span class="label-text">${t('viewPublic')}</span></a>
          <button class="s-nav-item" id="logout-btn" type="button">🚪 <span class="label-text">${t('staff_logout')}</span></button>
        </div>
      `;
      document.getElementById('lang-select').addEventListener('change', e=>{ setLang(e.target.value); location.reload(); });
      document.getElementById('logout-btn').addEventListener('click', async ()=>{
        try{ await window.CJ_API.logout(); }catch(e){}
        location.href = '/staff/';
      });
      refreshApptBadge();
    }
    if(topbar){
      const labelKey = (NAV_ITEMS.find(i=>i[0]===activePage) || [,'staff_dashboard'])[1];
      topbar.className = 's-topbar';
      topbar.innerHTML = `<h2>${t(labelKey)}</h2><span class="s-lockbadge">🔒 INTERNAL</span>`;
    }
  }

  async function refreshApptBadge(){
    const el = document.getElementById('appt-badge');
    if(!el) return;
    try{
      const {appointments} = await window.CJ_API.listAppointments();
      const n = (appointments||[]).filter(a=>a.status==='new').length;
      el.textContent = '';
      if(n>0){ el.className='badge-count'; el.textContent = n; }
    }catch(e){ /* non-critical */ }
  }

  function initLoginPage(){
    const form = document.querySelector('[data-form="staff-login"]');
    if(form){
      form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const passcode = form.querySelector('[name=passcode]').value;
        const errorBox = document.getElementById('login-error');
        try{
          await window.CJ_API.login(passcode);
          location.href = '/staff/dashboard';
        }catch(err){
          if(errorBox) errorBox.style.display = 'block';
        }
      });
    }
    const langSelect = document.getElementById('lang-select');
    if(langSelect){
      langSelect.value = getLang();
      langSelect.addEventListener('change', e=>{ setLang(e.target.value); location.reload(); });
    }
    applyStaticI18n();
    // If already logged in, skip straight to the dashboard.
    window.CJ_API.checkAuth().then(r=>{ if(r && r.loggedIn) location.href = '/staff/dashboard'; }).catch(()=>{});
  }

  async function init(){
    document.body.classList.add('mode-staff');
    const page = document.body.getAttribute('data-page') || 'dashboard';
    if(page === 'login'){ initLoginPage(); return; }

    let authed = false;
    try{ const r = await window.CJ_API.checkAuth(); authed = !!(r && r.loggedIn); }
    catch(e){ authed = false; }
    if(!authed){ location.href = '/staff/'; return; }

    renderSidebarAndTopbar(page);
    applyStaticI18n();
    if(typeof window.CJ_PAGE_INIT === 'function') window.CJ_PAGE_INIT();
  }

  window.CJ_STAFF_CHROME = { applyStaticI18n, refreshApptBadge };
  document.addEventListener('DOMContentLoaded', init);
})();
