window.CJ_PAGE_INIT = function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const DAY_KEYS = ['mon','tue','wed','thu','fri','sat','sun'];

  const weekLabelEl = document.getElementById('slots-week-label');
  const gridEl = document.getElementById('slots-grid');
  const statusEl = document.getElementById('slots-status');
  const prevBtn = document.getElementById('slots-prev-week');
  const nextBtn = document.getElementById('slots-next-week');
  const thisWeekBtn = document.getElementById('slots-this-week');
  const copyBtn = document.getElementById('slots-copy-prev');
  const clearBtn = document.getElementById('slots-clear-week');
  const saveBtn = document.getElementById('slots-save-week');

  let weekStart = U.startOfWeek(U.todayISO());
  let state = {}; // state[doctorId][date] = {morning, afternoon}
  let dirty = false;

  function weekDates(){
    const out = [];
    for(let i=0;i<7;i++) out.push(U.addDays(weekStart, i));
    return out;
  }

  function setStatus(msg, isError){
    statusEl.textContent = msg || '';
    statusEl.style.color = isError ? 'var(--red-500)' : 'var(--teal-600)';
  }

  function markDirty(){
    dirty = true;
    setStatus(t('slots_unsaved'));
  }

  function cellState(doctorId, date){
    return (state[doctorId] && state[doctorId][date]) || { morning:false, afternoon:false };
  }

  function cycle(cur){
    if(!cur.morning && !cur.afternoon) return { morning:true, afternoon:false };
    if(cur.morning && !cur.afternoon) return { morning:false, afternoon:true };
    if(!cur.morning && cur.afternoon) return { morning:true, afternoon:true };
    return { morning:false, afternoon:false };
  }

  function labelFor(cur){
    if(cur.morning && cur.afternoon) return t('slot_both');
    if(cur.morning) return t('slot_morning');
    if(cur.afternoon) return t('slot_afternoon');
    return t('slots_off');
  }

  function classFor(cur){
    if(cur.morning && cur.afternoon) return 'state-both';
    if(cur.morning) return 'state-am';
    if(cur.afternoon) return 'state-pm';
    return 'state-off';
  }

  async function load(){
    gridEl.innerHTML = `<div class="spinner-row">${t('loading')}</div>`;
    setStatus('');
    dirty = false;
    state = {};
    C.DOCTORS.forEach(d => { state[d.id] = {}; });
    try{
      const res = await window.CJ_API.getSlotsWeek(weekStart);
      (res.entries || []).forEach(e => {
        if(!state[e.doctorId]) state[e.doctorId] = {};
        state[e.doctorId][e.date] = { morning: !!e.morning, afternoon: !!e.afternoon };
      });
    }catch(e){ /* start from a blank week if this fails */ }
    render();
  }

  function render(){
    const dates = weekDates();
    weekLabelEl.textContent = dates[0] + ' – ' + dates[6];

    let html = '<div class="weekslot-table-wrap"><table class="weekslot-table"><thead><tr><th>' + U.escapeHTML(t('slots_doctor')) + '</th>';
    dates.forEach((date, i) => {
      html += '<th>' + U.escapeHTML(tr(C.DAY_LABELS[DAY_KEYS[i]])) + '<span class="weekslot-date">' + date.slice(5) + '</span></th>';
    });
    html += '</tr></thead><tbody>';

    C.DOCTORS.forEach(d => {
      html += '<tr><td class="weekslot-doc">' + d.photo + ' ' + U.escapeHTML(d.name) + '</td>';
      dates.forEach(date => {
        const cur = cellState(d.id, date);
        html += '<td><button type="button" class="weekslot-btn ' + classFor(cur) + '" data-doc="' + d.id + '" data-date="' + date + '">' + U.escapeHTML(labelFor(cur)) + '</button></td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    gridEl.innerHTML = html;

    gridEl.querySelectorAll('.weekslot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const doctorId = btn.getAttribute('data-doc');
        const date = btn.getAttribute('data-date');
        const cur = cellState(doctorId, date);
        const next = cycle(cur);
        if(!state[doctorId]) state[doctorId] = {};
        state[doctorId][date] = next;
        btn.className = 'weekslot-btn ' + classFor(next);
        btn.textContent = labelFor(next);
        markDirty();
      });
    });
  }

  async function saveWeek(){
    const dates = weekDates();
    const entries = [];
    C.DOCTORS.forEach(d => {
      dates.forEach(date => {
        const cur = cellState(d.id, date);
        entries.push({ doctorId: d.id, date, morning: cur.morning, afternoon: cur.afternoon });
      });
    });
    saveBtn.disabled = true;
    setStatus(t('slots_saving'));
    try{
      await window.CJ_API.saveSlotsWeek(entries);
      dirty = false;
      setStatus(t('slots_saved'));
    }catch(e){
      setStatus(t('booking_error'), true);
    }finally{
      saveBtn.disabled = false;
    }
  }

  async function copyPreviousWeek(){
    const prevStart = U.addDays(weekStart, -7);
    setStatus(t('loading'));
    try{
      const res = await window.CJ_API.getSlotsWeek(prevStart);
      const prevEntries = res.entries || [];
      C.DOCTORS.forEach(d => { if(!state[d.id]) state[d.id] = {}; });
      prevEntries.forEach(e => {
        const targetDate = U.addDays(e.date, 7);
        if(!state[e.doctorId]) state[e.doctorId] = {};
        state[e.doctorId][targetDate] = { morning: !!e.morning, afternoon: !!e.afternoon };
      });
      render();
      markDirty();
    }catch(e){
      setStatus(t('booking_error'), true);
    }
  }

  function clearWeek(){
    const dates = weekDates();
    C.DOCTORS.forEach(d => {
      if(!state[d.id]) state[d.id] = {};
      dates.forEach(date => { state[d.id][date] = { morning:false, afternoon:false }; });
    });
    render();
    markDirty();
  }

  function goToWeek(newStart){
    weekStart = newStart;
    load();
  }

  prevBtn.addEventListener('click', () => goToWeek(U.addDays(weekStart, -7)));
  nextBtn.addEventListener('click', () => goToWeek(U.addDays(weekStart, 7)));
  thisWeekBtn.addEventListener('click', () => goToWeek(U.startOfWeek(U.todayISO())));
  copyBtn.addEventListener('click', copyPreviousWeek);
  clearBtn.addEventListener('click', clearWeek);
  saveBtn.addEventListener('click', saveWeek);

  load();
};
