import { jsonResponse, parseCookies, sessionCookieHeader, SESSION_TTL_MS } from '../../_utils.js';

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const expected = env.STAFF_PASSCODE;
  if (!expected) {
    return jsonResponse({ ok: false, error: 'Server is missing STAFF_PASSCODE configuration.' }, 500);
  }
  if (!body.passcode || body.passcode !== expected) {
    return jsonResponse({ ok: false, error: 'Incorrect passcode.' }, 401);
  }
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  await env.DB.prepare('INSERT INTO sessions (token, expires_at) VALUES (?, ?)').bind(token, expiresAt).run();
  return jsonResponse({ ok: true }, 200, {
    'Set-Cookie': sessionCookieHeader(token, Math.floor(SESSION_TTL_MS / 1000))
  });
}
