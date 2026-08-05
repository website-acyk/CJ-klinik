import { jsonResponse } from '../../../_utils.js';

export async function onRequestPatch({ request, env, params }) {
  const body = await request.json().catch(() => ({}));
  const status = body.status === 'confirmed' ? 'confirmed' : 'new';
  await env.DB.prepare('UPDATE appointments SET status = ? WHERE id = ?').bind(status, params.id).run();
  return jsonResponse({ ok: true });
}
