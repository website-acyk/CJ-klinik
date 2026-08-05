import { jsonResponse } from '../_utils.js';

export async function onRequestGet({ env }) {
  const row = await env.DB.prepare('SELECT type, message FROM notice WHERE id = 1').first();
  const notice = row && row.type ? { type: row.type, message: row.message } : null;
  return jsonResponse({ notice });
}
