import { jsonResponse } from '../_utils.js';

// Malaysia is fixed UTC+8, no DST.
const MY_TZ_OFFSET_MS = 8 * 60 * 60 * 1000;

function myDateStr(ms) {
  return new Date(ms + MY_TZ_OFFSET_MS).toISOString().slice(0, 10);
}

export async function onRequestGet({ env }) {
  const row = await env.DB.prepare('SELECT type, message, updated_at FROM notice WHERE id = 1').first();
  // Both notice templates are day-specific ("Resting Today", "Not Open Today"),
  // so once the calendar day has rolled over, a forgotten notice should stop
  // showing even if staff never clicked "Clear Notice".
  const isStale = row && row.updated_at && myDateStr(row.updated_at) !== myDateStr(Date.now());
  const notice = row && row.type && !isStale ? { type: row.type, message: row.message } : null;
  return jsonResponse({ notice });
}
