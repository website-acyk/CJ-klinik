import { jsonResponse } from '../../_utils.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT key, url FROM sheet_links').all();
  const links = {};
  results.forEach((r) => { links[r.key] = r.url; });
  return jsonResponse({ links });
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const key = String(body.key || '');
  const allowed = ['tpa', 'labtest', 'preorder', 'weightloss', 'tpaprice'];
  if (!allowed.includes(key)) return jsonResponse({ error: 'Unknown sheet key' }, 400);
  const url = String(body.url || '').slice(0, 2000);
  await env.DB.prepare('UPDATE sheet_links SET url = ? WHERE key = ?').bind(url, key).run();
  return jsonResponse({ ok: true });
}
