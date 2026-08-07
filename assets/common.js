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
    /* Formats a Date object as a local-calendar YYYY-MM-DD string.
       Deliberately avoids toISOString() here, since that converts to UTC
       and would shift the date backwards by a day for any timezone ahead
       of UTC (e.g. Malaysia, UTC+8). */
    formatLocalISO(d){
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    },
    todayISO(){ return this.formatLocalISO(new Date()); },
    escapeHTML(s){
      return String(s==null?'':s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    },
    qs(name){ return new URLSearchParams(location.search).get(name); },
    addDays(dateStr, n){
      const d = new Date(dateStr + 'T00:00:00');
      d.setDate(d.getDate() + n);
      return this.formatLocalISO(d);
    },
    /* Returns the ISO date of the Monday of the week containing dateStr. */
    startOfWeek(dateStr){
      const d = new Date(dateStr + 'T00:00:00');
      const day = d.getDay(); // 0=Sun … 6=Sat
      const diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      return this.formatLocalISO(d);
    },
    /* Returns an array of "HH:MM" 30-min time slots for the clinic's opening
       hours on the given ISO date string, or [] if the clinic is closed that day. */
    timeSlotsForDate(dateStr){
      if(!dateStr) return [];
      const d = new Date(dateStr + 'T00:00:00');
      if(isNaN(d.getTime())) return [];
      const day = d.getDay(); // 0=Sun … 6=Sat
      let start, end;
      if(day === 6) return []; // Saturday — closed
      if(day === 0){ start = 8*60; end = 13*60; } // Sunday 8:00–13:00
      else { start = 8*60; end = 18*60; } // Mon–Fri 8:00–18:00
      const out = [];
      for(let m=start; m<end; m+=30){
        const hh = String(Math.floor(m/60)).padStart(2,'0');
        const mm = String(m%60).padStart(2,'0');
        out.push(`${hh}:${mm}`);
      }
      return out;
    },
    formatTimeDisplay(hhmm){
      const parts = String(hhmm||'').split(':');
      const h = parseInt(parts[0], 10), m = parseInt(parts[1], 10);
      if(isNaN(h) || isNaN(m)) return hhmm || '';
      const period = h < 12 ? 'AM' : 'PM';
      const h12 = (h % 12) === 0 ? 12 : (h % 12);
      return `${h12}:${String(m).padStart(2,'0')} ${period}`;
    },
    /* Validates a Malaysian phone number (mobile or landline), tolerant of
       spaces, dashes, parentheses and a +60/60/0 country-code prefix.
       Accepts e.g. "012-345 6789", "+6012-3456789", "04-2820811". */
    isValidMYPhone(raw){
      let s = String(raw||'').trim().replace(/[\s\-()]/g, '');
      if(!s) return false;
      if(s.startsWith('+60')) s = '0' + s.slice(3);
      else if(s.startsWith('60') && s.length > 9) s = '0' + s.slice(2);
      return /^0[1-9][0-9]{7,9}$/.test(s);
    }
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
    getDoctorWeek: (start) => request('/api/slots-week?start=' + encodeURIComponent(start)),
    getBookedTimes: (date) => request('/api/booked-times?date=' + encodeURIComponent(date)),
    createAppointment: (body) => request('/api/appointments', {method:'POST', body: JSON.stringify(body)}),

    login: (passcode) => request('/api/auth/login', {method:'POST', body: JSON.stringify({passcode})}),
    logout: () => request('/api/auth/logout', {method:'POST'}),
    checkAuth: () => request('/api/auth/check'),

    listAppointments: () => request('/api/staff/appointments'),
    confirmAppointment: (id) => request('/api/staff/appointments/' + id, {method:'PATCH', body: JSON.stringify({status:'confirmed'})}),
    setAppointmentStatus: (id, status) => request('/api/staff/appointments/' + id, {method:'PATCH', body: JSON.stringify({status})}),
    setSlot: (body) => request('/api/staff/slots', {method:'POST', body: JSON.stringify(body)}),
    getSlotsWeek: (start) => request('/api/staff/slots-week?start=' + encodeURIComponent(start)),
    saveSlotsWeek: (entries) => request('/api/staff/slots-week', {method:'POST', body: JSON.stringify({entries})}),
    publishNotice: (body) => request('/api/staff/notice', {method:'POST', body: JSON.stringify(body)}),
    clearNotice: () => request('/api/staff/notice', {method:'DELETE'}),
    getSheetLinks: () => request('/api/staff/sheet-links'),
    saveSheetLink: (key, url) => request('/api/staff/sheet-links', {method:'POST', body: JSON.stringify({key, url})}),
    getGuideline: () => request('/api/staff/guideline'),
    saveGuideline: (url) => request('/api/staff/guideline', {method:'POST', body: JSON.stringify({url})}),
    getRoster: () => request('/api/staff/roster'),
    saveRosterRow: (day_key, staff) => request('/api/staff/roster', {method:'POST', body: JSON.stringify({day_key, staff})})
  };

  /* Shared time-slot picker used by the online Booking form and the
     WhatsApp quick-contact popup. Renders buttons into `container`;
     already-booked times are disabled/greyed. */
  window.CJ_TIMEPICKER = {
    async render(container, dateStr, selectedTime, onSelect){
      const t = window.CJ_I18N.t;
      const U = window.CJ_UTIL;
      let times = U.timeSlotsForDate(dateStr);
      if(!times.length){
        container.innerHTML = `<div class="time-slot-empty">${t('time_closed')}</div>`;
        return;
      }
      /* Hide slots that have already started/passed when booking for today,
         so customers can't select a time earlier in the day than right now. */
      if(dateStr === U.todayISO()){
        const now = new Date();
        const nowHHMM = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
        times = times.filter(tm => tm > nowHHMM);
      }
      if(!times.length){
        container.innerHTML = `<div class="time-slot-empty">${t('time_pastToday')}</div>`;
        return;
      }
      let booked = [];
      try{
        const res = await window.CJ_API.getBookedTimes(dateStr);
        booked = res.times || [];
      }catch(e){ /* if this fails, just show all times as available */ }

      container.innerHTML = times.map(tm=>{
        const isBooked = booked.indexOf(tm) !== -1;
        const isSelected = tm === selectedTime;
        return `<button type="button" class="time-slot-btn${isSelected?' selected':''}" data-time="${tm}" ${isBooked?'disabled':''}>${window.CJ_UTIL.formatTimeDisplay(tm)}</button>`;
      }).join('');

      container.querySelectorAll('.time-slot-btn:not([disabled])').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          container.querySelectorAll('.time-slot-btn').forEach(b=>b.classList.remove('selected'));
          btn.classList.add('selected');
          onSelect(btn.getAttribute('data-time'));
        });
      });
    }
  };
})();
