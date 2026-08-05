window.CJ_PAGE_INIT = async function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;

  document.getElementById('dash-doctor-count').textContent = C.DOCTORS.length;

  try{
    const { appointments } = await window.CJ_API.listAppointments();
    document.getElementById('dash-new-appts').textContent = appointments.filter(a=>a.status==='new').length;
  }catch(e){
    document.getElementById('dash-new-appts').textContent = '–';
  }

  try{
    const { notice } = await window.CJ_API.getNotice();
    if(notice){
      const tmpl = C.NOTICE_TEMPLATES.find(n=>n.type===notice.type);
      document.getElementById('dash-notice-icon').textContent = '⚠️';
      document.getElementById('dash-notice-label').textContent = tmpl ? tr(tmpl.label) : notice.type;
    } else {
      document.getElementById('dash-notice-icon').textContent = '✅';
      document.getElementById('dash-notice-label').textContent = t('dash_noNotice');
    }
  }catch(e){
    document.getElementById('dash-notice-icon').textContent = '?';
    document.getElementById('dash-notice-label').textContent = t('dash_noNotice');
  }
};
