window.CJ_PAGE_INIT = async function(){
  const C = window.CJ_CONTENT;
  const { t, tr } = window.CJ_I18N;
  const U = window.CJ_UTIL;

  document.getElementById('guideline-checklist').innerHTML = C.GUIDELINE_CHECKLIST.map((item,i)=>
    `<div class="checklist-item"><div class="checklist-num">${i+1}</div><div>${tr(item)}</div></div>`).join('');

  const section = document.getElementById('guideline-doc-section');
  section.innerHTML = `<div class="spinner-row">${t('loading')}</div>`;

  function renderDocSection(url){
    if(url){
      section.innerHTML = `<div class="card">
        <p>✅ ${t('guidelines_linked')}</p>
        <a class="btn btn-primary" href="${U.escapeHTML(url)}" target="_blank" rel="noopener">${t('guidelines_openBtn')}</a>
        <div class="sheet-link-row" style="margin-top:14px">
          <input type="text" id="guideline-url-input" data-i18n-placeholder="guidelines_docPlaceholder" value="${U.escapeHTML(url)}">
          <button class="btn btn-outline btn-sm" id="guideline-save-btn">${t('guidelines_saveBtn')}</button>
        </div>
      </div>`;
    } else {
      section.innerHTML = `<div class="doc-card-missing">
        <div style="font-size:34px;margin-bottom:8px">📄</div>
        <p><strong>${t('guidelines_docMissing')}</strong></p>
        <p style="font-size:13px">${t('guidelines_docNote')}</p>
        <div class="sheet-link-row" style="max-width:420px;margin:14px auto 0">
          <input type="text" id="guideline-url-input" placeholder="${t('guidelines_docPlaceholder')}">
          <button class="btn btn-primary btn-sm" id="guideline-save-btn">${t('guidelines_saveBtn')}</button>
        </div>
      </div>`;
    }
    document.getElementById('guideline-save-btn').addEventListener('click', async ()=>{
      const input = document.getElementById('guideline-url-input');
      const newUrl = input.value.trim();
      try{
        await window.CJ_API.saveGuideline(newUrl);
        renderDocSection(newUrl);
      }catch(e){
        alert(t('booking_error'));
      }
    });
  }

  try{
    const { url } = await window.CJ_API.getGuideline();
    renderDocSection(url);
  }catch(e){
    renderDocSection('');
  }
};
