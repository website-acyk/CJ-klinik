import { jsonResponse } from '../../_utils.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT * FROM appointments ORDER BY id DESC').all();
  return jsonResponse({ appointments: results });
}
