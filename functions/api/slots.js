import { jsonResponse } from '../_utils.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');
  if (!date) return jsonResponse({ error: 'date query parameter is required' }, 400);

  const { results } = await env.DB.prepare(
    'SELECT doctor_id, morning, afternoon FROM doctor_slots WHERE date = ?'
  ).bind(date).all();

  const slots = {};
  for (const r of results) {
    slots[r.doctor_id] = { morning: !!r.morning, afternoon: !!r.afternoon };
  }
  return jsonResponse({ date, slots });
}
