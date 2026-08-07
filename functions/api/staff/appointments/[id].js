import { jsonResponse } from '../../../_utils.js';

const ALLOWED_STATUSES = ['new', 'confirmed', 'declined'];

export async function onRequestPatch({ request, env, params }) {
  const body = await request.json().catch(() => ({}));
  if (!ALLOWED_STATUSES.includes(body.status)) {
    return jsonResponse({ error: 'status must be one of: ' + ALLOWED_STATUSES.join(', ') }, 400);
  }
  await env.DB.prepare('UPDATE appointments SET status = ? WHERE id = ?').bind(body.status, params.id).run();
  return jsonResponse({ ok: true });
}
