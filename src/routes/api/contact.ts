import { createFileRoute } from '@tanstack/react-router';
import { env } from 'cloudflare:workers';
import { eq, lt, sql } from 'drizzle-orm';
import { db } from '~/db';
import { contactMessages, contactRateLimits } from '~/db/schema';
import { escapeHtml, RATE_LIMIT, validateContact, windowStart, type ContactInput } from '~/lib/contact';
import { portfolio } from '~/portfolio.config';

const MAX_BODY = 32 * 1024;

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: ({ request }) => handle(request),
      GET: () => new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } })
    }
  }
});

async function handle(request: Request) {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const reply = (status: number, body: object, redirect: string) =>
    wantsJson
      ? Response.json(body, { status })
      : new Response(null, { status: 303, headers: { location: redirect } });

  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) {
    return reply(413, { ok: false }, '/contact?invalid=1');
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, { ok: false }, '/contact?invalid=1');
  }

  // Bots fill in everything. Tell them it worked and keep nothing.
  if (String(form.get('website') ?? '').trim() !== '') {
    return reply(200, { ok: true }, '/contact?sent=1');
  }

  const checked = validateContact({
    name: form.get('name'),
    email: form.get('email'),
    message: form.get('message')
  });
  if (!checked.ok) {
    return reply(422, { ok: false, errors: checked.errors }, '/contact?invalid=1');
  }

  if (await isRateLimited(request)) {
    return reply(429, { ok: false, limited: true }, '/contact?limited=1');
  }

  const [saved] = await db
    .insert(contactMessages)
    .values(checked.data)
    .returning({ id: contactMessages.id });

  const emailStatus = await emailOwner(checked.data);
  if (emailStatus !== 'skipped') {
    await db
      .update(contactMessages)
      .set({ emailStatus })
      .where(eq(contactMessages.id, saved.id));
  }

  return reply(200, { ok: true }, '/contact?sent=1');
}

/** Counts this sender's message and reports whether they have gone over the limit. */
async function isRateLimited(request: Request) {
  // Cloudflare sets this header and clients can't override it. Local previews share a bucket.
  const ip = request.headers.get('cf-connecting-ip') ?? 'local';
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`overprint-contact:${ip}`)
  );
  const key = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  const now = Math.floor(Date.now() / 1000);
  const start = windowStart(now);

  const [row] = await db
    .insert(contactRateLimits)
    .values({ key, windowStart: start, count: 1 })
    .onConflictDoUpdate({
      target: contactRateLimits.key,
      set: {
        count: sql`CASE WHEN ${contactRateLimits.windowStart} = ${start} THEN ${contactRateLimits.count} + 1 ELSE 1 END`,
        windowStart: start
      }
    })
    .returning({ count: contactRateLimits.count });

  // Keep the table small: forget senders from earlier windows.
  await db
    .delete(contactRateLimits)
    .where(lt(contactRateLimits.windowStart, start - RATE_LIMIT.windowSeconds));

  return row.count > RATE_LIMIT.max;
}

async function emailOwner({ name, email, message }: ContactInput) {
  const to = portfolio.ownerEmail.trim();
  if (!to) return 'skipped';
  const { error } = await env.EMAIL.send({
    to,
    replyTo: email,
    subject: `New message from ${name}`.slice(0, 200),
    text: `${name} <${email}> wrote:\n\n${message}\n\nReply to this email to answer them.`,
    html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt; wrote:</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p><p>Reply to this email to answer them.</p>`
  });
  if (error) {
    console.warn(`[contact] email not sent: ${error.code} ${error.message}`);
    return 'failed';
  }
  return 'sent';
}
