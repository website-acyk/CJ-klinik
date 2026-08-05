window.CJ_PAGE_INIT = async function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const body = document.getElementById('roster-body');
  body.innerHTML = `<tr><td colspan="2"><div class="spinner-row">${t('loading')}</div></td></tr>`;

  let roster = [];
  try{
    const res = await window.CJ_API.getRoster();
    roster = res.roster || [];
  }catch(e){ roster = []; }

  body.innerHTML = roster.map(row=>`<tr>
    <td><strong>${tr(C.DAY_LABELS[row.day_key]) || row.day_key}</strong></td>
    <td class="roster-cell"><input type="text" value="${U.escapeHTML(row.staff||'')}" data-day="${row.day_key}"></td>
  </tr>`).join('');

  let saveTimer = null;
  body.querySelectorAll('input[data-day]').forEach(input=>{
    input.addEventListener('change', ()=>{
      clearTimeout(saveTimer);
      const day_key = input.getAttribute('data-day');
      const staff = input.value;
      window.CJ_API.saveRosterRow(day_key, staff).catch(()=>{ alert(t('booking_error')); });
    });
  });
};
