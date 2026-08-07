window.CJ_PAGE_INIT = async function(){
const C = window.CJ_CONTENT;
const { t, tr } = window.CJ_I18N;
const U = window.CJ_UTIL;
const today = U.todayISO();

document.getElementById('duty-sub').textContent = t('duty_subtitle') + ' (' + today + ')';
document.getElementById('duty-morning').innerHTML = `<div class="spinner-row">${t('loading')}</div>`;
document.getElementById('duty-afternoon').innerHTML = '';

function chipsFor(slots, slotKey){
const docs = C.DOCTORS.filter(d => slots[d.id] && slots[d.id][slotKey]);
if(!docs.length) return `<div style="color:var(--ink-500);padding:20px 0">${t('duty_tbc')}</div>`;
return docs.map(d=>`<div class="duty-doc-chip">${d.photo} ${d.name}</div>`).join('');
}

try{
const { slots } = await window.CJ_API.getSlots(today);
document.getElementById('duty-morning').innerHTML = chipsFor(slots, 'morning');
document.getElementById('duty-afternoon').innerHTML = chipsFor(slots, 'afternoon');
}catch(e){
document.getElementById('duty-morning').innerHTML = `<div class="error-box">${t('booking_error')}</div>`;
document.getElementById('duty-afternoon').innerHTML = '';
}

/* ---- This week's schedule (read-only), with today highlighted ---- */
const DAY_KEYS = ['mon','tue','wed','thu','fri','sat','sun'];
const weekGrid = document.getElementById('duty-week-grid');
const weekLabelEl = document.getElementById('duty-week-label');
const prevBtn = document.getElementById('duty-prev-week');
const nextBtn = document.getElementById('duty-next-week');
const thisWeekBtn = document.getElementById('duty-this-week');
let weekStart = U.startOfWeek(today);

const legendEl = document.getElementById('duty-week-legend');
if(legendEl){
legendEl.innerHTML = [
{ cls:'state-off', label:t('slots_off') },
{ cls:'state-am', label:t('slot_morning') },
{ cls:'state-pm', label:t('slot_afternoon') },
{ cls:'state-both', label:t('slot_both') }
].map(i=>`<div class="duty-week-legend-item"><span class="duty-week-legend-swatch ${i.cls}"></span>${i.label}</div>`).join('');
}

function weekDates(){
const out = [];
for(let i=0;i<7;i++) out.push(U.addDays(weekStart, i));
return out;
}

function stateFor(entries, doctorId, date){
const e = entries.find(x => x.doctorId === doctorId && x.date === date);
if(!e) return { morning:false, afternoon:false };
return { morning: !!e.morning, afternoon: !!e.afternoon };
}

function labelFor(st){
if(st.morning && st.afternoon) return t('slot_both');
if(st.morning) return t('slot_morning');
if(st.afternoon) return t('slot_afternoon');
return t('slots_off');
}

function classFor(st){
if(st.morning && st.afternoon) return 'state-both';
if(st.morning) return 'state-am';
if(st.afternoon) return 'state-pm';
return 'state-off';
}

async function loadWeek(){
weekGrid.innerHTML = `<tr><td colspan="8"><div class="spinner-row">${t('loading')}</div></td></tr>`;
const dates = weekDates();
weekLabelEl.textContent = dates[0] + ' – ' + dates[6];

let entries = [];
try{
const res = await window.CJ_API.getDoctorWeek(weekStart);
entries = res.entries || [];
}catch(e){
weekGrid.innerHTML = `<tr><td colspan="8"><div class="error-box">${t('booking_error')}</div></td></tr>`;
return;
}

const headerCells = dates.map((d,i)=>{
const isToday = d === today;
return `<th class="${isToday?'duty-week-today':''}">${tr(C.DAY_LABELS[DAY_KEYS[i]])}<span class="weekslot-date">${d}</span>${isToday?`<span class="duty-today-pill">${t('duty_todayBadge')}</span>`:''}</th>`;
}).join('');

const bodyRows = C.DOCTORS.map(doc=>{
const cells = dates.map(d=>{
const isToday = d === today;
const st = stateFor(entries, doc.id, d);
return `<td class="${isToday?'duty-week-today':''}"><span class="weekslot-btn ${classFor(st)}">${labelFor(st)}</span></td>`;
}).join('');
return `<tr><td class="weekslot-doc"><span class="duty-doc-avatar">${doc.photo}</span>${doc.name}</td>${cells}</tr>`;
}).join('');

weekGrid.innerHTML = `<thead><tr><th></th>${headerCells}</tr></thead><tbody>${bodyRows}</tbody>`;
}

prevBtn.addEventListener('click', ()=>{ weekStart = U.addDays(weekStart, -7); loadWeek(); });
nextBtn.addEventListener('click', ()=>{ weekStart = U.addDays(weekStart, 7); loadWeek(); });
thisWeekBtn.addEventListener('click', ()=>{ weekStart = U.startOfWeek(today); loadWeek(); });

loadWeek();
};
