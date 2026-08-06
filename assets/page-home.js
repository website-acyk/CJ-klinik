/* Dynamic content for index.html — called by customer-chrome.js after
   header/footer render and static i18n are applied. */
window.CJ_PAGE_INIT = function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;

  document.getElementById('hero-loc-pill').href = C.googleMapsUrl();
  document.getElementById('hero-loc-pill').innerHTML = `📍 ${tr(C.CLINIC_LOCATION)} · ${t('view_on_map')} <span class="map-arrow">↗</span>`;

  document.getElementById('services-grid').innerHTML = C.SERVICES.map(s=>`
    <div class="card service-card reveal">
      <div class="service-icon">${s.icon}</div>
      <h3>${tr(s.name)}</h3>
      <p>${tr(s.desc)}</p>
    </div>`).join('');

  document.getElementById('full-service-grid').innerHTML = C.SERVICE_LIST_FULL.map(item=>
    `<div class="full-service-item"><span class="chk">✓</span>${tr(item)}</div>`).join('');

  document.getElementById('facility-list').innerHTML = C.FACILITIES.map(f=>
    `<div class="facility-item reveal"><span class="ico-wrap"><span class="ico">${f.icon}</span></span>${tr(f.name)}</div>`).join('');

  document.getElementById('healthtip-grid').innerHTML = C.HEALTH_TIPS.map(ht=>`
    <div class="card healthtip-card reveal">
      ${ht.img ? `<div class="ht-photo"><img src="${ht.img}" alt="${tr(ht.title)}" loading="lazy"></div>` : `<div class="ht-icon">${ht.icon}</div>`}
      <h3>${tr(ht.title)}</h3>
      <p>${tr(ht.text)}</p>
    </div>`).join('');

  document.getElementById('trust-panel').innerHTML = C.PANEL_ADMINISTRATORS.map(p=>`<span class="trust-badge">${p}</span>`).join('');
  const corporateBadges = C.CORPORATE_CLIENTS.map(cl=>`<span class="trust-badge">${cl}</span>`).join('')
    + ` <span class="trust-badge" style="background:transparent;border-style:dashed">${t('trusted_andMore')}</span>`;
  document.getElementById('trust-corporate').innerHTML = corporateBadges + corporateBadges;

  const addrLink = document.getElementById('visit-address-link');
  addrLink.href = C.googleMapsUrl();
  addrLink.innerHTML = `${tr(C.CLINIC_ADDRESS_FULL)} <span class="map-arrow">↗</span>`;

  const phoneLink = document.getElementById('visit-phone-link');
  phoneLink.href = C.CLINIC_PHONE_TEL;
  phoneLink.textContent = C.CLINIC_PHONE_DISPLAY;

  const waLink = document.getElementById('visit-whatsapp-link');
  waLink.href = C.CLINIC_WHATSAPP_LINK;
  waLink.textContent = C.CLINIC_WHATSAPP_DISPLAY;

  const emailLink = document.getElementById('visit-email-link');
  emailLink.href = 'mailto:' + C.CLINIC_EMAIL;
  emailLink.textContent = C.CLINIC_EMAIL;

  document.getElementById('hours-body').innerHTML = C.OPENING_HOURS.map(o=>
    `<tr><td>${tr(o.day)}</td><td style="text-align:right;font-weight:700">${typeof o.hours==='string'?o.hours:tr(o.hours)}</td></tr>`).join('');
};
