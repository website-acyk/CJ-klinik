window.CJ_PAGE_INIT = async function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const grid = document.getElementById('sheets-grid');
  grid.innerHTML = `<div class="spinner-row">${t('loading')}</div>`;

  let links = {};
  try{
    const res = await window.CJ_API.getSheetLinks();
    links = res.links || {};
  }catch(e){ links = {}; }

  grid.innerHTML = C.SHEET_CONFIG.map(sc=>`
    <div class="card sheet-card" style="align-items:flex-start">
      <div class="s-icon">${sc.icon}</div>
      <div class="s-body">
        <strong>${tr(sc.label)}</strong>
        <div style="font-size:12.5px;color:var(--ink-500);margin:2px 0 8px">${tr(sc.desc)}</div>
        <div class="sheet-link-row">
          <input type="text" id="sheet-input-${sc.key}" placeholder="${t('sheets_placeholder')}" value="${U.escapeHTML(links[sc.key]||'')}">
          <button class="btn btn-outline btn-sm" data-key="${sc.key}">${t('sheets_saveBtn')}</button>
        </div>
        <div id="sheet-open-${sc.key}">${links[sc.key] ? `<a class="btn btn-primary btn-sm" style="margin-top:8px;display:inline-block" href="${U.escapeHTML(links[sc.key])}" target="_blank" rel="noopener">${t('sheets_openBtn')}</a>` : `<div style="margin-top:8px;font-size:12px;color:var(--ink-300)">${t('sheets_notSet')}</div>`}</div>
      </div>
    </div>`).join('');

  grid.querySelectorAll('button[data-key]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const key = btn.getAttribute('data-key');
      const input = document.getElementById('sheet-input-'+key);
      const url = input.value.trim();
      try{
        await window.CJ_API.saveSheetLink(key, url);
        document.getElementById('sheet-open-'+key).innerHTML = url
          ? `<a class="btn btn-primary btn-sm" style="margin-top:8px;display:inline-block" href="${U.escapeHTML(url)}" target="_blank" rel="noopener">${t('sheets_openBtn')}</a>`
          : `<div style="margin-top:8px;font-size:12px;color:var(--ink-300)">${t('sheets_notSet')}</div>`;
      }catch(e){
        alert(t('booking_error'));
      }
    });
  });
};
