import { jsonResponse } from '../../_utils.js';

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const type = String(body.type || '').slice(0, 20);
  const message = String(body.message || '').slice(0, 2000);
  if (!type || !message) return jsonResponse({ error: 'type and message are required' }, 400);

  await env.DB.prepare(
    `INSERT INTO notice (id, type, message, updated_at) VALUES (1, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET type = excluded.type, message = excluded.message, updated_at = excluded.updated_at`
  ).bind(type, message, Date.now()).run();

  return jsonResponse({ ok: true });
}

export async function onRequestDelete({ env }) {
  await env.DB.prepare('UPDATE notice SET type = NULL, message = NULL, updated_at = ? WHERE id = 1').bind(Date.now()).run();
  return jsonResponse({ ok: true });
}
