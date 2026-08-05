/* Shared helpers: language state, i18n, API client, small utils.
   Defines window.CJ_I18N, window.CJ_API, window.CJ_UTIL. Load after content.js. */
(function(){
  const C = window.CJ_CONTENT;
  const LANG_KEY = 'cj_lang';

  function getLang(){
    try { return localStorage.getItem(LANG_KEY) || 'en'; } catch(e){ return 'en'; }
  }
  function setLang(lang){
    try { localStorage.setItem(LANG_KEY, lang); } catch(e){}
  }
  function t(key){
    const lang = getLang();
    return (C.UI[lang] && C.UI[lang][key]) || C.UI.en[key] || key;
  }
  function tr(obj){
    if(!obj) return '';
    const lang = getLang();
    return obj[lang] || obj.en || '';
  }

  window.CJ_I18N = { getLang, setLang, t, tr };

  window.CJ_UTIL = {
    todayISO(){ return new Date().toISOString().slice(0,10); },
    escapeHTML(s){
      return String(s==null?'':s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    },
    qs(name){ return new URLSearchParams(location.search).get(name); }
  };

  async function request(path, opts){
    opts = opts || {};
    const headers = Object.assign({'Content-Type':'application/json'}, opts.headers||{});
    const res = await fetch(path, Object.assign({credentials:'include', headers}, opts));
    let data = null;
    try { data = await res.json(); } catch(e){ data = null; }
    if(!res.ok){
      const err = new Error((data && data.error) || ('Request failed: ' + res.status));
      err.status = res.status; err.data = data;
      throw err;
    }
    return data;
  }

  window.CJ_API = {
    getNotice: () => request('/api/notice'),
    getSlots: (date) => request('/api/slots?date=' + encodeURIComponent(date)),
    createAppointment: (body) => request('/api/appointments', {method:'POST', body: JSON.stringify(body)}),

    login: (passcode) => request('/api/auth/login', {method:'POST', body: JSON.stringify({passcode})}),
    logout: () => request('/api/auth/logout', {method:'POST'}),
    checkAuth: () => request('/api/auth/check'),

    listAppointments: () => request('/api/staff/appointments'),
    confirmAppointment: (id) => request('/api/staff/appointments/' + id, {method:'PATCH', body: JSON.stringify({status:'confirmed'})}),
    setSlot: (body) => request('/api/staff/slots', {method:'POST', body: JSON.stringify(body)}),
    publishNotice: (body) => request('/api/staff/notice', {method:'POST', body: JSON.stringify(body)}),
    clearNotice: () => request('/api/staff/notice', {method:'DELETE'}),
    getSheetLinks: () => request('/api/staff/sheet-links'),
    saveSheetLink: (key, url) => request('/api/staff/sheet-links', {method:'POST', body: JSON.stringify({key, url})}),
    getGuideline: () => request('/api/staff/guideline'),
    saveGuideline: (url) => request('/api/staff/guideline', {method:'POST', body: JSON.stringify({url})}),
    getRoster: () => request('/api/staff/roster'),
    saveRosterRow: (day_key, staff) => request('/api/staff/roster', {method:'POST', body: JSON.stringify({day_key, staff})})
  };
})();
