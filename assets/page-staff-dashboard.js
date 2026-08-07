window.CJ_PAGE_INIT = async function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const today = U.todayISO();
  const DOW_KEYS = ['sun','mon','tue','wed','thu','fri','sat'];
  const todayKey = DOW_KEYS[new Date(today + 'T00:00:00').getDay()];

  /* ---- Greeting hero ---- */
  const hour = new Date().getHours();
  const greetKey = hour < 12 ? 'dash_greetMorning' : hour < 18 ? 'dash_greetAfternoon' : 'dash_greetEvening';
  document.getElementById('dash-greeting').textContent = t(greetKey) + '! ' + t('dash_overview');
  document.getElementById('dash-date').textContent = tr(C.DAY_LABELS[todayKey]) + ' · ' + today;

  document.getElementById('dash-doctor-count').textContent = C.DOCTORS.length;

  /* ---- Open/closed status badge + notice-aware stat tile ---- */
  const statusBadge = document.getElementById('dash-status-badge');
  const noticeIcon = document.getElementById('dash-notice-icon');
  const noticeLabel = document.getElementById('dash-notice-label');
  const noticeTile = document.getElementById('dash-notice-tile');
  try{
    const { notice } = await window.CJ_API.getNotice();
    if(notice){
      const tmpl = C.NOTICE_TEMPLATES.find(n=>n.type===notice.type);
      const label = tmpl ? tr(tmpl.label) : notice.type;
      statusBadge.textContent = '⚠️ ' + label;
      statusBadge.classList.add('warn');
      noticeIcon.textContent = '⚠️';
      noticeLabel.textContent = label;
      noticeTile.classList.remove('accent-green');
      noticeTile.classList.add('accent-amber');
    } else {
      const closedToday = U.timeSlotsForDate(today).length === 0;
      statusBadge.textContent = closedToday ? ('🚪 ' + t('dash_closedToday')) : ('✅ ' + t('dash_openToday'));
      if(closedToday) statusBadge.classList.add('warn');
      noticeIcon.textContent = '✅';
      noticeLabel.textContent = t('dash_noNotice');
    }
  }catch(e){
    statusBadge.textContent = t('dash_openToday');
    noticeIcon.textContent = '?';
    noticeLabel.textContent = t('dash_noNotice');
  }

  /* ---- Appointment stats + recent list ---- */
  const recentEl = document.getElementById('dash-recent-appts');
  try{
    const { appointments } = await window.CJ_API.listAppointments();
    document.getElementById('dash-new-appts').textContent = appointments.filter(a=>a.status==='new').length;

    const weekStart = U.startOfWeek(today);
    const weekEnd = U.addDays(weekStart, 6);
    document.getElementById('dash-week-appts').textContent = appointments.filter(a=> a.date >= weekStart && a.date <= weekEnd).length;

    const recent = appointments.slice(0, 5);
    if(!recent.length){
      recentEl.innerHTML = `<div style="color:var(--ink-500);padding:8px 0">${t('appts_empty')}</div>`;
    } else {
      recentEl.innerHTML = recent.map(a=>`
        <div class="dash-recent-row">
          <div>
            <div class="dash-recent-name">${U.escapeHTML(a.name)}</div>
            <div class="dash-recent-meta">${U.escapeHTML(a.date)} · ${t('slot_'+a.slot) || U.escapeHTML(a.slot)} · ${U.escapeHTML(a.service)}</div>
          </div>
          <span class="${a.status==='new' ? 'status-new' : 'status-confirmed'}">${a.status==='new' ? t('status_new') : t('status_confirmed')}</span>
        </div>
      `).join('');
    }
  }catch(e){
    document.getElementById('dash-new-appts').textContent = '–';
    document.getElementById('dash-week-appts').textContent = '–';
    recentEl.innerHTML = `<div class="error-box">${t('booking_error')}</div>`;
  }

  /* ---- Today's Duty Doctor mini widget ---- */
  const dutyEl = document.getElementById('dash-duty-widget');
  try{
    const { slots } = await window.CJ_API.getSlots(today);
    function chipsFor(slotKey){
      const docs = C.DOCTORS.filter(d => slots[d.id] && slots[d.id][slotKey]);
      if(!docs.length) return `<span style="color:var(--ink-500);font-size:13px">${t('duty_tbc')}</span>`;
      return docs.map(d=>`<span class="duty-doc-chip">${d.photo} ${U.escapeHTML(d.name)}</span>`).join('');
    }
    dutyEl.innerHTML = `
      <div class="dash-duty-mini-row"><span class="dash-duty-mini-label">☀️ ${t('duty_morning')}</span></div>
      <div style="margin-bottom:14px">${chipsFor('morning')}</div>
      <div class="dash-duty-mini-row"><span class="dash-duty-mini-label">🌙 ${t('duty_afternoon')}</span></div>
      <div>${chipsFor('afternoon')}</div>
    `;
  }catch(e){
    dutyEl.innerHTML = `<div class="error-box">${t('booking_error')}</div>`;
  }

  /* ---- Staff on duty today mini widget ---- */
  const rosterEl = document.getElementById('dash-roster-widget');
  try{
    const { roster } = await window.CJ_API.getRoster();
    const row = (roster || []).find(r => r.day_key === todayKey);
    const staffName = row && row.staff ? U.escapeHTML(row.staff) : t('dash_noRoster');
    rosterEl.innerHTML = `
      <div class="dash-roster-today">
        <div class="icon-wrap">🧑‍⚕️</div>
        <div>
          <div style="font-weight:700;font-size:15px">${staffName}</div>
          <div style="font-size:12px;color:var(--ink-500)">${tr(C.DAY_LABELS[todayKey])}</div>
        </div>
      </div>
    `;
  }catch(e){
    rosterEl.innerHTML = `<div class="error-box">${t('booking_error')}</div>`;
  }
};
