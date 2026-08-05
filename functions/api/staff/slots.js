import { jsonResponse } from '../../_utils.js';

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const { date, doctorId } = body;
  if (!date || !doctorId) return jsonResponse({ error: 'date and doctorId are required' }, 400);
  const morning = body.morning ? 1 : 0;
  const afternoon = body.afternoon ? 1 : 0;

  await env.DB.prepare(
    `INSERT INTO doctor_slots (doctor_id, date, morning, afternoon) VALUES (?, ?, ?, ?)
     ON CONFLICT(doctor_id, date) DO UPDATE SET morning = excluded.morning, afternoon = excluded.afternoon`
  ).bind(doctorId, date, morning, afternoon).run();

  return jsonResponse({ ok: true });
}
