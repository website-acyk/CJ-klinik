import { jsonResponse, isAuthed } from '../../_utils.js';

export async function onRequestGet({ request, env }) {
  const loggedIn = await isAuthed(request, env);
  return jsonResponse({ loggedIn });
}
