window.CJ_PAGE_INIT = function(){
  const C = window.CJ_CONTENT;
  const { t } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const dateInput = document.getElementById('slots-date');
  const list = document.getElementById('slots-list');
  dateInput.value = U.todayISO();

  async function loadAndRender(){
    const date = dateInput.value;
    list.innerHTML = `<div class="spinner-row">${t('loading')}</div>`;
    let slots = {};
    try{
      const res = await window.CJ_API.getSlots(date);
      slots = res.slots || {};
    }catch(e){ slots = {}; }
    render(date, slots);
  }

  function render(date, slots){
    list.innerHTML = C.DOCTORS.map(d=>{
      const cur = slots[d.id] || {morning:false, afternoon:false};
      const curLabel = cur.morning && cur.afternoon ? t('slot_both') : cur.morning ? t('slot_morning') : cur.afternoon ? t('slot_afternoon') : '—';
      return `<div class="slot-doc-row">
        <div class="who">${d.photo} ${d.name} <span style="font-weight:400;color:var(--ink-500);font-size:12.5px">(${t('slots_current')} ${curLabel})</span></div>
        <div class="slot-btns">
          <button class="slot-btn ${cur.morning && !cur.afternoon?'on':''}" data-doc="${d.id}" data-m="1" data-a="0">${t('slot_morning')}</button>
          <button class="slot-btn ${!cur.morning && cur.afternoon?'on':''}" data-doc="${d.id}" data-m="0" data-a="1">${t('slot_afternoon')}</button>
          <button class="slot-btn ${cur.morning && cur.afternoon?'on':''}" data-doc="${d.id}" data-m="1" data-a="1">${t('slot_both')}</button>
          <button class="slot-btn ${!cur.morning && !cur.afternoon?'on':''}" data-doc="${d.id}" data-m="0" data-a="0">Off</button>
        </div>
      </div>`;
    }).join('');

    list.querySelectorAll('.slot-btn').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const doctorId = btn.getAttribute('data-doc');
        const morning = btn.getAttribute('data-m') === '1';
        const afternoon = btn.getAttribute('data-a') === '1';
        try{
          await window.CJ_API.setSlot({date, doctorId, morning, afternoon});
          const res = await window.CJ_API.getSlots(date);
          render(date, res.slots || {});
        }catch(e){
          alert(t('booking_error'));
        }
      });
    });
  }

  dateInput.addEventListener('change', loadAndRender);
  loadAndRender();
};
