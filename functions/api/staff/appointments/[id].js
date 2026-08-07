import { jsonResponse } from '../../../_utils.js';

const ALLOWED_STATUSES = ['new', 'confirmed', 'declined'];

export async function onRequestPatch({ request, env, params }) {
  const body = await request.json().catch(() => ({}));
  if (!ALLOWED_STATUSES.includes(body.status)) {
    return jsonResponse({ error: 'status must be one of: ' + ALLOWED_STATUSES.join(', ') }, 400);
  }
  await env.DB.prepare('UPDATE appointments SET status = ? WHERE id = ?').bind(body.status, params.id).run();

  if (body.status === 'confirmed') {
    // Fire-and-forget: a notification failure should never block the confirm action itself.
    notifyCustomerConfirmed(env, params.id).catch(() => {});
  }

  return jsonResponse({ ok: true });
}

// Emails the customer once their appointment is confirmed. This is a stub —
// it no-ops until an email provider is configured, so it's safe to ship
// ahead of that setup.
//
// To activate once you have a provider (e.g. Resend) and a verified sending
// domain:
//   1. Set the RESEND_API_KEY secret: wrangler pages secret put RESEND_API_KEY
//   2. Replace the "not configured yet" return below with the real fetch()
//      call (a commented-out example is included).
//   3. Make sure the `email` column exists on `appointments` (see
//      db/schema.sql) — the try/catch below already tolerates it being
//      absent, so nothing breaks either way.
async function notifyCustomerConfirmed(env, id) {
  if (!env.RESEND_API_KEY) return; // not configured yet — no-op

  let row;
  try {
    row = await env.DB.prepare(
      'SELECT name, email, date, time, service FROM appointments WHERE id = ?'
    ).bind(id).first();
  } catch (e) {
    return; // e.g. the `email` column doesn't exist yet — nothing to send
  }
  if (!row || !row.email) return;

  // Example send call — uncomment and adjust once RESEND_API_KEY is set and
  // a sending domain is verified with the provider:
  //
  // await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${env.RESEND_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     from: 'CJ Klinik <appointments@yourdomain.com>',
  //     to: row.email,
  //     subject: 'Your CJ Klinik appointment is confirmed',
  //     text: `Hi ${row.name}, your appointment on ${row.date} at ${row.time || ''} ` +
  //           `(${row.service || 'General'}) has been confirmed. See you soon!`
  //   })
  // });
}
