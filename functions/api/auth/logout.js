import { jsonResponse, parseCookies, SESSION_COOKIE } from '../../_utils.js';

export async function onRequestPost({ request, env }) {
  const cookies = parseCookies(request.headers.get('Cookie'));
  const token = cookies[SESSION_COOKIE];
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
  return jsonResponse({ ok: true }, 200, {
    'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  });
}
