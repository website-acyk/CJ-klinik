window.CJ_PAGE_INIT = function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;
  const U = window.CJ_UTIL;
  const preselectDoctorId = U.qs('doctor');

  const dateInput = document.getElementById('booking-date');
  const timeGrid = document.getElementById('booking-time-grid');
  const timeValueInput = document.getElementById('booking-time-value');
  let selectedTime = '';

  function refreshTimeGrid(){
    selectedTime = '';
    timeValueInput.value = '';
    window.CJ_TIMEPICKER.render(timeGrid, dateInput.value, selectedTime, (tm)=>{
      selectedTime = tm;
      timeValueInput.value = tm;
    });
  }

  dateInput.value = U.todayISO();
  dateInput.min = U.todayISO();
  dateInput.addEventListener('change', refreshTimeGrid);
  refreshTimeGrid();

  document.getElementById('booking-service').innerHTML = C.SERVICES.map(s=>
    `<option value="${tr(s.name)}">${tr(s.name)}</option>`).join('');
  document.getElementById('booking-doctor').innerHTML =
    `<option value="${t('booking_noPref')}">${t('booking_noPref')}</option>` +
    C.DOCTORS.map(d=>`<option value="${d.name}" ${preselectDoctorId===d.id?'selected':''}>${d.name}</option>`).join('');
  document.getElementById('booking-submit-btn').textContent = t('booking_submit');

  document.getElementById('booking-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const msgBox = document.getElementById('booking-message');
    if(!selectedTime){
      msgBox.innerHTML = `<div class="error-box">⚠️ ${t('time_selectPrompt')}</div>`;
      return;
    }
    const fd = new FormData(e.target);
    const hour = parseInt(selectedTime.split(':')[0], 10);
    const body = {
      name: fd.get('name'), phone: fd.get('phone'), date: fd.get('date'),
      slot: hour < 13 ? 'morning' : 'afternoon', time: selectedTime,
      service: fd.get('service'), doctor: fd.get('doctor'), notes: fd.get('notes')
    };
    const submitBtn = document.getElementById('booking-submit-btn');
    submitBtn.disabled = true;
    try{
      await window.CJ_API.createAppointment(body);
      msgBox.innerHTML = `<div class="success-box">✅ ${t('booking_success')}</div>`;
      e.target.reset();
      dateInput.value = U.todayISO();
      refreshTimeGrid();
      window.scrollTo({top:0, behavior:'smooth'});
    }catch(err){
      msgBox.innerHTML = `<div class="error-box">⚠️ ${t('booking_error')}</div>`;
    }finally{
      submitBtn.disabled = false;
    }
  });
};
