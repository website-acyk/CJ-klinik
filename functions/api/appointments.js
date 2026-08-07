import { jsonResponse } from '../_utils.js';

function clean(v, maxLen) {
  return String(v == null ? '' : v).trim().slice(0, maxLen);
}

// Accepts Malaysian mobile/landline numbers, tolerant of spaces, dashes,
// parentheses and a +60/60/0 country-code prefix. Mirrors the client-side
// check in assets/common.js (CJ_UTIL.isValidMYPhone) as defense-in-depth.
function isValidMYPhone(raw) {
  let s = String(raw || '').trim().replace(/[\s\-()]/g, '');
  if (!s) return false;
  if (s.startsWith('+60')) s = '0' + s.slice(3);
  else if (s.startsWith('60') && s.length > 9) s = '0' + s.slice(2);
  return /^0[1-9][0-9]{7,9}$/.test(s);
}

// Sentinel used by the WhatsApp quick-contact popup, which doesn't collect
// a phone number of its own (the conversation continues in WhatsApp).
const WHATSAPP_SENTINEL = '(via WhatsApp)';

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body) return jsonResponse({ error: 'Invalid JSON body' }, 400);

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const date = clean(body.date, 10);
  if (!name || !phone || !date) {
    return jsonResponse({ error: 'name, phone and date are required' }, 400);
  }
  if (phone !== WHATSAPP_SENTINEL && !isValidMYPhone(phone)) {
    return jsonResponse({ error: 'Please enter a valid Malaysian phone number' }, 400);
  }

  const slot = clean(body.slot, 20) || 'morning';
  const time = clean(body.time, 5);
  const service = clean(body.service, 120);
  const doctor = clean(body.doctor, 120);
  const notes = clean(body.notes, 1000);

  const res = await env.DB.prepare(
    `INSERT INTO appointments (name, phone, date, slot, time, service, doctor, notes, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`
  ).bind(name, phone, date, slot, time, service, doctor, notes, Date.now()).run();

  return jsonResponse({ ok: true, id: res.meta.last_row_id }, 201);
}
