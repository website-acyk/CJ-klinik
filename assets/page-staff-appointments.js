window.CJ_PAGE_INIT = async function(){
  const { t } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const container = document.getElementById('appts-container');
  container.innerHTML = `<div class="spinner-row">${t('loading')}</div>`;

  async function load(){
    let appointments = [];
    try{
      const res = await window.CJ_API.listAppointments();
      appointments = res.appointments || [];
    }catch(e){
      container.innerHTML = `<div class="card">${t('booking_error')}</div>`;
      return;
    }
    if(!appointments.length){
      container.innerHTML = `<div class="card">${t('appts_empty')}</div>`;
      return;
    }
    container.innerHTML = `<div class="card" style="padding:0;overflow:auto">
      <table>
        <thead><tr>
          <th>${t('col_name')}</th><th>${t('col_contact')}</th><th>${t('col_date')}</th><th>${t('col_slot')}</th><th>${t('col_service')}</th><th>${t('col_doctor')}</th><th>${t('col_status')}</th><th></th>
        </tr></thead>
        <tbody>
          ${appointments.map(a=>`<tr>
            <td>${U.escapeHTML(a.name)}</td>
            <td>${U.escapeHTML(a.phone)}</td>
            <td>${U.escapeHTML(a.date)}</td>
            <td>${t('slot_'+a.slot) || a.slot}</td>
            <td>${U.escapeHTML(a.service)}</td>
            <td>${U.escapeHTML(a.doctor)}</td>
            <td>${a.status==='new' ? `<span class="status-new">${t('status_new')}</span>` : `<span class="status-confirmed">${t('status_confirmed')}</span>`}</td>
            <td>${a.status==='new' ? `<button class="btn btn-outline btn-sm" data-id="${a.id}">${t('appts_confirm')}</button>` : ''}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

    container.querySelectorAll('button[data-id]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        try{
          await window.CJ_API.confirmAppointment(btn.getAttribute('data-id'));
          await load();
          if(window.CJ_STAFF_CHROME) window.CJ_STAFF_CHROME.refreshApptBadge();
        }catch(e){ alert(t('booking_error')); }
      });
    });
  }

  load();
};
