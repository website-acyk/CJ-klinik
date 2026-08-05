window.CJ_PAGE_INIT = async function(){
  const C = window.CJ_CONTENT;
  const { t } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const today = U.todayISO();

  document.getElementById('duty-sub').textContent = t('duty_subtitle') + ' (' + today + ')';
  document.getElementById('duty-morning').innerHTML = `<div class="spinner-row">${t('loading')}</div>`;
  document.getElementById('duty-afternoon').innerHTML = '';

  function chipsFor(slots, slotKey){
    const docs = C.DOCTORS.filter(d => slots[d.id] && slots[d.id][slotKey]);
    if(!docs.length) return `<div style="color:var(--ink-500);padding:20px 0">${t('duty_tbc')}</div>`;
    return docs.map(d=>`<div class="duty-doc-chip">${d.photo} ${d.name}</div>`).join('');
  }

  try{
    const { slots } = await window.CJ_API.getSlots(today);
    document.getElementById('duty-morning').innerHTML = chipsFor(slots, 'morning');
    document.getElementById('duty-afternoon').innerHTML = chipsFor(slots, 'afternoon');
  }catch(e){
    document.getElementById('duty-morning').innerHTML = `<div class="error-box">${t('booking_error')}</div>`;
    document.getElementById('duty-afternoon').innerHTML = '';
  }
};
