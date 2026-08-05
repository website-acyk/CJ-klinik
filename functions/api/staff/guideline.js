import { jsonResponse } from '../../_utils.js';

export async function onRequestGet({ env }) {
  const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'guideline_doc_url'").first();
  return jsonResponse({ url: row ? row.value : '' });
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const url = String(body.url || '').slice(0, 2000);
  await env.DB.prepare(
    `INSERT INTO settings (key, value) VALUES ('guideline_doc_url', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).bind(url).run();
  return jsonResponse({ ok: true });
}
