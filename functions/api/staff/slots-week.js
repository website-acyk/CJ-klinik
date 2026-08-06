import { jsonResponse } from '../../_utils.js';

function addDaysISO(iso, n){
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const start = url.searchParams.get('start');
  if (!start) return jsonResponse({ error: 'start query parameter is required' }, 400);
  const end = addDaysISO(start, 6);

  const { results } = await env.DB.prepare(
    'SELECT doctor_id, date, morning, afternoon FROM doctor_slots WHERE date >= ? AND date <= ?'
  ).bind(start, end).all();

  const entries = results.map(r => ({
    doctorId: r.doctor_id,
    date: r.date,
    morning: !!r.morning,
    afternoon: !!r.afternoon
  }));

  return jsonResponse({ start, end, entries });
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const entries = Array.isArray(body.entries) ? body.entries : [];
  if (!entries.length) return jsonResponse({ error: 'entries array is required' }, 400);

  const stmts = entries
    .filter(e => e && e.doctorId && e.date)
    .map(e => env.DB.prepare(
      `INSERT INTO doctor_slots (doctor_id, date, morning, afternoon) VALUES (?, ?, ?, ?)
       ON CONFLICT(doctor_id, date) DO UPDATE SET morning = excluded.morning, afternoon = excluded.afternoon`
    ).bind(e.doctorId, e.date, e.morning ? 1 : 0, e.afternoon ? 1 : 0));

  if (!stmts.length) return jsonResponse({ error: 'no valid entries provided' }, 400);

  await env.DB.batch(stmts);

  return jsonResponse({ ok: true, count: stmts.length });
}
