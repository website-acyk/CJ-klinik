import { jsonResponse } from '../../_utils.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT day_key, staff FROM duty_roster ORDER BY sort_order').all();
  return jsonResponse({ roster: results });
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const dayKey = String(body.day_key || '');
  const allowed = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  if (!allowed.includes(dayKey)) return jsonResponse({ error: 'Unknown day_key' }, 400);
  const staff = String(body.staff || '').slice(0, 500);
  await env.DB.prepare('UPDATE duty_roster SET staff = ? WHERE day_key = ?').bind(staff, dayKey).run();
  return jsonResponse({ ok: true });
}
