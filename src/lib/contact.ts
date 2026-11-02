// Validation for the contact form. Shared by the browser and the server; the server
// runs it again on every request.

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITS = { name: 120, email: 254, message: 5000, messageMin: 10 };

// One @, a dot in the domain, no spaces or control characters.
const EMAIL = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:.]{2,}$/;

export function validateContact(raw: {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
  const name = clean(raw.name).replace(/[\r\n\t]+/g, ' ');
  const email = clean(raw.email);
  const message = clean(raw.message);
  const errors: ContactErrors = {};

  if (!name) errors.name = 'Add your name.';
  else if (name.length > LIMITS.name) errors.name = 'That name is too long.';

  if (!email) errors.email = 'Add an email address for the reply.';
  else if (email.length > LIMITS.email || !EMAIL.test(email)) {
    errors.email = 'That email address doesn’t look right.';
  }

  if (!message) errors.message = 'Write a message.';
  else if (message.length < LIMITS.messageMin) {
    errors.message = 'Say a little more, at least a sentence.';
  } else if (message.length > LIMITS.message) {
    errors.message = `Keep it under ${LIMITS.message} characters.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message } };
}

export const RATE_LIMIT = { max: 5, windowSeconds: 600 };

/** The start of the fixed window that `nowSeconds` falls in. */
export function windowStart(nowSeconds: number, windowSeconds = RATE_LIMIT.windowSeconds) {
  return nowSeconds - (nowSeconds % windowSeconds);
}

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
