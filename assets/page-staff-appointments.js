window.CJ_PAGE_INIT = async function(){
  const { t } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const container = document.getElementById('appts-container');
  container.innerHTML = `<div class="spinner-row">${t('loading')}</div>`;

  let allAppointments = [];
  let searchTerm = '';
  let statusFilter = 'all';

  function statusBadge(status){
    if(status === 'confirmed') return `<span class="status-confirmed">${t('status_confirmed')}</span>`;
    if(status === 'declined') return `<span class="status-declined">${t('status_declined')}</span>`;
    return `<span class="status-new">${t('status_new')}</span>`;
  }

  function matchesFilters(a){
    if(statusFilter !== 'all' && a.status !== statusFilter) return false;
    if(searchTerm){
      const hay = [a.name, a.phone, a.date, a.service, a.doctor].join(' ').toLowerCase();
      if(hay.indexOf(searchTerm) === -1) return false;
    }
    return true;
  }

  function renderTable(){
    const tableSlot = document.getElementById('appts-table-slot');
    if(!allAppointments.length){
      tableSlot.innerHTML = `<div class="card">${t('appts_empty')}</div>`;
      return;
    }
    const filtered = allAppointments.filter(matchesFilters);
    if(!filtered.length){
      tableSlot.innerHTML = `<div class="card">${t('appts_noResults')}</div>`;
      return;
    }
    tableSlot.innerHTML = `<div class="card" style="padding:0;overflow:auto">
      <table>
        <thead><tr>
          <th>${t('col_name')}</th><th>${t('col_contact')}</th><th>${t('col_date')}</th><th>${t('col_time')}</th><th>${t('col_slot')}</th><th>${t('col_service')}</th><th>${t('col_doctor')}</th><th>${t('col_status')}</th><th></th>
        </tr></thead>
        <tbody>
          ${filtered.map(a=>`<tr>
            <td>${U.escapeHTML(a.name)}</td>
            <td>${U.escapeHTML(a.phone)}</td>
            <td>${U.escapeHTML(a.date)}</td>
            <td>${a.time ? U.escapeHTML(window.CJ_UTIL.formatTimeDisplay(a.time)) : '-'}</td>
            <td>${t('slot_'+a.slot) || a.slot}</td>
            <td>${U.escapeHTML(a.service)}</td>
            <td>${U.escapeHTML(a.doctor)}</td>
            <td>${statusBadge(a.status)}</td>
            <td>${a.status==='new' ? `<div class="appts-row-actions"><button class="btn btn-outline btn-sm" data-action="confirmed" data-id="${a.id}">${t('appts_confirm')}</button><button class="btn btn-outline btn-sm" data-action="declined" data-id="${a.id}">${t('appts_decline')}</button></div>` : ''}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

    tableSlot.querySelectorAll('button[data-action]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const id = btn.getAttribute('data-id');
        const newStatus = btn.getAttribute('data-action');
        btn.disabled = true;
        try{
          await window.CJ_API.setAppointmentStatus(id, newStatus);
          const a = allAppointments.find(x=>String(x.id)===String(id));
          if(a) a.status = newStatus;
          renderTable();
          if(window.CJ_STAFF_CHROME) window.CJ_STAFF_CHROME.refreshApptBadge();
        }catch(e){ alert(t('booking_error')); btn.disabled = false; }
      });
    });
  }

  async function load(){
    try{
      const res = await window.CJ_API.listAppointments();
      allAppointments = res.appointments || [];
    }catch(e){
      container.innerHTML = `<div class="card">${t('booking_error')}</div>`;
      return;
    }
    if(!allAppointments.length){
      container.innerHTML = `<div class="card">${t('appts_empty')}</div>`;
      return;
    }
    container.innerHTML = `
      <div class="appts-toolbar">
        <input type="text" id="appts-search" class="appts-search-input" placeholder="${t('appts_search_placeholder')}">
        <select id="appts-status-filter" class="appts-status-select">
          <option value="all">${t('appts_filterAll')}</option>
          <option value="new">${t('appts_filterNew')}</option>
          <option value="confirmed">${t('appts_filterConfirmed')}</option>
          <option value="declined">${t('appts_filterDeclined')}</option>
        </select>
      </div>
      <div id="appts-table-slot"></div>
    `;
    document.getElementById('appts-search').addEventListener('input', (e)=>{
      searchTerm = e.target.value.trim().toLowerCase();
      renderTable();
    });
    document.getElementById('appts-status-filter').addEventListener('change', (e)=>{
      statusFilter = e.target.value;
      renderTable();
    });
    renderTable();
  }

  load();
};
