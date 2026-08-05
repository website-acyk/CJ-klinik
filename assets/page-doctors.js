window.CJ_PAGE_INIT = function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;

  document.getElementById('doctors-grid').innerHTML = C.DOCTORS.map(d=>`
    <div class="card doctor-card">
      <div class="doctor-photo">${d.photo}</div>
      <div>
        <h3>${d.name}</h3>
        <div class="doctor-meta">${tr(d.role)}</div>
        <div>${tr(d.specialties).map(sp=>`<span class="tag">${sp}</span>`).join('')}</div>
        <p class="bio">${tr(d.bio)}</p>
        <a class="btn btn-outline btn-sm" href="/booking?doctor=${encodeURIComponent(d.id)}">${t('doctors_bookBtn')}</a>
      </div>
    </div>`).join('');
};
