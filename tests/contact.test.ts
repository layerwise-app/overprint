import { describe, expect, it } from 'vitest';
import { escapeHtml, LIMITS, validateContact, windowStart } from '~/lib/contact';

const good = { name: 'Ana', email: 'ana@example.com', message: 'A real question about a poster.' };

describe('validateContact', () => {
  it('accepts a good message and trims it', () => {
    const result = validateContact({ ...good, name: '  Ana  ' });
    expect(result).toEqual({ ok: true, data: good });
  });

  it('reports every missing field', () => {
    const result = validateContact({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name']);
  });

  it.each(['nope', 'a@b', 'a b@c.com', 'a@b.c', 'x@y..', 'a@b.com, c@d.com', 'a@b.com\nbcc:c@d.com'])(
    'rejects the address %s',
    (email) => {
      expect(validateContact({ ...good, email }).ok).toBe(false);
    }
  );

  it('rejects messages that are too short or too long', () => {
    expect(validateContact({ ...good, message: 'hi' }).ok).toBe(false);
    expect(validateContact({ ...good, message: 'x'.repeat(LIMITS.message + 1) }).ok).toBe(false);
  });

  it('removes line breaks from names, which end up in email subjects', () => {
    const result = validateContact({ ...good, name: 'Ana\r\nBcc: x@y.com' });
    expect(result.ok && result.data.name).toBe('Ana Bcc: x@y.com');
  });

  it('ignores non-string values', () => {
    expect(validateContact({ name: 1, email: {}, message: [] }).ok).toBe(false);
  });
});

describe('helpers', () => {
  it('escapes HTML in email bodies', () => {
    expect(escapeHtml('<img src="x">')).not.toContain('<');
  });
  it('rounds down to the start of the window', () => {
    expect(windowStart(1234, 600)).toBe(1200);
    expect(windowStart(1200, 600)).toBe(1200);
  });
});
