import { jsonResponse, isAuthed } from '../../_utils.js';

// Guards every route under /api/staff/* — requires a valid session cookie.
export async function onRequest(context) {
  const ok = await isAuthed(context.request, context.env);
  if (!ok) return jsonResponse({ error: 'Unauthorized' }, 401);
  return context.next();
}
