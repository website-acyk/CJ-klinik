import { jsonResponse } from '../_utils.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');
  if (!date) return jsonResponse({ error: 'date query parameter is required' }, 400);

  const { results } = await env.DB.prepare(
    "SELECT time FROM appointments WHERE date = ? AND time IS NOT NULL AND time != ''"
  ).bind(date).all();

  const times = results.map(r => r.time);
  return jsonResponse({ date, times });
}
