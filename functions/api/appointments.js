import { jsonResponse } from '../_utils.js';

function clean(v, maxLen) {
  return String(v == null ? '' : v).trim().slice(0, maxLen);
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body) return jsonResponse({ error: 'Invalid JSON body' }, 400);

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const date = clean(body.date, 10);
  if (!name || !phone || !date) {
    return jsonResponse({ error: 'name, phone and date are required' }, 400);
  }

  const slot = clean(body.slot, 20) || 'morning';
  const service = clean(body.service, 120);
  const doctor = clean(body.doctor, 120);
  const notes = clean(body.notes, 1000);

  const res = await env.DB.prepare(
    `INSERT INTO appointments (name, phone, date, slot, service, doctor, notes, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`
  ).bind(name, phone, date, slot, service, doctor, notes, Date.now()).run();

  return jsonResponse({ ok: true, id: res.meta.last_row_id }, 201);
}
