window.CJ_PAGE_INIT = async function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const msgBox = document.getElementById('notice-message-input');
  let pendingType = 'rest';

  document.getElementById('template-row').innerHTML = C.NOTICE_TEMPLATES.map(nt=>
    `<button class="template-btn" data-type="${nt.type}">${nt.icon} ${tr(nt.label)}</button>`).join('');

  document.querySelectorAll('.template-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const tmpl = C.NOTICE_TEMPLATES.find(n=>n.type===btn.getAttribute('data-type'));
      if(tmpl){ msgBox.value = tr(tmpl.message); pendingType = tmpl.type; }
    });
  });

  async function renderActive(){
    const slot = document.getElementById('notice-active-slot');
    try{
      const { notice } = await window.CJ_API.getNotice();
      if(notice){
        const tmpl = C.NOTICE_TEMPLATES.find(n=>n.type===notice.type);
        pendingType = notice.type;
        msgBox.value = notice.message;
        slot.innerHTML = `<div class="notice-active-card ${notice.type==='closed'?'notice-closed':'notice-rest'}"><div>${tmpl?tmpl.icon:'📢'} <strong>${t('notices_activeNow')}</strong><br>${U.escapeHTML(notice.message)}</div></div>`;
      } else {
        slot.innerHTML = `<p class="note" style="margin-top:14px">${t('notices_none')}</p>`;
      }
    }catch(e){
      slot.innerHTML = `<p class="note" style="margin-top:14px">${t('notices_none')}</p>`;
    }
  }

  document.getElementById('publish-btn').addEventListener('click', async ()=>{
    const message = msgBox.value.trim();
    if(!message) return;
    try{
      await window.CJ_API.publishNotice({type: pendingType, message});
      await renderActive();
    }catch(e){ alert(t('booking_error')); }
  });

  document.getElementById('clear-btn').addEventListener('click', async ()=>{
    try{
      await window.CJ_API.clearNotice();
      msgBox.value = '';
      await renderActive();
    }catch(e){ alert(t('booking_error')); }
  });

  renderActive();
};
