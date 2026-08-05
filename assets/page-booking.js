window.CJ_PAGE_INIT = function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const preselectDoctorId = U.qs('doctor');

  document.getElementById('booking-date').value = U.todayISO();
  document.getElementById('booking-slot').innerHTML = `
    <option value="morning">${t('slot_morning')}</option>
    <option value="afternoon">${t('slot_afternoon')}</option>
    <option value="both">${t('slot_both')}</option>`;
  document.getElementById('booking-service').innerHTML = C.SERVICES.map(s=>
    `<option value="${tr(s.name)}">${tr(s.name)}</option>`).join('');
  document.getElementById('booking-doctor').innerHTML =
    `<option value="${t('booking_noPref')}">${t('booking_noPref')}</option>` +
    C.DOCTORS.map(d=>`<option value="${d.name}" ${preselectDoctorId===d.id?'selected':''}>${d.name}</option>`).join('');
  document.getElementById('booking-submit-btn').textContent = t('booking_submit');

  document.getElementById('booking-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      name: fd.get('name'), phone: fd.get('phone'), date: fd.get('date'),
      slot: fd.get('slot'), service: fd.get('service'), doctor: fd.get('doctor'), notes: fd.get('notes')
    };
    const msgBox = document.getElementById('booking-message');
    const submitBtn = document.getElementById('booking-submit-btn');
    submitBtn.disabled = true;
    try{
      await window.CJ_API.createAppointment(body);
      msgBox.innerHTML = `<div class="success-box">✅ ${t('booking_success')}</div>`;
      e.target.reset();
      document.getElementById('booking-date').value = U.todayISO();
      window.scrollTo({top:0, behavior:'smooth'});
    }catch(err){
      msgBox.innerHTML = `<div class="error-box">⚠️ ${t('booking_error')}</div>`;
    }finally{
      submitBtn.disabled = false;
    }
  });
};
