import { jsonResponse } from '../_utils.js';

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
